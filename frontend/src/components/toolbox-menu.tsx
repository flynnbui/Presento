import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { ContextType } from "@/context";
import { TextInsertDialog } from "./text-insert-dialog";
import { ImageInsertDialog } from "./image-insert-dialog";
import { VideoInsertDialog } from "./video-insert-dialog";
import { CodeInsertDialog } from "./code-insert-dialog";

interface ToolboxButton {
  title: string;
  onClick: () => void;
  icon: React.ElementType;
}

interface CustomToolboxMenubarProps {
  buttons?: ToolboxButton[];
  activeSlide: string | null;
  context: ContextType;
  pId: string | undefined;
}

export default function ToolboxMenubar({
  buttons = [],
  activeSlide,
  context,
  pId,
}: CustomToolboxMenubarProps) {
  const [textInsertDialog, setTextInsertDialog] = useState(false);
  const [imageInsertDialog, setImageInsertDialog] = useState(false);
  const [videoInsertDialog, setVideoInsertDialog] = useState(false);
  const [codeInsertDialog, setCodeInsertDialog] = useState(false);

  function InsertTextDialog() {
    return (
      <TextInsertDialog
        open={textInsertDialog}
        onOpenChange={setTextInsertDialog}
        activeSlide={activeSlide}
        context={context}
        pId={pId}
      />
    );
  }

  function InsertImageDialog() {
    return (
      <ImageInsertDialog
        open={imageInsertDialog}
        onOpenChange={setImageInsertDialog}
        activeSlide={activeSlide}
        context={context}
        pId={pId}
      />
    );
  }

  function InsertVideoDialog() {
    return (
      <VideoInsertDialog
        open={videoInsertDialog}
        onOpenChange={setVideoInsertDialog}
        activeSlide={activeSlide}
        context={context}
        pId={pId}
      />
    );
  }

  function InsertCodeDialog() {
    return (
      <CodeInsertDialog
        open={codeInsertDialog}
        onOpenChange={setCodeInsertDialog}
        activeSlide={activeSlide}
        context={context}
        pId={pId}
      />
    );
  }

  function openDialog(type: string) {
    console.log(textInsertDialog);
    switch (type) {
    case "Insert Text":
      setTextInsertDialog(true);
      break;
    case "Insert Image":
      setImageInsertDialog(true);
      break;
    case "Insert Video":
      setVideoInsertDialog(true);
      break;
    case "Insert Code":
      setCodeInsertDialog(true);
      break;
    default:
      break;
    }
  }

  return (
    <TooltipProvider>
      <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 bg-black rounded-lg shadow-lg p-2 flex space-x-2">
        {buttons.map((button, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  button.onClick();
                  openDialog(button.title);
                }}
                className="h-10 w-10 text-white hover:bg-gray-300"
              >
                <button.icon className="h-5 w-5" />
                <span className="sr-only">{button.title}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{button.title}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      {<InsertTextDialog />}
      {<InsertImageDialog />}
      {<InsertVideoDialog />}
      {<InsertCodeDialog />}
    </TooltipProvider>
  );
}
