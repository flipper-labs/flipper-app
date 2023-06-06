import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { useAccount } from "wagmi";
import { shortenAddress } from "~~/utils/flipper";

export const PlayerInMatch = ({ address, coin_image }: { address: string; coin_image: string }) => {
  const { address: currentPlayer } = useAccount();

  const jsNumberForAddress = (address: string): number => {
    const addr = address.slice(2, 10);
    const seed = parseInt(addr, 16);

    return seed;
  };

  const imageUrl = `/${coin_image}`;

  return (
    <div className="flex flex-col pt-10 justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-4">
        <Jazzicon diameter={32} seed={jsNumberForAddress(address)} />
        <div className="text-lg">{address === currentPlayer ? "You" : shortenAddress(address)}</div>
        <img src={imageUrl} className="w-12" />
      </div>
    </div>
  );
};
