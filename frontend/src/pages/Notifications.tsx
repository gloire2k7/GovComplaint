
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock notifications data
const mockCitizenNotifications = [
  {
    id: "N001",
    title: "Complaint Received",
    message: "Your complaint about Broken Street Light has been received and will be reviewed shortly.",
    date: "2025-05-15 10:23 AM",
    isRead: true,
    complaintId: "C001"
  },
  {
    id: "N002",
    title: "Complaint Status Updated",
    message: "Your complaint about Missed Garbage Collection has been reviewed by the Department of Sanitation.",
    date: "2025-05-12 02:45 PM",
    isRead: true,
    complaintId: "C002"
  },
  {
    id: "N003",
    title: "Complaint Resolved",
    message: "Your complaint about Pothole on Main Street has been resolved. The Department of Transport has left a response.",
    date: "2025-05-05 11:30 AM",
    isRead: false,
    complaintId: "C003"
  },
];

const mockAgencyNotifications = [
  {
    id: "N001",
    title: "New Complaint Received",
    message: "A new complaint has been submitted regarding a Broken Street Light on Oak Avenue.",
    date: "2025-05-14 09:15 AM",
    isRead: false,
    complaintId: "C001"
  },
  {
    id: "N002",
    title: "New Complaint Received",
    message: "A new complaint has been submitted regarding a Traffic Signal Not Working.",
    date: "2025-05-13 03:22 PM",
    isRead: true,
    complaintId: "C002"
  },
  {
    id: "N003",
    title: "New Complaint Received",
    message: "A new complaint has been submitted regarding a Pothole on Main Street.",
    date: "2025-05-12 10:05 AM", 
    isRead: true,
    complaintId: "C003"
  },
  {
    id: "N004",
    title: "New Complaint Received",
    message: "A new complaint has been submitted regarding a Bus Stop Damaged.",
    date: "2025-05-10 11:47 AM",
    isRead: true,
    complaintId: "C004"
  },
];

const Notifications = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const notifications = currentUser?.userType === 'citizen' 
    ? mockCitizenNotifications 
    : mockAgencyNotifications;
    
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const handleMarkAllRead = () => {
    toast({
      title: "Notifications Marked as Read",
      description: "All notifications have been marked as read.",
    });
  };
  
  const handleViewComplaint = (complaintId: string) => {
    toast({
      title: "Opening Complaint",
      description: `Navigating to complaint #${complaintId}`,
    });
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in to view notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link to="/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-600">
            Stay updated on your {currentUser.userType === 'citizen' ? 'complaints' : 'agency activities'}
          </p>
        </div>
        
        {notifications.length > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount} new
                </span>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-md border ${notification.isRead ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${!notification.isRead && 'font-semibold'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500">{notification.date}</span>
                  </div>
                  <p className="text-sm mt-1 text-gray-600">{notification.message}</p>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-gov-blue hover:text-gov-darkBlue hover:bg-blue-50"
                      onClick={() => handleViewComplaint(notification.complaintId)}
                    >
                      View Complaint
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No notifications</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You don't have any notifications at the moment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Configure how you receive notifications by email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <h3 className="font-medium">New Responses</h3>
                <p className="text-sm text-muted-foreground">
                  {currentUser.userType === 'citizen' 
                    ? 'Receive emails when agencies respond to your complaints'
                    : 'Receive emails when new complaints are submitted'}
                </p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="new-responses" className="h-4 w-4" defaultChecked />
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <h3 className="font-medium">Status Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Receive emails when the status of your complaint changes
                </p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="status-updates" className="h-4 w-4" defaultChecked />
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium">Website Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about important system updates
                </p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="website-notifications" className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-gov-blue hover:bg-gov-darkBlue">Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
