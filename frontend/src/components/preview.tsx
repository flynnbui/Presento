import { ContainerSize, Element, Slide } from '@/helpers/serverHelpers';
import React, { useEffect, useRef, } from 'react';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import Reveal from 'reveal.js';
import { Button } from './ui/button';

interface PresentationPreviewProps {
  slides: Slide[];
  presentationId: string;
  containerSize: ContainerSize;
}

interface SlideContainerProps {
  children: React.ReactNode;
  containerSize: ContainerSize;
}

interface ElementRendererProps {
  element: Element;
}

interface PreviewModalProps extends PresentationPreviewProps {
  onClose: () => void;
}

const SlideContainer: React.FC<SlideContainerProps> = ({ children, containerSize }) => (
  <div
    style={{
      width: containerSize.width,
      height: containerSize.height,
      position: 'relative',
      backgroundColor: 'white',
      overflow: 'hidden'
    }}
  >
    {children}
  </div>
);

const ElementRenderer: React.FC<ElementRendererProps> = ({ element }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${element.x}%`,
    top: `${element.y}%`,
    width: `${element.width}%`,
    height: `${element.height}%`,
  };

  switch (element.type) {
    case 'text':
      return (
        <div
          key={element.id}
          style={{
            ...style,
            color: element.color,
            fontSize: `${element.fontSize}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {element.content}
        </div>
      );

    case 'image':
      return (
        <img
          key={element.id}
          src={element.content}
          alt={element.alt || 'Image'}
          style={style}
        />
      );

    case 'video':
      const videoSrc = (element.content || '');
      return (
        <iframe
          key={element.id}
          src={videoSrc}
          style={style}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={element.description || 'Video'}
          data-autoplay={element.autoplay ? 'true' : 'false'}
        />
      );

    case 'code':
      return (
        <pre
          key={element.id}
          style={{
            ...style,
            overflow: 'auto',
            backgroundColor: '#f5f5f5',
            padding: '10px',
          }}
        >
          <code>{element.content}</code>
        </pre>
      );

    default:
      return null;
  }
};

const PresentationPreview: React.FC<PresentationPreviewProps> = ({
  slides,
  containerSize
}) => {
  const revealRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const initReveal = async () => {
      if (revealRef.current && mounted) {
        if (deckRef.current) {
          try {
            deckRef.current.destroy();
          } catch (e) {
            console.error('Error destroying Reveal:', e);
          }
        }

        try {
          const newDeck = new Reveal({
            width: containerSize.width,
            height: containerSize.height,
            controls: true,
            progress: true,
            center: false,
            hash: false,
            transition: 'slide',
            margin: 0,
            minScale: 0.2,
            maxScale: 1.5,
            embedded: true,
            touch: false,
          });

          await newDeck.initialize({ container: revealRef.current });
          if (mounted) {
            deckRef.current = newDeck;
          }
        } catch (e) {
          console.error('Error initializing Reveal:', e);
        }
      }
    };

    initReveal();

    return () => {
      mounted = false;
      if (deckRef.current) {
        try {
          deckRef.current.destroy();
        } catch (e) {
          console.error('Error cleaning up Reveal:', e);
        }
      }
    };
  }, [containerSize]);

  return (
    <div
      className="reveal"
      ref={revealRef}
      style={{
        width: containerSize.width,
        height: containerSize.height
      }}
    >
      <div className="slides">
        {slides.map((slide) => (
          <section key={slide.sId} style={{ width: '100%', height: '100%' }}>
            <SlideContainer containerSize={containerSize}>
              {slide.img && (
                <img
                  src={slide.img}
                  alt="Background"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              )}
              {slide.elements.map((element) => (
                <ElementRenderer
                  key={element.id}
                  element={element}
                />
              ))}
            </SlideContainer>
          </section>
        ))}
      </div>
    </div>
  );
};
const PreviewModal: React.FC<PreviewModalProps> = ({
  slides,
  presentationId,
  containerSize,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div
        className="bg-white rounded-lg p-4 overflow-hidden items-center"
        style={{
          width: containerSize.width + 40,
          height: containerSize.height + 40,
        }}
      >
        <div className="flex justify-end mb-2">
          <Button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ×
          </Button>
        </div>
        <PresentationPreview
          slides={slides}
          presentationId={presentationId}
          containerSize={containerSize}
        />
      </div>
    </div>
  );
};

export { PresentationPreview, PreviewModal };