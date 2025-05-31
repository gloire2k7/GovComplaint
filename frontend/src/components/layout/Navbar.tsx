import React from "react";
import { Link } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  userType: "citizen" | "agency" | null;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, sidebarOpen, userType }) => {
  const { currentUser, logout } = useAuth();
  
  return (
    <header className="bg-gov-blue text-white border-b border-gov-border sticky top-0 z-30">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          {userType && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-white hover:bg-gov-darkBlue"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <Link to="/" className="font-bold text-xl flex items-center">
            <span className="text-white">GovComplaint</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!currentUser ? (
            <div className="flex gap-2">
              <Button asChild variant="ghost" className="text-white hover:bg-gov-darkBlue">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild className="bg-white text-gov-blue hover:bg-gray-100">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gov-darkBlue text-white">
                      {currentUser.displayName ? currentUser.displayName.charAt(0) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="font-medium text-sm">{currentUser.displayName}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout} 
                  className="text-red-600 cursor-pointer flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
