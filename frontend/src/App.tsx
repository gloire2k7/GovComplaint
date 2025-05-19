import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ComplaintsList from "./pages/ComplaintsList";
import NewComplaint from "./pages/NewComplaint";
import ReviewComplaint from "./pages/ReviewComplaint";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Categories from "./pages/Categories";

// Layout
import MainLayout from "./components/layout/MainLayout";
import { Link } from "react-router-dom";
import CitizenDashboard from "./components/dashboard/CitizenDashboard";
import AgencyDashboard from "./components/dashboard/AgencyDashboard";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Role-based dashboards */}
              <Route path="/dashboard/citizen" element={<CitizenDashboard />} />
              <Route path="/dashboard/agency" element={<AgencyDashboard />} />

              {/* Other routes */}
              <Route path="/complaints" element={<ComplaintsList />} />
              <Route path="/complaints/new" element={<NewComplaint />} />
              <Route path="/complaints/review/:id" element={<ReviewComplaint />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/categories" element={<Categories />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
