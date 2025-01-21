import { products } from "@wix/stores";
import { Button, ButtonProps } from "./ui/button";
import { addToCart } from "@/app/wix-api/cart";
import { wixBrowserClient } from "@/lib/wix-client.browser";

interface IAddToCartButton extends ButtonProps {
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
  return (
    <Button
      onClick={() =>
        addToCart(wixBrowserClient,{
          product,
          selectedOptions,
          quantity,
        })
      }
      {...props}
    >
      Přidat do košíku
    </Button>
  );
}
