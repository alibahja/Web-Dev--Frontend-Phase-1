import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CustomAlert = ({ show, onClose, title, message, type = "success" }) => {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-[#5F7DB0]",
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-[#1E2740]">

              <div className={`${colors[type]} h-2 w-full`} />

              <div className="p-6 text-center">
                <div className="text-5xl mb-4">
                  {type === "success" && "✅"}
                  {type === "error" && "❌"}
                  {type === "info" && "ℹ️"}
                </div>

                <h2 className="text-2xl font-bold mb-2 text-[#1F2937] dark:text-white">
                  {title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {message}
                </p>

                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-[#2C3E68] hover:bg-[#1F2F4F] transition-all active:scale-95"
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomAlert;