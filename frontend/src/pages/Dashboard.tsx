import { useNavigate } from "react-router-dom";
import DashboardData from "../components/dashboard/DashboardData";
import useAuthStore from "../store/auth";
import { useEffect } from "react";
import useBlogStore from "../store/blog";
import DashboardBlogs from "../components/dashboard/DashboardBlogs";

const Dashboard = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  const { getBlogs } = useBlogStore();

  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  return (
    <div className="w-full mt-1">
      <div className="w-full md:w-full lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto">
        <DashboardData />
        <DashboardBlogs />
      </div>
    </div>
  );
};

export default Dashboard;
