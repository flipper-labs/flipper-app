import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { ActionButton } from "~~/components/misc/buttons/ActionButton";
import { NFTGrid } from "~~/components/NFTGrid";
import imageUrl from "~~/public/nftImages/robbotNFT.png"
import { useState } from "react";
import {socket} from "../../services/socket"
import { useAccount } from "wagmi";

const CreateMatch: NextPage = () => {
  const account = useAccount()
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
  console.log("socket connected: ", socket.connected)
  const address = account.address
  const [myNfts, setMyNfts]: Array<any> = useState(nfts)
  const handleClick = () => {
    socket.emit("match:create", {
      "creator": {
          "wallet": {address},
          "nfts": [
              {
                  "contract": "0xcontract2",
                  "tokenId": 20
              }
          ]
      },
      "gamemode": "Winner Takes All"
    })
  }
  return (
    <>
      <div className="flex justify-center items-center flex-col pt-10 gap-4 w-full">
        <div className="text-header">Pick the NFTs</div>
        <NFTGrid nfts={nfts} myNfts={myNfts} setMyNfts={setMyNfts}></NFTGrid>
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
