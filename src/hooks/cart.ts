import { getCart } from "@/app/wix-api/cart";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import { useQuery } from "@tanstack/react-query";
import { currentCart } from "@wix/ecom";

export function useCart(initialData: currentCart.Cart | null){
  return(  useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(wixBrowserClient),initialData
    })
  )
}