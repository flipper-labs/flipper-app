import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import robbotNFT from "~~/public/nftImages/robbotNFT.png"

interface NFTGridInterface{
    nfts: Array<any>
}

export const NFTGrid = ({
    nfts,
}: NFTGridInterface) => {
    const [myNfts, setMyNfts]: Array<any> = useState(nfts)
    const handleClick = (i: any) => {
        console.log(i)
        const newNft = [...myNfts];
        newNft[i].selected = !newNft[i].selected
        setMyNfts(newNft)

        console.log("nft: ", newNft[i])
    }

    // const renderItems = useMemo(() => {
    //     return myNfts.map(
    //         (nft: any, i: any) => <div onClick={() => handleClick(i)} className="m-4" style={{border: nft.selected ? "1px purple solid" : "none"}} key={i}>
    //                 <Image src={robbotNFT} alt="image loading"></Image>
    //             </div>
    //         )
    // }, [myNfts])

    return (
        <div className="scrollable-div hide-scroll h-full grid grid-cols-4 gap-4" style={{height:"40vh"}}>
            { myNfts.map(
            (nft: any, i: any) => <div onClick={() => handleClick(i)} className="m-4" style={{border: nft.selected ? "1px purple solid" : "none"}} key={i}>
                    <Image src={robbotNFT} alt="image loading"></Image>
                </div>
            )}
        </div>
    )
}