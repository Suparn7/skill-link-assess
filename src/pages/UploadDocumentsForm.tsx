import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import "../styles/form.css";

const mockPhoto = "https://via.placeholder.com/120x150?text=Photo";
const mockSign = "https://via.placeholder.com/120x50?text=Sign";

export const UploadDocumentsForm = ({ data, onChange, onSubmit }) => {
  const photoInputRef = useRef(null);
  const signInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [signPreview, setSignPreview] = useState<string | null>(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange('photo', file);
    }
  };
  const handleSignChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange('sign', file);
    }
  };

  // create safe previews and clean up blob URLs
  useEffect(() => {
    let createdPhotoUrl: string | null = null;
    try {
      const p = data?.photo;
      if (p) {
        if (typeof p === 'string') {
          setPhotoPreview(p);
        } else if (typeof Blob !== 'undefined' && p instanceof Blob) {
          createdPhotoUrl = URL.createObjectURL(p);
          setPhotoPreview(createdPhotoUrl);
        } else {
          // unknown shape - try to read .url
          setPhotoPreview((p as any)?.url || null);
        }
      } else {
        setPhotoPreview(null);
      }
    } catch (e) {
      setPhotoPreview(null);
    }
    return () => {
      if (createdPhotoUrl) try { URL.revokeObjectURL(createdPhotoUrl); } catch {}
    };
  }, [data?.photo]);

  useEffect(() => {
    let createdSignUrl: string | null = null;
    try {
      const s = data?.sign;
      if (s) {
        if (typeof s === 'string') {
          setSignPreview(s);
        } else if (typeof Blob !== 'undefined' && s instanceof Blob) {
          createdSignUrl = URL.createObjectURL(s);
          setSignPreview(createdSignUrl);
        } else {
          setSignPreview((s as any)?.url || null);
        }
      } else {
        setSignPreview(null);
      }
    } catch (e) {
      setSignPreview(null);
    }
    return () => {
      if (createdSignUrl) try { URL.revokeObjectURL(createdSignUrl); } catch {}
    };
  }, [data?.sign]);

  return (
  <div className="form-card form-full mx-auto">
      <div className="form-section">
        <div className="form-group-title">Upload Documents</div>

        <div className="grid grid-cols-3 gap-6 mb-4 items-center">
          <div className="text-center">
            <div className="mb-2">
              <img src={photoPreview || mockPhoto} alt="Photo" className="mx-auto border rounded" style={{ width: 120, height: 150 }} />
            </div>
            <div className="text-xs text-red-600 mb-1">Photo Size: 120x150 px</div>
            <input type="file" accept="image/*" ref={photoInputRef} style={{ display: 'none' }} onChange={handlePhotoChange} />
            <Button variant="default" size="sm" onClick={() => photoInputRef.current && photoInputRef.current.click()}>Upload Photo</Button>
          </div>

          <div className="text-center col-span-1 flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Please upload your photo and signature as per the dimensions shown.</div>
          </div>

          <div className="text-center">
            <div className="mb-2">
              <img src={signPreview || mockSign} alt="Sign" className="mx-auto border rounded" style={{ width: 120, height: 50 }} />
            </div>
            <div className="text-xs text-red-600 mb-1">Photo Size: 120x50 px</div>
            <input type="file" accept="image/*" ref={signInputRef} style={{ display: 'none' }} onChange={handleSignChange} />
            <Button variant="default" size="sm" onClick={() => signInputRef.current && signInputRef.current.click()}>Upload Sign</Button>
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4 text-sm">
          <span className="text-warning-foreground">Before submitting, ensure all photos & documents are clear and visible. Double-check that all data is accurate.</span>
        </div>

        <div className="flex justify-center">
          <Button variant="success" size="lg" onClick={onSubmit} className="btn-primary">Submit</Button>
        </div>
      </div>
    </div>
  );
};
