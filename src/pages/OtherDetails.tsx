import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function OtherDetails() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [otherDetails, setOtherDetails] = useState<any>({});

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchOtherDetails();
  }, [user, loading, navigate]);

  const fetchOtherDetails = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("other_details")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      if (data) setOtherDetails(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch other details",
        variant: "destructive",
      });
    }
  };

  // Add your form fields and save logic here, similar to Education/Experience

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Badge className="gov-badge mb-4">
            Other Details
          </Badge>
          <h1 className="text-4xl font-heading font-bold text-gradient-primary mb-4">
            Other Details
          </h1>
          <p className="text-muted-foreground">
            Please fill in your other details.
          </p>
        </motion.div>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-heading text-gradient-primary">
              Other Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Category Selection */}
            <div className="space-y-4">
              <div>
                <label className="form-label">Category *</label>
                <select
                  className="form-glass"
                  value={otherDetails.category || ""}
                  onChange={e => setOtherDetails({ ...otherDetails, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="UR">UR</option>
                  <option value="EBC-1">EBC-1</option>
                  <option value="BC-II">BC-II</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
              <div>
                <label className="form-label">Are you from PVTG? *</label>
                <select
                  className="form-glass"
                  value={otherDetails.isPVTG ? "yes" : "no"}
                  onChange={e => setOtherDetails({ ...otherDetails, isPVTG: e.target.value === "yes" })}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {otherDetails.isPVTG && (
                <div>
                  <label className="form-label">PVTG Name</label>
                  <input
                    className="form-glass"
                    value={otherDetails.pvtgName || ""}
                    onChange={e => setOtherDetails({ ...otherDetails, pvtgName: e.target.value })}
                  />
                </div>
              )}
              <div>
                <label className="form-label">Are you an ex-servicemen? *</label>
                <select
                  className="form-glass"
                  value={otherDetails.isExServicemen ? "yes" : "no"}
                  onChange={e => setOtherDetails({ ...otherDetails, isExServicemen: e.target.value === "yes" })}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="form-label">Physical Disability 40% or more? *</label>
                <select
                  className="form-glass"
                  value={otherDetails.isDisabled ? "yes" : "no"}
                  onChange={e => setOtherDetails({ ...otherDetails, isDisabled: e.target.value === "yes" })}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {otherDetails.isDisabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Disability Type</label>
                    <input
                      className="form-glass"
                      value={otherDetails.disabilityType || ""}
                      onChange={e => setOtherDetails({ ...otherDetails, disabilityType: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">PH Certificate Number</label>
                    <input
                      className="form-glass"
                      value={otherDetails.disabilityCertNo || ""}
                      onChange={e => setOtherDetails({ ...otherDetails, disabilityCertNo: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Date of Issue of PH Certificate</label>
                    <input
                      type="date"
                      className="form-glass"
                      value={otherDetails.disabilityCertDate || ""}
                      onChange={e => setOtherDetails({ ...otherDetails, disabilityCertDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Issuing Authority</label>
                    <input
                      className="form-glass"
                      value={otherDetails.disabilityCertAuthority || ""}
                      onChange={e => setOtherDetails({ ...otherDetails, disabilityCertAuthority: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Percentage of Disability</label>
                    <input
                      type="number"
                      min="40"
                      max="100"
                      className="form-glass"
                      value={otherDetails.disabilityPercent || ""}
                      onChange={e => setOtherDetails({ ...otherDetails, disabilityPercent: e.target.value })}
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="form-label">Do you claim reservation under sports Quota? *</label>
                <select
                  className="form-glass"
                  value={otherDetails.isSportsQuota ? "yes" : "no"}
                  onChange={e => setOtherDetails({ ...otherDetails, isSportsQuota: e.target.value === "yes" })}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {otherDetails.isSportsQuota && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Level of Competition</label>
                    <select
                      className="form-glass"
                      value={otherDetails.sportsLevel || ""}
                      onChange={e => setOtherDetails({ ...otherDetails, sportsLevel: e.target.value })}
                    >
                      <option value="">Select Level</option>
                      <option value="international">International</option>
                      <option value="national">National</option>
                      <option value="state">State</option>
                      <option value="district">District</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Sports Certificate Number</label>
                    <input
                      className="form-glass"
                      value={otherDetails.sportsCertNo || ""}
                      onChange={e => setOtherDetails({ ...otherDetails, sportsCertNo: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Date of Issue of Sports Certificate</label>
                    <input
                      type="date"
                      className="form-glass"
                      value={otherDetails.sportsCertDate || ""}
                      onChange={e => setOtherDetails({ ...otherDetails, sportsCertDate: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
