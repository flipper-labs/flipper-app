import { GameMode, MatchStatus } from "./enums";
import { NFT, getPlayerStake } from "./nfts";
import { Contract } from "ethers";

export const matchFromLog = async (
  id: string,
  args: any,
  flipper: Contract | null,
  nftContract: Contract | null,
): Promise<Match> => {
  if (!args.player1) {
    return {} as Match;
  }

  const match: Match = {
    id: id,
    timestamp: args.timestamp.toNumber(),
    player1: {
      wallet: args.player1,
    },
    player2: {
      wallet: args.player2,
    },
    gamemode: args.gamemode,
    winner: args.winner,
    isSettled: args.isSettled,
  };

  if (flipper && nftContract) {
    match.player1.wallet
      ? (match.player1.nfts = await getPlayerStake(
          flipper as Contract,
          nftContract as Contract,
          match.player1.wallet,
          id,
        ))
      : "";
    match.player2.wallet
      ? (match.player2.nfts = await getPlayerStake(
          flipper as Contract,
          nftContract as Contract,
          match.player2.wallet,
          id,
        ))
      : "";
  }

  return match;
};

export interface Match {
  readonly id: string;
  readonly timestamp: number;
  player1: Player;
  player2: Player;
  readonly gamemode: GameMode;
  status?: MatchStatus;
  winner: string;
  isSettled: boolean;
}

export interface Bargain {
  readonly matchID: string;
  player: Player;
  isLockedIn: boolean;
}

export interface BargainResponse {
  match: Match;
  player: Player;
  isLockedIn: boolean;
}

export interface StakePayload {
  playerWallet: string;
}

export interface Player {
  wallet: string;
  nfts?: NFT[];
  lensProfile?: LensProfile;
}

interface LensProfile {
  id: string;
  name: string | null;
  handle: string;
  ownedBy: string;
  picture: LensPictureMediaSet | null;
}

interface LensPictureMediaSet {
  original: LensMedia;
}

interface LensMedia {
  url: string; // Url
}
