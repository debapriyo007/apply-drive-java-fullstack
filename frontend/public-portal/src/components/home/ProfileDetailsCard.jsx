import React from 'react';
import { School, BookOpen, GitBranch, Calendar, Phone, Mail } from 'lucide-react';
import { Card, CardBody, Chip } from '@heroui/react';

export default function ProfileDetailsCard({ profile }) {
  return (
    <Card className="hidden lg:block border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm rounded-lg shadow-sm">
      <CardBody className="p-5 space-y-4">
        <h4 className="font-bold text-[11px] text-zinc-900 dark:text-white uppercase tracking-wider">My Profile Details</h4>
        <div className="space-y-3.5 text-zinc-700 dark:text-zinc-300">
          <div>
            <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
              <School className="h-3.5 w-3.5 text-zinc-400" /> College
            </span>
            <span className="block font-semibold text-xs text-zinc-700 dark:text-zinc-300 mt-0.5 leading-snug">{profile?.college || 'Not set'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                <BookOpen className="h-3.5 w-3.5 text-zinc-400" /> Degree
              </span>
              <span className="block font-semibold text-xs text-zinc-700 dark:text-zinc-300 mt-0.5 truncate" title={profile?.degree}>{profile?.degree || 'Not set'}</span>
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                <GitBranch className="h-3.5 w-3.5 text-zinc-400" /> Branch
              </span>
              <span className="block font-semibold text-xs text-zinc-700 dark:text-zinc-300 mt-0.5 truncate" title={profile?.branch}>{profile?.branch || 'Not set'}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Graduation
              </span>
              <span className="block font-semibold text-xs text-zinc-700 dark:text-zinc-300 mt-0.5">{profile?.graduationYear || 'Not set'}</span>
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                <Phone className="h-3.5 w-3.5 text-zinc-400" /> Mobile
              </span>
              <span className="block font-semibold text-xs text-zinc-700 dark:text-zinc-300 mt-0.5 truncate" title={profile?.mobileNumber}>{profile?.mobileNumber || 'Not set'}</span>
            </div>
          </div>
          <div>
            <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
              <Mail className="h-3.5 w-3.5 text-zinc-400" /> Email Address
            </span>
            <span className="block font-semibold text-xs text-zinc-700 dark:text-zinc-300 mt-0.5 truncate" title={profile?.email}>{profile?.email || 'Not set'}</span>
          </div>
          {profile?.skills && (
            <div>
              <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 tracking-wider">My Skills</span>
              <div className="flex flex-wrap gap-1">
                {profile.skills.split(',').slice(0, 8).map((skill, sIdx) => (
                  <Chip key={sIdx} size="sm" variant="bordered" className="text-[10px] h-5 px-1.5 border-zinc-200 dark:border-zinc-800 rounded font-semibold text-zinc-650 dark:text-zinc-300">
                    {skill.trim()}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
