import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PlayerNFTs } from "./../../components/PlayerNFTs";
import { httpServerURL } from "./../../services/socket";
import { socket } from "./../../services/socket";
import { BigNumber, Contract, Signer, constants } from "ethers";
import { useAccount, useSigner } from "wagmi";
import { Chat } from "~~/components/Chat";
import { ActionButton } from "~~/components/misc/buttons/ActionButton";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { Bargain, Match } from "~~/models/match";
import { NFT, getUserNFTs } from "~~/models/nfts";
import { notification } from "~~/utils/scaffold-eth";

const MatchLobby = () => {
  const router = useRouter();
  const { matchId } = router.query;

  const { data: signer } = useSigner();

  const { address: currentUser } = useAccount();

  const [match, setMatch] = useState<Match>({} as Match);
  const [player1NFTs, setPlayer1NFTs] = useState<NFT[] | null>(null);
  const [player2NFTs, setPlayer2NFTs] = useState<NFT[] | null>(null);
  const [isPlayer1LockedIn, setPlayer1IsLockedIn] = useState(false);
  const [isPlayer2LockedIn, setPlayer2IsLockedIn] = useState(false);

  const { data: nftContract } = useScaffoldContract({
    contractName: "MockERC721",
  });
  const { data: flipper } = useScaffoldContract({
    contractName: "Flipper",
    signerOrProvider: signer ? (signer as Signer) : undefined,
  });

  async function onJoin(payload: Match) {
    if (match.player2 && match.player2?.wallet !== "") {
      return;
    }
    let player2NFTs: NFT[] = [];
    player2NFTs = await getUserNFTs(nftContract as Contract, payload.player2.wallet);
    setMatch({ ...payload });
    setPlayer2NFTs(player2NFTs);
  }

  useEffect(() => {
    function onBargain(payload: Bargain) {
      if (match.player2.wallet === payload.player.wallet) {
        setPlayer2IsLockedIn(payload.locked);
        setPlayer2NFTs(payload.player.nfts ? payload.player.nfts : []);
      }

      if (match.player1.wallet === payload.player.wallet) {
        setPlayer1IsLockedIn(payload.locked);
        setPlayer1NFTs(payload.player.nfts ? payload.player.nfts : []);
      }
    }

    socket.on("match:bargain", onBargain);

    return () => {
      socket.off("match:bargain");
    };
  }, [match]);

  function setPlayer1Bargain() {
    socket.emit("match:bargain", {
      locked: !isPlayer1LockedIn,
      player: {
        wallet: match.player1.wallet,
        nfts: player1NFTs,
      },
      matchID: match.id,
    });
  }

  function setPlayer2Bargain() {
    socket.emit("match:bargain", {
      locked: !isPlayer2LockedIn,
      player: {
        wallet: match.player2.wallet,
        nfts: player2NFTs,
      },
      matchID: match.id,
    });
  }

  function setPlayer1NewNFT(nfts: any) {
    setPlayer1NFTs(nfts);
    socket.emit("match:bargain", {
      locked: isPlayer1LockedIn,
      player: {
        wallet: match.player1.wallet,
        nfts: nfts,
      },
      matchID: match.id,
    });
  }

  function setPlayer2NewNFT(nfts: any) {
    setPlayer2NFTs(nfts);
    socket.emit("match:bargain", {
      locked: isPlayer2LockedIn,
      player: {
        wallet: match.player2.wallet,
        nfts: nfts,
      },
      matchID: match.id,
    });
  }

  useEffect(() => {
    (async () => {
      const response = await fetch(`${httpServerURL}/matches/${matchId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const match: Match = await response.json();
      setMatch(match);

      let player1NFTs: NFT[] = [];
      if (match.player1.nfts) {
        player1NFTs = [...match.player1.nfts];
      }

      let player2NFTs: NFT[] = [];
      if (match.player2.nfts) {
        player2NFTs = [...match.player2.nfts];
      }

      if (nftContract) {
        player1NFTs = await getUserNFTs(nftContract as Contract, match.player1.wallet);
        player1NFTs = player1NFTs.map((nft: NFT) => {
          const tokenFound = [];
          for (let i = 0; i < match.player1.nfts.length; i++) {
            const mnft = match.player1.nfts[i];
            if (mnft && mnft.tokenId.hex === nft.tokenId._hex) {
              tokenFound.push(mnft);
            }
          }
          if (tokenFound && tokenFound.length > 0) {
            nft.selected = true;
          } else {
            nft.selected = false; // Set selected to false for NFTs not found in match.player1.nfts
          }

          return nft;
        });

        if (match.player2.wallet !== "") {
          player2NFTs = await getUserNFTs(nftContract as Contract, match.player2.wallet);
        }
      }

      setPlayer1NFTs(player1NFTs);
      setPlayer2NFTs(player2NFTs);
    })();

    socket.on("match:join", onJoin);

    return () => {
      socket.off("match:join");
    };
  }, [matchId, nftContract]);

  const createMatch = async () => {
    const res = await flipper?.createMatch(matchId as string, {
      timestamp: BigNumber.from(0),
      player1: match.player1?.wallet,
      player1Stake: player1NFTs
        ? player1NFTs?.map((nft: NFT) => {
            return { contractAddress: nft.contract, id: BigNumber.from(nft.tokenId) };
          })
        : [],
      player2: match.player2?.wallet,
      player2Stake: player2NFTs
        ? player2NFTs?.map((nft: NFT) => {
            return { contractAddress: nft.contract, id: BigNumber.from(nft.tokenId) };
          })
        : [],
      gamemode: match.gamemode,
      winner: constants.AddressZero,
      isSettled: false,
    });
    console.log(res);
  };

  return (
    <div>
      <div className="flex justify-center items-center flex-row p-5 gap-4 w-full">
        <div
          style={{ width: "50%", height: "50vh" }}
          className="flex flex-col justify-center items-center gap-3 border border-purple-500 backdrop-blur bg-opacity-50 rounded-lg pb-1 m-0"
        >
          <PlayerNFTs
            coin_image="/coin-front.svg"
            icon_align="absolute top-1 left-1"
            player={match?.player1?.wallet}
            nfts={player1NFTs ? player1NFTs : []}
            isLockedIn={isPlayer1LockedIn}
            setIsLockedIn={setPlayer1Bargain}
            setNFTs={setPlayer1NewNFT}
          />
        </div>
        <div
          style={{ width: "50%", height: "50vh" }}
          className="flex flex-col justify-center items-center gap-3 border border-white-500 backdrop-blur bg-opacity-50 rounded-lg pb-1"
        >
          <PlayerNFTs
            coin_image="/coin-back.svg"
            icon_align="absolute top-1 right-1 transform translate-x-[-full] -translate-y-[-full]"
            player={match?.player2?.wallet}
            nfts={player2NFTs ? player2NFTs : []}
            isLockedIn={isPlayer2LockedIn}
            setIsLockedIn={setPlayer2Bargain}
            setNFTs={setPlayer2NewNFT}
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-3" style={{ height: "5vh" }}>
        {isPlayer1LockedIn && isPlayer2LockedIn ? (
          <div className="w-1/6">
            <ActionButton
              action="Create Match"
              color="white"
              iconToRight={false}
              background="#F050F2"
              paddingX={3}
              paddingY={1}
              onClick={async () => await createMatch()}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <div style={{ height: "30vh" }} className="flex h-full w-full px-10 py-5 h-100 gap-10">
        <div className="w-full">
          <Chat address={currentUser} matchID={matchId} />
        </div>
      </div>
    </div>
  );
};

export default MatchLobby;
