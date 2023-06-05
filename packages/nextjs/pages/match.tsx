import React, { useRef } from "react";
import { CoinFlip } from "~~/components/animations/CoinFlip";

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
    <div>
      <button onClick={handleFlipStart}>Start flip</button> &nbsp;
      <button onClick={handleLogoFlips}>Logo flips</button> &nbsp;
      <button onClick={handleEmptyFlips}>Empty flips</button>
      <div>
        <CoinFlip getFlipState={getFlipState} />
      </div>
    </div>
  );
};

export default Home;
