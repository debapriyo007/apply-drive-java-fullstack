import React from 'react';
import { Bookmark, Briefcase } from 'lucide-react';
import { Card, CardBody, Chip, Button } from '@heroui/react';
import { Link } from 'react-router-dom';

export default function JobCard({
  job,
  isLoggedIn,
  savedJobIds,
  onSaveToggle,
  openLoginModal
}) {
  const isSaved = isLoggedIn && savedJobIds.has(job.id);

  return (
    <Card 
      className="relative border border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition duration-150 rounded-lg shadow-sm backdrop-blur-sm"
    >
      <CardBody className="p-5">
        {/* Dynamic Bookmark Star overlay */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isLoggedIn) {
              openLoginModal();
            } else {
              onSaveToggle(job.id);
            }
          }}
          className={`absolute top-4 right-4 p-1.5 rounded-md border transition z-10 ${
            isSaved
              ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950'
              : 'bg-white border-zinc-200 text-zinc-400 hover:text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:text-white'
          }`}
          title={isSaved ? "Unsave Job" : "Save Job"}
        >
          <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        <div className="flex gap-4">
          {/* Company Logo container */}
          <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-200 dark:border-zinc-800 overflow-hidden flex-shrink-0">
            {job.company?.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} className="h-full w-full object-contain p-0.5" />
            ) : (
              <Briefcase className="h-5 w-5 text-zinc-400" />
            )}
          </div>
          
          {/* Job Title & Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white truncate hover:underline pr-8">
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
            </div>
            
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">{job.company?.name}</p>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed font-normal">
              {job.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3.5 border-t border-zinc-200 dark:border-zinc-800/80">
              {/* Left: Metadata tags */}
              <div className="flex flex-wrap gap-1.5">
                {job.categories?.map((cat) => (
                  <Chip 
                    key={cat.id} 
                    size="sm" 
                    variant="bordered" 
                    className="text-xs h-6 px-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-50 dark:bg-zinc-900/40"
                  >
                    {cat.name}
                  </Chip>
                ))}
                <Chip size="sm" variant="bordered" className="text-xs h-6 px-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {job.location}
                </Chip>
                <Chip size="sm" variant="bordered" className="text-xs h-6 px-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 capitalize">
                  {job.jobType.toLowerCase()}
                </Chip>
                {job.salary && (
                  <Chip size="sm" variant="bordered" className="text-xs h-6 px-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-50 dark:bg-zinc-900/10">
                    {job.salary}
                  </Chip>
                )}
              </div>
              
              {/* Right: Apply & Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  as={Link} 
                  to={`/jobs/${job.id}`} 
                  variant="light" 
                  className="font-bold text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 h-7 rounded px-2.5 border border-transparent"
                >
                  Details
                </Button>
                <Button 
                  as="a" 
                  href={job.officialApplyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold text-xs rounded-md px-3.5 h-7 shadow"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
