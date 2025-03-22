'use client';

import React from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import Footer from '@/components/home/Footer';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gray-50">
        <SimpleHeader />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-primary-blue mb-8">Cookie Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">What Are Cookies</h2>
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work more efficiently and provide information to the website owners.
                </p>
                <p className="mt-4">
                  Cookies allow us to recognize your device and provide you with a personalized experience on our website. 
                  They also help us identify which sections of our website are most popular, where visitors go, and how much 
                  time they spend in particular areas.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">How We Use Cookies</h2>
                <p>JobCraft.in uses cookies for the following purposes:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>
                    <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. 
                    They enable core functionality such as security, network management, and account access.
                  </li>
                  <li>
                    <strong>Functionality Cookies:</strong> These cookies allow us to remember choices you make and provide 
                    enhanced, personalized features. They may be set by us or by third-party providers whose services we 
                    have added to our pages.
                  </li>
                  <li>
                    <strong>Performance and Analytics Cookies:</strong> These cookies collect information about how visitors 
                    use our website, which pages they visit, and whether they encounter any errors. We use this data to improve 
                    our website and user experience.
                  </li>
                  <li>
                    <strong>Targeting and Advertising Cookies:</strong> These cookies are used to display relevant advertising 
                    to visitors and to track the effectiveness of our advertising campaigns.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Third-Party Cookies</h2>
                <p>
                  Some cookies are placed by third parties on our website. These third parties may include analytics 
                  services, advertising networks, and social media platforms. Third-party cookies enable features such 
                  as social media sharing and analytics that enhance your experience on our website.
                </p>
                <p className="mt-4">
                  Please note that these third parties may have their own privacy policies, and we do not have control 
                  over how they use the information collected through their cookies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Managing Cookies</h2>
                <p>
                  Most web browsers allow you to control cookies through their settings. You can usually find these 
                  settings in the "Options" or "Preferences" menu of your browser. You can set your browser to refuse 
                  all cookies, to ask you each time a website tries to set a cookie, or to only accept cookies from 
                  websites you visit.
                </p>
                <p className="mt-4">
                  Please note that if you choose to block or delete cookies, some features of our website may not work 
                  properly, and your user experience may be affected.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Your Consent</h2>
                <p>
                  By using our website, you consent to the use of cookies as described in this Cookie Policy. 
                  You can withdraw your consent at any time by changing your browser settings to reject cookies.
                </p>
                <p className="mt-4">
                  When you first visit our website, you will see a cookie banner informing you about our use of cookies. 
                  You can choose to accept all cookies or manage your preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Changes to Our Cookie Policy</h2>
                <p>
                  We may update our Cookie Policy from time to time. We will notify you of any changes by posting 
                  the new Cookie Policy on this page and updating the "Last Updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-blue mb-4">Contact Us</h2>
                <p>
                  If you have any questions about our Cookie Policy, please contact us at: 
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