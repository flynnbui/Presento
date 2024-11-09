import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Type, Image, Video, Code, Play } from 'lucide-react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragOverlay,
  pointerWithin,
  MeasuringStrategy
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import hljs from 'highlight.js';

enum ElementTypes {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  CODE = 'code'
}

interface SlideElementProps {
  id: number;
  type: ElementTypes;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  color?: string;
  src?: string;
  alt?: string;
  url?: string;
  language?: string;
  layer?: number;
  autoplay?: boolean;
}

interface SlideProps {
  id: number;
  elements: SlideElementProps[];
}

interface ElementDialogProps {
  type: ElementTypes | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (element: SlideElementProps) => void;
}

const generateRevealHtml = (slides: SlideProps[]) => {
  const generateElementHtml = (element: SlideElementProps) => {
    switch (element.type) {
      case ElementTypes.TEXT:
        return `<div style="position: absolute; left: ${element.x}%; top: ${element.y}%; width: ${element.width}%; height: ${element.height}%; color: ${element.color}; font-size: ${element.fontSize}em;">
          ${element.content}
        </div>`;
      case ElementTypes.IMAGE:
        return `<div style="position: absolute; left: ${element.x}%; top: ${element.y}%; width: ${element.width}%; height: ${element.height}%;"><img src="${element.src}" alt="${element.alt}" style="width: 100%; height: 100%; object-fit: contain;"></div>`;
      case ElementTypes.VIDEO:
        return `<div style="position: absolute; left: ${element.x}%; top: ${element.y}%; width: ${element.width}%; height: ${element.height}%;"><iframe width="100%" height="100%" src="${element.url}${element.autoplay ? '&autoplay=1' : ''}" frameborder="0" allowfullscreen></iframe></div>`;
      case ElementTypes.CODE:
        return `<div style="position: absolute; left: ${element.x}%; top: ${element.y}%; width: ${element.width}%; height: ${element.height}%;"><pre><code class="hljs" style="font-size: ${element.fontSize}em;">${hljs.highlight(element.content || '', { language: element.language || '' }).value}</code></pre></div>`;
      default:
        return '';
    }
  };

  return slides
    .map(
      (slide) => `
    <section class="slide">
      ${slide.elements.map((element) => generateElementHtml(element)).join('\n')}
    </section>
  `
    )
    .join('\n');
};

interface DraggableElementProps {
  element: SlideElementProps;
  onUpdate: (id: number, updatedElement: SlideElementProps) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
    element,
    onUpdate,
    onDelete,
    isSelected,
    onSelect
  }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: element.id.toString(),
      data: { element }
    });
  
    const style: React.CSSProperties = {
      position: 'absolute',
      width: `${element.width}%`,
      height: `${element.height}%`,
      left: `${element.x}%`,
      top: `${element.y}%`,
      border: isSelected ? '2px solid blue' : '1px solid #ccc',
      cursor: 'move',
      zIndex: element.layer || 1
    };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(element.id, { ...element });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(element.id);
  };

  const renderContent = () => {
    switch (element.type) {
      case ElementTypes.TEXT:
        return (
          <div style={{ color: element.color, fontSize: `${element.fontSize}em`, padding: '8px' }}>
            {element.content}
          </div>
        );
      case ElementTypes.IMAGE:
        return <img src={element.src} alt={element.alt} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
      case ElementTypes.VIDEO:
        return <iframe width="100%" height="100%" src={element.url} frameBorder="0" allowFullScreen />;
      case ElementTypes.CODE:
        return (
          <pre style={{ fontSize: `${element.fontSize}em`, margin: 0, padding: '8px', whiteSpace: 'pre-wrap' }}>
            <code dangerouslySetInnerHTML={{ __html: hljs.highlight(element.content || '', { language: element.language || '' }).value }} />
          </pre>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      {...attributes}
      {...listeners}
    >
      {renderContent()}
      {isSelected && <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />}
    </div>
  );
};

interface SlideDropAreaProps {
  children: React.ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
}

const SlideDropArea: React.FC<SlideDropAreaProps> = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'slide-area'
  });

  return <div ref={setNodeRef} className="aspect-video bg-white relative border rounded">{children}</div>;
};

const ElementDialog: React.FC<ElementDialogProps> = ({ type, isOpen, onClose, onAdd }) => {
  const [element, setElement] = useState<Partial<SlideElementProps>>({
    width: 30,
    height: 20,
    x: 0,
    y: 0
  });

  const handleSubmit = () => {
    onAdd({ ...element, type } as SlideElementProps);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {type ? type.charAt(0).toUpperCase() + type.slice(1) : ''}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Width (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={element.width}
                onChange={(e) => setElement({ ...element, width: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Height (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={element.height}
                onChange={(e) => setElement({ ...element, height: Number(e.target.value) })}
              />
            </div>
          </div>

          {type === ElementTypes.TEXT && (
            <>
              <div>
                <Label>Content</Label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={element.content ?? ''}
                  onChange={(e) => setElement({ ...element, content: e.target.value })}
                />
              </div>
              <div>
                <Label>Font Size (em)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={element.fontSize ?? 1}
                  onChange={(e) => setElement({ ...element, fontSize: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Color (HEX)</Label>
                <Input
                  type="color"
                  value={element.color ?? '#000000'}
                  onChange={(e) => setElement({ ...element, color: e.target.value })}
                />
              </div>
            </>
          )}

          <Button onClick={handleSubmit}>Add Element</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const RevealEditor: React.FC = () => {
  const [slides, setSlides] = useState<SlideProps[]>([{ id: 1, elements: [] }]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeDialog, setActiveDialog] = useState<ElementTypes | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | number | null>(null);


  useEffect(() => {
    if (showPreview && previewRef.current) {
      const loadReveal = async () => {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/reveal.min.css';
        document.head.appendChild(cssLink);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/reveal.min.js';
        script.onload = () => {
          // @ts-ignore
          Reveal.initialize({
            width: '100%',
            height: '100%',
            margin: 0,
            minScale: 1,
            maxScale: 1,
            controls: true,
            progress: true,
            history: true,
            center: false,
            transition: 'slide'
          });
        };
        document.head.appendChild(script);

        return () => {
          document.head.removeChild(script);
          document.head.removeChild(cssLink);
        };
      };

      loadReveal();
    }
  }, [showPreview]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
  
    const element = slides[activeSlide].elements.find((el) => el.id.toString() === active.id);
    if (!element) return;
  
    const activeRect = active.rect.current.translated; // The translated rect of the active element
    const overRect = over.rect; // The rect of the slide area
  
    if (!activeRect) return;
    const x = ((activeRect.left - overRect.left) / overRect.width) * 100;
    const y = ((activeRect.top - overRect.top) / overRect.height) * 100;
  
    const newSlides = [...slides];
    const elementIndex = newSlides[activeSlide].elements.findIndex(
      (el) => el.id.toString() === active.id
    );
  
    newSlides[activeSlide].elements[elementIndex] = {
      ...element,
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    };
  
    setSlides(newSlides);
  };  

  const addElement = (element: SlideElementProps) => {
    const newSlides = [...slides];
    element.id = Date.now();
    element.layer = newSlides[activeSlide].elements.length + 1;
    newSlides[activeSlide].elements.push(element);
    setSlides(newSlides);
    setActiveDialog(null);
  };

  const updateElement = (elementId: number, updatedElement: SlideElementProps) => {
    const newSlides = [...slides];
    const elementIndex = newSlides[activeSlide].elements.findIndex((el) => el.id === elementId);
    if (elementIndex !== -1) {
      newSlides[activeSlide].elements[elementIndex] = {
        ...updatedElement,
        layer: newSlides[activeSlide].elements[elementIndex].layer
      };
    }
    setSlides(newSlides);
  };

  const deleteElement = (elementId: number) => {
    const newSlides = [...slides];
    newSlides[activeSlide].elements = newSlides[activeSlide].elements.filter(
      (el) => el.id !== elementId
    );
    setSlides(newSlides);
    setSelectedElement(null);
  };

  if (showPreview) {
    return (
      <div className="fixed inset-0 bg-black">
        <Button className="absolute top-4 right-4 z-50 bg-white" onClick={() => setShowPreview(false)}>
          Exit Preview
        </Button>
        <div
          ref={previewRef}
          className="reveal"
          dangerouslySetInnerHTML={{
            __html: `<div class="slides">${generateRevealHtml(slides)}</div>`
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-4 flex gap-2">
        <Button onClick={() => setActiveDialog(ElementTypes.TEXT)}>
          <Type className="w-4 h-4 mr-2" /> Add Text
        </Button>
        <Button onClick={() => setActiveDialog(ElementTypes.IMAGE)}>
          <Image className="w-4 h-4 mr-2" /> Add Image
        </Button>
        <Button onClick={() => setActiveDialog(ElementTypes.VIDEO)}>
          <Video className="w-4 h-4 mr-2" /> Add Video
        </Button>
        <Button onClick={() => setActiveDialog(ElementTypes.CODE)}>
          <Code className="w-4 h-4 mr-2" /> Add Code
        </Button>
        <Button
          onClick={() => {
            setSlides([...slides, { id: Date.now(), elements: [] }]);
            setActiveSlide(slides.length);
          }}
        >
          Add Slide
        </Button>
        <Button onClick={() => setShowPreview(true)}>
          <Play className="w-4 h-4 mr-2" /> Preview
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="w-48">
          <Card className="p-4">
            <h3 className="font-bold mb-2">Slides</h3>
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`p-2 border rounded cursor-pointer ${
                    index === activeSlide ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => {
                    setActiveSlide(index);
                    setSelectedElement(null);
                  }}
                >
                  Slide {index + 1}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex-1">
          <DndContext
            onDragStart={(event) => setActiveId(event.active.id)}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always
              }
            }}
          >
            <Card className="p-4">
              <SlideDropArea onDragEnd={handleDragEnd}>
                {slides[activeSlide].elements.map((element) => (
                  <DraggableElement
                    key={element.id}
                    element={element}
                    onUpdate={updateElement}
                    onDelete={deleteElement}
                    isSelected={selectedElement === element.id}
                    onSelect={setSelectedElement}
                  />
                ))}
              </SlideDropArea>
            </Card>

            <DragOverlay>
        {activeId ? (
          <DraggableElement
            element={
              slides[activeSlide].elements.find((el) => el.id.toString() === activeId)!
            }
            onUpdate={updateElement}
            onDelete={deleteElement}
            isSelected={selectedElement === parseInt(activeId.toString())}
            onSelect={setSelectedElement}
          />
        ) : null}
      </DragOverlay>
          </DndContext>
        </div>
      </div>

      <ElementDialog
        type={activeDialog}
        isOpen={!!activeDialog}
        onClose={() => setActiveDialog(null)}
        onAdd={addElement}
      />
    </div>
  );
};

export default RevealEditor;
