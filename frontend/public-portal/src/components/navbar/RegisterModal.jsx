import React from 'react';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import { Modal, ModalContent, ModalBody, Input, Button } from '@heroui/react';
import api from '../../services/api';

export default function RegisterModal({ isOpen, onClose, switchToLogin }) {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/register', { fullName, email, password });
      setRegSuccess(true);
      setFullName('');
      setEmail('');
      setPassword('');
      
      setTimeout(() => {
        setRegSuccess(false);
        switchToLogin();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper because we named states slightly differently
  const setRegSuccess = (val) => setSuccess(val);
  const regSuccess = success;

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" placement="center" className="dark:text-zinc-100 font-sans">
      <ModalContent className="dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 max-w-sm rounded-lg">
        <ModalBody className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Sign Up</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">Join students discovering top job drives</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-650 dark:text-red-405 p-3 rounded-md flex items-center space-x-2 text-xs">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {regSuccess && (
            <div className="mb-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-green-600 dark:text-green-400 p-3 rounded-md flex items-center space-x-2 text-xs">
              <span>Account created! Opening login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                isRequired
                type="text"
                placeholder="Debapriyo Das"
                value={fullName}
                onValueChange={setFullName}
                startContent={<User className="h-3.5 w-3.5 text-zinc-400" />}
                className="dark:text-white"
                classNames={{
                  input: "text-xs",
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                isRequired
                type="email"
                placeholder="you@college.edu"
                value={email}
                onValueChange={setEmail}
                startContent={<Mail className="h-3.5 w-3.5 text-zinc-400" />}
                className="dark:text-white"
                classNames={{
                  input: "text-xs",
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                isRequired
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onValueChange={setPassword}
                startContent={<Lock className="h-3.5 w-3.5 text-zinc-400" />}
                className="dark:text-white"
                classNames={{
                  input: "text-xs",
                }}
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              isDisabled={regSuccess}
              className="w-full bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-semibold py-2 h-9 rounded-md transition text-xs shadow mt-2"
            >
              Sign Up
            </Button>
          </form>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-4">
            Already have an account?{' '}
            <button onClick={switchToLogin} className="text-zinc-900 dark:text-zinc-50 hover:underline font-semibold">
              Login
            </button>
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
