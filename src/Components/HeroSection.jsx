import React, { useState, useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import { useNavigate } from "react-router-dom";
import video1 from "../assets/video1.mp4";
import video3 from "../assets/video3.mp4";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const HeroSection = () => {
  const navigate = useNavigate();
  const [popupType, setPopupType] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [generatedRoomId, setGeneratedRoomId] = useState("");
  const [isHoveringCreate, setIsHoveringCreate] = useState(false);
  const [isHoveringJoin, setIsHoveringJoin] = useState(false);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const generateShortRoomId = () => {
    return Math.random().toString(36).substring(2, 12);
  };

  const handleCreateRoom = () => {
    const newRoomId = generateShortRoomId();
    setGeneratedRoomId(newRoomId);
    setPopupType("create");
  };

  const handleJoinRoom = () => {
    setPopupType("join");
  };

  const goToRoom = (room) => {
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!room.trim()) {
      toast.error("Room ID is required");
      return;
    }
  
    navigate(`/documents/${room}`, {
      state: { username, roomId: room },
    });
  };

  return (
    <div className="relative flex flex-col items-center mt-6 lg:mt-20 min-h-screen overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#3b82f6",
              },
              links: {
                color: "#3b82f6",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 60,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-4">
        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl tracking-wide text-white font-bold">
            Real-time text editing
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
              {" "}for developers
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-10 text-lg text-center text-neutral-300 max-w-4xl mx-auto"
          >
            "Collaborate effortlessly and transform your ideas into reality with our
            real-time text editor."
          </motion.p>
        </motion.div>

        {/* Animated Buttons */}
        <motion.div 
          className="flex justify-center my-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="relative bg-gradient-to-r from-blue-500 to-blue-700 py-3 px-6 mx-3 rounded-md text-white font-medium text-lg overflow-hidden"
            onClick={handleCreateRoom}
            onHoverStart={() => setIsHoveringCreate(true)}
            onHoverEnd={() => setIsHoveringCreate(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isHoveringCreate && (
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />
            )}
            <span className="relative z-10">Create Room</span>
          </motion.button>

          <motion.button
            className="relative py-3 px-6 mx-3 rounded-md border-2 border-blue-500 text-white font-medium text-lg overflow-hidden"
            onClick={handleJoinRoom}
            onHoverStart={() => setIsHoveringJoin(true)}
            onHoverEnd={() => setIsHoveringJoin(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isHoveringJoin && (
              <motion.span
                className="absolute inset-0 bg-blue-500 bg-opacity-10"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />
            )}
            <span className="relative z-10">Join Room</span>
          </motion.button>
        </motion.div>

        {/* Video Showcase */}
        <motion.div 
          className="flex flex-col lg:flex-row mt-10 justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative rounded-lg overflow-hidden border-2 border-blue-500 shadow-xl"
          >
            <video
              autoPlay
              loop
              muted
              className="w-full h-auto"
            >
              <source src={video1} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-4 left-4 text-white font-medium">
              Real-time Collaboration
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative rounded-lg overflow-hidden border-2 border-blue-500 shadow-xl"
          >
            <video
              autoPlay
              loop
              muted
              className="w-full h-auto"
            >
              <source src={video3} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-4 left-4 text-white font-medium">
              Live Cursor Presence
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {[
            {
              icon: "🚀",
              title: "Instant Collaboration",
              desc: "Work together in real-time with no delays"
            },
            {
              icon: "👥",
              title: "Live Cursors",
              desc: "See where others are editing in real-time"
            },
            {
              icon: "💾",
              title: "Auto Save",
              desc: "Your work is saved automatically every few seconds"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {popupType && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md border border-blue-500"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <motion.h2 
                className="text-2xl font-bold mb-6 text-white text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {popupType === "create" ? "Create Room" : "Join a Room"}
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-gray-700 p-3 rounded-lg w-full mb-4 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {popupType === "join" ? (
                  <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="border border-gray-700 p-3 rounded-lg w-full mb-4 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center mb-4">
                    <input
                      type="text"
                      value={generatedRoomId}
                      readOnly
                      className="font-mono px-3 py-3 border border-gray-700 rounded-lg w-full text-center bg-gray-800 text-white"
                    />
                    <motion.button
                      className="ml-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedRoomId);
                        toast.success("Room ID copied!");
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Copy
                    </motion.button>
                  </div>
                )}
              </motion.div>

              <div className="flex flex-col space-y-3 mt-6">
                <motion.button
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  onClick={() => goToRoom(popupType === "create" ? generatedRoomId : roomId)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {popupType === "create" ? "Go to Room" : "Join Room"}
                </motion.button>
                <motion.button
                  className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  onClick={() => setPopupType(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroSection;

