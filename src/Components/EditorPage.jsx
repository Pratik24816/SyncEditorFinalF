import React, { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Client from "./Client";
import TextEditor from "./TextEditor";
import { initSocket } from "../socket";
import logo from '../assets/logo1.gif';
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";

const ACTIONS = {};

const fetchActions = async () => {
    try {
        const res = await fetch("https://synceditorbec.onrender.com/api/actions");
        const data = await res.json();
        data.forEach(action => ACTIONS[action.toUpperCase().replace("-", "_")] = action);
        console.log("✅ Actions Loaded:", ACTIONS);
    } catch (error) {
        console.error("❌ Error fetching actions:", error);
    }
};

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            await fetchActions();
            if (!ACTIONS.JOIN) return;

            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);
    
            function handleErrors(e) {
                console.log('Socket error:', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }
    
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });
    
            socketRef.current.on(
                ACTIONS.JOINED, 
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                    }
                    setClients(clients.filter(client => client.username));
                }
            );
    
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => prev.filter(client => client.socketId !== socketId));
                }
            );
        };
        init();
    
        return () => {
            if (socketRef.current) {
                socketRef.current.emit(ACTIONS.DISCONNECTED, { socketId: socketRef.current.id });
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            }
        };
    }, [roomId, location.state?.username]);

    // Handle browser/tab closing
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = ''; // This is required for Chrome
            return 'Are you sure you want to leave? Your changes may not be saved.'; // This is for other browsers
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy Room ID.");
        }
    };

    const leaveRoom = () => {
        const confirmLeave = window.confirm("Are you sure you want to leave the room?");
        if (confirmLeave) {
            if (socketRef.current) {
                socketRef.current.emit(ACTIONS.DISCONNECTED, { socketId: socketRef.current.id });
                socketRef.current.disconnect();
            }
            reactNavigator("/");
        }
    };

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <div className="flex-grow">
                <TextEditor socketRef={socketRef} roomId={roomId} username={location.state?.username} />
            </div>
            <div className="w-1/4 bg-gray-800 p-5 border-l border-gray-700 shadow-lg h-screen fixed right-0 top-0 flex flex-col">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                    <img src={logo} alt="Logo" className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold text-center mt-4 mb-2">Connected Users</h3>
                <div className="flex flex-col space-y-3 overflow-y-auto max-h-[55vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {clients.map(client => (
                        <Client key={client.socketId} username={client.username} />
                    ))}
                </div>
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