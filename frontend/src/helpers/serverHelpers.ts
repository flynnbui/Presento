const PORT = 5005

export function fetchBackend(route: string, method: string, option?: Object) {
    const token = localStorage.getItem('token')

    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    if (token !== null) {
        headers.append('Authorization', token);
    }
    return fetch(`http://127.0.0.1:${PORT}${route}`, {
        method: method,
        body: method == "GET" ? undefined : JSON.stringify(option),
        headers: headers
    })
}

export function fetchStore() {
    return fetchBackend('/store', 'GET')
            .then(response => {
                if (!response.ok) {
                    console.log('Failed to fetch store');
                } else {
                    return response.json()
                }
            })
}

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