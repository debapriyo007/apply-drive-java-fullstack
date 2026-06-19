import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { Card, CardBody, Button, Chip } from '@heroui/react';
import { useSavedJobsList } from '../hooks/useJobs';

export default function SavedJobs() {
  const isLoggedIn = !!localStorage.getItem('user');
  const { data: savedJobs, isLoading } = useSavedJobsList(isLoggedIn);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/5" />
        <Card className="border border-zinc-300 dark:border-zinc-800">
          <CardBody className="h-28 bg-zinc-100/50 dark:bg-zinc-900/20" />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 transition-colors duration-200 font-sans">
      <div className="flex items-center space-x-2.5 mb-8">
        <Bookmark className="h-6 w-6 text-zinc-950 dark:text-zinc-50" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Saved Jobs</h1>
      </div>

      {savedJobs?.length === 0 ? (
        <Card className="border border-dashed border-zinc-300 dark:border-zinc-800 bg-transparent py-14 rounded-lg">
          <CardBody className="text-center">
            <Bookmark className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">No saved jobs</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 mb-5 max-w-xs mx-auto leading-relaxed">Bookmark jobs from the listings to view them later in your candidate panel.</p>
            <Button
              as={Link}
              to="/"
              className="bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold h-8 rounded-md text-xs shadow px-4"
              endContent={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Browse Jobs
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedJobs?.map((job) => (
            <Card 
              key={job.id} 
              className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 transition duration-150 rounded-lg shadow-sm"
            >
              <CardBody className="p-5">
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-200 dark:border-zinc-800 overflow-hidden flex-shrink-0">
                    {job.company?.logoUrl ? (
                      <img src={job.company.logoUrl} alt={job.company.name} className="h-full w-full object-contain p-0.5" />
                    ) : (
                      <Briefcase className="h-5 w-5 text-zinc-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate hover:underline">
                        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                      </h3>
                    </div>
                    
                    <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-400 mt-0.5">{job.company?.name}</p>
                    
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3.5 border-t border-zinc-200 dark:border-zinc-800/80">
                      <div className="flex flex-wrap gap-1.5">
                        <Chip size="sm" variant="bordered" className="text-[9px] h-5 px-1 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                          {job.location}
                        </Chip>
                        <Chip size="sm" variant="bordered" className="text-[9px] h-5 px-1 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 capitalize">
                          {job.jobType.toLowerCase()}
                        </Chip>
                        {job.salary && (
                          <Chip size="sm" variant="bordered" className="text-[9px] h-5 px-1 border-zinc-200 dark:border-zinc-800 text-zinc-605 dark:text-zinc-300 font-bold">
                            {job.salary}
                          </Chip>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          as={Link} 
                          to={`/jobs/${job.id}`} 
                          variant="light" 
                          className="font-bold text-[10px] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 h-7 rounded px-2.5 border border-transparent"
                        >
                          Details
                        </Button>
                        <Button 
                          as="a" 
                          href={job.officialApplyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold text-[10px] rounded-md px-3.5 h-7 shadow"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
