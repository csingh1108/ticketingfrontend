import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import NewWindow from "react-new-window";

const TicketMenu = () => {

    const [chatWindows, setChatWindows] = useState([]);

    const openChat = () => {
        const newChatWindow = (
            <NewWindow
                key={chatWindows.length}
                name={`Support Chat ${chatWindows.length + 1}`}
                title="Support Chat"
                center="parent"
                url="http://localhost:3000/support"
                features={{width:450, height:600}}
                onClose={() => closeChat(chatWindows.length)}
            />
        );
        setChatWindows([...chatWindows, newChatWindow]);
    };

    const closeChat = (index) => {
        const updatedChatWindows = chatWindows.filter((_, i) => i !== index);
        setChatWindows(updatedChatWindows);
    };

    return (
        <>
        <div className="bg-slate-500 p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-4 ml-4 sm:ml-12 md:ml-24 lg:ml-32">
                <div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="p-2 rounded border bg-white focus:outline-none focus:ring focus:border-teal-400 w-full"
                    />
                </div>
                <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 hover:text-gray-700">
                    Search
                </button>
            </div>
            <ul className="flex space-x-4 sm:space-x-8 md:space-x-10 lg:space-x-12">
                <li>
                    <Link to="/" className="hover:underline hover:text-teal-800 font-bold">
                        Home
                    </Link>
                </li>
                <li>
                    <span
                        className="hover:underline hover:text-teal-800 font-bold hover:cursor-pointer"
                        onClick={openChat}
                    >
                        Support
                    </span>
                </li>
                <li>
                    <Link to="/dashboard" className="hover:underline hover:text-teal-800 font-bold">
                        Dashboard
                    </Link>
                </li>
            </ul>
        </div>
    <div>
        {chatWindows}
    </div>
    </>
    );
};

export default TicketMenu;
