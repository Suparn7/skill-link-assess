import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const FinalPreview: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [payment, setPayment] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [post, setPost] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      setLoadingData(true);
      try {
        // Personal Info
        const { data: pi } = await supabase
          .from("personal_info")
          .select("*, post_id")
          .eq("user_id", user.id)
          .single();
        setPersonalInfo(pi);

        // Application
        const { data: app } = await supabase
          .from("applications")
          .select("*, post_id, application_number, status")
          .eq("user_id", user.id)
          .single();
        setApplication(app);

        // Post
        if (app?.post_id) {
          const { data: postData } = await supabase
            .from("posts")
            .select("post_name, post_code")
            .eq("id", app.post_id)
            .single();
          setPost(postData);
        }

        // Education
        const { data: edu } = await supabase
          .from("educational_qualifications")
          .select("*")
          .eq("user_id", user.id);
        setEducation(edu || []);

        // Experience
        const { data: exp } = await supabase
          .from("experience_info")
          .select("*")
          .eq("user_id", user.id);
        setExperience(exp || []);

        // Payment
        if (app?.id) {
          const { data: pay } = await supabase
            .from("payments")
            .select("*")
            .eq("application_id", app.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
          setPayment(pay);
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to load review data", variant: "destructive" });
      } finally {
        setLoadingData(false);
      }
    };
    fetchAll();
  }, [user]);

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
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
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-heading text-gradient-primary flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Final Review & Confirmation
              </CardTitle>
              <Badge className="gov-badge mt-2">Application No: {application?.application_number || '--'}</Badge>
              {post && (
                <div className="mt-2 text-muted-foreground text-sm">Exam/Post: <strong>{post.post_name}</strong> ({post.post_code})</div>
              )}
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {personalInfo?.first_name} {personalInfo?.middle_name} {personalInfo?.last_name}</div>
                  <div><strong>Father's Name:</strong> {personalInfo?.father_name}</div>
                  <div><strong>Mother's Name:</strong> {personalInfo?.mother_name}</div>
                  <div><strong>Date of Birth:</strong> {personalInfo?.date_of_birth}</div>
                  <div><strong>Gender:</strong> {personalInfo?.gender}</div>
                  <div><strong>Category:</strong> {personalInfo?.category}</div>
                  <div><strong>Aadhar Number:</strong> {personalInfo?.aadhar_number}</div>
                  <div><strong>Address:</strong> {personalInfo?.address}</div>
                  <div><strong>State:</strong> {personalInfo?.state}</div>
                  <div><strong>District:</strong> {personalInfo?.district}</div>
                  <div><strong>Pincode:</strong> {personalInfo?.pincode}</div>
                  <div><strong>Alternative Mobile:</strong> {personalInfo?.alternative_mobile}</div>
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Education Details</h2>
                {education.length === 0 ? (
                  <div className="text-muted-foreground">No education details provided.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2">Qualification</th>
                          <th className="p-2">Board/University</th>
                          <th className="p-2">Year</th>
                          <th className="p-2">Percentage</th>
                          <th className="p-2">Grade</th>
                          <th className="p-2">Subjects</th>
                          <th className="p-2">Roll No.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {education.map((edu, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2">{edu.qualification_type}</td>
                            <td className="p-2">{edu.board_university}</td>
                            <td className="p-2">{edu.passing_year}</td>
                            <td className="p-2">{edu.percentage ?? '--'}</td>
                            <td className="p-2">{edu.grade ?? '--'}</td>
                            <td className="p-2">{edu.subjects ?? '--'}</td>
                            <td className="p-2">{edu.roll_number ?? '--'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Experience Details</h2>
                {experience.length === 0 ? (
                  <div className="text-muted-foreground">No experience details provided.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2">Company</th>
                          <th className="p-2">Designation</th>
                          <th className="p-2">From</th>
                          <th className="p-2">To</th>
                          <th className="p-2">Current</th>
                          <th className="p-2">Salary</th>
                          <th className="p-2">Job Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {experience.map((exp, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2">{exp.company_name}</td>
                            <td className="p-2">{exp.designation}</td>
                            <td className="p-2">{exp.from_date}</td>
                            <td className="p-2">{exp.to_date ?? '--'}</td>
                            <td className="p-2">{exp.is_current ? 'Yes' : 'No'}</td>
                            <td className="p-2">{exp.salary ?? '--'}</td>
                            <td className="p-2">{exp.job_description ?? '--'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
                {payment ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Amount Paid:</strong> ₹ {payment.amount}</div>
                    <div><strong>Status:</strong> {payment.payment_status}</div>
                    <div><strong>Transaction ID:</strong> {payment.transaction_id ?? '--'}</div>
                    <div><strong>Payment Date:</strong> {payment.created_at ? new Date(payment.created_at).toLocaleString() : '--'}</div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">No payment record found.</div>
                )}
              </div>
              <div className="flex gap-4 pt-6">
                <Button type="button" onClick={() => navigate('/dashboard')} variant="ghost" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
                <Button type="button" onClick={() => navigate('/final-submit')} variant="default" className="flex-1">
                  Final Submit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};
