import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { ActionButton } from "~~/components/misc/buttons/ActionButton";
import { NFTGrid } from "~~/components/NFTGrid";
import imageUrl from "~~/public/nftImages/robbotNFT.png"
import { useEffect, useState } from "react";
import {socket} from "../../services/socket"
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { fetchFromIpfs } from "~~/utils/flipper";

const CreateMatch: NextPage = () => {
  const account = useAccount()
  console.log("socket connected: ", socket.connected)
  const address = account.address
  const [nfts, setNfts]: Array<any> = useState([])
  const { data: nft } = useScaffoldContract({
    contractName: "MockERC721",
  });
  
  useEffect(() => {
    (async () => {
      if(nft){
        const tokenIds = await nft?.getOwnerTokens(address)
        const newNft = [];
        for(let i = 0; i < tokenIds.length; i ++){
          const metadata = await nft?.tokenURI(tokenIds[i]);
          const image = await fetchFromIpfs(metadata.substring(7));
          console.log("Image url: ", image)
          
          newNft.push({
            imageUrl: image,
            selected: false
          }) 
        }
        setNfts(newNft)
        console.log("NFTs: ", nfts)
        console.log("Token ids: ", tokenIds)
      }
    })()
  }, [address])
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
