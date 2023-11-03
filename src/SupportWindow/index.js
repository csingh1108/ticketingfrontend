import React, { useEffect, useState, useRef } from 'react';
import UserSubmit from "../UserSubmit";
import Chat from "../Chat";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;

const SupportWindow = () => {
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatText, setChatText] = useState('');
    const size = [window.innerWidth, window.innerHeight];
    const chatContainerRef = useRef();

    const handleUsernameSubmit = (username) => {
        setUsername(username);
    };

    useEffect(() => {
        if (username) {
            let Sock = new SockJS('http://localhost:8080/support');
            stompClient = over(Sock);
            stompClient.connect({}, onConnected, onError);
        }
    }, [username]);

    useEffect(() => {
        window.addEventListener('beforeunload', handleCloseWebSocket);

        return () => {
            window.removeEventListener('beforeunload', handleCloseWebSocket);
        };
    }, []);

    const onConnected = () => {
        if (username) {
            const welcomeMessage = "Welcome " + username + ". How can I help you?";
            const newMessage = {
                chatText: welcomeMessage,
                senderName: "SupportBot",
                timeSent: new Date().toLocaleString(),
                type: "SYSTEM",
            };
            stompClient.subscribe("/support/chat", onMessageRecieved);
            setMessages([...messages, newMessage]);
        }
    };

    const onError = (err) => {
        console.error(err);
    };

    const onMessageRecieved = (payload) => {
        var payloadData = JSON.parse(payload.body);
        setMessages([...messages, payloadData.chatText]);
    }

    const handleCloseWebSocket = () => {
        if (stompClient) {
            stompClient.disconnect(() => {
            });
        }
    };

    const handleSendMessage = () => {
        if (stompClient) {
            if (chatText.trim() !== '') {
                const newMessage = {
                    chatText,
                    senderName: username,
                    timeSent: new Date().toLocaleString(),
                    type: 'USER',
                };
                stompClient.send("/support/sendMessage", {}, JSON.stringify(newMessage));
                onMessageRecieved();
                setChatText('');
            }
        } else {
            console.error("WebSocket connection is not established yet.");
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleWindowResize = () => {
        window.resizeTo(size[0], size[1]);
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);


    return (
        <div className="min-h-screen flex flex-col">
            {!username ? (
                <UserSubmit onUsernameSubmit={handleUsernameSubmit} />
            ) : (
                <div
                    className="flex-grow flex flex-col-reverse max-w-md w-full p-4"
                    ref={chatContainerRef}
                    style={{ overflowY: 'auto', maxHeight: '80vh' }}
                >
                    <Chat messages={messages} />
                </div>
            )}
            {!username ? (
                <> </>
            ): (
                <div className="w-full bg-gray-200 p-4">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={chatText}
                            onChange={(e) => setChatText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="flex-grow p-2 border rounded-l focus:outline-none focus:ring focus:border-teal-400"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="p-2 bg-teal-500 text-white rounded-r hover:bg-teal-600 focus:outline-none focus:ring focus:border-teal-400 h-10 ml-2"
                        >
                            Enter
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportWindow;
