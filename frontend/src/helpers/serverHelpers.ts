interface User {
    email: string,
    name: string, 
    presentations: number[]
}

interface Presentation {
    pId: string,
    history: number[],
    slides: Slide[]
}

interface Slide {
    sId: string,
    img: string,
    elements: Element[]
}

interface Element {
    eId: string,
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
    hId: string,
    timestamp: number,
    slides: Slide[]
}

interface Store {
    user: User,
    presentations: Presentation[],
    history: History[]
}

// export function updateStore(user: User, presentations: Presentation[], history: History[]) {
//     fetchBackend('/store', 'PUT', {
//         store: {
//           user: user,
//           presentations: presentations,
//           history: history
//         }
//     })
// }

export type { Store, Presentation }