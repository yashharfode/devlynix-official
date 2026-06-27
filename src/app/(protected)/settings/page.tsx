import { UserProfile } from "@clerk/nextjs";


export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Account Settings</h1>
        <p className="text-gray-400">Manage your profile, security, and account preferences.</p>
      </div>

      <div className="bg-[#0A0A0A] border border-[#111] rounded-3xl p-8 flex justify-center">
        <UserProfile routing="hash" />
      </div>
    </div>
  );
}
