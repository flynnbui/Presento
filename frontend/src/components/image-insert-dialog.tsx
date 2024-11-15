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
import { imageEdit, imageInsert } from "@/services/slideService";

interface ImageInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSlide: string | null;
  context: ContextType;
  pId: string | undefined;
}

interface ImageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSlide: string | null;
  activeElement: string;
  context: ContextType;
  pId: string | undefined;
}

export function EditImageDialog({
  open,
  onOpenChange,
  activeSlide,
  activeElement,
  context,
  pId,
}: ImageEditDialogProps) {
  const userData = context.getters.userData;
  const presentations = userData ? userData.presentations : [];
  const slides = presentations.find((p) => p.pId === pId)?.slides;
  const elements = slides ? slides.find((s) => s.sId)?.elements : [];
  const element = elements?.find((e) => e.id === activeElement);

  const contentStart = element ? (element.content ? element.content : "") : ""
  const [content, setContent] = useState(contentStart)

  const widthStart = element ? element.width.toString() : "10";
  const [width, setWidth] = useState(widthStart)
  
  const heightStart = element ? element.height.toString() : "10";
  const [height, setHeight] = useState(heightStart)

  const descriptionStart = element ? (element.alt ? element.alt : "this is an image") : ("this is an image");
  const [description, setDescription] = useState(descriptionStart)

  const handleImageSubmit = async () => {
    await imageEdit(
      activeSlide,
      activeElement,
      context,
      content,
      width,
      height,
      description,
      pId
    );
    onOpenChange(false);
  };

  const handleFileInsert = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const img = e.target.files[0];
      if (img) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setContent(reader.result.toString());
          } else {
            setContent("");
          }
        };
        reader.readAsDataURL(img);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="img-input" className="img-right">
              Image Source
            </Label>
            <Input
              id="img-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="img-file" className="img-right">
              Import File
            </Label>
            <Input
              id="img-file"
              type="file"
              accept="image/*"
              onChange={handleFileInsert}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="img-width" className="img-right">
              Width
            </Label>
            <Input
              id="img-width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="img-height" className="img-right">
              Height
            </Label>
            <Input
              id="img-height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="img-description" className="img-right">
              Description
            </Label>
            <Input
              id="img-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleImageSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ImageInsertDialog({
  open,
  onOpenChange,
  activeSlide,
  context,
  pId,
}: ImageInsertDialogProps) {
  const [content, setContent] = useState("");
  const [width, setWidth] = useState("10");
  const [height, setHeight] = useState("10");
  const [description, setDescription] = useState("this is an image");

  const handleImageSubmit = async () => {
    await imageInsert(
      activeSlide,
      context,
      content,
      width,
      height,
      description,
      pId
    );
    onOpenChange(false);
  };

  const handleFileInsert = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const img = e.target.files[0];
      if (img) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setContent(reader.result.toString());
          } else {
            setContent("");
          }
        };
        reader.readAsDataURL(img);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="img-input" className="img-right">
              Image Source
            </Label>
            <Input
              id="img-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="img-file" className="img-right">
              Import File
            </Label>
            <Input
              id="img-file"
              type="file"
              accept="image/*"
              onChange={handleFileInsert}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="img-width" className="img-right">
              Width
            </Label>
            <Input
              id="img-width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="img-height" className="img-right">
              Height
            </Label>
            <Input
              id="img-height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="img-description" className="img-right">
              Description
            </Label>
            <Input
              id="img-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleImageSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
