import { getProductBySlug } from "@/app/wix-api/product";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";

interface IAppProps {
  params: { slug: string };
}

export default async function Page({ params }: IAppProps) {
  //NEXT15 dynamic api jsou asynchroní, proto je potřeba await params
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product?._id) {
    return notFound();
  }

  return (
    <section className="max-w-7xl mx-auto space-y-10 px-5 py-10">
      <ProductDetails product={product} />
    </section>
  );
}
