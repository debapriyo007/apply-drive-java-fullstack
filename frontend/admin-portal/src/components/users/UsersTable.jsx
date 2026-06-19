import React from 'react';
import { ShieldAlert, ShieldCheck, Trash, Users, Mail, BookOpen, Calendar } from 'lucide-react';
import { Card, CardBody, Button, Spinner } from '@heroui/react';

export default function UsersTable({
  users,
  isLoading,
  onStatusToggle,
  onDelete,
  isStatusPending,
  isDeletePending,
  statusPendingId,
  deletePendingId
}) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 rounded-lg shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all duration-300 overflow-hidden">
      <CardBody className="p-0">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-zinc-500">
            <Spinner size="md" color="default" />
            <p className="text-xs font-semibold">Loading student roster...</p>
          </div>
        ) : !users || users.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Users className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
            <p className="font-bold text-xs">No students found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-3.5 pl-5">Student Info</th>
                  <th className="p-3.5">College / University</th>
                  <th className="p-3.5">Graduation</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80 text-xs text-zinc-700 dark:text-zinc-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-colors">
                    {/* Student Info with Circular Initials Avatar */}
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800/60 flex items-center justify-center text-zinc-650 dark:text-zinc-350 font-extrabold text-xs uppercase flex-shrink-0 select-none">
                          {u.fullName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white text-xs leading-none">{u.fullName}</p>
                          <span className="flex items-center gap-1.5 mt-1 text-zinc-500 text-[10px] font-semibold">
                            <Mail className="h-3 w-3 text-zinc-450" />
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* College */}
                    <td className="p-3.5">
                      <span className="flex items-center gap-1.5 font-semibold text-[11px] text-zinc-650 dark:text-zinc-350">
                        <BookOpen className="h-3.5 w-3.5 text-zinc-405" />
                        {u.college || 'Not Disclosed'}
                      </span>
                    </td>

                    {/* Graduation Year */}
                    <td className="p-3.5">
                      <span className="flex items-center gap-1.5 font-bold text-[11px] text-zinc-650 dark:text-zinc-300">
                        <Calendar className="h-3.5 w-3.5 text-zinc-405" />
                        {u.graduationYear || 'Not Disclosed'}
                      </span>
                    </td>

                    {/* Custom Status badge style */}
                    <td className="p-3.5 text-center">
                      <span 
                        className={`inline-block font-bold text-[9px] rounded-full py-0.5 px-2.5 border ${
                          u.isActive 
                            ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                            : 'bg-red-500/10 dark:bg-red-500/20 text-red-650 dark:text-red-405 border-red-500/20'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className={`h-7 w-7 min-w-7 rounded border border-zinc-200 dark:border-zinc-800/80 transition duration-150 ${
                            u.isActive 
                              ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20' 
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20'
                          }`}
                          onPress={() => onStatusToggle(u.id, !u.isActive)}
                          isLoading={isStatusPending && statusPendingId === u.id}
                          title={u.isActive ? 'Block Student' : 'Activate Student'}
                          aria-label={u.isActive ? 'Block Student' : 'Activate Student'}
                        >
                          {u.isActive ? <ShieldAlert className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                        </Button>
                        
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="h-7 w-7 min-w-7 rounded text-red-655 dark:text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-zinc-200 dark:border-zinc-800/80 transition duration-150"
                          onPress={() => onDelete(u.id)}
                          isLoading={isDeletePending && deletePendingId === u.id}
                          title="Delete Student"
                          aria-label="Delete Student"
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
