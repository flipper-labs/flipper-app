import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { Cover } from "~~/components/start/Cover";
import { MatchActions } from "~~/components/start/MatchActions";
import { MatchPreview } from "~~/components/start/MatchPreview";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {socket} from "../services/socket"

const Home: NextPage = () => {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    function onConnect() {
      console.log("Matches overview: socket connected!")
    }

    function onDisconnect() {
      console.log("Matches overview: socket disconnected!")
    }

    function onMatchCreate(match: any) {
      setMatches(matches => [...matches, match]);
    }

    function onActiveMatches(matches: any) {
      setMatches(matches);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('match:create', onMatchCreate)
    socket.on('match:all_active', onActiveMatches)
    socket.emit('match:all_active', "")

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('match:create', onMatchCreate)
    };
  }, []);

  return (
    <>
      <Head>
        <title>Flipper</title>
        <meta name="description" content="Gamble your NFTs" />
      </Head>

      <div className="flex items-center flex-col pt-10 gap-4 w-full">
        <Cover />
        <MatchActions />
        {matches.map((item, index) => (
          <MatchPreview key={index} match_data={item}/>
        ))}
      </div>
    </>
  );
};

export default Home;
