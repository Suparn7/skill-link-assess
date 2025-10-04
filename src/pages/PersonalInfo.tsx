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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone,
  ArrowRight,
  ArrowLeft,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const personalInfoSchema = z.object({
  postId: z.string().min(1, "Please select a post"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  category: z.enum(["general", "obc", "sc", "st", "ews"], { required_error: "Category is required" }),
  aadhar_number: z.string().regex(/^\d{12}$/, "Aadhar number must be 12 digits"),
  address: z.string().min(1, "Address is required"),
  state: z.string().default("Jharkhand"),
  district: z.string().min(1, "District is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  alternativeMobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits").optional(),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export function PersonalInfo() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [existingData, setExistingData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const form = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      state: "Jharkhand"
    }
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchPosts();
    fetchExistingData();
  }, [user, loading, navigate]);

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, post_name');
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.log('Error fetching posts:', error);
      
      toast({ title: "Error", description: "Failed to load posts", variant: "destructive" });
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchExistingData = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('personal_info')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setExistingData(data);
        form.reset({
          postId: 'post_id' in data ? String(data.post_id ?? "") : "",
          firstName: data.first_name,
          middleName: data.middle_name || "",
          lastName: data.last_name,
          fatherName: data.father_name,
          motherName: data.mother_name,
          dateOfBirth: data.date_of_birth,
          gender: data.gender,
          category: data.category,
          aadhar_number: data.aadhar_number || "",
          address: data.address,
          state: data.state,
          district: data.district,
          pincode: data.pincode,
          alternativeMobile: data.alternative_mobile || "",
        });
      }
    } catch (error) {
      console.error('Error fetching personal info:', error);
    }
  };

  const handleSubmit = async (data: PersonalInfoForm) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const personalInfoData = {
        user_id: user.id,
        post_id: data.postId,
        first_name: data.firstName,
        middle_name: data.middleName || null,
        last_name: data.lastName,
        father_name: data.fatherName,
        mother_name: data.motherName,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        category: data.category,
        aadhar_number: data.aadhar_number,
        address: data.address,
        state: data.state,
        district: data.district,
        pincode: data.pincode,
        alternative_mobile: data.alternativeMobile || null,
        registration_number: existingData?.registration_number || null
      };
      // Save personal info
      if (existingData) {
        const { error } = await supabase
          .from('personal_info')
          .update(personalInfoData)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { data: regNumber } = await supabase.rpc('generate_registration_number');
        const { error } = await supabase
          .from('personal_info')
          .insert({ ...personalInfoData, registration_number: regNumber });
        if (error) throw error;
      }

      // Ensure application row exists for this user and post
      const { data: existingApp, error: appFetchError } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', data.postId)
        .single();

      if (!existingApp) {
        // Generate application_number using Supabase RPC
        const { data: appNumber, error: appNumError } = await supabase.rpc('generate_registration_number');
        if (appNumError || !appNumber) throw appNumError || new Error('Failed to generate application number');

        // Insert new application row with all required fields
        const { error: appInsertError } = await supabase
          .from('applications')
          .insert({
            user_id: user.id,
            post_id: data.postId,
            application_number: appNumber,
            status: 'draft',
          });
        if (appInsertError) throw appInsertError;
      }
      // Optionally, update application row if you want to track more info

      toast({
        title: "Success",
        description: "Personal information saved successfully",
      });
      // TODO: Use parent callback or context to advance step, not window event
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save personal information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || postsLoading) {
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
              Personal Information
            </h1>
            <p className="text-muted-foreground">
              Please provide your personal details accurately
            </p>
          </motion.div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl font-heading text-gradient-primary flex items-center gap-3">
                <User className="h-6 w-6" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Post Selection */}
                <div className="space-y-2">
                  <Label htmlFor="postId">Select Post/Exam *</Label>
                  <Select
                    value={form.watch("postId")}
                    onValueChange={(value) => form.setValue("postId", value)}
                  >
                    <SelectTrigger className="form-glass">
                      <SelectValue placeholder="Select post/exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {posts.map((post) => (
                        <SelectItem key={post.id} value={post.id}>{post.post_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.postId && (
                    <p className="text-sm text-destructive">{form.formState.errors.postId.message}</p>
                  )}
                </div>
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      className="form-glass"
                      {...form.register("firstName")}
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      className="form-glass"
                      {...form.register("middleName")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      className="form-glass"
                      {...form.register("lastName")}
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Parent Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name *</Label>
                    <Input
                      id="fatherName"
                      className="form-glass"
                      {...form.register("fatherName")}
                    />
                    {form.formState.errors.fatherName && (
                      <p className="text-sm text-destructive">{form.formState.errors.fatherName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name *</Label>
                    <Input
                      id="motherName"
                      className="form-glass"
                      {...form.register("motherName")}
                    />
                    {form.formState.errors.motherName && (
                      <p className="text-sm text-destructive">{form.formState.errors.motherName.message}</p>
                    )}
                  </div>
                </div>

                {/* DOB, Gender, Category */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        className="pl-10 form-glass"
                        {...form.register("dateOfBirth")}
                      />
                    </div>
                    {form.formState.errors.dateOfBirth && (
                      <p className="text-sm text-destructive">{form.formState.errors.dateOfBirth.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select onValueChange={(value) => form.setValue("gender", value as any)}>
                      <SelectTrigger className="form-glass">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.gender && (
                      <p className="text-sm text-destructive">{form.formState.errors.gender.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select onValueChange={(value) => form.setValue("category", value as any)}>
                      <SelectTrigger className="form-glass">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="obc">OBC</SelectItem>
                        <SelectItem value="sc">SC</SelectItem>
                        <SelectItem value="st">ST</SelectItem>
                        <SelectItem value="ews">EWS</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                      <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                    )}
                  </div>
                </div>

                {/* Aadhar Number */}
                <div className="space-y-2">
                  <Label htmlFor="aadhar_number">Aadhar Number *</Label>
                  <Input
                    id="aadhar_number"
                    placeholder="Enter 12-digit Aadhar number"
                    className="form-glass"
                    maxLength={12}
                    {...form.register("aadhar_number")}
                  />
                  {form.formState.errors.aadhar_number && (
                    <p className="text-sm text-destructive">{form.formState.errors.aadhar_number.message}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      placeholder="Enter your full address"
                      className="pl-10 form-glass"
                      {...form.register("address")}
                    />
                  </div>
                  {form.formState.errors.address && (
                    <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
                  )}
                </div>

                {/* State, District, Pincode */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value="Jharkhand"
                      readOnly
                      className="form-glass bg-muted"
                      {...form.register("state")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      className="form-glass"
                      {...form.register("district")}
                    />
                    {form.formState.errors.district && (
                      <p className="text-sm text-destructive">{form.formState.errors.district.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      placeholder="Enter 6-digit pincode"
                      className="form-glass"
                      maxLength={6}
                      {...form.register("pincode")}
                    />
                    {form.formState.errors.pincode && (
                      <p className="text-sm text-destructive">{form.formState.errors.pincode.message}</p>
                    )}
                  </div>
                </div>

                {/* Alternative Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="alternativeMobile">Alternative Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="alternativeMobile"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      className="pl-10 form-glass"
                      maxLength={10}
                      {...form.register("alternativeMobile")}
                    />
                  </div>
                  {form.formState.errors.alternativeMobile && (
                    <p className="text-sm text-destructive">{form.formState.errors.alternativeMobile.message}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button 
                    type="button"
                    onClick={() => navigate('/dashboard')} 
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    variant="default"
                    className="flex-1"
                  >
                    {isLoading ? "Saving..." : existingData ? "Update Information" : "Save & Continue"}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}