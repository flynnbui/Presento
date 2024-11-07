import api from "@/config/axios";
import { Context } from "@/context";
import { randomUUID } from "crypto";
import { useContext } from "react";

async function postNewThread(name: string) {
    const { getters, setters } = useContext(Context);
    try {
        // Fetch current data
        const currentStore = getters.userData;
        const newPresentation = {
            name: name,
            pid: randomUUID(),
            history: [],
            slides: []
        };

        const updatedStore = {
            ...currentStore,
            presentations: [...currentStore.presentations, newPresentation]
        };

        const response = await api.put('/store', updatedStore);
        if (response && response.data) {
            setters.setUserData(response.data);
        }
    } catch (error) {
        console.error('Error updating store:', error);
    }
}