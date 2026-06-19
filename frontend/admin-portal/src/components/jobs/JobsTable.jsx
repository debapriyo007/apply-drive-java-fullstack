import React from 'react';
import { Briefcase, Copy, Edit, Trash, Building2 } from 'lucide-react';
import { Card, CardBody, Button, Spinner, Chip } from '@heroui/react';

export default function JobsTable({
  jobs,
  totalPages,
  page,
  setPage,
  isLoading,
  onStatusChange,
  onClone,
  isClonePending,
  clonePendingId,
  onEdit,
  onDelete,
  isDeletePending,
  deletePendingId
}) {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40';
      case 'DRAFT':
        return 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:border-amber-500/40';
      case 'EXPIRED':
        return 'bg-red-500/10 dark:bg-red-500/20 text-red-650 dark:text-red-405 border-red-500/20 hover:border-red-500/40';
      default: // CLOSED
        return 'bg-zinc-550/10 dark:bg-zinc-500/20 text-zinc-550 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400';
    }
  };

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 rounded-lg shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all duration-300 overflow-hidden">
      <CardBody className="p-0">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-zinc-500">
            <Spinner size="md" color="default" />
            <p className="text-xs font-semibold">Loading listings...</p>
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Briefcase className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
            <p className="font-bold text-xs">No job listings compiled yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-3.5 pl-5">Title</th>
                    <th className="p-3.5">Employer</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Setup</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80 text-xs text-zinc-700 dark:text-zinc-300">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-colors">
                      {/* Job Title */}
                      <td className="p-3.5 pl-5 font-bold text-zinc-900 dark:text-white truncate max-w-[160px]" title={job.title}>
                        {job.title}
                      </td>

                      {/* Employer Circular Logo & Name */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800/60 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {job.company?.logoUrl ? (
                              <img src={job.company.logoUrl} alt={job.company.name} className="h-full w-full object-contain p-0.5" />
                            ) : (
                              <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                            )}
                          </div>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-200 truncate max-w-[120px]">{job.company?.name}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="p-3.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">{job.location}</td>

                      {/* Setup type */}
                      <td className="p-3.5">
                        <Chip size="sm" variant="bordered" className="text-[9px] h-5 border-zinc-200 dark:border-zinc-800 capitalize text-zinc-600 dark:text-zinc-400 font-bold bg-zinc-50/40 dark:bg-zinc-900/20">
                          {job.jobType.toLowerCase()}
                        </Chip>
                      </td>

                      {/* Status select badges */}
                      <td className="p-3.5 text-center">
                        <select
                           value={job.status}
                           onChange={(e) => onStatusChange(job.id, e.target.value)}
                           className={`px-2.5 py-0.5 text-[10px] font-bold border rounded-full outline-none cursor-pointer text-center bg-white dark:bg-zinc-950 transition-all duration-200 appearance-none ${getStatusStyles(job.status)}`}
                        >
                          <option value="DRAFT" className="text-zinc-800 bg-white dark:bg-zinc-950 dark:text-zinc-100">Draft</option>
                          <option value="ACTIVE" className="text-zinc-800 bg-white dark:bg-zinc-950 dark:text-zinc-100">Active</option>
                          <option value="EXPIRED" className="text-zinc-800 bg-white dark:bg-zinc-950 dark:text-zinc-100">Expired</option>
                          <option value="CLOSED" className="text-zinc-800 bg-white dark:bg-zinc-950 dark:text-zinc-100">Closed</option>
                        </select>
                      </td>

                      {/* Action buttons */}
                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="h-7 w-7 min-w-7 rounded text-zinc-550 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 border border-zinc-200 dark:border-zinc-800/80 transition duration-150"
                            onPress={() => onClone(job.id)}
                            isLoading={isClonePending && clonePendingId === job.id}
                            title="Clone Listing"
                            aria-label="Clone"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="h-7 w-7 min-w-7 rounded text-zinc-650 dark:text-zinc-350 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 transition duration-150"
                            onPress={() => onEdit(job)}
                            title="Edit Listing"
                            aria-label="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="h-7 w-7 min-w-7 rounded text-red-655 dark:text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-zinc-200 dark:border-zinc-800/80 transition duration-150"
                            onPress={() => onDelete(job.id, job.title)}
                            isLoading={isDeletePending && deletePendingId === job.id}
                            title="Delete Listing"
                            aria-label="Delete"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-4 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  size="sm"
                  variant="bordered"
                  className="text-xs font-bold border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md h-8 px-3.5"
                  isDisabled={page === 0}
                  onPress={() => setPage(prev => Math.max(0, prev - 1))}
                >
                  Previous
                </Button>
                
                <span className="text-xs text-zinc-500 font-semibold">
                  Page {page + 1} of {totalPages}
                </span>

                <Button
                  size="sm"
                  variant="bordered"
                  className="text-xs font-bold border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md h-8 px-3.5"
                  isDisabled={page === totalPages - 1}
                  onPress={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}
