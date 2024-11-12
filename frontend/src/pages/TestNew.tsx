import React, { useEffect, useRef } from 'react';
import interact from 'interactjs';

function EditPage() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  let x = 0;
  let y = 0;

  useEffect(() => {
    if (elementRef.current) {
      interact(elementRef.current)
        .draggable({
          modifiers: [
            interact.modifiers.snap({
              targets: [interact.snappers.grid({ x: 1, y: 1 })],
              range: Infinity,
              relativePoints: [{ x: 0, y: 0 }],
            }),
            interact.modifiers.restrict({
              restriction: elementRef.current.parentNode as HTMLElement,
              elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
              endOnly: true,
            }),
          ],
          inertia: false,
        })
        .on('dragmove', (event) => {
          x += event.dx;
          y += event.dy;
          if (event.target instanceof HTMLElement) {
            event.target.style.transform = `translate(${x}px, ${y}px)`;
          }
        });

        interact(elementRef.current)
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          listeners: {
            move(event) {
              const target = event.target as HTMLElement;
              let x = (parseFloat(target.getAttribute('data-x') || '0') || 0);
              let y = (parseFloat(target.getAttribute('data-y') || '0') || 0);

              // Update the element's size
              target.style.width = `${event.rect.width}px`;
              target.style.height = `${event.rect.height}px`;

              // Translate when resizing from top or left edges
              x += event.deltaRect.left;
              y += event.deltaRect.top;

              target.style.transform = `translate(${x}px, ${y}px)`;

              target.setAttribute('data-x', x.toString());
              target.setAttribute('data-y', y.toString());
            },
          },
          modifiers: [
            interact.modifiers.restrictEdges({
              outer: 'parent',
            }),
            interact.modifiers.restrictSize({
              min: { width: 100, height: 50 },
            }),
          ],
          inertia: true,
        })
        .draggable({
          listeners: {
            move(event) {
              const target = event.target as HTMLElement;
              let x = (parseFloat(target.getAttribute('data-x') || '0') || 0) + event.dx;
              let y = (parseFloat(target.getAttribute('data-y') || '0') || 0) + event.dy;

              target.style.transform = `translate(${x}px, ${y}px)`;

              target.setAttribute('data-x', x.toString());
              target.setAttribute('data-y', y.toString());
            },
          },
          inertia: false,
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: 'parent',
              endOnly: true,
            }),
          ],
        });
    }
  }, []);

  return (
    <div className="ml-auto mr-auto w-[40vw] h-[50vh] pt-[20%] border">
        <div
        id="grid-snap"
        ref={elementRef}
        style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#ccc',
            cursor: 'move',
            display: 'inline-block',
        }}
        >
        </div>
    </div>
  );
};

export default EditPage;
