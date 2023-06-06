import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { ActionButton } from "~~/components/misc/buttons/ActionButton";
import { NFTGrid } from "~~/components/NFTGrid";
import imageUrl from "~~/public/nftImages/robbotNFT.png"

const CreateMatch: NextPage = () => {
  const nfts: Array<any> = [
    {
        imageUrl: imageUrl,
        selected: false,
    },
    {
        imageUrl: imageUrl,
        selected: false,
    },
    {
        imageUrl: imageUrl,
        selected: false,
    },
    {
        imageUrl: imageUrl,
        selected: false,
    },
    {
        imageUrl: imageUrl,
        selected: false,
    },
    {
        imageUrl: imageUrl,
        selected: false,
    },
    {
        imageUrl: imageUrl,
        selected: false,
    },
    {
        imageUrl: imageUrl,
        selected: false,
    },
    {
        imageUrl: imageUrl,
        selected: false,
    },
    {
        imageUrl: imageUrl,
        selected: false,
    }
  ]
  return (
    <>
      <div className="flex justify-center items-center flex-col pt-10 gap-4 w-full">
        <div className="text-header">Pick the NFTs</div>
        <NFTGrid nfts={nfts}></NFTGrid>
        <div className="mt-3">
          <Link href="/create_match/match_lobby">
            <ActionButton
              action="Create Match"
              color="white"
              iconToRight={false}
              background="#F050F2"
              paddingX={3}
              paddingY={1}
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default CreateMatch;
