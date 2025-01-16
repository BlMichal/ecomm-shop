import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-7xl mx-auto space-y-10 px-5 py-10 text-center">
      <h1 className="text-3xl font-bold">
        Je nám líto, ale požadovaná stránka nebyla nalezena.</h1>
        <p>Je možné, že byla stránka přemístěna nebo odstraněna.</p>
        <Button asChild>
          <Link href={"/"}>Zpět na úvodní stránku</Link>
        </Button>
      
    </section>
  );
}
