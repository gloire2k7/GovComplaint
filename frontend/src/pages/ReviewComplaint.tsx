import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Mock complaint for review
const mockComplaint = {
  id: "C003",
  title: "Pothole on Main Street",
  description: "Large pothole in front of 123 Main Street, causing vehicles to swerve dangerously.",
  citizen: "Robert Johnson",
  status: "Pending",
  date: "2025-05-12",
  category: "Road Issues",
  email: "robert.j@example.com",
  location: "123 Main Street",
  imageUrl: "https://images.unsplash.com/photo-1635176504344-4ce443fd70cd?q=80&w=1000&auto=format&fit=crop"
};

type ReviewStatus = "Reviewed" | "Resolved" | "Pending";

const ReviewComplaint = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [complaint, setComplaint] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<ReviewStatus>("Reviewed");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Optionally fetch complaint details by ID if endpoint exists
    // Example: GET /api/complaints/{id}
    // For now, skip and assume complaint is loaded from list
  }, [id]);
  
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ title: "Authentication Required", description: "You must be logged in to review complaints.", variant: "destructive" });
      return;
    }
    if (currentUser.userType !== 'agency') {
      toast({ title: "Permission Denied", description: "Only agencies can review complaints.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8085/api/complaints/${id}/status?status=${status.toUpperCase()}&response=${encodeURIComponent(response)}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to submit review');
      }
      toast({ title: "Review Submitted", description: `Complaint #${id} has been marked as ${status}.` });
      navigate("/complaints");
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in to review complaints.
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

  if (currentUser.userType !== 'agency') {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Permission Denied</CardTitle>
            <CardDescription>
              Only government agencies can review complaints.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Review Complaint</h1>
        <p className="text-gray-600">
          Review and respond to citizen complaint
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{mockComplaint.title}</CardTitle>
              <CardDescription>
                Submitted on {mockComplaint.date} by {mockComplaint.citizen}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Complaint Details</h3>
                <p className="text-sm whitespace-pre-line">{mockComplaint.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Category</h3>
                  <p className="text-sm">{mockComplaint.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Location</h3>
                  <p className="text-sm">{mockComplaint.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Contact Email</h3>
                  <p className="text-sm">{mockComplaint.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Current Status</h3>
                  <p className="text-sm">{mockComplaint.status}</p>
                </div>
              </div>
              
              {mockComplaint.imageUrl && (
                <div>
                  <h3 className="font-semibold mb-2">Attached Image</h3>
                  <img
                    src={mockComplaint.imageUrl}
                    alt="Complaint evidence"
                    className="rounded-md max-h-60 object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Review Form */}
        <div className="lg:col-span-1">
          <Card>
            <form onSubmit={handleSubmitReview}>
              <CardHeader>
                <CardTitle>Response</CardTitle>
                <CardDescription>
                  Provide feedback on this complaint
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="status">Update Status</Label>
                  <RadioGroup 
                    defaultValue="Reviewed" 
                    value={status}
                    onValueChange={(value) => setStatus(value as ReviewStatus)}
                    className="grid gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Reviewed" id="reviewed" />
                      <Label htmlFor="reviewed" className="cursor-pointer">Reviewed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Resolved" id="resolved" />
                      <Label htmlFor="resolved" className="cursor-pointer">Resolved</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Pending" id="pending" />
                      <Label htmlFor="pending" className="cursor-pointer">Keep Pending</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="response">Response Message</Label>
                  <Textarea
                    id="response"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Provide a response to the citizen..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    This response will be emailed to the citizen who submitted the complaint.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gov-blue hover:bg-gov-darkBlue"
                  disabled={isSubmitting || (status === "Resolved" && !response)}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReviewComplaint;
