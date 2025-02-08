import React, { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Client from "./Client";
import TextEditor from "./TextEditor";
import { initSocket } from "../socket";
import { ACTIONS } from "../../Action.js";
import logo from '../assets/logo1.gif'
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);
    
            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }
    
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });
    
            // Listen for JOINED event (only users from this room)
            socketRef.current.on(
                ACTIONS.JOINED, 
                ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                }
                setClients(clients.filter(client => client.username)); // ✅ Remove "Unknown User"
            });
    
            // Listen for DISCONNECTED event
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                 ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => {
                    return prev.filter(
                        (client) => client.socketId !== socketId)
                 });
            });
        };
        init();
    
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, []); // Ensure it updates when roomId changes

    // Copy Room ID
    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy Room ID.");
        }
    };

    // Leave Room
    const leaveRoom = () => {
        if (socketRef.current) {
            socketRef.current.emit(ACTIONS.DISCONNECTED, { socketId: socketRef.current.id });
            socketRef.current.disconnect();
        }
        reactNavigator("/");
    };

    // If no username is found in location state, navigate to home
    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Main Editor Section */}
            <div className="flex-grow"><TextEditor socketRef={socketRef} roomId={roomId} username={location.state?.username} />
            </div>

            {/* Sidebar */}
            <div className="w-1/4 bg-gray-800 p-5 border-l border-gray-700 shadow-lg h-screen fixed right-0 top-0 flex flex-col">
                {/* Logo Placeholder */}
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-full h-full" />
                </div>

                {/* Connected Users */}
                <h3 className="text-xl font-semibold text-center mt-4 mb-2">Connected Users</h3>
                <div className="flex flex-col space-y-3 overflow-y-auto max-h-[55vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {clients.map(client => (
                        <div key={client.socketId} className="flex items-center space-x-3 bg-gray-700 p-2 rounded-lg">
                            <div className="w-10 h-10 flex items-center justify-center bg-red-600 text-white font-bold rounded-full">
                                {client.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-300">{client.username}</span>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="mt-auto space-y-2">
                    <button
                        onClick={copyRoomId}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
                    >
                        Copy Room ID
                    </button>
                    <button
                        onClick={leaveRoom}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
                    >
                        Leave Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
