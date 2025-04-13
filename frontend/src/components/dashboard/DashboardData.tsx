import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import AddBlog from "./AddBlog";
import useBlogStore from "../../store/blog";
import { useEffect } from "react";

const DashboardData = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const { blogs } = useBlogStore();

  const { getLikes, getComments, likes, comments } = useBlogStore();

  useEffect(() => {
    getLikes();
    getComments();
  }, [getLikes, getComments]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Blogs */}
        <div className=" p-6 rounded-xl shadow-2xl text-center">
          <h2 className="text-xl font-semibold">Total Blogs</h2>
          <p className="text-2xl font-bold mt-2">{blogs.length}</p>
        </div>

        {/* Total Likes */}
        <div className=" p-6 rounded-xl shadow-2xl text-center">
          <h2 className="text-xl font-semibold">Total Likes</h2>
          <p className="text-2xl font-bold mt-2">{likes}</p>
        </div>

        <div className="  p-6 rounded-xl shadow-2xl text-center">
          <h2 className="text-lg font-semibold">Total Comments</h2>
          <p className="text-2xl font-bold mt-2">{comments}</p>
        </div>

        {/* Add a Blog */}
        <div className="  p-6 rounded-xl shadow-2xl text-center">
          <h2 className="text-xl font-semibold mb-2">Add a Blog</h2>
          <Modal
            opened={opened}
            onClose={close}
            title="Authentication"
            centered
          >
            <AddBlog onClose={close} />
          </Modal>
          <Button onClick={open} className="btn btn-primary">
            Add Blog
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardData;
