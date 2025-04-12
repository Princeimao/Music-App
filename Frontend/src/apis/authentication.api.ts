import axios from "axios";
import { NavigateFunction } from "react-router-dom";

import { deletePlaylist } from "@/context/playlistSlice";
import { AppDispatch } from "@/context/store/store";
import { logout } from "@/context/userSlice";

interface Data {
  data: {
    email: string;
    googleId: string;
    isNewUser: boolean;
    name: string;
    profilePic: string;
    spotifyAuthUrl: string;
    token: string;
  };
}

export const sendTokenToBackend = async (
  credential: string,
  navigate: NavigateFunction
) => {
  try {
    const response: Data = await axios.post(
      `http://localhost:3000/api/user/register`,
      {
        token: credential,
      }
    );

    if (response.data.isNewUser === true) {
      window.location.href = response.data.spotifyAuthUrl;
    } else {
      navigate("/");
    }
  } catch (error) {
    console.log("Error during backend authentication", error);
  }
};

export const logoutUser = async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/user/logout`, {
      withCredentials: true,
    });
    if (response.data.success) {
      dispatch(logout());
      dispatch(deletePlaylist());
    }
  } catch (error) {
    console.log("Error during backend authentication", error);
  }
};
