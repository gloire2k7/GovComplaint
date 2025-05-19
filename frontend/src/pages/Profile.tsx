
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in to view your profile.
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
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-600">
          View and manage your account information
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-gov-blue flex items-center justify-center text-white text-2xl font-bold mb-3">
                  {currentUser.displayName.charAt(0)}
                </div>
                <h3 className="font-semibold text-lg">{currentUser.displayName}</h3>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                <p className="text-sm bg-blue-100 text-blue-800 rounded-full px-3 py-1 mt-2 capitalize">
                  {currentUser.userType}
                </p>
              </div>
              
              <div className="pt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/settings">Edit Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentUser.userType === 'citizen' ? 'Account Summary' : 'Agency Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentUser.userType === 'citizen' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium text-lg mb-1">Complaints Submitted</h3>
                      <p className="text-3xl font-bold">4</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium text-lg mb-1">Resolved Issues</h3>
                      <p className="text-3xl font-bold">1</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Recent Activity</h3>
                    <ul className="space-y-3">
                      <li className="border-b pb-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Submitted a complaint about Noise Pollution</span>
                          <span className="text-muted-foreground">2025-05-15</span>
                        </div>
                      </li>
                      <li className="border-b pb-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Received a response for complaint #C003</span>
                          <span className="text-muted-foreground">2025-05-05</span>
                        </div>
                      </li>
                      <li className="border-b pb-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Submitted a complaint about Missed Garbage Collection</span>
                          <span className="text-muted-foreground">2025-05-10</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-2">
                    <Button asChild className="bg-gov-blue hover:bg-gov-darkBlue">
                      <Link to="/complaints/new">Submit New Complaint</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Agency Name</h3>
                    <p className="text-gray-800">{currentUser.agencyName}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Complaint Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.categories?.map((category) => (
                        <span 
                          key={category} 
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium mb-1">Pending</h3>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium mb-1">Under Review</h3>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium mb-1">Resolved</h3>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex space-x-3">
                    <Button asChild className="bg-gov-blue hover:bg-gov-darkBlue">
                      <Link to="/complaints">Manage Complaints</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/categories">Manage Categories</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
