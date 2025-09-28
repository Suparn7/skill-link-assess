import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import "../styles/form.css";

export const FinalReviewForm = ({ data = {}, onSubmit }: { data?: any; onSubmit?: () => void }) => {
  const [checked, setChecked] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Merge with localStorage fallback for safety and consistent UX
  const finalData: any = useMemo(() => {
    let stored = {};
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('applicationData');
        if (raw) stored = JSON.parse(raw) || {};
      }
    } catch (e) {
      stored = {};
    }
    // Data prop should override stored values
    return { ...stored, ...data };
  }, [data]);

  const fmt = {
    text: (v) => (v === undefined || v === null || v === '') ? '--' : v,
    date: (v) => v ? new Date(v).toLocaleDateString() : '--',
    money: (v) => typeof v === 'number' ? `₹ ${v.toFixed(2)}` : (v || '--')
  };

  const isExempted = finalData.category === 'ST' || finalData.category === 'SC' || finalData.isDisabled;

  const handleConfirmSubmit = () => {
    setConfirmOpen(false);
    if (onSubmit) onSubmit();
  };

  const photoSrc = finalData.photo && typeof finalData.photo !== 'string' ? URL.createObjectURL(finalData.photo) : (finalData.photo || 'https://via.placeholder.com/120x150?text=Photo');
  const signSrc = finalData.sign && typeof finalData.sign !== 'string' ? URL.createObjectURL(finalData.sign) : (finalData.sign || 'https://via.placeholder.com/120x50?text=Sign');

  return (
  <div className="form-card form-full mx-auto">
      <div className="form-section">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-2xl font-bold">Final Review</div>
            <div className="text-sm text-muted-foreground">Please review all your details carefully before submission.</div>
          </div>
          <div className="text-right">
            <div className="text-sm">Post: <strong>{fmt.text(finalData.vacancyType || 'ANM')}</strong></div>
            <div className="text-sm">Reg. No: <strong>{fmt.text(finalData.registrationNumber || '')}</strong></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4 items-start">
          <div className="col-span-2">
            <div className="text-lg font-semibold mb-2">Candidate</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Name</strong></div><div>{fmt.text(`${finalData.firstName || ''} ${finalData.lastName || ''}`).trim()}</div>
              <div><strong>Father's Name</strong></div><div>{fmt.text(finalData.fatherName)}</div>
              <div><strong>Mother's Name</strong></div><div>{fmt.text(finalData.motherName)}</div>
              <div><strong>DOB</strong></div><div>{fmt.date(finalData.dateOfBirth)}</div>
              <div><strong>Gender</strong></div><div>{fmt.text(finalData.gender)}</div>
              <div><strong>Mobile</strong></div><div>{fmt.text(finalData.mobile)}</div>
              <div><strong>Email</strong></div><div>{fmt.text(finalData.email)}</div>
              <div><strong>Aadhar</strong></div><div>{fmt.text(finalData.aadhar_number)}</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={photoSrc} alt="Photo" className="border rounded mb-3" style={{ width: 120, height: 150 }} />
            <img src={signSrc} alt="Sign" className="border rounded" style={{ width: 120, height: 50 }} />
          </div>
        </div>

        <div className="mb-4">
          <div className="font-bold mb-2">Addresses</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold">Permanent Address</div>
              <div>{fmt.text(finalData.permanentAddress)}, {fmt.text(finalData.permanentDistrict)}, {fmt.text(finalData.permanentState)} - {fmt.text(finalData.permanentPin)}</div>
            </div>
            <div>
              <div className="font-semibold">Correspondence Address</div>
              <div>{fmt.text(finalData.correspondenceAddress)}, {fmt.text(finalData.correspondenceDistrict)}, {fmt.text(finalData.correspondenceState)} - {fmt.text(finalData.correspondencePin)}</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="font-bold mb-2">Educational Qualifications</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="gradient-primary text-white">
                <tr>
                  <th className="p-2">SN</th>
                  <th className="p-2">Exam</th>
                  <th className="p-2">School/Institution</th>
                  <th className="p-2">Board/University</th>
                  <th className="p-2">Year</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Obtained</th>
                  <th className="p-2">%</th>
                  <th className="p-2">Subject</th>
                </tr>
              </thead>
              <tbody>
                {(finalData.education || []).map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{['10th', '12th/equivalent', 'ANM'][idx] || `Qualification ${idx+1}`}</td>
                    <td className="p-2">{fmt.text(row?.school)}</td>
                    <td className="p-2">{fmt.text(row?.board)}</td>
                    <td className="p-2">{fmt.text(row?.year)}</td>
                    <td className="p-2">{fmt.text(row?.totalMarks)}</td>
                    <td className="p-2">{fmt.text(row?.obtainedMarks)}</td>
                    <td className="p-2">{fmt.text(row?.percentage)}</td>
                    <td className="p-2">{fmt.text(row?.subject)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-4">
          <div className="font-bold mb-2">District Preferences</div>
          <div className="grid grid-cols-6 gap-2">
            {(finalData.districtPreferences || Array(24).fill('')).map((p, i) => (
              <div key={i} className="border rounded px-2 py-1 text-xs">{i+1}. {fmt.text(p)}</div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="font-bold mb-2">Payment Details</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg">
              <thead className="gradient-primary text-white">
                <tr><th className="p-2">Amount</th><th className="p-2">Order Id</th><th className="p-2">Transaction Id</th><th className="p-2">Payment Date</th><th className="p-2">Status</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">{isExempted ? '₹ 0.00' : '₹ 400.00'}</td>
                  <td className="p-2">{fmt.text(finalData.orderId || '---')}</td>
                  <td className="p-2">{fmt.text(finalData.transactionId || '---')}</td>
                  <td className="p-2">{fmt.text(finalData.paymentDate || '---')}</td>
                  <td className="p-2">{isExempted ? 'Exempted' : (finalData.paymentStatus || 'Paid')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-4">
          <div className="font-bold mb-2">Experience Details</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg">
              <thead className="gradient-primary text-white">
                <tr><th className="p-2">SN</th><th className="p-2">Designation</th><th className="p-2">Organization</th><th className="p-2">Certificate No</th><th className="p-2">From</th><th className="p-2">To</th><th className="p-2">Total</th></tr>
              </thead>
              <tbody>
                {(finalData.experienceRows || []).map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{fmt.text(row.designation)}</td>
                    <td className="p-2">{fmt.text(row.organization)}</td>
                    <td className="p-2">{fmt.text(row.certificateNo)}</td>
                    <td className="p-2">{fmt.text(row.from)}</td>
                    <td className="p-2">{fmt.text(row.to)}</td>
                    <td className="p-2">{fmt.text(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6 text-sm">
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} className="mt-1" />
            <div>
              <div className="font-semibold">Declaration</div>
              <div>I hereby declare that all the information provided in this application is true and correct to the best of my knowledge. I understand that if any information is found false or I am found ineligible at any stage, my candidature or appointment may be cancelled.</div>
            </div>
          </label>

          <div className="bg-warning/20 border border-warning/40 rounded-lg p-2 mt-3 text-center">
            <strong>Note:</strong> Once this page is submitted, you will not be able to make any corrections. Your form will be considered as final submitted.<br />
            <span className="text-red-600">नोट: एक बार इस पृष्ठ को सबमिट करने के बाद आप कोई भी संशोधन नहीं कर पाएंगे। आपका फॉर्म अंतिम रूप से सबमिट माना जाएगा।</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Button className="btn-primary" disabled={!checked} onClick={() => setConfirmOpen(true)}>
            <Check className="inline-block mr-2" /> Submit Application
          </Button>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmOpen(false)} />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-10 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Confirm Submission</h3>
            <p className="mb-4">Are you sure you want to submit? You will not be able to edit the application after submission.</p>
            <div className="flex justify-end gap-3">
              <Button className="btn-outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button className="btn-primary" onClick={handleConfirmSubmit}>Yes, Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
