import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

export default function TermsOfService() {
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
            <Scale className="w-8 h-8 text-[#C6FF00]" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Terms of Service</h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-lg leading-relaxed">
          <section>
            <p className="text-xl text-white font-medium mb-4">Agreement to Terms</p>
            <p>
              By accessing Devlynix, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. User Behavior</h2>
            <p>
              Builders are expected to maintain professional conduct. Any form of harassment, spamming, or attempts to exploit the platform's XP system will result in an immediate ban.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Community Guidelines</h2>
            <p>
              Devlynix is a place for execution. We encourage sharing knowledge and collaborating on community projects. Plagiarism of project solutions is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Intellectual Property</h2>
            <p>
              The platform design, logos, and specific curriculum content are the intellectual property of Devlynix. Users retain ownership of the code they write during projects.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>
            <p>
              Devlynix is provided "as is". We are not responsible for any technical issues or data loss that may occur while using the platform.
            </p>
          </section>

          <section className="pt-8 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
            <p>
              For legal inquiries or issues, please contact us at:
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
