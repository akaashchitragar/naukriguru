'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/Toast';
import UserProfile from '@/components/UserProfile';

export default function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  return <UserProfile />;
} 