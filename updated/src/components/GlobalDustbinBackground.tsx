import { useEffect, useRef } from "react";

export default function GlobalDustbinBackground() {
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
    <div className="global-dustbin-bg" aria-hidden="true">
      <div ref={containerRef} className="global-dustbin-lottie" />
    </div>
  );
}
