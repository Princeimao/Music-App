import { useParams } from "react-router-dom";

const Playlist = () => {
  const { spotifyId } = useParams();
  return (
    <div className="bg-[#2F2F2F] h-[100%] w-full rounded-md px-8 py-8 text-white">
      <div className="h-54 w-full bg-red-500 flex items-center rounded">
        <div className="bg-orange-400 w-54 h-54 rounded"></div>
        <div>
          <h4>Public Playlist</h4>
          <h1 className="text-[17vh] font-bold">Punjabi</h1>
          <div className="bg-[#2f2f2faf] w-8 h-8 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
