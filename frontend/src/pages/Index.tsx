import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null; // Or a spinner if you want
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gov-blue text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Government Complaint Management System
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            A direct channel to submit and track your complaints to government agencies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
                <Button asChild className="text-lg bg-white text-gov-blue hover:bg-gray-200">
                  <Link to="/register">Register Now</Link>
                </Button>
                <Button asChild variant="outline" className="text-lg bg-white text-gov-blue hover:bg-gray-200">
                  <Link to="/login">Login</Link>
                </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gov-blue">How it Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-gov-blue rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3 text-gov-darkBlue">Submit a Complaint</h3>
              <p className="text-gray-600">
                Create a detailed complaint specifying the issue and select the appropriate government agency to address it.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-gov-blue rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3 text-gov-darkBlue">Complaint Processing</h3>
              <p className="text-gray-600">
                Government agencies receive and categorize your complaint for efficient handling and resolution.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-gov-blue rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3 text-gov-darkBlue">Track Resolution</h3>
              <p className="text-gray-600">
                Follow the progress of your complaint and receive notifications when it's reviewed or resolved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gov-blue">Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-gov-darkBlue">Transparency</h3>
              <p className="text-gray-600">
                Track the status of your complaints in real-time with complete visibility.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-gov-darkBlue">Efficiency</h3>
              <p className="text-gray-600">
                Direct routing of complaints to the right department for faster resolution.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-gov-darkBlue">Accountability</h3>
              <p className="text-gray-600">
                Hold agencies accountable with documented communication and response timelines.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-gov-darkBlue">Accessibility</h3>
              <p className="text-gray-600">
                Submit complaints anytime, anywhere through our user-friendly platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gov-darkBlue text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">GovComplaint</h3>
              <p className="text-gray-300">Connecting citizens with government agencies</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-300">© 2025 GovComplaint. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
