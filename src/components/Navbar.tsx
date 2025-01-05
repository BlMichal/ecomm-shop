import logo from "@/assets/logo-navbar.png";
import { getWixClient } from "@/lib/wix-client.base";
import Image from "next/image";
import Link from "next/link";

async function getCart() {
  const wixClient = getWixClient();
  try {
    return await wixClient.currentCart.getCurrentCart();
  } catch (error) {
    if (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).details.applicationError.code === "OWNED_CART_NOT_FOUND"
    ) {
      return null;
    } else {
      throw error;
    }
  }
}

export default async function Navbar() {
  const cart = await getCart();

  const totalQuantity =
    cart?.lineItems.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

  return (
    <header className="bg-background border-b-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3" >
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="Flow Shop logo" width={100} height={60} />
        </Link>
        <span>
        {totalQuantity} v košíku
        </span>
      </div>
    </header>
  );
}
