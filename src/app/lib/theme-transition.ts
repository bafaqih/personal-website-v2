import { flushSync } from "react-dom";

/**
 * Executes a circular reveal theme toggle transition using the View Transitions API.
 * Falls back to standard instant theme change if not supported or motion is reduced.
 */
export function toggleThemeWithTransition(
  resolvedTheme: string | undefined,
  setTheme: (theme: string) => void,
  e: React.MouseEvent
) {
  // 1. Fallback for browsers that don't support View Transitions or if reduced motion is preferred
  if (
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    return;
  }

  // 2. Extract mouse coordinates to set the origin of the circle transition
  const x = e.clientX;
  const y = e.clientY;

  // 3. Start the transition and synchronously update the theme state
  const transition = document.startViewTransition(() => {
    flushSync(() => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    });
  });

  // 4. Animate the circular clip path
  transition.ready.then(() => {
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 350,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
}
