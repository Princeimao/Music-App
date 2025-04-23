import PlaylistCard from "@/components/cards/PlaylistCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock3 } from "lucide-react";

const Playlist = () => {
  return (
    <div className="bg-[#2F2F2F] h-[100%] w-full rounded-md px-8 py-8 text-white overflow-auto">
      <div className="h-54 w-full flex items-center rounded p-5">
        <div className="w-44 h-44 rounded overflow-clip">
          <img
            src="https://i.scdn.co/image/ab6761610000e5eb7aa689cd7ca136098b26c20d"
            alt=""
            className="object-center object-cover w-full h-full"
          />
        </div>
        <div>
          <h4 className="ml-6 mb-1.5">Public Playlist</h4>
          <h1 className="text-[17vh] font-bold inline-block leading-20 ml-3.5">
            Punjabi
          </h1>
          <div className="ml-5 mt-2 flex items-center gap-2">
            <Avatar>
              <AvatarImage src="" alt="@shadcn" />
              <AvatarFallback>DN</AvatarFallback>
            </Avatar>
            <h3 className="font-bold ">Prince Gupta</h3>
          </div>
        </div>
      </div>

      <div className="content-table">
        <div className="w-full h-12 border-b border-[#646464] text-[#757575] flex items-center text-sm md:text-base px-2 md:px-4 font-semibold">
          <h4 className="w-8 min-w-[1.5rem] text-left">#</h4>
          <h4 className="flex w-[50vh] text-left truncate">Title</h4>
          <h4 className="w-[40vh] min-w-[6rem] text-left hidden sm:block truncate">
            Album
          </h4>
          <h4 className="w-32 min-w-[6rem] text-left hidden md:block truncate">
            Date Added
          </h4>
          <h4 className="ml-auto">
            <Clock3 size={25} />
          </h4>
        </div>
      </div>

      <div className="mt-4">
        <PlaylistCard count={0} />
      </div>
    </div>
  );
};

export default Playlist;
