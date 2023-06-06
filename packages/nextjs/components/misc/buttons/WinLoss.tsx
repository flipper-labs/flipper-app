import OngoingIcon from "./../../../public/svgs/clock.svg";
import LossIcon from "./../../../public/svgs/loss.svg";
import WinIcon from "./../../../public/svgs/win.svg";
import { constants } from "ethers";

interface WinLossProps {
  winner: string;
  player: string;
}

export const WinLoss = ({ winner, player }: WinLossProps) => {
  const doesWinnerExist = winner === constants.AddressZero;

  const color = doesWinnerExist ? "green" : winner === player ? "purple" : "red";
  const status = doesWinnerExist ? "LIVE" : winner === player ? "WIN" : "LOSS";

  return (
    <div
      className={`box-border flex flex-row justify-center items-center rounded-lg px-2 py-2 gap-2`}
      style={{
        color: `${color}`,
        border: "1px solid",
        borderColor: `${color}`,
      }}
    >
      <div className="text-lg">{status}</div>
      {doesWinnerExist ? (
        <OngoingIcon width={24} height={24} stroke={color} />
      ) : winner === player ? (
        <WinIcon width={24} height={24} stroke={color} />
      ) : (
        <LossIcon width={24} height={24} stroke={color} />
      )}
    </div>
  );
};
