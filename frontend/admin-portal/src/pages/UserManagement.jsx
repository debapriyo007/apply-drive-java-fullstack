import React from 'react';
import { Users, Search } from 'lucide-react';
import { Input } from '@heroui/react';
import UsersTable from '../components/users/UsersTable';
import { useAdminUsers, useUpdateUserStatus, useDeleteUser } from '../hooks/useAdmin';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = React.useState('');

  // Fetch Users list
  const { data: usersData, isLoading } = useAdminUsers();

  const filteredUsers = React.useMemo(() => {
    const users = usersData?.content;
    if (!searchQuery) return users;
    return users?.filter(u => 
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.college?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [usersData, searchQuery]);

  // Block/Activate Mutation
  const statusMutation = useUpdateUserStatus();

  // Delete Mutation
  const deleteMutation = useDeleteUser();

  return (
    <div className="p-6 space-y-6 transition-colors duration-200 font-sans">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-zinc-950 dark:text-white" />
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Registered Students</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5 font-normal">Review student records, block inactive users, and manage access privileges.</p>
        </div>
      </div>

      {/* Search Controls */}
      <div className="w-full max-w-md">
        <Input
          isClearable
          placeholder="Search students by name, email, or college..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search className="h-4 w-4 text-zinc-400" />}
          classNames={{
            input: "text-xs",
            inputWrapper: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md h-9 px-3 shadow-sm"
          }}
        />
      </div>

      <UsersTable
        users={filteredUsers}
        isLoading={isLoading}
        onStatusToggle={(id, isActive) => statusMutation.mutate({ id, isActive })}
        onDelete={(id) => {
          if (confirm('Delete this candidate profile permanently?')) {
            deleteMutation.mutate(id);
          }
        }}
        isStatusPending={statusMutation.isPending}
        isDeletePending={deleteMutation.isPending}
        statusPendingId={statusMutation.variables?.id}
        deletePendingId={deleteMutation.variables}
      />
    </div>
  );
}
