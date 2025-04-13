import { useParams } from "react-router-dom";
import Comments from "./dashboard/Comments";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import useBlogStore from "../store/blog";
import useHomeBlogStore from "../store/home";

const blog = () => {
  const { id } = useParams();
  const blogId = id;
  const { like } = useBlogStore();
  const [liked, setLiked] = useState<boolean>(false);
  const { getBlogData, blog } = useHomeBlogStore();

  if (blogId === null) {
    return <p>Error: Invalid blog ID</p>;
  }

  useEffect(() => {
    getBlogData(blogId ?? "");
  }, []);

  const fetchLikeStatus = async () => {
    try {
      const response = await axiosInstance.get(`/v2/blog/like/${id}`);
      setLiked(response.data.liked);
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  useEffect(() => {
    fetchLikeStatus();
  }, [id]);

  const LikeBlog = async (blogId: string | null) => {
    if (!blogId) return;
    if (!localStorage.getItem("user")) return;
    await like(blogId ?? "");
    await getBlogData(blogId ?? "");
    await fetchLikeStatus();
  };

  return (
    <div className="w-full px-2 sm:px-0 flex flex-col justify-center items-center mt-5 mb-5">
      <div className="sm:w-[600px] h-full w-full flex flex-col gap-2">
        {blog ? (
          <>
            <img
              src={blog.image}
              alt="Blog Image"
              className="h-[300px] w-full object-cover rounded-lg"
            />
            <h1 className="text-2xl font-bold text-start">{blog.title}</h1>
            <p className="text-sm w-full text-justify md:text-lg">
              {blog.description}
            </p>
            <div className="flex flex-col items-center justify-center">
              <i
                onClick={() => LikeBlog(blog._id)}
                className={`ri-heart-3-${
                  liked ? "fill" : "line"
                } text-2xl cursor-pointer`}
              ></i>
              <p>{blog.likes?.length || 0}</p>
            </div>
            <Comments
              id={blogId ?? ""}
              blogId={blogId ?? ""}
              comments={blog.comments || []}
            />
          </>
        ) : (
          <p>Loading blog data...</p>
        )}
      </div>
    </div>
  );
};

export default blog;
