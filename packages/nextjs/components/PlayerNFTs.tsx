import Lock from "./../public/svgs/lock.svg";
import Unlock from "./../public/svgs/unlock.svg";
import { NFTGrid } from "./NFTGrid";
import { ActionButton, ActionType } from "./misc/buttons/ActionButton";
import { useAccount } from "wagmi";
import { NFT } from "~~/models/nfts";
import { shortenAddress } from "~~/utils/flipper";

export interface PlayerNFTsProps {
  coin_image: string;
  icon_align: string;
  player: string;
  isLockedIn?: boolean;
  setIsLockedIn?: any;
  nfts?: NFT[];
  setNFTs?: any;
}

export const PlayerNFTs = ({
  coin_image,
  icon_align,
  player,
  isLockedIn,
  setIsLockedIn,
  nfts,
  setNFTs,
}: PlayerNFTsProps) => {
  const { address: currentUser } = useAccount();

  return (
    <div className="flex flex-col pt-3 justify-center items-center">
      <div style={{ width: "100%" }} className="pl-2 pr-2">
        <div className={icon_align}>
          <img src={coin_image} className="w-12" />
        </div>
      </div>
      <div className="flex flex-row gap-3">
        {isLockedIn ? <Lock /> : <Unlock />}
        {player === currentUser ? "You" : player === "" ? "Waiting for an opponent..." : shortenAddress(player)}
      </div>
      <div style={{ height: "40vh" }}>
        <NFTGrid player={player} isLockedIn={isLockedIn ?? false} nfts={nfts ?? []} setNfts={setNFTs} />
      </div>
      {isLockedIn
        ? player === currentUser && (
            <ActionButton
              onClick={() => setIsLockedIn(false)}
              action={ActionType.Unlock}
              color="white"
              iconToRight={false}
              background="#F050F2"
              paddingX={3}
              paddingY={1}
            />
          )
        : player === currentUser && (
            <ActionButton
              onClick={() => setIsLockedIn(true)}
              action={ActionType.Lock}
              color="white"
              iconToRight={false}
              background="#F050F2"
              paddingX={3}
              paddingY={1}
            />
          )}
    </div>
  );
};
