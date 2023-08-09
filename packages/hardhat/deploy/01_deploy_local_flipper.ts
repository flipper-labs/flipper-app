import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { BigNumber } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployFlipper: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, execute } = hre.deployments;

  const flipper = await deploy("Flipper", {
    from: deployer,
    args: [BigNumber.from(1800)],
    log: true,
    autoMine: true,
  });
  const erc721collection = await deploy("MockERC721", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("Flipper contract: ", flipper.address)
  console.log("Erc721 collection: ", erc721collection.address)

  await execute(
    "MockERC721",
    { from: deployer, log: true, autoMine: true },
    "safeMint",
    "0x68a87aecafa6bc424A8083FF0bE90d20Eb97a015", // 0
  );
  await execute(
    "MockERC721",
    { from: deployer, log: true, autoMine: true },
    "safeMint",
    "0x68a87aecafa6bc424A8083FF0bE90d20Eb97a015", // 1
  );
  await execute(
    "MockERC721",
    { from: deployer, log: true, autoMine: true },
    "safeMint",
    "0x68a87aecafa6bc424A8083FF0bE90d20Eb97a015", // 2
  );
  await execute(
    "MockERC721",
    { from: deployer, log: true, autoMine: true },
    "safeMint",
    "0x68a87aecafa6bc424A8083FF0bE90d20Eb97a015", // 3
  );

  await execute(
    "MockERC721",
    { from: deployer, log: true, autoMine: true },
    "safeMint",
    "0x69ddB6f5Bd2d92C397Db173b98FF6dEEF204A3bB", // 4
  );
  await execute(
    "MockERC721",
    { from: deployer, log: true, autoMine: true },
    "safeMint",
    "0x69ddB6f5Bd2d92C397Db173b98FF6dEEF204A3bB", // 5
  );
  await execute(
    "MockERC721",
    { from: deployer, log: true, autoMine: true },
    "safeMint",
    "0x69ddB6f5Bd2d92C397Db173b98FF6dEEF204A3bB", // 6
  );
  await execute(
    "MockERC721",
    { from: deployer, log: true, autoMine: true },
    "safeMint",
    "0x69ddB6f5Bd2d92C397Db173b98FF6dEEF204A3bB", // 7
  );
};

export default deployFlipper;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployFlipper.tags = ["Flipper"];
