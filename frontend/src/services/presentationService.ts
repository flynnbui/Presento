import api from "@/config/axios";
import { ContextType } from "@/context";
import { Store } from "@/helpers/serverHelpers";
import { v4 as randomUUID } from "uuid";

async function postNewThread(name: string, context: ContextType) {
    const { getters, setters } = context
    try {
        // Fetch current data
        const currentStore: Store | undefined = getters.userData;
        const newPresentation = {
            name: name,
            pid: randomUUID(),
            history: [],
            slides: []
        };
        if (currentStore) {
            const updatedStore = {
                ...currentStore,
                presentations: [...currentStore.presentations, newPresentation]
            };
    
            const response = await api.put('/store', updatedStore);
            if (response && response.data) {
                setters.setUserData(response.data);
            }
        } else {
            console.error('Error updating store: userData does not exist');
        }
    } catch (error) {
        console.error('Error updating store:', error);
    }
}

export { postNewThread }