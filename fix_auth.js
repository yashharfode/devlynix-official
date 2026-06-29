const fs = require("fs");
const file = "src/app/(admin)/admin/hackathons/page.tsx";
let content = fs.readFileSync(file, "utf8");

content = content.replace(/const \{ userId: adminId \} = await auth\(\);/g, "const supabase = await createClient();\n  const { data: { user } } = await supabase.auth.getUser();\n  const adminId = user?.id;");

fs.writeFileSync(file, content);
console.log("Fixed auth");

