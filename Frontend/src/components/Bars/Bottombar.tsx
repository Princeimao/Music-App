import { House, LibraryBig, Search } from "lucide-react";

const Bottombar = () => {
  return (
    <div className="absolute bottom-0 w-full h-18 flex justify-between items-center px-9 bg-gradient-to-t from-black to-transparent">
      <div className="h-full text-white flex flex-col justify-center">
        <House size={32} strokeWidth={1.5} color="white" />
        <h4 className="text-[12px]">Home</h4>
      </div>

      <div className="h-full text-white flex flex-col justify-center">
        <Search size={32} strokeWidth={1.5} color="white" />
        <h4 className="text-[12px]">Search</h4>
      </div>

      <div className="h-full text-white flex flex-col justify-center">
        <LibraryBig size={32} strokeWidth={1.5} color="white" />
        <h4 className="text-[12px]">Library</h4>
      </div>
    </div>
  );
};

export default Bottombar;
