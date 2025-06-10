"use client"

import { useChannelPage } from "@/hooks/channels"

import InfiniteScrollObserver from "@/components/global/infinite-scroll"
import { PaginatedPosts } from "../paginates-posts"
import { PostCard } from "./post-card"

type PostFeedProps = {
  channelid: string
  userid: string
}

export const PostFeed = ({ channelid, userid }: PostFeedProps) => {
  const { data } = useChannelPage(channelid)
  
  if (!data) {
    return null // or return a loading/error state
  }

  const { posts } = data
  
  return posts && posts.length > 0 ? (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          channelname={post.channel.name}
          title={post.title || ''}
          html={post.content}
          username={`${post.author.firstname} ${post.author.lastname}`}
          userimage={post.author.image || ''}
          likes={post._count.likes}
          comments={post._count.comments}
          postid={post.id}
          likedUser={post.likes.length > 0 ? post.likes[0].userId : undefined}
          userid={userid}
          likeid={post.likes.length > 0 ? post.likes[0].id : undefined}
        />
      ))}
      <InfiniteScrollObserver
        action="POSTS"
        loading="POST"
        identifier={channelid}
        paginate={posts.length}
      >
        <PaginatedPosts userid={userid} />
      </InfiniteScrollObserver>
    </>
  ) : (
    <></>
  )
}
