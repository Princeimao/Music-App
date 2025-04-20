const PlaylistCard = ({ count = 0 }) => {
  return (
    <div className="w-full h-15 text-white hover hover:bg-[#54545462] rounded-sm flex items-center px-4 gap-4.5">
      <p>{count + 1}</p>
      <div className="flex items-center gap-4 w-[49vh]">
        <div className="bg-orange-400 w-11 h-11 rounded" />

        <div>
          <h4 className="text-sm md:text-base font-semibold hover:underline">
            Wavy
          </h4>
          <h4 className="text-xs md:text-sm text-[#757575] hover:underline font-semibold">
            Karan Aujla
          </h4>
        </div>
      </div>

      <h4 className="text-sm md:text-base font-semibold hover:underline w-[37vh]">
        Wavy
      </h4>

      <h4 className="text-sm md:text-base font-semibold hover:underline">
        Mar 17, 2023
      </h4>

      <h4 className="text-sm md:text-base font-semibold hover:underline ml-auto">
        2:42
      </h4>
    </div>
  );
};

export default PlaylistCard;
