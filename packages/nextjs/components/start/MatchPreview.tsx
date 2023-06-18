import { socket } from "../../services/socket";
import { ActionButton, ActionType } from "../misc/buttons/ActionButton";
import { StatusButton } from "../misc/buttons/StatusButton";
import { MatchPreviewUser } from "./MatchPreviewUser";
import { useAccount } from "wagmi";
import { MatchStatus } from "~~/models/enums";
import { Match } from "~~/models/match";

export interface MatchPreviewProps {
  match: Match;
  player: string;
}

export const MatchPreview = ({ match, player }: MatchPreviewProps) => {
  const { address } = useAccount();

  function joinMatch() {
    if (address) {
      socket.emit("match:join", {
        matchID: match.id,
        opponent: {
          wallet: address,
          nfts: [],
        },
      });
    } else {
      console.log("Wallet not linked!");
    }
  }

  function watchMatch() {
    socket.emit("match:spectate", {
      matchID: match.id,
    });
  }

  // TODO: Extract this somewhere else, probably to a service of some sorts
  function inviteFriends() {}

  var action_button = <ActionButton action={ActionType.Watch} color="#F050F2" onClick={watchMatch} />;
  if (match.player1.wallet === address && match.player2.wallet === "") {
    action_button = <ActionButton action={ActionType.InviteFriends} color="#F050F2" onClick={inviteFriends} />;
  } else if (match.player1.wallet !== address && match.player2.wallet === "") {
    action_button = <ActionButton action={ActionType.Join} color="#46D05C" onClick={joinMatch} />;
  }

  let player1Num = 0;
  match.player1.nfts?.forEach((nft: any) => {
    if (!("selected" in nft) || nft.selected === true) {
      player1Num += 1;
    }
  });

  let player2Num = 0;
  match.player2.nfts?.forEach((nft: any) => {
    if (!("selected" in nft) || nft.selected === true) {
      player2Num += 1;
    }
  });

  return (
    <div
      className={`box-border w-4/5 py-6 px-10 gap-18 
      flex flex-row justify-between items-center
      border-[1px] border-solid rounded-lg border-gray-400
      `}
    >
      <MatchPreviewUser address={match.player1.wallet} stake={player1Num} />
      <div className="text-lg">VS</div>
      <MatchPreviewUser address={match.player2.wallet} stake={player2Num} />
      <StatusButton status={match.status ? match.status : MatchStatus.Live} winner={match.winner} player={player} />
      {action_button}
    </div>
  );
};
