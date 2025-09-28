import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Camera, Plus, Trash2, ArrowRight, ArrowLeft, Save, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const documentSchema = z.object({
  documentType: z.enum(["photo", "signature"]),
  file: z.any().refine((file) => file instanceof File && file.size > 0, "File is required"),
});

type DocumentForm = z.infer<typeof documentSchema>;

interface Document {
  id?: string;
  documentType: "photo" | "signature";
  file_url: string;
  file_name: string;
  status?: string;
}

export function DocumentsUpload() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<DocumentForm>({
    resolver: zodResolver(documentSchema),
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchDocuments();
  }, [user, loading, navigate]);

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) {
        // Map DB fields to UI fields
        const formatted = data.map((doc: any) => ({
          id: doc.id,
          documentType: doc.document_type,
          file_url: doc.file_url || doc.file_path,
          file_name: doc.file_name,
          status: doc.status,
        }));
        setDocuments(formatted);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch documents",
        variant: "destructive",
      });
    }
  };

  const handleUploadDocument = async (data: DocumentForm) => {
    if (!user) {
      console.log('No user found in handleUploadDocument');
      return;
    }
    console.log('Uploading document for user:', user.id, user);
    setIsLoading(true);
    try {
      // Upload file to Supabase Storage
      const file = data.file as File;
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${data.documentType}_${Date.now()}.${fileExt}`;
      const storagePath = `${data.documentType}s/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      // Get public URL
      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(storagePath);
      const file_url = urlData?.publicUrl || "";
      // Save metadata in DB
      const docData = {
        user_id: user.id,
        document_type: data.documentType,
        file_url,
        file_path: storagePath,
        file_name: fileName,
        file_size: file.size,
        mime_type: file.type,
        status: "uploaded" as const,
      };
      if (editingIndex !== null) {
        // Update existing document
        const docToUpdate = documents[editingIndex];
        const { error } = await supabase
          .from("documents")
          .update(docData)
          .eq("id", docToUpdate.id);
        if (error) throw error;
        setEditingIndex(null);
      } else {
        // Add new document
        const { error } = await supabase
          .from("documents")
          .insert(docData);
        if (error) throw error;
      }
      form.reset();
      fetchDocuments();
      toast({
        title: "Success",
        description: editingIndex !== null ? "Document updated successfully" : "Document uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDocument = (index: number) => {
    const doc = documents[index];
    form.reset({ documentType: doc.documentType });
    setEditingIndex(index);
  };

  const handleDeleteDocument = async (index: number) => {
    const doc = documents[index];
    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", doc.id);
      if (error) throw error;
      fetchDocuments();
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const handleContinue = () => {
    navigate("/payment");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge className="gov-badge mb-4">Document Upload</Badge>
            <h1 className="text-4xl font-heading font-bold text-gradient-primary mb-4">
              Upload Photo & Signature
            </h1>
            <p className="text-muted-foreground">
              Please upload a clear photo and your signature as images.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Document Form */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-heading text-gradient-primary flex items-center gap-3">
                  <Plus className="h-5 w-5" />
                  {editingIndex !== null ? "Edit Document" : "Upload Document"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(handleUploadDocument)} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Document Type *</Label>
                    <select
                      className="form-glass w-full"
                      {...form.register("documentType")}
                      disabled={isLoading}
                    >
                      <option value="">Select type</option>
                      <option value="photo">Photo</option>
                      <option value="signature">Signature</option>
                    </select>
                    {form.formState.errors.documentType && (
                      <p className="text-sm text-destructive">{form.formState.errors.documentType.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">Image *</Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      className="form-glass"
                      disabled={isLoading}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        form.setValue("file", file, { shouldValidate: true });
                      }}
                    />
                    {form.formState.errors.file && (
                      <p className="text-sm text-destructive">{String(form.formState.errors.file.message)}</p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {editingIndex !== null && (
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingIndex(null);
                          form.reset();
                        }}
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      variant="default"
                      className="flex-1"
                    >
                      {isLoading ? "Saving..." : editingIndex !== null ? "Update" : "Upload"}
                      <Save className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Document List */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-heading text-gradient-primary flex items-center gap-3">
                  <ImageIcon className="h-5 w-5" />
                  Your Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.map((doc, index) => (
                      <div key={doc.id || index} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium capitalize">{doc.documentType}</h4>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditDocument(index)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteDocument(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {doc.file_url && (
                            <img src={doc.file_url} alt={doc.documentType} className="h-20 w-20 object-cover rounded shadow" />
                          )}
                          <span className="text-sm text-muted-foreground">{doc.file_name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Status: {doc.status}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No documents uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}