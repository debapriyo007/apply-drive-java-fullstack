import React from 'react';
import { Search, Briefcase, Building2, Clock, X, MapPin, Code } from 'lucide-react';
import { Button } from '@heroui/react';

export default function SearchBar({
  search,
  setSearch,
  setLocation,
  setCategoryId,
  categories,
  companies,
  jobsData,
  onSearchRefetch
}) {
  const [searchHistory, setSearchHistory] = React.useState([]);
  const [isOpenSuggestions, setIsOpenSuggestions] = React.useState(false);

  React.useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  const saveSearchToHistory = (query) => {
    if (!query || !query.trim()) return;
    const trimmed = query.trim();
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history = history.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
    history.unshift(trimmed);
    history = history.slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    setSearchHistory(history);
  };

  const removeSearchFromHistory = (e, query) => {
    e.preventDefault();
    e.stopPropagation();
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history = history.filter(item => item.toLowerCase() !== query.toLowerCase());
    localStorage.setItem('searchHistory', JSON.stringify(history));
    setSearchHistory(history);
  };

  const filteredSuggestions = React.useMemo(() => {
    const query = search.toLowerCase().trim();
    const suggestions = [];

    // If search is empty or short, suggest the search history items
    if (!search || search.trim().length < 2) {
      return searchHistory.map(item => ({
        text: item,
        type: 'recent search',
        icon: <Clock className="h-3.5 w-3.5 text-zinc-400" />
      }));
    }

    // Otherwise, match query against search history first
    searchHistory.forEach(item => {
      if (item.toLowerCase().includes(query)) {
        suggestions.push({
          text: item,
          type: 'recent search',
          icon: <Clock className="h-3.5 w-3.5 text-zinc-400" />
        });
      }
    });

    // 1. Match Categories (Sectors)
    if (categories) {
      categories.forEach(cat => {
        if (cat.name.toLowerCase().includes(query)) {
          suggestions.push({
            id: cat.id,
            text: cat.name,
            type: 'category',
            icon: <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
          });
        }
      });
    }

    // 2. Match Companies
    if (companies) {
      companies.forEach(comp => {
        if (comp.name.toLowerCase().includes(query)) {
          suggestions.push({
            id: comp.id,
            text: comp.name,
            type: 'company',
            icon: <Building2 className="h-3.5 w-3.5 text-zinc-400" />
          });
        }
      });
    }

    // 3. Match Job Titles
    if (jobsData?.content) {
      const titles = new Set();
      jobsData.content.forEach(job => {
        if (job.title.toLowerCase().includes(query)) {
          titles.add(job.title);
        }
      });
      titles.forEach(title => {
        suggestions.push({
          text: title,
          type: 'job',
          icon: <Search className="h-3.5 w-3.5 text-zinc-400" />
        });
      });
    }

    // 4. Match Locations
    if (jobsData?.content) {
      const locations = new Set();
      jobsData.content.forEach(job => {
        if (job.location && job.location.toLowerCase().includes(query)) {
          locations.add(job.location);
        }
      });
      locations.forEach(loc => {
        suggestions.push({
          text: loc,
          type: 'location',
          icon: <MapPin className="h-3.5 w-3.5 text-zinc-400" />
        });
      });
    }

    // 5. Match Tech Skills/Tags
    const commonSkills = ["Java", "React", "Node.js", "Python", "JavaScript", "SQL", "Spring Boot", "AWS", "Docker", "DevOps", "C++", "C#", "TypeScript", "Angular", "HTML", "CSS"];
    commonSkills.forEach(skill => {
      if (skill.toLowerCase().includes(query)) {
        const hasJob = jobsData?.content?.some(job => 
          job.title.toLowerCase().includes(skill.toLowerCase()) || 
          job.description.toLowerCase().includes(skill.toLowerCase())
        );
        if (hasJob) {
          suggestions.push({
            text: skill,
            type: 'skill',
            icon: <Code className="h-3.5 w-3.5 text-zinc-400" />
          });
        }
      }
    });

    return suggestions.slice(0, 8); // Limit to top 8 suggestions
  }, [search, searchHistory, categories, companies, jobsData]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search && search.trim()) {
      saveSearchToHistory(search);
    }
    onSearchRefetch();
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearchSubmit}>
        <div className="relative flex items-center bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-250 dark:border-zinc-800/80 rounded-md px-4 py-2 focus-within:ring-1 focus-within:ring-zinc-400 focus-within:border-zinc-400 shadow-sm">
          <Search className="h-4 w-4 text-zinc-400 pointer-events-none flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Search jobs, skillsets, employers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpenSuggestions(true);
            }}
            onFocus={() => setIsOpenSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setIsOpenSuggestions(false), 200);
            }}
            className="w-full bg-transparent pl-2.5 pr-2 text-zinc-900 dark:text-white font-jakarta text-sm focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500"
          />
          <Button 
            type="submit" 
            className="bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold rounded-md px-4 h-7 text-xs shadow-sm"
          >
            Search
          </Button>
        </div>
      </form>

      {isOpenSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg py-1.5 z-30 max-h-60 overflow-y-auto font-sans">
          {filteredSuggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsOpenSuggestions(false);
                if (item.type === 'category') {
                  setCategoryId(String(item.id));
                  setSearch('');
                } else if (item.type === 'location') {
                  setLocation(item.text);
                  setSearch('');
                } else {
                  setSearch(item.text);
                  setCategoryId('');
                }
              }}
              className="flex items-center justify-between w-full px-4 py-2 text-left text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition group"
            >
              <div className="flex items-center space-x-2.5">
                {item.icon}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{item.text}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {item.type}
                </span>
                {item.type === 'recent search' && (
                  <span 
                    onClick={(e) => removeSearchFromHistory(e, item.text)}
                    className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition duration-100"
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
