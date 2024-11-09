import { Context, useContext } from "@/context"
import { useEffect, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronsUpDown } from "lucide-react"

export type PresentationCard = {
  id: string
  thumbnail: string
  name: string
  slideNumber: number
}

function PresentationMenu(icon: JSX.Element, cardInfo: PresentationCard) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">{icon}</DropdownMenuTrigger>
      <DropdownMenuContent onClick={(event) => {event.stopPropagation()}} >
        <DropdownMenuLabel>Edit/Delete</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="focus:bg-zinc-200">Edit Presentation Name {cardInfo.name} IGNORE THIS U IDIOT</DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-zinc-200">Edit Presentation Thumbnail</DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-zinc-200" onClick={() => {}}>Delete Presentation</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>)
}

function dataToCard(data: PresentationCard[], navigate: NavigateFunction, name?: string, ) {

  let content: JSX.Element[] = data.map(c => {
    return (
      <div key={c.id} className="w-full aspect-[2/1] rounded-xl bg-zinc-800/50 flex flex-row hover:shadow-[inset_0_0_15px_5px_rgba(0,149,246,0.5)] transition-shadow duration-300"
        onClick={() => navigate(`presentation/${c.id}`)}>
        <div className="h-[100%] w-[50%] bg-gray-700"></div>
        <div className="h-[100%] w-[50%] flex flex-col justify-start overflow-hidden">
          <div className="text-white/80 ml-auto mt-[5%] mr-[5%]">{PresentationMenu(<ChevronsUpDown className="hover:bg-zinc-700 hover:rounded"/>, c, navigate)}</div>
          <div className="text-white/80 text-wrap sm:text-sm md:text-1xl ml-4 text-center my-auto">{c.name}</div>
          <div className="text-white/60 text-wrap sm:text-sm md:text-1xl ml-4 text-center">{c.slideNumber} slides</div>
          <div className="text-white/80 text-wrap sm:text-xs md:text-sm mt-auto pb-[5%] ml-auto mr-[5%] italic">Creator: {name? name : "Unknown user"}</div>
        </div>
      </div>)
  })
  return(
    content
  )
}

export function PresentationCards() {
  const navigate = useNavigate()
  const [data, setData] = useState<PresentationCard[]>([])
  const [cards, setCards] = useState<JSX.Element[]>([])
  const { getters } = useContext(Context)
  const presentationData = getters.userData?.presentations
  const userName = getters.userData?.user.name
  useEffect(() =>  {
    setData(presentationData ? presentationData?.map(p => ({id: p.pId, thumbnail: p.thumbnail, name: p.name,  slideNumber: p.slides.length})) : [])
  }, [presentationData])
  useEffect(() =>  {
    setCards(dataToCard(data, navigate, userName))
  }, [data])

  return (
    <div className="overflow-auto max-h-[100%] h-full grid auto-rows-min gap-4 md:grid-cols-2  ms:grid-cols-1">
      {cards}
    </div>
  )
}