import Head from "next/head";
import type { NextPage } from "next";
import { PreviousMatchesList } from "~~/components/stats/PreviousMatchesList";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Scaffold-ETH 2 App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
      </Head>

      <div className="flex items-center flex-col pt-10 gap-4 w-full">
        <PreviousMatchesList />
      </div>
    </>
  );
};

export default Home;
