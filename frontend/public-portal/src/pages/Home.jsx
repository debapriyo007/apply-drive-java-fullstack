import React from 'react';
import { Briefcase } from 'lucide-react';
import { Button, Card, CardBody } from '@heroui/react';

import HeroHeader from '../components/home/HeroHeader';
import ProfileDetailsCard from '../components/home/ProfileDetailsCard';
import PartnersCard from '../components/home/PartnersCard';
import FiltersPanel from '../components/home/FiltersPanel';
import JobCard from '../components/home/JobCard';
import SearchBar from '../components/home/SearchBar';
import ProfileWelcomeCard from '../components/home/ProfileWelcomeCard';
import EcosystemStatsCard from '../components/home/EcosystemStatsCard';

import { useJobsList, useCategories, useCompanies, useSavedJobsList, useToggleSaveJob } from '../hooks/useJobs';
import { useProfile } from '../hooks/useProfile';

export default function Home() {
  const [search, setSearch] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [jobType, setJobType] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');
  const [page, setPage] = React.useState(0);

  React.useEffect(() => {
    setPage(0);
  }, [search, location, jobType, categoryId]);

  const isLoggedIn = !!localStorage.getItem('user');

  // Fetch student profile details if logged in
  const { data: profile } = useProfile(isLoggedIn);

  // Fetch saved jobs to manage bookmarks
  const { data: savedJobs } = useSavedJobsList(isLoggedIn);

  const savedJobIds = React.useMemo(() => new Set(savedJobs?.map(j => j.id) || []), [savedJobs]);

  // Toggle Save Mutation
  const toggleSaveMutation = useToggleSaveJob();

  const params = React.useMemo(() => {
    const p = {
      page,
      size: 5,
    };
    if (search) p.title = search;
    if (location) p.location = location;
    if (jobType) p.jobType = jobType;
    if (categoryId) p.categoryId = categoryId;
    return p;
  }, [page, search, location, jobType, categoryId]);

  // Fetch jobs
  const { data: jobsData, isLoading, refetch } = useJobsList(params);

  // Fetch categories
  const { data: categories } = useCategories();

  // Fetch companies
  const { data: companies } = useCompanies();

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setJobType('');
    setCategoryId('');
  };

  const openLoginModal = () => {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  };

  return (
    <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-200 font-jakarta">
      {/* Decorative top glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-zinc-400/5 dark:bg-zinc-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-zinc-400/5 dark:bg-zinc-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Header */}
      <HeroHeader />

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* --- LEFT COLUMN: Profile, Stats, & Companies --- */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Card / Welcome Card */}
          <ProfileWelcomeCard 
            isLoggedIn={isLoggedIn} 
            profile={profile} 
            onOpenLogin={openLoginModal} 
          />

          {/* Student Profile Details Card or Statistics Fallback */}
          {isLoggedIn ? (
            <ProfileDetailsCard profile={profile} />
          ) : (
            <EcosystemStatsCard 
              totalDrives={jobsData?.totalElements || 0} 
              totalCompanies={companies?.length || 0} 
              totalSectors={categories?.length || 0} 
            />
          )}

          {/* Partners Card */}
          <PartnersCard companies={companies} setSearch={setSearch} />
        </div>

        {/* --- CENTER COLUMN: Search & Job Listings --- */}
        <div className="lg:col-span-6 space-y-5">
          {/* Search Bar with Suggestions */}
          <SearchBar 
            search={search}
            setSearch={setSearch}
            setLocation={setLocation}
            setCategoryId={setCategoryId}
            categories={categories}
            companies={companies}
            jobsData={jobsData}
            onSearchRefetch={refetch}
          />

          {/* Results Header Metadata */}
          <div className="flex justify-between items-center px-1">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                {search ? `Search: "${search}"` : "Latest Postings"}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{jobsData?.totalElements || 0}</span> opportunities compiled...
              </p>
            </div>
            
            {(search || location || jobType || categoryId) && (
              <Button size="sm" variant="light" className="text-[10px] font-bold text-red-650 dark:text-red-400 h-6 border border-red-200 dark:border-red-950 rounded px-2 hover:bg-red-50 dark:hover:bg-red-950/20" onPress={clearFilters}>
                Clear
              </Button>
            )}
          </div>

          {/* Job Listings List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <Card key={n} className="border border-zinc-200 dark:border-zinc-800 animate-pulse rounded-lg">
                  <CardBody className="h-28 bg-zinc-100/50 dark:bg-zinc-900/20" />
                </Card>
              ))}
            </div>
          ) : jobsData?.content?.length === 0 ? (
            <Card className="border border-dashed border-zinc-300 dark:border-zinc-800 bg-transparent py-14 rounded-lg">
              <CardBody className="text-center">
                <Briefcase className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
                <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">No postings matches</h3>
                <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1">Try resetting search keywords or setup parameters.</p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobsData?.content?.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isLoggedIn={isLoggedIn}
                  savedJobIds={savedJobIds}
                  onSaveToggle={(jobId) => toggleSaveMutation.mutate({ id: jobId, isSaved: savedJobIds.has(jobId) })}
                  openLoginModal={openLoginModal}
                />
              ))}
              
              {jobsData?.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6">
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
                    Page {page + 1} of {jobsData.totalPages}
                  </span>

                  <Button
                    size="sm"
                    variant="bordered"
                    className="text-xs font-bold border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md h-8 px-3.5"
                    isDisabled={page === jobsData.totalPages - 1}
                    onPress={() => setPage(prev => Math.min(jobsData.totalPages - 1, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: Filters Panel --- */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
          <FiltersPanel
            jobType={jobType}
            setJobType={setJobType}
            location={location}
            setLocation={setLocation}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            categories={categories}
          />
        </div>

      </div>
    </div>
  );
}
