import React, { useState, useEffect, useRef } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const MainLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userType, setUserType] = useState<"citizen" | "agency" | null>(null);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    if (currentUser) setUserType(currentUser.userType);
  }, [currentUser]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setSidebarOpen(false); // Hide on scroll down
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => setSidebarOpen((open) => !open);
  
  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} userType={userType} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar userType={userType || "citizen"} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
          <div className="container mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
