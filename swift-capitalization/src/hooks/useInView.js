import { useRef, useState, useEffect } from "react";

const useInView = (options = { threshold: 0.12 }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

export default useInView;
