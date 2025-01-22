import { addToCart, getCart } from "@/app/wix-api/cart";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { currentCart } from "@wix/ecom";
import { useToast } from "./use-toast";
import { IAddToCartButton } from "@/components/AddToCartButton";

const queryKey: QueryKey = ["cart"];

export function useCart(initialData: currentCart.Cart | null) {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => getCart(wixBrowserClient),
    initialData,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: IAddToCartButton) =>
      addToCart(wixBrowserClient, values),
    onSuccess(data) {
      toast({ description: "Položka přidána do košíku"});
      queryClient.cancelQueries({queryKey});
      queryClient.setQueryData(queryKey, data.cart);
    },    
    onError(error){
      console.error(error)
      toast({variant:"destructive", description: "Produkt nelze přidat do košíku."})
    }
  });
}
