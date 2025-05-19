import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, CheckSquare, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for citizen complaints
const mockComplaints = [
  {
    id: "C001",
    title: "Broken Street Light",
    agency: "Department of Infrastructure",
    status: "Pending",
    date: "2025-04-28",
    category: "Street Lighting"
  },
  {
    id: "C002",
    title: "Missed Garbage Collection",
    agency: "Department of Sanitation",
    status: "Reviewed",
    date: "2025-05-10",
    category: "Waste Management"
  },
  {
    id: "C003",
    title: "Pothole on Main Street",
    agency: "Department of Transport",
    status: "Resolved",
    date: "2025-05-01",
    category: "Road Issues",
    response: "The pothole has been filled in. Thank you for your report."
  },
  {
    id: "C004",
    title: "Noise Complaint",
    agency: "Department of Environment",
    status: "Pending",
    date: "2025-05-15",
    category: "Noise Pollution"
  }
];

const CitizenDashboard = () => {
  const { toast } = useToast();

  const pendingCount = mockComplaints.filter(c => c.status === "Pending").length;
  const reviewedCount = mockComplaints.filter(c => c.status === "Reviewed").length;
  const resolvedCount = mockComplaints.filter(c => c.status === "Resolved").length;
  
  const handleViewResponse = (complaint: any) => {
    if (complaint.response) {
      toast({
        title: `Response for #${complaint.id}`,
        description: complaint.response,
      });
    }
  };

  // Modal and form state
  const [open, setOpen] = useState(false);
  const [agencies, setAgencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", agencyId: "", category: "", description: "" });

  // Fetch agencies when modal opens
  useEffect(() => {
    if (open) {
      fetch("/api/agencies") // Adjust endpoint as per your backend
        .then(res => res.json())
        .then(data => setAgencies(data));
    }
  }, [open]);

  // Fetch categories when agency changes
  useEffect(() => {
    if (form.agencyId) {
      fetch(`/api/agencies/${form.agencyId}/categories`)
        .then(res => res.json())
        .then(data => setCategories(data));
    } else {
      setCategories([]);
    }
  }, [form.agencyId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setOpen(false);
    // Optionally refresh complaints list here
  };

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
                {mockComplaints.map((complaint) => (
                  <tr key={complaint.id} className="border-b border-border">
                    <td className="p-3 text-sm">{complaint.id}</td>
                    <td className="p-3 text-sm font-medium">{complaint.title}</td>
                    <td className="p-3 text-sm">{complaint.agency}</td>
                    <td className="p-3 text-sm">{complaint.category}</td>
                    <td className="p-3 text-sm">{complaint.date}</td>
                    <td className="p-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                          complaint.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {complaint.status}
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
        </CardContent>
      </Card>

      {/* Create Complaint Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Complaint</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <Select
              value={form.agencyId}
              onValueChange={value => setForm(f => ({ ...f, agencyId: value, category: "" }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Agency" />
              </SelectTrigger>
              <SelectContent>
                {agencies.map(agency => (
                  <SelectItem key={agency.id} value={agency.id}>
                    {agency.agencyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={form.category}
              onValueChange={value => setForm(f => ({ ...f, category: value }))}
              required
              disabled={!form.agencyId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CitizenDashboard;
