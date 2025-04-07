import Bottombar from "@/components/Bars/Bottombar";
import Sidebar from "@/components/Bars/Sidebar";
import Topbar from "@/components/Bars/Topbar";
import axios from "axios";
import { useEffect, useState } from "react";

const Layout = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640);
  const [user, setUser] = useState(null);
  console.log(user);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/getUser`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.log(
        "something went wrong while getting user from backend",
        error
      );
    }
  };

  useEffect(() => {
    getUser();
    console.log(user);
  }, [user]);

  return (
    <main className="bg-[#181818] w-full h-screen">
      {isMobile ? <Bottombar /> : <Topbar />}
      <div className="w-full h-[76%] px-2">{isMobile ? null : <Sidebar />}</div>
      <div className="w-full h-[14vh] bg-[#181818]"></div>
    </main>
  );
};

export default Layout;
