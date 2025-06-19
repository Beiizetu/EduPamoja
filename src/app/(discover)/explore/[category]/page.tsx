type PageProps = {
  params: Record<string, string>
  searchParams?: Record<string, string | string[] | undefined>
}
import { onGetExploreGroup } from "@/actions/groups"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import ExplorePageContent from "../_components/explore-content"

const ExploreCategoryPage = async ({
  params,
}: {
  params: { category: string }
  searchParams?: Record<string, string | string[] | undefined>
}) => {
  const query = new QueryClient()

  await query.prefetchQuery({
    queryKey: ["groups"],
    queryFn: () => onGetExploreGroup(params.category, 0),
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <ExplorePageContent layout="LIST" category={params.category} />
    </HydrationBoundary>
  )
}

export default ExploreCategoryPage
