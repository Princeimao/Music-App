import axios from "axios";
export const handleLoginSuccess = (response: any) => {
  try {
    // In the response we will get 3 things CLIENT ID, credential and selected by (mainly button or a key)
    console.log(response);
    sendTokenToBackend(response.credential);
  } catch (error) {
    console.log("something went wrong while login", error);
  }
};

export const handleLoginError = (error: any) => {
  console.log("Login Error:", error);
};

const sendTokenToBackend = async (credential: string) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/user/register`,
      {
        token: credential,
      }
    );

    console.log(response);
  } catch (error) {
    console.log(
      "something went wrong while getting an respond from the backend",
      error
    );
  }
};
