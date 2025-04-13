import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import useAuthStore from "./store/auth";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Blog from "./pages/Blog";

function App() {
  const { verify,isAuthenticated } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      verify();
    };
    verifyAuth();
  }, [verify]);

  return (
    <div className="">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={!isAuthenticated ? <Signin /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup />  : <Navigate to="/" />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
      </Routes>
    </div>
  );
}

export default App;
