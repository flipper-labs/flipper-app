const { randomUUID } = require("crypto");
const { ethers } = require("hardhat");
const { expect } = require("chai");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

const { networkConfig } = require("./../helper-hardhat-config");

describe("Flipper - Direct Funding", () => {
    const BigNumber = ethers.BigNumber;
    const pointOneLink = BigNumber.from("100000000000000000"); // 0.1
    const pointZeroZeroThreeLink = BigNumber.from("3000000000000000"); // 0.003
    const oneHundredLink = BigNumber.from("100000000000000000000"); // 100 LINK
    const oneHundredGwei = BigNumber.from("100000000000");

    // Configuration

    // This value is the worst-case gas overhead from the wrapper contract under the following
    // conditions, plus some wiggle room:
    //  - 10 words requested
    //  - Refund issued to consumer
    const wrapperGasOverhead = BigNumber.from(60_000);
    const coordinatorGasOverhead = BigNumber.from(52_000);
    const wrapperPremiumPercentage = 3;
    const maxNumWords = 3;
    const weiPerUnitLink = pointZeroZeroThreeLink;
    const flatFee = pointOneLink;
    const gasLimit = 300_000;

    const fund = async (link, linkOwner, receiver, amount) => {
        await expect(link.connect(linkOwner).transfer(receiver, amount)).to.not.be.reverted;
    };

    // This should match implementation in VRFV2Wrapper::calculateGasPriceInternal
    const calculatePrice = (
        _gasLimit = gasLimit,
        _wrapperGasOverhead = wrapperGasOverhead,
        _coordinatorGasOverhead = coordinatorGasOverhead,
        _gasPriceWei = oneHundredGwei,
        _weiPerUnitLink = weiPerUnitLink,
        _wrapperPremium = wrapperPremiumPercentage,
        _flatFee = flatFee,
    ) => {
        const totalGas = BigNumber.from(0)
            .add(_gasLimit)
            .add(_wrapperGasOverhead)
            .add(_coordinatorGasOverhead);
        const baseFee = BigNumber.from("1000000000000000000")
            .mul(_gasPriceWei)
            .mul(totalGas)
            .div(_weiPerUnitLink);
        const withPremium = baseFee.mul(BigNumber.from(100).add(_wrapperPremium)).div(100);
        return withPremium.add(_flatFee);
    };

    const deployRandomNumberConsumerFixture = async () => {
        const [owner, consumerOwner, player1, player2] = await ethers.getSigners();

        const chainId = network.config.chainId;

        // Coordinator - bridge between oracle nodes and the blockchain itself
        const coordinatorFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock", owner);
        const coordinator = await coordinatorFactory.deploy(
            pointOneLink, // baseFee - 0.1 LINK
            1e9, // gasPriceLink - 0.000000001 LINK per gas unit
        );

        // Aggregator - calculates the ETH payment required for VRF requests
        const linkEthFeedFactory = await ethers.getContractFactory("MockV3Aggregator", owner);
        const linkEthFeed = await linkEthFeedFactory.deploy(18, weiPerUnitLink); // 1 LINK = 0.003 ETH

        const linkFactory = await ethers.getContractFactory("LinkToken", owner);
        const link = await linkFactory.deploy();

        // VRFV2Wrapper - bridge between VRF coordinator and consumer contract
        const wrapperFactory = await ethers.getContractFactory("VRFV2Wrapper", owner);
        const wrapper = await wrapperFactory.deploy(
            link.address,
            linkEthFeed.address,
            coordinator.address,
        );

        // VRF consumer contract
        const consumerFactory = await ethers.getContractFactory("Flipper", consumerOwner);
        const consumer = await consumerFactory.deploy(
            link.address,
            wrapper.address,
            BigNumber.from(gasLimit), // TODO: arbitrary value, update
            1800, // TODO: 30 minutes
        );

        // configure wrapper
        const keyHash =
            networkConfig[chainId]["keyHash"] ||
            "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";

        await wrapper
            .connect(owner)
            .setConfig(
                wrapperGasOverhead,
                coordinatorGasOverhead,
                wrapperPremiumPercentage,
                keyHash,
                maxNumWords,
            );

        // fund subscription. The Wrapper's subscription id is 1
        // coordinator will then request these tokens from the wrapper when paying for oracle services
        await coordinator.connect(owner).fundSubscription(1, oneHundredLink);

        // Deploy an ERC721 collection to mock users' collections and their NFTs
        const mockERC721Factory = await ethers.getContractFactory("MockERC721", owner);
        const mockERC721 = await mockERC721Factory.deploy();

        // Mint NFTs to users
        await mockERC721.connect(owner).safeMint(player1.address);
        await mockERC721.connect(owner).safeMint(player2.address);
        expect(await mockERC721.balanceOf(player1.address)).to.equal(1);
        expect(await mockERC721.balanceOf(player2.address)).to.equal(1);

        return {
            coordinator,
            wrapper,
            consumer,
            link,
            owner,
            consumerOwner,
            player1,
            player2,
            mockERC721,
        };
    };

    describe("createMatch", () => {
        describe("success", () => {
            it("should succesfully create a match and reach out to the VRF", async () => {
                const {
                    consumer,
                    wrapper,
                    coordinator,
                    link,
                    owner,
                    player1,
                    player2,
                    mockERC721,
                } = await loadFixture(deployRandomNumberConsumerFixture);
                await fund(link, owner, consumer.address, oneHundredLink);
                const price = calculatePrice(gasLimit);

                // estimate price from wrapper side
                const estimatedWrapperPrice = await wrapper.calculateRequestPrice(gasLimit, {
                    gasPrice: oneHundredGwei,
                });
                expect(price).to.eq(estimatedWrapperPrice);

                // ~~~ Create a match
                const matchId = randomUUID();
                const newMatch = {
                    timestamp: BigNumber.from(0),
                    player1: player1.address,
                    player1Stake: [
                        {
                            contractAddress: mockERC721.address,
                            id: BigNumber.from(0),
                        },
                    ],
                    player2: player2.address,
                    player2Stake: [
                        {
                            contractAddress: mockERC721.address,
                            id: BigNumber.from(1),
                        },
                    ],
                    winner: ethers.constants.AddressZero,
                    gamemode: "",
                    isSettled: false,
                };

                await expect(consumer.connect(player1).createMatch(matchId, newMatch)).to.emit(
                    consumer,
                    "MatchCreated",
                );

                // ~~~ Players locking their tokens
                await mockERC721
                    .connect(player1)
                    .transferFrom(player1.address, consumer.address, 0);
                await mockERC721
                    .connect(player2)
                    .transferFrom(player2.address, consumer.address, 1);

                // ~~~ Start a match
                await expect(consumer.connect(player2).startMatch(matchId)).to.emit(
                    coordinator,
                    "RandomWordsRequested",
                );

                const _match = await consumer.matches(matchId);

                expect(_match.player1).to.equal(player1.address);
                expect(_match.player2).to.equal(player2.address);
                expect(_match.winner).to.equal(ethers.constants.AddressZero);

                // Check NFT balances
                expect(await mockERC721.balanceOf(player1.address)).to.equal(0);
                expect(await mockERC721.balanceOf(player2.address)).to.equal(0);
                expect(await mockERC721.balanceOf(consumer.address)).to.equal(2);

                // ~~~ Simulate VRF fulfillment with mock randomness
                const requestId = await consumer.randomnessRequestsMatchToRequest(matchId);
                const randomness = [123]; // player 2 will win due to 123 % 2 == 1 (logic is hardcoded for now)
                const winner = player2.address;

                // fulfill the request (simulation)
                await expect(
                    coordinator
                        .connect(owner)
                        .fulfillRandomWordsWithOverride(requestId, wrapper.address, randomness, {
                            gasLimit: gasLimit * 100,
                        }),
                )
                    .to.emit(coordinator, "RandomWordsFulfilled")
                    .to.emit(consumer, "MatchCompleted");

                // ~~~ Complete the match
                // fulfillRandomWords should have already been called at this point by the coordinator
                const _matchCompleted = await consumer.matches(matchId);
                expect(_matchCompleted.winner).to.equal(winner);
                expect(_matchCompleted.isSettled).to.equal(true);

                expect(await consumer.matchesRandomness(matchId, 0)).to.equal(randomness[0]);

                expect(await mockERC721.balanceOf(consumer.address)).to.equal(BigNumber.from(0));
                expect(await mockERC721.balanceOf(player2.address)).to.equal(BigNumber.from(2));
            });
        });

        describe("failure", () => {
            describe("Player 1 provides stake while player 2 does not", () => {
                it("should fail (every player must stake)", async () => {
                    const {
                        consumer,
                        wrapper,
                        coordinator,
                        link,
                        owner,
                        consumerOwner,
                        player1,
                        player2,
                        mockERC721,
                    } = await loadFixture(deployRandomNumberConsumerFixture);
                    await fund(link, owner, consumer.address, oneHundredLink);
                    const price = calculatePrice(gasLimit);

                    // estimate price from wrapper side
                    const estimatedWrapperPrice = await wrapper.calculateRequestPrice(gasLimit, {
                        gasPrice: oneHundredGwei,
                    });
                    expect(price).to.eq(estimatedWrapperPrice);

                    // ~~~ Create a match
                    const matchId = randomUUID();
                    const newMatch = {
                        timestamp: BigNumber.from(0),
                        player1: player1.address,
                        player1Stake: [
                            {
                                contractAddress: mockERC721.address,
                                id: BigNumber.from(0),
                            },
                        ],
                        player2: player2.address,
                        player2Stake: [],
                        winner: ethers.constants.AddressZero,
                        gamemode: "",
                        isSettled: false,
                    };

                    const player2Balance = await mockERC721.balanceOf(player2.address);
                    console.log("Player2 balance: ", player2Balance);

                    await expect(consumer.connect(consumerOwner).createMatch(matchId, newMatch)).to
                        .be.reverted;
                });
            });
        });
    });

    describe("claim tokens", () => {
        describe("success", () => {
            it("should allow users to claim their tokens after match start window has passed", async () => {
                const { consumer, consumerOwner, player1, player2, mockERC721 } = await loadFixture(
                    deployRandomNumberConsumerFixture,
                );

                // ~~~ Create a match
                const matchId = randomUUID();
                const newMatch = {
                    timestamp: BigNumber.from(0),
                    player1: player1.address,
                    player1Stake: [
                        {
                            contractAddress: mockERC721.address,
                            id: BigNumber.from(0),
                        },
                    ],
                    player2: player2.address,
                    player2Stake: [
                        {
                            contractAddress: mockERC721.address,
                            id: BigNumber.from(1),
                        },
                    ],
                    winner: ethers.constants.AddressZero,
                    gamemode: "",
                    isSettled: false,
                };

                await expect(consumer.connect(player1).createMatch(matchId, newMatch)).to.emit(
                    consumer,
                    "MatchCreated",
                );

                await mockERC721
                    .connect(player1)
                    .transferFrom(player1.address, consumer.address, 0);

                const matchStartWindowSeconds = 10;
                await consumer
                    .connect(consumerOwner)
                    .setMatchStartWindow(BigNumber.from(matchStartWindowSeconds));

                await time.increase(time.duration.seconds(matchStartWindowSeconds + 1));

                await expect(consumer.connect(player1).claimTokens(matchId)).to.not.be.reverted;
            });
        });

        describe("failure", () => {
            it("should not allow random users to claim tokens", async () => {
                const { consumer, player1, player2, owner, mockERC721 } = await loadFixture(
                    deployRandomNumberConsumerFixture,
                );

                // ~~~ Create a match
                const matchId = randomUUID();
                const newMatch = {
                    timestamp: BigNumber.from(0),
                    player1: player1.address,
                    player1Stake: [
                        {
                            contractAddress: mockERC721.address,
                            id: BigNumber.from(0),
                        },
                    ],
                    player2: player2.address,
                    player2Stake: [
                        {
                            contractAddress: mockERC721.address,
                            id: BigNumber.from(1),
                        },
                    ],
                    winner: ethers.constants.AddressZero,
                    gamemode: "",
                    isSettled: false,
                };

                await expect(consumer.connect(player1).createMatch(matchId, newMatch)).to.emit(
                    consumer,
                    "MatchCreated",
                );

                await expect(consumer.connect(owner).claimTokens(matchId)).to.be.reverted;
            });

            it("should not allow users to claim tokens before the start match window has passed", async () => {
                const { consumer, consumerOwner, player1, player2, mockERC721 } = await loadFixture(
                    deployRandomNumberConsumerFixture,
                );

                // ~~~ Create a match
                const matchId = randomUUID();
                const newMatch = {
                    timestamp: BigNumber.from(0),
                    player1: player1.address,
                    player1Stake: [
                        {
                            contractAddress: mockERC721.address,
                            id: BigNumber.from(0),
                        },
                    ],
                    player2: player2.address,
                    player2Stake: [
                        {
                            contractAddress: mockERC721.address,
                            id: BigNumber.from(1),
                        },
                    ],
                    winner: ethers.constants.AddressZero,
                    gamemode: "",
                    isSettled: false,
                };

                await expect(consumer.connect(player1).createMatch(matchId, newMatch)).to.emit(
                    consumer,
                    "MatchCreated",
                );

                const matchStartWindowSeconds = 30000;
                await consumer
                    .connect(consumerOwner)
                    .setMatchStartWindow(BigNumber.from(matchStartWindowSeconds));

                await expect(consumer.connect(player1).claimTokens(matchId)).to.be.reverted;
            });
        });
    });
});
