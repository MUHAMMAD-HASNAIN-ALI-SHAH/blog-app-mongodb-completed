import { useEffect } from "react";
import SigninComponent from "../components/auth/SigninComponent";
import useAuthStore from "../store/auth";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const { isAuthenticated } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="w-full">
      <div className="w-full h-[80vh] md:w-full lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto border-b border-base-900 flex justify-center items-center">
        <SigninComponent />
      </div>
    </div>
  );
};

export default Signin;
