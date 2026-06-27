import { prisma } from "@/lib/prisma";
import { Briefcase, ExternalLink, GitBranch, Calendar } from "lucide-react";
import { WinnerToggle } from "./WinnerToggle";
import { ProjectDisplayForm } from "./ProjectDisplayForm";
import { formatDistanceToNow } from "date-fns";

export default async function AdminProjectsPage() {
  const projects = await prisma.projectSubmission.findMany({
    orderBy: { created_at: "desc" },
    include: { user: true }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Project Submissions</h1>
          <p className="text-gray-400 mt-1">Manage all projects submitted to hackathons and select winners.</p>
        </div>
      </div>

      <div className="grid gap-4 mt-8">
        {projects.length === 0 ? (
          <div className="text-center p-12 bg-[#0A0A0A] border border-[#111] rounded-2xl">
            <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
            <p className="text-gray-500">There are no project submissions yet.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-[#0A0A0A] border border-[#111] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#222] transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  {project.is_winner && (
                    <span className="px-2 py-1 text-xs font-bold bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/30">WINNER</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 max-w-3xl">{project.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500">
                  <span className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-[#111] flex items-center justify-center text-[10px] text-white">
                      {project.user?.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    @{project.user?.username || 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                  </span>
                  <div className="flex gap-3">
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <GitBranch className="w-3 h-3" /> Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4 border-t md:border-t-0 md:border-l border-[#111] pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                <WinnerToggle projectId={project.id} isWinner={project.is_winner} />
                <ProjectDisplayForm projectId={project.id} initialThumbnail={project.thumbnail_url} initialCategory={project.category} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
