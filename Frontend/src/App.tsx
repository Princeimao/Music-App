import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Layout from "./pages/layout/layout";
import LoginPage from "./pages/Login";
import Playlist from "./pages/Playlist";
import RegisterPage from "./pages/Register";
import SearchSuggestion from "./pages/SearchSuggestion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/playlist/:spotifyId" element={<Playlist />} />
          <Route
            path="/search/:searchParameter"
            element={<SearchSuggestion />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
