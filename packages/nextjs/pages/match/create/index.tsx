import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "../../../services/socket";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { NFTGrid } from "~~/components/NFTGrid";
import { ActionButton } from "~~/components/misc/buttons/ActionButton";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { NFT, getUserNFTs } from "~~/models/nfts";

const CreateMatch: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [matchId, setMatchId] = useState<string>("");
  const [nfts, setNfts] = useState<NFT[]>([]);
  const { data: nftContract } = useScaffoldContract({
    contractName: "MockERC721",
  });

  function onMatchCreate(match: any) {
    setMatchId(match.id);
  }

  useEffect(() => {
    (async () => {
      if (nftContract && address) {
        const nfts = await getUserNFTs(nftContract, address);
        // TODO: Player's NFTs are not dispalyed immediatelly

        setNfts(nfts);
      }
    })();

    socket.on("match:create", onMatchCreate);

    return () => {
      socket.off("match:create", onMatchCreate);
    };
  }, [address]);

  useEffect(() => {
    matchId && router.push(`/match/${matchId}`);
  }, [matchId]);

  const handleClick = () => {
    const mynfts = [];
    for (let i = 0; i < nfts.length; i++) {
      if (nfts[i].selected) {
        mynfts.push(nfts[i]);
      }
    }

    socket.emit("match:create", {
      creator: {
        wallet: address,
        nfts: mynfts,
      },
      gamemode: "Winner Takes All",
    });
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col pt-10 gap-4 w-full">
        <div className="text-header">Pick the NFTs</div>
        <NFTGrid nfts={nfts} setNfts={setNfts} player={address ? address : ""} isLockedIn={false} />
        <div className="mt-3">
          <ActionButton
            action="Create Match"
            color="white"
            iconToRight={false}
            background="#F050F2"
            paddingX={3}
            paddingY={1}
            onClick={handleClick}
          />
        </div>
      </div>
    </>
  );
};

export default CreateMatch;
