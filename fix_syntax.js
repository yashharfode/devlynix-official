const fs = require("fs");
const path = require("path");

function fixFile(file) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  // Fix duplicate react imports
  const reactImportRegex = /import\s+\{\s*useEffect\s*,\s*useState\s*\}\s*from\s+["']react["'];?\r?\n/g;
  let matchCount = (content.match(reactImportRegex) || []).length;
  if (matchCount > 1) {
    // Keep first one, remove others
    let count = 0;
    content = content.replace(reactImportRegex, (match) => {
      count++;
      return count === 1 ? match : "";
    });
    changed = true;
  }
  
  // Also check if there is an existing import { useState } and import { useEffect, useState }
  if (content.includes("import { useState } from 'react';") || content.includes("import { useState } from \"react\";") || content.includes("import { useState, useEffect }")) {
    if (content.match(/import\s+\{\s*useEffect\s*,\s*useState\s*\}\s*from\s+["']react["'];?/)) {
      content = content.replace(/import\s+\{\s*useEffect\s*,\s*useState\s*\}\s*from\s+["']react["'];?\r?\n/, "");
      changed = true;
    }
  }

  // Fix duplicate user variable
  if (content.includes("const { data: { user } } = await supabase.auth.getUser();") && content.includes("const user = await prisma.user.findUnique")) {
    content = content.replace(/const user = await prisma.user.findUnique/g, "const dbUser = await prisma.user.findUnique");
    content = content.replace(/user\?\.role/g, "dbUser?.role");
    content = content.replace(/user\?\.xp/g, "dbUser?.xp");
    content = content.replace(/user\?\.builder_level/g, "dbUser?.builder_level");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log("Fixed", file);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + "/" + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      walk(file);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      fixFile(file);
    }
  });
}

walk("src");

