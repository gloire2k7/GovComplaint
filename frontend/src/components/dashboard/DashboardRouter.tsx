import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import CitizenDashboard from "./CitizenDashboard";
import AgencyDashboard from "./AgencyDashboard";

const DashboardRouter = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;
  if (currentUser.userType === "CITIZEN") {
    return <CitizenDashboard />;
  } else if (currentUser.userType === "AGENCY") {
    return <AgencyDashboard />;
  } else {
    return <div>Unknown user type</div>;
  }
};

export default DashboardRouter; 