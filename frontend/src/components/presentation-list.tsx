import { Context, useContext } from "@/context"
import { useEffect, useState } from "react"
//import { useNavigate } from "react-router-dom"

export type PresentationCard = {
  id: string
  thumbnail: string
  name: string
  slideNumber: number
}

function dataToCard(data: PresentationCard[], name?: string) {
  //const navigate = useNavigate()
  //http://localhost:3000/

  let content: JSX.Element[] = data.map(c => {
    return (
      <div className="w-full aspect-[2/1] rounded-xl bg-zinc-800/50 flex flex-row">
        <div className="h-[100%] w-[50%] bg-gray-700"></div>
        <div className="h-[100%] w-[50%] flex flex-col justify-start">
          <div className="text-white/80 text-wrap text-1xl ml-4 mt-3">{c.name}</div>
          <div className="text-white/60 text-wrap text-1xl ml-4">{c.slideNumber} slides</div>
          <div className="text-white/80 text-wrap text-sm mt-auto pb-5 ml-auto mr-5">Owned by: {name? name : "Unknown user"}</div>
        </div>
      </div>
    )
  })
  return(
    content
  )
}

export function PresentationCards() {
  const [data, setData] = useState<PresentationCard[]>([])
  const [cards, setCards] = useState<JSX.Element[]>([])
  const { getters } = useContext(Context)
  const presentationData = getters.userData?.presentations
  const userName = getters.userData?.user.name
  useEffect(() =>  {
    setData(presentationData ? presentationData?.map(p => ({id: p.pId, thumbnail: p.thumbnail, name: p.name,  slideNumber: p.slides.length})) : [])
  }, [presentationData])
  useEffect(() =>  {
    setCards(dataToCard(data, userName))
  }, [data])

  return (
    <div className="overflow-auto max-h-[100%] h-full grid auto-rows-min gap-4 md:grid-cols-2  ms:grid-cols-1">
      {cards}
    </div>
  )
}