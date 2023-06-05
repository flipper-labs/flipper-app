import { GameMode, MatchOutcome, MatchStatus } from "./enums";

export const matchFromLog = (id: string, args: any): Match => {
  return {
    id: id,
    player1: {
      wallet: args.player1,
    },
    player2: {
      wallet: args.player2,
    },
    gamemode: args.gamemode,
    winner: args.winner,
  };
};

export interface Match {
  readonly id: string;
  player1: Player;
  player2: Player;
  readonly gamemode: GameMode;
  status?: MatchStatus;
  winner: string;
}

export interface Player {
  wallet: string;
  nfts?: NFT[];
  lensProfile?: LensProfile;
}

export interface NFT {
  contract: string;
  tokenId: number;
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
