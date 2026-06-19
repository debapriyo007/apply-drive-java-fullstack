import React from 'react';
import { Card, CardBody } from '@heroui/react';

export default function EcosystemStatsCard({ totalDrives, totalCompanies, totalSectors }) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm rounded-lg shadow-sm">
      <CardBody className="p-5">
        <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider mb-3.5">Ecosystem Status</h4>
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: totalDrives, label: 'Drives' },
            { val: totalCompanies, label: 'Companies' },
            { val: totalSectors, label: 'Sectors' }
          ].map((stat, idx) => (
            <div key={idx} className="py-2.5 px-1 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-md text-center border border-zinc-150 dark:border-zinc-900">
              <span className="block font-bold text-sm text-zinc-900 dark:text-white">{stat.val}</span>
              <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-bold uppercase tracking-tight">{stat.label}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
