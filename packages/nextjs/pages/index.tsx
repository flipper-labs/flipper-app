import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { Cover } from "~~/components/start/Cover";
import { MatchActions } from "~~/components/start/MatchActions";
import { MatchPreview } from "~~/components/start/MatchPreview";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {socket, httpServerURL} from "../services/socket"

const Home: NextPage = () => {
  const [matches, setMatches] = useState([])
  const [nameFilter, setNameFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState( [
    {
      "name": "None",
      "checked": true
    },
    {
      "name": "Ongoing",
      "checked": false
    },
    {
      "name": "Created",
      "checked": false
    }
  ] )

  const [nftNumberFilter, setNftNumberFilter] = useState( [
    {
      "name": "None",
      "checked": true
    },
    {
      "name": "0-2",
      "checked": false
    },
    {
      "name": "3-5",
      "checked": false
    },
    {
      "name": "6+",
      "checked": false
    }
  ] )

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

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('match:create', onMatchCreate)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('match:create', onMatchCreate)
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var queryData = {
          "player": nameFilter,
          "status": [],
          "nftNumber": []
        };

        for (let i = 0; i < statusFilter.length; i++) {
          if (statusFilter[i].name == "None") {
            continue;
          }
          queryData.status.push({
            "value": statusFilter[i].name,
            "checked": statusFilter[i].checked
          })
        }

        for (let i = 0; i < nftNumberFilter.length; i++) {
          if (nftNumberFilter[i].name == "None") {
            continue;
          }
          queryData.nftNumber.push({
            "value": nftNumberFilter[i].name,
            "checked": nftNumberFilter[i].checked
          })
        }

        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(queryData),
        };
        const response = await fetch(httpServerURL + "/matches", requestOptions);
        const jsonData = await response.json();
        setMatches(jsonData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [statusFilter, nameFilter, nftNumberFilter]);

  return (
    <>
      <Head>
        <title>Flipper</title>
        <meta name="description" content="Gamble your NFTs" />
      </Head>

      <div className="flex items-center flex-col pt-10 gap-4 w-full h-full">
        <Cover />
        <MatchActions statusFilter={statusFilter} setStatusFilter={setStatusFilter} 
                      nftNumberFilter={nftNumberFilter} setNftNumberFilter={setNftNumberFilter}
                      nameFilter={nameFilter} setNameFilter={setNameFilter}/>
        <div className="flex w-full space-y-4 items-center scrollable-div hide-scroll h-full" style={{height: '45vh'}}>
          {matches.map((item, index) => (
            <MatchPreview key={index} match_data={item}/>
          ))}
        </div>
      </div>
    </>
  );
}; 

export default Home;
