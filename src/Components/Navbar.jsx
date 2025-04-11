import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoh from "../assets/logoh51.gif";

const Navbar = () => { 
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => { 
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="w-full px-4 relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-12 w-15 mr-2" src={logoh} alt="Logo" />
            <span className="text-xl tracking-tight text-white">SyncEditor</span>
          </div>
          <div className="hidden lg:flex justify-center space-x-12 items-center">
       

          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
          
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
