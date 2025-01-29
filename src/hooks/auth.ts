import { usePathname, useRouter } from "next/navigation";
import { useToast } from "./use-toast";
import generateOAuthData, {
  getLoginUrl,
  getLogoutUrl,
} from "@/app/wix-api/auth";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import Cookies from "js-cookie";
import { WIX_OAUTH_DATA_COOKIE } from "@/lib/constants";

export default function useAuth() {
  const pathname = usePathname();
  const router = useRouter();

  const { toast } = useToast();

  async function login() {
    try {
      const oAuthData = await generateOAuthData(wixBrowserClient, pathname);

      Cookies.set(WIX_OAUTH_DATA_COOKIE, JSON.stringify(oAuthData), {
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 60 * 10 * 1000), // 10 minut
      });

      const redirectUrl = await getLoginUrl(wixBrowserClient, oAuthData);

      router.push(redirectUrl);
    } catch (error) {
      console.log(error);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Přihlášení se nezdařilo, prosím opakujte akci.",
      });
    }
  }

  async function logout() {
    try {
      const logoutUrl = await getLogoutUrl(wixBrowserClient);

      Cookies.remove(WIX_OAUTH_DATA_COOKIE);

      router.push(logoutUrl);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Odhlášení se nezdařilo, prosím opakujte akci.",
      });
    }
  }

  return { login, logout };
}
