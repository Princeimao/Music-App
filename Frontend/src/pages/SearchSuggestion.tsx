import ArtistCard from "@/components/cards/ArtistCard";
import SongCard from "@/components/cards/SongCard";
import TopSong from "@/components/cards/TopSong";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface SearchResults {
  artists: Artist[];
  albums: [];
  tracks: Track[];
  playlists: [];
  alreadyPlayed: AlreadyPlayed[];
}

interface AlreadyPlayed {
  spotify_id: string;
  title: string;
  artist: string[];
  album: string;
  album_cover: string;
}

interface Track {
  spotifyId: string;
  name: string;
  artists: string;
  albumName: string;
  albumImage: string;
  spotifyUrl: string;
  previewUrl: string;
  durationMs: number;
}

interface Artist {
  id: string;
  image: string;
  name: string;
  type: string;
}

const SearchSuggestion = () => {
  const { searchParameter } = useParams();
  const [debouncedInput, setDebouncedInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    artists: [],
    albums: [],
    tracks: [],
    playlists: [],
    alreadyPlayed: [],
  });

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
      const { artists, albums, tracks, playlists, alreadyPlayed } =
        response.data.searchSuggestion;

      setSearchResults({ artists, albums, tracks, playlists, alreadyPlayed });
    } catch (error) {
      console.log("something went wrong while getting song suggestions", error);
    }
  };

  return (
    <div className="bg-[#2F2F2F] h-[100%] w-full rounded-md px-8 py-8 text-white overflow-auto">
      <h1 className="font-semibold text-2xl mb-2">Top Suggestion</h1>

      {searchResults.alreadyPlayed && searchResults.alreadyPlayed.length > 0 ? (
        <TopSong
          spotifyId={searchResults.alreadyPlayed[0].spotify_id}
          title={searchResults.alreadyPlayed[0].title}
          artist={searchResults.alreadyPlayed[0].artist}
          albumCover={searchResults.alreadyPlayed[0].album_cover}
        />
      ) : (
        <TopSong
          spotifyId={searchResults.tracks[0].spotifyId}
          title={searchResults.tracks[0].name}
          artist={searchResults.tracks[0].artists}
          albumCover={searchResults.tracks[0].albumImage}
        />
      )}

      <h1 className="font-semibold text-2xl mb-2 mt-8">Songs</h1>
      {searchResults.tracks.length > 0
        ? searchResults.tracks.map((track: Track) => (
            <SongCard
              key={track.spotifyId}
              spotifyId={track.spotifyId}
              name={track.name}
              artists={track.artists}
              albumName={track.albumName}
              albumImage={track.albumImage}
              durationMs={track.durationMs}
            />
          ))
        : null}

      <h1 className="font-semibold text-2xl mb-2 mt-8">Songs</h1>
      <ArtistCard />
    </div>
  );
};

export default SearchSuggestion;
