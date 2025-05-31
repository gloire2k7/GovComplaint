import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, CheckSquare, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CitizenDashboard = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal and form state
  const [open, setOpen] = useState(false);
  const [agencies, setAgencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ 
    title: "", 
    agencyId: "", 
    category: "", 
    description: "",
    location: ""
  });

  // Fetch agencies when modal opens
  useEffect(() => {
    if (open) {
      fetch("http://localhost:8085/api/agencies")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setAgencies(data);
          } else {
            setAgencies([]);
          }
        })
        .catch(error => {
          setAgencies([]); // fallback to empty array
          toast({
            title: "Error",
            description: "Failed to fetch agencies. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [open]);

  // Fetch categories when agency changes
  useEffect(() => {
    if (form.agencyId) {
      fetch(`http://localhost:8085/api/agencies/${form.agencyId}/categories`)
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(() => setCategories([]));
    } else {
      setCategories([]);
    }
  }, [form.agencyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8085/api/complaints", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          citizenId: currentUser?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      toast({
        title: "Success",
        description: "Complaint submitted successfully",
      });
      setOpen(false);
      // Reset form
      setForm({ 
        title: "", 
        agencyId: "", 
        category: "", 
        description: "",
        location: ""
      });
      // Refresh complaints list
      fetchComplaints();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add function to fetch complaints
  const fetchComplaints = async () => {
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch(`http://localhost:8085/api/complaints/citizen/${currentUser.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }
      const data = await response.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch complaints. Please try again.",
        variant: "destructive",
      });
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch complaints on component mount
  useEffect(() => {
    if (currentUser?.id) {
      fetchComplaints();
    }
  }, [currentUser?.id]);

  const pendingCount = complaints.filter(c => c.status === "PENDING").length;
  const reviewedCount = complaints.filter(c => c.status === "REVIEWED").length;
  const resolvedCount = complaints.filter(c => c.status === "RESOLVED").length;
  
  const handleViewResponse = (complaint: any) => {
    if (complaint.response) {
      toast({
        title: `Response for #${complaint.id}`,
        description: complaint.response,
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in to view your dashboard.
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
    <div className="space-y-8 p-4 md:p-8 max-w-6xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-lg shadow bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-600" />
              Pending Complaints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-lg shadow bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-blue-600" />
              Reviewed Complaints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{reviewedCount}</p>
            <p className="text-sm text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-lg shadow bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-green-600" />
              Resolved Complaints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{resolvedCount}</p>
            <p className="text-sm text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Complaints */}
      <Card className="rounded-lg shadow bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>Your most recent complaint submissions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="default" onClick={() => setOpen(true)}>
                Create Complaint
              </Button>
              <Button asChild variant="outline">
                <Link to="/complaints">View All Complaints</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading complaints...</div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No complaints found.</p>
              <Button variant="link" onClick={() => setOpen(true)}>
                Submit your first complaint
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Agency</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint.id} className="border-b border-border">
                      <td className="p-3 text-sm">{complaint.id}</td>
                      <td className="p-3 text-sm font-medium">{complaint.title}</td>
                      <td className="p-3 text-sm">{complaint.agencyName || 'N/A'}</td>
                      <td className="p-3 text-sm">{complaint.category}</td>
                      <td className="p-3 text-sm">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${complaint.complaintStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            complaint.complaintStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {complaint.complaintStatus}
                        </span>
                      </td>
                      <td className="p-3 text-sm">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={!complaint.response}
                          onClick={() => handleViewResponse(complaint)}
                        >
                          {complaint.response ? "View Response" : "No Response Yet"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Complaint Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Complaint</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter complaint title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyId">Agency</Label>
              <Select
                value={form.agencyId}
                onValueChange={value => setForm(f => ({ ...f, agencyId: value, category: "" }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Agency" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(agencies) && agencies.length > 0 ? (
                    agencies.map(agency => (
                      <SelectItem key={agency.id} value={agency.id}>
                        {agency.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-muted-foreground">No agencies available</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.category}
                onValueChange={value => setForm(f => ({ ...f, category: value }))}
                required
                disabled={!form.agencyId || categories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={categories.length === 0 ? "No categories available" : "Select Category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter detailed description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Complaint</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CitizenDashboard;
