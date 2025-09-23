import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Briefcase, AlertTriangle, Plus, Calendar, Building2, FileCheck } from "lucide-react";
import "../styles/form.css";

interface ExperienceRow {
  designation: string;
  organization: string;
  certificateNo: string;
  from: string;
  to: string;
  total: string;
}

interface ExperienceData {
  hasFiveYearsExp: boolean;
  experienceRows: ExperienceRow[];
  acknowledgment?: boolean;
}

interface ExperienceInfoFormProps {
  data: ExperienceData;
  onChange: (field: keyof ExperienceData | string, value: any) => void;
  onBack: () => void;
  onNext: () => void;
}

export const ExperienceInfoForm: React.FC<ExperienceInfoFormProps> = ({ data, onChange, onBack, onNext }) => {
  // Helper to calculate experience (stub)
  const calculateExperience = (from, to) => {
    // Stub: returns '6 years, 0 months, 0 days' for demo
    return '6 years, 0 months, 0 days';
  };

  const handleAddRow = () => {
    const newRow = {
      designation: '',
      organization: '',
      certificateNo: '',
      from: '',
      to: '',
      total: '',
    };
    onChange('experienceRows', [...(data.experienceRows || []), newRow]);
  };

  const handleRowChange = (idx, field, value) => {
    const rows = [...(data.experienceRows || [])];
    rows[idx][field] = value;
    if (field === 'from' || field === 'to') {
      rows[idx].total = calculateExperience(rows[idx].from, rows[idx].to);
    }
    onChange('experienceRows', rows);
  };

  return (
    <form className="form-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="form-section"
      >
        <div className="form-group-title">
          <Briefcase className="h-6 w-6 mr-2 inline-block" />
          Experience Qualification
        </div>
        <div className="form-grid">
          <div className="form-control col-span-2">
            <Label className="form-label">Do you have five years of experience and is currently working as a contractual employee under the Government of Jharkhand? *</Label>
            <RadioGroup 
              value={data.hasFiveYearsExp ? "yes" : "no"} 
              onValueChange={val => onChange('hasFiveYearsExp', val === "yes")} 
              className="flex gap-4 items-center mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" className="form-glass" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" className="form-glass" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="form-section"
      >
        <div className="form-group-title">
          <Building2 className="h-6 w-6 mr-2 inline-block" />
          Experience Details
        </div>
        
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border rounded-lg form-glass">
            <thead className="bg-background/50 backdrop-blur-sm border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">S.N.</th>
                <th className="px-4 py-3 text-left font-semibold">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Designation
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Organization
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Certificate No
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Employment Period
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold">Total Experience</th>
                <th className="px-4 py-3 text-center font-semibold w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(data.experienceRows || []).map((row, idx) => (
                <motion.tr 
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-b"
                >
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <Input 
                      value={row.designation} 
                      onChange={e => handleRowChange(idx, 'designation', e.target.value)}
                      className="form-glass"
                      placeholder="Enter designation"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input 
                      value={row.organization} 
                      onChange={e => handleRowChange(idx, 'organization', e.target.value)}
                      className="form-glass"
                      placeholder="Enter organization"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input 
                      value={row.certificateNo} 
                      onChange={e => handleRowChange(idx, 'certificateNo', e.target.value)}
                      className="form-glass"
                      placeholder="Enter certificate no."
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Input 
                        type="date" 
                        value={row.from} 
                        onChange={e => handleRowChange(idx, 'from', e.target.value)}
                        className="form-glass"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input 
                        type="date" 
                        value={row.to} 
                        onChange={e => handleRowChange(idx, 'to', e.target.value)}
                        className="form-glass"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{row.total}</td>
                  <td className="px-4 py-3 text-center">
                    {idx === (data.experienceRows?.length || 0) - 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleAddRow}
                        className="form-glass w-8 h-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-4 px-4 py-3 rounded-lg form-glass">
          <div className="font-semibold mb-1">Total Calculated Experience:</div>
          <div className="text-xl font-bold">6 years, 0 months, 0 days</div>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Note: You can add or remove rows before submitting the data. After submission, you cannot add more rows; you can only edit the data in the fields that you have already submitted.
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg form-glass border border-warning/20 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="space-y-3">
              <div className="font-medium">Important Notice</div>
              <div className="text-sm text-muted-foreground">
                Before submitting, please ensure all fields are filled correctly and verify the accuracy of your data.
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="form-glass w-4 h-4" 
                  checked={data.acknowledgment}
                  onChange={e => onChange('acknowledgment', e.target.checked)}
                />
                <span className="text-sm">I acknowledge that I have reviewed all the information and confirm its accuracy.</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 justify-end"
        >
          <Button 
            onClick={onBack} 
            variant="outline" 
            type="button"
            className="form-glass"
          >
            Back
          </Button>
          <Button 
            onClick={onNext} 
            variant="outline"
            type="button" 
            className="form-glass"
          >
            Next
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
};
