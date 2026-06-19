import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ShieldAlert, Terminal, Activity, Database } from 'lucide-react';
import { Modal, ModalContent, ModalBody, Input, Button, Card, CardBody } from '@heroui/react';
import { useAdminLogin } from '../hooks/useAdmin';

const ApplyDriveLogo = ({ className = "h-7 w-7" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} text-zinc-50`}>
    <rect width="100" height="100" rx="24" fill="currentColor" />
    <path d="M50 22L26 70H38L50 44L62 70H74L50 22Z" fill="#09090b" />
    <rect x="30" y="76" width="40" height="6" rx="3" fill="#09090b" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const loginMutation = useAdminLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    loginMutation.mutate({ email, password }, {
      onSuccess: (data) => {
        const { role, fullName } = data;
        localStorage.setItem('adminUser', JSON.stringify({ email, fullName, role }));

        navigate('/');
        window.location.reload();
      },
      onError: (err) => {
        setError(err.response?.data?.message || 'Access Denied: Invalid Admin Credentials');
      }
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-zinc-950 flex flex-col justify-between font-sans">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-zinc-500/5 rounded-full blur-3xl" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      {/* Content Mockup in Background */}
      <div className="max-w-7xl mx-auto px-6 w-full pt-16 pb-8 flex-grow flex flex-col justify-center relative z-0 select-none pointer-events-none opacity-20 blur-[1px]">
        <div className="mb-12 flex items-center space-x-2.5">
          <ApplyDriveLogo className="h-8 w-8 pointer-events-none" />
          <span className="font-bold text-xl text-white tracking-tight">ApplyDrive Admin</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Database Status', val: 'Online', icon: Database, color: 'text-zinc-200' },
            { label: 'Jobs Pipeline', val: 'Idle', icon: Terminal, color: 'text-zinc-300' },
            { label: 'System Health', val: '99.9%', icon: Activity, color: 'text-zinc-200' },
          ].map((item, idx) => (
            <Card key={idx} className="border border-zinc-800 bg-zinc-900/50">
              <CardBody className="p-6 flex flex-row items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">{item.label}</p>
                  <h3 className={`text-2xl font-bold mt-1 ${item.color}`}>{item.val}</h3>
                </div>
                <item.icon className="h-8 w-8 text-zinc-500" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Branding Footer */}
      <div className="py-8 text-center text-[10px] text-zinc-600 relative z-0 tracking-widest uppercase font-semibold">
        ApplyDrive Admin Aggregator Engine v2.0
      </div>

      {/* Automatic Premium Sign-In Modal */}
      <Modal 
        isOpen={true} 
        hideCloseButton={true}
        isDismissable={false}
        backdrop="blur" 
        placement="center"
        className="border border-zinc-800 bg-zinc-950 text-zinc-100 font-sans"
      >
        <ModalContent className="max-w-sm rounded-lg border border-zinc-800">
          <ModalBody className="p-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <ApplyDriveLogo className="h-12 w-12" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Admin Console</h2>
              <p className="text-zinc-400 text-xs mt-1">Sign in to manage the Job Aggregator system</p>
            </div>

            {error && (
              <div className="mb-4 bg-red-950/20 border border-red-900 text-red-400 p-3 rounded-md flex items-center space-x-2 text-xs">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Admin Email <span className="text-red-500">*</span>
                </label>
                <Input
                  isRequired
                  type="email"
                  placeholder="admin@portal.com"
                  value={email}
                  onValueChange={setEmail}
                  startContent={<Mail className="h-3.5 w-3.5 text-zinc-500" />}
                  className="dark text-white"
                  classNames={{
                    input: "text-xs",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  isRequired
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onValueChange={setPassword}
                  startContent={<Lock className="h-3.5 w-3.5 text-zinc-500" />}
                  className="dark text-white"
                  classNames={{
                    input: "text-xs",
                  }}
                />
              </div>

              <Button
                type="submit"
                isLoading={loginMutation.isPending}
                className="w-full bg-zinc-50 hover:bg-zinc-105 text-zinc-950 font-bold py-2 h-9 rounded-md shadow transition text-xs mt-6"
              >
                Verify & Sign In
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
