const fs = require("fs");
let code = fs.readFileSync("src/app/onboarding/page.tsx", "utf8");

code = code.replace("export default function OnboardingPage", "export default function EditProfilePage");
code = code.replace("Initialize Profile", "Edit Profile");
code = code.replace("Configure your builder identity to access the network.", "Update your profile details.");
code = code.replace("router.push('/hub')", "router.push('/profile')");
code = code.replace("Complete Setup", "Save Changes");

// Remove the XP reward message
code = code.replace(/<div className="flex items-center gap-3 bg-.*Completing your profile earns you.*<\/div>/s, "");

fs.mkdirSync("src/app/(protected)/profile/edit", { recursive: true });
fs.writeFileSync("src/app/(protected)/profile/edit/page.tsx", code);
console.log("Done");

