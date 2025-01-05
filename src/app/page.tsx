import Image from "next/image";
import banner from "../../public/assets/Your-Logo-here.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { delay } from "@/lib/utils";
import { Suspense } from "react";
import { getWixClient } from "@/lib/wix-client.base";
import Product from "@/components/Product";
import LoadingProductSkeleton from "@/components/LoadingProductSkeleton";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-5 py-10 space-y-10">
      <div className="flex items-center bg-secondary md:h-96">
        <div className="space-y-7 p-10 text-center md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold">
            Objevte to nejlepší – Váš oblíbený online obchod!
          </h1>
          <p>
            Vítejte v našem online obchodě! Nabízíme široký výběr kvalitních
            produktů za skvělé ceny.
          </p>
          <Button asChild>
            <Link href={"/shop"}>
              Shop HERE! <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
        <div className=" relative hidden md:block w-1/2 h-full">
          <Image src={banner} alt="Shop Logo" className="h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent "></div>
        </div>
      </div>
      <Suspense fallback={<LoadingProductSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
}

async function FeaturedProducts() {
  await delay(1000);

  const wixClient = getWixClient();

  const { collection } =
    await wixClient.collections.getCollectionBySlug("oblíbené-produkty");

  if (!collection?._id) {
    return null;
  }

  const featuredProducts = await wixClient.products
    .queryProducts()
    .hasSome("collectionIds", [collection._id])
    .descending("lastUpdated")
    .find();

  if (!featuredProducts.items.length) {
    return null;
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Featured Products</h2>
      <div className="flex grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {featuredProducts.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <pre>{JSON.stringify(featuredProducts, null, 2)}</pre>
    </div>
  );
}
