import { Chat } from "~~/components/Chat"
import {PlayerNFTs} from "./playerNFTs"
import { useRouter } from 'next/router';
import { useAccount } from "wagmi";

export const MatchLobby = () => {
    const router = useRouter();
    const account = useAccount()

    // Access the query parameters or URL path parameters
    const matchID = router.query.matchID;
    console.log("Query match id: " + matchID)

    const player1 = "0x69ddB6f5Bd2d92C397Db173b98FF6dEEF204A3bB"
    const player2 = "0x69ddB6f5Bd2d92C397Db173b98FF6dEEF204A3bB"

    return (
        <div>
            <div className="flex justify-center items-center flex-row p-5 gap-4 w-full">
                <div style={{width: "50%"}} className="border border-purple-500 backdrop-blur bg-opacity-50 rounded-lg">
                    <PlayerNFTs address={player1} coin_image="coin-front.svg" icon_align="float-left"></PlayerNFTs>
                </div>
                <div style={{width: "50%"}} className="border border-white-500 backdrop-blur bg-opacity-50 rounded-lg">
                    <PlayerNFTs address={player2} coin_image="coin-back.svg" icon_align="float-right"></PlayerNFTs>
                </div>
            </div>
            <div style={{height: "30vh"}} className="flex h-full w-full px-10 py-5 h-100 gap-10">
                <div className="w-full">
                    <Chat address={account.address} matchID={matchID} />
                </div>
            </div>
        </div>
    )
}

export default MatchLobby
