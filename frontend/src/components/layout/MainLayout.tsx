
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
  userType?: "citizen" | "agency" | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({ userType }) => {
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} userType={currentUser.userType} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar userType={currentUser.userType} isOpen={sidebarOpen} />
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
