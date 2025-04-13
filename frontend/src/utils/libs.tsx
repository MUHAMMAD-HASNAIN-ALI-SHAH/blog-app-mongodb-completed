import useAuthStore from "../store/auth";
import useBlogStore from "../store/blog";

export const completelogout = () => {
  useBlogStore.getState().clearState();
  useAuthStore.getState().logout();
};
