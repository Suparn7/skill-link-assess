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
import { Search, UserCheck, UserX, Download, Eye, Filter, RefreshCw } from "lucide-react";

interface Candidate {
  id: string;
  email: string;
  role: string;
  phone_verified: boolean;
  is_active: boolean;
  created_at: string;
  mobile_number: string | null;
  personal_info?: Array<{
    first_name: string;
    last_name: string;
    registration_number: string;
  }> | null;
  applications?: Array<{
    status: string;
    application_number: string;
  }>;
}

export function CandidateManagement() {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchCandidates();
  }, [currentPage, statusFilter]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          personal_info:personal_info(first_name, last_name, registration_number),
          applications:applications(status, application_number)
        `, { count: 'exact' })
        .eq('role', 'candidate')
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('is_active', statusFilter === 'active');
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setCandidates((data as any) || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch candidates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCandidateStatus = async (candidateId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('user_id', candidateId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Candidate ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });

      fetchCandidates();
    } catch (error) {
      console.error('Error updating candidate status:', error);
      toast({
        title: "Error",
        description: "Failed to update candidate status",
        variant: "destructive"
      });
    }
  };

  const exportCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          personal_info:personal_info(*),
          applications:applications(*),
          educational_qualifications:educational_qualifications(*),
          experience_info:experience_info(*)
        `)
        .eq('role', 'candidate');

      if (error) throw error;

      // Convert to CSV
      const csvContent = convertToCSV(data);
      downloadCSV(csvContent, 'candidates_export.csv');

      toast({
        title: "Success",
        description: "Candidates data exported successfully"
      });
    } catch (error) {
      console.error('Error exporting candidates:', error);
      toast({
        title: "Error",
        description: "Failed to export candidates data",
        variant: "destructive"
      });
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = ['Email', 'Name', 'Registration Number', 'Phone Verified', 'Status', 'Created Date'];
    const rows = data.map(candidate => [
      candidate.email,
      `${candidate.personal_info?.[0]?.first_name || ''} ${candidate.personal_info?.[0]?.last_name || ''}`,
      candidate.personal_info?.[0]?.registration_number || 'N/A',
      candidate.phone_verified ? 'Yes' : 'No',
      candidate.is_active ? 'Active' : 'Inactive',
      new Date(candidate.created_at).toLocaleDateString()
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

  const filteredCandidates = candidates.filter(candidate =>
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.personal_info?.[0]?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.personal_info?.[0]?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <UserCheck className="h-5 w-5" />
              Candidate Management
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchCandidates}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={exportCandidates} variant="outline" size="sm">
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
                placeholder="Search candidates..."
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
                <SelectItem value="all">All Candidates</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Candidates Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration No.</TableHead>
                  <TableHead>Phone Verified</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading candidates...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">No candidates found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {candidate.personal_info?.[0]?.first_name || ''} {candidate.personal_info?.[0]?.last_name || ''}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined: {new Date(candidate.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>
                        {candidate.personal_info?.[0]?.registration_number || 'Not assigned'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={candidate.phone_verified ? "default" : "outline"}>
                          {candidate.phone_verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {candidate.applications?.length || 0} Applications
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={candidate.is_active ? "default" : "destructive"}>
                          {candidate.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {/* View candidate details */}}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={candidate.is_active ? "destructive" : "default"}
                            onClick={() => toggleCandidateStatus(candidate.id, candidate.is_active)}
                          >
                            {candidate.is_active ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} candidates
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