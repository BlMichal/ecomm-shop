import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-10 space-y-10">
      <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
        <div className="basis-2/5">
          <Skeleton className="aspect-square" />
        </div>
        <div className="basis-3/5 space-y-4">
          <div className="space-y-2.5">
            <Skeleton className="w-56 h-14" />
            <Skeleton className="w-full h-44" />
            <Skeleton className="w-56 h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
