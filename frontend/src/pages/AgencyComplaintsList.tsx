import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AgencyComplaintsList = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("REVIEWED");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Get unique categories
  const categories = Array.from(new Set(complaints.map(c => c.category)));

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (complaint.description && complaint.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || complaint.complaintStatus === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenReview = (complaint: any) => {
    setSelectedComplaint(complaint);
    setResponse(complaint.response || "");
    setStatus(complaint.complaintStatus || "REVIEWED");
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8085/api/complaints/${selectedComplaint.id}/status?agencyId=${currentUser.id}&status=${status}&response=${encodeURIComponent(response)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit review");
      }
      toast({ title: "Review Submitted", description: `Complaint #${selectedComplaint.id} has been updated.` });
      setReviewModalOpen(false);
      // Refresh complaints
      const updated = await res.json();
      setComplaints(prev => prev.map(c => c.id === updated.id ? updated : c));
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Agency Complaints</h1>
        <p className="text-gray-600">Complaints submitted to your agency</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Complaints</CardTitle>
          <CardDescription>All complaints submitted to your agency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
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
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Citizen</th>
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
                          onClick={() => handleOpenReview(complaint)}
                        >
                          Review
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

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Complaint</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <form onSubmit={handleSubmitReview} className="space-y-4">
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
                <strong>Citizen:</strong> {selectedComplaint.citizenName || 'N/A'}
              </div>
              <div className="space-y-2">
                <label>Status</label>
                <Select value={status} onValueChange={setStatus} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label>Response Message</label>
                <Textarea
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  placeholder="Write your response to the citizen..."
                  rows={4}
                  required={status !== "PENDING"}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setReviewModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgencyComplaintsList; 