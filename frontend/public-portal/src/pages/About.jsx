import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Bookmark, Code, ShieldCheck, Sparkles, Building2, BookOpen } from 'lucide-react';
import { Card, CardBody, Button } from '@heroui/react';
import { Link } from 'react-router-dom';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-200 font-jakarta">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {/* Header Hero Section */}
        <motion.div variants={itemVariants} className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
            <span>Platform Overview</span>
          </div>
          <div className="h-1.5" />
          <div className="inline-block relative pb-2.5">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent pb-1">
              About ApplyDrive
            </h1>
            <div className="absolute left-0 right-0 bottom-[-8px] h-3 pointer-events-none">
              <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="w-full h-full text-zinc-900 dark:text-zinc-50 fill-none stroke-current" strokeLinecap="round">
                {/* Primary sketch stroke */}
                <path d="M4,6 Q50,1.5 96,5" strokeWidth={3} className="opacity-90 animate-draw-sketch" />
                {/* Secondary layered sketch stroke */}
                <path d="M12,9 Q55,4 88,8" strokeWidth={1.5} className="opacity-50" />
              </svg>
            </div>
          </div>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal pt-2">
            ApplyDrive is a clean, minimalist off-campus career drive compiler and student internship aggregator built for modern developers and candidates.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: Briefcase,
              title: "Clean Aggregation",
              desc: "Quickly discover and compile verified tech internships and full-time off-campus drives directly from employers with no unnecessary ads or tracking."
            },
            {
              icon: Users,
              title: "Candidate Centric",
              desc: "Manage candidate profiles, upload logos, configure degrees/specializations, and track applications with ease."
            },
            {
              icon: Bookmark,
              title: "Smart Bookmarking",
              desc: "Save interesting career drive alerts to your personal dashboard and receive clean summaries of deadlines and criteria."
            },
            {
              icon: ShieldCheck,
              title: "Premium Security",
              desc: "Robust admin panel capabilities to manage listings, curate employer lists, activate student accounts, and secure private records."
            }
          ].map((feat, idx) => (
            <Card key={idx} className="border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <CardBody className="p-6 flex flex-row gap-4 items-start">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100">
                  <feat.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">{feat.desc}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </motion.div>

        {/* Tech Stack Banner */}
        <motion.div variants={itemVariants} className="border border-zinc-200 dark:border-zinc-800/80 rounded-lg bg-zinc-50/30 dark:bg-zinc-900/30 backdrop-blur-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Built with Modern Tech</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Leveraging high-performance, developer-first frameworks.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {[
              { label: "Frontend", val: "React & HeroUI" },
              { label: "Styling", val: "Tailwind CSS" },
              { label: "Backend", val: "Spring Boot" },
              { label: "Database", val: "PostgreSQL & JPA" }
            ].map((tech, idx) => (
              <div key={idx} className="text-center p-4 rounded-md border border-zinc-200/80 dark:border-zinc-850 bg-white/70 dark:bg-zinc-950/40">
                <span className="block text-[8px] uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500">{tech.label}</span>
                <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1">{tech.val}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="text-center pt-4">
          <Button
            as={Link}
            to="/"
            className="bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold px-6 h-9 rounded-md text-xs shadow-sm"
          >
            Explore Job Drives
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
