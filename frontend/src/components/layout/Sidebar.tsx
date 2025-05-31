import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Home, FileText, Settings, Bell, Search, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  userType: "citizen" | "agency";
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ userType, isOpen }) => {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(isOpen);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setVisible(false); // Hide on scroll down
      } else {
        setVisible(true); // Show on scroll up
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleSidebar = () => setSidebarOpen((open) => !open);

  const citizenLinks = [
    { to: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { to: "/complaints/new", icon: <FileText size={20} />, label: "New Complaint" },
    { to: "/complaints", icon: <Search size={20} />, label: "My Complaints" },
    { to: "/notifications", icon: <Bell size={20} />, label: "Notifications" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  const agencyLinks = [
    { to: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { to: "/complaints", icon: <Search size={20} />, label: "Complaints" },
    { to: "/categories", icon: <FileText size={20} />, label: "Categories" },
    { to: "/reviews", icon: <CheckSquare size={20} />, label: "Reviews" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  const links = userType === "citizen" ? citizenLinks : agencyLinks;

  return (
    <>
      {/* Menu Icon (always visible) */}
      <button
        className="fixed top-4 left-4 z-30 bg-gov-blue text-white p-2 rounded-md shadow-lg md:hidden"
        onClick={handleToggleSidebar}
        aria-label="Toggle sidebar"
        style={{ display: sidebarOpen ? 'none' : 'block' }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="18" height="2" rx="1"/><rect x="3" y="6" width="18" height="2" rx="1"/><rect x="3" y="18" width="18" height="2" rx="1"/></svg>
      </button>
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-gov-darkBlue text-white fixed h-screen top-0 left-0 overflow-y-auto transition-all duration-300 z-20 flex flex-col",
          sidebarOpen && visible ? "w-64" : "w-0",
          !sidebarOpen ? "md:w-0" : "md:w-64"
        )}
        style={{ minHeight: '100vh' }}
      >
        {/* Collapse button */}
        <button
          className="absolute top-4 right-4 z-30 bg-gov-blue text-white p-2 rounded-md shadow-lg md:hidden"
          onClick={handleToggleSidebar}
          aria-label="Collapse sidebar"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        <div className="flex flex-col h-full py-6">
          <nav className="space-y-1 px-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-4 rounded-md transition-colors",
                    isActive
                      ? "bg-gov-blue text-white"
                      : "text-gray-300 hover:bg-gov-blue/50 hover:text-white"
                  )
                }
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <span className="mr-3">{link.icon}</span>
                {(sidebarOpen || !isMobile) && <span>{link.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
