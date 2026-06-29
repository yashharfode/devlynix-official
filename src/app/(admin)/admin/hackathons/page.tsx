import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Terminal, Star, CheckCircle, XCircle } from "lucide-react";
import { revalidatePath } from "next/cache";
import { StatusSelect } from "./StatusSelect";
// Server Actions
async function toggleFeatured(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminId = user?.id;
  if (!adminId) throw new Error("Unauthorized");
  
  const admin = await prisma.user.findUnique({ where: { auth_id: adminId } });
  if (admin?.role !== "ADMIN") throw new Error("Forbidden");

  const hackathonId = formData.get("hackathonId") as string;
  const currentFeatured = formData.get("currentFeatured") === "true";

  await prisma.hackathon.update({
    where: { id: hackathonId },
    data: { is_featured: !currentFeatured }
  });

  revalidatePath("/admin/hackathons");
}

async function updateStatus(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminId = user?.id;
  if (!adminId) throw new Error("Unauthorized");
  
  const admin = await prisma.user.findUnique({ where: { auth_id: adminId } });
  if (admin?.role !== "ADMIN") throw new Error("Forbidden");

  const hackathonId = formData.get("hackathonId") as string;
  const newStatus = formData.get("status") as string;

  await prisma.hackathon.update({
    where: { id: hackathonId },
    data: { approval_status: newStatus }
  });

  revalidatePath("/admin/hackathons");
}

export default async function AdminHackathonsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) redirect("/sign-in");

  const currentUser = await prisma.user.findUnique({ where: { auth_id: userId } });
  if (currentUser?.role !== "ADMIN") redirect("/hub");

  const hackathons = await prisma.hackathon.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 border-b border-[#111] pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Hackathon Management</h1>
        <p className="text-gray-500 text-sm mt-1">Approve organizer hackathons and manage featured events.</p>
      </div>

      <div className="bg-[#0A0A0A] border border-[#111] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#050505] text-xs uppercase font-mono text-gray-600 border-b border-[#111]">
              <tr>
                <th className="px-6 py-4">Hackathon</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111]">
              {hackathons.map((h) => (
                <tr key={h.id} className="hover:bg-[#111]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-base">{h.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{h.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono">
                    <div>Start: {new Date(h.start_date).toLocaleDateString()}</div>
                    <div>End: {new Date(h.end_date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider ${
                      h.approval_status === 'APPROVED' ? 'bg-emerald-900/20 text-emerald-500' :
                      h.approval_status === 'PENDING' ? 'bg-amber-900/20 text-amber-500' :
                      'bg-red-900/20 text-red-500'
                    }`}>
                      {h.approval_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <form action={toggleFeatured}>
                      <input type="hidden" name="hackathonId" value={h.id} />
                      <input type="hidden" name="currentFeatured" value={String(h.is_featured)} />
                      <button type="submit" className={`p-1.5 rounded-lg transition-colors ${
                        h.is_featured ? 'text-emerald-400 bg-emerald-900/20 hover:bg-emerald-900/40' : 'text-gray-600 hover:bg-[#111] hover:text-gray-400'
                      }`}>
                        <Star className={`w-4 h-4 ${h.is_featured ? 'fill-emerald-400' : ''}`} />
                      </button>
                    </form>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <StatusSelect 
                      hackathonId={h.id} 
                      currentStatus={h.approval_status || ""} 
                      action={updateStatus} 
                    />
                  </td>
                </tr>
              ))}
              
              {hackathons.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Terminal className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    No hackathons found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
