import { BigNumber, Contract } from "ethers";
import deployedContracts from "~~/generated/deployedContracts";
import { fetchFromIpfs } from "~~/utils/flipper/ipfs";

export interface NFT {
  contract: string;
  tokenId: number;
  image?: string;
  selected?: boolean;
}

export const getPlayerStake = async (
  flipper: Contract,
  nftContract: Contract,
  player: string,
  matchId: string,
): Promise<NFT[]> => {
  let stakeResponse = await flipper.getPlayerStake(player, matchId);

  const stake = [] as NFT[];
  for (let i = 0; i < stakeResponse.length; i++) {
    const nft: NFT = {
      contract: stakeResponse[i].contractAddress as string,
      tokenId: stakeResponse[i].id?.toNumber() as number,
    };

    try {
      nft.image = await getNFTImage(nftContract, BigNumber.from(nft.tokenId));
    } catch (err) {
      console.error("Error fetching NFT's image: ", err);
    }

    stake.push(nft);
  }

  return stake;
};

export const getNFTImage = async (contract: Contract, tokenId: BigNumber): Promise<string> => {
  const metadata = await contract?.tokenURI(tokenId);
  return await fetchFromIpfs(metadata.substring(7));
};

export const getUserNFTs = async (contract: Contract, user: string): Promise<NFT[]> => {
  if (!contract) {
    return [];
  }

  const tokenIds = await contract?.getOwnerTokens(user);
  const nfts = [];
  for (let i = 0; i < tokenIds.length; i++) {
    const image = await getNFTImage(contract, tokenIds[i]);

    nfts.push({
      contract: contract.address,
      tokenId: tokenIds[i],
      image: image,
      selected: false,
    });
  }

  return nfts;
};
