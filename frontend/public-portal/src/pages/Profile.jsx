import React from 'react';
import api from '../services/api';
import { User, Phone, BookOpen, GraduationCap, Code, Linkedin, Github, Globe, Check, AlertCircle, Camera } from 'lucide-react';
import { Input, Button, Card, CardBody, Avatar, Tabs, Tab, Chip } from '@heroui/react';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';

export default function Profile() {
  const [fullName, setFullName] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [college, setCollege] = React.useState('');
  const [degree, setDegree] = React.useState('');
  const [branch, setBranch] = React.useState('');
  const [graduationYear, setGraduationYear] = React.useState(new Date().getFullYear());
  const [skills, setSkills] = React.useState('');
  const [linkedinUrl, setLinkedinUrl] = React.useState('');
  const [githubUrl, setGithubUrl] = React.useState('');
  const [portfolioUrl, setPortfolioUrl] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const [profileImageUrl, setProfileImageUrl] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');

  const handleImageUpload = async (e) => {
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
      setProfileImageUrl(res.data.url);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch Profile
  const { data: profile, isLoading } = useProfile(true);

  // Sync state with loaded data
  React.useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setMobileNumber(profile.mobileNumber || '');
      setCollege(profile.college || '');
      setDegree(profile.degree || '');
      setBranch(profile.branch || '');
      setGraduationYear(profile.graduationYear || new Date().getFullYear());
      setSkills(profile.skills || '');
      setLinkedinUrl(profile.linkedinUrl || '');
      setGithubUrl(profile.githubUrl || '');
      setPortfolioUrl(profile.portfolioUrl || '');
      setProfileImageUrl(profile.profileImageUrl || '');
    }
  }, [profile]);

  // Update Profile Mutation
  const updateMutation = useUpdateProfile();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      fullName,
      mobileNumber,
      college,
      degree,
      branch,
      graduationYear: parseInt(graduationYear),
      skills,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      profileImageUrl
    }, {
      onSuccess: (data) => {
        setSuccess(true);
        localStorage.setItem('user', JSON.stringify(data));
        setTimeout(() => setSuccess(false), 3000);
      },
      onError: (err) => {
        setError(err.response?.data?.message || 'Failed to update profile');
        setTimeout(() => setError(''), 4000);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/5" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 h-60 bg-zinc-200/50 dark:bg-zinc-900/30 rounded-lg" />
          <div className="lg:col-span-8 h-72 bg-zinc-200/50 dark:bg-zinc-900/30 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 transition-colors duration-200 font-sans">
      <div className="flex items-center space-x-2.5 mb-8">
        <User className="h-6 w-6 text-zinc-950 dark:text-zinc-50" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-950 dark:text-zinc-50">Profile Settings</h1>
      </div>

      {success && (
        <Card className="mb-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg shadow-sm">
          <CardBody className="flex flex-row items-center gap-2 py-2.5 px-4">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-bold text-zinc-805 dark:text-zinc-100">Profile updated successfully!</span>
          </CardBody>
        </Card>
      )}

      {error && (
        <Card className="mb-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg shadow-sm">
          <CardBody className="flex flex-row items-center gap-2 py-2.5 px-4">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-bold text-red-700 dark:text-red-400">{error}</span>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* --- Left Column: Photo Upload Card (4 cols) --- */}
        <div className="lg:col-span-4">
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg shadow-sm">
            <CardBody className="p-6 text-center flex flex-col items-center">
              <div className="relative group">
                <Avatar 
                  src={profileImageUrl} 
                  name={fullName} 
                  className="w-20 h-20 text-2xl border border-zinc-200 dark:border-zinc-800 pointer-events-none" 
                />
                <label className="absolute bottom-0 right-0 p-1.5 bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 rounded-full cursor-pointer shadow border border-zinc-200 dark:border-zinc-800 transition">
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <h3 className="font-bold text-base text-zinc-900 dark:text-white mt-4 truncate max-w-full">{fullName || 'Student Candidate'}</h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 font-semibold truncate max-w-full">{degree && branch ? `${degree} - ${branch}` : 'Set education details'}</p>
              
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800/80 mt-5 pt-5 text-left space-y-3">
                <div>
                  <span className="block text-[8px] uppercase font-bold text-zinc-400 dark:text-zinc-500">College</span>
                  <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{college || 'Not set'}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Skills list</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {skills ? skills.split(',').map((s, idx) => (
                      <Chip key={idx} size="sm" variant="bordered" className="text-[9px] h-5 border-zinc-200 dark:border-zinc-800 rounded">{s.trim()}</Chip>
                    )) : <span className="text-xs text-zinc-400">No skills set</span>}
                  </div>
                </div>
              </div>

              {isUploading && <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-3 animate-pulse">Uploading photo...</p>}
              {uploadError && <p className="text-[10px] text-red-600 dark:text-red-400 mt-3">{uploadError}</p>}
            </CardBody>
          </Card>
        </div>

        {/* --- Right Column: Settings Tabs Form (8 cols) --- */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit}>
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg shadow-sm">
              <CardBody className="p-6">
                <Tabs aria-label="Profile Sections" color="default" variant="underlined" classNames={{ tabList: "gap-6", tab: "font-bold text-xs" }}>
                  
                  {/* Tab 1: Personal details */}
                  <Tab key="personal" title="Personal Info">
                    <div className="space-y-4 pt-4">
                      <Input
                        isRequired
                        type="text"
                        label="Full Name"
                        value={fullName}
                        onValueChange={setFullName}
                        labelPlacement="outside"
                        placeholder="Enter full name"
                        classNames={{
                          input: "text-xs",
                          label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                        }}
                      />

                      <Input
                        type="text"
                        label="Mobile Number"
                        value={mobileNumber}
                        onValueChange={setMobileNumber}
                        labelPlacement="outside"
                        placeholder="e.g. +91 9876543210"
                        classNames={{
                          input: "text-xs",
                          label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                        }}
                      />
                    </div>
                  </Tab>

                  {/* Tab 2: Education */}
                  <Tab key="education" title="Education">
                    <div className="space-y-4 pt-4">
                      <Input
                        type="text"
                        label="College / University"
                        value={college}
                        onValueChange={setCollege}
                        labelPlacement="outside"
                        placeholder="Enter university name"
                        classNames={{
                          input: "text-xs",
                          label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                        }}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          type="text"
                          label="Degree"
                          value={degree}
                          onValueChange={setDegree}
                          labelPlacement="outside"
                          placeholder="e.g. B.Tech / MCA"
                          classNames={{
                            input: "text-xs",
                            label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          }}
                        />

                        <Input
                          type="text"
                          label="Branch / Specialization"
                          value={branch}
                          onValueChange={setBranch}
                          labelPlacement="outside"
                          placeholder="e.g. Computer Science"
                          classNames={{
                            input: "text-xs",
                            label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          }}
                        />
                      </div>

                      <Input
                        type="number"
                        label="Graduation Year"
                        value={graduationYear}
                        onValueChange={(val) => setGraduationYear(Number(val) || new Date().getFullYear())}
                        labelPlacement="outside"
                        placeholder="e.g. 2026"
                        classNames={{
                          input: "text-xs",
                          label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                        }}
                      />
                    </div>
                  </Tab>

                  {/* Tab 3: Skills & Links */}
                  <Tab key="skills" title="Skills & Links">
                    <div className="space-y-4 pt-4">
                      <Input
                        type="text"
                        label="Skills (Comma-separated)"
                        value={skills}
                        onValueChange={setSkills}
                        labelPlacement="outside"
                        placeholder="Java, React, SQL, Spring Boot..."
                        classNames={{
                          input: "text-xs",
                          label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                        }}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          type="url"
                          label="LinkedIn URL"
                          value={linkedinUrl}
                          onValueChange={setLinkedinUrl}
                          labelPlacement="outside"
                          placeholder="https://linkedin.com/in/..."
                          classNames={{
                            input: "text-xs",
                            label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          }}
                        />

                        <Input
                          type="url"
                          label="GitHub URL"
                          value={githubUrl}
                          onValueChange={setGithubUrl}
                          labelPlacement="outside"
                          placeholder="https://github.com/..."
                          classNames={{
                            input: "text-xs",
                            label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          }}
                        />

                        <Input
                          type="url"
                          label="Portfolio URL"
                          value={portfolioUrl}
                          onValueChange={setPortfolioUrl}
                          labelPlacement="outside"
                          placeholder="https://yourwebsite.com"
                          classNames={{
                            input: "text-xs",
                            label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          }}
                        />
                      </div>
                    </div>
                  </Tab>

                </Tabs>

                <div className="flex justify-end pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-6">
                  <Button
                    type="submit"
                    isLoading={updateMutation.isPending}
                    className="bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold px-5 h-9 rounded-md text-xs shadow"
                  >
                    Save Settings
                  </Button>
                </div>
              </CardBody>
            </Card>
          </form>
        </div>

      </div>
    </div>
  );
}
