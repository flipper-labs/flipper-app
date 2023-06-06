import { BigNumber, Contract } from "ethers";
import deployedContracts from "~~/generated/deployedContracts";
import { fetchFromIpfs } from "~~/utils/flipper/ipfs";

export interface NFT {
  contract: string;
  tokenId: number;
  image?: string;
}

const contracts = new Map<string, Contract>();

export const getPlayerStake = async (
  flipper: Contract,
  player: string,
  matchId: string,
  provider: any,
): Promise<NFT[]> => {
  let stakeResponse = await flipper.getPlayerStake(player, matchId);

  const stake = [] as NFT[];
  for (let i = 0; i < stakeResponse.length; i++) {
    const nft: NFT = {
      contract: stakeResponse[i].contractAddress as string,
      tokenId: stakeResponse[i].id?.toNumber() as number,
    };

    // Get image of the NFT
    if (!contracts.has(nft.contract)) {
      const contract: Contract = new Contract(
        nft.contract,
        deployedContracts[31337][0].contracts.MockERC721.abi,
        provider,
      ); // TODO: change 31337 to chainId
      contracts.set(nft.contract, contract);
    }

    try {
      const metadata = await contracts.get(nft.contract)?.tokenURI(BigNumber.from(nft.tokenId));
      const image = await fetchFromIpfs(metadata.substring(7));
      nft.image = image;
    } catch (err) {
      console.error("Error fetching NFT's image: ", err);
    }

    stake.push(nft);
  }

  return stake;
};
