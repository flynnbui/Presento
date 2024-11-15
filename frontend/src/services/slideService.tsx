import api from "@/config/axios";
import { ContextType } from "@/context";
import {
  Slide,
  Store,
  Element as ServerElement,
  ElementTypes,
} from "@/helpers/serverHelpers";
import { v4 as randomUUID } from "uuid";

export async function newSlide(pId: string, context: ContextType) {
  const { getters, setters } = context;
  // Fetch current data
  const currentStore: Store | undefined = getters.userData;

  if (currentStore) {
    const targetPresentationIndex = currentStore.presentations.findIndex(
      (pres) => pres.pId === pId
    );
    if (targetPresentationIndex !== -1) {
      const updatedPresentations = [...currentStore.presentations];
      // Generate a new unique slide
      const newSlide: Slide = {
        sId: randomUUID(),
        img: "",
        elements: [],
      };
      updatedPresentations[targetPresentationIndex] = {
        ...updatedPresentations[targetPresentationIndex],
        slides: [
          ...updatedPresentations[targetPresentationIndex].slides,
          newSlide,
        ],
      };
      const updatedStore: Store = {
        ...currentStore,
        presentations: updatedPresentations,
      };
      try {
        const response = await api.put("/store", { store: updatedStore });
        if (response && response.data) {
          setters.setUserData(updatedStore);
          return newSlide.sId;
        }
      } catch (error) {
        console.error("Error updating store:", error);
      }
    } else {
      console.error("Error: Presentation not found");
    }
  } else {
    console.error("Error updating store: userData does not exist");
  }
}

export async function deleteSlide(
  pId: string,
  sId: string,
  context: ContextType
) {
  const { getters, setters } = context;
  // Fetch current data
  const currentStore: Store | undefined = getters.userData;
  if (currentStore) {
    const targetPresentationIndex = currentStore.presentations.findIndex(
      (pres) => pres.pId === pId
    );
    if (targetPresentationIndex !== -1) {
      const updatedPresentations = [...currentStore.presentations];
      updatedPresentations[targetPresentationIndex] = {
        ...updatedPresentations[targetPresentationIndex],
        slides: updatedPresentations[targetPresentationIndex].slides.filter(
          (slide) => slide.sId !== sId
        ),
      };
      const updatedStore: Store = {
        ...currentStore,
        presentations: updatedPresentations,
      };
      try {
        const response = await api.put("/store", { store: updatedStore });
        if (response && response.data) {
          setters.setUserData(updatedStore);
          return sId;
        }
      } catch (error) {
        console.error("Error updating store:", error);
      }
    } else {
      console.error("Error: Presentation not found");
    }
  } else {
    console.error("Error updating store: userData does not exist");
  }
}

export async function textEdit(
  sId: string | null,
  eId: string,
  context: ContextType,
  textValue: string,
  textSize: string,
  width: string,
  height: string,
  color: string,
  pId: string | undefined
) {
  const { getters, setters } = context;
  const currentStore: Store | undefined = getters.userData;

  if (currentStore) {
    const updated: Store = JSON.parse(JSON.stringify(currentStore));
    const presentation = updated.presentations.find((p) => p.pId === pId);

    if (presentation) {
      const slide = presentation.slides.find((s) => s.sId === sId);

      if (slide) {
        console.log(eId);
        const element = slide.elements.find((e) => e.id === eId);
        if (element) {
          element.width = parseInt(width);
          element.height = parseInt(height);
          element.fontSize = parseInt(textSize);
          element.content = textValue;
          element.color = color;

          try {
            const response = await api.put("/store", { store: updated });
            if (response && response.data) {
              setters.setUserData(updated);
            }
          } catch (error) {
            console.error("Error updating store:", error);
          }
        }
      }
    }
  }
}

export async function textInsert(
  sId: string | null,
  context: ContextType,
  textValue: string,
  textSize: string,
  width: string,
  height: string,
  color: string,
  pId: string | undefined
) {
  const { getters, setters } = context;
  const currentStore: Store | undefined = getters.userData;
  if (currentStore) {
    const newElement: ServerElement = {
      id: randomUUID(),
      type: ElementTypes.TEXT,
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      content: textValue,
      fontSize: 16,
      color: color,
    };
    try {
      newElement.width = parseInt(width);
      newElement.height = parseInt(height);
      newElement.fontSize = parseInt(textSize);
    } catch (e) {
      console.error(e);
      return;
    }

    const addNewElement = (slides: Slide[]) => {
      const updateSlide = slides.find((s) => s.sId == sId);
      if (updateSlide) {
        updateSlide?.elements.push(newElement);
      }
      return slides;
    };

    const targetPresentationIndex = currentStore.presentations.findIndex(
      (pres) => pres.pId === pId
    );
    if (targetPresentationIndex !== -1) {
      const updatedPresentations = [...currentStore.presentations];
      updatedPresentations[targetPresentationIndex] = {
        ...updatedPresentations[targetPresentationIndex],
        slides: addNewElement(
          updatedPresentations[targetPresentationIndex].slides
        ),
      };
      const updatedStore: Store = {
        ...currentStore,
        presentations: updatedPresentations,
      };
      try {
        const response = await api.put("/store", { store: updatedStore });
        if (response && response.data) {
          setters.setUserData(updatedStore);
        }
      } catch (error) {
        console.error("Error updating store:", error);
      }
    } else {
      console.error("Error: Presentation not found");
    }
  } else {
    console.error("Error updating store: userData does not exist");
  }
}

export async function imageEdit(
  sId: string | null,
  eId: string,
  context: ContextType,
  content: string,
  width: string,
  height: string,
  description: string,
  pId: string | undefined
) {
  const { getters, setters } = context;
  const currentStore: Store | undefined = getters.userData;
  console.log(description);
  if (currentStore) {
    const updated: Store = JSON.parse(JSON.stringify(currentStore));
    const presentation = updated.presentations.find((p) => p.pId === pId);

    if (presentation) {
      const slide = presentation.slides.find((s) => s.sId === sId);

      if (slide) {
        const element = slide.elements.find((e) => e.id === eId);
        if (element) {
          element.width = parseInt(width);
          element.height = parseInt(height);
          element.alt = description;
          element.content = content;

          try {
            const response = await api.put("/store", { store: updated });
            if (response && response.data) {
              setters.setUserData(updated);
            }
          } catch (error) {
            console.error("Error updating store:", error);
          }
        }
      }
    }
  }
}

export async function imageInsert(
  sId: string | null,
  context: ContextType,
  content: string,
  width: string,
  height: string,
  description: string,
  pId: string | undefined
) {
  const { getters, setters } = context;
  const currentStore: Store | undefined = getters.userData;
  if (currentStore) {
    const newElement: ServerElement = {
      id: randomUUID(),
      type: ElementTypes.IMAGE,
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      content: content,
      alt: description,
    };
    try {
      newElement.width = parseInt(width);
      newElement.height = parseInt(height);
    } catch (e) {
      console.error(e);
      return;
    }

    const addNewElement = (slides: Slide[]) => {
      const updateSlide = slides.find((s) => s.sId == sId);
      if (updateSlide) {
        updateSlide?.elements.push(newElement);
      }
      return slides;
    };

    const targetPresentationIndex = currentStore.presentations.findIndex(
      (pres) => pres.pId === pId
    );
    if (targetPresentationIndex !== -1) {
      const updatedPresentations = [...currentStore.presentations];
      updatedPresentations[targetPresentationIndex] = {
        ...updatedPresentations[targetPresentationIndex],
        slides: addNewElement(
          updatedPresentations[targetPresentationIndex].slides
        ),
      };
      const updatedStore: Store = {
        ...currentStore,
        presentations: updatedPresentations,
      };
      try {
        const response = await api.put("/store", { store: updatedStore });
        if (response && response.data) {
          setters.setUserData(updatedStore);
        }
      } catch (error) {
        console.error("Error updating store:", error);
      }
    } else {
      console.error("Error: Presentation not found");
    }
  } else {
    console.error("Error updating store: userData does not exist");
  }
}

export async function videoEdit(
  sId: string | null,
  eId: string,
  context: ContextType,
  videoUrl: string,
  width: string,
  height: string,
  autoplay: string,
  pId: string | undefined
) {
  const { getters, setters } = context;
  const currentStore: Store | undefined = getters.userData;

  if (currentStore) {
    const updated: Store = JSON.parse(JSON.stringify(currentStore));
    const presentation = updated.presentations.find((p) => p.pId === pId);

    if (presentation) {
      const slide = presentation.slides.find((s) => s.sId === sId);

      if (slide) {
        const element = slide.elements.find((e) => e.id === eId);
        if (element) {
          element.width = parseInt(width);
          element.height = parseInt(height);
          element.autoplay = autoplay;
          element.content = videoUrl;

          try {
            const response = await api.put("/store", { store: updated });
            if (response && response.data) {
              setters.setUserData(updated);
            }
          } catch (error) {
            console.error("Error updating store:", error);
          }
        }
      }
    }
  }
}

export async function videoInsert(
  sId: string | null,
  context: ContextType,
  videoUrl: string,
  width: string,
  height: string,
  autoplay: string,
  pId: string | undefined
) {
  const { getters, setters } = context;
  const currentStore: Store | undefined = getters.userData;
  console.log("INSERT", autoplay);
  if (currentStore) {
    const newElement: ServerElement = {
      id: randomUUID(),
      type: ElementTypes.VIDEO,
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      content: videoUrl,
      autoplay: autoplay,
    };
    try {
      newElement.width = parseInt(width);
      newElement.height = parseInt(height);
    } catch (e) {
      console.error(e);
      return;
    }

    const addNewElement = (slides: Slide[]) => {
      const updateSlide = slides.find((s) => s.sId == sId);
      if (updateSlide) {
        updateSlide?.elements.push(newElement);
      }
      return slides;
    };

    const targetPresentationIndex = currentStore.presentations.findIndex(
      (pres) => pres.pId === pId
    );
    if (targetPresentationIndex !== -1) {
      const updatedPresentations = [...currentStore.presentations];
      updatedPresentations[targetPresentationIndex] = {
        ...updatedPresentations[targetPresentationIndex],
        slides: addNewElement(
          updatedPresentations[targetPresentationIndex].slides
        ),
      };
      const updatedStore: Store = {
        ...currentStore,
        presentations: updatedPresentations,
      };
      try {
        const response = await api.put("/store", { store: updatedStore });
        if (response && response.data) {
          setters.setUserData(updatedStore);
        }
      } catch (error) {
        console.error("Error updating store:", error);
      }
    } else {
      console.error("Error: Presentation not found");
    }
  } else {
    console.error("Error updating store: userData does not exist");
  }
}
export async function codeInsert(sId: string | null,
  context: ContextType,
  codeContent: string,
  width: string,
  height: string,
  fontSize: string,
  pId: string | undefined
) {
  const { getters, setters } = context;
  const currentStore: Store | undefined = getters.userData;

  if (currentStore) {
    const newElement: ServerElement = {
      id: randomUUID(),
      type: ElementTypes.CODE,
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      content: codeContent,
      fontSize: 1,
    };
    try {
      newElement.width = parseInt(width);
      newElement.height = parseInt(height);
      newElement.fontSize = parseInt(fontSize);
    } catch (e) {
      console.error(e);
      return;
    }

    const addNewElement = (slides: Slide[]) => {
      const updateSlide = slides.find((s) => s.sId == sId);
      if (updateSlide) {
        updateSlide?.elements.push(newElement);
      }
      return slides;
    };

    const targetPresentationIndex = currentStore.presentations.findIndex(
      (pres) => pres.pId === pId
    );
    if (targetPresentationIndex !== -1) {
      const updatedPresentations = [...currentStore.presentations];
      updatedPresentations[targetPresentationIndex] = {
        ...updatedPresentations[targetPresentationIndex],
        slides: addNewElement(
          updatedPresentations[targetPresentationIndex].slides
        ),
      };
      const updatedStore: Store = {
        ...currentStore,
        presentations: updatedPresentations,
      };
      try {
        const response = await api.put("/store", { store: updatedStore });
        if (response && response.data) {
          setters.setUserData(updatedStore);
        }
      } catch (error) {
        console.error("Error updating store:", error);
      }
    } else {
      console.error("Error: Presentation not found");
    }
  } else {
    console.error("Error updating store: userData does not exist");
  }
}

export async function updateElementXY(
  context: ContextType,
  activeSlide: string | null,
  index: number,
  xPercentage: number,
  yPercentage: number,
  pId?: string
) {
  const { getters, setters } = context;
  const currentStore: Store | undefined = getters.userData;
  if (currentStore) {
    const targetPresentationIndex = currentStore.presentations.findIndex(
      (pres) => pres.pId === pId
    );
    if (targetPresentationIndex !== -1) {
      const changeXY = (
        slides: Slide[],
        index: number,
        xPercentage: number,
        yPercentage: number
      ) => {
        const updateSlide = slides.find((s) => s.sId == activeSlide);
        if (updateSlide) {
          updateSlide.elements[index].x = xPercentage;
          updateSlide.elements[index].y = yPercentage;
        }
        return slides;
      };

      const updatedPresentations = [...currentStore.presentations];
      updatedPresentations[targetPresentationIndex] = {
        ...updatedPresentations[targetPresentationIndex],
        slides: changeXY(
          updatedPresentations[targetPresentationIndex].slides,
          index,
          xPercentage,
          yPercentage
        ),
      };
      const updatedStore: Store = {
        ...currentStore,
        presentations: updatedPresentations,
      };
      try {
        const response = await api.put("/store", { store: updatedStore });
        if (response && response.data) {
          setters.setUserData(updatedStore);
        }
      } catch (error) {
        console.error("Error updating store:", error);
      }
    } else {
      console.error("Error: Presentation not found");
    }
  } else {
    console.error("Error updating store: userData does not exist");
  }
}

export async function updateElementWHXY(
  context: ContextType,
  activeSlide: string | null,
  index: number,
  wPercentage: number,
  hPercentage: number,
  xPercentage: number,
  yPercentage: number,
  pId?: string
) {
  const { getters, setters } = context;
  const currentStore: Store | undefined = getters.userData;
  if (currentStore) {
    const targetPresentationIndex = currentStore.presentations.findIndex(
      (pres) => pres.pId === pId
    );
    if (targetPresentationIndex !== -1) {
      const changeXY = (
        slides: Slide[],
        index: number,
        wPercentage: number,
        hPercentage: number
      ) => {
        const updateSlide = slides.find((s) => s.sId == activeSlide);
        if (updateSlide) {
          updateSlide.elements[index].width = wPercentage;
          updateSlide.elements[index].height = hPercentage;
          updateSlide.elements[index].x = xPercentage;
          updateSlide.elements[index].y = yPercentage;
        }
        return slides;
      };

      const updatedPresentations = [...currentStore.presentations];
      updatedPresentations[targetPresentationIndex] = {
        ...updatedPresentations[targetPresentationIndex],
        slides: changeXY(
          updatedPresentations[targetPresentationIndex].slides,
          index,
          wPercentage,
          hPercentage
        ),
      };
      const updatedStore: Store = {
        ...currentStore,
        presentations: updatedPresentations,
      };
      try {
        const response = await api.put("/store", { store: updatedStore });
        if (response && response.data) {
          setters.setUserData(updatedStore);
        }
      } catch (error) {
        console.error("Error updating store:", error);
      }
    } else {
      console.error("Error: Presentation not found");
    }
  } else {
    console.error("Error updating store: userData does not exist");
  }
}
