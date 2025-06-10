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
  const { groups: hookGroups, status } = category ? useGroupList("groups") : { groups: [], status: 200 }
  const groups = propGroups || hookGroups

  return (
    <div className="container grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
      {status === 200 ? (
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
