import React from 'react'
import { Skeleton } from './ui/skeleton'

export default function LoadingProductSkeleton() {
  return (
    <div className="space-y-5">          
          <div className="flex grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
            {Array.from({length: 8}).map((_,i) => (
              <Skeleton key={i} className='h-[26rem] w-full' />
            ))}
          </div>         
        </div>
  )
}
