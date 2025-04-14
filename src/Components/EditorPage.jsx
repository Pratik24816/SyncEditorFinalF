// import React, { useRef, useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import Client from "./Client";
// import TextEditor from "./TextEditor";
// import { initSocket } from "../socket";
// import logo from '../assets/logo1.gif';
// import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";

// const ACTIONS = {};



// const fetchActions = async () => {
//     try {
//         const res = await fetch("http://localhost:5000/api/actions");
//         const data = await res.json();
//         data.forEach(action => ACTIONS[action.toUpperCase().replace("-", "_")] = action);
//     } catch (error) {
//         console.error("Error fetching actions:", error);
//     }
// };


// // const fetchActions = async () => {
// //     try {
// //         const res = await fetch("https://synceditorfinalb.onrender.com/api/actions");
// //         const data = await res.json();
// //         data.forEach(action => ACTIONS[action.toUpperCase().replace("-", "_")] = action);
// //     } catch (error) {
// //         console.error("Error fetching actions:", error);
// //     }
// // };

// const EditorPage = () => {
//     const socketRef = useRef(null);
//     const location = useLocation();
//     const { roomId } = useParams();
//     const reactNavigator = useNavigate();
//     const [clients, setClients] = useState([]);
    

//     useEffect(() => {
//         const init = async () => {
//             await fetchActions();
//             if (!ACTIONS.JOIN) return;

//             socketRef.current = await initSocket();
//             socketRef.current.on('connect_error', handleErrors);
//             socketRef.current.on('connect_failed', handleErrors);
    
//             function handleErrors(e) {
//                 toast.error('Socket connection failed, try again later.');
//                 reactNavigator('/');
//             }
    
//             socketRef.current.emit(ACTIONS.JOIN, {
//                 roomId,
//                 username: location.state?.username,
//             });
    
//             socketRef.current.on(
//                 ACTIONS.JOINED, 
//                 ({ clients, username, socketId }) => {
//                     if (username !== location.state?.username) {
//                         toast.success(`${username} joined the room.`);
//                     }
//                     setClients(clients.filter(client => client.username));
//                 }
//             );
    
//             socketRef.current.on(
//                 ACTIONS.DISCONNECTED,
//                 ({ socketId, username }) => {
//                     toast.success(`${username} left the room.`);
//                     setClients((prev) => prev.filter(client => client.socketId !== socketId));
//                 }
//             );
//         };
//         init();
    
//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.emit(ACTIONS.DISCONNECTED, { socketId: socketRef.current.id });
//                 socketRef.current.disconnect();
//             }
//         };
//     }, [roomId, location.state?.username]);

//     if (!location.state) {
//         return <Navigate to="/" />;
//     }

//     return (
//         <div className="flex h-screen bg-gray-900 text-white">
//             <div className="flex-grow">
//                 <TextEditor socketRef={socketRef} roomId={roomId} username={location.state?.username} />
//             </div>
//             <div className="w-1/4 bg-gray-800 p-5 border-l border-gray-700 shadow-lg h-screen fixed right-0 top-0 flex flex-col">
//                 <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto flex items-center justify-center">
//                     <img src={logo} alt="Logo" className="w-full h-full" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-center mt-4 mb-2">Connected Users</h3>
//                 <div className="flex flex-col space-y-3 overflow-y-auto max-h-[55vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
//                     {clients.map(client => (
//                         <Client key={client.socketId} username={client.username} socketId={client.socketId} />
//                     ))}
//                 </div>
//                 <div className="mt-auto space-y-2">
//                     <button
//                         onClick={copyRoomId}
//                         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
//                     >
//                         Copy Room ID
//                     </button>
//                     <button
//                         onClick={leaveRoom}
//                         className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
//                     >
//                         Leave Room
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );

//     async function copyRoomId() {
//         try {
//             await navigator.clipboard.writeText(roomId);
//             toast.success("Room ID copied to clipboard!");
//         } catch (err) {
//             toast.error("Failed to copy Room ID.");
//         }
//     }

//     function leaveRoom() {
//         const confirmLeave = window.confirm("Are you sure you want to leave the room?");
//         if (confirmLeave) {
//             if (socketRef.current) {
//                 socketRef.current.emit(ACTIONS.DISCONNECTED, { socketId: socketRef.current.id });
//                 socketRef.current.disconnect();
//             }
//             reactNavigator("/");
//         }
//     }
// };

// export default EditorPage;





// import React, { useRef, useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";
// import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";
// import TextEditor from "./TextEditor";

// const EditorPage = () => {
//     const socketRef = useRef(null);
//     const location = useLocation();
//     const { roomId } = useParams();
//     const reactNavigator = useNavigate();
//     const [clients, setClients] = useState([]);
//     const [showClientPanel, setShowClientPanel] = useState(false);

//     // Fetch actions from the server
//     useEffect(() => {
//         const fetchActions = async () => {
//             try {
//                 const res = await fetch("http://localhost:5000/api/actions");
//                 const data = await res.json();
//                 const ACTIONS = {};
//                 data.forEach(action => ACTIONS[action.toUpperCase().replace("-", "_")] = action);
                
//                 // Initialize socket connection
//                 socketRef.current = io("http://localhost:5000", {
//                     reconnectionAttempts: 5,
//                     reconnectionDelay: 1000,
//                     transports: ["websocket"]
//                 });

//                 socketRef.current.on('connect_error', handleErrors);
//                 socketRef.current.on('connect_failed', handleErrors);
        
//                 function handleErrors(e) {
//                     toast.error('Socket connection failed, try again later.');
//                     reactNavigator('/');
//                 }
        
//                 socketRef.current.emit(ACTIONS.JOIN, {
//                     roomId,
//                     username: location.state?.username,
//                 });
        
//                 socketRef.current.on(
//                     ACTIONS.JOINED, 
//                     ({ clients, username, socketId }) => {
//                         if (username !== location.state?.username) {
//                             toast.success(`${username} joined the room.`);
//                         }
//                         setClients(clients.filter(client => client.username));
//                     }
//                 );
        
//                 socketRef.current.on(
//                     ACTIONS.DISCONNECTED,
//                     ({ socketId, username }) => {
//                         toast.success(`${username} left the room.`);
//                         setClients((prev) => prev.filter(client => client.socketId !== socketId));
//                     }
//                 );
//             } catch (error) {
//                 console.error("Error fetching actions:", error);
//                 toast.error("Failed to connect to the server.");
//             }
//         };

//         fetchActions();
    
//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.disconnect();
//             }
//         };
//     }, [roomId, location.state?.username, reactNavigator]);

//     async function copyRoomId() {
//         try {
//             await navigator.clipboard.writeText(roomId);
//             toast.success("Room ID copied to clipboard!");
//         } catch (err) {
//             toast.error("Failed to copy Room ID.");
//         }
//     }

//     function leaveRoom() {
//         const confirmLeave = window.confirm("Are you sure you want to leave the room?");
//         if (confirmLeave) {
//             if (socketRef.current) {
//                 socketRef.current.disconnect();
//             }
//             reactNavigator("/");
//         }
//     }

//     // Redirect if not coming from home page
//     if (!location.state) {
//         return <Navigate to="/" />;
//     }

//     return (
//         <div className="flex h-screen bg-slate-900 text-white relative">
//             {/* Main Editor */}
//             <div className="flex-grow">
//                 <TextEditor socketRef={socketRef} roomId={roomId} username={location.state?.username} />
//             </div>
            
//             {/* Users Panel Button */}
//             <button
//                 className={`fixed top-4 right-4 z-10 bg-indigo-600 hover:bg-indigo-700 rounded-full p-3 transition-all duration-300 ${showClientPanel ? 'opacity-50' : ''}`}
//                 onClick={() => setShowClientPanel(!showClientPanel)}
//                 title={showClientPanel ? "Hide Users" : "Show Users"}
//             >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
//                     <circle cx="9" cy="7" r="4"></circle>
//                     <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
//                     <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
//                 </svg>
//             </button>
            
//             {/* Document Controls Button */}
//             <button
//                 className="fixed top-20 right-4 z-10 bg-blue-600 hover:bg-blue-700 rounded-full p-3 transition-all duration-300"
//                 onClick={copyRoomId}
//                 title="Copy Room ID"
//             >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//                     <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//                 </svg>
//             </button>
            
//             {/* Exit Button */}
//             <button
//                 className="fixed top-36 right-4 z-10 bg-red-600 hover:bg-red-700 rounded-full p-3 transition-all duration-300"
//                 onClick={leaveRoom}
//                 title="Leave Room"
//             >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
//                     <polyline points="16 17 21 12 16 7"></polyline>
//                     <line x1="21" y1="12" x2="9" y2="12"></line>
//                 </svg>
//             </button>
            
//             {/* Sliding Users Panel */}
//             <div className={`fixed top-0 right-0 h-full bg-slate-800 shadow-lg transition-all duration-300 transform ${showClientPanel ? 'translate-x-0' : 'translate-x-full'} w-72 z-20 border-l border-slate-700`}>
//                 <div className="p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-xl font-semibold text-white">Connected Users</h2>
//                         <button 
//                             className="text-gray-400 hover:text-white"
//                             onClick={() => setShowClientPanel(false)}
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <line x1="18" y1="6" x2="6" y2="18"></line>
//                                 <line x1="6" y1="6" x2="18" y2="18"></line>
//                             </svg>
//                         </button>
//                     </div>
                    
//                     <div className="space-y-3">
//                         {clients.map(client => (
//                             <div key={client.socketId} className="flex items-center p-2 rounded-lg hover:bg-slate-700">
//                                 <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
//                                     {client.username.charAt(0).toUpperCase()}
//                                 </div>
//                                 <div className="ml-3">
//                                     <p className="text-white font-medium">{client.username}</p>
//                                     <div className="flex items-center">
//                                         <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
//                                         <p className="text-green-400 text-xs">Active</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
                    
//                     <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
//                         <div className="text-center mb-2 text-sm text-slate-400">Room ID: {roomId}</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditorPage;


// // EditorPage.jsx
// import React, { useRef, useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import Client from "./Client";
// import TextEditor from "./TextEditor";
// import { initSocket } from "../socket";
// import logo from '../assets/logo1.gif';
// import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";

// const ACTIONS = {};

// const fetchActions = async () => {
//     try {
//         const res = await fetch("http://localhost:5000/api/actions");
//         const data = await res.json();
//         data.forEach(action => ACTIONS[action.toUpperCase().replace("-", "_")] = action);
//     } catch (error) {
//         console.error("Error fetching actions:", error);
//     }
// };

// const EditorPage = () => {
//     const socketRef = useRef(null);
//     const location = useLocation();
//     const { roomId } = useParams();
//     const reactNavigator = useNavigate();
//     const [clients, setClients] = useState([]);

//     useEffect(() => {
//         const init = async () => {
//             await fetchActions();
//             if (!ACTIONS.JOIN) return;

//             socketRef.current = await initSocket();
//             socketRef.current.on('connect_error', handleErrors);
//             socketRef.current.on('connect_failed', handleErrors);
    
//             function handleErrors(e) {
//                 toast.error('Socket connection failed, try again later.');
//                 reactNavigator('/');
//             }
    
//             socketRef.current.emit(ACTIONS.JOIN, {
//                 roomId,
//                 username: location.state?.username,
//             });
    
//             socketRef.current.on(
//                 ACTIONS.JOINED, 
//                 ({ clients, username, socketId }) => {
//                     if (username !== location.state?.username) {
//                         toast.success(`${username} joined the room.`);
//                     }
//                     setClients(clients.filter(client => client.username));
//                 }
//             );
    
//             socketRef.current.on(
//                 ACTIONS.DISCONNECTED,
//                 ({ socketId, username }) => {
//                     toast.success(`${username} left the room.`);
//                     setClients((prev) => prev.filter(client => client.socketId !== socketId));
//                 }
//             );
//         };
//         init();
    
//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.emit(ACTIONS.DISCONNECTED, { socketId: socketRef.current.id });
//                 socketRef.current.disconnect();
//             }
//         };
//     }, [roomId, location.state?.username]);

//     if (!location.state) {
//         return <Navigate to="/" />;
//     }

//     const copyRoomId = async () => {
//         try {
//             await navigator.clipboard.writeText(roomId);
//             toast.success("Room ID copied to clipboard!");
//         } catch (err) {
//             toast.error("Failed to copy Room ID.");
//         }
//     };

//     const leaveRoom = () => {
//         const confirmLeave = window.confirm("Are you sure you want to leave the room?");
//         if (confirmLeave) {
//             reactNavigator("/");
//         }
//     };

//     return (
//         <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
//             {/* Header */}
//             <div className="bg-gray-800 py-4 px-6 border-b border-gray-700 flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                     <img src={logo} alt="SyncEditor" className="w-12 h-12 rounded-full" />
//                     <div>
//                         <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                             SyncEditor
//                         </h1>
//                         <p className="text-gray-400 text-sm">Real-time Collaborative Editing</p>
//                     </div>
//                 </div>
                
//                 <div className="flex items-center space-x-4">
//                     <div className="bg-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
//                         <span className="text-blue-400">Room ID:</span>
//                         <span className="font-mono">{roomId}</span>
//                     </div>
//                     <button
//                         onClick={copyRoomId}
//                         className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
//                     >
//                         <span>📋</span>
//                         <span>Copy Invite</span>
//                     </button>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="flex flex-1 overflow-hidden">
//                 {/* Editor Area */}
//                 <div className="flex-1 flex flex-col">
//                     <TextEditor socketRef={socketRef} roomId={roomId} username={location.state?.username} />
//                 </div>

//                 {/* Collaborators Panel */}
//                 <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
//                     <div className="p-6 border-b border-gray-700">
//                         <h3 className="text-lg font-semibold mb-4">Active Collaborators ({clients.length})</h3>
//                         <div className="space-y-3">
//                             {clients.map(client => (
//                                 <Client 
//                                     key={client.socketId} 
//                                     username={client.username} 
//                                     status={client.status}
//                                     lastActive={client.lastActive}
//                                 />
//                             ))}
//                         </div>
//                     </div>
                    
//                     <div className="p-6 mt-auto border-t border-gray-700">
//                         <button
//                             onClick={leaveRoom}
//                             className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg transition-all flex items-center justify-center space-x-2"
//                         >
//                             <span>🚪</span>
//                             <span>Leave Room</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


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

