import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds: string[], offset = 0) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections: string[] = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) {
              visibleSections.push(id);
            }
          }
        });

        if (visibleSections.length > 0) {
          setActiveId(visibleSections[0]);
        }
      },
      {
        rootMargin: `-${offset}px 0px 0px 0px`,
        threshold: 0.3, // ✅ important! triggers when 30% visible
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [sectionIds, offset]);

  return activeId;
}
