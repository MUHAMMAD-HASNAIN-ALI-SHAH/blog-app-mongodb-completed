import { create } from "zustand";
import axiosInstance from "../utils/axios";

interface blog {
  _id: string | null;
  title: string;
  description: string;
  image: string;
}

interface blogData {
  _id: string | null;
  title: string;
  description: string;
  image: string;
  likes: {
    blogID: string;
    userID: string;
  }[];
  comments: {
    _id: string;
    username: string;
    comment: string;
    blogID: string;
    userID: string;
  }[];
}

interface BlogStore {
  blogs: blog[];
  blog: blogData | null;
  getBlogs: () => void;
  getBlogData: (id: string | null) => void;
}

const useHomeBlogStore = create<BlogStore>((set) => ({
  blogs: [],
  blog: null,
  getBlogs: async () => {
    try {
      const response = await axiosInstance.get("/v2/blog/blog");
      set({ blogs: response.data.blogs });
    } catch (error) {}
  },
  getBlogData: async (id) => {
    try {
      const response = await axiosInstance.get(`/v2/blog/blog/${id}`);
      set({ blog: response.data.blogData });
    } catch (error) {
      window.location.href = "/";
      return null;
    }
  },
}));

export default useHomeBlogStore;
