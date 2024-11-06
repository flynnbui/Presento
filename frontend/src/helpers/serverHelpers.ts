interface User {
    email: string,
    name: string, 
    presentations: number[]
}

interface Presentation {
    pId: number,
    history: number[],
    slides: Slide[]
}

interface Slide {
    sId: number,
    img: string,
    elements: Element[]
}

interface Element {
    eId: number,
    zIndex: number,
    x: number,
    y: number,
    width: number,
    height: number,
    color?: string,
    fontFamily?: string,
    textSize?: number,
}

interface History {
    hId: number,
    timestamp: number,
    slides: Slide[]
}

export function updateStore(user: User, presentations: Presentation[], history: History[]) {
    fetchBackend('/store', 'PUT', {
        store: {
          user: user,
          presentations: presentations,
          history: history
        }
    })
}