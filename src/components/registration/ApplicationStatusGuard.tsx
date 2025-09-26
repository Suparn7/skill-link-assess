import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';

interface ApplicationStatusGuardProps {
  children: React.ReactNode;
  allowedStatuses?: string[];
}

export function ApplicationStatusGuard({ 
  children, 
  allowedStatuses = ['draft', 'payment_pending', 'document_pending'] 
}: ApplicationStatusGuardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationNumber, setApplicationNumber] = useState<string>('');

  useEffect(() => {
    checkApplicationStatus();
  }, [user]);

  const checkApplicationStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: application } = await supabase
        .from('applications')
        .select('status, application_number')
        .eq('user_id', user.id)
        .maybeSingle();

      if (application) {
        setApplicationStatus(application.status);
        setApplicationNumber(application.application_number);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking application status...</p>
        </div>
      </div>
    );
  }

  // If application is submitted, block access to registration forms
  if (applicationStatus === 'submitted') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="glass-card max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-6" />
            <h2 className="text-2xl font-heading font-bold text-success mb-4">
              Application Already Submitted
            </h2>
            <p className="text-muted-foreground mb-4">
              Your application has been successfully submitted and is under review.
            </p>
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-success-foreground">
                Application Number: <strong>{applicationNumber}</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                No further edits are allowed after submission.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="default"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If status is not in allowed statuses, show appropriate message
  if (applicationStatus && !allowedStatuses.includes(applicationStatus)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="glass-card max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-heading font-bold mb-4">
              Access Restricted
            </h2>
            <p className="text-muted-foreground mb-6">
              This section cannot be accessed with your current application status: {applicationStatus}
            </p>
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="default"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}