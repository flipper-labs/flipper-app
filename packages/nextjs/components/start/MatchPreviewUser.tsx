import Jazzicon from "react-jazzicon/dist/Jazzicon";

export const MatchPreviewUser = ({ address, stake }: { address: string; stake: number }) => {
  let displayAddress = address?.slice(0, 5) + "..." + address?.slice(-4);

  const jsNumberForAddress = (address: string): number => {
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
    )
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row justify-center items-center gap-4">
        <Jazzicon diameter={32} seed={jsNumberForAddress(address)} />
        <div className="text-lg">{displayAddress}</div>
      </div>
      <div className="text-sm">{stake} NFTs</div>
    </div>
  );
};
