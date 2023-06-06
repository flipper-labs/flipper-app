import { Player } from "./match";

export interface JoinMatchPayload {
  matchID: string;
  opponent: Player;
}
