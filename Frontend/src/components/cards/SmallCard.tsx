import { PlaylistState } from "@/context/playlistSlice";
import { useNavigate } from "react-router-dom";

interface SmallCardProps extends PlaylistState {
  playlistName: string;
  type: string;
}

const SmallCard = ({
  images,
  author,
  playlistName,
  type,
  spotifyId,
}: SmallCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="group w-full h-18 rounded-md flex items-center px-2 py-1.5 hover:bg-[#49494962] gap-2.5"
      onClick={() => navigate(`/playlist/${spotifyId}`, { replace: true })}
    >
      <div className="w-13 h-13 bg-black rounded">
        <img
          src={images[0].url}
          alt="playlist_image"
          className="w-full h-full object-cover rounded"
        />
      </div>

      <div>
        <h1 className="text-white font-semibold">{playlistName}</h1>
        <div className="flex gap-1.5">
          <h5 className="text-sm font-medium text-[#717171]">{type} </h5>
          <h5 className="text-sm font-medium text-[#717171]">-</h5>
          <h5 className="text-sm font-medium text-[#717171]">{author}</h5>
        </div>
      </div>
    </div>
  );
};

export default SmallCard;
