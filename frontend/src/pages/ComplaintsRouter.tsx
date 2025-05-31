import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import CitizenComplaintsList from "./CitizenComplaintsList";
import AgencyComplaintsList from "./AgencyComplaintsList";

const ComplaintsRouter = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;
  if (currentUser.userType === "CITIZEN") {
    return <CitizenComplaintsList />;
  } else if (currentUser.userType === "AGENCY") {
    return <AgencyComplaintsList />;
  } else {
    return <div>Unknown user type</div>;
  }
};

export default ComplaintsRouter; 