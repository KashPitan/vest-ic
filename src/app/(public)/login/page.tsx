import { isLoggedIn } from "@/lib/validateRequest";
import { LoginForm } from "./LoginForm";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/login";

const Page = async () => {
  const loggedIn = await isLoggedIn();

  return (
    <>
      {loggedIn ? (
        <>
          <Button
            onClick={logout}
            className="text-2xl font-medium transition-colors text-pure-white hover:text-flat-gold active:text-highlight-yellow"
          >
            Log out
          </Button>
        </>
      ) : (
        <LoginForm />
      )}
    </>
  );
};

export default Page;
