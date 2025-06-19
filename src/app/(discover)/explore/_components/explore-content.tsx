"use client"
import { useAppSelector, useAppDispatch } from "@/redux/store"
import dynamic from "next/dynamic"
import ExploreSlider from "./explore-slider"
import GroupList from "./group-list"
import { setAllGroups } from "@/redux/slices/all-groups-slice"
import { useEffect } from "react"
import { onGetAllPublicGroups } from "@/actions/groups"

type Props = {
  layout: "SLIDER" | "LIST"
  category?: string
  showAllGroups?: boolean
}

const SearchGroups = dynamic(
  () =>
    import("./searched-groups").then((components) => components.SearchGroups),
  {
    ssr: false,
  },
)

const ExplorePageContent = ({ layout, category, showAllGroups }: Props) => {
  const dispatch = useAppDispatch()
  const { isSearching, data, status, debounce } = useAppSelector(
    (state) => state.searchReducer,
  )
  const allGroups = useAppSelector(
    (state) => state.allGroupsReducer?.groups || [],
  )

  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const response = await onGetAllPublicGroups()
        // Ensure we always have an array, even if response is an object
        const groups = Array.isArray(response)
          ? response
          : response?.groups || []
        dispatch(setAllGroups(groups))
      } catch (error) {
        console.error("Failed to fetch all groups:", error)
      }
    }

    if (showAllGroups) {
      fetchAllGroups()
    }
  }, [showAllGroups, dispatch])

  return (
    <div className="flex flex-col">
      {isSearching || debounce ? (
        <SearchGroups
          searching={isSearching as boolean}
          data={data!}
          query={debounce}
        />
      ) : showAllGroups ? (
        <GroupList groups={allGroups} />
      ) : (
        status !== 200 &&
        (layout === "SLIDER" ? (
          <>
            <ExploreSlider
              label="Fitness"
              text="Join top performing groups on grouple."
              query="fitness"
            />
            <ExploreSlider
              label="Lifestyle"
              text="Join top performing groups on grouple."
              query="lifestyle"
            />
            <ExploreSlider
              label="Music"
              text="Join top performing groups on grouple."
              query="music"
            />
          </>
        ) : (
          <GroupList category={category as string} />
        ))
      )}
    </div>
  )
}

export default ExplorePageContent
