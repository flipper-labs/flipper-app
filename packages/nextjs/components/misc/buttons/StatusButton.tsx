import LossIcon from "./../../../public/svgs/loss.svg";
import WinIcon from "./../../../public/svgs/win.svg";
import { MatchStatus } from "~~/models/enums";

interface StatusButtonProps {
  status: MatchStatus;
  player: string;
  winner: string;
}

export enum MatchStatusDetailed {
  Open = "OPEN",
  Live = "LIVE",
  Win = "WIN",
  Loss = "LOSS",
}

export const convertStatus = (status: MatchStatus, player: string, winner: string): MatchStatusDetailed => {
  switch (status) {
    case MatchStatus.Live:
      return MatchStatusDetailed.Live;
    case MatchStatus.Open:
      return MatchStatusDetailed.Open;
    case MatchStatus.Completed:
      if (winner == "") {
        return MatchStatusDetailed.Live;
      }
      return player === winner ? MatchStatusDetailed.Win : MatchStatusDetailed.Loss;
    default:
      return MatchStatusDetailed.Live;
  }
};

export const StatusButton = ({ status, player, winner }: StatusButtonProps) => {
  const convertedStatus = convertStatus(status, player, winner);
  let color = "";

  console.log(status);
  console.log(convertedStatus);

  switch (convertedStatus) {
    case MatchStatusDetailed.Live:
    case MatchStatusDetailed.Win:
      color = "#F050F2";
      break;
    case MatchStatusDetailed.Open:
      color = "#46D05C";
      break;
    case MatchStatusDetailed.Loss:
      color = "#ED4F4F";
      break;
  }

  console.log(color);

  return (
    <div
      className={`box-border py-2 px-4 border-[1px] border-solid rounded-lg`}
      style={{ borderColor: `${color}`, color: `${color}` }}
    >
      {convertedStatus}
      {status === MatchStatus.Completed ? (
        player === winner ? (
          <WinIcon stroke={color} />
        ) : (
          <LossIcon stroke={color} />
        )
      ) : (
        ""
      )}
    </div>
  );
};
