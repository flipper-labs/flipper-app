import { useEffect } from "react";
import { ActionButton } from "../misc/buttons/ActionButton";
import { StatusButton } from "../misc/buttons/StatusButton";
import { MatchPreviewUser } from "./MatchPreviewUser";

export interface MatchPreviewProps {}

export const MatchPreview = (props: any) => {

  var action_button = <ActionButton action="Watch" color="#F050F2" />
  if (props.match_data.player2.wallet == "") {
    action_button = <ActionButton action="Join" color="#46D05C" />
  }

  return (
    <div
      className={`box-border w-4/5 py-6 px-10 gap-18 
      flex flex-row justify-between items-center
      border-[1px] border-solid rounded-lg border-gray-400
      `}
    >
      <MatchPreviewUser address={props.match_data.player1.wallet} stake={props.match_data.player1.nfts.length} />
      <div className="text-lg">VS</div>
      <MatchPreviewUser address={props.match_data.player2.wallet} stake={props.match_data.player2.nfts.length} />
      <StatusButton status="LIVE" color="#F050F2" />
      {action_button}
    </div>
  );
};
