// import qs from "query-string"

// import { useSocket } from "@/providers/socket-context"
// import { useInfiniteQuery } from "@tanstack/react-query"

// interface ChatQueryProps {
//   queryKey: string
//   apiUrl: string
//   paramValue: string
// }

// export const useChatQuery = ({ queryKey, apiUrl, paramValue }: ChatQueryProps) => {
//   const { connected } = useSocket()

//   const fetchMessages = async ({ pageParam = undefined }: { pageParam?: string }) => {
//     const url = qs.stringifyUrl(
//       {
//         url: apiUrl,
//         query: {
//           cursor: pageParam,
//         },
//       },
//       { skipNull: true }
//     )

//     const res = await fetch(url)
//     return res.json()
//   }

//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
//     initialPageParam: paramValue,
//     queryKey: [queryKey],
//     queryFn: ({ pageParam }) => fetchMessages({ pageParam }),
//     getNextPageParam: (lastPage) => lastPage?.nextCursor,
//     refetchInterval: connected ? false : 1000,
//   })

//   return {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//   }
// }
