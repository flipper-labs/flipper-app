import { PreviousMatchPreview } from "./PreviousMatchPreview";
import { Match } from "~~/models/match";

export interface PreviousMatchesListProps {
  address: string;
  matches: Match[];
}

export const PreviousMatchesList = ({ address, matches }: PreviousMatchesListProps) => {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      {matches &&
        matches.map(match => {
          return <PreviousMatchPreview match={match} player={address} key={match.id} />;
        })}
    </div>
  );
};
