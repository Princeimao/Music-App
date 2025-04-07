import { sendTokenToBackend } from "@/apis/authentication.api";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const navigate = useNavigate();
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            if (!credentialResponse.credential) {
              return {
                success: false,
                message: "something went wrong while authenticating",
              };
            }

            await sendTokenToBackend(credentialResponse.credential, navigate);
          } catch (error) {
            console.log("something went wrong while authenticating ", error);
          }
        }}
        onError={() => {
          console.log("Google login failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
