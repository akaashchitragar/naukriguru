'use client';

import React from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import Footer from '@/components/home/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gray-50">
        <SimpleHeader />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-primary-blue mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Introduction</h2>
                <p>
                  At JobCraft.in, we respect your privacy and are committed to protecting your personal data. 
                  This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Information We Collect</h2>
                <p>We collect the following types of information:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>
                    <strong>Personal Information:</strong> This includes your name, email address, and other contact details you provide when registering or using our services.
                  </li>
                  <li>
                    <strong>Resume Data:</strong> Information contained in your resume, including employment history, educational background, and skills.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, features used, and time spent.
                  </li>
                  <li>
                    <strong>Device Information:</strong> Data about your device, including IP address, browser type, and operating system.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">How We Use Your Information</h2>
                <p>We use your information for the following purposes:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>To provide and improve our career services and resume analysis</li>
                  <li>To personalize your experience on our website</li>
                  <li>To communicate with you about your account or our services</li>
                  <li>To analyze usage patterns and improve our website</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal data from unauthorized access, 
                  alteration, disclosure, or destruction. However, no method of transmission over the Internet or method 
                  of electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Your Rights</h2>
                <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>The right to access your personal data</li>
                  <li>The right to correct inaccurate personal data</li>
                  <li>The right to request deletion of your personal data</li>
                  <li>The right to restrict or object to processing of your personal data</li>
                  <li>The right to data portability</li>
                  <li>The right to withdraw consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Changes to This Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
                  new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at: 
                  <a href="mailto:privacy@jobcraft.in" className="text-primary-blue hover:text-primary-yellow ml-1">
                    privacy@jobcraft.in
                  </a>
                </p>
              </section>

              <div className="mt-12 text-gray-600">
                <p>Last Updated: June 1, 2023</p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
} 