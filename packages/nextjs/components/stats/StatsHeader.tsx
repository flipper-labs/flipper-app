import { useEffect, useState } from "react";
import LossIcon from "./../../public/svgs/loss.svg";
import WinIcon from "./../../public/svgs/win.svg";
import { Match } from "~~/models/match";
import { shortenAddress } from "~~/utils/flipper";

export interface StatsHeaderProps {
  address: string;
  matches: Match[];
}

export const StatsHeader = ({ address, matches }: StatsHeaderProps) => {
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let wins = 0;
    const losses = 0;
    let total = 0;

    matches.forEach(match => {
      if (match.isSettled) {
        if (match.winner === address) wins += 1;
        if (match.winner === address) wins += 1;
      }
      total += 1;
    });

    setWins(wins);
    setLosses(losses);
    setTotal(total);
  }, []);

  const calculatePercentage = (num: number, total: number): string => {
    if (total == 0) return "0";
    return (num / total).toFixed(0);
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <div className="text-3xl font-bold">{shortenAddress(address)}</div>
      <div className="flex flex-row gap-[15rem] justify-between items-center">
        <div className="flex flex-row justify-center items-center gap-3">
          <WinIcon stroke="#F050F2" width={64} height={64} />
          <div className="flex flex-col justify-center items-start">
            <div className="text-2xl font-light">{wins} Wins</div>
            <div className="text-lg font-extralight">{calculatePercentage(wins, total)}%</div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-3">
          <LossIcon stroke="#ED4F4F" width={64} height={64} />
          <div className="flex flex-col justify-center items-start">
            <div className="text-2xl font-light">{losses} Losses</div>
            <div className="text-lg font-extralight">{calculatePercentage(losses, total)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
