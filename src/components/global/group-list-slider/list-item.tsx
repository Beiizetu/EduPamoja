//group-list-slider/list-item.tsx
"use client"

import { cn } from "@/lib/utils"

type GroupListItemProps = {
  icon: JSX.Element
  label: string
  path?: string
  selected?: string
}

export const GroupListItem = ({
  icon,
  label,
  path,
  selected,
}: GroupListItemProps) => {
  return (
    <div
      className={cn(
        "flex gap-3 items-center py-2 px-4 rounded-2xl border-2 cursor-pointer",
        selected === path
          ? "bg-white text-black"
          : "bg-themeGray border-themeGray",
      )}
    >
      {icon}
      {label}
    </div>
  )
}
