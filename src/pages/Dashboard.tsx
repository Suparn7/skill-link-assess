import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  FileText, 
  CreditCard, 
  Upload, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  Bell,
  Calendar
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  profile?: any;
  personalInfo?: any;
  applications?: any[];
  documents?: any[];
  payments?: any[];
}

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<UserData>({});
  const [mobileVerified, setMobileVerified] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchUserData();
  }, [user, loading, navigate]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
  setMobileVerified(!!profile?.phone_verified);

      // Fetch personal info
      const { data: personalInfo } = await supabase
        .from('personal_info')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch applications
      const { data: applications } = await supabase
        .from('applications')
        .select('*, posts(*)')
        .eq('user_id', user.id);

      // Fetch documents
      const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id);

      setUserData({
        profile,
        personalInfo,
        applications: applications || [],
        documents: documents || []
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getProfileCompletionPercentage = () => {
    let completed = 0;
    const total = 4;

    if (userData.personalInfo) completed++;
    if (userData.documents && userData.documents.length > 0) completed++;
    if (userData.applications && userData.applications.length > 0) completed++;
    // Education, experience etc. would add to this

    return (completed / total) * 100;
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If not mobile verified, show only Start Registration (verify phone)
  if (!mobileVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="glass-card w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Phone Verification Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground text-sm">Please verify your mobile number to continue registration and access profile features.</p>
              <Button onClick={() => navigate('/verify-phone')} variant="default" size="lg" className="w-full">
                Start Registration
              </Button>
            </CardContent>
          </Card>
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
            <h1 className="text-3xl font-heading font-bold text-gradient-primary mb-2 text-center">
              Welcome, {userData.personalInfo?.first_name || 'Candidate'}!
            </h1>
            <p className="text-muted-foreground text-center">
              Manage your applications and track your progress
            </p>
          </motion.div>

          <div className="flex justify-center items-center min-h-[300px]">
            {/* Application Status */}
            <Card className="glass-card w-full max-w-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData.applications && userData.applications.length > 0 ? (
                  <div className="space-y-3">
                    {userData.applications.map((app: any) => (
                      <div key={app.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{app.posts?.post_name}</h4>
                          <Badge variant={
                            app.status === 'submitted' ? 'default' :
                            app.status === 'completed' ? 'secondary' :
                            app.status === 'payment_completed' ? 'secondary' :
                            'outline'
                          }>
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Application #: {app.application_number}
                        </p>
                        {app.status === 'submitted' && (
                          <p className="text-xs text-success">
                            ✓ Submitted - No edits allowed
                          </p>
                        )}
                        {app.status !== 'submitted' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => navigate('/exam-registration')}
                            className="text-xs"
                          >
                            Continue Registration
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No applications yet</p>
                    <Button 
                      onClick={() => navigate('/verify-phone')}
                      variant="default"
                      size="sm"
                      className="mt-3"
                    >
                      Start Registration
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notifications card commented out as per request */}
          {/**
          <Card className="glass-card mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Complete your profile</p>
                    <p className="text-xs text-muted-foreground">
                      Add your personal information to continue with applications
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Account created successfully</p>
                    <p className="text-xs text-muted-foreground">
                      Welcome to the assessment portal
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          */}
        </div>
      </div>

      <Footer />
    </div>
  );
}