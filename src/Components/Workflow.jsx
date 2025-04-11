// import { CheckCircle2 } from "lucide-react";
// import codeImg from "../assets/code2.jpg";
// import { checklistItems } from "../constants";

// const Workflow = () => {
//   return (
//     <div className="mt-20">
//       <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide text-white">
//         Accelerate your{" "}
//         <span className="bg-gradient-to-r from-blue-500 to-blue-800 dark:from-blue-400 dark:to-blue-700 text-transparent bg-clip-text">
//           texting workflow.
//         </span>
//       </h2>
//       <div className="flex flex-wrap justify-center">
//         <div className="p-2 w-50 lg:w-1/2">
//           <img src={codeImg} alt="Coding" />
//         </div>
//         <div className="pt-12 w-full lg:w-1/2">
//           {checklistItems.map((item, index) => (
//             <div key={index} className="flex mb-12 text-white">
//               <div className="text-green-400 mx-6 bg-neutral-900 h-10 w-10 p-2 justify-center items-center rounded-full">
//                 <CheckCircle2 />
//               </div>
//               <div>
//                 <h5 className="mt-1 mb-2 text-xl">{item.title}</h5>
//                 <p className="text-md text-neutral-500">{item.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Workflow;


import { motion } from "framer-motion";
import { CheckCircle2, Zap, ArrowRight } from "lucide-react";
import codeImg from "../assets/code2.jpg";
import { checklistItems } from "../constants";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const textGradient = "bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 dark:from-blue-300 dark:via-blue-400 dark:to-indigo-500 text-transparent bg-clip-text";

const Workflow = () => {
  return (
    <div className="relative mt-32 py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-700 rounded-full filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-indigo-600 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-600/80 shadow-lg shadow-blue-500/20 text-white bg-gradient-to-r from-blue-900/60 to-blue-700/60 backdrop-blur-md mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-4 h-4 text-blue-300" />
            <span>Workflow Optimization</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-white">
            Accelerate your{" "}
            <span className={textGradient}>
              texting workflow.
            </span>
          </h2>
          
          <motion.p
            className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Our platform streamlines your processes with intuitive tools designed for maximum productivity
          </motion.p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center">
          <motion.div 
            className="p-4 w-full lg:w-1/2 mb-10 lg:mb-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Image wrapper with animated border */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500/30 shadow-2xl shadow-blue-900/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-transparent z-10"></div>
                <img 
                  src={codeImg} 
                  alt="Coding Interface" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                
                {/* Animated glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 animate-glow"></div>
              </div>
              
              {/* Floating badge */}
              <motion.div
                className="absolute -right-5 -bottom-5 bg-gradient-to-br from-blue-700 to-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg border border-blue-500/50"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  delay: 0.8,
                  damping: 10
                }}
              >
                <span className="font-bold">100% Faster</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="pt-6 w-full lg:w-1/2 pl-0 lg:pl-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {checklistItems.map((item, index) => (
              <motion.div 
                key={index} 
                className="mb-10"
                variants={itemVariants}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <motion.div 
                      className="flex justify-center items-center h-12 w-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-700/20 border border-green-500/30 shadow-lg shadow-green-500/10 mr-6"
                      whileHover={{ 
                        scale: 1.1,
                        backgroundColor: "rgba(34, 197, 94, 0.2)"
                      }}
                    >
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </motion.div>
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-white mb-3">{item.title}</h5>
                    <p className="text-neutral-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                
                {/* Connector line if not the last item */}
                {index < checklistItems.length - 1 && (
                  <div className="ml-6 pl-6 border-l-2 border-dashed border-green-500/30 h-6 mt-2"></div>
                )}
              </motion.div>
            ))}
            
            {/* Call to action button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="ml-18 mt-10"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  x: 5
                }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-700/20"
              >
                Get Started 
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500 opacity-20"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        .bg-grid-pattern {
          background-size: 30px 30px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 30px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 25s infinite;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.1; }
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Workflow;


