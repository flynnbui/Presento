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
import { postNewThread } from "@/services/presentationService"
import React, { useState } from "react"
import { Context, useContext } from "@/context";
import { message } from "antd";

export function NewDialog(props: { Button: React.ReactElement }) {
  const [name, setName] = useState("New Presentation");
  const [open, setOpen] = useState(false);

  const context = useContext(Context);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form submission
    try {
      await postNewThread(name, context);
      message.success("Success!");
      setOpen(false);
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
            <Label htmlFor="name" className="text-right">
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
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export function EditPresentationDialog(props: { Button: React.ReactElement }) {
  const [name, setName] = useState("New Presentation");
  const [open, setOpen] = useState(false);

  const context = useContext(Context);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form submission
    try {
      await postNewThread(name, context);
      message.success("Success!");
      setOpen(false);
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
            <Label htmlFor="name" className="text-right">
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
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
