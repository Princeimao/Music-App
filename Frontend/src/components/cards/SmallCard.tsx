const SmallCard = () => {
  return (
    <div className="group w-full h-18 rounded-md flex items-center px-1.5 py-1.5 hover:bg-[#49494962] gap-2.5">
      <div className="w-13 h-13 bg-black rounded"></div>

      <div>
        <h1 className="text-white font-semibold">Liked Song</h1>
        <div className="flex gap-1.5">
          <h5 className="text-sm font-medium text-[#717171]">Playlist </h5>
          <h5 className="text-sm font-medium text-[#717171]">-</h5>
          <h5 className="text-sm font-medium text-[#717171]">Prince Gupta</h5>
        </div>
      </div>
    </div>
  );
};

export default SmallCard;
