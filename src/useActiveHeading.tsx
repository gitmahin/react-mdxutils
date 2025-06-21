import { useCallback, useEffect, useRef, useState } from "react";

export const useActiveHeading = (content: string) => {
  const [activeHeading, setActiveHeading] = useState<string>("");
  const headingListRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const activeIndicatorRef = useRef<HTMLDivElement | null>(null);
  const asideRef = useRef<HTMLDivElement | null>(null);

  const handleActiveHeading = useCallback(
    (btn: HTMLElement, hashLink?: string) => {
      setActiveHeading(hashLink || "");
      if (!activeIndicatorRef.current || !btn) return;
      requestAnimationFrame(() => {
        activeIndicatorRef.current!.style.height = `${btn.offsetHeight}px`;
        activeIndicatorRef.current!.style.top = `${btn.offsetTop}px`;
        activeIndicatorRef.current!.style.width = `${btn.offsetWidth}px`;
        activeIndicatorRef.current!.style.left = `${btn.offsetLeft}px`;
      });
    },
    [activeHeading]
  );

  const handleHashChange = () => {
    setActiveHeading(window.location.hash);
  };

  useEffect(() => {
    // Initialize the active hash when the component mounts
    handleHashChange();

    // Listen for hash change events
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      // Cleanup the event listener on unmount
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (!content) return;

    const observerTimeout = setTimeout(() => {
      const headings = document.querySelectorAll(
        "h2[id], h3[id], h4[id], h5[id], h6[id]"
      );

      const observer = new IntersectionObserver(
        (entries) => {
          const visibleHeadings = entries.filter(
            (entry) => entry.isIntersecting
          );
          if (visibleHeadings.length > 0) {
            const sorted = visibleHeadings.sort(
              (a, b) =>
                a.target.getBoundingClientRect().top -
                b.target.getBoundingClientRect().top
            );
            const activeId = sorted?.[0]?.target.id;
            if (activeId) {
              setActiveHeading(`#${activeId}`);
              if (headingListRefs.current) {
                const activeListElement = headingListRefs.current[
                  activeId
                ] as HTMLElement;

                if (asideRef.current && activeListElement) {
                  const aside = asideRef.current;
                  const offsetTop = activeListElement.offsetTop;
                  const elementHeight = activeListElement.offsetHeight;

                  aside.scrollTo({
                    top: offsetTop - aside.clientHeight / 2 + elementHeight / 2,
                    behavior: "smooth",
                  });
                }

                handleActiveHeading(activeListElement);
              }
            }
          }
        },
        {
          rootMargin: "0px 0px -90% 0px", // Triggers earlier when scrolling down
          threshold: 0.2,
        }
      );

      headings.forEach((heading) => observer.observe(heading));

      return () => {
        headings.forEach((heading) => observer.unobserve(heading));
      };
    }, 100); // slight delay to ensure DOM is painted

    return () => clearTimeout(observerTimeout);
  }, [content]); // Re-run when mdxContent changes

  return {
    activeHeading,
    handleActiveHeading,
    headingListRefs,
    activeIndicatorRef,
    asideRef,
  };
};
