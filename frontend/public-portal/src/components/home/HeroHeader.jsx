import React from 'react';

export default function HeroHeader() {
  const words = ["Full-Time Jobs", "Tech Internships", "Software Roles", "Off-Campus Drives"];
  const [wordIdx, setWordIdx] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (subIndex === words[wordIdx].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setWordIdx((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, wordIdx]);

  return (
    <div className="text-center mb-10">
      <div className="inline-block relative pb-2">
        <h1 className="text-5xl md:text-6xl font-black text-zinc-950 dark:text-zinc-50 tracking-tighter animate-fade-in">
          Apply Drive
        </h1>
        <div className="absolute left-0 right-0 bottom-[-12px] h-3.5 pointer-events-none">
          <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="w-full h-full text-zinc-900 dark:text-zinc-50 fill-none stroke-current" strokeLinecap="round">
            {/* Primary sketch stroke */}
            <path d="M4,6 Q50,1.5 96,5" strokeWidth={3} className="opacity-90 animate-draw-sketch" />
            {/* Secondary layered sketch stroke */}
            <path d="M12,9 Q55,4 88,8" strokeWidth={1.5} className="opacity-50" />
          </svg>
        </div>
      </div>
      <div className="h-8 mt-3 flex items-center justify-center">
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-semibold">
          <span>Discover off-campus </span>
          <span className="text-zinc-950 dark:text-zinc-50 font-bold border-r-2 border-zinc-950 dark:border-zinc-50 pr-1 animate-pulse">
            {words[wordIdx].substring(0, subIndex)}
          </span>
        </p>
      </div>
      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg mx-auto leading-relaxed font-normal">
        Clean, minimalist off-campus career drive compiler and student internship tracker.
      </p>
    </div>
  );
}
