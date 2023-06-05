import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { Cover } from "~~/components/start/Cover";
import { MatchActions } from "~~/components/start/MatchActions";
import { MatchPreview } from "~~/components/start/MatchPreview";

const Home: NextPage = () => {
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
