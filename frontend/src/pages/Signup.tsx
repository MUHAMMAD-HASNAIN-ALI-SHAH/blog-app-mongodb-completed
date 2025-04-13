import SignupComponent from "../components/auth/SignupComponent";

const Signup = () => {
  return (
    <div className="w-full">
      <div className="w-full h-[80vh] md:w-full lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto border-b border-base-900 flex justify-center items-center">
        <SignupComponent />
      </div>
    </div>
  );
};

export default Signup;
