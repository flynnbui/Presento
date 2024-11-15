import api from "@/config/axios";
import { ContextType } from "../context";
import { Store, Presentation } from "@/helpers/serverHelpers";
import { v4 as randomUUID } from "uuid";

export async function newPresentation(
  name: string,
  description: string,
  thumbnail: string,
  context: ContextType
) {
  const { getters, setters } = context;
  // Fetch current data
  const currentStore: Store | undefined = getters.userData;
  const newPresentation: Presentation = {
    name: name,
    description: description,
    pId: randomUUID(),
    history: [],
    slides: [],
    thumbnail: thumbnail,
  };
  if (currentStore) {
    const updatedStore: Store = {
      ...currentStore,
      presentations: [...currentStore.presentations, newPresentation],
    };

    const response = await api.put("/store", { store: updatedStore });
    if (response && response.data) {
      setters.setUserData(updatedStore);
      return newPresentation.pId;
    }
  } else {
    console.log(currentStore);
    console.error("Error updating store: userData does not exist");
  }
}

export async function deletePresentation(
  pId: string,
  setUserData: React.Dispatch<React.SetStateAction<Store | undefined>>,
  userData?: Store
) {
  if (userData) {
    const updatedPresentations: Presentation[] = userData.presentations.filter(
      (presentation) => presentation.pId !== pId
    );
    const updatedUserData: Store = {
      ...userData,
      presentations: updatedPresentations,
    };
    setUserData(updatedUserData);
    await api.put("/store", { store: updatedUserData });
  }
}

export async function changePresentationName(
  pId: string,
  name: string,
  setUserData: React.Dispatch<React.SetStateAction<Store | undefined>>,
  userData?: Store
) {
  if (userData) {
    const updatedPresentations: Presentation[] = userData.presentations.map(
      (p) => {
        if (p.pId === pId) {
          p.name = name;
        }
        return p;
      }
    );
    const updatedUserData: Store = {
      ...userData,
      presentations: updatedPresentations,
    };
    setUserData(updatedUserData);
    await api.put("/store", { store: updatedUserData });
  }
}

export async function changePresentationThumbnail(
  pId: string,
  thumbnail: string,
  setUserData: React.Dispatch<React.SetStateAction<Store | undefined>>,
  userData?: Store
) {
  if (userData) {
    const updatedPresentations: Presentation[] = userData.presentations.map(
      (p) => {
        if (p.pId === pId) {
          p.thumbnail = thumbnail;
        }
        return p;
      }
    );
    const updatedUserData: Store = {
      ...userData,
      presentations: updatedPresentations,
    };
    setUserData(updatedUserData);
    await api.put("/store", { store: updatedUserData });
  }
}
