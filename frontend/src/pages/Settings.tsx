
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(currentUser?.displayName || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Agency-specific fields
  const [agencyName, setAgencyName] = useState(currentUser?.agencyName || "");
  const [agencyEmail, setAgencyEmail] = useState(currentUser?.email || "");
  const [agencyPhone, setAgencyPhone] = useState("");
  const [agencyAddress, setAgencyAddress] = useState("");
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "The new password and confirm password fields do not match.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };
  
  const handleUpdateAgencyInfo = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Agency Information Updated",
        description: "Your agency information has been updated successfully.",
      });
    }, 1000);
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in to access settings.
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
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account preferences and information
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          {currentUser.userType === 'agency' && (
            <TabsTrigger value="agency">Agency Information</TabsTrigger>
          )}
          <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    {currentUser.userType === 'citizen' ? 'Full Name' : 'Contact Person Name'}
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="bg-gov-blue hover:bg-gov-darkBlue">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <form onSubmit={handleChangePassword}>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-password" className="text-sm font-medium">
                    Current Password
                  </label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium">
                    New Password
                  </label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="bg-gov-blue hover:bg-gov-darkBlue"
                    disabled={!currentPassword || !newPassword || !confirmPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
        
        {currentUser.userType === 'agency' && (
          <TabsContent value="agency">
            <Card>
              <form onSubmit={handleUpdateAgencyInfo}>
                <CardHeader>
                  <CardTitle>Agency Information</CardTitle>
                  <CardDescription>
                    Update details about your government agency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="agency-name" className="text-sm font-medium">
                      Agency Name
                    </label>
                    <Input
                      id="agency-name"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="agency-email" className="text-sm font-medium">
                      Agency Email (for complaints)
                    </label>
                    <Input
                      id="agency-email"
                      type="email"
                      value={agencyEmail}
                      onChange={(e) => setAgencyEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="agency-phone" className="text-sm font-medium">
                      Agency Phone Number
                    </label>
                    <Input
                      id="agency-phone"
                      type="tel"
                      value={agencyPhone}
                      onChange={(e) => setAgencyPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="agency-address" className="text-sm font-medium">
                      Agency Address
                    </label>
                    <Input
                      id="agency-address"
                      value={agencyAddress}
                      onChange={(e) => setAgencyAddress(e.target.value)}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="bg-gov-blue hover:bg-gov-darkBlue">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="email-notifications" className="h-4 w-4" defaultChecked />
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
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h3 className="font-medium">Response Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.userType === 'citizen' 
                        ? 'Receive notifications when agencies respond to your complaints'
                        : 'Receive notifications when new complaints are submitted'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="response-notifications" className="h-4 w-4" defaultChecked />
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">System Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive important system notifications and updates
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="system-updates" className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <Button className="bg-gov-blue hover:bg-gov-darkBlue">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
