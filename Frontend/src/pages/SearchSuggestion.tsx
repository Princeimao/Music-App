import SongCard from "@/components/cards/SongCard";
import TopSong from "@/components/cards/TopSong";

const SearchSuggestion = () => {
  return (
    <div className="bg-[#2F2F2F] h-[100%] w-full rounded-md px-8 py-8 text-white">
      <h1 className="font-semibold text-2xl mb-2">Top Suggestion</h1>
      <TopSong />
      <h1 className="font-semibold text-2xl mb-2 mt-8">Songs</h1>
      <SongCard />
    </div>
  );
};

export default SearchSuggestion;
