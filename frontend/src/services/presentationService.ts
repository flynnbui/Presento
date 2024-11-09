import api from "@/config/axios";
import { ContextType } from "../context";
import { Store, Presentation } from "@/helpers/serverHelpers";
import { v4 as randomUUID } from "uuid";

async function postNewThread(name: string, context: ContextType) {
    const { getters, setters } = context
        // Fetch current data
        const currentStore: Store | undefined = getters.userData;
        const newPresentation: Presentation = {
            name: name,
            pId: randomUUID(),
            history: [],
            slides: [],
            thumbnail: ""
        };
        if (currentStore) {
            const updatedStore: Store = {
                ...currentStore,
                presentations: [...currentStore.presentations, newPresentation]
            };
    
            const response = await api.put('/store', { store: updatedStore});
            if (response && response.data) {
                setters.setUserData(updatedStore);
                return "Success";
            }
        } else {
            console.log(currentStore);
            console.error('Error updating store: userData does not exist');
        }
}

async function deletePresentation(pId: string, setUserData: React.Dispatch<React.SetStateAction<Store | undefined>>, userData?: Store) {
    if (userData) {
        const updatedPresentations: Presentation[] = userData.presentations.filter(presentation => presentation.pId !== pId);
        const updatedUserData: Store = {
            ...userData,
            presentations: updatedPresentations
        }
        setUserData(updatedUserData);
        await api.put('/store', {store: updatedUserData})
    }
}

export { postNewThread, deletePresentation }