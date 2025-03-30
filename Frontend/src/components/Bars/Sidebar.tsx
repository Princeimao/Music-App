import { LibraryBig, Plus } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-[43vh] bg-[#2f2f2f] h-full rounded-md px-3 py-3">
      <div className="flex items-center ">
        <div className="flex w-full h-12 rounded-md items-center text-white gap-2 px-3 mt-1">
          <LibraryBig size={32} strokeWidth={1.5} color="white" />
          <h1 className="text-lg font-semibold">Your Library</h1>
        </div>
        <div className="w-12 h-10 flex items-center justify-center bg-[#282828] rounded-full">
          <Plus color="white" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
