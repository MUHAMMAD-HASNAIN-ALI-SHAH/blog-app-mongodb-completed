import { Link } from "react-router-dom";
import useAuthStore from "../store/auth";
import { Modal } from "@mantine/core";
import { useState } from "react";
import SearchBlogs from "./SearchBlogs";
import { useMediaQuery } from "@mantine/hooks";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const [opened, setOpened] = useState(false);
  const isMobile = useMediaQuery('(max-width: 50em)');

  const logoutButton = () => {
    logout();
  };

  const open = () => setOpened(true);
  const close = () => setOpened(false);

  return (
    <div className="w-full shadow-lg">
      <div className="w-full md:w-full lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto h-full z-50">
        <div className="navbar bg-base-100 h-full">
          <div className="flex-1">
            <p className="btn btn-ghost text-xl">
              <Link to={"/"}>Bloggy</Link>
            </p>
          </div>
          <div className="flex gap-3">
            <Modal
              opened={opened}
              onClose={close}
              title="Search Blogs"
              fullScreen={isMobile}
              size={"lg"}
              centered
            >
              <SearchBlogs onClose={close} />
            </Modal>
            <input
              onClick={open}
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto hidden sm:block"
            />
            <div>
              {isAuthenticated ? (
                <div className="flex gap-3">
                  <Link to={"/dashboard"} className="btn btn-primary">
                    Dashboard
                  </Link>
                  <button onClick={logoutButton} className="btn btn-primary">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to={"/signin"} className="btn btn-primary">
                  Signin
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
