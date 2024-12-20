import { Context, useContext } from "@/context";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronsUpDown } from "lucide-react";
import { Store } from "@/helpers/serverHelpers";
import {
  changePresentationName,
  changePresentationThumbnail,
  deletePresentation,
} from "@/services/presentationService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type PresentationCard = {
  id: string;
  thumbnail: string;
  name: string;
  slideNumber: number;
  description: string;
};

export function PresentationMenu(props: {
  trigger: JSX.Element;
  cardInfo: PresentationCard;
  setUserData: React.Dispatch<React.SetStateAction<Store | undefined>>;
  userData?: Store;
}) {
  const [editField, setEditField] = useState("");
  const [nameField, setName] = useState(props.cardInfo.name);
  const [thumbnailField, setThumbnail] = useState(props.cardInfo.thumbnail);
  const [dialogOpen, setDialogOpen] = useState(false);

  function resetFields() {
    setName(props.cardInfo.name);
    setThumbnail(props.cardInfo.thumbnail);
  }

  function handleEdit() {
    if (editField === "name") {
      if (props.userData) {
        changePresentationName(
          props.cardInfo.id,
          nameField,
          props.setUserData,
          props.userData
        );
      }
    } else {
      changePresentationThumbnail(
        props.cardInfo.id,
        thumbnailField,
        props.setUserData,
        props.userData
      );
    }
    setDialogOpen(false);
  }

  const handleFileInsert = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const img = e.target.files[0];
      if (img) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setThumbnail(reader.result.toString());
          } else {
            setThumbnail("");
          }
        };
        reader.readAsDataURL(img);
      }
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          {props.trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Edit/Delete</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="focus:bg-zinc-200"
            onClick={() => {
              resetFields();
              setEditField("name");
              setDialogOpen(true);
            }}
          >
            <DialogTrigger className="w-full h-full text-left cursor-default">
              Edit Presentation Name
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="focus:bg-zinc-200"
            onClick={() => {
              resetFields();
              setEditField("thumbnail");
              setDialogOpen(true);
            }}
          >
            <DialogTrigger className="w-full h-full text-left cursor-default">
              Edit Presentation Thumbnail
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="focus:bg-zinc-200"
            onClick={() => {
              deletePresentation(
                props.cardInfo.id,
                props.setUserData,
                props.userData
              );
            }}
          >
            Delete Presentation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Presentation</DialogTitle>
          <DialogDescription>
            Enter a new {editField === "name" ? "name" : "thumbnail"} to your
            presentation here. Click update when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 grid-rows-2 items-center gap-4">
            <div className="row-start-1 col-span-4">
              <Label htmlFor="editField" className="text-right">
                {editField === "name" ? "Name" : "Thumbnail"}
              </Label>
              <Input
                id="editField"
                value={editField === "name" ? nameField : thumbnailField}
                onChange={(e) =>
                  editField === "name"
                    ? setName(e.target.value)
                    : setThumbnail(e.target.value)
                }
                className="col-span-3"
              />
            </div>
            {editField === "name" ? null : <div className="row-start-2 col-span-4">
              <Label htmlFor="import-field" className="text-right">
                Import
              </Label>

              <Input
                id="import-field"
                type="file"
                accept="image/*"
                onChange={handleFileInsert}
                className="col-span-3"
              />
            </div>}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => handleEdit()}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function dataToCard(
  data: PresentationCard[],
  navigate: NavigateFunction,
  setUserData: React.Dispatch<React.SetStateAction<Store | undefined>>,
  userData?: Store,
  name?: string
) {
  function validateThumbnail(thumbnail: string) {
    const img = new Image();
    img.onload = () => {
      return true;
    };
    img.onerror = () => {
      return false;
    };
    img.src = thumbnail;
    return img;
  }

  const content: JSX.Element[] = data.map((c) => {
    let thumbnailDiv = null;
    if (validateThumbnail(c.thumbnail)) {
      thumbnailDiv = (
        <img
          src={`${c.thumbnail}`}
          alt="thumbnail"
          className="w-full h-full"
        ></img>
      );
      if (c.thumbnail === "") {
        thumbnailDiv = null;
      }
    }
    return (
      <div
        key={c.id}
        className="w-full aspect-[2/1] rounded-xl bg-zinc-800/50 flex flex-row hover:border-2 hover:border-blue-500 transition-shadow duration-300 overflow-hidden"
        onClick={() => navigate(`/presentation/${c.id}`)}
      >
        <div className="h-[100%] w-[50%] bg-gray-700">{thumbnailDiv}</div>
        <div className="h-[100%] w-[50%] flex flex-col justify-start overflow-hidden">
          <div
            className="text-white/80 ml-auto mt-[5%] mr-[5%]"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <PresentationMenu
              trigger={
                <ChevronsUpDown className="hover:bg-zinc-700 hover:rounded" />
              }
              cardInfo={c}
              setUserData={setUserData}
              userData={userData}
            />
          </div>
          <div className="text-white/80 text-wrap sm:text-sm md:text-1xl ml-4 text-center my-auto">
            {c.name}
          </div>
          <div className="text-white/60 text-wrap sm:text-sm md:text-1xl ml-2 text-center">
            {c.description}
          </div>
          <div className="text-white/60 text-wrap sm:text-sm md:text-1xl ml-2 text-center">
            {c.slideNumber} slides
          </div>
          <div className="text-white/80 text-wrap sm:text-xs md:text-sm mt-auto pb-[5%] ml-auto mr-[5%] italic">
            Creator: {name ? name : "Unknown user"}
          </div>
        </div>
      </div>
    );
  });
  return content;
}

export function PresentationCards() {
  const navigate = useNavigate();
  const [data, setData] = useState<PresentationCard[]>([]);
  const [cards, setCards] = useState<JSX.Element[]>([]);
  const { getters, setters } = useContext(Context);
  const userData = getters.userData;
  const presentationData = getters.userData?.presentations;
  const userName = getters.userData?.user.name;
  const setUserData = setters.setUserData;

  useEffect(() => {
    setData(
      presentationData
        ? presentationData?.map((p) => ({
          id: p.pId,
          thumbnail: p.thumbnail,
          name: p.name,
          slideNumber: p.slides.length,
          description: p.description,
        }))
        : []
    );
  }, [presentationData]);
  useEffect(() => {
    setCards(dataToCard(data, navigate, setUserData, userData, userName));
  }, [data]);

  return (
    <div className="overflow-auto max-h-[100%] h-full grid auto-rows-min gap-4 md:grid-cols-2  ms:grid-cols-1">
      {cards}
    </div>
  );
}
