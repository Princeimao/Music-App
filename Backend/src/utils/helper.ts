import crypto from "crypto";

export const generateRandomString = (length: number) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

// {
//     "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMWYzYmM2NmYwNzUxZjc4NDA2MDY3OTliMWFkZjllOWZiNjBkZmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5OTU2NjYyNzM4MzktYm5kbGp0YWZhaWI5dWFhczE5M2luZ2FwZ2E3NjVncGwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5OTU2NjYyNzM4MzktYm5kbGp0YWZhaWI5dWFhczE5M2luZ2FwZ2E3NjVncGwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEwMTkzNTk3NzE1NzMzNjE1MTAiLCJlbWFpbCI6InBnODc1MDI5NDM2NjU1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3NDMxNzA4MjksIm5hbWUiOiJQcmluY2UgR3VwdGEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSUJ4YXQtYnVZdm9lUzlOTGs2eGl5cHpHSm9KRkdsS0pBRXJNb3ljNFQ0cGduLUpzRlI9czk2LWMiLCJnaXZlbl9uYW1lIjoiUHJpbmNlIiwiZmFtaWx5X25hbWUiOiJHdXB0YSIsImlhdCI6MTc0MzE3MTEyOSwiZXhwIjoxNzQzMTc0NzI5LCJqdGkiOiIwYjZiZDgxY2E5N2IyOGEyMmUyYmU4MGUxYzJiZTNhNTE1YTZiMTMzIn0.kssqOgmbLXpFkoIsCkr0-lB1-0jF70T7lDZwU1cjD0Ufn4hhB5x-ogZeVUMRq8DO82nxJYc79oa6kiQW__-PHPFGZdLthm8Az33z-vjbbTrzSnv76rFv_bW7eoXro2w4kTVxdFpuOKwhArBpkhnDm33MryK5lbSfOaMVJxJuyCb7k0S-sDEtv8iXOO5aRTFLg6V3qzcIfW3UpZOM3uq0NwvErRMq76dhihYZojxzAzyDqR4HeuRfpEoVl05bsIvpKxRiv1-dV720vaVFhGa9PA42jC-rXL9sQLMmCvWjO9TGEQiiVEvym0aa3bPxRd6HTy_er4INaCmY7KWp6zHZ2Q",
//     "clientId": "995666273839-bndljtafaib9uaas193ingapga765gpl.apps.googleusercontent.com",
//     "select_by": "btn"
// }

// {
//     "isNewUser": true,
//     "googleId": "101019359771573361510",
//     "email": "pg875029436655@gmail.com",
//     "name": "Prince Gupta",
//     "profilePic": "https://lh3.googleusercontent.com/a/ACg8ocIBxat-buYvoeS9NLk6xiypzGJoJFGlKJAErMoyc4T4pgn-JsFR=s96-c",
//     "spotifyAuthUrl": "https://accounts.spotify.com/authorize?response_type=code&client_id=d16fe55b9eb24ae6bfe8a61bd4f48241&scope=user-read-private%20user-read-email%20user-modify-playback-state%20playlist-modify-public&redirect_uri=http%3A%2F%2Flocalhost%3A5173&state=4c29f590647b4c3e"
// }
