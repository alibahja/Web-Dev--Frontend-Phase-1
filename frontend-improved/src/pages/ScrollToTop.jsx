import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
  document.documentElement.scrollTo(0, 0);
  setTimeout(() => {
    document.documentElement.scrollTo(0, 0);
  }, 0);
}, [pathname]);

  return null;
};

export default ScrollToTop;