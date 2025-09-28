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
  _fallback?: boolean; // for UI fallback row logic only
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

  // Helper to calculate experience duration between two dates
  const calculateExperience = (from, to) => {
    if (!from || !to) return '';
    const start = new Date(from);
    const end = new Date(to);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end.getTime() < start.getTime()) return '';
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) {
      months--;
      days += new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} years, ${months} months, ${days} days`;
  };

  // Ensure at least one empty row is present
  React.useEffect(() => {
    if (!data.experienceRows || data.experienceRows.length === 0) {
      onChange('experienceRows', [{
        designation: '',
        organization: '',
        certificateNo: '',
        from: '',
        to: '',
        total: '',
      }]);
    }
  }, [data.experienceRows, onChange]);

  // Add experience row
  const handleAddRow = () => {
    onChange('experienceRows', [
      ...data.experienceRows,
      {
        designation: '',
        organization: '',
        certificateNo: '',
        from: '',
        to: '',
        total: '',
      }
    ]);
  };

  // Remove experience row
  const handleRemoveRow = idx => {
    const rows = [...data.experienceRows];
    rows.splice(idx, 1);
    onChange('experienceRows', rows.length ? rows : [{
      designation: '',
      organization: '',
      certificateNo: '',
      from: '',
      to: '',
      total: '',
    }]);
  };

  // Handle row field change
  const handleRowChange = (idx, field, value) => {
    const rows = [...data.experienceRows];
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
            <Label className="form-label">Do you have five years of experience and are currently working as a contractual employee under the Government of Jharkhand? *</Label>
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
              {(data.experienceRows && data.experienceRows.length > 0
                ? data.experienceRows.map((row, idx) => (
                    <tr key={idx} className="border-b">
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
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveRow(idx)}
                          className="form-glass w-8 h-8 p-0"
                        >
                          <span className="sr-only">Remove</span>
                          &times;
                        </Button>
                      </td>
                    </tr>
                  ))
                : [
                    <tr key={0} className="border-b">
                      <td className="px-4 py-3">1</td>
                      <td className="px-4 py-3">
                        <Input 
                          value={''} 
                          onChange={e => onChange('experienceRows', [{ designation: e.target.value, organization: '', certificateNo: '', from: '', to: '', total: '' }])}
                          className="form-glass"
                          placeholder="Enter designation"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input 
                          value={''} 
                          onChange={e => onChange('experienceRows', [{ designation: '', organization: e.target.value, certificateNo: '', from: '', to: '', total: '' }])}
                          className="form-glass"
                          placeholder="Enter organization"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input 
                          value={''} 
                          onChange={e => onChange('experienceRows', [{ designation: '', organization: '', certificateNo: e.target.value, from: '', to: '', total: '' }])}
                          className="form-glass"
                          placeholder="Enter certificate no."
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Input 
                            type="date" 
                            value={''} 
                            onChange={e => onChange('experienceRows', [{ designation: '', organization: '', certificateNo: '', from: e.target.value, to: '', total: '' }])}
                            className="form-glass"
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input 
                            type="date" 
                            value={''} 
                            onChange={e => onChange('experienceRows', [{ designation: '', organization: '', certificateNo: '', from: '', to: e.target.value, total: '' }])}
                            className="form-glass"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium"></td>
                      <td className="px-4 py-3 text-center">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="form-glass w-8 h-8 p-0"
                          disabled
                        >
                          <span className="sr-only">Remove</span>
                          &times;
                        </Button>
                      </td>
                    </tr>
                  ]
              )}
            </tbody>
          </table>
        </div>
        <div className="mb-4 px-4 py-3 rounded-lg form-glass">
          <div className="font-semibold mb-1">Total Calculated Experience:</div>
          <div className="text-xl font-bold">
            {(() => {
              // Sum all experience durations
              let totalYears = 0, totalMonths = 0, totalDays = 0;
              (data.experienceRows || []).forEach(row => {
                if (row.from && row.to) {
                  const start = new Date(row.from);
                  const end = new Date(row.to);
                  if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end.getTime() >= start.getTime()) {
                    let years = end.getFullYear() - start.getFullYear();
                    let months = end.getMonth() - start.getMonth();
                    let days = end.getDate() - start.getDate();
                    if (days < 0) {
                      months--;
                      days += new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
                    }
                    if (months < 0) {
                      years--;
                      months += 12;
                    }
                    totalYears += years;
                    totalMonths += months;
                    totalDays += days;
                  }
                }
              });
              // Normalize days and months
              if (totalDays >= 30) {
                totalMonths += Math.floor(totalDays / 30);
                totalDays = totalDays % 30;
              }
              if (totalMonths >= 12) {
                totalYears += Math.floor(totalMonths / 12);
                totalMonths = totalMonths % 12;
              }
              return `${totalYears} years, ${totalMonths} months, ${totalDays} days`;
            })()}
          </div>
          <div className="mt-4 text-right">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                if (data.experienceRows && data.experienceRows.length > 0) {
                  handleAddRow();
                } else {
                  // If no experienceRows, initialize with one empty row and then add another
                  onChange('experienceRows', [
                    { designation: '', organization: '', certificateNo: '', from: '', to: '', total: '' },
                    { designation: '', organization: '', certificateNo: '', from: '', to: '', total: '' }
                  ]);
                }
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Experience
            </Button>
          </div>
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
        {/* Navigation handled by stepper in ExamRegistration.tsx */}
      </motion.div>
    </form>
  );
}
