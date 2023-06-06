import Image from "next/image";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { NFTGrid } from "~~/components/NFTGrid";

export const PlayerNFTs = ({ address, coin_image, icon_align }: { address: string; coin_image: string; icon_align: string }) => {
  let displayAddress = address?.slice(0, 5) + "..." + address?.slice(-4);

  const imageUrl = `/${coin_image}`;

  return (
    <div className="flex flex-col pt-3 justify-center items-center">
        <div style={{width: "100%"}} className="pl-2 pr-2">
            <div className={icon_align}>
                <img src={imageUrl} className="w-12"/>
            </div>
        </div>
        <div>{displayAddress}</div>
        <NFTGrid></NFTGrid>
    </div>
  );
};
