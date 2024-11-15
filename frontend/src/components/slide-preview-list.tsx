import { useRef } from "react";
import { Slide } from "@/helpers/serverHelpers";

interface SlidePreviewListProps {
  slides: Slide[];
  activeSlideIndex: number;
  onSlideSelect: (index: number) => void;
}

export function SlidePreviewList({
  slides,
  activeSlideIndex,
  onSlideSelect,
}: SlidePreviewListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSlideSelection = (index: number) => {
    onSlideSelect(index);

    // Get the container and selected slide
    const container = containerRef.current;
    const selectedSlide = container?.children[index] as HTMLElement;

    if (selectedSlide && container) {
      const containerWidth = container.offsetWidth;
      const slideWidth = selectedSlide.offsetWidth;
      const scrollPosition =
        selectedSlide.offsetLeft - containerWidth / 2 + slideWidth / 2;

      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full max-w-[calc(100vw-100px)] overflow-x-auto scrollbar-hide">
      <div ref={containerRef} className="flex flex-nowrap space-x-4 h-[200px]">
        {slides.map((slide, index) => (
          <SlidePreviewItem
            key={slide.sId}
            slide={slide}
            index={index}
            isActive={activeSlideIndex === index}
            onClick={() => handleSlideSelection(index)}
          />
        ))}
      </div>
    </div>
  );
}

interface SlidePreviewItemProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

function SlidePreviewItem({
  slide,
  index,
  isActive,
  onClick,
}: SlidePreviewItemProps) {
  return (
    <div
      className={`
        flex-shrink-0 
        aspect-video 
        w-[300px] 
        rounded-xl 
        bg-white 
        cursor-pointer 
        border-4
        ${isActive ? "border-blue-500" : "border-transparent"}
        hover:border-blue-200
        transition-colors
        duration-200
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between p-4">
        <div className="text-gray-400">{`Slide ${index + 1}`}</div>
        {isActive && (
          <span className="text-xs text-blue-500 font-medium">Active</span>
        )}
      </div>

      {slide.img && (
        <div className="px-4">
          <img
            src={slide.img}
            alt={`Slide ${index + 1}`}
            className="w-full h-auto object-contain"
          />
        </div>
      )}
    </div>
  );
}
