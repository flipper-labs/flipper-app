import { NFTGrid } from "./NFTGrid";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { useAccount } from "wagmi";
import { Player } from "~~/models/match";
import { shortenAddress } from "~~/utils/flipper";

export interface PlayerInMatchProps {
  player: Player;
  coin_image: string;
}

export const PlayerInMatch = ({ player, coin_image }: PlayerInMatchProps) => {
  const { address: currentPlayer } = useAccount();

  const jsNumberForAddress = (address: string): number => {
    if (!address) address = "0x68a87aecafa6bc424A8083FF0bE90d20Eb97a015";

    const addr = address.slice(2, 10);
    const seed = parseInt(addr, 16);

    return seed;
  };

  const imageUrl = `/${coin_image}`;

  return (
    player && (
      <div className="flex flex-col pt-10 justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-4">
          <Jazzicon diameter={32} seed={jsNumberForAddress(player?.wallet)} />
          <div className="text-lg">{player?.wallet === currentPlayer ? "You" : shortenAddress(player?.wallet)}</div>
          <img src={imageUrl} className="w-12" />
        </div>
        <NFTGrid player={player.wallet} nfts={player?.nfts ? player.nfts : []} setNfts={() => 0} isLockedIn={true} />
      </div>
    )
  );
};
