//group-list.tsx
import InfiniteScrollObserver from "@/components/global/infinite-scroll"
import { NoResult } from "@/components/global/search/no-results"
import { useGroupList } from "@/hooks/groups"
import GroupCard from "./group-card"
import PaginatedGroups from "./paginated-groups"

import { Group as GroupType } from "@prisma/client"

type Props = {
  category?: string
  groups?: GroupType[]
}

const GroupList = ({ category, groups: propGroups }: Props) => {
  const {
    groups: hookGroups,
    status,
    isLoading,
    error,
  } = useGroupList("groups")
  const groups = propGroups || (category ? hookGroups : [])

  if (isLoading) {
    return (
      <div className="container grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-16">
        <NoResult message="Failed to load groups. Please try again later." />
      </div>
    )
  }

  return (
    <div className="container grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
      {status === 200 && groups.length > 0 ? (
        groups.map((group) => (
          <GroupCard
            key={group.id}
            id={group.id}
            name={group.name}
            category={group.category}
            createdAt={group.createdAt}
            userId={group.userId}
            thumbnail={group.thumbnail}
            description={group.description}
            privacy={group.privacy}
          />
        ))
      ) : (
        <NoResult />
      )}
      {category && groups && groups.length > 5 && (
        <InfiniteScrollObserver
          action="GROUPS"
          identifier={category}
          paginate={groups.length}
        >
          <PaginatedGroups />
        </InfiniteScrollObserver>
      )}
    </div>
  )
}

export default GroupList
