const TopSong = () => {
  const song = ["Alfaaz", "Gippy", "Grewal", "Sharry Mann", "Jaani"];
  return (
    <div className="w-[40%] h-56 bg-[#404040] rounded-md p-5 text-white">
      <div className="h-26 w-26 rounded bg-red-500"></div>
      <h1 className="font-bold text-3xl mb-2 mt-4">Hai Mera Dil</h1>
      {song.map((name, index) => (
        <h5
          key={index}
          className="text-sm font-medium text-[#717171] hover:underline inline-block"
        >
          {name}
          {index !== song.length - 1 && ",\u00A0"}
        </h5>
      ))}
    </div>
  );
};

export default TopSong;
