import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  FileText, 
  CreditCard, 
  Settings,
  BarChart3,
  Download,
  Eye,
  UserCheck,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CandidateManagement } from "@/components/admin/CandidateManagement";
import { ApplicationManagement } from "@/components/admin/ApplicationManagement";

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  completedApplications: number;
  totalPayments: number;
  pendingPayments: number;
  totalCandidates: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    completedApplications: 0,
    totalPayments: 0,
    pendingPayments: 0,
    totalCandidates: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    
    // Check if user is admin (this should be validated against profile role)
    checkAdminAccess();
    fetchDashboardStats();
  }, [user, loading, navigate]);

  const checkAdminAccess = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (profile?.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/dashboard');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch applications stats
      const { data: applications } = await supabase
        .from('applications')
        .select('status');
      
      // Fetch payments stats
      const { data: payments } = await supabase
        .from('payments')
        .select('payment_status, amount');
      
      // Fetch candidates count
      const { data: candidates } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'candidate');

      const totalApplications = applications?.length || 0;
      const pendingApplications = applications?.filter(app => app.status === 'draft' || app.status === 'submitted').length || 0;
      const completedApplications = applications?.filter(app => app.status === 'completed').length || 0;
      
      const totalPayments = payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
      const pendingPayments = payments?.filter(payment => payment.payment_status === 'pending').length || 0;
      
      const totalCandidates = candidates?.length || 0;

      setStats({
        totalApplications,
        pendingApplications,
        completedApplications,
        totalPayments,
        pendingPayments,
        totalCandidates
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge className="gov-badge mb-4">
              Administration Panel
            </Badge>
            <h1 className="text-3xl font-heading font-bold text-gradient-primary mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage applications, candidates, and system settings
            </p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Candidates</p>
                    <p className="text-2xl font-bold">{stats.totalCandidates}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                    <p className="text-2xl font-bold">{stats.totalApplications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Applications</p>
                    <p className="text-2xl font-bold">{stats.pendingApplications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{stats.totalPayments.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Recent Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completed Applications</span>
                        <Badge variant="default">{stats.completedApplications}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pending Applications</span>
                        <Badge variant="outline">{stats.pendingApplications}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Applications</span>
                        <Badge variant="secondary">{stats.totalApplications}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Revenue</span>
                        <span className="font-semibold">₹{stats.totalPayments.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pending Payments</span>
                        <Badge variant="outline">{stats.pendingPayments}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="flex flex-col gap-2 h-auto p-6">
                      <Eye className="h-6 w-6" />
                      <span className="text-sm">View All Candidates</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col gap-2 h-auto p-6">
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">Manage Applications</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col gap-2 h-auto p-6">
                      <Download className="h-6 w-6" />
                      <span className="text-sm">Export Data</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col gap-2 h-auto p-6">
                      <Settings className="h-6 w-6" />
                      <span className="text-sm">System Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="candidates" className="mt-6">
              <CandidateManagement />
            </TabsContent>

            <TabsContent value="applications" className="mt-6">
              <ApplicationManagement />
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Payment management features coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">System settings features coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}