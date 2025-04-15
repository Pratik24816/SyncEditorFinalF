import React, { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Client from "./Client";
import TextEditor from "./TextEditor";
import { initSocket } from "../socket";
import logo from '../assets/logo1.gif';
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";

const ACTIONS = {};



// const fetchActions = async () => {
//     try {
//         const res = await fetch("http://localhost:5000/api/actions");
//         const data = await res.json();
//         data.forEach(action => ACTIONS[action.toUpperCase().replace("-", "_")] = action);
//     } catch (error) {
//         console.error("Error fetching actions:", error);
//     }
// };


const fetchActions = async () => {
    try {
        const res = await fetch("https://synceditorfinalb.onrender.com/api/actions");
        const data = await res.json();
        data.forEach(action => ACTIONS[action.toUpperCase().replace("-", "_")] = action);
    } catch (error) {
        console.error("Error fetching actions:", error);
    }
};

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [showCollaborators, setShowCollaborators] = useState(true)
  
    // Add this function to toggle the collaborators panel
    const toggleCollaborators = () => {
      setShowCollaborators(prev => !prev)
    }
    

    useEffect(() => {
        const init = async () => {
            await fetchActions();
            if (!ACTIONS.JOIN) return;

            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);
    
            function handleErrors(e) {
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
            }
        };
    }, [roomId, location.state?.username]);

    if (!location.state) {
        return <Navigate to="/" />;
    }

    // Handle browser/tab closing
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = ''; // This is required for Chrome
            return 'Are you sure you want to leave?'; // This is for other browsers
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy Room ID.");
        }
    }

    function leaveRoom() {
        const confirmLeave = window.confirm("Are you sure you want to leave the room?");
        if (confirmLeave) {
            if (socketRef.current) {
                socketRef.current.emit(ACTIONS.DISCONNECTED, { socketId: socketRef.current.id });
                socketRef.current.disconnect();
            }
            reactNavigator("/");
        }
    }

    return (
        <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
          {/* Header */}
          <header className="bg-gray-900 py-4 px-6 border-b border-indigo-900 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                SE
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Write. Collaborate. Elevate.
                </h1>
                <p className="text-gray-400 text-sm">Your Words, Synchronized.</p>
              </div>
            </div>
    
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                <span className="text-indigo-400">Room ID:</span>
                <span className="font-mono">{roomId}</span>
              </div>
              <button
                onClick={copyRoomId}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
              >
                <span>📋</span>
                <span>Copy Invite</span>
              </button>
            </div>
          </header>
    
          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Editor Area */}
            <div className="flex-1 flex flex-col p-4">
              <TextEditor socketRef={socketRef} roomId={roomId} username={location.state?.username} />
            </div>
    
            {/* Collaborators Panel */}
            <div
              className={`${showCollaborators ? "w-80" : "w-12"} bg-gray-900 border-l border-indigo-900 flex flex-col transition-all duration-300`}
            >
              <button
                onClick={toggleCollaborators}
                className="p-3 text-indigo-400 hover:text-indigo-300 transition-colors self-end"
              >
                {showCollaborators ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                )}
              </button>
    
              {showCollaborators && (
                <>
                  <div className="p-6 border-b border-indigo-900">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-300">Connected Users ({clients.length})</h3>
                    <div className="space-y-3">
                      {clients.map((client) => (
                        <Client
                          key={client.socketId}
                          username={client.username}
                          status={client.status}
                          lastActive={client.lastActive}
                        />
                      ))}
                    </div>
                  </div>
    
                  <div className="p-6 mt-auto border-t border-indigo-900">
                    <button
                      onClick={leaveRoom}
                      className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <span>🚪</span>
                      <span>Leave Room</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )
    }
    
    export default EditorPage

