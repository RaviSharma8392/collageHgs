import React, { useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logouthandler = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userType");
      navigate("/");
    }, 800); // Simulate async operation
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <RxDashboard className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-900">
              {router.state?.type || "App"} Dashboard
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <CustomButton
              variant="danger"
              onClick={logouthandler}
              disabled={isLoggingOut}
              className="group relative overflow-hidden"
            >
              {isLoggingOut ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin absolute"></span>
                  <span className="opacity-0">Logging out...</span>
                </>
              ) : (
                <>
                  <span>Logout</span>
                  <FiLogOut className="ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </CustomButton>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              <CustomButton
                variant="danger"
                onClick={logouthandler}
                disabled={isLoggingOut}
                fullWidth
                className="justify-center group relative overflow-hidden"
              >
                {isLoggingOut ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin absolute"></span>
                    <span className="opacity-0">Logging out...</span>
                  </>
                ) : (
                  <>
                    <span>Logout</span>
                    <FiLogOut className="ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </CustomButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;