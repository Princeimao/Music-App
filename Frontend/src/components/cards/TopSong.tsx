const TopSong = ({ spotifyId, title, artist, albumCover }) => {
  return (
    <div
      className="w-[40%] h-56 bg-[#404040] rounded-md p-5 text-white"
      id={spotifyId}
    >
      <div className="h-26 w-26 rounded bg-red-500">
        <img
          src={albumCover}
          alt="playlist_image"
          className="w-full h-full object-cover rounded"
        />
      </div>
      <h1 className="font-bold text-3xl mb-2 mt-4">{title}</h1>
      <h5 className="text-sm font-medium text-[#717171]">{artist}</h5>
    </div>
  );
};

export default TopSong;
