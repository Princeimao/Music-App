import Bottombar from "@/components/Bars/Bottombar";
import Sidebar from "@/components/Bars/Sidebar";
import Topbar from "@/components/Bars/Topbar";
import { RootState } from "@/context/store/store";
import { login } from "@/context/userSlice";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Response {
  data: {
    success: boolean;
    message: string;
    user: {
      _id: string;
      name: string;
      email: string;
      profile_picture: string;
    };
  };
}

const Layout = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getUser = useCallback(async () => {
    try {
      const response: Response = await axios.get(
        `http://localhost:3000/api/user/getUser`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const payload = {
          userId: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          profile_picture: response.data.user.profile_picture,
          isAuthenticated: true,
        };

        dispatch(login(payload)); 
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (user.isAuthenticated) {
      navigate("/");
    } else {
      getUser();
    }
  }, [navigate, user.isAuthenticated, getUser]);

  return (
    <main className="bg-[#181818] w-full h-screen">
      {isMobile ? <Bottombar /> : <Topbar />}
      <div className="w-full h-[76%] px-2">{isMobile ? null : <Sidebar />}</div>
      <div className="w-full h-[14vh] bg-[#181818]"></div>
    </main>
  );
};

export default Layout;
