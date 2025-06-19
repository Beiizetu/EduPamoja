import type { PageProps } from "@/types/next"
import { onAuthenticatedUser } from "@/actions/auth"
import { onGetGroupInfo } from "@/actions/groups"
import { onGetActiveSubscription } from "@/actions/payments"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"
import AboutGroup from "../_components/about"
import GroupSideWidget from "@/components/global/group-side-widget"

interface GroupPageParams {
  groupid: string
}

export default async function Page({
  params,
  searchParams = {},
}: PageProps<GroupPageParams>) {
  const query = new QueryClient()

  await Promise.all([
    query.prefetchQuery({
      queryKey: ["about-group-info", params.groupid],
      queryFn: () => onGetGroupInfo(params.groupid),
    }),
    query.prefetchQuery({
      queryKey: ["active-subscription", params.groupid],
      queryFn: () => onGetActiveSubscription(params.groupid),
    }),
  ])

  const user = await onAuthenticatedUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="pt-36 pb-10 container grid grid-cols-1 lg:grid-cols-3 gap-x-10">
        <div className="col-span-1 lg:col-span-2">
          <AboutGroup userid={user.id} groupid={params.groupid} />
        </div>
        <div className="col-span-1 relative">
          <GroupSideWidget userid={user.id} groupid={params.groupid} />
        </div>
      </div>
    </HydrationBoundary>
  )
}
