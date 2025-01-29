import ShoppingCartButton from "@/components/ShoppingCartButton";
import { getCart } from "@/app/wix-api/cart";
import logo from "@/assets/logo-navbar.png";
import { getWixServerClient } from "@/lib/wix-client.server";
import Image from "next/image";
import Link from "next/link";
import UserButton from "./UserButton";



export default async function Navbar() {
  const cart = await getCart(await getWixServerClient());

  return (
    <header className="bg-background border-b-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3" >
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="Flow Shop logo" width={100} height={60} />
        </Link>
        <div className="flex">
        <UserButton />
        
        <ShoppingCartButton initialData={cart} />          
        </div>        
      </div>
    </header>
  );
}
