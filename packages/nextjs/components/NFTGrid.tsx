import { NFT } from "~~/models/nfts";

interface NFTGridProps {
  nfts: NFT[];
  setNfts: any;
}

export const NFTGrid = ({ nfts, setNfts }: NFTGridProps) => {
  const handleClick = (i: any) => {
    const newNft = [...nfts];
    newNft[i].selected = !newNft[i].selected;
    setNfts(newNft);
  };

  return (
    <div className="scrollable-div hide-scroll h-full grid grid-cols-4 gap-4" style={{ height: "40vh" }}>
      {nfts.map((nft: any, i: any) => (
        <div onClick={() => handleClick(i)} className="m-4" key={i}>
          <div className="w-20" style={{ border: nft.selected ? "5px purple solid" : "none" }}>
            <img src={nft.image} alt="image loading"></img>
          </div>
        </div>
      ))}
    </div>
  );
};
