import React from 'react';
import { Plus, Building2, Search } from 'lucide-react';
import { Button, Input } from '@heroui/react';
import CompanyModal from '../components/companies/CompanyModal';
import CompaniesTable from '../components/companies/CompaniesTable';
import { useAdminCompaniesSetup, useSaveCompany, useDeleteCompany } from '../hooks/useAdmin';

export default function CompanyManagement() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Fetch Companies
  const { data: companies, isLoading } = useAdminCompaniesSetup();

  const filteredCompanies = React.useMemo(() => {
    if (!searchQuery) return companies;
    return companies?.filter(comp => 
      comp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.websiteUrl?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [companies, searchQuery]);

  // Save/Update Mutation
  const saveMutation = useSaveCompany(selectedCompany?.id);

  // Delete Mutation
  const deleteMutation = useDeleteCompany();

  const openCreateModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const openEditModal = (comp) => {
    setSelectedCompany(comp);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  return (
    <div className="p-6 space-y-6 transition-colors duration-200 font-sans">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-zinc-950 dark:text-white" />
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Employers Setup</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5 font-normal">Configure and manage hiring companies registered on the portal.</p>
          </div>
        </div>
        
        <Button
          onPress={openCreateModal}
          className="bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold text-xs h-8 rounded-md shadow-sm"
          startContent={<Plus className="h-3.5 w-3.5" />}
        >
          Add Company
        </Button>
      </div>

      {/* Search Controls */}
      <div className="w-full max-w-md">
        <Input
          isClearable
          placeholder="Search companies by name or website..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search className="h-4 w-4 text-zinc-400" />}
          classNames={{
            input: "text-xs",
            inputWrapper: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md h-9 px-3 shadow-sm"
          }}
        />
      </div>

      <CompanyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        company={selectedCompany}
        onSave={(payload) => saveMutation.mutate(payload, { onSuccess: closeModal })}
        isSaving={saveMutation.isPending}
      />

      <CompaniesTable
        companies={filteredCompanies}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={(id, name) => {
          if (confirm(`Delete ${name} and all associated job drives?`)) {
            deleteMutation.mutate(id);
          }
        }}
        isDeletePending={deleteMutation.isPending}
        deletePendingId={deleteMutation.variables}
      />
    </div>
  );
}
