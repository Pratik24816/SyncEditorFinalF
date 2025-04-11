// import { motion } from "framer-motion";
// import { features } from "../constants/index.jsx";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.2,
//       delayChildren: 0.3
//     }
//   }
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.5
//     }
//   }
// };

// const FeatureSection = () => {
//   return (
//     <div className="relative mt-20 border-b border-neutral-800 min-h-[800px] overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-0 w-64 h-64 bg-blue-900 rounded-full filter blur-3xl opacity-10 animate-blob"></div>
//         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//         <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
//       </div>

//       <motion.div 
//         className="text-center"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true, margin: "-100px" }}
//         transition={{ duration: 0.8 }}
//       >
//         <motion.span
//           className="inline-block px-4 py-2 rounded-lg border border-blue-700 dark:border-blue-500 shadow-sm shadow-blue-400 dark:shadow-blue-600 text-white bg-gradient-to-r from-blue-900/30 to-blue-800/30 backdrop-blur-sm"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           Features
//         </motion.span>
//         <motion.h2 
//           className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide text-white"
//           initial={{ y: 20 }}
//           whileInView={{ y: 0 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           Easily build{" "}
//           <span className="bg-gradient-to-r from-blue-500 to-blue-800 dark:from-blue-400 dark:to-blue-700 text-transparent bg-clip-text">
//             your Text
//           </span>
//         </motion.h2>
//       </motion.div>

//       <motion.div 
//         className="flex flex-wrap mt-10 lg:mt-20"
//         variants={containerVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-100px" }}
//       >
//         {features.map((feature, index) => (
//           <motion.div 
//             key={index} 
//             className="w-full sm:w-1/2 lg:w-1/3 p-4"
//             variants={itemVariants}
//             whileHover={{ y: -5 }}
//           >
//             <div className="flex h-full p-6 bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 rounded-xl border border-neutral-800 hover:border-blue-500 transition-all duration-300 backdrop-blur-sm">
//               <div className="flex-shrink-0">
//                 <motion.div 
//                   className="flex mx-6 h-12 w-12 p-2 bg-neutral-900 text-blue-500 justify-center items-center rounded-full border border-blue-500/30"
//                   whileHover={{ rotate: 15, scale: 1.1 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                 >
//                   {feature.icon}
//                 </motion.div>
//               </div>
//               <div className="ml-4">
//                 <h5 className="mt-1 mb-4 text-xl font-medium text-white">{feature.text}</h5>
//                 <p className="text-md text-neutral-400">
//                   {feature.description}
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Floating decorative elements */}
//       <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
//         <motion.div
//           animate={{
//             y: [0, -15, 0],
//           }}
//           transition={{
//             duration: 4,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="text-blue-500 text-4xl"
//         >
//           ↓
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default FeatureSection;
import { motion } from "framer-motion";
import { 
  Type,
  Users,
  Save,
  Image,
  FileText,
  Download,
  Upload,
  Code,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  Palette,
  MessageSquare,
  Cpu,
  Zap,
  Globe,
  Clock,
  Eye,
  FileInput,
  FileOutput,
  FileSearch,
  Lock,
  Share2,
  Sparkles,
  ShieldCheck,
  GitBranch
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
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

const textGradient = "bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 dark:from-blue-300 dark:via-blue-400 dark:to-indigo-500 text-transparent bg-clip-text";

const featureCategories = [
  {
    title: "Core Features",
    icon: <Cpu className="w-5 h-5" />,
    features: [
      {
        title: "Real-time Collaboration",
        description: "Multiple users can edit simultaneously with instant updates",
        icon: <Users className="w-5 h-5" />
      },
      {
        title: "Auto Save",
        description: "Changes saved automatically every few seconds",
        icon: <Save className="w-5 h-5" />
      },
      {
        title: "Room System",
        description: "Unique room IDs for organized collaboration",
        icon: <Globe className="w-5 h-5" />
      },
      {
        title: "User Presence",
        description: "See who's currently in the document",
        icon: <Clock className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Document Capabilities",
    icon: <FileText className="w-5 h-5" />,
    features: [
      {
        title: "Rich Text Formatting",
        description: "Bold, italic, underline, headers, lists",
        icon: <Bold className="w-5 h-5" />
      },
      {
        title: "Text Styling",
        description: "Colors and background highlights",
        icon: <Palette className="w-5 h-5" />
      },
      {
        title: "Image Handling",
        description: "Insert and resize images in documents",
        icon: <Image className="w-5 h-5" />
      },
      {
        title: "Comments",
        description: "Add comments for collaborative feedback",
        icon: <MessageSquare className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Import/Export",
    icon: <Share2 className="w-5 h-5" />,
    features: [
      {
        title: "Export to Word",
        description: "Download as DOCX with full formatting",
        icon: <FileOutput className="w-5 h-5" />
      },
      {
        title: "Export to PDF",
        description: "Generate PDFs with custom options",
        icon: <FileOutput className="w-5 h-5" />
      },
      {
        title: "Export to HTML",
        description: "Styled HTML output for web publishing",
        icon: <Code className="w-5 h-5" />
      },
      {
        title: "Import Documents",
        description: "Bring in files from external sources",
        icon: <FileInput className="w-5 h-5" />
      }
    ]
  }
];

const FeatureSection = () => {
  return (
    <div className="relative mt-20 border-b border-neutral-800 min-h-[800px] overflow-hidden" id="features">
      {/* Animated background elements - Enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-700 rounded-full filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-600 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-600 rounded-full filter blur-3xl opacity-5 animate-blob animation-delay-3000"></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4 py-24">
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-600/80 shadow-lg shadow-blue-500/20 text-white bg-gradient-to-r from-blue-900/60 to-blue-700/60 backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>Powerful Features</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-10 lg:mt-16 tracking-tight text-white"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need for{" "}
            <span className={textGradient}>
              seamless collaboration
            </span>
          </motion.h2>
          
          <motion.p
            className="mt-6 text-lg text-neutral-400 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Our platform combines powerful editing tools with real-time collaboration
            features to streamline your document workflow.
          </motion.p>
        </motion.div>

        {/* Feature Categories - Enhanced with glass effect */}
        <div className="mt-20 space-y-20">
          {featureCategories.map((category, catIndex) => (
            <motion.div 
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              className="bg-gradient-to-br from-neutral-900/70 to-neutral-800/50 backdrop-blur-lg rounded-2xl border border-neutral-800/80 p-8 shadow-xl relative overflow-hidden"
            >
              {/* Background accents */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl"></div>
              
              <div className="flex items-center mb-10 relative">
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg shadow-blue-500/20 mr-4">
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold">
                  <span className={textGradient}>{category.title}</span>
                </h3>
              </div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {category.features.map((feature, featIndex) => (
                  <motion.div 
                    key={featIndex}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(59, 130, 246, 0.2)",
                      borderColor: "rgba(59, 130, 246, 0.5)"
                    }}
                    className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/70 rounded-xl border border-neutral-800 hover:border-blue-500/50 transition-all duration-300 p-6 shadow-lg hover:shadow-blue-500/10"
                  >
                    <div className="flex items-start">
                      <div className="p-3 rounded-full bg-blue-500/20 border border-blue-500/30 mr-4 shadow-inner shadow-blue-500/10">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                        <p className="text-neutral-400 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Grid - Enhanced with hover effects */}
        <motion.div 
          className="mt-24 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-center mb-8">
            <span className={textGradient}>Version Next: Coming Soon ⏳</span>
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: <Lock className="w-6 h-6" />, text: "Secure" },
              { icon: <Sparkles className="w-6 h-6" />, text: "AI Assist" },
              { icon: <FileSearch className="w-6 h-6" />, text: "Version History" },
              { icon: <GitBranch className="w-6 h-6" />, text: "Branches" },
              { icon: <ShieldCheck className="w-6 h-6" />, text: "Permissions" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(30, 64, 175, 0.1)",
                  borderColor: "rgba(59, 130, 246, 0.5)",
                }}
                className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-neutral-800 p-4 flex flex-col items-center text-center transition-all duration-300 shadow-md hover:shadow-blue-500/10"
              >
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-700/20 to-blue-500/20 border border-blue-500/30 mb-3 shadow-inner">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="text-blue-400"
                  >
                    {item.icon}
                  </motion.div>
                </div>
                <span className="text-white text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 text-center"
        >
          {/* <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-blue-900/30 to-indigo-900/20 backdrop-blur-md border border-blue-800/30 shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to collaborate smarter?</h3>
            <p className="text-neutral-300 mb-6">Experience the power of real-time collaboration with our advanced document editor.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-700/20"
            >
              Get Started Free
            </motion.button>
          </div> */}
        </motion.div>
      </div>

      {/* Enhanced floating decorative elements */}
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
          className="text-blue-400 text-4xl"
        >
          ↓
        </motion.div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500 opacity-20"
            style={{
              width: Math.random() * 8 + 2,
              height: Math.random() * 8 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Add CSS for the grid pattern */}
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
          animation: blob 20s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default FeatureSection;