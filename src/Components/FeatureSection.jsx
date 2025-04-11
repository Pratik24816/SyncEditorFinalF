import { motion } from "framer-motion";
import { features } from "../constants/index.jsx";

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const FeatureSection = () => {
  return (
    <div className="relative mt-20 border-b border-neutral-800 min-h-[800px] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-900 rounded-full filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.span
          className="inline-block px-4 py-2 rounded-lg border border-blue-700 dark:border-blue-500 shadow-sm shadow-blue-400 dark:shadow-blue-600 text-white bg-gradient-to-r from-blue-900/30 to-blue-800/30 backdrop-blur-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Features
        </motion.span>
        <motion.h2 
          className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide text-white"
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Easily build{" "}
          <span className="bg-gradient-to-r from-blue-500 to-blue-800 dark:from-blue-400 dark:to-blue-700 text-transparent bg-clip-text">
            your Text
          </span>
        </motion.h2>
      </motion.div>

      <motion.div 
        className="flex flex-wrap mt-10 lg:mt-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index} 
            className="w-full sm:w-1/2 lg:w-1/3 p-4"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex h-full p-6 bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 rounded-xl border border-neutral-800 hover:border-blue-500 transition-all duration-300 backdrop-blur-sm">
              <div className="flex-shrink-0">
                <motion.div 
                  className="flex mx-6 h-12 w-12 p-2 bg-neutral-900 text-blue-500 justify-center items-center rounded-full border border-blue-500/30"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
              </div>
              <div className="ml-4">
                <h5 className="mt-1 mb-4 text-xl font-medium text-white">{feature.text}</h5>
                <p className="text-md text-neutral-400">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating decorative elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-blue-500 text-4xl"
        >
          ↓
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureSection;
