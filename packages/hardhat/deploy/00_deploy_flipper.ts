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
  const { deploy } = hre.deployments;

  const pointOneLink = BigNumber.from("100000000000000000");
  const gasLimit = 300_000;
  const pointZeroZeroThreeLink = BigNumber.from("3000000000000000");

  const VRFCoordinatorV2Mock = await deploy("VRFCoordinatorV2Mock", {
    from: deployer,
    // Contract constructor arguments
    args: [pointOneLink, 1e9],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const mockV3Aggregator = await deploy("MockV3Aggregator", {
    from: deployer,
    args: [18, pointZeroZeroThreeLink],
    log: true,
    autoMine: true,
  });

  const linkToken = await deploy("LinkToken", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const VRFV2Wrapper = await deploy("VRFV2Wrapper", {
    from: deployer,
    args: [linkToken.address, mockV3Aggregator.address, VRFCoordinatorV2Mock.address],
    log: true,
    autoMine: true,
  });

  await deploy("Flipper", {
    from: deployer,
    args: [linkToken.address, VRFV2Wrapper.address, BigNumber.from(gasLimit)],
    log: true,
    autoMine: true,
  });
};

export default deployFlipper;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployFlipper.tags = ["Flipper"];
