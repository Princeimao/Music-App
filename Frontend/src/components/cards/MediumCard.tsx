const MediumCard = () => {
  return (
    <div className="w-[135.6px] h-[179.2px] rounded-sm py-3 flex flex-col items-center hover:bg-[#49494962] transition-all">
      {/* Replace div with image tag */}
      <div className="bg-amber-600 w-[115px] h-[129px] rounded" />
      <div className="w-full px-3 mt-1">
        <h4 className="text-sm font-medium text-[#717171]">Song Name</h4>
        <h5 className="text-sm font-medium text-[#717171]">Artist Name</h5>
      </div>
    </div>
  );
};

export default MediumCard;
