import { prisma } from "@/lib/prisma";
import { Briefcase, ExternalLink, GitBranch } from "lucide-react";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await prisma.projectSubmission.findMany({
    orderBy: { created_at: "desc" },
    include: { user: true }
  });

  return (
    <div className="max-w-6xl mx-auto p-6 pb-24">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Community Projects</h1>
        <p className="text-gray-400">Discover what builders are shipping across all hackathons.</p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-[#0A0A0A] border border-[#111] rounded-2xl p-12 text-center text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No projects have been submitted yet. Be the first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-[#0A0A0A] border border-[#111] rounded-2xl p-6 hover:border-[#C6FF00]/50 transition-colors group flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C6FF00] transition-colors">{project.title}</h3>
              <p className="text-sm text-gray-400 mb-4 flex-1 line-clamp-3">{project.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-6 pt-4 border-t border-[#111]">
                <span className="truncate flex-1">By @{project.user?.username || 'Unknown'}</span>
              </div>
              
              <div className="flex gap-2 mt-auto">
                {project.demo_url && (
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#C6FF00]/10 hover:bg-[#C6FF00]/20 text-[#C6FF00] py-2 rounded-xl text-sm font-medium transition-colors">
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#111] hover:bg-[#222] text-white py-2 rounded-xl text-sm font-medium transition-colors">
                    <GitBranch className="w-4 h-4" /> Source
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
