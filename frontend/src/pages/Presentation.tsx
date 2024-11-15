import { AppSidebar } from "@/components/app-sidebar";
import ToolboxMenubar from "@/components/toolbox-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import api from "@/config/axios";
import { Context } from "@/context";
import {
  Slide,
  Store,
  UserInfo,
  Element as SlideElement,
  ElementTypes,
  ContainerSize,
} from "@/helpers/serverHelpers";
import {
  deleteSlide,
  newSlide,
  updateElementWHXY,
  updateElementXY,
} from "@/services/slideService";
import {
  Code,
  FileType2,
  FileVideo,
  Home,
  LogOut,
  Image,
  FileX2,
  File,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import interact from "interactjs";
import { SlidesNumber } from "@/components/slide-number";
import { Button } from "@/components/ui/button";
import {
  PresentationCard,
  PresentationMenu,
} from "@/components/presentation-list";
import { EditTextDialog } from "@/components/text-insert-dialog";
import { EditImageDialog } from "@/components/image-insert-dialog";
import { EditVideoDialog } from "@/components/video-insert-dialog";
//import { EditCodeDialog } from "@/components/code-insert-dialog";
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-python';
import { PreviewModal } from "../components/preview";
import hljs from 'highlight.js/lib/core';

import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import c from 'highlight.js/lib/languages/c';



hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('c', c);


const navMain = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
];

export function PresentationPage() {
  const { setters, getters } = useContext(Context);
  const context = useContext(Context);
  const [user, setUser] = useState<UserInfo>({
    name: "",
    email: "",
    avatar: "",
  });
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [elements, setElements] = useState<SlideElement[]>([]);
  const [activeSlide, setActiveSlide] = useState(
    slides.length > 0 ? slides[0].sId : null
  );
  const { pId } = useParams<{ pId: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [containerSize, setContainerSize] = useState<ContainerSize | null>(null);
  const elementRef = useRef<(HTMLDivElement | null)[]>([]);
  const [resizable, setResizable] = useState<number>(-1);
  const [presentationTitle, setpresentationTitle] = useState('');
  const isFirstFetch = useRef(true);
  const navigate = useNavigate();

  const handlePreviewClick = () => {
    const container = document.querySelector<HTMLDivElement>('.contentContainer');
    if (container) {
      setContainerSize({
        width: container.offsetWidth,
        height: container.offsetHeight
      });
      setIsPreviewOpen(true);
    }
  };
  const handleSlideSelection = (index: number) => {
    setActiveSlideIndex(index);
    setActiveSlide(slides[index].sId);

    // Get the container and selected slide
    const container = containerRef.current;
    const selectedSlide = container?.children[0]?.children[
      index
    ] as HTMLElement;

    if (selectedSlide && container) {
      const containerWidth = (container as HTMLElement).offsetWidth;
      const slideWidth = selectedSlide.offsetWidth;
      const scrollPosition =
        selectedSlide.offsetLeft - containerWidth / 2 + slideWidth / 2;

      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  };

  const handleNextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      const newIndex = activeSlideIndex + 1;
      handleSlideSelection(newIndex);
    }
  };

  const handlePrevSlide = () => {
    if (activeSlideIndex > 0) {
      const newIndex = activeSlideIndex - 1;
      handleSlideSelection(newIndex);
    }
  };

  const toolBoxButton = [
    {
      title: "New Slide",
      onClick: async () => {
        try {
          if (pId) {
            await newSlide(pId, context);
          } else {
            console.error("Presentation ID is undefined");
          }
        } catch (error) {
          console.error("Failed to insert new slide:", error);
        }
      },
      icon: File,
    },
    {
      title: "Insert Text",
      onClick: async () => {
        try {
          // Insert text logic here
        } catch (error) {
          console.error("Failed to insert text:", error);
        }
      },
      icon: FileType2,
    },
    {
      title: "Insert Image",
      onClick: () => { },
      icon: Image,
    },
    {
      title: "Insert Video",
      onClick: () => { },
      icon: FileVideo,
    },
    {
      title: "Insert Code",
      onClick: () => { },
      icon: Code,
    },
    {
      title: "Delete Slide",
      onClick: async () => {
        try {
          if (activeSlide && pId) {
            await deleteSlide(pId, activeSlide, context);
          }
        } catch (error) {
          console.error("Failed to delete slide:", error);
        }
      },
      icon: FileX2,
    },
  ];
  useEffect(() => {
    const fetchUserData = async () => {
      let userData = getters.userData;
      if (!userData && getters.loginState) {
        // Fetch data if not already present
        try {
          const storeResponse = await api.get("/store");
          const data: Store = storeResponse.data.store;
          setters.setUserData(data);
          userData = data;
          setUser({
            name: data.user.name,
            email: data.user.email,
            avatar: "",
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          return;
        }
      } else if (userData && getters.loginState) {
        if (!userData.presentations.find((p) => p.pId === pId)) {
          navigate("/dashboard");
        }
        setUser({
          name: userData.user.name,
          email: userData.user.email,
          avatar: "",
        });
      }

      // Process the slides
      if (userData && pId) {
        const presentation = userData.presentations.find(
          (pres) => pres.pId === pId
        );

        if(presentation)
        {
          setpresentationTitle(presentation?.name)
        }

        if (presentation) {
          const slides = Array.isArray(presentation.slides)
            ? presentation.slides
            : [];
          setSlides(
            slides.map((slide) => ({
              sId: slide.sId,
              img: slide.img,
              elements: Array.isArray(slide.elements)
                ? slide.elements.map((element) => ({
                  id: element.id,
                  type: element.type,
                  x: element.x,
                  y: element.y,
                  width: element.width,
                  height: element.height,
                  content: element.content,
                  fontSize: element.fontSize,
                  color: element.color,
                }))
                : [],
            }))
          );
          if (isFirstFetch.current) {
            setActiveSlideIndex(0);
            setActiveSlide(slides[0].sId);
            isFirstFetch.current = false;
          }
        } else {
          console.warn("Presentation not found for pId:", pId);
        }
      }
    };
    fetchUserData();
  }, [getters.userData, getters.loginState, pId, setters]);


  useEffect(() => {
    const updateElements = async () => {
      const slide = slides.find((s) => s.sId === activeSlide);
      if (slide !== undefined) {
        setElements(slide.elements);
      } else {
        setElements([]);
      }
    };
    updateElements();
  }, [activeSlide, slides, getters]);

  function updateElementForXY(
    index: number,
    xPercentage: number,
    yPercentage: number
  ) {
    updateElementXY(context, activeSlide, index, xPercentage, yPercentage, pId);
  }

  function updateElementForWHXY(
    index: number,
    wPercentage: number,
    hPercentage: number,
    xPercentage: number,
    yPercentage: number
  ) {
    updateElementWHXY(
      context,
      activeSlide,
      index,
      wPercentage,
      hPercentage,
      xPercentage,
      yPercentage,
      pId
    );
  }

  useEffect(() => {
    const checkElements = setInterval(() => {
      elementRef.current.forEach(
        (element: HTMLDivElement | null, index: number) => {
          if (element) {
            let x = 0;
            let y = 0;
            if (elements[index].x) {
              x =
                (elements[index].x *
                  (element.parentElement
                    ? element.parentElement.offsetWidth
                    : 0)) /
                100;
            }
            if (elements[index].y) {
              y =
                (elements[index].y *
                  (element.parentElement
                    ? element.parentElement.offsetHeight
                    : 0)) /
                100;
            }
            const interaction = interact(element);

            interaction
              .draggable({
                modifiers: [
                  interact.modifiers.snap({
                    targets: [interact.snappers.grid({ x: 1, y: 1 })],
                    range: Infinity,
                    relativePoints: [{ x: 0, y: 0 }],
                  }),
                  interact.modifiers.restrict({
                    restriction: element.parentNode as HTMLElement,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                    endOnly: true,
                  }),
                ],
                inertia: false,
              })
              .on("dragmove", (event) => {
                x += event.dx;
                y += event.dy;

                if (event.target instanceof HTMLElement) {
                  event.target.style.transform = `translate(${x}px, ${y}px)`;
                }
              })
              .on("dragend", (event) => {
                x += event.dx;
                y += event.dy;

                const parentWidth = element.parentElement
                  ? element.parentElement.offsetWidth
                  : 0;
                const parentHeight = element.parentElement
                  ? element.parentElement.offsetHeight
                  : 0;

                const xPercentage = (x / parentWidth) * 100;
                const yPercentage = (y / parentHeight) * 100;
                updateElementForXY(index, xPercentage, yPercentage);
                elements[index].x = xPercentage;
                elements[index].y = yPercentage;
              });

            return () => {
              interaction.unset();
            };
          }
        }
      );
      clearInterval(checkElements);
    }, 200);
  }, [elements]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedElementIndex = elementRef.current.findIndex((ref) =>
        ref?.contains(event.target as Node)
      );

      if (clickedElementIndex !== resizable) {
        if (clickedElementIndex === -1) {
          setResizable(-1);
        } else {
          setResizable(clickedElementIndex);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const checkElements = setInterval(() => {
      elementRef.current.forEach(
        (element: HTMLDivElement | null, index: number) => {
          if (element) {
            const interaction = interact(element);
            if (index === resizable) {
              interaction.resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                  move(event) {
                    const target = event.target as HTMLElement;
                    let x =
                      parseFloat(target.getAttribute("data-x") || "0") || 0;
                    let y =
                      parseFloat(target.getAttribute("data-y") || "0") || 0;

                    // Update the element's size
                    target.style.width = `${event.rect.width}px`;
                    target.style.height = `${event.rect.height}px`;

                    // Translate when resizing from top or left edges
                    x += event.deltaRect.left;
                    y += event.deltaRect.top;

                    target.style.transform = `translate(${x}px, ${y}px)`;

                    target.setAttribute("data-x", x.toString());
                    target.setAttribute("data-y", y.toString());
                  },
                  end(event) {
                    const target = event.target as HTMLElement;
                    const parent = target.parentElement;

                    const heightPercent =
                      (target.offsetHeight /
                        (parent ? parent.offsetHeight : 0)) *
                      100;
                    const widthPercent =
                      (target.offsetWidth / (parent ? parent.offsetWidth : 0)) *
                      100;
                    if (parent) {
                      const parentRect = parent.getBoundingClientRect();
                      const targetRect = target.getBoundingClientRect();
                      const xPercentage =
                        ((targetRect.left - parentRect.left) /
                          parent.offsetWidth) *
                        100;
                      const yPercentage =
                        ((targetRect.top - parentRect.top) /
                          parent.offsetHeight) *
                        100;

                      updateElementForWHXY(
                        index,
                        widthPercent,
                        heightPercent,
                        xPercentage,
                        yPercentage
                      );
                    }
                  },
                },
                modifiers: [
                  interact.modifiers.restrictEdges({
                    outer: "parent",
                  }),
                  interact.modifiers.restrictSize({
                    min: { width: 100, height: 50 },
                  }),
                ],
                inertia: false,
              });
            }

            interaction.draggable({
              listeners: {
                move(event) {
                  const target = event.target as HTMLElement;
                  const x =
                    (parseFloat(target.getAttribute("data-x") || "0") || 0) +
                    event.dx;
                  const y =
                    (parseFloat(target.getAttribute("data-y") || "0") || 0) +
                    event.dy;

                  target.style.transform = `translate(${x}px, ${y}px)`;

                  target.setAttribute("data-x", x.toString());
                  target.setAttribute("data-y", y.toString());
                },
                end(event) {
                  const target = event.target as HTMLElement;
                  const parent = target.parentElement;

                  if (parent) {
                    const parentRect = parent.getBoundingClientRect();
                    const targetRect = target.getBoundingClientRect();
                    const xPercentage =
                      ((targetRect.left - parentRect.left) /
                        parent.offsetWidth) *
                      100;
                    const yPercentage =
                      ((targetRect.top - parentRect.top) /
                        parent.offsetHeight) *
                      100;

                    updateElementForXY(index, xPercentage, yPercentage);
                  }
                },
              },
              inertia: false,
              modifiers: [
                interact.modifiers.restrictRect({
                  restriction: "parent",
                  endOnly: true,
                }),
              ],
            });

            return () => {
              interaction.unset();
            };
          }
        }
      );
      clearInterval(checkElements);
    }, 200);
  }, [elements, resizable]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (document.activeElement?.tagName === "INPUT") return;
    if (e.key === "ArrowRight") handleNextSlide();
    if (e.key === "ArrowLeft") handlePrevSlide();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSlideIndex, slides.length]);

  function makeTextDiv(
    element: SlideElement,
    setEditTextShow: React.Dispatch<React.SetStateAction<boolean>>,
    setEId: React.Dispatch<React.SetStateAction<string>>,
    index: number
  ) {
    return (
      <div
        className={`absolute top-[${element.y}] left-[${element.x}] border overflow-hidden cursor-move select-none z-[${index}]`}
        key={index}
        ref={(elm) => (elementRef.current[index] = elm)}
        style={{
          top: `${element.y}%`,
          left: `${element.x}%`,
          width: `${element.width}%`,
          height: `${element.height}%`,
          color: element.color,
          fontSize: element.fontSize,
        }}
        onDoubleClick={() => {
          setEditTextShow(true);
          setEId(element.id);
        }}
      >
        {element.content}
      </div>
    );
  }

  function makeImageDiv(
    element: SlideElement,
    setEditImageShow: React.Dispatch<React.SetStateAction<boolean>>,
    setEId: React.Dispatch<React.SetStateAction<string>>,
    index: number
  ) {
    return (
      <div
        className={`absolute top-[${element.y}] left-[${element.x}] border cursor-move select-none z-[${index}]`}
        key={index}
        ref={(elm) => (elementRef.current[index] = elm)}
        style={{
          top: `${element.y}%`,
          left: `${element.x}%`,
          width: `${element.width}%`,
          height: `${element.height}%`,
        }}
        onDoubleClick={() => {
          setEditImageShow(true);
          setEId(element.id);
        }}
      >
        <img
          className="w-full h-full"
          src={`${element.content}`}
          alt={`${element.description}`}
        ></img>
      </div>
    );
  }

  function makeVideoDiv(
    element: SlideElement,
    setEditVideoShow: React.Dispatch<React.SetStateAction<boolean>>,
    setEId: React.Dispatch<React.SetStateAction<string>>,
    index: number
  ) {
    return (
      <div
        className={`absolute top-[${element.y}] left-[${element.x}] p-6 border cursor-move select-none z-[${index}]`}
        key={index}
        ref={(elm) => (elementRef.current[index] = elm)}
        style={{
          top: `${element.y}%`,
          left: `${element.x}%`,
          width: `${element.width}%`,
          height: `${element.height}%`,
        }}
        onDoubleClick={() => {
          setEditVideoShow(true);
          setEId(element.id);
        }}
      >
        <iframe
          className="w-full h-full"
          src={`${element.content}?${element.autoplay === "true" ? 1 : 0}`}
        ></iframe>
      </div>
    );
  }

  function makeCodeDiv(
    element: SlideElement,
    setEditCodeShow: React.Dispatch<React.SetStateAction<boolean>>,
    setEId: React.Dispatch<React.SetStateAction<string>>,
    index: number
  ) {
    useEffect(() => {
      Prism.highlightAll();
    }, []);

    function determineLanguage(content: string | undefined): string {
      if (!content) {
        return 'plaintext';
      }
      const result = hljs.highlightAuto(content);
      return result.language || 'plaintext';
    }

    return (
      <div
        className={`absolute top-[${element.y}] left-[${element.x}] p-6 border cursor-move select-none z-[${index}] whitespace-pre-wrap overflow-auto`}
        key={index}
        ref={(elm) => (elementRef.current[index] = elm)}
        style={{
          top: `${element.y}%`,
          left: `${element.x}%`,
          width: `${element.width}%`,
          height: `${element.height}%`,
          fontSize: `${element.fontSize}em`
        }}
        onDoubleClick={() => {
          setEditCodeShow(true);
          setEId(element.id);
        }}
      >
        <pre className="whitespace-pre-wrap" style={{ fontSize: '1em' }}>
          <code className={`language-${determineLanguage(element.content)}`}>{element.content}</code>
        </pre>
      </div>
    );
  }

  function ElementDisplayDivs() {
    const [editTextShow, setEditTextShow] = useState(false);
    const [editImageShow, setEditImageShow] = useState(false);
    const [editVideoShow, setEditVideoShow] = useState(false);
    const [editCodeShow, setEditCodeShow] = useState(false);
    const [eId, setEId] = useState("");

    useEffect(() => {
      if (
        editTextShow !== true &&
        editImageShow !== true &&
        editVideoShow !== true
      ) {
        setEId("");
      }
    }, [editTextShow]);

    function GetEditTextDialog() {
      return (
        <EditTextDialog
          open={editTextShow}
          onOpenChange={setEditTextShow}
          activeSlide={activeSlide}
          activeElement={eId}
          context={context}
          pId={pId}
        />
      );
    }

    function GetEditImageDialog() {
      return (
        <EditImageDialog
          open={editImageShow}
          onOpenChange={setEditImageShow}
          activeSlide={activeSlide}
          activeElement={eId}
          context={context}
          pId={pId}
        />
      );
    }

    function GetEditVideoDialog() {
      return (
        <EditVideoDialog
          open={editVideoShow}
          onOpenChange={setEditVideoShow}
          activeSlide={activeSlide}
          activeElement={eId}
          context={context}
          pId={pId}
        />
      );
    }


    const elementDivs = elements.map((element, index) => {
      if (element.type === ElementTypes.TEXT) {
        return makeTextDiv(element, setEditTextShow, setEId, index);
      } else if (element.type === ElementTypes.IMAGE) {
        return makeImageDiv(element, setEditImageShow, setEId, index);
      } else if (element.type === ElementTypes.VIDEO) {
        return makeVideoDiv(element, setEditVideoShow, setEId, index);
      } else if (element.type === ElementTypes.CODE) {
        return makeCodeDiv(element, setEditCodeShow, setEId, index);
      }
    });

    return (
      <div className="w-full h-full relative">
        {elementDivs}
        <GetEditTextDialog />
        <GetEditImageDialog />
        <GetEditVideoDialog />
      </div>
    );
  }

  function presentationInfo(): PresentationCard | undefined {
    const presentationData = getters.userData?.presentations.find(
      (p) => p.pId === pId
    );

    if (presentationData) {
      return {
        id: presentationData?.pId,
        thumbnail: presentationData?.thumbnail,
        name: presentationData?.name,
        slideNumber: presentationData?.slides.length,
        description: presentationData?.description,
      };
    }
    return undefined;
  }

  function ProcessPresentationMenu() {
    const info = presentationInfo();
    if (info) {
      return (
        <PresentationMenu
          trigger={<Button>Edit</Button>}
          cardInfo={info}
          setUserData={setters.setUserData}
          userData={getters.userData}
        />
      );
    } else {
      return null;
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="dark">
        <SidebarProvider defaultOpen={false}>
          <AppSidebar user={user} navMain={navMain} />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1 bg-zinc-300" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink to="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{`${presentationTitle}`}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="ml-auto">
                <ProcessPresentationMenu />
              </div>
              <div>
                <Button onClick={handlePreviewClick}>Preview</Button>

                {isPreviewOpen && containerSize && pId && (
                  <PreviewModal
                    slides={slides}
                    presentationId={pId}
                    containerSize={containerSize}
                    onClose={() => setIsPreviewOpen(false)}
                  />
                )}
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {/* Slides */}
              <div className="relative w-full max-w-[calc(100vw-100px)]">
                <Button
                  variant="arrow"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-gray-50"
                  onClick={handlePrevSlide}
                  disabled={activeSlideIndex === 0}
                >
                  <ChevronLeft className="h-6 w-6" />
                  <span className="sr-only">Previous slide</span>
                </Button>
                <Button
                  variant="arrow"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-gray-50"
                  onClick={handleNextSlide}
                  disabled={activeSlideIndex === slides.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next slide</span>
                </Button>
                <div
                  ref={containerRef}
                  className="w-full overflow-x-auto scrollbar-hide px-10"
                >
                  <div className="flex flex-nowrap space-x-4 h-[200px]">
                    {slides.map((slide, index) => (
                      <div
                        key={slide.sId}
                        className={`select-none flex-shrink-0 aspect-video w-[300px] rounded-xl bg-white cursor-pointer border-4 ${activeSlideIndex === index
                          ? "border-blue-500"
                          : "border-transparent"
                          }`}
                        onClick={() => handleSlideSelection(index)}
                      >
                        <div className="text-black  ml-4 mt-2">
                          {index + 1 + "."}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="contentContainer flex flex-1 relative rounded-xl bg-muted/50 md:min-h-min bg-white overflow-hidden">
                <ElementDisplayDivs />
                <ToolboxMenubar
                  buttons={toolBoxButton}
                  activeSlide={activeSlide}
                  context={context}
                  pId={pId}
                />
                <SlidesNumber index={activeSlideIndex + 1} />
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
