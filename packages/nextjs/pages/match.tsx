import React, { useRef } from "react";
import { CoinFlip } from "~~/components/animations/CoinFlip";
import { PlayerInMatch } from "~~/components/PlayerInMatch";
import { Chat } from "~~/components/Chat";

const Home = () => {
  // 0 - not started
  // 1 - started flip
  // 2 - logo side flips
  // 3 - empty side flips
  const coinStateRef = useRef(0);

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

  return (
    <div className="flex items-center flex-col pt-10 w-full h-full">
      <div className="flex w-full px-10">
        <div className="w-1/4 backdrop-blur bg-opacity-50 border border-blue-500 rounded-lg"><PlayerInMatch address="0x69ddB6f5Bd2d92C397Db173b98FF6dEEF204A3bB" coin_image="coin-front.svg" /></div>
        <div className="w-1/2 flex items-center flex-col"><CoinFlip getFlipState={getFlipState} /></div>
        <div className="w-1/4 backdrop-blur bg-opacity-50 border border-purple-500 rounded-lg"><PlayerInMatch address="0x69ddB6f5Bd2d92C397Db173b98FF6dEEF204A3bB" coin_image="coin-back.svg" /></div>
      </div>
      
      <div className="flex h-full w-full px-10 py-5 h-100 gap-10">
        <div className="w-full">
          <Chat/>
        </div>
      </div>

{/* 
      <button onClick={handleFlipStart}>Start flip</button> &nbsp;
      <button onClick={handleLogoFlips}>Logo flips</button> &nbsp;
      <button onClick={handleEmptyFlips}>Empty flips</button> */}
    </div>
  );
};

export default Home;
