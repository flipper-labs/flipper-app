import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { ActionButton, ActionType } from "~~/components/misc/buttons/ActionButton";

const Results = () => {
  const router = useRouter();
  const { won } = router.query;
  const account = useAccount();
  const [winner, setWinner] = useState(false);

  const tweetContent = "I won on NFT Flipper game!";
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetContent)}`;

  useEffect(() => {
    console.log("won: ", won);
    console.log("Account: ", account.address);
    if (won == "true") {
      setWinner(true);
    }
  }, [account, won]);
  return (
    <div className="flex items-center flex-col pt-10 w-full h-full">
      {winner ? (
        <div className="flex items-center flex-col pt-10 w-full h-full">
          <div className="text-header">You won</div>
          <div className="text-big" style={{ color: "#F050F2" }}>
            Congrats!
          </div>
          <div className="pt-2">Share with your friends...</div>
          <div className="flex items-center flex-row gap-4 pt-5">
            <div className="backdrop-blur bg-opacity-50 rounded-lg">
              <img src="../lensLogo.png" alt="" />
            </div>
            <div className="backdrop-blur bg-opacity-50 rounded-lg">
              <img src="../discordLogo.png" alt="" />
            </div>
            <div onClick={() => window.open(tweetUrl, "_blank")} className="backdrop-blur bg-opacity-50 rounded-lg">
              <img src="../twitterLogo.png" alt="" />
            </div>
          </div>
          <div className="pt-10" style={{}}>
            <Link href="/">
              <ActionButton
                action={ActionType.GoToHomePage}
                color="white"
                iconToRight={false}
                background="#650BBF"
                paddingX={3}
                paddingY={1}
              />
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-header">You lost</div>
          <div className="text-big" style={{ color: "#F050F2" }}>
            No worries!
          </div>
          <div className="pt-2">Tough break this time but you'll bounce back stronger!</div>
          <div className="">Let's keep playing and have a blast in the next round!</div>
          <div className="pt-10" style={{}}>
            <Link href="/">
              <ActionButton
                action={ActionType.GoToHomePage}
                color="white"
                iconToRight={false}
                background="#650BBF"
                paddingX={3}
                paddingY={1}
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
