import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import SignUpPage from "./pages/auth/SignUpPage/SignUpPage";
import LoginPage from "./pages/auth/LoginPage/LoginPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios.js";
import NotificationsPage from "./pages/NotificationsPage/NotificationsPage.jsx";

export default function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return null;
        }

        toast.error(error.response.data.message || "Something went wrong");
      }
    }
  });

  console.log("authUser", authUser);

  if (isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={"/login"} />}/>
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}/>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}/>
        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />}/>
      </Routes>
      <Toaster />
    </Layout>
  )
}