import React, { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket";
import { shortenAddress } from "~~/utils/flipper";

export interface ChatProps {
  matchID: string;
  address: string;
}

export const Chat = ({ matchID, address }: ChatProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<any>(null);

  useEffect(() => {
    function onMatchChat(message: any) {
      setMessages([...messages, shortenAddress(message.player.wallet) + ": " + message.message]);
    }

    socket.on("match:chat", onMatchChat);

    return () => {
      socket.off("match:chat", onMatchChat);
    };
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue) {
      socket.emit("match:chat", {
        matchID: matchID,
        message: inputValue,
        player: {
          wallet: address,
        },
      });
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full border-none overflow-hidden rounded-lg">
      <div className="h-1/6 p-3 chat-head-color flex flex-row items-center gap-2">
        <div>
          <img src="/chat-icon.svg" className="w-6" />
        </div>
        <div>Chat</div>
      </div>
      <div ref={inputRef} className="h-4/6 scrollable-div hide-scroll chat-body-color">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <div className="h-1/6 w-full min-h-min">
        <input
          type="text"
          value={inputValue}
          autoFocus
          onChange={handleInputChange}
          className="w-5/6 bg-black border-none focus:outline-none"
        />
        <button onClick={handleSendMessage} className="w-1/6 chat-head-color chat-button-color">
          Send
        </button>
      </div>
    </div>
  );
};
