import { useEffect, useRef } from "react";

export default function PageTransitionLoader() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let disposed = false;
    let destroyAnimation: (() => void) | null = null;

    const loadAnimation = async () => {
      const [{ default: lottie }, { default: animationData }] = await Promise.all([
        import("lottie-web"),
        import("../assets/Dustbin.json")
      ]);

      if (disposed || !containerRef.current) return;

      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet"
        }
      });

      destroyAnimation = () => animation.destroy();
    };

    void loadAnimation();

    return () => {
      disposed = true;
      destroyAnimation?.();
    };
  }, []);

  return (
    <div className="page-transition-overlay" aria-live="polite" aria-busy="true">
      <div className="page-transition-card">
        <div className="page-transition-lottie" ref={containerRef} />
        <p>Loading page...</p>
      </div>
    </div>
  );
}
