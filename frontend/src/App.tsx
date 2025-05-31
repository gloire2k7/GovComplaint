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
import ComplaintsRouter from "./pages/ComplaintsRouter";

// Layout
import MainLayout from "./components/layout/MainLayout";
import DashboardRouter from "./components/dashboard/DashboardRouter";

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
              
              {/* Protected routes */}
              <Route element={<MainLayout />}>
                {/* Role-based dashboards */}
                <Route path="/dashboard" element={<DashboardRouter />} />
              
                {/* Other protected routes */}
                <Route path="/complaints" element={<ComplaintsRouter />} />
                <Route path="/complaints/new" element={<NewComplaint />} />
                <Route path="/complaints/review/:id" element={<ReviewComplaint />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/categories" element={<Categories />} />
              </Route>
              
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
