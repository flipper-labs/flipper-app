import Link from "next/link";
import { Chat } from "~~/components/Chat"
import { ActionButton } from "~~/components/misc/buttons/ActionButton";

const Results = () => {

    return (
        <div className="flex items-center flex-col pt-10 w-full h-full">
            <div className="text-header">The winner is x</div>
            <div className="text-big" style={{color: "#F050F2"}}>Congrats!</div>
            <div className="pt-2">Share with your friends...</div>
            <div className="flex items-center flex-row gap-4 pt-5">
                <div className="backdrop-blur bg-opacity-50 rounded-lg">
                    <img src="lensLogo.png" alt="" />
                </div>
                <div className="backdrop-blur bg-opacity-50 rounded-lg">
                    <img src="discordLogo.png" alt="" />
                </div>
                <div className="backdrop-blur bg-opacity-50 rounded-lg">
                    <img src="twitterLogo.png" alt="" />
                </div>
            </div>
            <div className="pt-10" style={{}}>
                <Link href="/">
                    <ActionButton
                        action="Go to Home Page"
                        color="white"
                        iconToRight={false}
                        background="#650BBF"
                        paddingX={3}
                        paddingY={1}
                    />
                </Link>
            </div>
            
            {/* <div className="flex h-full w-full px-10 py-5 h-100 gap-10">
                <div className="w-full">
                    <Chat/>
                </div>
            </div> */}
        </div>
    )
}

export default Results;