const fs = require("fs");
const file = "src/app/onboarding/page.tsx";
let content = fs.readFileSync(file, "utf8");

content = content.replace(/const \{ isLoaded, isSignedIn, user \} = useUser\(\);/, `const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        setIsSignedIn(true);
      }
      setIsLoaded(true);
    });
  }, []);`);

content = content.replace(/user\?\.fullName/g, "user?.user_metadata?.full_name");
content = content.replace(/user\?\.username/g, "user?.user_metadata?.user_name");
content = content.replace(/user\.primaryEmailAddress\?\.emailAddress/g, "user.email");

fs.writeFileSync(file, content);
console.log("Fixed onboarding page!");

