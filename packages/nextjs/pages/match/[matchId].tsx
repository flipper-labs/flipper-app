import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PlayerNFTs } from "./../../components/PlayerNFTs";
import { httpServerURL } from "./../../services/socket";
import { socket } from "./../../services/socket";
import { BigNumber, Contract, Signer, constants } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";
import { Chat } from "~~/components/Chat";
import { ActionButton } from "~~/components/misc/buttons/ActionButton";
import { useScaffoldContract, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { Match } from "~~/models/match";
import { NFT, getUserNFTs } from "~~/models/nfts";
import { notification } from "~~/utils/scaffold-eth";

const MatchLobby = () => {
  const router = useRouter();
  const { matchId } = router.query;

  const { data: signer } = useSigner();

  const { address } = useAccount();

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

  const onJoin = (payload: Match) => {
    if (match.player2 && match.player2?.wallet !== "") {
      return;
    }

    setMatch({ ...payload });
  };

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
          const tokenFound = match.player1.nfts?.filter((mnft: NFT) => mnft?.tokenId === nft?.tokenId);
          if (tokenFound && tokenFound.length > 0) {
            nft.selected = true;
          }

          return nft;
        });

        player2NFTs = await getUserNFTs(nftContract as Contract, match.player2.wallet);
      }

      setPlayer1NFTs(player1NFTs);
      setPlayer2NFTs(player2NFTs);

      // TODO: Player 2 NFTs are not displayed immediatelly

      console.log(player2NFTs);
    })();

    socket.on("match:join", onJoin);

    return () => {
      socket.off("match:join");
    };
  }, [matchId]);

  useEffect(() => {
    if (!player1NFTs) return;

    const newMatch = { ...match };
    newMatch.player1.nfts = [...player1NFTs];
    setMatch(newMatch);
  }, [player1NFTs]);

  useEffect(() => {
    if (!player2NFTs) return;

    const newMatch = { ...match };
    newMatch.player2.nfts = [...player2NFTs];
    setMatch(newMatch);
  }, [player2NFTs]);

  const createMatch = async () => {
    const res = await flipper?.createMatch(matchId as string, {
      timestamp: BigNumber.from(0),
      player1: match.player1?.wallet,
      player1Stake: match.player1?.nfts
        ? match.player1.nfts?.map((nft: NFT) => {
            return { contractAddress: nft.contract, id: BigNumber.from(nft.tokenId) };
          })
        : [],
      player2: match.player2?.wallet,
      player2Stake: match.player2.nfts
        ? match.player2.nfts?.map((nft: NFT) => {
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
          style={{ width: "50%" }}
          className="flex flex-col justify-center items-center gap-3 border border-purple-500 backdrop-blur bg-opacity-50 rounded-lg"
        >
          <PlayerNFTs
            coin_image="coin-front.svg"
            icon_align="float-left"
            player={match?.player1?.wallet}
            nfts={player1NFTs ? player1NFTs : []}
            isLockedIn={isPlayer1LockedIn}
            setIsLockedIn={setPlayer1IsLockedIn}
            setNFTs={setPlayer1NFTs}
          />
          {/** TODO: Lock in is not working properly. */}
          {isPlayer1LockedIn && isPlayer2LockedIn && address === match.player1.wallet ? (
            <div className="w-1/2">
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
        <div
          style={{ width: "50%" }}
          className="flex flex-col justify-center items-center gap-3 border border-white-500 backdrop-blur bg-opacity-50 rounded-lg"
        >
          <PlayerNFTs
            coin_image="coin-back.svg"
            icon_align="float-right"
            player={match?.player2?.wallet}
            nfts={player2NFTs ? player2NFTs : []}
            isLockedIn={isPlayer2LockedIn}
            setIsLockedIn={setPlayer2IsLockedIn}
            setNFTs={setPlayer2NFTs}
          />
          {isPlayer1LockedIn && isPlayer2LockedIn && address === match.player2.wallet ? (
            <div className="w-1/2">
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
      </div>
      <div style={{ height: "30vh" }} className="flex h-full w-full px-10 py-5 h-100 gap-10">
        <div className="w-full">
          <Chat address={address} matchID={matchId} />
        </div>
      </div>
    </div>
  );
};

export default MatchLobby;
