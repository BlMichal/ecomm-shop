
import { Tokens } from '@wix/sdk'
import { getWixClient } from './wix-client.base'
import { WIX_SESSION_COOKIE } from './constants'
import { cookies } from 'next/headers'
import { cache } from 'react'

export const getWixServerClient = cache(async() => {

    let tokens:Tokens | undefined

    try {
        const cookieStore = await cookies(); // Resolve the promise
        const cookieValue = cookieStore.get(WIX_SESSION_COOKIE)?.value; // Access the cookie value
        if (cookieValue) {
            tokens = JSON.parse(cookieValue);
        }     
    } catch (error) {}

    // Platí pro NEXTJS 14! od 15 je cookies async funkce
    // try {
    //     tokens = JSON.parse(cookies().get(WIX_SESSION_COOKIE)?.value || "{}");
    //   } catch (error) {}


  return getWixClient(tokens)
  
})
