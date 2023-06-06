import Image from "next/image";
import robbotNFT from "~~/public/nftImages/robbotNFT.png"

export const NFTGrid = () => {
    const renderItems = () => {
        const items = [];
        for (let i = 0; i < 10; i++) {
          items.push(<div className="m-4" key={i}><Image src={robbotNFT} alt="image loading"></Image></div>);
        }
        return items;
    };

    return (
        <div className="scrollable-div hide-scroll h-full grid grid-cols-4 gap-4" style={{height:"40vh"}}>
            {renderItems()}
        </div>
    )
}