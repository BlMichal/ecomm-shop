"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"


export default function ReactQueryProvider({children}:{children: React.ReactNode}) {

// QueryClient is not stable. It should be either extracted from the component or wrapped in React.   useState.
// See https://tkdodo.eu/blog/react-query-fa-qs#2-the-queryclient-is-not-stableeslint@tanstack/query/stable-query-client 

    const [queryClient] = useState(new QueryClient())
  return (

    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  )
}
