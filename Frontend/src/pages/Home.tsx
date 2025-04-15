import dayjs from "dayjs";

import BigCard from "@/components/cards/BigCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Home = () => {
  const dayName = dayjs().format("dddd");

  return (
    <div className="bg-[#2F2F2F] h-full w-full rounded-md px-8 py-3.5 text-white overflow-auto">
      <h1 className="font-semibold text-2xl hover:underline">
        It's New Music {dayName}!
      </h1>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full group"
      >
        <CarouselContent className="w-full">
          {Array.from({ length: 9 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="lg:basis-1/6 md:basis-1/3 basis-1/2"
            >
              <BigCard />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="group-hover:opacity-100 opacity-0 ml-8 bg-[#2F2F2F] border-none" />
        <CarouselNext className="group-hover:opacity-100 opacity-0 mr-8 bg-[#2F2F2F] border-none" />
      </Carousel>
    </div>
  );
};

export default Home;
