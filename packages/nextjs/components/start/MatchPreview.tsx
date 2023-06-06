import { useEffect } from "react";
import { socket } from "../../services/socket";
import { ActionButton } from "../misc/buttons/ActionButton";
import { StatusButton } from "../misc/buttons/StatusButton";
import { MatchPreviewUser } from "./MatchPreviewUser";
import { useAccount } from "wagmi";
import { Match } from "~~/models/match";

export interface MatchPreviewProps {
  match: Match;
}

export const MatchPreview = ({ match }: MatchPreviewProps) => {
  const { address } = useAccount();

  function match_join() {
    if (address) {
      var join_payload = {
        matchID: match.id,
        opponent: {
          wallet: address,
          nfts: [],
        },
      };
      socket.emit("match:join", join_payload);
    } else {
      console.log("Wallet not linked!");
    }
  }

  var action_button = <ActionButton action="Watch" color="#F050F2" />;
  if (match.player2.wallet == "") {
    action_button = <ActionButton action="Join" color="#46D05C" onClick={match_join} />;
  } else if (match.player1.wallet === address) {
    action_button = <></>;
  }

  return (
    <div
      className={`box-border w-4/5 py-6 px-10 gap-18 
      flex flex-row justify-between items-center
      border-[1px] border-solid rounded-lg border-gray-400
      `}
    >
      <MatchPreviewUser address={match.player1.wallet} stake={match.player1.nfts ? match.player1.nfts.length : 0} />
      <div className="text-lg">VS</div>
      <MatchPreviewUser address={match.player2.wallet} stake={match.player2.nfts ? match.player2.nfts.length : 0} />
      <StatusButton status="LIVE" color="#F050F2" />
      {match.player1.wallet !== address
        ? match.player2.wallet === "" && <ActionButton action="Join" color="#46D05C" onClick={match_join} />
        : ""}
    </div>
  );
};
