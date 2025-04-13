import Hero from "../components/Hero";
import HomeBlogs from "../components/HomeBlogs";

const Home = () => {
  return (
    <div className="w-full mt-1">
      <div className="w-full md:w-full lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto border-b border-base-900">
        <Hero />
        <HomeBlogs />
      </div>
    </div>
  );
};

export default Home;
