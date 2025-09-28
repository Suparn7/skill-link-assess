import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Calendar, MapPin, User, Mail, Phone, FileText, CircleUser } from "lucide-react";
import "../styles/form.css";

export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  address: string;
  mobile: string;
  otp: string;
  residentJharkhand: boolean;
  districtName: string;
  vacancyType: string;
  fatherName: string;
  motherName: string;
  gender: string;
  maritalStatus: string;
  spouseName: string;
  aadhar_number: string;
  identificationMark1: string;
  identificationMark2: string;
  permanentAddress: string;
  correspondenceAddress: string;
  permanentState: string;
  permanentDistrict: string;
  permanentPin: string;
  correspondenceState: string;
  correspondenceDistrict: string;
  correspondencePin: string;
  sameAsPermanent: boolean;
  post_id?: string;
}

interface Props {
  data: PersonalInfoData;
  onChange: (field: keyof PersonalInfoData, value: any) => void;
  onNext: () => void;
}

export const PersonalInfoForm: React.FC<Props> = ({ data, onChange, onNext }) => {
  const [posts, setPosts] = useState<Array<{ id: string; post_name: string }>>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setPostsLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, post_name, post_code, is_active')
          .eq('is_active', true)
          .order('post_name');
        if (!error && data) {
          setPosts(data);
        }
      } catch (error) {
        // Optionally handle error
      } finally {
        setPostsLoading(false);
      }
    };
    fetchPosts();
  }, []);
  return (
    <form className="form-container">
      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="form-section form-card"
      >
        <div className="form-group-title">
          <User className="h-6 w-6" />
          Basic Information
        </div>
        <div className="form-grid">
          <div className="form-control">
            <Label className="form-label">Select Exam/Post *</Label>
            {postsLoading ? (
              <div>Loading posts...</div>
            ) : (
              <select
                className="w-full border rounded px-3 py-2"
                value={data.post_id || ''}
                onChange={e => onChange('post_id', e.target.value)}
                required
              >
                <option value="">-- Select --</option>
                {posts.map(post => (
                  <option key={post.id} value={post.id}>{post.post_name}</option>
                ))}
              </select>
            )}
          </div>
          <FormField
            label="First Name"
            icon={<User />}
            value={data.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            required
            placeholder="Enter first name"
          />

          <FormField
            label="Last Name"
            icon={<User />}
            value={data.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            required
            placeholder="Enter last name"
          />

          <FormField
            label="Date of Birth"
            icon={<Calendar />}
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => onChange('dateOfBirth', e.target.value)}
            required
            placeholder="Select date of birth"
          />

          <FormField
            label="Email"
            icon={<Mail />}
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            required
            placeholder="Enter email address"
          />

          <FormField
            label="Mobile"
            icon={<Phone />}
            value={data.mobile}
            onChange={(e) => onChange('mobile', e.target.value)}
            required
            placeholder="Enter mobile number"
          />

          <div className="form-control">
            <Label className="form-label">Resident of Jharkhand *</Label>
            <div className="flex gap-4 items-center mt-2 space-x-6">
              <label className="form-radio">
                <input 
                  type="radio" 
                  className="form-glass w-4 h-4" 
                  checked={data.residentJharkhand} 
                  onChange={() => onChange('residentJharkhand', true)} 
                /> 
                <span>Yes</span>
              </label>
              <label className="form-radio">
                <input 
                  type="radio" 
                  className="form-glass w-4 h-4" 
                  checked={!data.residentJharkhand} 
                  onChange={() => onChange('residentJharkhand', false)} 
                /> 
                <span>No</span>
              </label>
            </div>
          </div>

          <FormField
            label="District Name"
            icon={<MapPin />}
            value={data.districtName}
            onChange={(e) => onChange('districtName', e.target.value)}
            required
            placeholder="Enter your district name"
          />

          <FormField
            label="Vacancy Type"
            type="select"
            options={[
              { label: "Type 1", value: "type1" },
              { label: "Type 2", value: "type2" },
              { label: "Type 3", value: "type3" }
            ]}
            value={data.vacancyType}
            onChange={(e) => onChange('vacancyType', e.target.value)}
            required
            placeholder="Select vacancy type"
          />
        </div>
      </motion.div>

      {/* Personal Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="form-section"
      >
        <div className="form-group-title">Personal Details</div>
        <div className="form-grid">
          <FormField
            label="Father's Name"
            icon={<User />}
            value={data.fatherName}
            onChange={(e) => onChange('fatherName', e.target.value)}
            required
            placeholder="Enter father's name"
          />

          <FormField
            label="Mother's Name"
            icon={<User />}
            value={data.motherName}
            onChange={(e) => onChange('motherName', e.target.value)}
            required
            placeholder="Enter mother's name"
          />

          <FormField
            label="Gender"
            type="select"
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" }
            ]}
            value={data.gender}
            onChange={(e) => onChange('gender', e.target.value)}
            required
            icon={<CircleUser />}
          />

          <FormField
            label="Marital Status"
            type="select"
            options={[
              { label: "Unmarried", value: "Unmarried" },
              { label: "Married", value: "Married" },
              { label: "Other", value: "Other" }
            ]}
            value={data.maritalStatus}
            onChange={(e) => onChange('maritalStatus', e.target.value)}
            required
          />

          {data.maritalStatus === 'Married' && (
            <FormField
              label="Spouse Name"
              icon={<User />}
              value={data.spouseName}
              onChange={(e) => onChange('spouseName', e.target.value)}
              placeholder="Enter spouse's name"
            />
          )}
        </div>
      </motion.div>

      {/* Identification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="form-section"
      >
        <div className="form-group-title">Identification Details</div>
        <div className="form-grid">
          <FormField
            label="Aadhaar Number"
            icon={<FileText />}
            value={data.aadhar_number}
            onChange={(e) => onChange('aadhar_number', e.target.value)}
            required
            maxLength={12}
            placeholder="Enter 12-digit Aadhaar number"
          />

          <FormField
            label="Identification Mark 1"
            value={data.identificationMark1}
            onChange={(e) => onChange('identificationMark1', e.target.value)}
            required
            placeholder="Enter identification mark"
          />

          <FormField
            label="Identification Mark 2"
            value={data.identificationMark2}
            onChange={(e) => onChange('identificationMark2', e.target.value)}
            placeholder="Enter another identification mark"
          />
        </div>
      </motion.div>

      {/* Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="form-section"
      >
        <div className="form-group-title flex justify-between items-center">
          <span>Address Information</span>
          <label className="form-checkbox">
            <input 
              type="checkbox" 
              checked={data.sameAsPermanent} 
              onChange={(e) => onChange('sameAsPermanent', e.target.checked)} 
            />
            <span>Same as Permanent Address</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 form-card">
            <div className="text-lg font-semibold mb-4">Permanent Address</div>
            <div className="space-y-4">
              <FormField
                label="Address"
                icon={<MapPin />}
                value={data.permanentAddress}
                onChange={(e) => onChange('permanentAddress', e.target.value)}
                required
                type="textarea"
                placeholder="Enter permanent address"
              />

              <FormField
                label="State / UT"
                value={data.permanentState}
                onChange={(e) => onChange('permanentState', e.target.value)}
                required
                placeholder="Enter state/UT"
              />

              <FormField
                label="District"
                value={data.permanentDistrict}
                onChange={(e) => onChange('permanentDistrict', e.target.value)}
                required
                placeholder="Enter district"
              />

              <FormField
                label="PIN Code"
                value={data.permanentPin}
                onChange={(e) => onChange('permanentPin', e.target.value)}
                required
                maxLength={6}
                placeholder="Enter 6-digit PIN code"
              />
            </div>
          </Card>

          <Card className="p-4 form-card">
            <div className="text-lg font-semibold mb-4">Correspondence Address</div>
            <div className="space-y-4">
              <FormField
                label="Address"
                icon={<MapPin />}
                value={data.correspondenceAddress}
                onChange={(e) => onChange('correspondenceAddress', e.target.value)}
                required
                type="textarea"
                placeholder="Enter correspondence address"
                disabled={data.sameAsPermanent}
              />

              <FormField
                label="State / UT"
                value={data.correspondenceState}
                onChange={(e) => onChange('correspondenceState', e.target.value)}
                required
                placeholder="Enter state/UT"
                disabled={data.sameAsPermanent}
              />

              <FormField
                label="District"
                value={data.correspondenceDistrict}
                onChange={(e) => onChange('correspondenceDistrict', e.target.value)}
                required
                placeholder="Enter district"
                disabled={data.sameAsPermanent}
              />

              <FormField
                label="PIN Code"
                value={data.correspondencePin}
                onChange={(e) => onChange('correspondencePin', e.target.value)}
                required
                maxLength={6}
                placeholder="Enter 6-digit PIN code"
                disabled={data.sameAsPermanent}
              />
            </div>
          </Card>
        </div>
      </motion.div>

      <div className="form-actions">
        <Button 
          type="button" 
          variant="default" 
          onClick={onNext}
          size="lg"
          className="w-full md:w-auto"
        >
          Next Step
        </Button>
      </div>
    </form>
  );
};