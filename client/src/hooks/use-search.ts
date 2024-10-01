import { useQuery, UseQueryOptions } from "@tanstack/react-query"

import useAxiosPrivate from "./use-axios-private"

const useSearch = (query: string) => {
  const axiosPrivate = useAxiosPrivate()
  const queryOptions: UseQueryOptions<SearchResults> = {
    queryKey: ["searchUsers", query.trim()],
    queryFn: async () => {
      if (query.trim().length > 0) {
        const res = await axiosPrivate.get("/v1/users/artists", {
          params: { search: query.trim() },
        })
        return res.data.data
      }
    },
  }

  return useQuery(queryOptions)
}

export default useSearch
