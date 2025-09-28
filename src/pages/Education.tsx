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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  GraduationCap, 
  Plus, 
  Trash2,
  ArrowRight,
  ArrowLeft,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const educationSchema = z.object({
  qualificationType: z.string().min(1, "Qualification type is required"),
  boardUniversity: z.string().min(1, "Board/University is required"),
  passingYear: z.number().min(1950, "Invalid year").max(new Date().getFullYear(), "Invalid year"),
  percentage: z.number().min(0).max(100).optional(),
  grade: z.string().optional(),
  subjects: z.string().optional(),
  rollNumber: z.string().optional(),
});

type EducationForm = z.infer<typeof educationSchema>;

interface Education extends EducationForm {
  id?: string;
}

export function Education({ onNext }: { onNext?: () => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [educations, setEducations] = useState<Education[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<EducationForm>({
    resolver: zodResolver(educationSchema),
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchEducationData();
  }, [user, loading, navigate]);

  const fetchEducationData = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('educational_qualifications')
        .select('*')
        .eq('user_id', user.id)
        .order('passing_year', { ascending: false });
      if (error) {
        console.error('Supabase fetch error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch education data',
          variant: 'destructive',
        });
        return;
      }
      if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
          qualificationType: item.qualification_type,
          boardUniversity: item.board_university,
          passingYear: item.passing_year,
          percentage: item.percentage || undefined,
          grade: item.grade || undefined,
          subjects: item.subjects || undefined,
          rollNumber: item.roll_number || undefined,
        }));
        setEducations(formattedData);
        console.log('Fetched educations:', formattedData);
      }
    } catch (error) {
      console.error('Error fetching education data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch education data',
        variant: 'destructive',
      });
    }
  };

  const handleAddEducation = async (data: EducationForm) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const educationData = {
        user_id: user.id,
        qualification_type: data.qualificationType,
        board_university: data.boardUniversity,
        passing_year: data.passingYear,
        percentage: data.percentage || null,
        grade: data.grade || null,
        subjects: data.subjects || null,
        roll_number: data.rollNumber || null,
      };
      if (editingIndex !== null) {
        // Update existing education
        const educationToUpdate = educations[editingIndex];
        const { data: updateData, error } = await supabase
          .from('educational_qualifications')
          .update(educationData)
          .eq('id', educationToUpdate.id)
          .select();
        if (error) throw error;
        setEditingIndex(null);
        // Optimistically update state
        if (updateData && updateData.length > 0) {
          const updatedList = [...educations];
          updatedList[editingIndex] = {
            ...updateData[0],
            qualificationType: updateData[0].qualification_type,
            boardUniversity: updateData[0].board_university,
            passingYear: updateData[0].passing_year,
            percentage: updateData[0].percentage || undefined,
            grade: updateData[0].grade || undefined,
            subjects: updateData[0].subjects || undefined,
            rollNumber: updateData[0].roll_number || undefined,
          };
          setEducations(updatedList);
        }
        console.log('Updated education:', updateData);
      } else {
        // Add new education
        const { data: insertData, error } = await supabase
          .from('educational_qualifications')
          .insert(educationData)
          .select();
        if (error) throw error;
        // Optimistically update state
        if (insertData && insertData.length > 0) {
          setEducations(prev => [
            {
              id: insertData[0].id,
              qualificationType: insertData[0].qualification_type,
              boardUniversity: insertData[0].board_university,
              passingYear: insertData[0].passing_year,
              percentage: insertData[0].percentage || undefined,
              grade: insertData[0].grade || undefined,
              subjects: insertData[0].subjects || undefined,
              rollNumber: insertData[0].roll_number || undefined,
            },
            ...prev,
          ]);
        }
        console.log('Inserted education:', insertData);
      }
      form.reset();
      fetchEducationData();
      toast({
        title: 'Success',
        description: editingIndex !== null ? 'Education updated successfully' : 'Education added successfully',
      });
    } catch (error) {
      console.error('Error saving education:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save education',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEducation = (index: number) => {
    const education = educations[index];
    form.reset(education);
    setEditingIndex(index);
  };

  const handleDeleteEducation = async (index: number) => {
    const education = educations[index];
    
    try {
      const { error } = await supabase
        .from('educational_qualifications')
        .delete()
        .eq('id', education.id);
      
      if (error) throw error;
      
      fetchEducationData();
      toast({
        title: "Success",
        description: "Education deleted successfully",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete education",
        variant: "destructive"
      });
    }
  };

  const handleContinue = () => {
    if (educations.length === 0) {
      toast({
        title: "Warning",
        description: "Please add at least one educational qualification",
        variant: "destructive"
      });
      return;
    }
    if (onNext) {
      onNext();
    }
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
              Educational Qualifications
            </h1>
            <p className="text-muted-foreground">
              Add your educational qualifications starting from the highest degree
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Education Form */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-heading text-gradient-primary flex items-center gap-3">
                  <Plus className="h-5 w-5" />
                  {editingIndex !== null ? "Edit Education" : "Add Education"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(handleAddEducation)} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Qualification Type *</Label>
                    <Select onValueChange={(value) => form.setValue("qualificationType", value)}>
                      <SelectTrigger className="form-glass">
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10th">10th Standard</SelectItem>
                        <SelectItem value="12th">12th Standard</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="graduation">Graduation</SelectItem>
                        <SelectItem value="post_graduation">Post Graduation</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.qualificationType && (
                      <p className="text-sm text-destructive">{form.formState.errors.qualificationType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="boardUniversity">Board/University *</Label>
                    <Input
                      id="boardUniversity"
                      className="form-glass"
                      {...form.register("boardUniversity")}
                    />
                    {form.formState.errors.boardUniversity && (
                      <p className="text-sm text-destructive">{form.formState.errors.boardUniversity.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passingYear">Passing Year *</Label>
                      <Input
                        id="passingYear"
                        type="number"
                        min="1950"
                        max={new Date().getFullYear()}
                        className="form-glass"
                        {...form.register("passingYear", { valueAsNumber: true })}
                      />
                      {form.formState.errors.passingYear && (
                        <p className="text-sm text-destructive">{form.formState.errors.passingYear.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="percentage">Percentage/CGPA</Label>
                      <Input
                        id="percentage"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        className="form-glass"
                        {...form.register("percentage", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subjects">Subjects/Stream</Label>
                    <Input
                      id="subjects"
                      placeholder="e.g., Science, Commerce, Arts"
                      className="form-glass"
                      {...form.register("subjects")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      className="form-glass"
                      {...form.register("rollNumber")}
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
                      {isLoading ? "Saving..." : editingIndex !== null ? "Update" : "Add Education"}
                      <Save className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Education List */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-heading text-gradient-primary flex items-center gap-3">
                  <GraduationCap className="h-5 w-5" />
                  Your Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {educations.length > 0 ? (
                  <div className="space-y-4">
                    {educations.map((education, index) => (
                      <div key={education.id || index} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{education.qualificationType}</h4>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditEducation(index)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteEducation(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {education.boardUniversity} • {education.passingYear}
                        </p>
                        {education.percentage && (
                          <p className="text-sm text-muted-foreground">
                            Score: {education.percentage}%
                          </p>
                        )}
                        {education.subjects && (
                          <p className="text-sm text-muted-foreground">
                            Stream: {education.subjects}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No qualifications added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Navigation handled by stepper in ExamRegistration.tsx */}
        </div>
      </div>

    </div>
  );
}