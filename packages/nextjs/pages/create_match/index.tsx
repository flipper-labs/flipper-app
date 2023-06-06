import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { socket } from "../../services/socket";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { NFTGrid } from "~~/components/NFTGrid";
import { ActionButton } from "~~/components/misc/buttons/ActionButton";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { NFT, getNFTImage } from "~~/models/nfts";

const CreateMatch: NextPage = () => {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const { data: nftContract } = useScaffoldContract({
    contractName: "MockERC721",
  });

  useEffect(() => {
    (async () => {
      if (nftContract) {
        const tokenIds = await nftContract?.getOwnerTokens(address);
        const newNft = [];
        for (let i = 0; i < tokenIds.length; i++) {
          const image = await getNFTImage(nftContract, tokenIds[i]);

          newNft.push({
            contract: nftContract.address,
            tokenId: tokenIds[i],
            image: image,
            selected: false,
          });
        }
        setNfts(newNft);
      }
    })();
  }, [address]);

  const handleClick = () => {
    const mynfts = [];
    for (let i = 0; i < nfts.length; i++) {
      if (nfts[i].selected) {
        mynfts.push(nfts[i]);
      }
    }

    socket.emit("match:create", {
      creator: {
        wallet: address,
        nfts: mynfts,
      },
      gamemode: "Winner Takes All",
    });
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col pt-10 gap-4 w-full">
        <div className="text-header">Pick the NFTs</div>
        <NFTGrid nfts={nfts} setNfts={setNfts}></NFTGrid>
        <div className="mt-3">
          <Link href="/create_match/match_lobby">
            <ActionButton
              action="Create Match"
              color="white"
              iconToRight={false}
              background="#F050F2"
              paddingX={3}
              paddingY={1}
              onClick={handleClick}
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default CreateMatch;
