import { Star } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { FeaturedMemberForm } from "./FeaturedMemberForm";
import { FeaturedMemberList } from "./FeaturedMemberList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export default async function FeaturedMembersAdminPage() {
  const members = await prisma.featuredMember.findMany({
    orderBy: { created_at: "desc" }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }} />

      <div className="border-b border-[#111] pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Star className="w-8 h-8 text-amber-500" fill="currentColor" />
          Featured Members
        </h1>
        <p className="text-gray-400 mt-2">
          Manually add Community MVPs, Past Hackathon Winners, or any exceptional members to the public Hall of Fame.
        </p>
      </div>

      <FeaturedMemberForm />
      <FeaturedMemberList members={members} />
    </div>
  );
}
