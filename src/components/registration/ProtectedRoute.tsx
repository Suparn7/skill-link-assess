import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requirePhoneVerification?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false, requirePhoneVerification = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [verificationLoading, setVerificationLoading] = useState(requirePhoneVerification);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  useEffect(() => {
    if (user && requirePhoneVerification) {
      checkPhoneVerification();
    } else if (!requirePhoneVerification) {
      setVerificationLoading(false);
    }
  }, [user, requirePhoneVerification]);

  const checkPhoneVerification = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_verified')
        .eq('user_id', user!.id)
        .single();

      setIsPhoneVerified(profile?.phone_verified || false);
    } catch (error) {
      console.error('Error checking phone verification:', error);
      setIsPhoneVerified(false);
    } finally {
      setVerificationLoading(false);
    }
  };

  if (loading || (verificationLoading && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="glass-card p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">
            {loading ? "Authenticating..." : "Checking verification status..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check phone verification requirement
  if (requirePhoneVerification && !isPhoneVerified) {
    return <Navigate to="/verify-phone" state={{ from: location }} replace />;
  }

  // Check admin requirement if needed
  if (requireAdmin) {
    // This would need to be implemented based on your user role system
    // For now, assuming admin check is done elsewhere
  }

  return <>{children}</>;
}