import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Plus, 
  Trash2,
  ArrowRight,
  ArrowLeft,
  Save,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const experienceSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  designation: z.string().min(1, "Designation is required"),
  fromDate: z.string().min(1, "From date is required"),
  toDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  salary: z.number().optional(),
  jobDescription: z.string().optional(),
});

type ExperienceForm = z.infer<typeof experienceSchema>;

interface Experience extends ExperienceForm {
  id?: string;
}

export function Experience() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<ExperienceForm>({
    resolver: zodResolver(experienceSchema),
  });

  const isCurrentJob = form.watch("isCurrent");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchExperienceData();
  }, [user, loading, navigate]);

  const fetchExperienceData = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('experience_info')
        .select('*')
        .eq('user_id', user.id)
        .order('from_date', { ascending: false });
      
      if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
          companyName: item.company_name,
          designation: item.designation,
          fromDate: item.from_date,
          toDate: item.to_date || undefined,
          isCurrent: item.is_current,
          salary: item.salary || undefined,
          jobDescription: item.job_description || undefined,
        }));
        setExperiences(formattedData);
      }
    } catch (error) {
      console.error('Error fetching experience data:', error);
    }
  };

  const handleAddExperience = async (data: ExperienceForm) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const experienceData = {
        user_id: user.id,
        company_name: data.companyName,
        designation: data.designation,
        from_date: data.fromDate,
        to_date: data.isCurrent ? null : data.toDate,
        is_current: data.isCurrent,
        salary: data.salary || null,
        job_description: data.jobDescription || null,
      };

      if (editingIndex !== null) {
        // Update existing experience
        const experienceToUpdate = experiences[editingIndex];
        const { error } = await supabase
          .from('experience_info')
          .update(experienceData)
          .eq('id', experienceToUpdate.id);
        
        if (error) throw error;
        
        setEditingIndex(null);
      } else {
        // Add new experience
        const { error } = await supabase
          .from('experience_info')
          .insert(experienceData);
        
        if (error) throw error;
      }

      form.reset();
      fetchExperienceData();
      
      toast({
        title: "Success",
        description: editingIndex !== null ? "Experience updated successfully" : "Experience added successfully",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save experience",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditExperience = (index: number) => {
    const experience = experiences[index];
    form.reset(experience);
    setEditingIndex(index);
  };

  const handleDeleteExperience = async (index: number) => {
    const experience = experiences[index];
    
    try {
      const { error } = await supabase
        .from('experience_info')
        .delete()
        .eq('id', experience.id);
      
      if (error) throw error;
      
      fetchExperienceData();
      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete experience",
        variant: "destructive"
      });
    }
  };

  const handleContinue = () => {
    navigate("/documents");
  };

  const handleSkip = () => {
    navigate("/documents");
  };

  if (loading) {
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
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge className="gov-badge mb-4">
              {t('home.subtitle')}
            </Badge>
            <h1 className="text-4xl font-heading font-bold text-gradient-primary mb-4">
              Work Experience
            </h1>
            <p className="text-muted-foreground">
              Add your work experience (Skip if you're a fresher)
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Experience Form */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-heading text-gradient-primary flex items-center gap-3">
                  <Plus className="h-5 w-5" />
                  {editingIndex !== null ? "Edit Experience" : "Add Experience"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(handleAddExperience)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      className="form-glass"
                      {...form.register("companyName")}
                    />
                    {form.formState.errors.companyName && (
                      <p className="text-sm text-destructive">{form.formState.errors.companyName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation *</Label>
                    <Input
                      id="designation"
                      className="form-glass"
                      {...form.register("designation")}
                    />
                    {form.formState.errors.designation && (
                      <p className="text-sm text-destructive">{form.formState.errors.designation.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromDate">From Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fromDate"
                          type="date"
                          className="pl-10 form-glass"
                          {...form.register("fromDate")}
                        />
                      </div>
                      {form.formState.errors.fromDate && (
                        <p className="text-sm text-destructive">{form.formState.errors.fromDate.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="toDate">To Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="toDate"
                          type="date"
                          className="pl-10 form-glass"
                          disabled={isCurrentJob}
                          {...form.register("toDate")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isCurrent"
                      checked={form.watch("isCurrent")}
                      onCheckedChange={(checked) => form.setValue("isCurrent", checked as boolean)}
                    />
                    <Label htmlFor="isCurrent">Currently working here</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary (per month)</Label>
                    <Input
                      id="salary"
                      type="number"
                      min="0"
                      className="form-glass"
                      {...form.register("salary", { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="Describe your roles and responsibilities"
                      className="form-glass"
                      {...form.register("jobDescription")}
                    />
                  </div>

                  <div className="flex gap-4">
                    {editingIndex !== null && (
                      <Button 
                        type="button"
                        onClick={() => {
                          setEditingIndex(null);
                          form.reset();
                        }}
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      variant="default"
                      className="flex-1"
                    >
                      {isLoading ? "Saving..." : editingIndex !== null ? "Update" : "Add Experience"}
                      <Save className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Experience List */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-heading text-gradient-primary flex items-center gap-3">
                  <Briefcase className="h-5 w-5" />
                  Your Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                {experiences.length > 0 ? (
                  <div className="space-y-4">
                    {experiences.map((experience, index) => (
                      <div key={experience.id || index} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{experience.designation}</h4>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditExperience(index)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteExperience(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {experience.companyName}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {experience.fromDate} - {experience.isCurrent ? "Present" : experience.toDate}
                        </p>
                        {experience.salary && (
                          <p className="text-sm text-muted-foreground">
                            Salary: ₹{experience.salary.toLocaleString()}/month
                          </p>
                        )}
                        {experience.jobDescription && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {experience.jobDescription}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No experience added yet</p>
                    <p className="text-sm text-muted-foreground">
                      Fresher? No worries! You can skip this step.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <Card className="glass-card mt-6">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Button 
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1"
                >
                  Skip This Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}