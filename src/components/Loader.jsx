import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// NOTE: You need to replace these imports with your actual image paths
// or use placeholders if you don't have these specific assets yet.
import circuitIcon from "./src/assets/imgs/circuit.png";
import leafIcon from "./src/assets/imgs/leaf.png";
import mountainIcon from "./src/assets/imgs/mountain.png";
import personIcon from "./src/assets/imgs/person.png";

const Loader = ({ onLoaded }) => {
  const loaderRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  const vortexContainerRef = useRef(null);
  const centralLogoRef = useRef(null);
  const logoGlowRef = useRef(null);
  const explosionOverlayRef = useRef(null);
  const orbitalRingsRef = useRef([]);
  const ringIconsRef = useRef([]);

  // Use state to manage visibility if preferred, or just rely on DOM manipulation like original
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const counter = { val: 0 };
    const tl = gsap.timeline();

    // Use Refs for elements
    const centralLogo = centralLogoRef.current;
    const logoGlow = logoGlowRef.current;
    const counterWrap = loader.querySelector(".loader-counter"); // Or use ref
    const orbitalRings = orbitalRingsRef.current;
    const ringIcons = ringIconsRef.current;
    const explosionOverlay = explosionOverlayRef.current;
    const vortexContainer = vortexContainerRef.current;
    const progressBar = progressBarRef.current;
    const counterEl = counterRef.current;

    // Phase 1: Fade In
    tl.to(centralLogo, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.1);
    tl.to(logoGlow, { opacity: 0.6, duration: 0.5, ease: "power2.out" }, 0.2);
    tl.to(counterWrap, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.3);
    tl.to(
      orbitalRings,
      { opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" },
      0.4,
    );

    // Initial rotation set
    // Note: We need to target specific rings. Since we have refs, we can do this by index
    // Assuming order: Circuit (0), Leaf (1), Mountain (2), Person (3)
    if (ringIcons.length === 4) {
      gsap.set(ringIcons[0], { rotation: 0 });
      gsap.set(ringIcons[1], { rotation: 90 });
      gsap.set(ringIcons[2], { rotation: 180 });
      gsap.set(ringIcons[3], { rotation: 270 });
    }

    const rotateLoop = gsap.to(ringIcons, {
      rotation: "+=360",
      duration: 2,
      repeat: -1,
      ease: "none",
    });

    const progressTween = gsap.to(counter, {
      val: 90,
      duration: 2.5,
      ease: "power1.inOut",
      onUpdate() {
        if (counterEl) counterEl.textContent = String(Math.round(counter.val));
        if (progressBar)
          progressBar.style.width = Math.round(counter.val) + "%";
      },
    });

    const finishLoading = () => {
      progressTween.kill();

      const exitTl = gsap.timeline({
        onComplete: () => {
          setIsVisible(false);
          if (onLoaded) onLoaded();
        },
      });

      exitTl.to(counter, {
        val: 100,
        duration: 0.5,
        ease: "power2.out",
        onUpdate() {
          if (counterEl)
            counterEl.textContent = String(Math.round(counter.val));
          if (progressBar)
            progressBar.style.width = Math.round(counter.val) + "%";
        },
      });

      exitTl.to(rotateLoop, { timeScale: 5, duration: 0.5 }, 0);

      exitTl.to(
        ringIcons,
        {
          filter: "blur(20px)",
          scale: 1.5,
          duration: 0.6,
          ease: "power2.in",
        },
        0.5,
      );

      exitTl.to(
        explosionOverlay,
        {
          opacity: 1,
          scale: 2,
          duration: 0.6,
          ease: "power2.out",
        },
        0.6,
      );

      exitTl.to(
        [counterWrap, ".loader-progress", vortexContainer],
        {
          opacity: 0,
          duration: 0.4,
        },
        0.6,
      );

      exitTl.to(
        loader,
        {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        1.0,
      );
    };

    // Simulate load delay
    const loadTimeout = setTimeout(finishLoading, 2000); // 2s default delay

    return () => {
      clearTimeout(loadTimeout);
      tl.kill();
      rotateLoop.kill();
      progressTween.kill();
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes progressShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: progressShimmer 1.5s linear infinite;
          background-size: 200% 100%;
        }
      `}</style>

      <div
        ref={loaderRef}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#121212] pointer-events-auto"
      >
        {/* Vortex Container */}
        <div
          ref={vortexContainerRef}
          className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center"
        >
          <div
            ref={logoGlowRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full blur-[30px] opacity-0 -z-10"
            style={{
              background:
                "radial-gradient(circle, rgba(168, 85, 247, 0.6), rgba(236, 72, 153, 0.4), transparent)",
            }}
          ></div>

          {/* Orbital Rings */}
          {[
            {
              name: "circuit",
              icon: circuitIcon,
              color: "text-purple-500",
              borderColor: "border-purple-500",
            },
            {
              name: "leaf",
              icon: leafIcon,
              color: "text-green-500",
              borderColor: "border-green-500",
            },
            {
              name: "mountain",
              icon: mountainIcon,
              color: "text-orange-500",
              borderColor: "border-orange-500",
            },
            {
              name: "person",
              icon: personIcon,
              color: "text-pink-500",
              borderColor: "border-pink-500",
            },
          ].map((item, index) => (
            <div
              key={item.name}
              ref={(el) => (orbitalRingsRef.current[index] = el)}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110px] h-[110px] md:w-[140px] md:h-[140px] opacity-0 ${item.color}`}
            >
              <div
                ref={(el) => (ringIconsRef.current[index] = el)}
                className={`absolute w-[35px] h-[35px] md:w-[50px] md:h-[50px] top-0 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full bg-[#121212] border shadow-lg ${item.borderColor} origin-[center_55px] md:origin-[center_70px]`}
              >
                <img
                  src={item.icon}
                  alt=""
                  className="w-[55%] h-[55%] object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Explosion Overlay */}
        <div
          ref={explosionOverlayRef}
          className="fixed inset-0 z-[9998] opacity-0 scale-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgb(168, 85, 247), rgb(236, 72, 153), rgb(34, 211, 238))",
          }}
        ></div>

        {/* Counter */}
        <div className="loader-counter fixed bottom-[35%] left-1/2 -translate-x-1/2 z-[9999] flex items-baseline font-bold text-lg md:text-xl tracking-widest text-gray-300 opacity-0">
          <span
            ref={counterRef}
            className="counter-text tabular-nums min-w-[2.5ch] text-right"
          >
            0
          </span>
          <span className="text-sm opacity-60 ml-0.5">%</span>
        </div>

        {/* Progress Bar */}
        <div className="loader-progress fixed bottom-0 left-0 right-0 h-[2px] bg-white/5 z-[9999] overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full w-0 animate-shimmer"
            style={{
              background:
                "linear-gradient(90deg, rgb(168, 85, 247), rgb(236, 72, 153), rgb(34, 211, 238))",
              backgroundSize: "200% 100%",
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Loader;
