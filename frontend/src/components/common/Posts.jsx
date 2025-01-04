import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";

const Posts = ({ feedType, username, userId }) => {
  const getPostUrl = () => {
    switch (feedType) {
      case "forYou":
        return "/api/v1/post/all";
      case "following":
        return "/api/v1/post/following";
      case "posts":
        return `/api/v1/post/user/${username}`;
      case "likes":
        return `/api/v1/post/liked/${userId}`;
      default:
        return "/api/v1/post/all";
    }
  };

  const {
    data: posts,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["posts", feedType, username, userId],
    queryFn: async () => {
      const postUrl = getPostUrl();
      const res = await fetch(postUrl);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong!");
      return data;
    },
  });

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
