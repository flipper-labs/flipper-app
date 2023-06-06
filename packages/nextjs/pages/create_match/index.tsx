import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import robbotNFT from "~~/public/nftImages/robbotNFT.png"
import { ActionButton } from "~~/components/misc/buttons/ActionButton";
import { NFTGrid } from "~~/components/NFTGrid";

const CreateMatch: NextPage = () => {

  return (
    <>
      <div className="flex justify-center items-center flex-col pt-10 gap-4 w-full">
        <div className="text-header">Pick the NFTs</div>
        <NFTGrid></NFTGrid>
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
