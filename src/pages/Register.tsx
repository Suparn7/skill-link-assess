import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateOTP, generateRegistrationNumber, generatePassword, SMSService } from "@/lib/sms";
import { PersonalInfoForm, PersonalInfoData } from "./PersonalInfoForm";
import { OtherDetailsForm } from "./OtherDetailsForm";
import { ExperienceDetailsForm } from "./ExperienceDetailsForm";
import { ExperienceInfoForm } from "./ExperienceInfoForm";
import { PaymentInfoForm } from "./PaymentInfoForm";
import { UploadDocumentsForm } from "./UploadDocumentsForm";
import { FinalReviewForm } from "./FinalReviewForm";

export function Register() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const formSteps = [
    { id: 1, title: "Personal Info", description: "Basic details" },
    { id: 2, title: "Other Details", description: "Additional information" },
    { id: 3, title: "Experience", description: "Work history" },
    { id: 4, title: "Verification", description: "Document upload" },
    { id: 5, title: "Payment", description: "Application fee" },
    { id: 6, title: "Preview", description: "Final review" }
  ];
  
  const [personalInfo, setPersonalInfo] = useState<any>({
  // UploadDocuments fields
  photo: null,
  sign: null,
  // PaymentInfo fields (no new fields needed for now)
    // ExperienceInfo fields
    hasFiveYearsExp: false,
    experienceRows: [
      { designation: '', organization: '', certificateNo: '', from: '', to: '', total: '' }
    ],
    // ExperienceDetails fields
    matric45: false,
    anmTraining: false,
    registeredNursingCouncil: false,
    certificateRegNo: '',
    certificateIssueDate: '',
    certificateAuthority: '',
    education: [
      { school: '', board: '', year: '', totalMarks: '', obtainedMarks: '', percentage: '', subject: '' },
      { school: '', board: '', year: '', totalMarks: '', obtainedMarks: '', percentage: '', subject: '' },
      { school: '', board: '', year: '', totalMarks: '', obtainedMarks: '', percentage: '', subject: '' }
    ],
    districtPreferences: Array(24).fill(''),
  // OtherDetails fields
  category: '',
  isPVTG: false,
  pvtgName: '',
  isExServicemen: false,
  isDisabled: false,
  disabilityType: '',
  disabilityCertNo: '',
  disabilityCertDate: '',
  disabilityCertAuthority: '',
  disabilityPercent: '',
  isSportsQuota: false,
  sportsLevel: '',
  sportsCertNo: '',
  sportsCertDate: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    address: '',
    mobile: '',
    otp: '',
    residentJharkhand: true,
    districtName: '',
    vacancyType: '',
    fatherName: '',
    motherName: '',
    gender: '',
    maritalStatus: '',
    spouseName: '',
    aadhar_number: '',
    identificationMark1: '',
    identificationMark2: '',
    permanentAddress: '',
    correspondenceAddress: '',
    permanentState: 'Jharkhand',
    permanentDistrict: '',
    permanentPin: '',
    correspondenceState: 'Jharkhand',
    correspondenceDistrict: '',
    correspondencePin: '',
    sameAsPermanent: false,
  });

  // load draft on mount (anonymous or by saved regNo in localStorage)
  useEffect(() => {
    try {
      const draft = localStorage.getItem('sla_form_draft');
      if (draft) {
        setPersonalInfo(JSON.parse(draft));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // if a local logged-in user exists, load their saved form (if any)
  useEffect(() => {
    try {
      const cur = localStorage.getItem('sla_current_user');
      if (cur) {
        const parsed = JSON.parse(cur);
        const saved = localStorage.getItem(`sla_form_${parsed.id}`);
        if (saved) setPersonalInfo(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const [otpSent, setOtpSent] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [lastCredentials, setLastCredentials] = useState<{ reg?: string; password?: string } | null>(null);

  const handleFormChange = (field: string, value: any) => {
    // support nested field paths like 'education.0.school' or 'districtPreferences.3'
    setPersonalInfo(prev => {
      const next = Array.isArray(prev) ? [...prev] : { ...prev } as any;
      if (field.includes('.')) {
        const path = field.split('.');
        let cur: any = next;
        for (let i = 0; i < path.length - 1; i++) {
          const key = path[i];
          const idx = Number(key);
          if (!isNaN(idx)) {
            if (!Array.isArray(cur)) cur = [];
            if (!cur[idx]) cur[idx] = {};
            cur = cur[idx];
            continue;
          }
          if (cur[key] === undefined) {
            const nextKey = path[i + 1];
            cur[key] = !isNaN(Number(nextKey)) ? [] : {};
          }
          cur = cur[key];
        }
        const lastKey = path[path.length - 1];
        const lastIdx = Number(lastKey);
        if (!isNaN(lastIdx) && Array.isArray(cur)) {
          cur[lastIdx] = value;
        } else {
          cur[lastKey] = value;
        }
      } else {
        next[field] = value;
      }

      // special behaviour: if correspondence should mirror permanent address
      try {
        // when toggling sameAsPermanent to true, copy permanent -> correspondence
        if (field === 'sameAsPermanent') {
          if (value === true) {
            next.correspondenceAddress = next.permanentAddress || '';
            next.correspondenceState = next.permanentState || '';
            next.correspondenceDistrict = next.permanentDistrict || '';
            next.correspondencePin = next.permanentPin || '';
            try { toast({ title: 'Auto-filled', description: 'Correspondence address copied from permanent address', variant: 'default' }); } catch {}
          }
        }

        // if a permanent address field changed and sameAsPermanent is true, keep correspondence in sync
        if (next.sameAsPermanent) {
          if (field === 'permanentAddress') next.correspondenceAddress = next.permanentAddress || '';
          if (field === 'permanentState') next.correspondenceState = next.permanentState || '';
          if (field === 'permanentDistrict') next.correspondenceDistrict = next.permanentDistrict || '';
          if (field === 'permanentPin') next.correspondencePin = next.permanentPin || '';
        }

        localStorage.setItem('sla_form_draft', JSON.stringify(next));
      } catch (e) {}

      return next;
    });
  };

  // Helper: save draft and advance only if current step is complete
  const attemptAdvance = (currentStep: number, nextStep: number) => {
    try { localStorage.setItem('sla_form_draft', JSON.stringify(personalInfo)); } catch {}
    if (!isStepComplete(currentStep)) {
      toast({ title: 'Incomplete', description: 'Please complete all required fields in the current step before advancing.', variant: 'destructive' });
      return false;
    }
    setStep(nextStep);
    return true;
  };

  const handleSendOTP = async () => {
    if (!personalInfo.mobile) {
      toast({
        title: "Error",
        description: "Please enter your mobile number first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const otp = generateOTP();
    setGeneratedOTP(otp);

    // --- Uncomment below to enable real SMS sending ---
    // try {
    //   const success = await SMSService.sendOTP(formData.mobile, otp);
    //   if (success) {
    //     setOtpSent(true);
    //     toast({
    //       title: "OTP Sent",
    //       description: "OTP has been sent to your mobile number",
    //       variant: "default"
    //     });
    //   } else {
    //     throw new Error("Failed to send OTP");
    //   }
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to send OTP. Please try again.",
    //     variant: "destructive"
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
    // --- End real SMS code ---

    // MOCK: Simulate OTP sent
    setTimeout(() => {
      setOtpSent(true);
      toast({
        title: "OTP Sent (Mocked)",
        description: `Your OTP is ${otp}. (API is down, so use this for testing)`,
        variant: "default"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (personalInfo.otp === generatedOTP) {
      setStep(2);
      toast({
        title: "Success",
        description: "Mobile number verified successfully",
        variant: "default"
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitRegistration = async () => {
    setIsLoading(true);
    // Generate credentials
    const regNumber = generateRegistrationNumber();
    const password = generatePassword();

    // --- Uncomment below to enable real SMS sending ---
    // try {
  //   const success = await SMSService.sendRegistrationSuccess(
  //     personalInfo.mobile, 
  //     regNumber, 
  //     password
  //   );
    //   if (success) {
    //     toast({
    //       title: "Registration Successful!",
    //       description: `Registration Number: ${regNumber}. Password sent via SMS.",
    //       variant: "default"
    //     });
    //     setStep(3);
    //   } else {
    //     throw new Error("Failed to send credentials");
    //   }
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Registration failed. Please try again.",
    //     variant: "destructive"
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
    // --- End real SMS code ---

    // MOCK: Simulate registration SMS sent
    setTimeout(() => {
      toast({
        title: "Registration Successful! (Mocked)",
        description: `Registration Number: ${regNumber}. Password: ${password}. (API is down, so use these for testing)`,
        variant: "default"
      });
      // Persist credentials locally
      try {
        const usersRaw = localStorage.getItem('sla_users') || '[]';
        const users = JSON.parse(usersRaw);
        users.push({ regNumber, password, email: personalInfo.email, mobile: personalInfo.mobile });
        localStorage.setItem('sla_users', JSON.stringify(users));
        // save form under this regNumber so user can come back and edit
        localStorage.setItem(`sla_form_${regNumber}`, JSON.stringify(personalInfo));
        // also clear generic draft
        localStorage.removeItem('sla_form_draft');
      } catch (e) {}
      setStep(3);
      setIsLoading(false);
    }, 1000);
  };

  // per-step required fields definitions
  const stepRequirements: Record<number, string[]> = {
    1: ['firstName', 'lastName', 'mobile', 'email', 'dateOfBirth'],
    2: ['category'],
    3: ['education.0.school'],
    4: ['experienceRows.0.designation'],
    5: [],
    6: ['photo', 'sign']
  };

  const isStepComplete = (stepNum: number) => {
    // Special-case for step 3 (Experience/Education + Preferences)
    if (stepNum === 3) {
      const education = Array.isArray(personalInfo.education) ? personalInfo.education : [];
      // require all education entries to have school, board and year
      const educationComplete = education.length > 0 && education.every((e: any) => e?.school && e?.board && e?.year);
      // require at least 5 non-empty district preferences
      const prefs = Array.isArray(personalInfo.districtPreferences) ? personalInfo.districtPreferences : [];
      const prefsFilled = prefs.filter((p: any) => p && String(p).trim() !== '').length;
      return educationComplete && prefsFilled >= 5;
    }

    const reqs = stepRequirements[stepNum] || [];
    for (const field of reqs) {
      if (field.includes('.')) {
        const parts = field.split('.');
        let cur: any = personalInfo;
        for (const p of parts) {
          const idx = Number(p);
          if (!isNaN(idx) && Array.isArray(cur)) {
            cur = cur[idx];
          } else {
            cur = cur?.[p];
          }
          if (cur === undefined || cur === null || cur === '') return false;
        }
      } else {
        if (!personalInfo[field]) return false;
      }
    }
    return true;
  };

  // returns 'complete' | 'partial' | 'empty' for visual stepper states
  const stepStatus = (stepNum: number): 'complete' | 'partial' | 'empty' => {
    // Special handling for step 3: consider education and preferences
    if (stepNum === 3) {
      const education = Array.isArray(personalInfo.education) ? personalInfo.education : [];
      const prefs = Array.isArray(personalInfo.districtPreferences) ? personalInfo.districtPreferences : [];
      const educationFilled = education.filter((e: any) => e && (e.school || e.board || e.year)).length;
      const prefsFilled = prefs.filter((p: any) => p && String(p).trim() !== '').length;

      if (educationFilled === 0 && prefsFilled === 0) return 'empty';
      const educationComplete = education.length > 0 && education.every((e: any) => e?.school && e?.board && e?.year);
      if (educationComplete && prefsFilled >= 5) return 'complete';
      return 'partial';
    }

    const reqs = stepRequirements[stepNum] || [];
    if (reqs.length === 0) {
      return 'empty';
    }
    let filled = 0;
    for (const field of reqs) {
      if (field.includes('.')) {
        const parts = field.split('.');
        let cur: any = personalInfo;
        let ok = true;
        for (const p of parts) {
          const idx = Number(p);
          if (!isNaN(idx) && Array.isArray(cur)) {
            cur = cur[idx];
          } else {
            cur = cur?.[p];
          }
          if (cur === undefined || cur === null || cur === '') { ok = false; break; }
        }
        if (ok) filled++;
      } else {
        if (personalInfo[field]) filled++;
      }
    }
    if (filled === 0) return 'empty';
    if (filled === reqs.length) return 'complete';
    return 'partial';
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-gradient-primary flex items-center gap-3">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalInfoForm
            data={personalInfo}
            onChange={handleFormChange}
            onNext={() => attemptAdvance(1, 2)}
          />
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-gradient-primary flex items-center gap-3">
            Other Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OtherDetailsForm
            data={personalInfo}
            onChange={handleFormChange}
            onBack={() => setStep(1)}
            onNext={() => attemptAdvance(2, 3)}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderRegistrationSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card border-success/30">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-6" />
          <h2 className="text-3xl font-heading font-bold text-success mb-4">
            Registration Successful!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your registration has been completed successfully. Registration credentials have been sent to your mobile number via SMS.
          </p>
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-success-foreground">
              Please save your registration number and password for future login.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded">
              <div className="text-sm text-muted-foreground">Registration Number</div>
              <div className="text-lg font-bold">{lastCredentials?.reg ?? '—'}</div>
              <div className="text-sm text-muted-foreground mt-2">Password</div>
              <div className="text-lg font-bold">{lastCredentials?.password ?? '—'}</div>
            </div>

            <div className="flex gap-3">
              <Button variant="default" onClick={() => {
                if (lastCredentials?.reg) navigator.clipboard.writeText(`Reg: ${lastCredentials.reg} Pass: ${lastCredentials.password || ''}`);
                toast({ title: 'Copied', description: 'Credentials copied to clipboard', variant: 'default' });
              }}>Copy Credentials</Button>

              <Button variant="outline" onClick={() => {
                // download as text
                if (!lastCredentials) return;
                const blob = new Blob([`Registration Number: ${lastCredentials.reg}\nPassword: ${lastCredentials.password}`], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `registration_${lastCredentials.reg}.txt`;
                document.body.appendChild(a); a.click(); a.remove();
                URL.revokeObjectURL(url);
              }}>Download</Button>

              <Button variant="secondary" onClick={() => {
                // mock send SMS
                try {
                  const sent = localStorage.getItem('sla_sent_sms') || '[]';
                  const arr = JSON.parse(sent);
                  arr.push({ to: personalInfo.mobile, reg: lastCredentials?.reg, at: new Date().toISOString() });
                  localStorage.setItem('sla_sent_sms', JSON.stringify(arr));
                  toast({ title: 'SMS Sent (Mock)', description: `Sent credentials to ${personalInfo.mobile}`, variant: 'default' });
                } catch (e) { }
              }}>Send SMS</Button>
            </div>

            <Button variant="default" size="lg" className="w-full" onClick={() => {
              // continue to application (placeholder)
              setStep(9);
            }}>
              Continue to Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Final submission handler (final review -> registration success)
  const handleFinalSubmit = async () => {
    setIsLoading(true);
    const regNumber = generateRegistrationNumber();
    const password = generatePassword();

    // persist credentials and form
    try {
      const usersRaw = localStorage.getItem('sla_users') || '[]';
      const users = JSON.parse(usersRaw);
      users.push({ regNumber, password, email: personalInfo.email, mobile: personalInfo.mobile });
      localStorage.setItem('sla_users', JSON.stringify(users));
      localStorage.setItem(`sla_form_${regNumber}`, JSON.stringify(personalInfo));
      localStorage.removeItem('sla_form_draft');
    } catch (e) {}

    // show toast and go to success screen
    setTimeout(() => {
      try { setLastCredentials({ reg: regNumber, password }); } catch {}
      toast({ title: 'Registration Complete', description: `Registration Number: ${regNumber}. Password: ${password}`, variant: 'default' });
      setIsLoading(false);
      setStep(8);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="py-20">
          <div className="container mx-auto px-4 max-w-screen-lg">
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
              {t('register.title')}
            </h1>
            
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <div>
                <Button size="sm" variant="outline" onClick={() => {
                  try {
                    const cur = localStorage.getItem('sla_current_user');
                    if (!cur) {
                      toast({ title: 'No user', description: 'No logged in user found', variant: 'destructive' });
                      return;
                    }
                    const parsed = JSON.parse(cur);
                    const saved = localStorage.getItem(`sla_form_${parsed.id}`);
                    if (!saved) {
                      toast({ title: 'No saved form', description: 'No saved registration found for your account', variant: 'destructive' });
                      return;
                    }
                    setPersonalInfo(JSON.parse(saved));
                    toast({ title: 'Loaded', description: 'Loaded your saved registration', variant: 'default' });
                  } catch (e) {
                    toast({ title: 'Error', description: 'Failed to load saved form', variant: 'destructive' });
                  }
                }}>Load my saved registration</Button>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-6">
                {formSteps.map((s, idx) => {
                  const stepNumber = idx + 1;
                  const status = stepStatus(stepNumber); // complete | partial | empty
                  const isCurrent = step === stepNumber;
                  const bgClass = isCurrent ? 'bg-gradient-primary text-white shadow-lg' : (
                    status === 'complete' ? 'bg-emerald-600 text-white' : status === 'partial' ? 'bg-rose-600 text-white' : 'bg-gray-300 text-gray-700'
                  );
                  return (
                    <div key={s.id} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          // Always save current draft before navigation
                          try {
                            localStorage.setItem('sla_form_draft', JSON.stringify(personalInfo));
                          } catch (e) {}

                          // moving back always allowed
                          if (stepNumber <= step) {
                            setStep(stepNumber);
                            return;
                          }

                          // moving forward: require current step to be complete
                          if (isStepComplete(step)) {
                            setStep(stepNumber);
                            return;
                          }

                          toast({ title: 'Incomplete', description: 'Please complete all required fields in the current step before advancing.', variant: 'destructive' });
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${bgClass}`}
                        aria-label={s.title}
                        title={s.description}
                      >
                        {status === 'complete' && !isCurrent ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                      </button>
                      {stepNumber < formSteps.length && (
                        <div className={`w-12 h-0.5 ${status === 'complete' ? 'bg-emerald-400' : status === 'partial' ? 'bg-rose-300' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && (
            <ExperienceDetailsForm
              data={personalInfo}
              onChange={handleFormChange}
              onBack={() => setStep(2)}
              onNext={() => attemptAdvance(3, 4)}
            />
          )}
          {step === 4 && (
            <ExperienceInfoForm
              data={personalInfo}
              onChange={handleFormChange}
              onBack={() => setStep(3)}
              onNext={() => attemptAdvance(4, 5)}
            />
          )}
          {step === 5 && (
            <PaymentInfoForm
              data={{ ...personalInfo, onChange: handleFormChange }}
              onProceed={() => attemptAdvance(5, 6)}
            />
          )}
          {step === 6 && (
            <UploadDocumentsForm
              data={personalInfo}
              onChange={handleFormChange}
              onSubmit={() => attemptAdvance(6, 7)}
            />
          )}
          {step === 7 && (
            <FinalReviewForm
              data={personalInfo}
              onSubmit={() => handleFinalSubmit()}
            />
          )}
          {step === 8 && renderRegistrationSuccess()}
        </div>
      </div>

      <Footer />
    </div>
  );
}

// helper removed - handled inline
