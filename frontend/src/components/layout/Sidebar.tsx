
import React from "react";
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

  const citizenLinks = [
    { to: "/dashboard/citizen", icon: <Home size={20} />, label: "Dashboard" },
    { to: "/complaints/new", icon: <FileText size={20} />, label: "New Complaint" },
    { to: "/complaints", icon: <Search size={20} />, label: "My Complaints" },
    { to: "/notifications", icon: <Bell size={20} />, label: "Notifications" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  const agencyLinks = [
    { to: "//dashboard/agency", icon: <Home size={20} />, label: "Dashboard" },
    { to: "/complaints", icon: <Search size={20} />, label: "Complaints" },
    { to: "/categories", icon: <FileText size={20} />, label: "Categories" },
    { to: "/reviews", icon: <CheckSquare size={20} />, label: "Reviews" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  const links = userType === "citizen" ? citizenLinks : agencyLinks;

  return (
    <aside
      className={cn(
        "bg-gov-darkBlue text-white fixed h-full md:sticky top-16 left-0 overflow-y-auto transition-all duration-300 z-20",
        isOpen ? "w-64" : isMobile ? "w-0" : "w-0 md:w-16"
      )}
    >
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
            >
              <span className="mr-3">{link.icon}</span>
              {(isOpen || !isMobile) && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
