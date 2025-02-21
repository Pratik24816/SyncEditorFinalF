import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { useNavigate } from "react-router-dom";
import video1 from "../assets/video1.mp4";
import video3 from "../assets/video3.mp4";
import toast from "react-hot-toast";

const HeroSection = () => {
  const navigate = useNavigate();
  const [popupType, setPopupType] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [generatedRoomId, setGeneratedRoomId] = useState("");

  // Handle "Create Room"
  // const handleCreateRoom = () => {
  //   const newRoomId = uuidV4();
  //   setGeneratedRoomId(newRoomId);
  //   setPopupType("create");
  // };

  const generateShortRoomId = () => {
    return Math.random().toString(36).substring(2, 12); // Generates a 10-character string
  };

  const handleCreateRoom = () => {
    const newRoomId = generateShortRoomId();
    setGeneratedRoomId(newRoomId);
    setPopupType("create");
  };

  // Handle "Join Room"
  const handleJoinRoom = () => {
    setPopupType("join");
  };

  // Navigate to the room
  const goToRoom = (room) => {
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!room.trim()) {
      toast.error("Room ID is required");
      return;
    }
  
    console.log("Navigating to:", `/documents/${room}`); // Debugging
    navigate(`/documents/${room}`, {
      state: { username, roomId: room },
    });
  };
  

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide text-white">
        Real-time text editing
        <span className="bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text">
          {" "}for developers
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        "Collaborate effortlessly and transform your ideas into reality with our
        real-time text editor."
      </p>
      <div className="flex justify-center my-10">
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-700 py-3 px-4 mx-3 rounded-md text-white"
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
        <button
          className="py-3 px-4 mx-3 rounded-md border text-white"
          onClick={handleJoinRoom}
        >
          Join Room
        </button>
      </div>
      <div className="flex mt-10 justify-center">
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-blue-700 shadow-lg mx-2 my-4"
        >
          <source src={video1} type="video/mp4" />
        </video>
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-blue-700 shadow-lg mx-2 my-4"
        >
          <source src={video3} type="video/mp4" />
        </video>
      </div>

      {/* Popup for Create Room & Join Room */}
      {popupType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center w-96">
            <h2 className="text-2xl font-bold mb-4 text-white">
              {popupType === "create" ? "Create Room" : "Join a Room"}
            </h2>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 rounded w-full mb-4 bg-gray-800 text-white"
            />
            {popupType === "join" ? (
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="border p-2 rounded w-full mb-4 bg-gray-800 text-white"
              />
            ) : (
              <div className="flex items-center justify-center mb-4">
                <input
                  type="text"
                  value={generatedRoomId}
                  readOnly
                  className="font-mono px-3 py-2 border rounded w-full text-center bg-gray-800 text-white"
                />
                <button
                  className="ml-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedRoomId);
                    toast.success("Room ID copied!");
                  }}
                >
                  Copy
                </button>
              </div>
            )}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full mb-2"
              onClick={() => goToRoom(popupType === "create" ? generatedRoomId : roomId)}
            >
              {popupType === "create" ? "Go to Room" : "Join Room"}
            </button>
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 w-full"
              onClick={() => setPopupType(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
