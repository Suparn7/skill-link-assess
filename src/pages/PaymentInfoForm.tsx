import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import "../styles/form.css";

export const PaymentInfoForm = ({ data, onProceed }) => {
  // Category options and fee mapping
  const categoryOptions = [
    { value: '', label: 'Select Category', fee: 0 },
    { value: 'UR', label: 'UR', fee: 400 },
    { value: 'EBC-1', label: 'EBC-1', fee: 400 },
    { value: 'BC-II', label: 'BC-II', fee: 400 },
    { value: 'SC', label: 'SC', fee: 0 },
    { value: 'ST', label: 'ST', fee: 0 },
    { value: 'EWS', label: 'EWS', fee: 400 }
  ];
  const selectedCategory = categoryOptions.find(opt => opt.value === data.category) || categoryOptions[0];
  const isExempted = selectedCategory.fee === 0 || data.isDisabled;
  const fee = isExempted ? 0 : selectedCategory.fee;
  const paymentStatus = isExempted ? 'The registration fee has been exempted.' : 'Pending';

  const handleCategoryChange = (e) => {
    if (data.onChange) {
      data.onChange('category', e.target.value);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleProceed = () => {
    if (!isExempted) {
      setProcessing(true);
      // Mock payment processing
      setTimeout(() => {
        setProcessing(false);
        setShowModal(true);
      }, 900);
    } else {
      // directly show modal for exempted
      setShowModal(true);
    }
  };

  return (
  <div className="form-card form-full mx-auto">
      <div className="form-section">
        <div className="form-group-title">Payment Information</div>

        <div className="grid grid-cols-2 gap-2 items-center text-sm">
          <div className="font-medium">Resident</div>
          <div>{data.residentJharkhand ? 'Yes' : 'No'}</div>

          <div className="font-medium">PwD</div>
          <div>{data.isDisabled ? 'Yes' : 'No'}</div>

          <div className="font-medium">Category</div>
          <div>
            <select value={data.category} onChange={handleCategoryChange} className="form-glass rounded px-2 py-1 w-full text-sm">
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="font-medium">Fee</div>
          <div className="font-semibold">₹ {fee.toFixed(2)}</div>

          <div className="font-medium">Status</div>
          <div className={isExempted ? 'text-green-600 font-semibold' : 'text-warning font-semibold'}>{paymentStatus}</div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <Button onClick={() => onProceed && onProceed()} variant="outline" className="btn-outline">Skip</Button>
          <Button onClick={handleProceed} disabled={!data.category || processing} className="btn-primary">{processing ? 'Processing...' : (isExempted ? 'Continue' : 'Proceed to Pay')}</Button>
        </div>

        <div className="text-xs text-red-600 mt-4">* Registration fee and exemption depend on selected category and PwD status.</div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-10 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-2">Payment Successful</h3>
            <p className="text-sm mb-4">Your payment has been processed. Click continue to upload documents.</p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => { setShowModal(false); onProceed && onProceed(); }} className="btn-primary">Continue to Upload</Button>
              <Button onClick={() => setShowModal(false)} className="btn-outline">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
