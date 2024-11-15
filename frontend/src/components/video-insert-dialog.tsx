import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ContextType } from "@/context";
import { videoEdit, videoInsert } from "@/services/slideService";

interface VideoInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSlide: string | null;
  context: ContextType;
  pId: string | undefined;
}

interface VideoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSlide: string | null;
  activeElement: string;
  context: ContextType;
  pId: string | undefined;
}

export function EditVideoDialog({
  open,
  onOpenChange,
  activeSlide,
  activeElement,
  context,
  pId,
}: VideoEditDialogProps) {
  const userData = context.getters.userData;
  const presentations = userData ? userData.presentations : [];
  const slides = presentations.find((p) => p.pId === pId)?.slides;
  const elements = slides ? slides.find((s) => s.sId)?.elements : [];
  const element = elements?.find((e) => e.id === activeElement);

  const videoUrlStart = element ? (element.content ? element.content : "") : ("");
  const [videoUrl, setVideoUrl] = useState(videoUrlStart)

  const widthStart = element ? element.width.toString() : "20";
  const [width, setWidth] = useState(widthStart)
  
  const heightStart = element ? element.height.toString() : "20";
  const [height, setHeight] = useState(heightStart)

  const autoplayStart = element ? (element.autoplay ? element.autoplay : "false") : ("false");
  const [autoplay, setAutoplay] = useState(autoplayStart)

  const handleVideoSubmit = async () => {
    await videoEdit(
      activeSlide,
      activeElement,
      context,
      videoUrl,
      width,
      height,
      autoplay,
      pId
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Text</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-url" className="text-right">
              Video URL
            </Label>
            <Input
              id="video-url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-width" className="text-right">
              Width
            </Label>
            <Input
              id="video-width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-height" className="text-right">
              Height
            </Label>
            <Input
              id="video-height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-autoplay" className="text-right">
              Autoplay
            </Label>
            <Input
              id="video-autoplay"
              type="radio"
              value="true"
              checked={autoplay === "true"}
              onChange={(e) => setAutoplay(e.target.value)}
              className="col-span-1 h-10"
            />
            <Input
              id="video-autoplay"
              type="radio"
              value="false"
              checked={autoplay === "false"}
              onChange={(e) => setAutoplay(e.target.value)}
              className="col-span-1 h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleVideoSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function VideoInsertDialog({
  open,
  onOpenChange,
  activeSlide,
  context,
  pId,
}: VideoInsertDialogProps) {
  const [videoUrl, setVideoUrl] = useState("");
  const [width, setWidth] = useState("20");
  const [height, setHeight] = useState("20");
  const [autoplay, setAutoplay] = useState("false");

  const handleVideoSubmit = async () => {
    await videoInsert(
      activeSlide,
      context,
      videoUrl,
      width,
      height,
      autoplay,
      pId
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Video</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-url" className="text-right">
              Video URL
            </Label>
            <Input
              id="video-url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-width" className="text-right">
              Width
            </Label>
            <Input
              id="video-width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-height" className="text-right">
              Height
            </Label>
            <Input
              id="video-height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-autoplay" className="text-right">
              Autoplay
            </Label>
            <Input
              id="video-autoplay"
              type="radio"
              value="true"
              checked={autoplay === "true"}
              onChange={(e) => setAutoplay(e.target.value)}
              className="col-span-1 h-10"
            />
            <Input
              id="video-autoplay"
              type="radio"
              value="false"
              checked={autoplay === "false"}
              onChange={(e) => setAutoplay(e.target.value)}
              className="col-span-1 h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleVideoSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
