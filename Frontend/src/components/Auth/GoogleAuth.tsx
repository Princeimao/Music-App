import { sendTokenToBackend } from "@/apis/authentication.api";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const GoogleAuth = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            console.log(credentialResponse);

            if (!credentialResponse.credential) {
              return {
                success: false,
                message: "something went wrong while authenticating",
              };
            }

            await sendTokenToBackend(credentialResponse.credential);
          } catch (error) {
            console.log("something went wrong while authenticating ", error);
          }
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
