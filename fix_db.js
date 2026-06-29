const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_clerk_user_id_key CASCADE;`);
    await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS profiles_clerk_user_id_key;`);
    // Check if column exists before renaming to avoid errors if it was already renamed
    const res = await prisma.$queryRawUnsafe(`SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'clerk_user_id';`);
    if (res.length > 0) {
      await prisma.$executeRawUnsafe(`ALTER TABLE profiles RENAME COLUMN clerk_user_id TO auth_id;`);
      await prisma.$executeRawUnsafe(`ALTER TABLE profiles ADD CONSTRAINT profiles_auth_id_key UNIQUE (auth_id);`);
    }
    console.log("Database fixed!");
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
