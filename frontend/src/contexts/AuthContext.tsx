import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  displayName: string;
  userType: 'CITIZEN' | 'AGENCY';
  categories?: string[];
  agencyName?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  userType: 'CITIZEN' | 'AGENCY';
  agencyName?: string;
  categories?: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock data for demonstration purposes
const mockUsers: User[] = [
  {
    id: '1',
    email: 'citizen@example.com',
    displayName: 'John Citizen',
    userType: 'CITIZEN',
  },
  {
    id: '2',
    email: 'agency@example.com',
    displayName: 'Transport Agency',
    userType: 'AGENCY',
    agencyName: 'Department of Transport',
    categories: ['Road Issues', 'Public Transport', 'Traffic Signals', 'Parking']
  },
  {
    id: '3',
    email: 'health@example.com',
    displayName: 'Health Department',
    userType: 'AGENCY',
    agencyName: 'Department of Health',
    categories: ['Hospital Services', 'Public Health', 'Medical Assistance', 'Sanitation']
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8085/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const userData = await response.json();
      setCurrentUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.displayName}!`
      });
      
      // Navigate based on user type from the response
      if (userData.userType === "CITIZEN") {
        navigate('/dashboard/citizen');
      } else if (userData.userType === "AGENCY") {
        navigate('/dashboard/agency');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8085/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const newUser = await response.json();
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      toast({
        title: "Registration Successful",
        description: `Welcome, ${newUser.displayName}!`
      });
      
      // Navigate based on user type
      if (newUser.userType === "CITIZEN") {
        navigate('/dashboard/citizen');
      } else if (newUser.userType === "AGENCY") {
        navigate('/dashboard/agency');
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
