import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import robbotNFT from "~~/public/nftImages/robbotNFT.png"

interface NFTGridInterface{
    nfts: Array<any>
    setNfts: any
}

export const NFTGrid = ({
    nfts,
    setNfts
}: NFTGridInterface) => {
    // const [myNfts, setMyNfts]: Array<any> = useState(nfts)
    const handleClick = (i: any) => {
        console.log(i)
        const newNft = [...nfts];
        newNft[i].selected = !newNft[i].selected
        setNfts(newNft)

        console.log("nft: ", newNft[i])
    }

    return (
        <div className="scrollable-div hide-scroll h-full grid grid-cols-4 gap-4" style={{height:"40vh"}}>
            { nfts.map(
            (nft: any, i: any) => <div onClick={() => handleClick(i)} className="m-4" key={i}>
                    <div style={{border: nft.selected ? "5px purple solid" : "none"}}>
                        <img src={nft.imageUrl} alt="image loading"></img>
                    </div>
                </div>
            )}
        </div>
    )
}