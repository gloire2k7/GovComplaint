import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";

// Type definitions for our complaints
type BaseCitizenComplaint = {
  id: string;
  title: string;
  description: string;
  status: string;
  date: string;
  category: string;
  agency: string;
  response?: string;
};

type BaseAgencyComplaint = {
  id: string;
  title: string;
  description: string;
  status: string;
  date: string;
  category: string;
  citizen: string;
  email: string;
  response?: string;
};

type Complaint = BaseCitizenComplaint | BaseAgencyComplaint;

const ComplaintsList = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [complaints, setComplaints] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (!currentUser) return;
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        let endpoint = currentUser.userType === 'citizen'
          ? `http://localhost:8085/api/complaints/citizen`
          : `http://localhost:8085/api/complaints/agency`;
        let params = `?page=${currentPage-1}&size=${pageSize}`;
        if (statusFilter !== 'all') params += `&status=${statusFilter.toUpperCase()}`;
        if (categoryFilter !== 'all') params += `&category=${encodeURIComponent(categoryFilter)}`;
        const res = await fetch(endpoint + params, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch complaints');
        const data = await res.json();
        setComplaints(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      }
    };
    fetchComplaints();
  }, [currentUser, currentPage, statusFilter, categoryFilter]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in to view complaints.
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

  // Get unique categories
  const categories = Array.from(new Set(complaints.map(c => c.category)));

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = searchQuery === '' || 
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (complaint.description && complaint.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Paginate complaints
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewResponse = (complaint: Complaint) => {
    if (complaint.response) {
      toast({
        title: `Response for #${complaint.id}`,
        description: complaint.response,
      });
    }
  };

  const handleReviewComplaint = (complaint: Complaint) => {
    toast({
      title: "Complaint Review",
      description: `Opening review for complaint #${complaint.id}`,
    });
  };

  // Helper function to determine if a complaint is from a citizen or agency
  const isCitizenComplaint = (complaint: Complaint): complaint is BaseCitizenComplaint => {
    return 'agency' in complaint;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {currentUser.userType === 'citizen' ? 'My Complaints' : 'Manage Complaints'}
        </h1>
        <p className="text-gray-600">
          {currentUser.userType === 'citizen'
            ? 'Track and manage your submitted complaints'
            : 'Review and respond to citizen complaints'}
        </p>
      </div>
      
      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentUser.userType === 'citizen' && (
              <div className="md:col-span-4 flex justify-end">
                <Button asChild className="bg-gov-blue hover:bg-gov-darkBlue">
                  <Link to="/complaints/new">Submit New Complaint</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Complaints List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredComplaints.length > 0
              ? `${filteredComplaints.length} Complaint${filteredComplaints.length !== 1 ? 's' : ''}`
              : 'No Complaints Found'
            }
          </CardTitle>
          <CardDescription>
            {filteredComplaints.length > 0
              ? `Showing ${Math.min((currentPage - 1) * pageSize + 1, filteredComplaints.length)} to ${Math.min(currentPage * pageSize, filteredComplaints.length)} of ${filteredComplaints.length}`
              : 'Try adjusting your filters to see more results.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedComplaints.length > 0 ? (
            <div className="space-y-4">
              {paginatedComplaints.map((complaint) => (
                <div key={complaint.id} className="border rounded-md p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold">{complaint.title}</h3>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                            complaint.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {complaint.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mt-1">
                        <span>ID: {complaint.id}</span>
                        <span className="mx-2">•</span>
                        <span>Category: {complaint.category}</span>
                        <span className="mx-2">•</span>
                        <span>Date: {complaint.date}</span>
                      </div>
                      
                      {isCitizenComplaint(complaint) ? (
                        <div className="text-sm text-muted-foreground mt-1">
                          Agency: {complaint.agency}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground mt-1">
                          Submitted by: {complaint.citizen} ({complaint.email})
                        </div>
                      )}
                      
                      <p className="mt-2 text-sm">{complaint.description}</p>
                    </div>
                    
                    <div>
                      {currentUser.userType === 'citizen' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={!complaint.response}
                          onClick={() => handleViewResponse(complaint)}
                        >
                          {complaint.response ? "View Response" : "No Response Yet"}
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReviewComplaint(complaint)}
                        >
                          Review & Respond
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      >
                        Previous
                      </PaginationLink>
                    </PaginationItem>
                    
                    {Array.from({length: Math.min(totalPages, 5)}, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        // Less than 5 pages, show all
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        // Near the start, show 1,2,3,4,...
                        if (i < 4) {
                          pageNum = i + 1;
                        } else {
                          return (
                            <PaginationItem key="ellipsis-end">
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                      } else if (currentPage >= totalPages - 2) {
                        // Near the end, show ...,n-3,n-2,n-1,n
                        if (i === 0) {
                          return (
                            <PaginationItem key="ellipsis-start">
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        } else {
                          pageNum = totalPages - 4 + i;
                        }
                      } else {
                        // In the middle, show ...,c-1,c,c+1,...
                        if (i === 0) {
                          return (
                            <PaginationItem key="ellipsis-start">
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        } else if (i === 4) {
                          return (
                            <PaginationItem key="ellipsis-end">
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                      }
                      
                      if (pageNum) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              isActive={currentPage === pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      >
                        Next
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No complaints match your search criteria.</p>
              {currentUser.userType === 'citizen' && (
                <Button asChild>
                  <Link to="/complaints/new">Submit a New Complaint</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintsList;
