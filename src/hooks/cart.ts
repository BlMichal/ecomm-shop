import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
  UpdateCartItemQuantity,
} from "@/app/wix-api/cart";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import {
  MutationKey,
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
      toast({ description: "Položka přidána do košíku" });
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, data.cart);
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Produkt nelze přidat do košíku.",
      });
    },
  });
}

export function useUpdateItemQuantity() {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const mutationKey: MutationKey = ["updateCartItemQuantity"];

  return useMutation({
    mutationKey,
    mutationFn: (values: UpdateCartItemQuantity) =>
      updateCartItemQuantity(wixBrowserClient, values),
    onMutate: async ({ productId, newQuantity }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousState =
        queryClient.getQueryData<currentCart.Cart>(queryKey);

      queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
        ...oldData,
        lineItems: oldData?.lineItems?.map((lineItem) =>
          lineItem._id === productId
            ? {
                ...lineItem,
                quantity: newQuantity,
              }
            : lineItem,
        ),
      }));
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Něco se pokazilo, prosím opakujte akci.",
      });
    },
    onSettled() {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  return useMutation({
    mutationFn: (productId: string) =>
      removeCartItem(wixBrowserClient, productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousState =
        queryClient.getQueryData<currentCart.Cart>(queryKey);

      queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
        ...oldData,
        lineItems: oldData?.lineItems?.filter(
          (lineItem) => lineItem._id !== productId,
        ),
      }));
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Něco se pokazilo, při mazání položky.",
      });
    },onSettled(){queryClient.invalidateQueries({queryKey})}
  });
}
