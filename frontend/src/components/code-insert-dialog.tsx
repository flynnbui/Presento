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
import { Textarea } from "@/components/ui/textarea";

import { ContextType } from "@/context";
import { codeInsert } from "@/services/slideService";

interface CodeInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSlide: string | null;
  context: ContextType;
  pId: string | undefined;
}


export function CodeInsertDialog({
  open,
  onOpenChange,
  activeSlide,
  context,
  pId,
}: CodeInsertDialogProps) {
  const [codeContent, setCodeContent] = useState("");
  const [width, setWidth] = useState("20");
  const [height, setHeight] = useState("20");
  const [fontSize, setFontSize] = useState("1");

  const handleCodeSubmit = async () => {
    await codeInsert(
      activeSlide,
      context,
      codeContent,
      width,
      height,
      fontSize,
      pId
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Code Block</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code-content" className="text-right">
              Code
            </Label>
            <Textarea
              id="code-content"
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
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
            <Label htmlFor="code-font-size" className="text-right">
              Font Size
            </Label>
            <Input
              id="code-font-size"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="col-span-1 h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCodeSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
