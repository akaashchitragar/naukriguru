'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/Toast';
import UserProfile from '@/components/UserProfile';

export default function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-deep-blue">My Profile</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
        <div className="p-4 md:p-6">
          <UserProfile />
        </div>
      </div>
    </div>
  );
} 