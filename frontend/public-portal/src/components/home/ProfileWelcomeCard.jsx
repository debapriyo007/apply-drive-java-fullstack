import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Card, CardBody, Avatar, Button } from '@heroui/react';

export default function ProfileWelcomeCard({ isLoggedIn, profile, onOpenLogin }) {
  if (isLoggedIn) {
    return (
      <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm rounded-lg shadow-sm">
        <CardBody className="p-5 text-center flex flex-col items-center">
          <Avatar 
            src={profile?.profileImageUrl} 
            name={profile?.fullName} 
            className="w-16 h-16 text-lg border border-zinc-200 dark:border-zinc-800 mb-3 pointer-events-none"
          />
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate max-w-full">{profile?.fullName}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-semibold truncate max-w-full">
            {profile?.degree && profile?.branch ? `${profile.degree} - ${profile.branch}` : 'Student Candidate'}
          </p>
          
          <Button 
            as={Link} 
            to="/profile" 
            variant="bordered" 
            className="mt-4 w-full font-bold text-xs h-8 rounded-md border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            View Profile
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm rounded-lg shadow-sm">
      <CardBody className="p-5 text-center">
        <div className="h-10 w-10 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-600 dark:text-zinc-400">
          <User className="h-5 w-5" />
        </div>
        <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Candidate Access</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">Sign in to save drive alerts, build student resume logs, and access applications.</p>
        <Button 
          className="mt-4 w-full bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold text-xs h-8 rounded-md shadow"
          onPress={onOpenLogin}
        >
          Sign In
        </Button>
      </CardBody>
    </Card>
  );
}
