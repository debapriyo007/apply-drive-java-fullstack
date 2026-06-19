import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardBody, Checkbox, Input } from '@heroui/react';

export default function FiltersPanel({
  jobType,
  setJobType,
  location,
  setLocation,
  categoryId,
  setCategoryId,
  categories
}) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm rounded-lg shadow-sm">
      <CardBody className="p-5 space-y-5">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">Filters</h3>
        </div>

        {/* Job Setup Filters */}
        <div className="space-y-2.5">
          <label className="block text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Job Setup</label>
          <div className="flex flex-col gap-2">
            <Checkbox 
              isSelected={jobType === 'REMOTE'} 
              onValueChange={(selected) => setJobType(selected ? 'REMOTE' : '')}
              classNames={{ label: "text-sm text-zinc-650 dark:text-zinc-300 font-semibold" }}
              size="sm"
            >
              Remote
            </Checkbox>
            <Checkbox 
              isSelected={jobType === 'HYBRID'} 
              onValueChange={(selected) => setJobType(selected ? 'HYBRID' : '')}
              classNames={{ label: "text-sm text-zinc-650 dark:text-zinc-300 font-semibold" }}
              size="sm"
            >
              Hybrid
            </Checkbox>
            <Checkbox 
              isSelected={jobType === 'ONSITE'} 
              onValueChange={(selected) => setJobType(selected ? 'ONSITE' : '')}
              classNames={{ label: "text-sm text-zinc-650 dark:text-zinc-300 font-semibold" }}
              size="sm"
            >
              Onsite
            </Checkbox>
          </div>
        </div>

        {/* Specific Location Input */}
        <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <label className="block text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Location</label>
          <Input 
            size="sm"
            placeholder="e.g. Bangalore" 
            value={location}
            onValueChange={setLocation}
            startContent={<MapPin className="h-3.5 w-3.5 text-zinc-400" />}
            classNames={{
              input: "text-xs font-semibold text-zinc-700 dark:text-zinc-200",
              inputWrapper: "border border-zinc-200 dark:border-zinc-850 rounded bg-zinc-50/30 dark:bg-zinc-950/20 h-8 px-3 shadow-none focus-within:border-zinc-400"
            }}
          />
        </div>

        {/* Category Filters */}
        <div className="space-y-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <label className="block text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Sectors</label>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {categories?.map((cat) => (
              <Checkbox 
                key={cat.id}
                isSelected={Number(categoryId) === cat.id} 
                onValueChange={(selected) => setCategoryId(selected ? String(cat.id) : '')}
                classNames={{ label: "text-sm text-zinc-650 dark:text-zinc-300 font-semibold" }}
                size="sm"
              >
                {cat.name}
              </Checkbox>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
