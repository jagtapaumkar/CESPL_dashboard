import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Wifi, WifiOff } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { stats, trendData, modeData, faceDetectionDevices, attendanceMarkers } from "../data";
import { DataGrid } from "../components/DataGrid";

// ─────────────────────────────────────────────────────────────────
//  SWEEPER ANIMATION — fully self-contained React component
//  Drop <SweeperZone /> after any page title inside a flex row.
// ─────────────────────────────────────────────────────────────────

// ── Waste item definitions: [leftPct, w, h, svgInnerHTML] ────────
const WASTE_ITEMS: [number, number, number, string][] = [
  [3,  14, 18, `<path d="M2 2L12 2L10 16Q7 18 4 16Z" fill="#e8d5b7" stroke="#c4a882" strokeWidth="0.8"/>
    <path d="M2 2L12 2L11 5L3 5Z" fill="#d4b896"/>
    <line x1="3" y1="8" x2="11" y2="8" stroke="#c4a882" strokeWidth="0.5" opacity="0.6"/>
    <ellipse cx="7" cy="2" rx="5" ry="1.2" fill="#d4b896" stroke="#c4a882" strokeWidth="0.6"/>`],
  [9,  10, 22, `<rect x="3" y="0" width="4" height="3" rx="1" fill="#a0c8e0" stroke="#80afc8" strokeWidth="0.7"/>
    <path d="M2 3Q1 5 1 8L1 18Q1 21 5 21Q9 21 9 18L9 8Q9 5 8 3Z" fill="rgba(160,200,230,0.6)" stroke="#80afc8" strokeWidth="0.8"/>
    <rect x="2" y="10" width="6" height="3" fill="rgba(255,255,255,0.35)" rx="1"/>
    <text x="5" y="14" fontSize="2.5" fill="#2060a0" textAnchor="middle" fontFamily="Arial" fontWeight="bold">H₂O</text>`],
  [16, 16, 13, `<path d="M1 6Q2 1 5 2Q6 0 9 1Q12 0 14 3Q16 5 14 8Q15 11 12 12Q9 13 6 12Q3 13 1 10Z" fill="#f0ead8" stroke="#d4c8a8" strokeWidth="0.8"/>
    <path d="M4 4Q7 3 10 5Q12 4 13 6" stroke="#c8b890" strokeWidth="0.6" fill="none"/>
    <path d="M3 7Q5 6 7 8Q9 7 11 8" stroke="#c8b890" strokeWidth="0.5" fill="none"/>`],
  [23, 13, 18, `<rect x="1" y="3" width="11" height="13" fill="#c8c8c8" stroke="#a0a0a0" strokeWidth="0.8"/>
    <ellipse cx="6.5" cy="3" rx="5.5" ry="1.5" fill="#d8d8d8" stroke="#a0a0a0" strokeWidth="0.7"/>
    <ellipse cx="6.5" cy="16" rx="5.5" ry="1.5" fill="#b8b8b8" stroke="#a0a0a0" strokeWidth="0.7"/>
    <rect x="2" y="6" width="9" height="7" fill="#e04040" rx="1"/>
    <text x="6.5" y="11" fontSize="3" fill="#fff" textAnchor="middle" fontFamily="Arial" fontWeight="bold">CAN</text>
    <line x1="1" y1="5" x2="12" y2="5" stroke="#a0a0a0" strokeWidth="0.5"/>
    <line x1="1" y1="14" x2="12" y2="14" stroke="#a0a0a0" strokeWidth="0.5"/>`],
  [30, 20, 14, `<path d="M2 12Q4 4 10 2Q16 1 18 4Q19 6 17 8Q14 11 10 11Q6 12 4 13Z" fill="#f5e840" stroke="#c8b800" strokeWidth="0.8"/>
    <path d="M4 13Q6 10 10 9Q14 9 17 7" stroke="#e0d000" strokeWidth="0.6" fill="none"/>
    <path d="M2 12Q4 9 8 8" stroke="#c8b000" strokeWidth="0.5" fill="none"/>`],
  [38, 18, 16, `<path d="M9 14Q2 10 2 5Q2 1 6 1Q10 1 12 4Q14 1 17 2Q18 6 16 9Q13 13 9 14Z" fill="#6ab040" stroke="#4a8820" strokeWidth="0.7"/>
    <line x1="9" y1="14" x2="9" y2="3" stroke="#3a7010" strokeWidth="0.8"/>
    <line x1="9" y1="8" x2="5" y2="5" stroke="#4a8820" strokeWidth="0.5"/>
    <line x1="9" y1="6" x2="13" y2="4" stroke="#4a8820" strokeWidth="0.5"/>`],
  [46, 18,  7, `<rect x="0" y="2" width="10" height="3" rx="1.5" fill="#f0d090"/>
    <rect x="10" y="2" width="6" height="3" rx="0.5" fill="#e8e8e8"/>
    <circle cx="16.5" cy="3.5" r="1" fill="#ff6020" opacity="0.8"/>`],
  [54, 16, 20, `<path d="M5 4L4 6L2 8Q1 12 2 15Q3 19 8 19Q13 19 14 15Q15 12 14 8L12 6L11 4Z" fill="rgba(200,230,255,0.7)" stroke="#90b8d8" strokeWidth="0.8"/>
    <path d="M5 4Q6 2 8 2Q10 2 11 4" stroke="#80a8c8" strokeWidth="0.8" fill="none"/>
    <path d="M4 10Q8 12 12 10" stroke="#90b8d8" strokeWidth="0.5" fill="none" opacity="0.6"/>`],
  [62, 20, 15, `<path d="M1 2L18 2L19 13L1 14Z" fill="#f8f4e8" stroke="#d0c8a8" strokeWidth="0.8"/>
    <line x1="3" y1="5" x2="17" y2="5" stroke="#c0b890" strokeWidth="0.8"/>
    <line x1="3" y1="7" x2="14" y2="7" stroke="#c0b890" strokeWidth="0.5"/>
    <line x1="3" y1="9" x2="16" y2="9" stroke="#c0b890" strokeWidth="0.5"/>
    <line x1="3" y1="11" x2="12" y2="11" stroke="#c0b890" strokeWidth="0.5"/>
    <rect x="3" y="3" width="6" height="1.5" fill="#c0b890" rx="0.5"/>`],
  [71, 18, 12, `<path d="M1 4Q3 1 9 2Q15 1 17 4Q18 7 16 10Q13 12 9 11Q5 12 2 10Q0 7 1 4Z" fill="#ffd040" stroke="#d4a800" strokeWidth="0.8"/>
    <path d="M3 5Q9 3 15 5" stroke="#c09000" strokeWidth="0.5" fill="none"/>
    <path d="M2 8Q9 10 16 8" stroke="#c09000" strokeWidth="0.5" fill="none"/>
    <text x="9" y="8" fontSize="3.5" fill="#8a5c00" textAnchor="middle" fontFamily="Arial" fontWeight="bold">snack</text>`],
];

// ── Truck SVG (pure JSX) ─────────────────────────────────────────
function TruckSVG() {
  return (
    <svg viewBox="0 0 240 52" xmlns="http://www.w3.org/2000/svg" width={240} height={52}>
      <defs>
        <linearGradient id="swTruckBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ffd820" />
          <stop offset="50%"  stopColor="#f5c500" />
          <stop offset="100%" stopColor="#d4a800" />
        </linearGradient>
        <linearGradient id="swTruckCabin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#2a6e44" />
          <stop offset="100%" stopColor="#134028" />
        </linearGradient>
        <linearGradient id="swTruckHopper" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#e8b400" />
          <stop offset="100%" stopColor="#c49000" />
        </linearGradient>
        <linearGradient id="swTruckWin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#b8e4f8" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#5ab0e0" stopOpacity={0.7} />
        </linearGradient>
        <clipPath id="swTruckChevClip">
          <rect x={32} y={14} width={100} height={14} />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse cx={125} cy={51} rx={105} ry={3.5} fill="rgba(0,0,0,0.12)" />

      {/* Body */}
      <rect x={30} y={14} width={168} height={28} rx={5} fill="url(#swTruckBody)" stroke="#c4980a" strokeWidth={1.8} />
      <rect x={30} y={24} width={168} height={7}  fill="#e07800" opacity={0.7} />
      <rect x={31} y={14} width={166} height={4}  rx={4} fill="rgba(255,255,255,0.22)" />

      {/* Hazard chevrons */}
      <g clipPath="url(#swTruckChevClip)" opacity={0.13}>
        {[30, 48, 66, 84, 102].map((x) => (
          <line key={x} x1={x} y1={14} x2={x + 22} y2={28} stroke="#000" strokeWidth={9} />
        ))}
      </g>

      {/* Hopper */}
      <rect x={155} y={10} width={42} height={32} rx={5} fill="url(#swTruckHopper)" stroke="#b08000" strokeWidth={1.5} />
      <rect x={156} y={10} width={40} height={5}  rx={3} fill="rgba(255,255,255,0.18)" />
      {[168, 180, 192].map((x) => (
        <line key={x} x1={x} y1={10} x2={x} y2={42} stroke="rgba(0,0,0,0.12)" strokeWidth={1.2} />
      ))}
      <rect x={155} y={22} width={6} height={10} rx={2} fill="rgba(0,0,0,0.4)" />
      <text x={178} y={30} fontSize={5.5} fontWeight={900} fill="rgba(100,60,0,0.6)" fontFamily="Arial" textAnchor="middle" letterSpacing={0.8}>WASTE</text>

      {/* Cabin */}
      <rect x={188} y={5}  width={44} height={37} rx={6} fill="url(#swTruckCabin)" stroke="#0d3d22" strokeWidth={1.6} />
      <rect x={190} y={6}  width={40} height={6}  rx={3} fill="rgba(255,255,255,0.12)" />
      <rect x={191} y={7}  width={36} height={22} rx={4} fill="url(#swTruckWin)"  stroke="#4a9fd0" strokeWidth={0.9} />
      <line x1={193} y1={8}  x2={195} y2={28} stroke="rgba(255,255,255,0.55)" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={199} y1={8}  x2={201} y2={18} stroke="rgba(255,255,255,0.3)"  strokeWidth={1}   strokeLinecap="round" />
      <circle cx={218} cy={17} r={5} fill="rgba(30,60,40,0.5)" />
      <rect x={214} y={21} width={8} height={6} rx={2} fill="rgba(30,60,40,0.4)" />

      {/* Bumper */}
      <rect x={226} y={20} width={12} height={18} rx={3} fill="#3a3a3a" stroke="#222" strokeWidth={1.4} />
      {[23, 26, 29, 32].map((y) => (
        <line key={y} x1={228} y1={y} x2={236} y2={y} stroke="#666" strokeWidth={0.9} />
      ))}
      <rect x={227} y={18} width={10} height={6} rx={2} fill="#fffad0" stroke="#d4c010" strokeWidth={0.8} />
      <rect x={227} y={18} width={10} height={6} rx={2} fill="rgba(255,240,80,0.5)" />

      {/* Brand badge */}
      <rect x={48} y={15} width={96} height={12} rx={3} fill="rgba(19,64,40,0.9)" />
      <text x={96} y={23.5} fontSize={7} fontWeight={900} fill="#4bc87a" fontFamily="Arial,sans-serif" textAnchor="middle" letterSpacing={1.5}>CHENNAI ENVIRO</text>
      <text x={37} y={25} fontSize={10} fontFamily="Arial" opacity={0.9}>♻</text>

      {/* Rear wheels */}
      {[62, 82].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={45} r={9}   fill="#1c1c1c" stroke="#555" strokeWidth={1.8} />
          <circle cx={cx} cy={45} r={6}   fill="#333"   stroke="#5a5a5a" strokeWidth={1.4} />
          <circle cx={cx} cy={45} r={2.5} fill="#888" />
          <line x1={cx}     y1={36} x2={cx}     y2={54} stroke="#666" strokeWidth={1.4} />
          <line x1={cx - 9} y1={45} x2={cx + 9} y2={45} stroke="#666" strokeWidth={1.4} />
          <line x1={cx - 6} y1={38} x2={cx + 6} y2={52} stroke="#666" strokeWidth={1.1} />
          <line x1={cx + 6} y1={38} x2={cx - 6} y2={52} stroke="#666" strokeWidth={1.1} />
        </g>
      ))}

      {/* Front wheel */}
      <circle cx={210} cy={45} r={9}   fill="#1c1c1c" stroke="#555" strokeWidth={1.8} />
      <circle cx={210} cy={45} r={6}   fill="#333"   stroke="#5a5a5a" strokeWidth={1.4} />
      <circle cx={210} cy={45} r={2.5} fill="#888" />
      <line x1={210} y1={36} x2={210} y2={54} stroke="#666" strokeWidth={1.4} />
      <line x1={201} y1={45} x2={219} y2={45} stroke="#666" strokeWidth={1.4} />
      <line x1={204} y1={38} x2={216} y2={52} stroke="#666" strokeWidth={1.1} />
      <line x1={216} y1={38} x2={204} y2={52} stroke="#666" strokeWidth={1.1} />

      {/* Front rotating brush */}
      <g style={{ animation: "swBrushSpin 0.3s linear infinite", transformOrigin: "30px 45px", transformBox: "fill-box" }}>
        <circle cx={30} cy={45} r={11} fill="rgba(46,153,87,0.18)" stroke="#2e9957" strokeWidth={1.4} />
        <line x1={30} y1={34} x2={30} y2={56} stroke="#4bc87a" strokeWidth={2.6} strokeLinecap="round" />
        <line x1={19} y1={45} x2={41} y2={45} stroke="#4bc87a" strokeWidth={2.6} strokeLinecap="round" />
        <line x1={22} y1={37} x2={38} y2={53} stroke="#2e9957" strokeWidth={2}   strokeLinecap="round" />
        <line x1={38} y1={37} x2={22} y2={53} stroke="#2e9957" strokeWidth={2}   strokeLinecap="round" />
        <line x1={21} y1={40} x2={39} y2={50} stroke="#1a5c35" strokeWidth={1.4} strokeLinecap="round" />
        <line x1={39} y1={40} x2={21} y2={50} stroke="#1a5c35" strokeWidth={1.4} strokeLinecap="round" />
        <circle cx={30} cy={45} r={4.5} fill="#134028" stroke="#4bc87a" strokeWidth={1.4} />
        <circle cx={30} cy={45} r={2}   fill="#4bc87a" />
      </g>

      {/* Suction mouth */}
      <ellipse cx={38} cy={44} rx={13} ry={4.5} fill="rgba(46,153,87,0.14)" stroke="#2e9957" strokeWidth={1.2} strokeDasharray="3.5,2" />

      {/* Rear brush */}
      <g style={{ animation: "swBrushSpin 0.3s linear infinite reverse", transformOrigin: "148px 44px", transformBox: "fill-box" }}>
        <circle cx={148} cy={44} r={8}   fill="rgba(46,153,87,0.14)" stroke="#2e9957" strokeWidth={1.2} />
        <line x1={148} y1={36} x2={148} y2={52} stroke="#4bc87a" strokeWidth={2}   strokeLinecap="round" />
        <line x1={140} y1={44} x2={156} y2={44} stroke="#4bc87a" strokeWidth={2}   strokeLinecap="round" />
        <line x1={142} y1={38} x2={154} y2={50} stroke="#2e9957" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={154} y1={38} x2={142} y2={50} stroke="#2e9957" strokeWidth={1.5} strokeLinecap="round" />
        <circle cx={148} cy={44} r={3.5} fill="#134028" stroke="#4bc87a" strokeWidth={1.2} />
        <circle cx={148} cy={44} r={1.5} fill="#4bc87a" />
      </g>

      {/* Water spray */}
      {([
        [21, 37, 2,   "#4dd0e8", 0],
        [17, 31, 1.6, "#4dd0e8", 0.1],
        [24, 29, 1.5, "#81ecec", 0.2],
      ] as [number, number, number, string, number][]).map(([cx, cy, r, fill, delay]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={fill}
          style={{ animation: `swSpray 0.38s ease-in-out ${delay}s infinite alternate` }} />
      ))}

      {/* Beacon */}
      <rect x={196} y={1} width={14} height={6} rx={3} fill="#ff3300"
        style={{ animation: "swBeacon 0.6s ease-in-out infinite alternate" }} />
      <ellipse cx={203} cy={4} rx={9} ry={3} fill="rgba(255,60,0,0.18)" />

      {/* Exhaust */}
      {([
        [3.5, 0],
        [3,   0.23],
        [2.5, 0.46],
      ] as [number, number][]).map(([r, delay]) => (
        <circle key={delay} cx={237} cy={12} r={r} fill="rgba(150,150,150,0.5)"
          style={{ animation: `swExhaust 0.7s ${delay}s ease-out infinite` }} />
      ))}
    </svg>
  );
}

// ── Signboard SVG (green wooden arrow board) ─────────────────────
function BoardSVG() {
  return (
    <svg viewBox="0 0 68 72" xmlns="http://www.w3.org/2000/svg" width={52} height={56}
      style={{ animation: "swSway 1.8s ease-in-out infinite alternate" }}>
      <defs>
        <linearGradient id="swPoleG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#5a3e10" />
          <stop offset="30%"  stopColor="#9a6a28" />
          <stop offset="60%"  stopColor="#7a5018" />
          <stop offset="100%" stopColor="#5a3e10" />
        </linearGradient>
        <linearGradient id="swBoardG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#2d9e55" />
          <stop offset="40%"  stopColor="#1e7a3e" />
          <stop offset="100%" stopColor="#145c2c" />
        </linearGradient>
        <linearGradient id="swBoardEdge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.3)" />
          <stop offset="10%"  stopColor="rgba(0,0,0,0)" />
          <stop offset="90%"  stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
        </linearGradient>
        <linearGradient id="swBoardShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <pattern id="swWoodGrain" x={0} y={0} width={4} height={8} patternUnits="userSpaceOnUse">
          <rect width={4} height={8} fill="none" />
          <line x1={0} y1={0} x2={4} y2={8} stroke="rgba(0,0,0,0.06)" strokeWidth={0.5} />
        </pattern>
      </defs>

      {/* Pole shadow */}
      <ellipse cx={16} cy={70} rx={7} ry={2.2} fill="rgba(0,0,0,0.14)" />

      {/* Wooden pole */}
      <rect x={12} y={28} width={8} height={42} rx={3} fill="url(#swPoleG)" />
      <rect x={12} y={28} width={8} height={42} rx={3} fill="url(#swWoodGrain)" opacity={0.5} />
      <rect x={13} y={28} width={2} height={42} rx={1} fill="rgba(255,255,255,0.22)" />
      <rect x={18} y={28} width={2} height={42} rx={1} fill="rgba(0,0,0,0.18)" />

      {/* Metal bands */}
      <rect x={11} y={32} width={10} height={2.5} rx={1} fill="#8a6020" stroke="rgba(0,0,0,0.2)" strokeWidth={0.5} />
      <rect x={11} y={58} width={10} height={2.5} rx={1} fill="#8a6020" stroke="rgba(0,0,0,0.2)" strokeWidth={0.5} />

      {/* Base plate */}
      <rect x={9}  y={65} width={14} height={5} rx={2} fill="#7a5818" stroke="#5a3e10" strokeWidth={0.8} />
      <rect x={10} y={65} width={12} height={2} rx={1} fill="rgba(255,255,255,0.15)" />

      {/* Board shadow */}
      <polygon points="5,6 54,6 65,18 54,30 5,30" fill="rgba(0,0,0,0.18)" transform="translate(1,2)" />
      {/* Board face */}
      <polygon points="5,6 54,6 65,18 54,30 5,30" fill="url(#swBoardG)" />
      {/* Wood grain lines */}
      {[12, 18, 24].map((y) => (
        <line key={y} x1={6} y1={y} x2={63} y2={y} stroke="rgba(0,0,0,0.07)" strokeWidth={0.7} />
      ))}
      {/* Shine + edge */}
      <polygon points="5,6 54,6 65,18 54,30 5,30" fill="url(#swBoardShine)" />
      <polygon points="5,6 54,6 65,18 54,30 5,30" fill="url(#swBoardEdge)" />
      <line x1={5} y1={7} x2={54} y2={7} stroke="rgba(255,255,255,0.35)" strokeWidth={1.2} />

      {/* Corner bolts */}
      {([[11,11],[11,25],[50,10],[50,26]] as [number,number][]).map(([cx,cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2} fill="#1a5c35" stroke="#0d3d22" strokeWidth={0.8} />
      ))}

      {/* ♻ symbol */}
      <text x={22} y={22} fontSize={14} fontFamily="Arial,sans-serif" fill="rgba(255,255,255,0.95)" textAnchor="middle">♻</text>

      {/* Divider */}
      <line x1={32} y1={9} x2={32} y2={27} stroke="rgba(255,255,255,0.2)" strokeWidth={0.8} />

      {/* Text */}
      <text x={49} y={15} fontSize={5.2} fontWeight={900} fill="#a8f5c8" fontFamily="Arial,sans-serif" textAnchor="middle" letterSpacing={0.3}>CHENNAI</text>
      <text x={49} y={23} fontSize={5.2} fontWeight={900} fill="#a8f5c8" fontFamily="Arial,sans-serif" textAnchor="middle" letterSpacing={0.3}>ENVIRO</text>
    </svg>
  );
}

// ── CSS keyframes injected once into <head> ──────────────────────
const SWEEPER_CSS = `
@keyframes swBrushSpin { to { transform: rotate(360deg); } }
@keyframes swBeacon {
  from { fill: #ff3300; opacity: 1; }
  to   { fill: #ff9900; opacity: 0.4; }
}
@keyframes swExhaust {
  0%   { opacity: 0.65; transform: translate(0,0) scale(1); }
  100% { opacity: 0;    transform: translate(-12px,-8px) scale(1.5); }
}
@keyframes swSpray {
  from { opacity: 0.9; }
  to   { opacity: 0.08; }
}
@keyframes swDust {
  0%   { opacity: 0.8; transform: translateY(0) scale(1); }
  100% { opacity: 0;   transform: translateY(-18px) scale(2); }
}
@keyframes swSway {
  from { filter: drop-shadow(1px 0 3px rgba(0,0,0,0.14)); }
  to   { filter: drop-shadow(-1px 1px 3px rgba(0,0,0,0.2)); }
}
@keyframes swConfetti {
  0%   { opacity: 1; transform: translate(0,0) rotate(0deg) scale(1); }
  100% { opacity: 0; transform: translate(var(--sw-tx),var(--sw-ty)) rotate(var(--sw-tr)) scale(0.3); }
}
`;

// ── SweeperZone component ────────────────────────────────────────
interface SweeperZoneProps {
  height?: number;
  duration?: number;
  pauseAfter?: number;
}

function SweeperZone({ height = 52, duration = 11000, pauseAfter = 3800 }: SweeperZoneProps) {
  const zoneRef   = useRef<HTMLDivElement>(null);
  const truckRef  = useRef<HTMLDivElement>(null);
  const trailRef  = useRef<HTMLDivElement>(null);
  const boardRef  = useRef<HTMLDivElement>(null);
  const wasteRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef    = useRef<number>(0);
  const timerRef  = useRef<ReturnType<typeof setTimeout>>();

  // Inject CSS once
  useEffect(() => {
    const id = "__sweeper_css__";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = SWEEPER_CSS;
      document.head.appendChild(style);
    }
  }, []);

  const ease = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

  const run = useCallback(() => {
    const zone   = zoneRef.current;
    const truck  = truckRef.current;
    const trail  = trailRef.current;
    const board  = boardRef.current;
    if (!zone || !truck || !trail || !board) return;

    const zoneW   = zone.offsetWidth;
    const TRUCK_W = 200;
    const startX  = -TRUCK_W;
    const endX    = zoneW - TRUCK_W - 55;
    const wastePx = WASTE_ITEMS.map(([pct]) => (pct / 100) * zoneW);

    // Reset
    wasteRefs.current.forEach((el) => el?.classList.remove("swept"));
    truck.style.left  = startX + "px";
    trail.style.width = "0";
    board.classList.remove("show");

    let t0    = 0;
    let swept = new Set<number>();

    const frame = (ts: number) => {
      if (!t0) t0 = ts;
      const raw  = Math.min((ts - t0) / duration, 1);
      const prog = ease(raw);
      const x    = startX + (endX - startX) * prog;

      truck.style.left  = x + "px";
      trail.style.width = Math.max(0, x + TRUCK_W * 0.26) + "px";

      const brushX = x + 24;
      WASTE_ITEMS.forEach((_, i) => {
        if (!swept.has(i) && brushX >= wastePx[i]) {
          swept.add(i);
          const el = wasteRefs.current[i];
          if (el) {
            el.classList.add("swept");
            // Dust puff
            const puff = document.createElement("div");
            puff.style.cssText = [
              "position:absolute",
              `left:${wastePx[i] - 6}px`,
              "bottom:12px",
              "font-size:10px",
              "pointer-events:none",
              "z-index:22",
              "animation:swDust 0.45s ease-out forwards",
            ].join(";");
            puff.textContent = "💨";
            zone.appendChild(puff);
            setTimeout(() => puff.remove(), 520);
          }
        }
      });

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        // Show signboard
        board.classList.add("show");

        // Confetti burst
        const colors = ["#4bc87a","#f5c800","#ff6b35","#3b82f6","#fff","#1a5c35"];
        for (let i = 0; i < 16; i++) {
          const c   = document.createElement("div");
          const ang = (i / 16) * 360;
          const d   = 18 + Math.random() * 24;
          const tx  = Math.cos((ang * Math.PI) / 180) * d;
          const ty  = -(18 + Math.random() * 26);
          const tr  = `${(Math.random() - 0.5) * 360}deg`;
          c.style.cssText = [
            "position:absolute",
            `right:${10 + Math.random() * 12}px`,
            `bottom:${28 + Math.random() * 10}px`,
            `background:${colors[i % colors.length]}`,
            `width:5px`,
            `height:5px`,
            `border-radius:${Math.random() > 0.5 ? "50%" : "1px"}`,
            `pointer-events:none`,
            `z-index:25`,
            `--sw-tx:${tx}px`,
            `--sw-ty:${ty}px`,
            `--sw-tr:${tr}`,
            `animation:swConfetti 0.85s ${i * 0.038}s ease-out forwards`,
          ].join(";");
          zone.appendChild(c);
          setTimeout(() => c.remove(), 1100);
        }

        timerRef.current = setTimeout(run, pauseAfter);
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  }, [duration, pauseAfter]);

  useEffect(() => {
    const t = setTimeout(run, 600);
    return () => {
      clearTimeout(t);
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [run]);

  return (
    <div
      ref={zoneRef}
      style={{
        flex: 1,
        position: "relative",
        height,
        marginLeft: 16,
        overflow: "hidden",
      }}
    >
      {/* Floor shadow line */}
      <div style={{
        position: "absolute", bottom: 6, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg,rgba(0,0,0,0.06) 0%,rgba(0,0,0,0.03) 60%,transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Clean trail */}
      <div ref={trailRef} style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: 0,
        background: "linear-gradient(90deg,rgba(75,200,122,0.18) 0%,rgba(75,200,122,0.06) 70%,transparent 100%)",
        borderRadius: 4, zIndex: 1, pointerEvents: "none",
      }} />

      {/* Waste items */}
      {WASTE_ITEMS.map(([pct, w, h, inner], i) => (
        <div
          key={i}
          ref={(el) => { wasteRefs.current[i] = el; }}
          style={{
            position: "absolute",
            bottom: 7,
            left: `${pct}%`,
            zIndex: 5,
            transition: "opacity 0.32s ease, transform 0.32s ease",
            transformOrigin: "center bottom",
          }}
          className="sw-waste-item"
        >
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
            dangerouslySetInnerHTML={{ __html: inner }} />
        </div>
      ))}

      {/* Truck */}
      <div ref={truckRef} style={{
        position: "absolute",
        bottom: 2,
        left: -210,
        zIndex: 15,
        filter: "drop-shadow(3px 5px 6px rgba(0,0,0,0.2))",
        transform: "scale(0.78)",
        transformOrigin: "left bottom",
        willChange: "left",
      }}>
        <TruckSVG />
      </div>

      {/* Signboard */}
      <div ref={boardRef} className="sw-board" style={{
        position: "absolute",
        right: 8,
        bottom: 3,
        zIndex: 18,
        opacity: 0,
        transform: "translateY(14px) scale(0.55)",
        transformOrigin: "bottom center",
        transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        pointerEvents: "none",
      }}>
        <BoardSVG />
      </div>

      {/* Inline styles for swept state & board show state */}
      <style>{`
        .sw-waste-item.swept {
          opacity: 0 !important;
          transform: translateY(-16px) scale(0.1) rotate(55deg) !important;
        }
        .sw-board.show {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────────
export function DashboardPage() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  return (
    <>
      {/* ── Dashboard header: "Dashboard" text + sweeper in one flex row ──
           The parent shell already renders a "Dashboard" heading above this
           component. We replace that visual space by:
           1. Using marginBottom: -4 to tuck this row snugly below the title
           2. The <h2> here IS the visible title — set the parent shell's
              page-title to display:none if it also renders "Dashboard",
              OR simply keep both and this h2 will overlay it at the same
              font size / weight.
      ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        height: 44,
        marginBottom: 20,
        /* Pulls the row up to sit in the same visual band as the page title */
        marginTop: -44,
      }}>
        {/* Invisible spacer that matches the width of the "Dashboard" heading
            so the sweeper starts right after it without re-rendering the text */}
        <span
          aria-hidden="true"
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.5px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            visibility: "hidden",   /* takes up space but shows nothing */
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          Dashboard
        </span>

        {/* Sweeper fills everything to the right of the title */}
        <SweeperZone height={44} duration={11000} pauseAfter={3800} />
      </div>

      {/* ── Stat cards ── */}
      <div className="stats">
        {stats.map((s) => (
          <article key={s.label} className="stat-card">
            <p>{s.label}</p>
            <h2>{s.value.toLocaleString()}</h2>
            <span style={{ background: s.color }} />
          </article>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3>Weekly Zone Wise Complaint</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend
                iconType="circle"
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
              />
              <Bar dataKey="complaints" name="Z5 - Royapuram"         fill="#2563EB" radius={[8,8,0,0]} />
              <Bar dataKey="services"   name="Z6 - Thiru Vi Ka Nagar" fill="#10B981" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-head"><h3>Mode of Complaints</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={modeData}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
                animationDuration={1000}
                label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
              >
                {modeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "13px" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px", marginTop: "10px" }}>
            {modeData.map((item) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
                {item.name} <strong>{item.value.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Face detection table ── */}
      <div className="card">
        <div className="card-head"><h3>Face Detection Machine Summary</h3></div>
        <div className="face-table-wrap">
          <table className="face-table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Location</th>
                <th>Status</th>
                <th>Last Sync</th>
                <th className="num">Scans</th>
              </tr>
            </thead>
            <tbody>
              {faceDetectionDevices.map((device) => (
                <tr
                  key={device.id}
                  className={[
                    device.status === "offline" ? "offline-row" : "",
                    selectedDevice === device.id ? "selected-row" : "",
                  ].join(" ")}
                  onClick={() => setSelectedDevice(device.id)}
                >
                  <td className="device-id">{device.id}</td>
                  <td>{device.location}</td>
                  <td>
                    <span className={device.status === "online" ? "face-badge online" : "face-badge offline"}>
                      {device.status === "online" ? <Wifi size={13} /> : <WifiOff size={13} />}
                      {device.status}
                    </span>
                  </td>
                  <td>{device.lastSync}</td>
                  <td className="num scans">{device.scans}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Map + Alerts row ── */}
      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3>Face Detection Machine Summary (Map)</h3></div>
          <MapContainer
            center={[13.0827, 80.2707]}
            zoom={11}
            style={{ height: 330, borderRadius: 12 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {attendanceMarkers.map(([lat, lng, name]) => (
              <Marker key={name} position={[lat, lng]}>
                <Popup>{name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="card">
          <div className="card-head"><h3>Smart Alerts</h3></div>
          <div className="alerts">
            <div><Bell size={14} /> Ward 52: 3 complaints approaching 7.5 SLA breach (Bin replacement)</div>
            <div><Bell size={14} /> Ward 21: CGS request nearing 24h resolution deadline</div>
            <div><Bell size={14} /> Ward 34: PGR asset repair complaint pending 20 hours</div>
            <div><Bell size={14} /> Ward 52: 1 complaint breached 24h SLA (Broken/Stolen bin replacement)</div>
          </div>
        </div>
      </div>

      {/* ── Data grid ── */}
      <DataGrid title="Latest Operational Queue" />
    </>
  );
}