import React from 'react';
import { Building2, Globe, FileText } from 'lucide-react';
import { Card, CardBody, Button, Input } from '@heroui/react';
import api from '../../services/api';

export default function CompanyModal({
  isOpen,
  onClose,
  company,
  onSave,
  isSaving
}) {
  const [name, setName] = React.useState('');
  const [logoUrl, setLogoUrl] = React.useState('');
  const [websiteUrl, setWebsiteUrl] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      setName(company?.name || '');
      setLogoUrl(company?.logoUrl || '');
      setWebsiteUrl(company?.websiteUrl || '');
      setDescription(company?.description || '');
      setUploadError('');
    }
  }, [isOpen, company]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/public/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLogoUrl(res.data.url);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, logoUrl, websiteUrl, description });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all font-sans">
      <Card className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg w-full max-w-md shadow-lg overflow-hidden">
        <CardBody className="p-6 space-y-5">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3">
            {company ? 'Edit Employer' : 'Add Employer'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              isRequired
              type="text"
              label="Company Name"
              placeholder="Enter name"
              value={name}
              onValueChange={setName}
              labelPlacement="outside"
              classNames={{
                input: "text-xs",
                label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              }}
            />

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Company Logo</label>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Preview" className="h-full w-full object-contain p-0.5" />
                  ) : (
                    <Building2 className="h-6 w-6 text-zinc-400" />
                  )}
                </div>
                
                <div className="flex-grow">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full text-xs text-zinc-500
                      file:mr-3 file:py-1 file:px-3
                      file:rounded-md file:border-0
                      file:text-[10px] file:font-semibold
                      file:bg-zinc-100 file:text-zinc-900
                      file:hover:bg-zinc-200
                      dark:file:bg-zinc-800 dark:file:text-zinc-300
                      cursor-pointer"
                  />
                  {isUploading && <p className="text-[9px] text-zinc-650 mt-1 animate-pulse">Uploading logo...</p>}
                  {uploadError && <p className="text-[9px] text-red-600 dark:text-red-400 mt-1">{uploadError}</p>}
                </div>
              </div>
            </div>

            <Input
              type="url"
              label="Website URL"
              placeholder="https://company.com"
              value={websiteUrl}
              onValueChange={setWebsiteUrl}
              labelPlacement="outside"
              startContent={<Globe className="h-3.5 w-3.5 text-zinc-400" />}
              classNames={{
                input: "text-xs",
                label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              }}
            />

            <Input
              type="text"
              label="Description"
              placeholder="Short description..."
              value={description}
              onValueChange={setDescription}
              labelPlacement="outside"
              startContent={<FileText className="h-3.5 w-3.5 text-zinc-400" />}
              classNames={{
                input: "text-xs",
                label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              }}
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Button variant="light" className="text-xs h-8 font-semibold rounded" onPress={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold px-4 h-8 text-xs rounded-md shadow"
                isLoading={isSaving}
              >
                Save
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
