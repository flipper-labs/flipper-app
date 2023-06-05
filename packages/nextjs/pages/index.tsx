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
  const serverURL = "http://localhost:8002"
  const address = "0x69ddB6f5Bd2d92C397Db173b98FF6dEEF204A3bB"
  const [isConnected, setIsConnected] = useState(socket.connected);
  // const [socket, setSocket] = useState(null)
  console.log("Socket: ", socket)
  
  const [matches, setMatches] = useState([])

  // useEffect(() => {
  //   console.log("Socket connected: ", socket.connected)
  //   socket.on('match:create', (match) => {
  //     console.log('Match created!!!!! ', match);
  //     // matches.push(match)
  //   });
  //   // fetch(serverURL+"/matches/"+address).then(async result => {
  //   //   console.log("Fetch result: ", await result.json())
  //   // })
  // }, [])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMatchCreate(match: any) {
      console.log('Match created!!!!! ', match);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('match:create', onMatchCreate)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('match:create', onMatchCreate)
    };
  }, []);

  // useEffect(() => {
  //   console.log("Is connected state changed: ", isConnected)
  // }, [isConnected])
  return (
    <>
      <Head>
        <title>Scaffold-ETH 2 App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
      </Head>

      <div className="flex items-center flex-col pt-10 gap-4 w-full">
        <Cover />
        <MatchActions />
        <MatchPreview />
      </div>
    </>
  );
};

export default Home;
