import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CitizenComplaintsList = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    const fetchComplaints = async () => {
      try {
        const res = await fetch(`http://localhost:8085/api/complaints/citizen/${currentUser.id}`);
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

  const filteredComplaints = complaints.filter(complaint =>
    complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (complaint.description && complaint.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewResponse = (complaint: any) => {
    if (complaint.response) {
      toast({
        title: `Response for #${complaint.id}`,
        description: complaint.response,
      });
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Complaints</h1>
        <p className="text-gray-600">Track and manage your submitted complaints</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Complaints</CardTitle>
          <CardDescription>All complaints you have submitted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : filteredComplaints.length === 0 ? (
            <div>No complaints found.</div>
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
                  {filteredComplaints.map(complaint => (
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
    </div>
  );
};

export default CitizenComplaintsList; 