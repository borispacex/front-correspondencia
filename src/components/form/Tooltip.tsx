import { ReactNode, useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    transform: '',
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    const spacing = 10;

    const positions = {
      top: {
        top: rect.top - spacing,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, -100%)',
      },

      bottom: {
        top: rect.bottom + spacing,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%)',
      },

      left: {
        top: rect.top + rect.height / 2,
        left: rect.left - spacing,
        transform: 'translate(-100%, -50%)',
      },

      right: {
        top: rect.top + rect.height / 2,
        left: rect.right + spacing,
        transform: 'translateY(-50%)',
      },
    };

    setCoords(positions[position]);
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    window.addEventListener('scroll', updatePosition, true);

    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);

      window.removeEventListener('resize', updatePosition);
    };
  }, [open, position]);

  // cerrar click afuera mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleOutside = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleOutside);

    return () => {
      document.removeEventListener('click', handleOutside);
    };
  }, [isMobile]);

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex cursor-pointer"
        onMouseEnter={() => {
          if (!isMobile) {
            setOpen(true);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile) {
            setOpen(false);
          }
        }}
        onClick={(e) => {
          if (isMobile) {
            e.stopPropagation();

            setOpen((prev) => !prev);
          }
        }}
      >
        {children}
      </div>

      {open &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              transform: coords.transform,
              zIndex: 999999,
            }}
            className="pointer-events-none max-w-[280px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm leading-relaxed break-words whitespace-normal text-gray-700 shadow-2xl dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
