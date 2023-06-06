import { WinLoss } from "../misc/buttons/WinLoss";
import { MatchPreviewUser } from "./../start/MatchPreviewUser";
import { Match } from "~~/models/match";

export interface MatchPreviewProps {
  player: string;
  match: Match;
}

export const PreviousMatchPreview = ({ match, player }: MatchPreviewProps) => {
  return (
    <div
      className={`box-border w-4/5 py-4 px-8 gap-18 
      flex flex-row justify-between items-center
      border-[1px] border-solid rounded-lg border-gray-400
      `}
    >
      <MatchPreviewUser address={match.player1.wallet} stake={match.player1.nfts ? match.player1.nfts.length : 0} />
      <div className="text-lg">VS</div>
      <MatchPreviewUser address={match.player2.wallet} stake={match.player2.nfts ? match.player2.nfts.length : 0} />
      <WinLoss winner={match.winner} player={player} />
    </div>
  );
};
