import React from 'react';
import { DollarSign, Award, MapPin, Calendar } from 'lucide-react';
import { Card, CardBody, Button, Input, Select, SelectItem, Chip, Textarea } from '@heroui/react';

export default function JobFormModal({
  isOpen,
  onClose,
  job,
  companies,
  categories,
  onSave,
  isSaving
}) {
  const [title, setTitle] = React.useState('');
  const [companyId, setCompanyId] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [salary, setSalary] = React.useState('');
  const [experience, setExperience] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [jobType, setJobType] = React.useState('REMOTE');
  const [officialApplyUrl, setOfficialApplyUrl] = React.useState('');
  const [deadline, setDeadline] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState([]);

  React.useEffect(() => {
    if (isOpen) {
      setTitle(job?.title || '');
      setCompanyId(job?.company?.id ? String(job.company.id) : job?.companyId ? String(job.companyId) : '');
      setDescription(job?.description || '');
      setSalary(job?.salary || '');
      setExperience(job?.experience || '');
      setLocation(job?.location || '');
      setJobType(job?.jobType || 'REMOTE');
      setOfficialApplyUrl(job?.officialApplyUrl || '');
      setDeadline(job?.deadline || '');
      setSelectedCategories(job?.categories?.map(c => c.id) || job?.categoryIds || []);
    }
  }, [isOpen, job]);

  const toggleCategory = (catId) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      companyId: parseInt(companyId),
      description,
      salary,
      experience,
      location,
      jobType,
      officialApplyUrl,
      deadline: deadline || null,
      categoryIds: selectedCategories
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-hidden transition-all font-sans">
      <form onSubmit={handleSubmit} className="w-full max-w-[90%] md:max-w-2xl lg:max-w-3xl my-4">
        <Card className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg flex flex-col max-h-[85vh] overflow-hidden">
          {/* Modal Header */}
          <div className="p-6 pb-3 border-b border-zinc-200 dark:border-zinc-800/80 flex-shrink-0">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              {job?.id ? 'Edit Job Listing' : 'Create Job Listing'}
            </h3>
          </div>

          {/* Scrollable Form Body */}
          <CardBody className="p-6 space-y-5 overflow-y-auto flex-grow">
            <Input
              isRequired
              label="Job Title"
              placeholder="e.g. Associate Engineer"
              value={title}
              onValueChange={setTitle}
              labelPlacement="outside"
              classNames={{
                input: "text-xs",
                label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                isRequired
                label="Company"
                placeholder="Select Employer"
                selectedKeys={companyId ? [companyId] : []}
                onSelectionChange={(keys) => setCompanyId(Array.from(keys)[0] || '')}
                labelPlacement="outside"
                classNames={{
                  value: "text-xs",
                  label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                }}
              >
                {companies?.map(c => <SelectItem key={String(c.id)} textValue={c.name}>{c.name}</SelectItem>) || []}
              </Select>

              <Select
                label="Job Type"
                selectedKeys={[jobType]}
                onSelectionChange={(keys) => setJobType(Array.from(keys)[0] || 'REMOTE')}
                labelPlacement="outside"
                classNames={{
                  value: "text-xs",
                  label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                }}
              >
                <SelectItem key="REMOTE" textValue="Remote">Remote</SelectItem>
                <SelectItem key="HYBRID" textValue="Hybrid">Hybrid</SelectItem>
                <SelectItem key="ONSITE" textValue="Onsite">Onsite</SelectItem>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Salary Package"
                placeholder="e.g. 7 LPA"
                value={salary}
                onValueChange={setSalary}
                labelPlacement="outside"
                startContent={<DollarSign className="h-3.5 w-3.5 text-zinc-400" />}
                classNames={{
                  input: "text-xs",
                  label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                }}
              />

              <Input
                label="Experience Level"
                placeholder="e.g. Freshers"
                value={experience}
                onValueChange={setExperience}
                labelPlacement="outside"
                startContent={<Award className="h-3.5 w-3.5 text-zinc-400" />}
                classNames={{
                  input: "text-xs",
                  label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                }}
              />

              <Input
                label="Job Location"
                placeholder="e.g. Bangalore"
                value={location}
                onValueChange={setLocation}
                labelPlacement="outside"
                startContent={<MapPin className="h-3.5 w-3.5 text-zinc-400" />}
                classNames={{
                  input: "text-xs",
                  label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                isRequired
                type="url"
                label="Official Apply Link"
                placeholder="https://company.com/careers/apply"
                value={officialApplyUrl}
                onValueChange={setOfficialApplyUrl}
                labelPlacement="outside"
                classNames={{
                  input: "text-xs",
                  label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                }}
              />

              <Input
                type="date"
                label="Deadline Date"
                value={deadline}
                onValueChange={setDeadline}
                labelPlacement="outside"
                startContent={<Calendar className="h-3.5 w-3.5 text-zinc-400" />}
                classNames={{
                  input: "text-xs",
                  label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Categories (Filter Tags)</label>
              <div className="flex flex-wrap gap-1">
                {categories?.map((cat) => (
                  <Chip
                    key={cat.id}
                    variant={selectedCategories.includes(cat.id) ? "solid" : "bordered"}
                    className={`cursor-pointer font-bold text-[9px] h-6 border-zinc-200 dark:border-zinc-800 ${
                      selectedCategories.includes(cat.id) 
                        ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900' 
                        : 'text-zinc-650 dark:text-zinc-400'
                    }`}
                    onPress={() => toggleCategory(cat.id)}
                  >
                    {cat.name}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="pt-1.5">
              <Textarea
                isRequired
                label="Job Description"
                placeholder="Detailed description..."
                value={description}
                onValueChange={setDescription}
                labelPlacement="outside"
                minRows={4}
                classNames={{
                  input: "text-xs py-1.5",
                  label: "text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                }}
              />
            </div>
          </CardBody>

          {/* Sticky Modal Footer */}
          <div className="p-6 py-4 border-t border-zinc-200 dark:border-zinc-800/80 flex justify-end gap-2 flex-shrink-0 bg-white dark:bg-zinc-950 mt-auto">
            <Button variant="light" className="text-xs h-8 font-semibold rounded" onPress={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold px-4 h-8 text-xs rounded-md shadow"
              isLoading={isSaving}
            >
              Save Drive
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
