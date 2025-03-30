import { House, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../Logo.svg";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Topbar = () => {
  const [searchSong, setSearchSong] = useState<string>("");
  const navigate = useNavigate();

  return (
    <div className="h-18 w-full flex items-center px-8 justify-between">
      <div className="flex gap-12 items-center ">
        <img src={logo} alt="logo" className="h-10" />

        <div className="middle flex items-center gap-4 ">
          <div className="bg-[#292929] w-12 h-12 flex justify-center items-center rounded-full">
            <House className="text-white hover:text-white transition-all " />
          </div>

          <div className="bg-[#292929] md:w-[50vh]  h-12 rounded-full flex items-center px-2.5 hover:border hover:border-gray-500 hover:bg-[#343333]">
            <span>
              <Search size={25} className="text-white" />
            </span>
            <Input
              className="border-none bg-transparent placeholder:text-white font-[Lato] text-[2.1vh] text-white placeholder:font-semibold placeholder:text-[2.1vh]"
              type="text"
              placeholder="What do you want to play?"
              onChange={(e) => setSearchSong(e.target.value)}
              value={searchSong}
            />
          </div>
        </div>
      </div>

      <div className="end">
        <Button
          onClick={() => navigate("/register")}
          className="bg-transparent"
        >
          Sign up
        </Button>
        <Button onClick={() => navigate("/login")} variant="topbar">
          Log in
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
