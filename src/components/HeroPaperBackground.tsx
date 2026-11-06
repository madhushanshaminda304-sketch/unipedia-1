import React, { useEffect, useId, useRef } from "react";
import "../styles/hero-paper.css";

/** Decorative artwork adapted from the user-supplied AI Studio SVG. */
export function HeroPaperBackground() {
  const layer = useRef<HTMLDivElement>(null);
  const prefix = useId();
  useEffect(() => {
    const element = layer.current;
    const hero = element?.closest(".discovery-opening");
    if (!element || !hero) return;
    let visible = !("IntersectionObserver" in window);
    const sync = () => {
      element.dataset.paused = String(!visible || document.hidden);
    };
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              visible = entries.some((entry) => entry.isIntersecting);
              sync();
            },
            { threshold: 0.05 },
          )
        : null;
    observer?.observe(hero);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return (
    <div
      className="hero-paper-background"
      aria-hidden="true"
      data-paused="true"
      ref={layer}
    >
      <svg
        focusable="false"
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id={prefix + "-paperShadow"}
            x="-8%"
            y="-8%"
            width="116%"
            height="116%"
          >
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="10"
              floodColor="var(--hero-paper-ink)"
              floodOpacity="0.055"
            />
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="1.5"
              floodColor="var(--hero-paper-ink)"
              floodOpacity="0.04"
            />
          </filter>

          <filter
            id={prefix + "-deepPaperShadow"}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feDropShadow
              dx="2"
              dy="12"
              stdDeviation="16"
              floodColor="var(--hero-paper-ink)"
              floodOpacity="0.075"
            />
          </filter>

          <linearGradient
            id={prefix + "-ivoryPlaneGradLeft"}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="85%"
          >
            <stop offset="0%" stopColor="var(--hero-paper-white)" />
            <stop offset="100%" stopColor="var(--hero-paper-fold-left)" />
          </linearGradient>

          <linearGradient
            id={prefix + "-ivoryPlaneGradRight"}
            x1="100%"
            y1="0%"
            x2="0%"
            y2="90%"
          >
            <stop offset="0%" stopColor="var(--hero-bg)" />
            <stop offset="100%" stopColor="var(--hero-paper-fold-right)" />
          </linearGradient>

          <linearGradient
            id={prefix + "-spineShadowGrad"}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="var(--hero-paper-spine-deep)" />
            <stop offset="100%" stopColor="var(--hero-paper-mid)" />
          </linearGradient>
        </defs>

        <g className="desktop-only-structure">
          <polygon
            className="paper-deep"
            points="-20,0 265,0 165,360 -20,450"
          />

          <line className="book-edge-rule" x1="257" y1="0" x2="157" y2="360" />
          <line className="book-edge-rule" x1="250" y1="0" x2="150" y2="360" />
          <line className="book-edge-rule" x1="243" y1="0" x2="143" y2="360" />

          <polygon
            fill={"url(#" + prefix + "-ivoryPlaneGradLeft)"}
            stroke="var(--hero-paper-line)"
            strokeWidth="1"
            filter={"url(#" + prefix + "-paperShadow)"}
            points="-20,0 215,0 115,285 -20,340"
          />
          <line className="structural-crease" x1="95" y1="0" x2="25" y2="318" />
        </g>

        <g className="desktop-only-structure">
          <polygon
            className="paper-mid"
            points="1460,0 1185,0 1285,390 1460,475"
          />
          <line
            className="book-edge-rule"
            x1="1193"
            y1="0"
            x2="1293"
            y2="390"
          />
          <line
            className="book-edge-rule"
            x1="1201"
            y1="0"
            x2="1301"
            y2="390"
          />
          <polygon
            fill={"url(#" + prefix + "-ivoryPlaneGradRight)"}
            stroke="var(--hero-paper-line)"
            strokeWidth="1"
            filter={"url(#" + prefix + "-paperShadow)"}
            points="1460,0 1245,0 1330,315 1460,375"
          />
        </g>

        <g>
          <polygon
            className="paper-mid"
            points="-40,720 -40,565 360,520 740,625 1120,515 1480,555 1480,720"
          />

          <line
            className="book-edge-rule"
            x1="-20"
            y1="572"
            x2="360"
            y2="527"
          />
          <line
            className="book-edge-rule"
            x1="-20"
            y1="579"
            x2="360"
            y2="534"
          />
          <line
            className="book-edge-rule"
            x1="-20"
            y1="586"
            x2="360"
            y2="541"
          />

          <line
            className="book-edge-rule"
            x1="740"
            y1="632"
            x2="1120"
            y2="522"
          />
          <line
            className="book-edge-rule"
            x1="740"
            y1="639"
            x2="1120"
            y2="529"
          />
          <line
            className="book-edge-rule"
            x1="740"
            y1="646"
            x2="1120"
            y2="536"
          />

          <polygon
            fill={"url(#" + prefix + "-spineShadowGrad)"}
            stroke="var(--hero-paper-line)"
            strokeWidth="1"
            points="360,520 740,625 740,720 360,720"
          />
        </g>

        <g
          className="anim-folio-left"
          filter={"url(#" + prefix + "-deepPaperShadow)"}
        >
          <polygon
            fill={"url(#" + prefix + "-ivoryPlaneGradLeft)"}
            stroke="var(--hero-paper-line-strong)"
            strokeWidth="1"
            points="-30,730 -30,455 240,520 595,605 740,625 565,730"
          />

          <polygon
            className="paper-bright"
            points="-30,455 240,520 185,608 -30,575"
          />

          <line
            className="structural-crease"
            x1="240"
            y1="520"
            x2="185"
            y2="608"
          />
          <line
            className="structural-crease"
            x1="240"
            y1="520"
            x2="595"
            y2="605"
          />
        </g>

        <g
          className="anim-folio-right"
          filter={"url(#" + prefix + "-deepPaperShadow)"}
        >
          <polygon
            fill={"url(#" + prefix + "-ivoryPlaneGradRight)"}
            stroke="var(--hero-paper-line-strong)"
            strokeWidth="1"
            points="740,625 1120,515 1475,465 1475,730 740,730"
          />

          <polygon
            className="paper-bright"
            points="1120,515 1475,465 1475,548 1190,582"
          />
          <line
            className="structural-crease"
            x1="1120"
            y1="515"
            x2="1190"
            y2="582"
          />
        </g>

        <g filter={"url(#" + prefix + "-paperShadow)"}>
          <polygon
            className="paper-base"
            points="-20,725 290,655 740,625 1190,650 1460,610 1460,725"
          />
          <line
            className="book-edge-rule"
            x1="290"
            y1="662"
            x2="740"
            y2="632"
          />
          <line
            className="book-edge-rule"
            x1="740"
            y1="632"
            x2="1190"
            y2="657"
          />
        </g>

        <path
          className="study-path-line"
          pathLength="1"
          d="M -10,460 L 240,520 L 595,605 L 740,625 L 1120,515 L 1465,466"
        />

        <g className="junction-mark junction-mark--1">
          <line
            x1="240"
            y1="520"
            x2="185"
            y2="608"
            stroke="var(--hero-paper-orange)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <rect
            x="236.5"
            y="516.5"
            width="7"
            height="7"
            fill="var(--hero-bg)"
            stroke="var(--hero-paper-orange)"
            strokeWidth="1.6"
            transform="rotate(45 240 520)"
          />
        </g>

        <g className="junction-mark junction-mark--2">
          <line
            x1="740"
            y1="609"
            x2="740"
            y2="641"
            stroke="var(--hero-paper-orange)"
            strokeWidth="1.4"
          />
          <rect
            x="736.5"
            y="621.5"
            width="7"
            height="7"
            fill="var(--hero-bg)"
            stroke="var(--hero-paper-orange)"
            strokeWidth="1.6"
            transform="rotate(45 740 625)"
          />

          <line
            x1="1120"
            y1="515"
            x2="1190"
            y2="582"
            stroke="var(--hero-paper-orange)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <rect
            x="1116.5"
            y="511.5"
            width="7"
            height="7"
            fill="var(--hero-bg)"
            stroke="var(--hero-paper-orange)"
            strokeWidth="1.6"
            transform="rotate(45 1120 515)"
          />
        </g>
      </svg>
    </div>
  );
}
