import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset window scroll (used by /work and /work/:id)
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Also reset the homepage snap-scroll container if present
    const container = document.getElementById("scroll-container");
    if (container) {
      container.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
}
