import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { newPresentation } from "@/services/presentationService"
import React, { useEffect, useState } from "react"
import { Context, useContext } from "@/context";
import { message } from "antd";
import { newSlide } from "@/services/slideService"
import { fileToDataUrl } from "@/helpers/serverHelpers"

export function NewDialog(props: { Button: React.ReactElement }) {
  const [name, setName] = useState("New Presentation");
  const [description, setDescription] = useState("New Description");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingSlideCreation, setPendingSlideCreation] = useState<string | null>(null);
  const context = useContext(Context);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setThumbnail(event.target.files[0]);
    }
  };


  useEffect(() => {
    if (pendingSlideCreation) {
      const createSlide = async () => {
        const slide = await newSlide(pendingSlideCreation, context);
        if (slide === "Success") {
          console.log("Slide created successfully.");
        }
        setPendingSlideCreation(null);
      };
      createSlide();
    }
  }, [pendingSlideCreation, context]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form submission
    try {
      let image = "";
      if(thumbnail) {
        image = await fileToDataUrl(thumbnail);
      }
      const pId = await newPresentation(name, description, image, context);
      if (pId) {
        setPendingSlideCreation(pId);
        message.success("Success!");
        setOpen(false);
        setName("New Presentation")
        setDescription("New Description")
        setThumbnail(null)
      }
    } catch (e) {
      const error = e as { response: { data: { error: string } } };
      console.log("Error when creating new thread: ", error);
      message.error(`Error: ${error.response?.data?.error || 'Unknown error occurred'}`);
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {React.cloneElement(props.Button)}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New presentation</DialogTitle>
            <DialogDescription>
              Enter name to your presentation here. Click create when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Picture</Label>
                <Input
                  id="picture"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}