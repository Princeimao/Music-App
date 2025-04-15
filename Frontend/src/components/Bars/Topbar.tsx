import axios from "axios";
import { House, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { logoutUser } from "@/apis/authentication.api";
import { RootState } from "@/context/store/store";
import logo from "../../Logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

const Topbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [input, setInput] = useState<string>("");
  const [debouncedInput, setDebouncedInput] = useState<string>("");

  useEffect(() => {
    if (input !== "") {
      navigate(`/search/${encodeURIComponent(input)}`);
    }

    const timeout = setTimeout(() => {
      setDebouncedInput(input.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [input, navigate]);

  useEffect(() => {
    if (debouncedInput) {
      const response = axios.get(
        `http://localhost:/api/spotify/searchSuggestion?searchTerm=${debouncedInput}`
      );
      console.log("here", response);
    }
  }, [debouncedInput]);

  return (
    <div className="h-18 w-full flex items-center px-8 justify-between">
      <div className="flex gap-12 items-center" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="h-10" />

        <div className="middle flex items-center gap-4 ">
          <div className="bg-[#292929] w-12 h-12 flex justify-center items-center rounded-full">
            <House
              className="text-white hover:text-white transition-all "
              fill={pathname === "/" ? "white" : "transparent"}
            />
          </div>

          <div className="bg-[#292929] md:w-[50vh] h-12 rounded-full flex items-center px-2.5 focus-within:border focus-within:border-gray-500 focus-within:bg-[#343333]">
            <span>
              <Search size={25} className="text-white" />
            </span>
            <Input
              className="border-none bg-transparent placeholder:text-white font-[Lato] text-[2.1vh] text-white placeholder:font-semibold placeholder:text-[2.1vh]"
              type="text"
              placeholder="What do you want to play?"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </div>
        </div>
      </div>

      <div className="end flex items-center gap-5">
        {user.isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="bg-[#2f2f2faf] w-12 h-12 rounded-full"
              asChild
            >
              <Avatar>
                <AvatarImage src="" alt="@shadcn" />
                <AvatarFallback>DN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#2F2F2F] text-white border-none w-[21vh]">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#181818]" />
              <DropdownMenuItem>Account</DropdownMenuItem>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#181818]" />
              <DropdownMenuItem onClick={() => logoutUser(dispatch)}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button
              onClick={() => navigate("/register")}
              className="bg-transparent"
            >
              Sign up
            </Button>
            <Button onClick={() => navigate("/login")} variant="topbar">
              Log in
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Topbar;
