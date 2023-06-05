import { useEffect } from "react";
import { ActionButton } from "../misc/buttons/ActionButton";
import { StatusButton } from "../misc/buttons/StatusButton";
import { MatchPreviewUser } from "./MatchPreviewUser";
import { useIsMounted } from "usehooks-ts";

export interface MatchPreviewProps {}

export const MatchPreview = () => {
  const isMounted = useIsMounted();

  return (
    <div
      className={`box-border w-4/5 py-6 px-10 gap-18 
      flex flex-row justify-between items-center
      border-[1px] border-solid rounded-lg border-gray-400
      `}
    >
      <MatchPreviewUser address="0x69ddB6f5Bd2d92C397Db173b98FF6dEEF204A3bB" stake={3} />
      <div className="text-lg">VS</div>
      <MatchPreviewUser address="0x68a87aecafa6bc424A8083FF0bE90d20Eb97a015" stake={2} />
      <StatusButton status="LIVE" color="#F050F2" />
      <ActionButton action="Spectate" color="#46D05C" />
    </div>
  );
};
