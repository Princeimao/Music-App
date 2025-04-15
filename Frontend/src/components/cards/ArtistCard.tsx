const ArtistCard = () => {
  return (
    <div className="w-46 h-58 rounded-sm py-3 flex flex-col items-center hover:bg-[#49494962] transition-all">
      {/* Replace div with image tag */}
      <div className="bg-amber-600 w-40 h-46 rounded-full" />
      <div className="w-full px-3 mt-1">
        <h4 className="text-sm font-medium text-[#717171]">Song Name</h4>
        <h5 className="text-sm font-medium text-[#717171]">Artist Name</h5>
      </div>
    </div>
  );
};

export default ArtistCard;
