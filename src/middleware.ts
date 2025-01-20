import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { NextRequest, NextResponse } from "next/server";
import { env } from "process";
import { WIX_SESSION_COOKIE } from "./lib/constants";

const wixClient = createClient({
  auth: OAuthStrategy({ clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID || "" }),
});

export async function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const sessionCookie = cookies.get(WIX_SESSION_COOKIE);

  //Visitor token pro nepřihlášeného uživatele.
  let sessionTokens = sessionCookie
    ? (JSON.parse(sessionCookie.value) as Tokens)
    : await wixClient.auth.generateVisitorTokens();

  //Kontrola zda existující Token již nevypršel.
  if (sessionTokens.accessToken.expiresAt < Math.floor(Date.now() / 1000)) {
    try {
      sessionTokens = await wixClient.auth.renewToken(
        sessionTokens.refreshToken,
      );
    } catch (error) {
      sessionTokens = await wixClient.auth.generateVisitorTokens();
    }
  }

  //Aktuální příchozí request
  request.cookies.set(WIX_SESSION_COOKIE, JSON.stringify(sessionTokens));

  const res = NextResponse.next({ request });

  //Cookie pro budoucí request. OPTION:{Nastavení expirace na 14 dní, bez uvedení maxAge, vyprší okamžitě.
  //secure nastaví, že cookies bude fungovat jen na produkci díky https, dev localhost je http}
  res.cookies.set(WIX_SESSION_COOKIE, JSON.stringify(sessionTokens), {
    maxAge: 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}

// Nastavíme na jakých stránkach bude middleware fungovat
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
