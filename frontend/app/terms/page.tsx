'use client';

import React from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import Footer from '@/components/home/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gray-50">
        <SimpleHeader />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-primary-blue mb-8">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Welcome to JobCraft.in</h2>
                <p>
                  These Terms of Service govern your use of our website and services. By accessing or using 
                  JobCraft.in, you agree to be bound by these Terms. If you disagree with any part of these 
                  Terms, you may not access our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Use of Our Services</h2>
                <p>By using our services, you agree to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Provide accurate and complete information when creating an account</li>
                  <li>Maintain the security and confidentiality of your login credentials</li>
                  <li>Use our services only for lawful purposes</li>
                  <li>Not attempt to interfere with or disrupt our services</li>
                  <li>Not use our services to distribute spam or malicious software</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">User Accounts</h2>
                <p>
                  When you create an account with us, you are responsible for maintaining the confidentiality 
                  of your account information, including your password. You are responsible for all activities 
                  that occur under your account.
                </p>
                <p className="mt-4">
                  We reserve the right to terminate or suspend your account at any time, without prior notice 
                  or liability, for any reason, including if you breach these Terms of Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Intellectual Property</h2>
                <p>
                  Our website and its original content, features, and functionality are owned by JobCraft.in 
                  and are protected by international copyright, trademark, patent, trade secret, and other 
                  intellectual property laws.
                </p>
                <p className="mt-4">
                  You may not modify, reproduce, distribute, create derivative works of, publicly display, 
                  publicly perform, republish, download, store, or transmit any materials from our website 
                  without our prior written consent.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Limitation of Liability</h2>
                <p>
                  In no event shall JobCraft.in, its directors, employees, partners, agents, suppliers, or 
                  affiliates be liable for any indirect, incidental, special, consequential or punitive damages, 
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                  resulting from your access to or use of or inability to access or use the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India, without 
                  regard to its conflict of law provisions.
                </p>
                <p className="mt-4">
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver 
                  of those rights. If any provision of these Terms is held to be invalid or unenforceable by a 
                  court, the remaining provisions of these Terms will remain in effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Changes to Terms</h2>
                <p>
                  We reserve the right to modify or replace these Terms at any time. We will provide 
                  notification of significant changes to the Terms by posting a notice on our website. 
                  Your continued use of our service after any changes to the Terms constitutes your 
                  acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at: 
                  <a href="mailto:legal@jobcraft.in" className="text-primary-blue hover:text-primary-yellow ml-1">
                    legal@jobcraft.in
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