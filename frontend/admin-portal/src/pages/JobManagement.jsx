import React from 'react';
import { Plus, Sparkles, Briefcase, Search } from 'lucide-react';
import { Button, Input, Select, SelectItem } from '@heroui/react';
import AIScraperModal from '../components/jobs/AIScraperModal';
import JobFormModal from '../components/jobs/JobFormModal';
import JobsTable from '../components/jobs/JobsTable';
import { 
  useAdminJobs, 
  useAdminCompanies, 
  useAdminCategories, 
  useImportParse, 
  useSaveJob, 
  useUpdateJobStatus, 
  useDeleteJob, 
  useCloneJob 
} from '../hooks/useJobs';

export default function JobManagement() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState(null);

  // Search, Filter and Pagination states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [page, setPage] = React.useState(0);

  // Reset page when search or status filters change
  React.useEffect(() => {
    setPage(0);
  }, [searchQuery, statusFilter]);

  const params = React.useMemo(() => {
    const p = {
      page,
      size: 10,
    };
    if (searchQuery) p.title = searchQuery;
    if (statusFilter && statusFilter !== 'ALL') p.status = statusFilter;
    return p;
  }, [page, searchQuery, statusFilter]);

  // Fetch Jobs
  const { data: jobsData, isLoading } = useAdminJobs(params);

  // Fetch Companies
  const { data: companies } = useAdminCompanies();

  // Fetch Categories
  const { data: categories } = useAdminCategories();

  // Import Parser Mutation
  const importMutation = useImportParse();

  // Create/Update Mutation
  const saveMutation = useSaveJob(selectedJob?.id);

  // Status Change Mutation
  const statusMutation = useUpdateJobStatus();

  // Delete Mutation
  const deleteMutation = useDeleteJob();

  // Clone Mutation
  const cloneMutation = useCloneJob();

  const openCreateModal = () => {
    setSelectedJob(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="p-6 space-y-6 transition-colors duration-200 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-zinc-950 dark:text-white animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Job Listings</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5 font-normal">Manage compilations, clone alerts, and edit details.</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onPress={() => setIsImporting(true)}
            variant="bordered"
            className="text-xs h-8 font-bold border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-305 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 rounded-md"
            startContent={<Sparkles className="h-3.5 w-3.5" />}
          >
            AI Scraper
          </Button>
          <Button
            onPress={openCreateModal}
            className="bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold text-xs h-8 rounded-md shadow-sm"
            startContent={<Plus className="h-3.5 w-3.5" />}
          >
            Create Drive
          </Button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          isClearable
          placeholder="Search job drives by title..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search className="h-4 w-4 text-zinc-400" />}
          classNames={{
            input: "text-xs",
            inputWrapper: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md h-9 px-3 shadow-sm"
          }}
          className="flex-grow"
        />
        <Select
          placeholder="Filter by Status"
          selectedKeys={statusFilter ? [statusFilter] : []}
          onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] || '')}
          classNames={{
            value: "text-xs",
            trigger: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md h-9 min-h-9 shadow-sm w-full sm:w-44"
          }}
        >
          <SelectItem key="ALL" textValue="All Statuses">All Statuses</SelectItem>
          <SelectItem key="DRAFT" textValue="Draft">Draft</SelectItem>
          <SelectItem key="ACTIVE" textValue="Active">Active</SelectItem>
          <SelectItem key="EXPIRED" textValue="Expired">Expired</SelectItem>
          <SelectItem key="CLOSED" textValue="Closed">Closed</SelectItem>
        </Select>
      </div>

      <AIScraperModal
        isOpen={isImporting}
        onClose={() => setIsImporting(false)}
        onParse={(text) => importMutation.mutate(text, {
          onSuccess: (data) => {
            const foundCompany = companies?.find(c => c.name.toLowerCase().includes(data.company?.name?.toLowerCase()));
            const draftJob = {
              title: data.title || '',
              salary: data.salary || '',
              location: data.location || '',
              officialApplyUrl: data.officialApplyUrl || '',
              description: data.description || '',
              experience: data.experience || '',
              companyId: foundCompany ? foundCompany.id : '',
              jobType: 'REMOTE',
              categoryIds: []
            };
            setSelectedJob(draftJob);
            setIsImporting(false);
            setIsModalOpen(true);
          }
        })}
        isParsing={importMutation.isPending}
      />

      <JobFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        job={selectedJob}
        companies={companies}
        categories={categories}
        onSave={(payload) => saveMutation.mutate(payload, { onSuccess: closeModal })}
        isSaving={saveMutation.isPending}
      />

      <JobsTable
        jobs={jobsData?.content}
        totalPages={jobsData?.totalPages || 0}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
        onClone={(id) => cloneMutation.mutate(id)}
        isClonePending={cloneMutation.isPending}
        clonePendingId={cloneMutation.variables}
        onEdit={openEditModal}
        onDelete={(id, title) => {
          if (confirm(`Delete the drive listing "${title}"?`)) {
            deleteMutation.mutate(id);
          }
        }}
        isDeletePending={deleteMutation.isPending}
        deletePendingId={deleteMutation.variables}
      />
    </div>
  );
}
