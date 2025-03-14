import { products } from "@wix/stores";
import { ButtonProps } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { useAddToCart } from "@/hooks/cart";
import { cn } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";

export interface IAddToCartButton extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export default function AddToCartButton({
  product,
  selectedOptions,
  quantity,
  className,
  ...props
}: IAddToCartButton) {
  const {mutate,isPending} = useAddToCart();
  return (
    <LoadingButton
      onClick={() =>
        mutate({
          product,
          selectedOptions,
          quantity,
        })
      }
      loading={isPending}
      className={cn("flex gap-3", className)}
      {...props}
    >
      <ShoppingCartIcon/>
      Přidat do košíku
    </LoadingButton>
  );
}
