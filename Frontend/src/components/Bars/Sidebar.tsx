import { RootState } from "@/context/store/store";
import { LibraryBig, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import SmallCard from "../cards/SmallCard";

const Sidebar = () => {
  const playlists = useSelector((state: RootState) => state.playlist);
  console.log(playlists);
  return (
    <div className="w-[50vh] bg-[#2f2f2f] h-full rounded-md px-3 py-3">
      <div className="flex items-center ">
        <div className="flex w-full h-12 rounded-md items-center text-white gap-2 px-3 mt-1">
          <LibraryBig size={32} strokeWidth={1.5} color="white" />
          <h1 className="text-lg font-semibold">Your Library</h1>
        </div>
        <div className="w-12 h-10 flex items-center justify-center bg-[#282828] rounded-full">
          <Plus color="white" />
        </div>
      </div>
      {playlists.map((playlist) => (
        <SmallCard
          spotifyId={playlist.spotifyId}
          key={playlist.spotifyId}
          images={playlist.images}
          author={playlist.author}
          playlistName={playlist.name}
          type="Playlist"
        />
      ))}
    </div>
  );
};

export default Sidebar;
