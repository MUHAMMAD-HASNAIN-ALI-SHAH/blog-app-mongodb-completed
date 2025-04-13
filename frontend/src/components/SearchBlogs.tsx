import { Input } from "@mantine/core";
import { useState } from "react";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";

const SearchBlogs = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({ search: "" });
  const [blogs, setBlogs] = useState<
    { id: number; title: string; description: string; image: string }[]
  >([]);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    axiosInstance
      .post("/v2/blog/search", formData)
      .then((res) => {
        setBlogs(res.data.blogs);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleBlogClick = (id: number) => {
    navigate(`/blog/${id}`);
    onClose();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          name="search"
          value={formData.search}
          onChange={handleChange}
          placeholder="Search blogs"
        />
      </form>
      {blogs.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {blogs &&
            blogs.map((blog) => (
              <li
                key={blog.id}
                onClick={() => handleBlogClick(blog.id)}
                className="flex gap-2 cursor-pointer p-2 hover:shadow-2xl rounded-lg transition-transform duration-200 transform hover:scale-105"
              >
                <div className="w-1/3">
                  <img className="" src={blog.image} alt="" />
                </div>
                <div key={blog.id} className="flex flex-col w-2/3">
                  <h2 className="font-semibold">{blog.title}</h2>
                  <p className="text-justify">
                    {blog.description.length > 130
                      ? blog.description.substring(0, 130) + "..."
                      : blog.description}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <p className="mt-4">No blogs found</p>
      )}
    </div>
  );
};

export default SearchBlogs;
