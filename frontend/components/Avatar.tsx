'use client';

import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

interface AvatarProps {
  user: User | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ user, size = 'md', className = '' }: AvatarProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) return;

    // Check if user has a photoURL from Google auth
    if (user.photoURL) {
      setPhotoUrl(user.photoURL);
      return;
    }

    // Check if user has a Gmail account but no photo
    const email = user.email || '';
    const isGmail = email.toLowerCase().endsWith('@gmail.com');
    
    if (isGmail && !user.photoURL) {
      // Create Gravatar URL for Gmail users
      const hash = btoa(email.toLowerCase().trim());
      const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=404`;
      
      // Check if the Gravatar image exists
      fetch(gravatarUrl, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            setPhotoUrl(gravatarUrl);
          }
        })
        .catch(() => {
          // If error, fall back to initials
          setPhotoUrl(null);
        });
    }
  }, [user]);

  // Get the initials for the fallback display
  const getInitials = (): string => {
    if (!user) return '?';
    
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return '?';
  };

  // Determine size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-2xl'
  };

  return (
    <div 
      className={`rounded-full flex items-center justify-center font-medium ${sizeClasses[size]} ${className}`}
    >
      {photoUrl ? (
        <img 
          src={photoUrl} 
          alt={user?.displayName || user?.email || 'User'} 
          className="w-full h-full rounded-full object-cover"
          onError={() => setPhotoUrl(null)} // In case the image fails to load
        />
      ) : (
        <div className="w-full h-full bg-deep-blue rounded-full flex items-center justify-center text-white">
          {getInitials()}
        </div>
      )}
    </div>
  );
} 