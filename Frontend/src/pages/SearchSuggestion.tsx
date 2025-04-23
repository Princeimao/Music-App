import ArtistCard from "@/components/cards/ArtistCard";
import SongCard from "@/components/cards/SongCard";
import TopSong from "@/components/cards/TopSong";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SearchSuggestion = () => {
  const { searchParameter } = useParams();
  const [debouncedInput, setDebouncedInput] = useState<string>("");

  useEffect(() => {
    if (searchParameter) {
      const timeout = setTimeout(() => {
        setDebouncedInput(searchParameter.trim());
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [searchParameter]);

  useEffect(() => {
    if (debouncedInput) {
      searchSuggestion(debouncedInput);
    }
  }, [debouncedInput]);

  const searchSuggestion = async (searchTerm: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/spotify/searchSuggestion?searchTerm=${searchTerm}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log("something went wrong while getting song suggestions", error);
    }
  };

  return (
    <div className="bg-[#2F2F2F] h-[100%] w-full rounded-md px-8 py-8 text-white overflow-auto">
      <h1 className="font-semibold text-2xl mb-2">Top Suggestion</h1>
      <TopSong />
      <h1 className="font-semibold text-2xl mb-2 mt-8">Songs</h1>
      <SongCard />

      <h1 className="font-semibold text-2xl mb-2 mt-8">Songs</h1>
      <ArtistCard />
    </div>
  );
};

export default SearchSuggestion;
