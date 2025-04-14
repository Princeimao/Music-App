import BigCard from "@/components/cards/BigCard";
//import ScrollableSection from "@/components/ui/ScrollableSection";
import dayjs from "dayjs";

const Home = () => {
  const dayName = dayjs().format("dddd");

  return (
    <div className="bg-[#2F2F2F] h-full w-full rounded-md px-8 py-3.5 text-white overflow-auto">
      <h1 className="font-semibold text-2xl hover:underline">
        It's New Music {dayName}!
      </h1>

      <BigCard />
    </div>
  );
};

export default Home;
