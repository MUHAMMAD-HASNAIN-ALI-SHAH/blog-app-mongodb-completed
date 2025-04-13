import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { completelogout } from "../utils/libs";
import toast from "react-hot-toast";

interface blog {
  _id: string | null;
  title: string;
  description: string;
  image: string;
}

interface BlogStore {
  submitionState: Boolean;
  blogs: blog[];
  likes: number;
  comments: number;
  addBlog: (blog: blog) => void;
  getBlogs: () => void;
  deleteBlog: (id: string) => void;
  updateBlog: (blog: blog) => void;
  addComment: (data: { comment: string }, id: string) => void;
  like: (id: string) => void;
  getLikes: () => void;
  getComments: () => void;
  clearState: () => void;
}

const useBlogStore = create<BlogStore>((set) => ({
  blogs: [],
  likes: 0,
  comments: 0,
  submitionState: false,
  addBlog: async (blog) => {
    set({ submitionState: true });
    try {
      const response = await axiosInstance.post("/v2/blog", blog);
      toast.success(response.data.msg, {
        duration: 3000,
      });
      set({ submitionState: false });
    } catch (error: any) {
      if (error?.response.status === 401) {
        completelogout();
        return;
      }
      toast.error("Failed to update blog", { duration: 3000 });
      console.error(error);
      set({ submitionState: false });
    }
  },
  getBlogs: async () => {
    try {
      const response = await axiosInstance.get("/v2/blog");
      set({ blogs: response.data.blogs });
    } catch (error: any) {
      console.log(error.response.data.status);
      if (error?.response.status === 401) {
        completelogout();
        return;
      }
    }
  },
  deleteBlog: async (id) => {
    try {
      const response = await axiosInstance.delete(`/v2/blog/${id}`);
      toast.success(response.data.msg, {
        duration: 3000,
      });
    } catch (error: any) {
      if (error?.response.status === 401) {
        completelogout();
        return;
      }
      toast.error(error?.response.data.msg, { duration: 3000 });
      console.error(error);
      set({ submitionState: false });
    }
  },
  updateBlog: async (blog) => {
    set({ submitionState: true });
    try {
      const response = await axiosInstance.put(`/v2/blog`, blog);
      toast.success(response.data.msg, {
        duration: 3000,
      });
      set({ submitionState: false });
    } catch (error: any) {
      if (error?.response.status === 401) {
        completelogout();
        return;
      }
      toast.error("Failed to update blog", { duration: 3000 });
      console.error(error);
      set({ submitionState: false });
    }
  },
  addComment: async (data, id) => {
    try {
      const response = await axiosInstance.post(`/v2/blog/comment/${id}`, data);
      toast.success(response.data.msg, {
        duration: 3000,
      });
    } catch (error: any) {
      if (error?.response.status === 401) {
        completelogout();
        return;
      }
      toast.error("Failed to add comment", { duration: 3000 });
      console.error(error);
    }
  },
  like: async (id) => {
    try {
      const response = await axiosInstance.post(`/v2/blog/like/${id}`);
      toast.success(response.data.msg, {
        duration: 3000,
      });
    } catch (error: any) {
      if (error?.response.status === 401) {
        completelogout();
        return;
      }
      toast.error("Failed to add comment", { duration: 3000 });
      console.error(error);
    }
  },
  getLikes: async () => {
    try {
      const response = await axiosInstance.get(`/v2/blog/likes`);
      set({ likes: response.data.likes });
    } catch (error: any) {
      if (error?.response.status === 401) {
        completelogout();
        return;
      }
      toast.error("Failed to fetch likes", { duration: 3000 });
      console.error(error);
    }
  },
  getComments: async () => {
    try {
      const response = await axiosInstance.get(`/v2/blog/comments`);
      set({ comments: response.data.comments });
    } catch (error: any) {
      console.log(error.response.status);
      if (error?.response.status === 401) {
        completelogout();
        return;
      }
      toast.error("Failed to fetch comments", { duration: 3000 });
      console.error(error);
    }
  },
  clearState: () => {
    set({ blogs: [], likes: 0, comments: 0, submitionState: false });
  },
}));

export default useBlogStore;
