import { getProductBySlug } from "@/app/wix-api/product";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";
import { delay } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";

interface IAppProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: IAppProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(await getWixServerClient(),slug);

  if (!product?._id) {
    return notFound();
  }

  const mainImage = product.media?.mainMedia?.image;

  return {
    title: product.name,
    description: "Tento produkt naleznete na našem ESHOPU",
    openGraph: {
      images: mainImage?.url
        ? [
            {
              url: mainImage.url,
              width: mainImage.width,
              height: mainImage.height,
              alt: mainImage.altText || "",
            },
          ]
        : undefined,
    },
  };
}

export default async function Page({ params }: IAppProps) {
  await delay(1000)
  //NEXT15 dynamic api jsou asynchroní, proto je potřeba await params
  const { slug } = await params;

  const product = await getProductBySlug(await getWixServerClient(),slug);

  if (!product?._id) {
    return notFound();
  }

  return (
    <section className="max-w-7xl mx-auto space-y-10 px-5 py-10">
      <ProductDetails product={product} />
    </section>
  );
}
