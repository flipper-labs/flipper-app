import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PlayerNFTs } from "./../../components/PlayerNFTs";
import { httpServerURL } from "./../../services/socket";
import { socket } from "./../../services/socket";
import { Chat } from "~~/components/Chat";
import { Match } from "~~/models/match";
import { NFT } from "~~/models/nfts";
import { JoinMatchPayload } from "~~/models/sockets";

const MatchLobby = () => {
  const router = useRouter();
  const { matchId } = router.query;

  const [match, setMatch] = useState<Match>({} as Match);
  const [player1NFTs, setPlayer1NFTs] = useState<NFT[] | null>(null);
  const [player2NFTs, setPlayer2NFTs] = useState<NFT[] | null>(null);

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
      const match = await response.json();
      setMatch(match);
      setPlayer1NFTs(match.player1.nfts);
      setPlayer2NFTs(match.player2.nfts);
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

  return (
    <div>
      <div className="flex justify-center items-center flex-row p-5 gap-4 w-full">
        <div style={{ width: "50%" }} className="border border-purple-500 backdrop-blur bg-opacity-50 rounded-lg">
          <PlayerNFTs
            coin_image="coin-front.svg"
            icon_align="float-left"
            player={match?.player1?.wallet}
            nfts={player1NFTs ? player1NFTs : []}
            setNFTs={setPlayer1NFTs}
          />
        </div>
        <div style={{ width: "50%" }} className="border border-white-500 backdrop-blur bg-opacity-50 rounded-lg">
          <PlayerNFTs
            coin_image="coin-back.svg"
            icon_align="float-right"
            player={match?.player2?.wallet}
            nfts={player2NFTs ? player2NFTs : []}
            setNFTs={setPlayer2NFTs}
          />
        </div>
      </div>
      <div style={{ height: "30vh" }} className="flex h-full w-full px-10 py-5 h-100 gap-10">
        <div className="w-full">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default MatchLobby;
