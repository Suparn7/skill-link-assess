import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Search, Download, Eye, Filter, RefreshCw, CheckCircle, XCircle } from "lucide-react";

interface Application {
  id: string;
  application_number: string;
  status: 'draft' | 'submitted' | 'payment_pending' | 'payment_completed' | 'document_pending' | 'completed' | 'rejected';
  created_at: string;
  submitted_at: string | null;
  user_id: string;
  post_id: string;
  profiles?: {
    email: string;
    personal_info: Array<{
      first_name: string;
      last_name: string;
      registration_number: string;
    }> | null;
  } | null;
  posts?: {
    post_name: string;
    post_code: string;
  } | null;
  payments?: Array<{
    amount: number;
    payment_status: string;
  }>;
}

export function ApplicationManagement() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchApplications();
  }, [currentPage, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('applications')
        .select(`
          *,
          profiles:profiles!applications_user_id_fkey (
            email,
            personal_info:personal_info (first_name, last_name, registration_number)
          ),
          posts:posts!applications_post_id_fkey (post_name, post_code),
          payments:payments (amount, payment_status)
        `, { count: 'exact' })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setApplications((data as any) || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: 'draft' | 'submitted' | 'payment_pending' | 'payment_completed' | 'document_pending' | 'completed' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application status updated to ${newStatus}`
      });

      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const exportApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles:profiles!applications_user_id_fkey (
            email,
            personal_info:personal_info (*)
          ),
          posts:posts!applications_post_id_fkey (*),
          payments:payments (*),
          educational_qualifications:educational_qualifications (*),
          experience_info:experience_info (*),
          documents:documents (*)
        `);

      if (error) throw error;

      // Convert to CSV
      const csvContent = convertToCSV(data);
      downloadCSV(csvContent, 'applications_export.csv');

      toast({
        title: "Success",
        description: "Applications data exported successfully"
      });
    } catch (error) {
      console.error('Error exporting applications:', error);
      toast({
        title: "Error",
        description: "Failed to export applications data",
        variant: "destructive"
      });
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = [
      'Application Number', 'Candidate Name', 'Email', 'Post Name', 
      'Status', 'Payment Status', 'Amount', 'Submitted Date'
    ];
    
    const rows = data.map(app => [
      app.application_number,
      `${app.profiles?.personal_info?.[0]?.first_name || ''} ${app.profiles?.personal_info?.[0]?.last_name || ''}`,
      app.profiles?.email,
      app.posts?.post_name,
      app.status,
      app.payments?.[0]?.payment_status || 'Pending',
      app.payments?.[0]?.amount || '0',
      new Date(app.submitted_at || app.created_at).toLocaleDateString()
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'submitted': return 'secondary';
      case 'payment_completed': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredApplications = applications.filter(app =>
    app.application_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.profiles?.personal_info?.[0]?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.profiles?.personal_info?.[0]?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Management
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchApplications}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={exportApplications} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="payment_pending">Payment Pending</SelectItem>
                <SelectItem value="payment_completed">Payment Completed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application #</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading applications...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">No applications found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-mono text-sm">
                        {application.application_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {application.profiles?.personal_info?.[0]?.first_name || ''} {application.profiles?.personal_info?.[0]?.last_name || ''}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {application.profiles?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{application.posts?.post_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Code: {application.posts?.post_code}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(application.status)}>
                          {application.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {application.payments?.[0] ? (
                          <div>
                            <Badge variant={application.payments[0].payment_status === 'completed' ? 'default' : 'outline'}>
                              {application.payments[0].payment_status}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              ₹{application.payments[0].amount}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="outline">No Payment</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {application.submitted_at ? 
                            new Date(application.submitted_at).toLocaleDateString() : 
                            'Not submitted'
                          }
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {/* View application details */}}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {application.status === 'submitted' && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => updateApplicationStatus(application.id, 'completed')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} applications
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm px-3 py-1 bg-muted rounded">
                  {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}