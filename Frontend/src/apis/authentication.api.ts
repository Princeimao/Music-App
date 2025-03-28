import axios from "axios";

interface Data {
  data: {
    email: string;
    googleId: string;
    isNewUser: boolean;
    name: string;
    profilePic: string;
    spotifyAuthUrl: string;
  };
}

export const sendTokenToBackend = async (credential: string) => {
  try {
    const response: Data = await axios.post(
      `http://localhost:3000/api/user/register`,
      {
        token: credential,
      }
    );

    console.log(response);

    if (response.data.isNewUser === true) {
      window.location.href = response.data.spotifyAuthUrl;
    }
  } catch (error) {
    console.log(
      "something went wrong while getting an respond from the backend",
      error
    );
  }
};
