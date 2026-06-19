import React from 'react';
import { Building2, Globe, Edit, Trash } from 'lucide-react';
import { Card, CardBody, Button, Spinner } from '@heroui/react';

export default function CompaniesTable({
  companies,
  isLoading,
  onEdit,
  onDelete,
  isDeletePending,
  deletePendingId
}) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 rounded-lg shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all duration-300 overflow-hidden">
      <CardBody className="p-0">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-zinc-500">
            <Spinner size="md" color="default" />
            <p className="text-xs font-semibold">Loading companies...</p>
          </div>
        ) : !companies || companies.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Building2 className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
            <p className="font-bold text-xs">No employers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-3.5 pl-5 w-20">Logo</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Website</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80 text-xs text-zinc-700 dark:text-zinc-300">
                {companies.map((comp) => (
                  <tr key={comp.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-colors">
                    {/* Logo - Circular Style */}
                    <td className="p-3.5 pl-5">
                      <div className="h-8 w-8 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800/60 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {comp.logoUrl ? (
                          <img src={comp.logoUrl} alt={comp.name} className="h-full w-full object-contain p-0.5" />
                        ) : (
                          <Building2 className="h-4 w-4 text-zinc-400" />
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="p-3.5 font-bold text-zinc-900 dark:text-white">{comp.name}</td>

                    {/* Website Globe Link */}
                    <td className="p-3.5">
                      {comp.websiteUrl ? (
                        <a 
                          href={comp.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:underline font-semibold flex items-center gap-1.5 text-[11px] transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5 text-zinc-400" />
                          {comp.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      ) : (
                        <span className="text-zinc-400 text-[11px] font-medium">Not Specified</span>
                      )}
                    </td>

                    {/* Actions Row */}
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="h-7 w-7 min-w-7 rounded text-zinc-650 dark:text-zinc-350 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 transition duration-150"
                          onPress={() => onEdit(comp)}
                          title="Edit Company"
                          aria-label="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="h-7 w-7 min-w-7 rounded text-red-655 dark:text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-zinc-200 dark:border-zinc-800/80 transition duration-150"
                          onPress={() => onDelete(comp.id, comp.name)}
                          isLoading={isDeletePending && deletePendingId === comp.id}
                          title="Delete Company"
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
        )}
      </CardBody>
    </Card>
  );
}
