import { Ellipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { timeInMinutes } from "@/utils/helper";

interface SongCardProps {
  spotifyId: string;
  name: string;
  artists: string;
  albumName: string;
  albumImage: string;
  durationMs: number;
}

const SongCard = ({
  spotifyId,
  name,
  artists,
  albumName,
  albumImage,
  durationMs,
}: SongCardProps) => {
  return (
    <div
      className="w-full h-15 rounded-sm p-2 flex items-center justify-between hover:bg-[#49494962] transition-all gap-3"
      id={spotifyId}
    >
      <div className="flex items-center gap-3">
        <div className="bg-amber-600 w-11 h-11 rounded">
          <img
            src={albumImage}
            alt="playlist_image"
            className="w-full h-full object-cover rounded"
          />
        </div>

        <div>
          <h4 className="text-md font-medium text-white hover:underline">
            {name}
          </h4>
          <h5 className="text-sm font-medium text-[#717171] hover:underline">
            {artists}
          </h5>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <p>{timeInMinutes(durationMs)}</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#2F2F2F] text-white border-none w-[21vh]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#181818] w-[90%] ml-1" />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SongCard;
