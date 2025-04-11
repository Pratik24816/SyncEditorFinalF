import { io } from 'socket.io-client';
// const SOCKET_SERVER_URL = "http://localhost:5000"; 
const SOCKET_SERVER_URL = "https://synceditorfinalb.onrender.com";


export const initSocket = async () => {
    const options = {
        forceNew: true,  // Fixing key name
        reconnectionAttempts: Infinity, // Fixing key name
        timeout: 10000,
        transports: ['websocket'],
    };

    try {
        const socket = io(SOCKET_SERVER_URL, options);
        
        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });

        return socket;
    } catch (error) {
        console.error("Socket connection failed:", error);
    }
};
