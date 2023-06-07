import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Lock from "./../../../public/svgs/lock.svg";
import Unlock from "./../../../public/svgs/unlock.svg";
import { BigNumber, Signer } from "ethers";
import { useAccount, useSigner } from "wagmi";
import { Chat } from "~~/components/Chat";
import { PlayerInMatch } from "~~/components/PlayerInMatch";
import { CoinFlip } from "~~/components/animations/CoinFlip";
import { ActionButton } from "~~/components/misc/buttons/ActionButton";
import { useScaffoldContract, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { Match, Player, StakePayload, matchFromLog } from "~~/models/match";
import { socket } from "~~/services/socket";
import { notification } from "~~/utils/scaffold-eth";

const Roll = () => {
  const router = useRouter();
  const { matchId } = router.query;

  const { address: currentUser } = useAccount();

  const { data: signer } = useSigner();
  const [match, setMatch] = useState<Match>({} as Match);

  const [player1Staked, setPlayer1Staked] = useState(false);
  const [player2Staked, setPlayer2Staked] = useState(false);

  const coinStateRef = useRef(0);

  const { data: nftContract } = useScaffoldContract({
    contractName: "MockERC721",
    signerOrProvider: signer ? (signer as Signer) : undefined,
  });
  const { data: flipper } = useScaffoldContract({
    contractName: "Flipper",
    signerOrProvider: signer ? (signer as Signer) : undefined,
  });

  useEffect(() => {
    (async () => {
      if (matchId && flipper && nftContract) {
        const rawMatch = await flipper?.matches(matchId);
        const convertedMatch = await matchFromLog(matchId as string, rawMatch, flipper, nftContract);
        setMatch(convertedMatch);
      }
    })();
  }, [matchId, flipper, nftContract, signer]);

  useEffect(() => {
    socket.on("match:stake", onStake);
    socket.on("match:start", onStart)

    return () => {
      socket.off("match:stake");
      socket.off("match:start")
    };
  }, [match]);

  const onStake = (payload: StakePayload) => {
    if (!match) return;

    console.log(payload.playerWallet + " locked");

    if (match.player1.wallet === payload.playerWallet) {
      setPlayer1Staked(true);
    } else if (match.player2.wallet === payload.playerWallet) {
      setPlayer2Staked(true);
    }
  };

  const onStart = (payload: Match) => {
    if (!match) return;

    if (match.id === payload.id) {
      console.log("Match is starting!");
      handleFlipStart();
    }
  };

  const handleFlipStart = () => {
    if (coinStateRef.current == 0) {
      coinStateRef.current = 1;
    }
  };

  const handleLogoFlips = () => {
    if (coinStateRef.current == 1) {
      coinStateRef.current = 2;
    }
  };

  const handleEmptyFlips = () => {
    if (coinStateRef.current == 1) {
      coinStateRef.current = 3;
    }
  };

  const getFlipState = () => {
    return coinStateRef.current;
  };

  const lockTokens = async (player: Player) => {
    if (nftContract && player && player.nfts) {
      const promises = [];

      try {
        for (let i = 0; i < player.nfts?.length; i++) {
          promises.push(
            nftContract["safeTransferFrom(address,address,uint256)"](
              player.wallet,
              flipper?.address,
              BigNumber.from(player.nfts[i].tokenId),
            ),
          );
        }

        await Promise.all(promises);

        socket.emit("match:stake", { matchID: matchId, player: player });
      } catch (err: any) {
        notification.error(`An error has occurred while transfering a token: ${err?.message}`);
      }
    }
  };

  useScaffoldEventSubscriber({
    contractName: "Flipper",
    eventName: "MatchCompleted",
    listener: async (player1, player2, id) => {
      const finishedMatchRaw = await flipper?.matches(matchId);
      const convertedMatch = await matchFromLog(matchId as string, finishedMatchRaw, flipper, nftContract);

      if (convertedMatch.winner === currentUser) {
        handleLogoFlips();
        notification.info(convertedMatch.winner + " has won!");
      } else if (convertedMatch.winner !== currentUser) {
        handleEmptyFlips();
        notification.info(convertedMatch.winner + " has won!");
      }

      setTimeout(() => {
        router.push(`/results/${currentUser === convertedMatch.winner ? "true" : "false"}`);
      }, 5000);
    },
  });

  const { writeAsync: startMatchAsync, isLoading } = useScaffoldContractWrite({
    contractName: "Flipper",
    functionName: "startMatch",
    args: [matchId as string],
    value: "0",
    onBlockConfirmation: async txnReceipt => {},
  });

  const startMatch = async () => {
    try {
      socket.emit("match:start", {matchID: match.id});
      await startMatchAsync();
    } catch (err: any) {
      notification.error(err.message);
    }
  };

  return (
    <div className="flex items-center flex-col pt-10 w-full h-full">
      <div className="flex w-full px-10">
        <div className="w-1/4 py-2 backdrop-blur bg-opacity-50 border border-blue-500 rounded-lg flex flex-col items-center justify-center">
          <PlayerInMatch player={match.player1} coin_image="coin-front.svg" />
          {match && match.player1 && currentUser == match.player1.wallet && !player1Staked && (
            <ActionButton
              onClick={async () => await lockTokens(match.player1)}
              action="Lock NFTs"
              color="white"
              iconToRight={false}
              background="#F050F2"
              paddingX={2}
              paddingY={1}
            />
          )}
          {/** If current player locked his own tokens */}
          {match && match.player1 && currentUser == match.player1.wallet && player1Staked && <Lock />}
          {/** If opponent locked his tokens */}
          {match && match.player1 && currentUser != match.player1.wallet ? player1Staked ? <Lock /> : <Unlock /> : ""}
        </div>
        <div className="w-1/2 flex items-center flex-col">
          <CoinFlip getFlipState={getFlipState} />
        </div>
        <div className="w-1/4 py-2 backdrop-blur bg-opacity-50 border border-purple-500 rounded-lg flex flex-col items-center justify-center">
          <PlayerInMatch player={match.player2} coin_image="coin-back.svg" />
          {match && match.player2 && currentUser == match.player2.wallet && !player2Staked && (
            <ActionButton
              onClick={async () => await lockTokens(match.player2)}
              action="Lock NFTs"
              color="white"
              iconToRight={false}
              background="#F050F2"
              paddingX={2}
              paddingY={1}
            />
          )}
          {match && match.player2 && currentUser == match.player2.wallet && player2Staked && <Lock />}
          {match && match.player2 && currentUser != match.player2.wallet ? player2Staked ? <Lock /> : <Unlock /> : ""}
        </div>
      </div>

      <div className="flex w-1/2 items-center justify-center ml-150">
        {player1Staked && player2Staked && (
          <ActionButton
            onClick={async () => await startMatch()}
            action="Start Match"
            color="white"
            iconToRight={false}
            background="#F050F2"
            paddingX={2}
            paddingY={1}
          />
        )}
      </div>

      <div className="flex h-full w-full px-10 py-5 h-100 gap-10">
        <div className="w-full">
          <Chat matchID={matchId ? (matchId as string) : ""} address={currentUser ? currentUser : ""} />
        </div>
      </div>

      {/* 
      <button onClick={handleFlipStart}>Start flip</button> &nbsp;
      <button onClick={handleLogoFlips}>Logo flips</button> &nbsp;
      <button onClick={handleEmptyFlips}>Empty flips</button> */}
    </div>
  );
};

export default Roll;
