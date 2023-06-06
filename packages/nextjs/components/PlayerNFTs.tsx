import { NFTGrid } from "./NFTGrid";
import { useAccount } from "wagmi";
import { NFT } from "~~/models/nfts";
import { shortenAddress } from "~~/utils/flipper";

export interface PlayerNFTsProps {
  coin_image: string;
  icon_align: string;
  player: string;
  nfts: NFT[];
  setNFTs: any;
}

export const PlayerNFTs = ({ coin_image, icon_align, player, nfts, setNFTs }: PlayerNFTsProps) => {
  const { address: currentUser } = useAccount();

  return (
    <div className="flex flex-col pt-3 justify-center items-center">
      <div style={{ width: "100%" }} className="pl-2 pr-2">
        <div className={icon_align}>
          <img src={coin_image} className="w-12" />
        </div>
      </div>
      <div>
        {player === currentUser ? "You" : player === "" ? "Waiting for an opponent..." : shortenAddress(player)}
      </div>
      <div className="scrollable-div hide-scroll h-full grid grid-cols-4 gap-4" style={{ height: "40vh" }}>
        <NFTGrid nfts={nfts} setNfts={setNFTs} />
      </div>
    </div>
  );
};
