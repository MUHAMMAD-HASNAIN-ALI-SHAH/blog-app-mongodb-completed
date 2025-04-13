import { useEffect } from "react";
import BlogData from "../components/BlogData"

const Blog = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full mt-1">
      <div className="w-full md:w-full lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto">
        <BlogData/>
      </div>
    </div>
  )
}

export default Blog
