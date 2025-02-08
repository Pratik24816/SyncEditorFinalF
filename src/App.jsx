import { useState } from 'react';
import './index.css';
import TextEditor from './Components/TextEditor';
import EditorPage from './Components/EditorPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomeP from './Components/HomeP';
import { v4 as uuidV4 } from "uuid";

import Navbar from "./Components/Navbar";
import HeroSection from "./Components/HeroSection";
import FeatureSection from "./Components/FeatureSection";
import Workflow from "./Components/Workflow";
import { Toaster } from 'react-hot-toast';
import Footer from "./Components/Footer";
import Testimonials from "./Components/Testimonials";

function App() {

  return (
    <>

<div>
  <Toaster 
  position="top-right"
  toastOptions={{
    success: {
      theme: {
        primary: '#4aed88',
      },
    },
  }}
/>
  </div>
      <Router>
        <Routes>
          <Route
            path="/"
            // element={<Navigate to={`/documents/${uuidV4()}`} replace />} 
            element={<Navigate to="/home" replace />} 
          />
          <Route
            path="/home"
            element={
              <div>
                <Navbar />
                  <div className="max-w-7xl mx-auto pt-20 px-6">
                    <HeroSection />
                    <FeatureSection />
                    <Workflow />
                    <Testimonials />
                    <Footer />
                  </div>
              </div>
          } 
          />
          <Route
            path="/documents/:roomId"
            element={<EditorPage />} 
          />
          <Route path='/homep' element={<HomeP/>}/>
             {/* <Route path="/editor/:roomId" element={<EditorPage/>}/> */}
        
        </Routes>
      </Router>
    </>
  );
}

export default App;
