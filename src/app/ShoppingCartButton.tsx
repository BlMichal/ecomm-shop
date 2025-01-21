"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/cart";
import { cart, currentCart } from "@wix/ecom";
import { ShoppingCartIcon } from "lucide-react";
import { useState } from "react";

interface IShoppingCartButton {
  initialData: currentCart.Cart | null;
}

export default function ShoppingCartButton({
  initialData,
}: IShoppingCartButton) {

  const [sheetOpen, setSheetOpen] = useState(false);

  const cartQuery = useCart(initialData);

  const totalQuantity =
    cartQuery.data?.lineItems?.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0,
    ) || 0;

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setSheetOpen(true)}>
        <ShoppingCartIcon />
        <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {totalQuantity < 10 ? totalQuantity : "+9"}
        </span>
      </Button>
    </div>
  );
}
