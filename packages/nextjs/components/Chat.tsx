import React, { useState, useRef, useEffect } from 'react';

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue) {
      setMessages([...messages, inputValue]);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full border-none overflow-hidden rounded-lg">
        <div className='h-1/6 p-3 chat-head-color flex flex-row items-center gap-2'>
            <div><img src="/chat-icon.svg" className="w-6"/></div>
            <div>Chat</div>
        </div>
        <div ref={inputRef} className="h-4/6 scrollable-div hide-scroll chat-body-color">
            {messages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}
        </div>
        <div className="h-1/6 w-full min-h-min">
            <input type="text" value={inputValue} autoFocus onChange={handleInputChange} className='w-5/6 bg-black border-none focus:outline-none'/>
            <button onClick={handleSendMessage} className='w-1/6 chat-head-color chat-button-color'>Send</button>
        </div>
    </div>
  );
};
