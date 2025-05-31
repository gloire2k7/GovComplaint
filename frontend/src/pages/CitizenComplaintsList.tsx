import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CitizenComplaintsList = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 10;

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

  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * complaintsPerPage,
    currentPage * complaintsPerPage
  );

  const handleViewResponse = (complaint: any) => {
    setSelectedComplaint(complaint);
    setResponseModalOpen(true);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Complaints</h1>
        <p className="text-gray-600">Complaints you have submitted</p>
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
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">ID</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Title</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedComplaints.map(complaint => (
                      <tr key={complaint.id} className="border-b border-border">
                        <td className="p-3 text-sm">{complaint.id}</td>
                        <td className="p-3 text-sm font-medium">{complaint.title}</td>
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
                            onClick={() => handleViewResponse(complaint)}
                          >
                            View Response
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Response Modal */}
      <Dialog open={responseModalOpen} onOpenChange={setResponseModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complaint Response</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div>
                <strong>Title:</strong> {selectedComplaint.title}
              </div>
              <div>
                <strong>Description:</strong> {selectedComplaint.description}
              </div>
              <div>
                <strong>Category:</strong> {selectedComplaint.category}
              </div>
              <div>
                <strong>Status:</strong> {selectedComplaint.complaintStatus}
              </div>
              <div>
                <strong>Response:</strong> {selectedComplaint.response || "No response yet."}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setResponseModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CitizenComplaintsList; 