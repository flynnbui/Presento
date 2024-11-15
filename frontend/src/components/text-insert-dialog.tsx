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
import { textInsert, textEdit } from "@/services/slideService";

interface TextInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSlide: string | null;
  context: ContextType;
  pId: string | undefined;
}

interface TextEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSlide: string | null;
  activeElement: string;
  context: ContextType;
  pId: string | undefined;
}

export function EditTextDialog({
  open,
  onOpenChange,
  activeSlide,
  activeElement,
  context,
  pId,
}: TextEditDialogProps) {
  const userData = context.getters.userData;
  const presentations = userData ? userData.presentations : [];
  const slides = presentations.find((p) => p.pId === pId)?.slides;
  const elements = slides ? slides.find((s) => s.sId)?.elements : [];
  const element = elements?.find((e) => e.id === activeElement);

  const textValueStart =element ? (element.content ? element.content : "") : ("");
  const [textValue, setTextValue] = useState(textValueStart)

  const textSizeStart =element ? (element.fontSize ? element.fontSize.toString() : "16") : ("16");
  const [textSize, setTextSize] = useState(textSizeStart)

  const widthStart = element ? element.width.toString() : "10";
  const [width, setWidth] = useState(widthStart)
  
  const heightStart = element ? element.height.toString() : "10";
  const [height, setHeight] = useState(heightStart)

  const textColorStart =element ? (element.color ? element.color : "#000000") : ("#000000");
  const [color, setColor] = useState(textColorStart)
    

  const handleTextSubmit = async () => {
    console.log("EDIT");
    await textEdit(
      activeSlide,
      activeElement,
      context,
      textValue,
      textSize,
      width,
      height,
      color,
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
            <Label htmlFor="text-input" className="text-right">
              Text
            </Label>
            <Input
              id="text-input"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text-size" className="text-right">
              Text Size
            </Label>
            <Input
              id="text-size"
              value={textSize}
              onChange={(e) => setTextSize(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text-width" className="text-right">
              Width
            </Label>
            <Input
              id="text-width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text-height" className="text-right">
              Height
            </Label>
            <Input
              id="text-height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text-color" className="text-right">
              Color
            </Label>
            <Input
              id="text-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="col-span-3 h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleTextSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TextInsertDialog({
  open,
  onOpenChange,
  activeSlide,
  context,
  pId,
}: TextInsertDialogProps) {
  const [textValue, setTextValue] = useState("");
  const [textSize, setTextSize] = useState("16");
  const [width, setWidth] = useState("10");
  const [height, setHeight] = useState("10");
  const [color, setColor] = useState("#000000");

  const handleTextSubmit = async () => {
    await textInsert(
      activeSlide,
      context,
      textValue,
      textSize,
      width,
      height,
      color,
      pId
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Text</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text-input" className="text-right">
              Text
            </Label>
            <Input
              id="text-input"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text-size" className="text-right">
              Text Size
            </Label>
            <Input
              id="text-size"
              value={textSize}
              onChange={(e) => setTextSize(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text-width" className="text-right">
              Width
            </Label>
            <Input
              id="text-width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text-height" className="text-right">
              Height
            </Label>
            <Input
              id="text-height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text-color" className="text-right">
              Color
            </Label>
            <Input
              id="text-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="col-span-3 h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleTextSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
