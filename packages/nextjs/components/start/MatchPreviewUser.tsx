import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { useAccount } from "wagmi";
import { shortenAddress } from "~~/utils/flipper";

export const MatchPreviewUser = ({ address, stake }: { address: string; stake: number }) => {
  const { address: currentUser } = useAccount();

  const jsNumberForAddress = (address: string): number => {
    if (!address) address = "0x68a87aecafa6bc424A8083FF0bE90d20Eb97a015";

    const addr = address.slice(2, 10);
    const seed = parseInt(addr, 16);

    return seed;
  };

  if (address == "") {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row justify-center items-center gap-4">
          <div className="text-lg">?</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="flex flex-row justify-center items-center gap-4">
        <Jazzicon diameter={32} seed={jsNumberForAddress(address)} />
        <div className="text-lg">{address === currentUser ? "You" : shortenAddress(address)}</div>
      </div>
      <div className="text-sm">{stake} NFTs</div>
    </div>
  );
};
