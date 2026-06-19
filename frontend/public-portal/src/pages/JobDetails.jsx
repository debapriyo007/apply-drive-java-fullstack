import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, Star, ArrowLeft, DollarSign, Award } from 'lucide-react';
import { Button, Card, CardBody, Chip } from '@heroui/react';
import { useJobDetails, useSavedStatus, useToggleSaveJob } from '../hooks/useJobs';

export default function JobDetails() {
  const { id } = useParams();
  const isLoggedIn = !!localStorage.getItem('user');

  // Fetch job details
  const { data: job, isLoading } = useJobDetails(id);

  // Check if job is saved
  const { data: isSavedData } = useSavedStatus(id, isLoggedIn);

  // Save/Unsave Mutation
  const toggleSaveMutation = useToggleSaveJob();

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/5" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-72 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-lg" />
          <div className="lg:col-span-4 h-72 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 font-sans">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Job Not Found</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-2">The drive you are looking for may have been expired or removed.</p>
        <Button as={Link} to="/" className="mt-6 bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold text-xs h-8 rounded-md">
          Back to Listings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 transition-colors duration-200 font-sans">
      <Link 
        to="/" 
        className="inline-flex items-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-6 transition gap-1.5"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* --- Main Info Pane (8 cols) --- */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg shadow-sm">
            <CardBody className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800/80 mb-6">
                <div className="h-14 w-14 bg-zinc-50 dark:bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-200 dark:border-zinc-800 overflow-hidden flex-shrink-0">
                  {job.company.logoUrl ? (
                    <img src={job.company.logoUrl} alt={job.company.name} className="h-full w-full object-contain p-0.5" />
                  ) : (
                    <Briefcase className="h-7 w-7 text-zinc-400" />
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 max-w-full">
                    <h1 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 leading-tight truncate">{job.title}</h1>
                    {isLoggedIn && (
                      <button 
                        onClick={() => toggleSaveMutation.mutate({ id, isSaved: isSavedData?.saved })}
                        className={`p-1 rounded-md border transition flex-shrink-0 ${
                          isSavedData?.saved
                            ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950'
                            : 'bg-white border-zinc-200 text-zinc-400 hover:text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:text-white'
                        }`}
                        title={isSavedData?.saved ? "Remove Bookmark" : "Bookmark Drive"}
                      >
                        <Star className={`h-3 w-3 ${isSavedData?.saved ? 'fill-current' : ''}`} />
                      </button>
                    )}
                  </div>
                  <p className="text-zinc-900 dark:text-zinc-300 text-xs font-semibold mt-1">{job.company.name}</p>
                  
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    <Chip size="sm" variant="bordered" className="text-[9px] h-5 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                      {job.location}
                    </Chip>
                    <Chip size="sm" variant="bordered" className="text-[9px] h-5 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 capitalize">
                      {job.jobType.toLowerCase()}
                    </Chip>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3.5">Job Description</h3>
                <div className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap text-xs font-normal">
                  {job.description}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* --- Sidebar (4 cols) --- */}
        <div className="lg:col-span-4 space-y-6">
          {/* Actions Card */}
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg shadow-sm">
            <CardBody className="p-5 space-y-3">
              <Button
                as="a"
                href={job.officialApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold h-9 rounded-md shadow text-xs flex justify-center items-center"
              >
                Apply Now
              </Button>
              
              {isLoggedIn && (
                <Button
                  variant={isSavedData?.saved ? "flat" : "bordered"}
                  className={`w-full font-bold h-9 text-xs rounded-md ${
                    isSavedData?.saved 
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300' 
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                  onPress={() => toggleSaveMutation.mutate({ id, isSaved: isSavedData?.saved })}
                  isLoading={toggleSaveMutation.isPending}
                  startContent={<Star className={`h-3.5 w-3.5 ${isSavedData?.saved ? 'fill-current' : ''}`} />}
                >
                  {isSavedData?.saved ? 'Saved' : 'Bookmark'}
                </Button>
              )}
            </CardBody>
          </Card>

          {/* Quick Details Card */}
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg shadow-sm">
            <CardBody className="p-5 space-y-4">
              <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">Drive Summary</h4>
              
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-600 dark:text-zinc-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Package Range</span>
                    <span className="block text-xs font-bold text-zinc-900 dark:text-white">{job.salary || 'Not Disclosed'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-600 dark:text-zinc-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Experience Needed</span>
                    <span className="block text-xs font-bold text-zinc-900 dark:text-white">{job.experience || 'Not Required'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-600 dark:text-zinc-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Apply Before</span>
                    <span className="block text-xs font-bold text-zinc-900 dark:text-white">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No Deadline'}
                    </span>
                  </div>
                </div>
              </div>

              {job.categories && job.categories.length > 0 && (
                <div className="pt-3.5 border-t border-zinc-200 dark:border-zinc-800/80">
                  <span className="block text-[8px] uppercase font-bold text-zinc-400 dark:text-zinc-500 mb-2">Category tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.categories.map((cat) => (
                      <Chip key={cat.id} size="sm" variant="bordered" className="text-[9px] h-5 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {cat.name}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
