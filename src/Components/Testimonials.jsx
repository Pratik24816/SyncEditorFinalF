// import { testimonials } from "../constants";

// const Testimonials = () => {
//   return (
//     <div className="mt-20 tracking-wide">
//       <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20 text-white">
//         What People are saying
//       </h2>
//       <div className="flex flex-wrap justify-center">
//         {testimonials.map((testimonial, index) => (
//           <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2 text-white">
//             <div className="bg-neutral-900 rounded-md p-6 text-md border border-neutral-800 font-thin">
//               <p>{testimonial.text}</p>
//               <div className="flex mt-8 items-start">
//                 <img
//                   className="w-12 h-12 mr-6 rounded-full border border-neutral-300"
//                   src={testimonial.image}
//                   alt=""
//                 />
//                 <div>
//                   <h6>{testimonial.user}</h6>
//                   <span className="text-sm font-normal italic text-neutral-600">
//                     {testimonial.company}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Testimonials;


import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { testimonials } from "../constants";

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
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const textGradient = "bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 dark:from-blue-300 dark:via-blue-400 dark:to-indigo-500 text-transparent bg-clip-text";

const Testimonials = () => {
  return (
    <div className="relative mt-24 py-24 tracking-wide overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-20 w-96 h-96 bg-blue-700 rounded-full filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-20 w-80 h-80 bg-indigo-600 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-20"
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
            <Star className="w-4 h-4 text-yellow-300" />
            <span>Testimonials</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white">
            What <span className={textGradient}>People</span> are saying
          </h2>
          
          <motion.p
            className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Don't just take our word for it — see what users around the world have experienced with our platform
          </motion.p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="w-full sm:w-1/2 lg:w-1/3 px-6 py-6 text-white"
              variants={itemVariants}
            >
              <motion.div 
                className="relative bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 backdrop-blur-md rounded-xl p-8 border border-neutral-800 shadow-xl h-full flex flex-col"
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.3), 0 0 15px rgba(59, 130, 246, 0.2)",
                  borderColor: "rgba(59, 130, 246, 0.4)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Quote icon */}
                <div className="absolute -top-4 -left-2">
                  <div className="p-2 rounded-full bg-blue-600/20 border border-blue-500/30">
                    <Quote className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                
                {/* Rating stars */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <p className="text-lg leading-relaxed text-neutral-300 flex-grow">
                  "{testimonial.text}"
                </p>
                
                <div className="flex mt-8 items-center pt-4 border-t border-neutral-800">
                  <div className="relative">
                    <img
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                      src={testimonial.image}
                      alt={`${testimonial.user} profile`}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-neutral-900"></div>
                  </div>
                  
                  <div className="ml-4">
                    <h6 className="font-semibold">{testimonial.user}</h6>
                    <span className="text-sm text-blue-400">
                      {testimonial.company}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="container mx-auto px-4 mt-20"
      >
        
      </motion.div>
      
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
              y: [-50, -120, -50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 8 + 15,
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
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Testimonials;


