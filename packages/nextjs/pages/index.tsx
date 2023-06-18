import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { httpServerURL, socket } from "../services/socket";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Cover } from "~~/components/start/Cover";
import { MatchActions } from "~~/components/start/MatchActions";
import { MatchPreview } from "~~/components/start/MatchPreview";

const Home: NextPage = () => {
  const { address } = useAccount();
  const router = useRouter();
  const [matches, setMatches] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState([
    {
      name: "None",
      checked: true,
    },
    {
      name: "Ongoing",
      checked: false,
    },
    {
      name: "Created",
      checked: false,
    },
  ]);

  const [nftNumberFilter, setNftNumberFilter] = useState([
    {
      name: "None",
      checked: true,
    },
    {
      name: "0-2",
      checked: false,
    },
    {
      name: "3-5",
      checked: false,
    },
    {
      name: "6+",
      checked: false,
    },
  ]);

  useEffect(() => {
    function onConnect() {
      console.log("Matches overview: socket connected!");
    }

    function onDisconnect() {
      console.log("Matches overview: socket disconnected!");
    }

    function onMatchCreate(match: any) {
      setMatches([...matches, match]);
    }

    function onMatchJoin(match: any) {
      if (match.player2.wallet === address) {
        router.push(`match/${match.id}`);
      }
    }

    function onMatchSpectate(payload: any) {
      router.push(`match/${payload.matchID}`);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("match:create", onMatchCreate);
    socket.on("match:join", onMatchJoin);
    socket.on("match:spectate", onMatchSpectate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("match:create", onMatchCreate);
      socket.off("match:join", onMatchJoin);
      socket.off("match:spectate", onMatchSpectate);
    };
  }, [address, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var queryData = {
          player: nameFilter,
          status: [],
          nftNumber: [],
        };

        for (let i = 0; i < statusFilter.length; i++) {
          if (statusFilter[i].name == "None") {
            continue;
          }
          queryData.status.push({
            value: statusFilter[i].name,
            checked: statusFilter[i].checked,
          });
        }

        for (let i = 0; i < nftNumberFilter.length; i++) {
          if (nftNumberFilter[i].name == "None") {
            continue;
          }
          queryData.nftNumber.push({
            value: nftNumberFilter[i].name,
            checked: nftNumberFilter[i].checked,
          });
        }

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queryData),
        };
        const response = await fetch(httpServerURL + "/matches", requestOptions);
        const jsonData = await response.json();
        setMatches(jsonData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [statusFilter, nameFilter, nftNumberFilter]);

  return (
    <>
      <div className="flex items-center flex-col pt-10 gap-4 w-full h-full">
        <Cover address={address} />
        <MatchActions
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          nftNumberFilter={nftNumberFilter}
          setNftNumberFilter={setNftNumberFilter}
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
        />
        <div
          className="flex w-full space-y-4 items-center scrollable-div hide-scroll h-full"
          style={{ height: "45vh" }}
        >
          {matches.length > 0 ? (
            matches.map((item, index) => <MatchPreview key={index} match={item} player={address as string} />)
          ) : (
            <div className="flex flex-col gap-3 justify-center items-center">
              <p className="text-xl">Available matches will appear here.</p>
              <div className="flex relative w-[10rem] h-[10rem]">
                <Image alt="No matches available" fill src="/walking-man.png" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
