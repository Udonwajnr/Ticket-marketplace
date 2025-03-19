'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Ghost } from 'lucide-react';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-lg"
      >
        <Ghost className="w-20 h-20 text-gray-400 mx-auto" />
        <h1 className="text-4xl font-bold text-gray-800 mt-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mt-2">Oops! The page you are looking for doesn’t exist.</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Go Back Home
        </Button>
      </motion.div>
    </div>
  );
}
