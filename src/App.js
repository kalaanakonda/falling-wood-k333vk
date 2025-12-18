import React, { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Mail,
  Linkedin,
  Twitter,
  Download,
  Menu,
  X,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  // REFS
  const bioRef = useRef(null);
  const paintingRefs = useRef({});
  const lastTrailPos = useRef({ x: 0, y: 0 });
  const trailIndex = useRef(0);

  // TRAIL STATE
  const [trail, setTrail] = useState([]);

  // CONFETTI STATE
  const [particles, setParticles] = useState([]);

  // GAME STATE
  const [artists, setArtists] = useState([]);
  const [matches, setMatches] = useState({});
  const [draggedArtist, setDraggedArtist] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [highestZ, setHighestZ] = useState(20);
  const [hoveredMatchId, setHoveredMatchId] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  const trailImages = [
    "https://images.pexels.com/photos/159862/art-school-of-athens-raphael-italian-painter-fresco-159862.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://cdn.britannica.com/24/189624-050-F3C5BAA9/Mona-Lisa-oil-wood-panel-Leonardo-da.jpg",
    "https://artincontext.org/wp-content/uploads/2021/06/High-Renaissance.jpg",
    "https://eii38vo2nqq.exactdn.com/web/app/uploads/2022/02/Basso-Rinascimento.jpg?strip=all&lossy=1&ssl=1",
    "https://kmska.be/_next/image?url=https%3A%2F%2Fproductionbackend.kmska.be%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Flandscape%2Fpublic%2F2021-11%2Frubens-jan-gaspard-gevartius-kmska.jpg%3Fh%3D0da0242e%26itok%3DTVSMUcf-&w=3840&q=75",
    "https://images.pexels.com/photos/159862/art-school-of-athens-raphael-italian-painter-fresco-159862.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://cdn.britannica.com/24/189624-050-F3C5BAA9/Mona-Lisa-oil-wood-panel-Leonardo-da.jpg",
    "https://artincontext.org/wp-content/uploads/2021/06/High-Renaissance.jpg",
    "https://eii38vo2nqq.exactdn.com/web/app/uploads/2022/02/Basso-Rinascimento.jpg?strip=all&lossy=1&ssl=1",
    "https://kmska.be/_next/image?url=https%3A%2F%2Fproductionbackend.kmska.be%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Flandscape%2Fpublic%2F2021-11%2Frubens-jan-gaspard-gevartius-kmska.jpg%3Fh%3D0da0242e%26itok%3DTVSMUcf-&w=3840&q=75",
  ];

  // GAME DATA
  const initialPaintings = [
    {
      id: "p1",
      matchId: 1,
      src: "https://images.pexels.com/photos/159862/art-school-of-athens-raphael-italian-painter-fresco-159862.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      label: "The School of Athens",
      summary:
        "This masterpiece represents Philosophy. It gathers the greatest minds of antiquity, including Plato and Aristotle, in a grand architectural setting.",
    },
    {
      id: "p2",
      matchId: 2,
      src: "https://cdn.britannica.com/24/189624-050-F3C5BAA9/Mona-Lisa-oil-wood-panel-Leonardo-da.jpg",
      label: "Mona Lisa",
      summary:
        "The archetype of the Renaissance portrait. Famous for her enigmatic smile and the masterful use of sfumato that softens the transition between colors.",
    },
    {
      id: "p3",
      matchId: 3,
      src: "https://artincontext.org/wp-content/uploads/2021/06/High-Renaissance.jpg",
      label: "Creation of Adam",
      summary:
        "The most iconic fresco of the Sistine Chapel ceiling. It captures the moment God breathes life into Adam, their fingers almost touching.",
    },
    {
      id: "p4",
      matchId: 4,
      src: "https://eii38vo2nqq.exactdn.com/web/app/uploads/2022/02/Basso-Rinascimento.jpg?strip=all&lossy=1&ssl=1",
      label: "Renaissance Masterpiece",
      summary:
        "A stunning example of Florentine art, celebrated for its delicate lines, mythological symbolism, and ethereal beauty.",
    },
    {
      id: "p5",
      matchId: 5,
      src: "https://kmska.be/_next/image?url=https%3A%2F%2Fproductionbackend.kmska.be%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Flandscape%2Fpublic%2F2021-11%2Frubens-jan-gaspard-gevartius-kmska.jpg%3Fh%3D0da0242e%26itok%3DTVSMUcf-&w=3840&q=75",
      label: "Portrait of Gevartius",
      summary:
        "A vivid portrait of the scholar Jan Caspar Gevartius. It demonstrates the artist's incredible ability to render skin tones and intellectual depth.",
    },
  ];

  const initialArtists = [
    {
      id: "a1",
      matchId: 1,
      src: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Raffaello_Sanzio.jpg",
      label: "Raphael",
      desc: "High Renaissance Master",
    },
    {
      id: "a2",
      matchId: 2,
      src: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Leonardo_self.jpg",
      label: "Leonardo da Vinci",
      desc: "Polymath & Painter",
    },
    {
      id: "a3",
      matchId: 3,
      src: "https://upload.wikimedia.org/wikipedia/commons/0/02/Michelangelo_Daniele_da_Volterra_%28dettaglio%29.jpg",
      label: "Michelangelo",
      desc: "Sculptor & Painter",
    },
    {
      id: "a4",
      matchId: 4,
      src: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Sandro_Botticelli_083.jpg",
      label: "Sandro Botticelli",
      desc: "Early Renaissance",
    },
    {
      id: "a5",
      matchId: 5,
      src: "https://d3vjn2zm46gms2.cloudfront.net/blogs/2014/10/27010656/peter-paul-rubens-facts-secrets.jpg",
      label: "Peter Paul Rubens",
      desc: "Flemish Baroque",
    },
  ];

  const contactData = {
    email: "reachout@yogindersuria.live",
    twitter: "https://x.com/suriagraphics",
    linkedin: "https://www.linkedin.com/in/yogi-suria-a8b787316/",
    location: "India",
  };

  const projects = [
    {
      id: 1,
      title: "P2P.org",
      category: "Brand and Motion Design",
      description:
        "Contributed to brand design efforts across social media, motion graphics, and client offers during a period when the company surpassed $10B in TVL.",
      stats: "$10B+ TVL",
      image:
        "https://framerusercontent.com/images/c2fFBSMJhNsXno07r9aLiE9IGwM.png?width=1633&height=1633",
      url: "https://www.p2p.org/",
    },
    {
      id: 2,
      title: "Kelp DAO",
      category: "Brand and Motion Design",
      description:
        "Contributed to brand and motion design initiatives during a growth phase where Kelp DAO's TVL increased from $900M to over $1.2B. Produced video assets for partnerships.",
      stats: "$1.2B TVL",
      image:
        "https://www.nftgators.com/wp-content/uploads/2024/05/Kelp-DAO.png",
      url: "https://kerneldao.com/kelp/",
    },
    {
      id: 3,
      title: "Blockwiz",
      category: "UIUX Design",
      description:
        "Led the redesign of 40+ landing pages within just two months, contributing to generating over $250K in revenue.",
      stats: "$250K+ Revenue",
      image:
        "https://framerusercontent.com/images/4quSKwxzYwx7ZZGy47KRCIGJM.png?width=1633&height=1633",
      url: "https://www.linkedin.com/company/blockwiz/",
    },
    {
      id: 4,
      title: "Bitfinity Network",
      category: "Graphic Design",
      description:
        "Supported marketing efforts as a generalist designer during their $7M+ fundraising phase, working across motion and 3D.",
      stats: "$7M+ Raised",
      image:
        "https://framerusercontent.com/images/MP5IlCLDqUYkSeHrfqc2RAspM.png?width=1633&height=1633",
      url: "https://bitfinity.network/",
    },
  ];

  // Initialize Scripts (Lenis & Spline)
  useEffect(() => {
    const scriptSpline = document.createElement("script");
    scriptSpline.type = "module";
    scriptSpline.src =
      "https://unpkg.com/@splinetool/viewer@1.12.16/build/spline-viewer.js";
    document.body.appendChild(scriptSpline);

    let lenis;
    const scriptLenis = document.createElement("script");
    scriptLenis.src = "https://unpkg.com/lenis@1.0.45/dist/lenis.min.js";
    scriptLenis.async = true;
    scriptLenis.onload = () => {
      lenis = new window.Lenis({ lerp: 0.02, smoothWheel: true });
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    };
    document.body.appendChild(scriptLenis);

    return () => {
      if (lenis) lenis.destroy();
      document.body.removeChild(scriptSpline);
      document.body.removeChild(scriptLenis);
    };
  }, []);

  // Initialize Artists with scatter
  useEffect(() => {
    setArtists(
      initialArtists.map((a) => ({
        ...a,
        x: Math.random() * 80 + 5,
        y: Math.random() * 20 + 60,
        rotation: Math.random() * 30 - 15,
        zIndex: Math.floor(Math.random() * 10) + 20,
        isMatched: false,
      }))
    );
  }, []);

  // Check for game completion
  useEffect(() => {
    if (Object.keys(matches).length === initialPaintings.length) {
      setGameComplete(true);
    }
  }, [matches]);

  // Project Scroll Observer & Bio Trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === bioRef.current) {
              setTimeout(() => {
                setIsBioExpanded(true);
              }, 1000);
            }
            const index = parseInt(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setActiveProject(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (bioRef.current) observer.observe(bioRef.current);
    projects.forEach((_, index) => {
      const el = document.getElementById(`project-${index}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // PARTICLE SYSTEM LOGIC
  useEffect(() => {
    if (particles.length === 0) return;

    let animationId;
    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5,
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );

      animationId = requestAnimationFrame(updateParticles);
    };

    animationId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationId);
  }, [particles.length]);

  const spawnConfetti = (x, y) => {
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
    ];
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15 - 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1.0,
      size: Math.random() * 8 + 4,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
      setCursorPos({ x: e.clientX, y: e.clientY });

      // Trail
      if (window.scrollY < window.innerHeight) {
        const dist = Math.hypot(
          e.clientX - lastTrailPos.current.x,
          e.clientY - lastTrailPos.current.y
        );
        if (dist > 60) {
          const id = Date.now();
          const src = trailImages[trailIndex.current % trailImages.length];
          trailIndex.current += 1;
          lastTrailPos.current = { x: e.clientX, y: e.clientY };

          const newTrailItem = {
            x: e.clientX,
            y: e.clientY,
            id,
            src,
            rotation: Math.random() * 30 - 15,
          };
          setTrail((prev) => [...prev, newTrailItem]);
          setTimeout(
            () => setTrail((prev) => prev.filter((item) => item.id !== id)),
            1200
          );
        }
      }

      // Drag
      if (draggedArtist !== null) {
        const container = document.getElementById("game-container");
        if (container) {
          const rect = container.getBoundingClientRect();
          const xPercent =
            ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
          const yPercent =
            ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;

          setArtists((prev) =>
            prev.map((a) => {
              if (a.id === draggedArtist) {
                return { ...a, x: xPercent, y: yPercent };
              }
              return a;
            })
          );
        }
      }
    };

    const handleMouseUp = (e) => {
      if (draggedArtist !== null) {
        const artist = artists.find((a) => a.id === draggedArtist);

        Object.keys(paintingRefs.current).forEach((pId) => {
          const el = paintingRefs.current[pId];
          if (!el) return;
          const pRect = el.getBoundingClientRect();
          if (
            e.clientX >= pRect.left &&
            e.clientX <= pRect.right &&
            e.clientY >= pRect.top &&
            e.clientY <= pRect.bottom
          ) {
            const painting = initialPaintings.find((p) => p.id === pId);
            if (painting && painting.matchId === artist.matchId) {
              setMatches((prev) => ({ ...prev, [pId]: artist }));
              setArtists((prev) =>
                prev.map((a) =>
                  a.id === draggedArtist ? { ...a, isMatched: true } : a
                )
              );
              spawnConfetti(
                pRect.left + pRect.width / 2,
                pRect.top + pRect.height / 2
              );
            }
          }
        });
        setDraggedArtist(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedArtist, dragOffset, artists]);

  const startDrag = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const artist = artists.find((a) => a.id === id);
    if (artist.isMatched) return;

    const container = document.getElementById("game-container");
    if (container) {
      const rect = container.getBoundingClientRect();
      const pixelX = (artist.x / 100) * rect.width;
      const pixelY = (artist.y / 100) * rect.height;

      setDragOffset({
        x: e.clientX - rect.left - pixelX,
        y: e.clientY - rect.top - pixelY,
      });
      setDraggedArtist(id);
      setHighestZ((prev) => prev + 1);
      setArtists((prev) =>
        prev.map((a) => (a.id === id ? { ...a, zIndex: highestZ + 1 } : a))
      );
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen font-serif selection:bg-orange-500 selection:text-white cursor-none-if-hovering-hero">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Inter:wght@300;400;500;600&display=swap');
        
        body { font-family: 'Instrument Serif', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-serif { font-family: 'Instrument Serif', serif; }
        
        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        .lenis.lenis-scrolling iframe { pointer-events: none; }

        @keyframes fadeOut {
          0% { opacity: 1; transform: translate(-50%, -50%) rotate(var(--rot)); }
          100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--rot)); }
        }
      `}</style>

      {/* CONFETTI LAYER */}
      <div className="fixed inset-0 pointer-events-none z-[70]">
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              opacity: p.life,
              transform: `translate(-50%, -50%) rotate(${p.life * 360}deg)`,
              borderRadius: Math.random() > 0.5 ? "50%" : "0%",
            }}
          />
        ))}
      </div>

      {/* MOUSE TRAIL LAYER */}
      <div className="fixed inset-0 pointer-events-none z-[6]">
        {trail.map((item) => (
          <img
            key={item.id}
            src={item.src}
            alt=""
            className="absolute w-24 h-auto object-cover rounded shadow-xl"
            style={{
              left: item.x,
              top: item.y,
              "--rot": `${item.rotation}deg`,
              animation: "fadeOut 1.2s forwards",
            }}
          />
        ))}
      </div>

      {/* MATCHED PAINTING DESCRIPTION TOOLTIP */}
      {hoveredMatchId &&
        (() => {
          const painting = initialPaintings.find(
            (p) => p.id === hoveredMatchId
          );
          const artist = matches[painting.id];
          if (!painting || !artist) return null;

          return (
            <div
              className="fixed z-[60] pointer-events-none bg-white p-6 rounded shadow-2xl max-w-xs border border-black/10 transition-opacity duration-300 transform"
              style={{
                left: cursorPos.x + 20,
                top: cursorPos.y + 20,
              }}
            >
              <h4 className="font-serif text-2xl mb-2 leading-tight">
                {painting.label}
              </h4>
              <p className="font-sans text-xs opacity-70 mb-4 leading-relaxed">
                {painting.summary}
              </p>
              <div className="text-xs font-serif italic text-orange-500 border-t border-gray-100 pt-2">
                by {artist.label}
              </div>
            </div>
          );
        })()}

      {/* SPLINE BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-black font-sans text-xs uppercase tracking-widest opacity-50 animate-pulse">
              Please wait while the scene loads
            </p>
          </div>
        </div>
        <spline-viewer
          url="https://prod.spline.design/EQHzlukjfGv0BaAG/scene.splinecode"
          style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
        ></spline-viewer>
      </div>

      {/* DYNAMIC GEOMETRIC LINES */}
      <div
        className={`fixed inset-0 z-[5] pointer-events-none transition-colors duration-700 ${
          isScrolled ? "text-black" : "text-white"
        }`}
        style={{
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
        }}
      >
        <svg
          className={`w-full h-full transition-opacity duration-700 ${
            isScrolled ? "opacity-10" : "opacity-30"
          }`}
        >
          <circle
            cx="85%"
            cy="15%"
            r="400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
            style={{
              transformOrigin: "85% 15%",
              transform: `rotate(${scrollY * 0.05 + mousePos.x * 5}deg)`,
            }}
          />
          <circle
            cx="85%"
            cy="15%"
            r="380"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.5"
            style={{
              transformOrigin: "85% 15%",
              transform: `rotate(-${scrollY * 0.08 + mousePos.y * 5}deg)`,
            }}
          />
          {[10, 30, 50, 70, 90].map((pos, i) => (
            <g
              key={i}
              style={{
                transform: `translate(${mousePos.x * (i + 1) * 2}px, ${
                  scrollY * (0.1 + i * 0.05)
                }px)`,
              }}
            >
              <path
                d={`M ${pos}% 20 L ${pos}% 22 M ${pos - 0.5}% 21 L ${
                  pos + 0.5
                }% 21`}
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d={`M ${pos}% 80 L ${pos}% 82 M ${pos - 0.5}% 81 L ${
                  pos + 0.5
                }% 81`}
                stroke="currentColor"
                strokeWidth="1"
              />
            </g>
          ))}
          <rect
            x="65%"
            y="30%"
            width="25%"
            height="40%"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            style={{
              transformOrigin: "77.5% 50%",
              transform: `scale(${1 + scrollY * 0.0005}) rotate(${
                scrollY * 0.02 + mousePos.x * 2
              }deg) translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
            }}
          />
          <line
            x1="15%"
            y1="0"
            x2="15%"
            y2="100%"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="10 10"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          />
          <line
            x1="85%"
            y1="0"
            x2="85%"
            y2="100%"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="10 10"
            style={{ transform: `translateY(-${scrollY * 0.2}px)` }}
          />
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.3"
            style={{
              transform: `translateY(${scrollY * 0.5 + mousePos.y * 20}px)`,
            }}
          />
          <g transform="translate(100, 800)">
            <path
              d="M 0 0 L 100 0 L 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              style={{ transform: `rotate(${scrollY * 0.1}deg)` }}
            />
            <circle cx="0" cy="0" r="5" fill="currentColor" />
          </g>
        </svg>
      </div>

      {/* CONTENT LAYER */}
      <div
        className={`relative z-10 pointer-events-none transition-colors duration-700 ${
          isScrolled ? "text-black" : "text-white"
        }`}
      >
        {/* Navigation - PROGRESSIVE BLUR & SOUND ICON */}
        <nav className="absolute top-0 left-0 w-full px-6 py-6 flex justify-between items-center z-50 pointer-events-none">
          <div
            className="absolute inset-0 z-[-1]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
            }}
          ></div>

          <div
            className="pointer-events-auto cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <h1
              className={`text-2xl font-bold tracking-tight transition-colors duration-700 font-serif ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              YOGI SURIA
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-8 pointer-events-auto">
            {["Projects", "Playground", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`text-base font-medium hover:opacity-60 transition-colors duration-300 uppercase tracking-widest font-serif cursor-pointer ${
                  isScrolled ? "text-black" : "text-white"
                }`}
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`hover:opacity-60 transition-opacity ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="md:hidden pointer-events-auto flex items-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`hover:opacity-60 transition-opacity ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className={isScrolled ? "text-black" : "text-white"} />
              ) : (
                <Menu className={isScrolled ? "text-black" : "text-white"} />
              )}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 text-black md:hidden pointer-events-auto">
            {["Projects", "Playground", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-3xl font-bold uppercase tracking-widest font-serif"
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* HERO */}
        <section
          id="hero"
          className="min-h-screen w-full flex flex-col justify-end pb-24 px-6 md:px-12 pointer-events-none"
        >
          <div className="max-w-4xl relative">
            <p className="text-sm md:text-base font-medium tracking-widest mb-4 opacity-80 uppercase font-sans">
              Digital Designer • Web3 Specialist
            </p>
            <div className="pointer-events-auto inline-block">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tighter leading-[0.9] mb-8 font-serif hover:opacity-90 transition-opacity">
                Crafting the <br />
                Future of Web3
              </h2>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <a
                href={`mailto:${contactData.email}`}
                className={`pointer-events-auto group flex items-center gap-2 px-6 py-3 border rounded-full w-fit transition-all duration-300 hover:bg-white hover:text-black font-serif ${
                  isScrolled ? "border-black" : "border-white"
                }`}
              >
                <span className="text-lg">Get in Touch</span>
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </a>
              <div className="flex items-center gap-4 text-sm opacity-70 cursor-default font-sans">
                <span>• Brand Design</span>
                <span>• Motion</span>
                <span>• UI/UX</span>
              </div>
            </div>
          </div>
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce pointer-events-auto cursor-pointer"
            onClick={() => scrollToSection("projects")}
          >
            <ChevronDown className="w-6 h-6 opacity-50" />
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="min-h-screen w-full py-24 px-6 md:px-12 pointer-events-none"
        >
          <div className="mb-20">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-50 font-sans">
              Selected Works
            </h3>
            <p
              ref={bioRef}
              className="text-4xl md:text-6xl max-w-4xl leading-tight font-light font-serif pointer-events-auto cursor-default"
            >
              Hi, I'm
              <span className="relative inline-flex items-center align-middle mx-4 cursor-pointer">
                <span className="relative z-10">Yogi</span>

                {/* Expander - Adjusted width to be smaller (w-40) */}
                <span
                  className={`
                    relative inline-flex items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${
                      isBioExpanded
                        ? "w-40 opacity-100 ml-4"
                        : "w-0 opacity-0 ml-0"
                    }
                  `}
                  style={{ height: "5rem" }}
                >
                  {/* Container for absolute items */}
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center w-40">
                    {/* Arrow - Using white */}
                    <svg
                      width="60"
                      height="40"
                      viewBox="0 0 60 40"
                      fill="none"
                      className="mr-2 transform -translate-y-2"
                    >
                      <path
                        d="M 55 20 Q 30 35 5 20"
                        stroke={isScrolled ? "black" : "white"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: 60,
                          strokeDashoffset: isBioExpanded ? 0 : 60,
                          transition: "stroke-dashoffset 0.8s ease-out 0.2s",
                        }}
                      />
                      <path
                        d="M 5 20 L 12 14"
                        stroke={isScrolled ? "black" : "white"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{
                          opacity: isBioExpanded ? 1 : 0,
                          transition: "opacity 0.3s ease-out 0.8s",
                        }}
                      />
                      <path
                        d="M 5 20 L 12 26"
                        stroke={isScrolled ? "black" : "white"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{
                          opacity: isBioExpanded ? 1 : 0,
                          transition: "opacity 0.3s ease-out 0.8s",
                        }}
                      />
                    </svg>

                    {/* Image - USING GOOGLE DRIVE LINK */}
                    <img
                      src="https://pbs.twimg.com/profile_images/1998797364539305987/zn3gklud_400x400.jpg"
                      alt="Yogi"
                      className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
                      style={{
                        transform: isBioExpanded
                          ? "scale(1) rotate(0deg)"
                          : "scale(0) rotate(15deg)",
                        transition:
                          "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    />
                  </span>
                </span>
              </span>
              and I design strategic solutions for the decentralized web
              ecosystem.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="hidden lg:block w-1/3">
              <div className="sticky top-32 space-y-6">
                {projects.map((project, index) => (
                  <div key={index} className="group">
                    <div
                      className={`flex items-baseline justify-between border-b pb-2 mb-1 transition-all duration-500 ${
                        activeProject === index
                          ? "border-black opacity-100"
                          : "border-gray-300 opacity-40"
                      }`}
                    >
                      <span className="text-lg font-medium font-serif">
                        0{index + 1}
                      </span>
                      <span className="text-sm opacity-50 group-hover:opacity-100 transition-opacity font-sans">
                        {project.category}
                      </span>
                    </div>
                    <h4
                      className={`text-3xl font-serif italic transition-opacity duration-300 ${
                        activeProject === index ? "opacity-100" : "opacity-40"
                      }`}
                    >
                      {project.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-2/3 space-y-32">
              {projects.map((project, index) => (
                <div
                  id={`project-${index}`}
                  data-index={index}
                  key={project.id}
                  className="group relative"
                >
                  <div className="relative aspect-[4/3] md:aspect-[16/9] w-full bg-gray-100/10 backdrop-blur-sm rounded-sm overflow-hidden mb-8 shadow-sm group-hover:shadow-md transition-shadow border border-white/20">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>

                    <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm p-4 rounded shadow-lg max-w-xs transform group-hover:-translate-y-2 transition-transform duration-500 text-black">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1 font-sans">
                        Impact
                      </span>
                      <span className="text-xl font-serif italic">
                        {project.stats}
                      </span>
                    </div>
                  </div>

                  {/* Content Block Below Image */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="hidden lg:block text-sm font-bold uppercase tracking-wider opacity-30 font-sans mt-1">
                      0{index + 1} — {project.category}
                    </div>
                    <div className="max-w-xl">
                      <h3 className="text-3xl font-serif italic mb-3 lg:hidden">
                        {project.title}
                      </h3>
                      <p className="text-lg leading-relaxed opacity-60 font-sans mb-6">
                        {project.description}
                      </p>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pointer-events-auto flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all font-serif"
                      >
                        Live Project <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CURATOR GAME */}
        <section
          id="playground"
          className="min-h-screen w-full py-24 px-6 md:px-12 bg-white/80 backdrop-blur-md text-black pointer-events-auto overflow-hidden relative"
        >
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <div className="mb-12 pointer-events-auto z-20 relative text-center lg:text-left">
              <h2 className="text-6xl md:text-8xl font-light tracking-tighter mb-4 font-serif">
                The Curator
              </h2>
              <p className="text-lg opacity-60 font-sans max-w-xl mx-auto lg:mx-0">
                Match the Master to the Masterpiece. Drag the artist to their
                painting.
              </p>
            </div>

            <div
              id="game-container"
              className="flex-grow relative w-full h-[70vh] border border-black/10 rounded-lg bg-gray-50/50 overflow-hidden shadow-inner"
            >
              <div className="absolute top-10 left-0 w-full flex justify-center gap-4 px-4 z-10">
                {initialPaintings.map((painting) => {
                  const matchedArtist = matches[painting.id];
                  const isFocused = hoveredMatchId === painting.id;
                  const isBlurred =
                    (hoveredMatchId && hoveredMatchId !== painting.id) ||
                    (draggedArtist && !matchedArtist);

                  return (
                    <div
                      key={painting.id}
                      ref={(el) => (paintingRefs.current[painting.id] = el)}
                      onMouseEnter={() =>
                        matchedArtist && setHoveredMatchId(painting.id)
                      }
                      onMouseLeave={() => setHoveredMatchId(null)}
                      className={`relative w-1/5 aspect-[3/4] bg-white shadow-xl rounded-sm border border-black/10 transition-all duration-500 ease-out p-2
                         ${
                           isFocused
                             ? "scale-125 z-50 shadow-2xl"
                             : "hover:scale-105"
                         }
                         ${isBlurred ? "blur-sm opacity-40 scale-95" : ""}
                       `}
                    >
                      <div className="relative w-full h-full overflow-hidden rounded-sm">
                        <img
                          src={painting.src}
                          alt={painting.label}
                          className="w-full h-full object-cover pointer-events-none select-none"
                        />
                      </div>

                      {/* MATCHED ARTIST - SNAP TO CORNER */}
                      {matchedArtist && (
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-sm overflow-hidden border-2 border-white shadow-md z-20">
                          <img
                            src={matchedArtist.src}
                            className="w-full h-full object-cover"
                            alt="artist"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {artists
                .filter((a) => !a.isMatched)
                .map((artist) => (
                  <div
                    key={artist.id}
                    onMouseDown={(e) => startDrag(e, artist.id)}
                    className="absolute cursor-grab active:cursor-grabbing group hover:z-50"
                    style={{
                      left: `${artist.x}%`,
                      top: `${artist.y}%`,
                      width: "120px",
                      zIndex: artist.zIndex,
                      height: "120px",
                      transform: `translate(-50%, -50%) rotate(${artist.rotation}deg)`,
                    }}
                  >
                    <div className="relative w-full h-full p-1 bg-white shadow-lg rounded-sm transform transition-transform hover:scale-110 duration-300">
                      <div className="w-full h-full rounded-sm overflow-hidden border border-black/5">
                        <img
                          src={artist.src}
                          alt={artist.label}
                          className="w-full h-full object-cover pointer-events-none select-none"
                        />
                      </div>
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded shadow-xl z-50 text-center">
                        <span className="block text-sm font-serif">
                          {artist.label}
                        </span>
                        <span className="block text-[10px] font-sans opacity-70 uppercase tracking-wider">
                          {artist.desc}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

              {gameComplete && (
                <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none z-40 animate-pulse">
                  <h3 className="text-4xl md:text-5xl font-serif italic">
                    Congratulations! You are a true connoisseur.
                  </h3>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section
          id="contact"
          className="py-24 px-6 md:px-12 pointer-events-none bg-white text-black"
        >
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-8 opacity-40 font-sans">
              Get in Touch
            </p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-light mb-12 font-serif">
              Let's build the <br />
              <span className="italic">next big thing</span>.
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <a
                href={`mailto:${contactData.email}`}
                className="pointer-events-auto flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full text-lg hover:scale-105 transition-transform font-serif"
              >
                <Mail className="w-5 h-5" />
                <span>Email Me</span>
              </a>
              <div className="flex gap-4">
                <a
                  href={contactData.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto p-4 border border-black rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={contactData.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto p-4 border border-black rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <footer className="mt-24 text-sm opacity-40 font-sans">
              <p>
                © {new Date().getFullYear()} Yoginder Suria. All rights
                reserved.
              </p>
              <p className="mt-2">Based in {contactData.location}</p>
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
