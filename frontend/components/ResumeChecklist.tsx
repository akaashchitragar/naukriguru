'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'format' | 'content' | 'language' | 'customization';
}

export default function ResumeChecklist() {
  const [user] = useAuthState(auth);
  const [activeCategory, setActiveCategory] = useState<'all' | 'format' | 'content' | 'language' | 'customization'>('all');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Default checklist items wrapped in useMemo to avoid recreating on every render
  const defaultChecklist = useMemo<ChecklistItem[]>(() => [
    // Format
    { id: 'format-1', text: 'Use a clean, professional template', completed: false, category: 'format' },
    { id: 'format-2', text: 'Keep resume to 1-2 pages', completed: false, category: 'format' },
    { id: 'format-3', text: 'Use consistent formatting (fonts, spacing, etc.)', completed: false, category: 'format' },
    { id: 'format-4', text: 'Include clear section headings', completed: false, category: 'format' },
    { id: 'format-5', text: 'Ensure proper alignment and margins', completed: false, category: 'format' },
    
    // Content
    { id: 'content-1', text: 'Include contact information at the top', completed: false, category: 'content' },
    { id: 'content-2', text: 'Add a professional summary/objective', completed: false, category: 'content' },
    { id: 'content-3', text: 'List relevant work experience with bullet points', completed: false, category: 'content' },
    { id: 'content-4', text: 'Include education details', completed: false, category: 'content' },
    { id: 'content-5', text: 'Add relevant skills section', completed: false, category: 'content' },
    { id: 'content-6', text: 'Include certifications and achievements', completed: false, category: 'content' },
    
    // Language
    { id: 'language-1', text: 'Use action verbs to start bullet points', completed: false, category: 'language' },
    { id: 'language-2', text: 'Quantify achievements with numbers when possible', completed: false, category: 'language' },
    { id: 'language-3', text: 'Check for spelling and grammar errors', completed: false, category: 'language' },
    { id: 'language-4', text: 'Avoid first-person pronouns (I, me, my)', completed: false, category: 'language' },
    { id: 'language-5', text: 'Use industry-specific keywords', completed: false, category: 'language' },
    
    // Customization
    { id: 'customization-1', text: 'Tailor resume to specific job description', completed: false, category: 'customization' },
    { id: 'customization-2', text: 'Highlight most relevant skills for the position', completed: false, category: 'customization' },
    { id: 'customization-3', text: 'Adjust professional summary for each application', completed: false, category: 'customization' },
    { id: 'customization-4', text: 'Research company values and reflect them', completed: false, category: 'customization' }
  ], []);

  // Load user's checklist or create a new one
  useEffect(() => {
    const loadChecklist = async () => {
      if (!user) {
        setChecklist(defaultChecklist);
        setLoading(false);
        return;
      }

      try {
        const checklistRef = doc(db, 'users', user.uid, 'resume_tools', 'checklist');
        const checklistDoc = await getDoc(checklistRef);

        if (checklistDoc.exists()) {
          const data = checklistDoc.data();
          setChecklist(data.items);
        } else {
          // Create a new checklist for the user
          await setDoc(checklistRef, { items: defaultChecklist });
          setChecklist(defaultChecklist);
        }
      } catch (error) {
        console.error('Error loading checklist:', error);
        setChecklist(defaultChecklist);
      } finally {
        setLoading(false);
      }
    };

    loadChecklist();
  }, [user, defaultChecklist]);

  // Calculate progress whenever checklist changes
  useEffect(() => {
    if (checklist.length > 0) {
      const completedCount = checklist.filter(item => item.completed).length;
      const newProgress = Math.round((completedCount / checklist.length) * 100);
      setProgress(newProgress);
    }
  }, [checklist]);

  // Toggle item completion
  const toggleItem = async (id: string) => {
    const updatedChecklist = checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    
    setChecklist(updatedChecklist);
    
    if (user) {
      try {
        const checklistRef = doc(db, 'users', user.uid, 'resume_tools', 'checklist');
        await updateDoc(checklistRef, { items: updatedChecklist });
      } catch (error) {
        console.error('Error updating checklist:', error);
      }
    }
  };

  // Filter checklist by category
  const filteredChecklist = activeCategory === 'all' 
    ? checklist 
    : checklist.filter(item => item.category === activeCategory);

  // Category labels and colors
  const categories = [
    { id: 'all', label: 'All Items', color: 'deep-blue' },
    { id: 'format', label: 'Format', color: 'purple' },
    { id: 'content', label: 'Content', color: 'green' },
    { id: 'language', label: 'Language', color: 'amber' },
    { id: 'customization', label: 'Customization', color: 'blue' }
  ];

  // Get color class based on category
  const getCategoryColorClass = (category: string) => {
    switch(category) {
      case 'format': return 'text-purple-600';
      case 'content': return 'text-green-600';
      case 'language': return 'text-amber-600';
      case 'customization': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  // Get background color class based on category
  const getCategoryBgClass = (category: string) => {
    switch(category) {
      case 'format': return 'bg-purple-50 border-purple-100';
      case 'content': return 'bg-green-50 border-green-100';
      case 'language': return 'bg-amber-50 border-amber-100';
      case 'customization': return 'bg-blue-50 border-blue-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-deep-blue">Resume Improvement Checklist</h3>
        
        {/* Progress Bar */}
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
            <div 
              className="bg-accent-orange h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">{progress}% Complete</span>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id as any)}
            className={`px-4 py-2 font-medium text-sm transition-all ${
              activeCategory === category.id
                ? `text-${category.color} border-b-2 border-${category.color}`
                : 'text-gray-500 hover:text-deep-blue'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      {/* Checklist Items */}
      <div className="space-y-3">
        {filteredChecklist.map(item => (
          <div 
            key={item.id}
            className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
              getCategoryBgClass(item.category)
            }`}
          >
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-accent-orange focus:ring-accent-orange"
              />
              <div className="ml-3">
                <span className={`font-medium ${item.completed ? 'line-through text-gray-400' : getCategoryColorClass(item.category)}`}>
                  {item.text}
                </span>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
              </div>
            </label>
          </div>
        ))}
      </div>
      
      {/* Tips Section */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-lg font-semibold text-deep-blue mb-2">Pro Tips</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Complete this checklist before submitting your resume to increase your chances of success</li>
          <li>Focus on the categories where you have the most unchecked items first</li>
          <li>Your progress is saved automatically when you&apos;re logged in</li>
          <li>Revisit this checklist regularly to ensure your resume stays up-to-date</li>
          <li>Highlight specific programming languages and frameworks with years of experience</li>
          <li>Quantify your achievements with metrics (e.g., &quot;Reduced page load time by 40%&quot;)</li>
          <li>Include links to your GitHub profile or portfolio</li>
          <li>Mention specific methodologies you&apos;re familiar with (Agile, Scrum, etc.)</li>
          <li>List certifications relevant to the role (AWS, Azure, etc.)</li>
        </ul>
      </div>
    </div>
  );
} 