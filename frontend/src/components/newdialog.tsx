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

export function NewDialog(props: { Button: React.ReactElement }) {
  const [name, setName] = useState("New Presentation");
  const context = useContext(Context);
  const handleSubmit = () => {
    postNewThread(name, context);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
      {React.cloneElement(props.Button)}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
          <Button type="submit" onClick={() => handleSubmit()}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
