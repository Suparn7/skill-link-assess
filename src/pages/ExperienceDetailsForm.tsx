import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import "../styles/form.css";

const districtList = [
  "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Kodarma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Saraikela Kharsawan", "Simdega", "West Singhbhum"
];

export const ExperienceDetailsForm = ({ data, onChange, onBack, onNext }) => {
  const education = Array.isArray(data.education) ? data.education : [];
  const educationComplete = education.length > 0 && education.every((e: any) => e?.school && e?.board && e?.year);
  const prefs = Array.isArray(data.districtPreferences) ? data.districtPreferences : [];
  const prefsFilled = prefs.filter((p: any) => p && String(p).trim() !== '').length;
  return (
    <form className="form-container">
      <div className="form-section">
        <div className="form-group-title">Experience Details</div>

        <div className="form-grid">
          <div className="form-control">
            <Label className="form-label">Have you passed Matriculation/10th with 45% or more?</Label>
            <RadioGroup
              value={data.matric45 ? "yes" : "no"}
              onValueChange={val => onChange('matric45', val === "yes") }
              className="flex gap-4 items-center mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" className="form-glass" />
                <Label>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" className="form-glass" />
                <Label>No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="form-control">
            <Label className="form-label">Have you passed 18 months of ANM Training?</Label>
            <RadioGroup
              value={data.anmTraining ? "yes" : "no"}
              onValueChange={val => onChange('anmTraining', val === "yes") }
              className="flex gap-4 items-center mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" className="form-glass" />
                <Label>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" className="form-glass" />
                <Label>No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="form-control">
            <Label className="form-label">Are you registered with Jharkhand State Nursing Council?</Label>
            <RadioGroup
              value={data.registeredNursingCouncil ? "yes" : "no"}
              onValueChange={val => onChange('registeredNursingCouncil', val === "yes") }
              className="flex gap-4 items-center mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" className="form-glass" />
                <Label>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" className="form-glass" />
                <Label>No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="form-control">
            <Label className="form-label">Certificate Registration Number</Label>
            <Input className="form-glass" value={data.certificateRegNo} onChange={e => onChange('certificateRegNo', e.target.value)} />
          </div>

          <div className="form-control">
            <Label className="form-label">Issue Date</Label>
            <Input className="form-glass" type="date" value={data.certificateIssueDate} onChange={e => onChange('certificateIssueDate', e.target.value)} />
          </div>

          <div className="form-control">
            <Label className="form-label">Issuing Authority</Label>
            <Input className="form-glass" value={data.certificateAuthority} onChange={e => onChange('certificateAuthority', e.target.value)} />
          </div>
        </div>

        <div className="form-card mb-4">
          <div className="font-semibold mb-2">Prescribed Qualification for the post (ANM) you applied.</div>
          <div className="mb-2"><span className="font-bold">Educational Qualification:</span> Must have passed <span className="font-bold">10th/Matric</span> and completed the <span className="font-bold">18-month ANM (Auxiliary Nurse Midwife) training</span> from an INC/SNC recognized institution.</div>
          <div className="mb-2"><span className="font-bold">Additional Requirement:</span> Must be registered with the <span className="font-bold">Jharkhand Nurses Registration Council</span>.</div>
          <div className="text-sm text-muted-foreground">Kindly convert your <span className="font-bold">CGPA into marks/percentage</span> using the official conversion formula provided on your marksheet or by your university. Use the converted marks when filling out the form.</div>
        </div>

        <div className="mb-8">
          <div className="font-semibold mb-4">Educational Qualifications</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["10th", "12th/equivalent", "ANM"].map((exam, idx) => (
              <div key={exam} className="form-card p-4">
                <div className="font-semibold mb-2">{exam}</div>
                <div className="space-y-3">
                  <div>
                    <Label className="form-label">School / Institution</Label>
                    <Input className="form-glass" value={data.education?.[idx]?.school || ""} onChange={e => onChange(`education.${idx}.school`, e.target.value)} />
                  </div>

                  <div>
                    <Label className="form-label">Board / University</Label>
                    <Input className="form-glass" value={data.education?.[idx]?.board || ""} onChange={e => onChange(`education.${idx}.board`, e.target.value)} />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="form-label">Year</Label>
                      <Input className="form-glass" value={data.education?.[idx]?.year || ""} onChange={e => onChange(`education.${idx}.year`, e.target.value)} />
                    </div>
                    <div>
                      <Label className="form-label">Total Marks</Label>
                      <Input className="form-glass" value={data.education?.[idx]?.totalMarks || ""} onChange={e => onChange(`education.${idx}.totalMarks`, e.target.value)} />
                    </div>
                    <div>
                      <Label className="form-label">Obtained</Label>
                      <Input className="form-glass" value={data.education?.[idx]?.obtainedMarks || ""} onChange={e => onChange(`education.${idx}.obtainedMarks`, e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="form-label">Percentage</Label>
                      <Input className="form-glass" value={data.education?.[idx]?.percentage || ""} onChange={e => onChange(`education.${idx}.percentage`, e.target.value)} />
                    </div>
                    <div>
                      <Label className="form-label">Subject</Label>
                      <Input className="form-glass" value={data.education?.[idx]?.subject || ""} onChange={e => onChange(`education.${idx}.subject`, e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="font-semibold mb-2">Select District Preferences (1st to 24th)</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {districtList.map((district, idx) => (
              <div key={district} className="flex flex-col form-control">
                <Label className="form-label">{`Pref. ${idx + 1}`}</Label>
                <Input className="form-glass" value={data.districtPreferences?.[idx] || ""} onChange={e => onChange(`districtPreferences.${idx}`, e.target.value)} placeholder={district} />
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <Button onClick={onBack} variant="ghost" type="button" className="form-glass">Back</Button>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <div>Education: {educationComplete ? <span className="text-emerald-600 font-semibold">Complete</span> : <span className="text-rose-600 font-semibold">Incomplete</span>}</div>
              <div>Preferences filled: <span className={prefsFilled >= 5 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>{prefsFilled}/24</span> (min 5)</div>
            </div>
            <Button onClick={() => onNext()} variant="default" type="button" className="btn-primary" disabled={!educationComplete || prefsFilled < 5}>Next</Button>
          </div>
        </div>
      </div>
    </form>
  );
};
