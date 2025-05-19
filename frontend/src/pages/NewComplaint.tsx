import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock agencies data with their categories
const mockAgencies = [
  {
    id: "1",
    name: "Department of Transport",
    categories: ["Road Issues", "Public Transport", "Traffic Signals", "Parking", "Cycling Infrastructure", "Road Signs"]
  },
  {
    id: "2",
    name: "Department of Sanitation",
    categories: ["Waste Management", "Street Cleaning", "Recycling", "Public Toilets"]
  },
  {
    id: "3",
    name: "Department of Health",
    categories: ["Hospital Services", "Public Health", "Medical Assistance", "Sanitation"]
  },
  {
    id: "4",
    name: "Department of Parks",
    categories: ["Parks & Recreation", "Public Spaces", "Playgrounds", "Sports Facilities"]
  },
  {
    id: "5",
    name: "Department of Water",
    categories: ["Water Services", "Drainage", "Flooding", "Water Quality"]
  },
  {
    id: "6",
    name: "Department of Infrastructure",
    categories: ["Street Lighting", "Building Safety", "Public Buildings", "Sidewalks"]
  },
  {
    id: "7",
    name: "Department of Environment",
    categories: ["Noise Pollution", "Air Quality", "Wildlife", "Environmental Hazards"]
  }
];

const NewComplaint = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Get categories based on selected agency
  const availableCategories = selectedAgency 
    ? mockAgencies.find(a => a.id === selectedAgency)?.categories || []
    : [];

  const handleAgencyChange = (value: string) => {
    setSelectedAgency(value);
    setSelectedCategory(""); // Reset category when agency changes
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit a complaint.",
        variant: "destructive"
      });
      return;
    }
    if (currentUser.userType !== 'citizen') {
      toast({
        title: "Permission Denied",
        description: "Only citizens can submit complaints.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8085/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          category: selectedCategory,
          agencyId: Number(selectedAgency)
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to submit complaint');
      }
      toast({
        title: "Complaint Submitted",
        description: `Your complaint "${title}" has been submitted successfully.`,
      });
      navigate("/complaints");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in to submit a complaint.
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

  if (currentUser.userType !== 'citizen') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Permission Denied</CardTitle>
            <CardDescription>
              Only citizens can submit complaints.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild onClick={() => navigate(-1)}>
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
        <h1 className="text-3xl font-bold mb-2">Submit a New Complaint</h1>
        <p className="text-gray-600">
          Fill out the form below with details about your complaint
        </p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Complaint Details</CardTitle>
            <CardDescription>
              Provide specific information to help resolve your issue efficiently
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Complaint Title</Label>
              <Input
                id="title"
                placeholder="Enter a clear, concise title for your complaint"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agency">Government Agency</Label>
              <Select
                value={selectedAgency}
                onValueChange={handleAgencyChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the responsible agency" />
                </SelectTrigger>
                <SelectContent>
                  {mockAgencies.map((agency) => (
                    <SelectItem key={agency.id} value={agency.id}>
                      {agency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Complaint Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                disabled={!selectedAgency}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedAgency ? "Select category" : "Select an agency first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter the location related to this complaint"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide as much detail as possible about the issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Supporting Image (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="max-w-sm"
                />
                {image && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 rounded-md"
                  />
                </div>
              )}
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
              disabled={isSubmitting || !title || !selectedAgency || !selectedCategory || !description || !location}
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewComplaint;
