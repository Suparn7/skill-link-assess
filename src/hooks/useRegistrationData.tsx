import { useState, useEffect, useCallback } from 'react';
import type { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface PersonalInfoData {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  father_name?: string;
  mother_name?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  category?: 'general' | 'obc' | 'sc' | 'st' | 'ews';
  aadhar_number?: string;
  address?: string;
  state?: string;
  district?: string;
  pincode?: string;
  alternative_mobile?: string;
  post_id?: string;
  permanentAddress?: string;
  permanentState?: string;
  permanentDistrict?: string;
  permanentPin?: string;
  correspondenceAddress?: string;
  correspondenceState?: string;
  correspondenceDistrict?: string;
  correspondencePin?: string;
  dateOfBirth?: string;
  fatherName?: string;
  motherName?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
}

export interface EducationData {
  qualification_type: string;
  board_university: string;
  passing_year: number;
  percentage: number;
  grade: string;
  roll_number: string;
  subjects: string;
}

export interface ExperienceData {
  company_name: string;
  designation: string;
  from_date: string;
  to_date: string;
  is_current: boolean;
  salary: number;
  job_description: string;
}

export interface ApplicationData {
  post_id?: string;
  application_number?: string;
  status?: 'draft' | 'submitted' | 'rejected' | 'payment_pending' | 'payment_completed' | 'document_pending' | 'completed';
}

export interface RegistrationData {
  personalInfo: Partial<PersonalInfoData>;
  educationInfo: EducationData[];
  experienceInfo: ExperienceData[];
  applicationInfo: Partial<ApplicationData>;
  completedSteps: number[];
  paymentDetails?: any;
}

export function useRegistrationData() {

  // Ensures an application row exists for the user and selected post
  
  const { user } = useAuth();
  const { toast } = useToast();

  const ensureApplication = useCallback(async (postId: string) => {
    if (!user?.id || !postId) return null;
    // Check if application exists for user and post
    const { data: existing, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .maybeSingle();
    if (existing) {
      setData(prev => ({
        ...prev,
        applicationInfo: existing
      }));
      return existing;
    }
    // Generate a unique application number
    const applicationNumber = 'APP-' + Date.now();
    // Create new application
    const { data: created, error: insertError } = await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        post_id: postId,
        application_number: applicationNumber,
        status: 'draft'
      })
      .select()
      .single();
    if (insertError) {
      console.error('Error creating application:', insertError);
      toast({
        title: 'Error',
        description: 'Failed to create application',
        variant: 'destructive'
      });
      return null;
    }
    setData(prev => ({
      ...prev,
      applicationInfo: created
    }));
    return created;
  }, [user?.id, toast]);
  
  const [data, setData] = useState<RegistrationData>({
  personalInfo: {},
  educationInfo: [],
  experienceInfo: [],
  applicationInfo: {},
  completedSteps: [],
  paymentDetails: undefined
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load existing data on mount
  useEffect(() => {
    if (user?.id) {
      loadRegistrationData();
    }
  }, [user?.id]);

  const loadRegistrationData = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Load personal info
      const { data: personalData } = await supabase
        .from('personal_info')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Load education data
      const { data: educationData } = await supabase
        .from('educational_qualifications')
        .select('*')
        .eq('user_id', user.id);

      // Load experience data
      const { data: experienceData } = await supabase
        .from('experience_info')
        .select('*')
        .eq('user_id', user.id);

      // Load application data
      const { data: applicationData } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Determine completed steps based on data
      const completedSteps: number[] = [];
      if (personalData) completedSteps.push(1);
      // Other Details step: check if user has other_details record
      const { data: otherDetailsData } = await supabase
        .from('other_details')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (otherDetailsData) completedSteps.push(2);
      if (educationData && educationData.length > 0) completedSteps.push(3);
      if (experienceData && experienceData.length > 0) completedSteps.push(4);
      // Documents step: check if user has uploaded documents
      const { data: documentsData } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id);
      if (documentsData && documentsData.length > 0) completedSteps.push(5);

      // Load payment details using application_id
      let paymentDetails: any = undefined;
      if (applicationData && applicationData.id) {
        //@ts-ignore
        const { data: paymentDetailsRaw } = await supabase
          .from("payments")
          .select("id,application_id,amount,payment_status,payment_method,payment_date")
          .eq("application_id", applicationData.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        paymentDetails = paymentDetailsRaw as {
          id: string;
          application_id: string;
          amount: number;
          payment_status: string;
          payment_method: string;
          payment_date: string;
        } | undefined;
      }

      // If payment is completed, add step 6 to completedSteps
      if (paymentDetails?.payment_status === 'completed' && !completedSteps.includes(6)) {
        completedSteps.push(6);
      }
      setData({
        personalInfo: personalData || {},
        educationInfo: educationData || [],
        experienceInfo: experienceData || [],
        applicationInfo: applicationData || {},
        completedSteps,
        paymentDetails: paymentDetails || undefined
      });
    } catch (error) {
      console.error('Error loading registration data:', error);
      toast({
        title: "Error",
        description: "Failed to load your registration data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const savePersonalInfo = useCallback(async (personalInfo: Partial<PersonalInfoData>) => {
    if (!user?.id) return false;
    
    setSaving(true);
    try {
      const dataToSave = {
        user_id: user.id,
        address: personalInfo.permanentAddress ?? '',
        state: personalInfo.permanentState ?? 'Jharkhand',
        district: personalInfo.permanentDistrict ?? '',
        pincode: personalInfo.permanentPin ?? '',
        correspondence_address: personalInfo.correspondenceAddress ?? '',
        correspondence_state: personalInfo.correspondenceState ?? '',
        correspondence_district: personalInfo.correspondenceDistrict ?? '',
        correspondence_pincode: personalInfo.correspondencePin ?? '',
        date_of_birth: personalInfo.dateOfBirth ?? '',
        father_name: personalInfo.fatherName ?? '',
        mother_name: personalInfo.motherName ?? '',
        first_name: personalInfo.firstName ?? '',
        last_name: personalInfo.lastName ?? '',
  gender: (personalInfo.gender ?? 'male').toLowerCase() as 'male' | 'female' | 'other',
  category: "general" as const,
  alternative_mobile: personalInfo.mobile ?? '',
        aadhar_number: personalInfo.aadhar_number ?? '',
        post_id: personalInfo.post_id ?? null
      };

      const { error } = await supabase
        .from('personal_info')
        .upsert(dataToSave);

      if (error) throw error;

      setData(prev => ({
        ...prev,
        personalInfo,
        completedSteps: Array.from(new Set([...prev.completedSteps, 1]))
      }));

      toast({
        title: "Success",
        description: "Personal information saved successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error saving personal info:', error);
      toast({
        title: "Error",
        description: "Failed to save personal information",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [user?.id, toast]);

  const saveEducationInfo = useCallback(async (educationInfo: EducationData[]) => {
    if (!user?.id) return false;
    
    setSaving(true);
    try {
      // Delete existing records
      await supabase
        .from('educational_qualifications')
        .delete()
        .eq('user_id', user.id);

      // Insert new records if any
      if (educationInfo.length > 0) {
        const educationWithUserId = educationInfo.map(edu => ({
          user_id: user.id,
          qualification_type: edu.qualification_type || '',
          board_university: edu.board_university || '',
          passing_year: edu.passing_year || new Date().getFullYear(),
          percentage: edu.percentage || null,
          grade: edu.grade || null,
          subjects: edu.subjects || null,
          roll_number: edu.roll_number || null
        }));

        const { error } = await supabase
          .from('educational_qualifications')
          .insert(educationWithUserId);

        if (error) throw error;
      }

      setData(prev => ({
        ...prev,
        educationInfo,
        completedSteps: Array.from(new Set([...prev.completedSteps, 3]))
      }));

      toast({
        title: "Success",
        description: "Education information saved successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error saving education info:', error);
      toast({
        title: "Error",
        description: "Failed to save education information",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [user?.id, toast]);

  const saveExperienceInfo = useCallback(async (experienceInfo: ExperienceData[]) => {
    if (!user?.id) return false;
    
    setSaving(true);
    try {
      // Delete existing records
      await supabase
        .from('experience_info')
        .delete()
        .eq('user_id', user.id);

      // Insert new records if any
      if (experienceInfo.length > 0) {
        const experienceWithUserId = experienceInfo.map(exp => ({
          user_id: user.id,
          company_name: exp.company_name || '',
          designation: exp.designation || '',
          from_date: exp.from_date || new Date().toISOString().split('T')[0],
          to_date: exp.is_current ? null : (exp.to_date || new Date().toISOString().split('T')[0]),
          is_current: exp.is_current || false,
          salary: exp.salary || null,
          job_description: exp.job_description || null
        }));

        const { error } = await supabase
          .from('experience_info')
          .insert(experienceWithUserId);

        if (error) throw error;
      }

      setData(prev => ({
        ...prev,
        experienceInfo,
        completedSteps: Array.from(new Set([...prev.completedSteps, 4]))
      }));

      toast({
        title: "Success",
        description: "Experience information saved successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error saving experience info:', error);
      toast({
        title: "Error",
        description: "Failed to save experience information",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [user?.id, toast]);

  const updateLocalData = useCallback((section: keyof RegistrationData, newData: any) => {
    setData(prev => ({
      ...prev,
      [section]: newData
    }));
  }, []);

  return {
  data,
  loading,
  saving,
  savePersonalInfo,
  saveEducationInfo,
  saveExperienceInfo,
  updateLocalData,
  loadRegistrationData,
  ensureApplication
  };
}