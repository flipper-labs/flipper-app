import { GameMode, MatchStatus } from "./enums";
import { NFT, getPlayerStake } from "./nfts";
import { Contract } from "ethers";

export const matchFromLog = async (id: string, args: any, flipper: Contract | null, provider: any): Promise<Match> => {
  const match: Match = {
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

  if (flipper) {
    match.player1.nfts = await getPlayerStake(flipper as Contract, match.player1.wallet, id, provider);
    match.player2.nfts = await getPlayerStake(flipper as Contract, match.player2.wallet, id, provider);
  }

  return match;
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
