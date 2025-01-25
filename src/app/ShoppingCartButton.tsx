"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import WixImage from "@/components/WixImage";
import { useCart, useUpdateItemQuantity } from "@/hooks/cart";
import { cart, currentCart } from "@wix/ecom";
import { Loader2, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
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
    <>
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => setSheetOpen(true)}>
          <ShoppingCartIcon />
          <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {totalQuantity < 10 ? totalQuantity : "+9"}
          </span>
        </Button>
      </div>
      {/* Nakupní košík*/}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex flex-col sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              Your cart{" "}
              <span className="text-base">
                ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex grow flex-col space-y-5 overflow-y-auto">
            <ul className="space-y-5">
              {cartQuery.data?.lineItems?.map((item) => (
                <ShoppingCartItem key={item._id} item={item} />
              ))}
            </ul>
            {cartQuery.isPending && (
              <Loader2 className="mx-auto animate-spin">
                {cartQuery.error && (
                  <p className="text-destructive">{cartQuery.error.message}</p>
                )}
              </Loader2>
            )}
            {!cartQuery.isPending && !cartQuery.data?.lineItems?.length && (
              <div className="flex grow items-center justify-center text-start">
                <div className="space-y-1.5 text-center">
                  <p className="text-lg font-semibold text-gray-600">
                    Košík je prázdný
                  </p>
                  <Link
                    href="/shop"
                    className="hover:underline text-orange-500"
                    onClick={() => setSheetOpen(false)}
                  >
                    Začněte nakupovat zde...
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-5">
            <div className="space-y-0.5">
              <p className="text-sm">Cena celkem</p>
              <p className="font-bold">
                {/* @ts-expect-error Chyba Wix SDK nepozná subtotal */}
                {cartQuery.data?.subtotal?.formattedAmount}
              </p>
              <p className="text-xs text-muted-foreground">
                Poštovné bude přepočítáno na pokladně
              </p>
            </div>
            <Button size="lg" disabled={!totalQuantity || cartQuery.isFetched}>
              Pokračovat
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

interface ShoppingCartItemProps {
  item: currentCart.LineItem;
}

function ShoppingCartItem({ item }: ShoppingCartItemProps) {
  const updateQuantityMutation = useUpdateItemQuantity();

  const productId = item._id;

  if (!productId) return null;

  const slug = item.url?.split("/").pop();

  const quantityLimitReach =
    !!item.quantity &&
    !!item.availability?.quantityAvailable &&
    item.quantity >= item.availability.quantityAvailable;

  return (
    <li className="flex items-center gap-3">
      <Link href={`/product/${slug}`}>
        <WixImage
          mediaIdentifier={item.image}
          width={110}
          height={110}
          alt={item.productName?.translated || "Product image"}
          className="flex-none bg-secondary"
        />
      </Link>
      <div className="space-y-1.5 text-sm">
        <Link href={`/product/${slug}`}>
          <p className="font-bold">{item.productName?.translated || "item"}</p>
        </Link>
        {!!item.descriptionLines?.length && (
          <p>
            {item.descriptionLines
              .map(
                (line) =>
                  line.colorInfo?.translated || line.plainText?.translated,
              )
              .join(", ")}
          </p>
        )}
        <div className="flex items-center gap-2">
          {item.quantity} x {item.price?.formattedConvertedAmount}
          {item.fullPrice && item.fullPrice.amount !== item.price?.amount && (
            <span className="text-muted-foreground line-through">
              {item.fullPrice.formattedConvertedAmount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={item.quantity === 1}
            onClick={() =>
              updateQuantityMutation.mutate({
                newQuantity: !item.quantity ? 0 : item.quantity - 1,
                productId,
              })
            }
          >
            -
          </Button>
          <span>{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={quantityLimitReach}
            onClick={() =>
              updateQuantityMutation.mutate({
                newQuantity: !item.quantity ? 1 : item.quantity + 1,
                productId,
              })
            }
          >
            +
          </Button>
          {quantityLimitReach && <span>Maximalní počet</span>}
        </div>
      </div>
    </li>
  );
}
