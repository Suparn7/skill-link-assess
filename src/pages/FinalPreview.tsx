import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
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
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [finalAppNumber, setFinalAppNumber] = useState<string | null>(null);

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

        // Documents
        const { data: docs } = await supabase
          .from("documents")
          .select("id, file_name, file_url, uploaded_at, document_type")
          .eq("user_id", user.id);
        setDocuments(docs || []);
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

  if (submitted && finalAppNumber) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Application Submitted!</h1>
          <div className="text-lg font-semibold mb-4">Your Application No:</div>
          <div className="text-2xl font-bold text-primary mb-6">{finalAppNumber}</div>
          <div className="mb-4 text-muted-foreground">Please save this number for all future exam processes. You can download or print your application summary from your dashboard.</div>
          <Button onClick={() => navigate("/Dashboard")}>Go to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="glass-card mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-gradient-primary flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Final Review & Confirmation
                </CardTitle>
                {post && (
                  <div className="mt-2 text-muted-foreground text-sm">Exam/Post: <strong>{post.post_name}</strong> ({post.post_code})</div>
                )}
              </CardHeader>
              <CardContent>
                {/* Personal Info */}
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
                {/* Education Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Educational Qualifications</h2>
                  {education.length === 0 ? (
                    <div className="text-muted-foreground">No qualifications added.</div>
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
                {/* Experience Section */}
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
                {/* Payment Section */}
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
                {/* Documents Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Uploaded Documents</h2>
                  {documents.length === 0 ? (
                    <div className="text-muted-foreground">No documents uploaded.</div>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {documents.map((doc, idx) => (
                        <div key={doc.id || idx} className="border rounded-lg p-2 bg-muted flex flex-col items-center w-40">
                          {doc.file_url ? (
                            <img
                              src={doc.file_url}
                              alt={doc.document_type ? doc.document_type : `Document ${idx + 1}`}
                              className="w-32 h-32 object-cover rounded mb-2 border"
                              onError={e => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-32 h-32 flex items-center justify-center bg-background text-muted-foreground border rounded mb-2">No Preview</div>
                          )}
                          <div className="text-xs font-semibold text-foreground mb-1">
                            {doc.document_type ? doc.document_type : 'Document'}
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">{doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString() : '--'}</div>
                          {doc.file_url && (
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">Download</a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Submit Button */}
                <div className="flex justify-end mt-8">
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-primary text-white font-bold px-6 py-3 rounded shadow-lg"
                    onClick={async () => {
                      setLoadingData(true);
                      try {
                        const nextAppNumber = `REG${new Date().getFullYear()}${String(Date.now()).slice(-7)}`;
                        const { error } = await supabase
                          .from('applications')
                          .update({
                            status: 'submitted',
                            submitted_at: new Date().toISOString(),
                            application_number: nextAppNumber
                          })
                          .eq('id', application.id)
                          .select()
                          .single();
                        if (error) throw error;
                        setFinalAppNumber(nextAppNumber);
                        setSubmitted(true);
                        toast({ title: 'Success', description: 'Application submitted successfully!' });
                      } catch (err) {
                        toast({ title: 'Error', description: 'Failed to submit application', variant: 'destructive' });
                      } finally {
                        setLoadingData(false);
                      }
                    }}
                    disabled={loadingData || submitted}
                  >
                    {submitted ? "Submitted" : "Submit Application"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
