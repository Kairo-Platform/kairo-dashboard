export const scrollToTop = (): void => {
  if (typeof window === "undefined") return;

  let intervalId: number | NodeJS.Timeout | null = null;

  function scrollStep(): void {
    if (window.pageYOffset === 0) {
      if (intervalId !== null) clearInterval(intervalId);
      return;
    }
    window.scroll(0, window.pageYOffset - 200);
  }

  function startScroll(): void {
    intervalId = window.setInterval(scrollStep, 10) as unknown as
      | number
      | NodeJS.Timeout;
  }

  startScroll();
};

export default scrollToTop;
