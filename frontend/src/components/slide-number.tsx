interface SlidesNumberProps {
  index: number;
}

export function SlidesNumber({ index }: SlidesNumberProps) {
  return (
    <div className="absolute bottom-4 left-4 bg-black/80 rounded-full w-[50px] h-[50px] flex items-center justify-center text-white text-base font-medium shadow-lg overflow-hidden">
      {index}
    </div>
  );
}
