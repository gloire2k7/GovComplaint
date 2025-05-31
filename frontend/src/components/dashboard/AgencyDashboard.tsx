import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, CheckSquare, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AgencyDashboard = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchComplaints = async () => {
      try {
        const res = await fetch(`http://localhost:8085/api/complaints/agency/${currentUser.id}`);
        if (!res.ok) throw new Error("Failed to fetch complaints");
        const data = await res.json();
        setComplaints(Array.isArray(data) ? data : []);
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [currentUser, toast]);

  const pendingCount = complaints.filter(c => c.complaintStatus === "PENDING").length;
  const reviewedCount = complaints.filter(c => c.complaintStatus === "REVIEWED").length;
  const resolvedCount = complaints.filter(c => c.complaintStatus === "APPROVED").length;

  const handleReviewComplaint = (complaint: any) => {
    toast({
      title: "Complaint Review",
      description: `Opening review for complaint #${complaint.id}`,
    });
  };

  // Group complaints by category for the chart
  const complaintsByCategory = complaints.reduce((acc: Record<string, number>, complaint: any) => {
    acc[complaint.category] = (acc[complaint.category] || 0) + 1;
    return acc;
  }, {});

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
              Under Review
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
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{resolvedCount}</p>
            <p className="text-sm text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card className="rounded-lg shadow bg-white">
        <CardHeader>
          <CardTitle>Complaint Categories</CardTitle>
          <CardDescription>Distribution of complaints by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(complaintsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="font-medium">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="bg-gov-blue h-2 rounded-full" style={{ width: `${Number(count) * 30}px` }}></div>
                  <span className="text-sm text-muted-foreground">{String(count)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Complaints */}
      <Card className="rounded-lg shadow bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>Latest complaints for your agency</CardDescription>
            </div>
            <Button asChild>
              <Link to="/complaints">All Complaints</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Citizen</th>
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
                    <td className="p-3 text-sm">{complaint.citizenName || 'N/A'}</td>
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
                        onClick={() => handleReviewComplaint(complaint)}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyDashboard;
