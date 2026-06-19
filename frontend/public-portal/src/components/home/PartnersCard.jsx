import React from 'react';
import { Building2 } from 'lucide-react';
import { Card, CardBody, Chip } from '@heroui/react';

export default function PartnersCard({ companies, setSearch }) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm rounded-lg shadow-sm">
      <CardBody className="p-5">
        <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">Partner Companies</h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-3 leading-relaxed font-normal">
          Hiring partners sponsoring off-campus drives. Click any logo to view matches.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {companies?.slice(0, 15).map((comp) => (
            <Chip 
              key={comp.id} 
              size="sm" 
              variant="bordered" 
              className="text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer border-zinc-200 dark:border-zinc-800 rounded px-2 h-7 text-zinc-600 dark:text-zinc-300"
              onPress={() => setSearch(comp.name)}
              startContent={<Building2 className="h-3 w-3 text-zinc-400" />}
            >
              {comp.name}
            </Chip>
          )) || <p className="text-xs text-zinc-400">No partner companies registered.</p>}
        </div>
      </CardBody>
    </Card>
  );
}
