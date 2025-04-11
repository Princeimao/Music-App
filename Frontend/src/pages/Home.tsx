import BigCard from "@/components/cards/BigCard";

const Home = () => {
  return (
    <div className="bg-[#2F2F2F] h-[100%] w-full rounded-md px-8 py-3.5 text-white">
      <h1 className="font-semibold text-2xl hover:underline">
        It's New Music Friday!
      </h1>
      <BigCard />
    </div>
  );
};

export default Home;
