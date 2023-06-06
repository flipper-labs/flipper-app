import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useAccount } from "wagmi";
import { localhost } from "wagmi/chains";
import { useScaffoldContract, useScaffoldContractWrite, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { Match, matchFromLog } from "~~/models/match";
import { mapAsyncParallel } from "~~/utils/flipper/arrays";
import { getLocalProvider } from "~~/utils/scaffold-eth";

const provider = getLocalProvider(localhost);

export const PreviousMatchesList = () => {
  const [matches, setMatches] = useState([] as Match[]);
  const { address } = useAccount();

  const { data: flipper } = useScaffoldContract({
    contractName: "Flipper",
  });

  const newMatch = {
    timestamp: BigNumber.from(0),
    player1: "0x69ddB6f5Bd2d92C397Db173b98FF6dEEF204A3bB",
    player1Stake: [{ contractAddress: "0x0165878A594ca255338adfa4d48449f69242Eb8F", id: BigNumber.from(1) }],
    player2: "0x68a87aecafa6bc424A8083FF0bE90d20Eb97a015",
    player2Stake: [{ contractAddress: "0x0165878A594ca255338adfa4d48449f69242Eb8F", id: BigNumber.from(0) }],
    gamemode: "wta",
    winner: ethers.constants.AddressZero,
    isSettled: false,
  };

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "Flipper",
    functionName: "createMatch",
    args: ["123", newMatch],
    value: "0",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const {
    data: matchCompletedEventsAsPlayer1,
    isLoading: isLoadingCompletedEventsAsPlayer1,
    error: errorReadingCompletedEventsAsPlayer1,
  } = useScaffoldEventHistory({
    contractName: "Flipper",
    eventName: "MatchCompleted",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    filters: {
      player1: address,
    },
    blockData: true,
  });

  const {
    data: matchCompletedEventsAsPlayer2,
    isLoading: isLoadingCompletedEventsAsPlayer2,
    error: errorReadingCompletedEventsAsPlayer2,
  } = useScaffoldEventHistory({
    contractName: "Flipper",
    eventName: "MatchCompleted",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    filters: {
      player2: address,
    },
    blockData: true,
  });

  const {
    data: matchCreatedEventsAsPlayer1,
    isLoading: isLoadingCreatedEventsAsPlayer1,
    error: errorReadingCreatedEventsAsPlayer1,
  } = useScaffoldEventHistory({
    contractName: "Flipper",
    eventName: "MatchCreated",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    filters: {
      player1: address,
    },
    blockData: true,
  });

  const {
    data: matchCreatedEventsAsPlayer2,
    isLoading: isLoadingCreatedEventsAsPlayer2,
    error: errorReadingCreatedEventsAsPlayer2,
  } = useScaffoldEventHistory({
    contractName: "Flipper",
    eventName: "MatchCreated",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    filters: {
      player2: address,
    },
    blockData: true,
  });

  useEffect(() => {
    const transformEvents = (events: any[] | undefined) => {
      return events ? events.map((e: any) => e?.args?.id) : [];
    };

    const matchIds = [
      ...transformEvents(matchCompletedEventsAsPlayer1),
      ...transformEvents(matchCompletedEventsAsPlayer2),
      ...transformEvents(matchCreatedEventsAsPlayer1),
      ...transformEvents(matchCreatedEventsAsPlayer2),
    ];
    (async () => {
      const matches = await mapAsyncParallel(matchIds, async (id: any) => {
        const match = await flipper?.matches(id);
        return await matchFromLog(id, match, flipper, provider);
      });
      setMatches(matches ? (matches as Match[]) : []);
    })();
  }, [
    matchCompletedEventsAsPlayer1,
    matchCompletedEventsAsPlayer2,
    matchCreatedEventsAsPlayer1,
    matchCreatedEventsAsPlayer2,
  ]);

  const write = async () => await writeAsync();

  return (
    <div>
      <button onClick={write}>Send Tx</button>
    </div>
  );
};
