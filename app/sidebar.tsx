"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FaHome, FaCog, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme(); // Use useTheme hook to manage themes

  const handleClick = () => setOpen(!open);
  const handleDarkModeToggle = () => {
    // Toggle between light and dark themes
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navigation = [
    { icon: <FaHome size={20} />, name: "Home", href: "/" },
    { icon: <FaHome size={20} />, name: "Statistics", href: "/Statistics" },
    { icon: <FaHome size={20} />, name: "Maps", href: "/Maps" },
    { icon: <FaCog size={20} />, name: "Settings", href: "/settings" },
    { icon: <FaSignOutAlt size={20} />, name: "Logout", href: "/logout" },
  ];

  return (
    <motion.div
      className={cn(
        "h-screen relative transition-all duration-300 ease-in-out",
        theme === "dark"
          ? "bg-[#2D2D2D] text-[#E0E0E0] shadow-lg"
          : "bg-[#f4f4f4] text-gray-800 shadow-md",
        open ? "w-60 p-3" : "w-20 p-3"
      )}
      initial={{ width: "80px" }}
      animate={{ width: open ? "240px" : "80px" }}
      transition={{ duration: 0.3 }}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-center cursor-pointer font-semibold">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`transition-opacity duration-300 ${
            open ? "block" : "hidden"
          }`}
        >
          Weather Forecast
        </motion.span>
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: open ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`transition-opacity duration-300 ${
            !open ? "block" : "hidden"
          }`}
        >
          WF
        </motion.span>
      </div>

      {/* Navigation */}
      <div className="mt-5 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center rounded transition-colors duration-200 p-3",
              pathname === item.href
                ? theme === "dark"
                  ? "bg-[#4A4A4A] text-[#E0E0E0]"
                  : "bg-gray-300 text-black"
                : "hover:bg-[#3E3E3E]"
            )}
          >
            <div className="flex items-center justify-center w-8 h-8">
              {item.icon}
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`ml-4 text-sm ${open ? "block" : "hidden"}`}
            >
              {item.name}
            </motion.span>
          </Link>
        ))}
      </div>

      {/* Toggle button for sidebar */}
      <motion.button
        className={cn(
          "absolute top-1/2 transform -translate-y-1/2 dark:bg-[#4A4A4A] bg-gray-300 dark:text-white text-black p-2 rounded-full transition-transform",
          open ? "-right-4" : "-right-4"
        )}
        onClick={handleClick}
        aria-label="Toggle sidebar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {open ? "←" : "→"}
      </motion.button>

      {/* Toggle button for dark mode */}
      <motion.button
        className={cn(
          "absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white p-2 rounded-full transition-transform",
          theme === "dark" ? "bg-yellow-500" : "bg-gray-500"
        )}
        onClick={handleDarkModeToggle}
        aria-label="Toggle dark mode"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;