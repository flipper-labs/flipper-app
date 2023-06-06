import { BigNumber, Contract } from "ethers";
import deployedContracts from "~~/generated/deployedContracts";
import { fetchFromIpfs } from "~~/utils/flipper/ipfs";

export interface NFT {
  contract: string;
  tokenId: number;
  image?: string;
  selected?: boolean;
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
      nft.image = await getNFTImage(contracts.get(nft.contract) as Contract, BigNumber.from(nft.tokenId));
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
  console.log("INSIDE GET")
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
