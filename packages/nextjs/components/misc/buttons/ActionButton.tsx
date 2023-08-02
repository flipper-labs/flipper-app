import EyeIcon from "./../../../public/svgs/eye.svg";
import InviteIcon from "./../../../public/svgs/invite.svg";
import LockIcon from "./../../../public/svgs/lock.svg";
import PlayIcon from "./../../../public/svgs/play.svg";
import SortIcon from "./../../../public/svgs/sort.svg";
import UnlockIcon from "./../../../public/svgs/unlock.svg";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export enum ActionType {
  Sort = "Sort By",
  Filter = "Filter",
  CreateMatch = "Create Match",
  InviteFriends = "Invite Friends",
  Join = "Join",
  Watch = "Watch",
  Lock = "Lock",
  Unlock = "Unlock",
  GoToHomePage = "Go To Home Page"
}

interface ActionButtonProps {
  action: ActionType; // depends on match status
  color?: string;
  background?: string;
  border?: string;
  paddingY?: number;
  paddingX?: number;
  iconToRight?: boolean;
  displayRightChevron?: boolean;
  textSize?: string;
  onClick?: any;
}

export const ActionButton = ({
  action,
  color,
  background,
  border,
  paddingY,
  paddingX,
  textSize = "text-lg",
  iconToRight = true,
  displayRightChevron = false,
  onClick,
}: ActionButtonProps) => {
  let Icon: any = <PlayIcon stroke={color} />;

  switch (action) {
    case ActionType.CreateMatch:
      Icon = <PlayIcon stroke={color} />;
      break;
    case ActionType.Join:
      Icon = <PlayIcon stroke={color} />;
      break;
    case ActionType.Watch:
      Icon = <EyeIcon stroke={color} />;
      break;
    case ActionType.Sort:
      Icon = <SortIcon stroke={color} />;
      break;
    case ActionType.InviteFriends:
      Icon = <InviteIcon stroke={color} />;
      break;
    case ActionType.Lock:
      Icon = <LockIcon stroke={color} />;
      break;
    case ActionType.Unlock:
      Icon = <UnlockIcon stroke={color} />;
      break;
  }

  return (
    <div
      onClick={onClick}
      className={`
      box-border flex flex-row justify-center items-center gap-2 cursor-pointer
      transition duration-150 hover:scale-105 rounded-lg
      `}
      style={{
        color: `${color}`,
        background: `${background ? background : ""}`,
        border: `${border ? "1px solid" : "0px"}`,
        borderColor: `${border ? border : ""}`,
        paddingTop: `${paddingY ? paddingY : 0}rem`,
        paddingBottom: `${paddingY ? paddingY : 0}rem`,
        paddingLeft: `${paddingX ? paddingX : 0}rem`,
        paddingRight: `${paddingX ? paddingX : 0}rem`,
      }}
    >
      {!iconToRight && Icon}
      <div className={textSize}>{action}</div>
      {iconToRight && Icon}
      {displayRightChevron && (
        <ChevronDownIcon className="h-5 w-5 text-violet-200 hover:text-violet-100" aria-hidden="true" />
      )}
    </div>
  );
};
