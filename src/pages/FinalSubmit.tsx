import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function FinalSubmit() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [post, setPost] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchApp = async () => {
      setLoadingData(true);
      try {
        const { data: app } = await supabase
          .from("applications")
          .select("*, post_id, application_number, status")
          .eq("user_id", user.id)
          .single();
        setApplication(app);
        if (app?.post_id) {
          const { data: postData } = await supabase
            .from("posts")
            .select("post_name, post_code")
            .eq("id", app.post_id)
            .single();
          setPost(postData);
        }
        // Mark application as submitted if not already
        if (app && app.status !== "submitted") {
          await supabase
            .from("applications")
            .update({ status: "submitted" })
            .eq("id", app.id);
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to load application data", variant: "destructive" });
      } finally {
        setLoadingData(false);
      }
    };
    fetchApp();
  }, [user]);

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Submitting your application...</p>
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
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-heading text-gradient-primary flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Application Submitted Successfully!
              </CardTitle>
              <Badge className="gov-badge mt-2">Application No: {application?.application_number || '--'}</Badge>
              {post && (
                <div className="mt-2 text-muted-foreground text-sm">Exam/Post: <strong>{post.post_name}</strong> ({post.post_code})</div>
              )}
            </CardHeader>
            <CardContent>
              <div className="mb-6 text-center">
                <h2 className="text-lg font-semibold mb-2 text-green-700">Congratulations!</h2>
                <p className="text-muted-foreground mb-2">Your application has been submitted. Please save your application number for future reference.</p>
                <p className="text-muted-foreground mb-2">You will receive an SMS and email confirmation with your application details shortly.</p>
                <p className="text-muted-foreground mb-2">Keep this number safe. You will need it to download your admit card, check results, and for all future correspondence.</p>
              </div>
              <div className="flex gap-4 pt-6 justify-center">
                <Button type="button" onClick={() => navigate('/dashboard')} variant="ghost" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
