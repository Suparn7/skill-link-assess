import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { User, Shield, Award, Heart, Star } from "lucide-react";
import "../styles/form.css";

interface OtherDetailsData {
  category: string;
  isPVTG: boolean;
  pvtgName: string;
  isExServicemen: boolean;
  isDisabled: boolean;
  disabilityType: string;
  disabilityCertNo: string;
  disabilityCertDate: string;
  disabilityCertAuthority: string;
  disabilityPercent: string;
  isSportsQuota: boolean;
  sportsLevel: string;
  sportsCertNo: string;
  sportsCertDate: string;
}

interface OtherDetailsFormProps {
  data: OtherDetailsData;
  onChange: (field: string, value: any) => void;
  onBack: () => void;
  onNext: () => void;
  isLoading: boolean;
}

export const OtherDetailsForm: React.FC<OtherDetailsFormProps> = ({ data, onChange, onBack, onNext, isLoading }) => {
  return (
    <form className="form-container">
      {/* Category Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="form-section form-card"
      >
        <div className="form-group-title">
          <span className="icon-accent"><Shield className="h-4 w-4" /></span>
          Category Information
        </div>
        <div className="form-grid">
          <div className="form-control">
            <Label className="form-label">Category to which the Candidate belong *</Label>
            <RadioGroup 
              value={data.category} 
              onValueChange={val => onChange('category', val)}
              className="grid grid-cols-2 gap-4 mt-2"
            >
              {['UR', 'EBC-1', 'BC-II', 'SC', 'ST', 'EWS'].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <RadioGroupItem value={category} id={category} className="form-glass" />
                  <Label htmlFor={category}>{category}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </motion.div>

      {/* PVTG Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="form-section form-card"
      >
        <div className="form-group-title">
          <span className="icon-accent"><User className="h-4 w-4" /></span>
          Tribal Group Information
        </div>
        <div className="form-grid">
          <div className="form-control">
            <Label className="form-label">Are you from Particularly Vulnerability Tribal Groups (PVTGs / PTG) *</Label>
            <RadioGroup 
              value={data.isPVTG ? "yes" : "no"} 
              onValueChange={val => onChange('isPVTG', val === "yes")}
              className="flex gap-4 items-center mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="pvtg-yes" className="form-glass" />
                <Label htmlFor="pvtg-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="pvtg-no" className="form-glass" />
                <Label htmlFor="pvtg-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {data.isPVTG && (
            <FormField
              label="PVTG Name"
              value={data.pvtgName}
              onChange={(e) => onChange('pvtgName', e.target.value)}
              required
              placeholder="Enter your PVTG name"
              className="form-glass"
            />
          )}
        </div>
      </motion.div>

      {/* Special Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="form-section form-card"
      >
        <div className="form-group-title">
          <span className="icon-accent"><Award className="h-4 w-4" /></span>
          Special Categories
        </div>
        <div className="form-grid">
          <div className="form-control">
            <Label className="form-label">Are you an ex-servicemen? *</Label>
            <RadioGroup 
              value={data.isExServicemen ? "yes" : "no"} 
              onValueChange={val => onChange('isExServicemen', val === "yes")}
              className="flex gap-4 items-center mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="ex-service-yes" className="form-glass" />
                <Label htmlFor="ex-service-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="ex-service-no" className="form-glass" />
                <Label htmlFor="ex-service-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="form-control">
            <Label className="form-label">Physical Disability 40% or more than 40%? *</Label>
            <RadioGroup 
              value={data.isDisabled ? "yes" : "no"} 
              onValueChange={val => onChange('isDisabled', val === "yes")}
              className="flex gap-4 items-center mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="disability-yes" className="form-glass" />
                <Label htmlFor="disability-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="disability-no" className="form-glass" />
                <Label htmlFor="disability-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {data.isDisabled && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <FormField
                label="Disability Type"
                icon={<Heart />}
                value={data.disabilityType}
                onChange={(e) => onChange('disabilityType', e.target.value)}
                required
                placeholder="Enter disability type"
                className="form-glass"
              />

              <FormField
                label="PH Certificate Number"
                value={data.disabilityCertNo}
                onChange={(e) => onChange('disabilityCertNo', e.target.value)}
                required
                placeholder="Enter certificate number"
                className="form-glass"
              />

              <FormField
                label="Date of Issue of PH Certificate"
                type="date"
                value={data.disabilityCertDate}
                onChange={(e) => onChange('disabilityCertDate', e.target.value)}
                required
                className="form-glass"
              />

              <FormField
                label="Issuing Authority"
                value={data.disabilityCertAuthority}
                onChange={(e) => onChange('disabilityCertAuthority', e.target.value)}
                required
                placeholder="Enter issuing authority name"
                className="form-glass"
              />

              <FormField
                label="Percentage of Disability"
                value={data.disabilityPercent}
                onChange={(e) => onChange('disabilityPercent', e.target.value)}
                required
                placeholder="Enter disability percentage"
                type="number"
                min="40"
                max="100"
                className="form-glass"
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Sports Quota */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="form-section form-card"
      >
        <div className="form-group-title">
          <span className="icon-accent"><Star className="h-4 w-4" /></span>
          Sports Quota
        </div>
        <div className="form-grid">
          <div className="form-control">
            <Label className="form-label">Do you claim reservation under sports Quota? *</Label>
            <RadioGroup 
              value={data.isSportsQuota ? "yes" : "no"} 
              onValueChange={val => onChange('isSportsQuota', val === "yes")}
              className="flex gap-4 items-center mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="sports-yes" className="form-glass" />
                <Label htmlFor="sports-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="sports-no" className="form-glass" />
                <Label htmlFor="sports-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {data.isSportsQuota && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <FormField
                label="Level of Competition"
                value={data.sportsLevel}
                onChange={(e) => onChange('sportsLevel', e.target.value)}
                required
                placeholder="Select your level of competition"
                type="select"
                options={[
                  { label: "International", value: "international" },
                  { label: "National", value: "national" },
                  { label: "State", value: "state" },
                  { label: "District", value: "district" }
                ]}
                className="form-glass"
              />

              <FormField
                label="Sports Certificate Number"
                value={data.sportsCertNo}
                onChange={(e) => onChange('sportsCertNo', e.target.value)}
                required
                placeholder="Enter certificate number"
                className="form-glass"
              />

              <FormField
                label="Date of Issue of Sports Certificate"
                type="date"
                value={data.sportsCertDate}
                onChange={(e) => onChange('sportsCertDate', e.target.value)}
                required
                className="form-glass"
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="form-actions"
      >
        <Button 
          onClick={onBack} 
          variant="outline" 
          type="button"
          className="btn-outline"
        >
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={isLoading} 
          type="button" 
          className="btn-primary"
        >
          {isLoading ? "Processing..." : "Next"}
        </Button>
      </motion.div>
    </form>
  );
};
