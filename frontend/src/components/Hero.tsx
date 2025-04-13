import useAuthStore from "../store/auth";

const Hero = () => {

  const {isAuthenticated} = useAuthStore();

  const handleClick = () => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/signin";
    }
  };

  return (
    <div className="hero bg-transparent min-h-[80vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-2xl  md:text-3xl font-bold">Welcome to Our Blogging Hub</h1>
          <p className="py-6 text-sm md:text-lg">
            Share your thoughts, explore insightful articles, and connect with a
            community of passionate writers. Whether you're here to learn,
            express, or inspire, this is your space to create and discover new
            ideas.
          </p>
          <button onClick={handleClick} className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
