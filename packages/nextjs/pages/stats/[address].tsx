import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { PreviousMatchesList } from "~~/components/stats/PreviousMatchesList";
import { StatsHeader } from "~~/components/stats/StatsHeader";
import { useScaffoldContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { Match, matchFromLog } from "~~/models/match";
import { mapAsyncParallel } from "~~/utils/flipper";

const Stats: NextPage = () => {
  const [matches, setMatches] = useState([] as Match[]);

  const router = useRouter();
  const { address } = router.query;

  const { data: flipper } = useScaffoldContract({
    contractName: "Flipper",
  });

  const {
    data: matchCompletedEventsAsPlayer1,
  } = useScaffoldEventHistory({
    contractName: "Flipper",
    eventName: "MatchCompleted",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    filters: {
      player1: address ? (address as string) : "",
    },
    blockData: true,
  });

  const {
    data: matchCompletedEventsAsPlayer2,
  } = useScaffoldEventHistory({
    contractName: "Flipper",
    eventName: "MatchCompleted",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    filters: {
      player2: address ? (address as string) : "",
    },
    blockData: true,
  });

  const {
    data: matchCreatedEventsAsPlayer1,
  } = useScaffoldEventHistory({
    contractName: "Flipper",
    eventName: "MatchCreated",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    filters: {
      player1: address ? (address as string) : "",
    },
    blockData: true,
  });

  const {
    data: matchCreatedEventsAsPlayer2,
  } = useScaffoldEventHistory({
    contractName: "Flipper",
    eventName: "MatchCreated",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    filters: {
      player2: address ? (address as string) : "",
    },
    blockData: true,
  });

  useEffect(() => {
    if (!address) {
      return;
    }

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
      let matches = (await mapAsyncParallel(matchIds, async (id: any) => {
        const match = await flipper?.matches(id);
        return await matchFromLog(id, match, flipper, null);
      })) as Match[];
      matches = matches.sort((a: Match, b: Match) => {
        return a.timestamp - b.timestamp;
      });

      setMatches(matches ? (matches as Match[]) : []);
    })();
  }, [
    matchCompletedEventsAsPlayer1,
    matchCompletedEventsAsPlayer2,
    matchCreatedEventsAsPlayer1,
    matchCreatedEventsAsPlayer2,
  ]);

  return (
    <>
      <MetaHeader />

      <div className="flex flex-col pt-10 gap-4 w-full items-center justify-center">
        <StatsHeader address={address ? (address as string) : ""} matches={matches} />
        {/* <button onClick={write}>Create match</button> */}
        {matches.length > 0 ? (
          <PreviousMatchesList address={address ? (address as string) : ""} matches={matches} />
        ) : (
          "There are no matches to be displayed."
        )}
      </div>
    </>
  );
};

export default Stats;
