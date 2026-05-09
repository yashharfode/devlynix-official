import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#030303] text-gray-400 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#C6FF00] hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#C6FF00]/10 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-[#C6FF00]" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Privacy Policy</h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-lg leading-relaxed">
          <section>
            <p className="text-xl text-white font-medium mb-4">Last Updated: May 2024</p>
            <p>
              At Devlynix, we take your privacy seriously. This policy outlines how we collect, use, and protect your information when you use our platform to level up your engineering skills.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information Collection</h2>
            <p>
              We collect information that you provide directly to us when you create an account, such as your name, email address, and GitHub profile details. This helps us personalize your "Builder Hub" experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use of Data</h2>
            <p>
              Your data is used to maintain your progress, track your "Builder Streaks," and provide you with relevant community project bounties. We do not sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Cookies & Tracking</h2>
            <p>
              We use essential cookies to keep you logged in and analyze platform performance. These are necessary for the platform to function securely and efficiently.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="pt-8 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact our team at:
            </p>
            <a 
              href="mailto:devlynix@gmail.com" 
              className="text-[#C6FF00] hover:underline font-mono"
            >
              devlynix@gmail.com
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
