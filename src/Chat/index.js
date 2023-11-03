import React, { useEffect, useState } from 'react';

const Chat = ({ messages }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const formatTime = (messageTime) => {
        const timeDifference = (currentTime - new Date(messageTime)) / 60000;
        if (timeDifference < 1) {
            return 'Just Now';
        } else {
            return `${Math.floor(timeDifference)} minutes ago`;
        }
    };

    return (
        <div className="chat-container flex-col">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`p-2 m-2 rounded-lg`}
                    style={{
                        maxWidth: '100%',
                        textAlign: message.type === 'USER' ? 'right' : 'left',
                        alignSelf: message.type === 'USER' ? 'flex-end' : 'flex-start',
                    }}
                >
                    <div className={`text-xs mb-1`}>
                        {message.senderName}
                    </div>
                    <div
                        className={`text-base rounded-lg px-3 py-1`}
                        style={{
                            background: message.type === 'USER' ? '#3498db' : '#2ecc71',
                            color: message.type === 'USER' ? 'white' : 'black',
                            display: "inline-flex",
                            maxWidth: '100%',
                            overflow:"auto",
                            wordWrap: "break-word"
                        }}
                    >
                        {message.chatText}
                    </div>
                    <div className={`text-xs mt-1`}>
                        {formatTime(message.timeSent)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Chat;
