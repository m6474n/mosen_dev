import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Server, Activity, Users, Globe2, Check } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  country: string;
  clients: number;
  latency: string;
  status: 'active' | 'backup' | 'monitoring';
  lat: number;  // Latitude
  lon: number;  // Longitude
  tech: string[];
}

const NODES: NetworkNode[] = [
  {
    id: 'pakistan',
    name: 'Gujrat (HQ Hub)',
    country: 'Pakistan',
    clients: 18,
    latency: '8ms',
    status: 'active',
    lat: 32.5736,
    lon: 74.0789,
    tech: ['Main Dev Infrastructure', 'n8n Workflow Hub', 'Custom Integrations'],
  },
  {
    id: 'usa-west',
    name: 'Silicon Valley',
    country: 'United States',
    clients: 24,
    latency: '85ms',
    status: 'active',
    lat: 37.7749,
    lon: -122.4194,
    tech: ['React Webapps', 'Gemini AI Pipelines', 'Vercel Deployment Routing'],
  },
  {
    id: 'usa-east',
    name: 'New York',
    country: 'United States',
    clients: 16,
    latency: '72ms',
    status: 'active',
    lat: 40.7128,
    lon: -74.0060,
    tech: ['Automated Web Scraping', 'Client CRM pipelines'],
  },
  {
    id: 'canada',
    name: 'Toronto',
    country: 'Canada',
    clients: 11,
    latency: '80ms',
    status: 'active',
    lat: 43.6532,
    lon: -79.3832,
    tech: ['Node.js API Middleware', 'PostgreSQL clusters'],
  },
  {
    id: 'uk',
    name: 'London',
    country: 'United Kingdom',
    clients: 14,
    latency: '110ms',
    status: 'active',
    lat: 51.5074,
    lon: -0.1278,
    tech: ['Ruby on Rails', 'Enterprise Automation Engines'],
  },
  {
    id: 'germany',
    name: 'Frankfurt',
    country: 'Germany',
    clients: 9,
    latency: '120ms',
    status: 'active',
    lat: 50.1109,
    lon: 8.6821,
    tech: ['Docker Containers', 'Microservices Scheduler'],
  },
  {
    id: 'saudi',
    name: 'Riyadh',
    country: 'Saudi Arabia',
    clients: 8,
    latency: '45ms',
    status: 'active',
    lat: 24.7136,
    lon: 46.6753,
    tech: ['Dashboard Integrations', 'Client DB pipelines'],
  },
  {
    id: 'uae',
    name: 'Dubai',
    country: 'United Arab Emirates',
    clients: 15,
    latency: '36ms',
    status: 'active',
    lat: 25.2048,
    lon: 55.2708,
    tech: ['Flutter Cross-platform apps', 'Automated trigger handlers'],
  },
  {
    id: 'singapore',
    name: 'Singapore Region',
    country: 'Singapore',
    clients: 13,
    latency: '142ms',
    status: 'active',
    lat: 1.3521,
    lon: 103.8198,
    tech: ['Serverless Edge functions', 'Gemini Chat handlers'],
  },
  {
    id: 'japan',
    name: 'Tokyo',
    country: 'Japan',
    clients: 7,
    latency: '155ms',
    status: 'active',
    lat: 35.6762,
    lon: 139.6503,
    tech: ['Static storage', 'Proxy API systems'],
  },
  {
    id: 'australia',
    name: 'Sydney',
    country: 'Australia',
    clients: 5,
    latency: '198ms',
    status: 'active',
    lat: -33.8688,
    lon: 151.2093,
    tech: ['Cloudflare Edge routing', 'Fallback caches'],
  },
];

// Simple 3D math projections
interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export default function InteractiveWorldMap() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode>(NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep track of rotation reference states (avoids stale closures in RAF loop)
  const rotationY = useRef<number>(1.2); // Lon rotation (spin around vertical axis)
  const rotationX = useRef<number>(0.3); // Lat rotation (skew up/down)
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartRot = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastActiveTime = useRef<number>(Date.now());

  const totalClients = NODES.reduce((acc, node) => acc + node.clients, 0);

  // Group by country for list aggregation
  const countriesSummary = NODES.reduce((acc, node) => {
    const existing = acc.find(item => item.country === node.country);
    if (existing) {
      existing.clients += node.clients;
      existing.nodesCount += 1;
    } else {
      acc.push({
        country: node.country,
        clients: node.clients,
        nodesCount: 1,
        representativeNode: node
      });
    }
    return acc;
  }, [] as Array<{ country: string; clients: number; nodesCount: number; representativeNode: NetworkNode }>);

  countriesSummary.sort((a, b) => b.clients - a.clients);

  // Projections: Geodetic coordinates to Unit Vector 3D Coordinates
  const latLonToVec3 = (lat: number, lon: number): Vec3 => {
    const radLat = (lat * Math.PI) / 180;
    const radLon = (lon * Math.PI) / 180;
    return {
      x: Math.cos(radLat) * Math.sin(radLon),
      y: Math.sin(radLat),
      z: Math.cos(radLat) * Math.cos(radLon)
    };
  };

  // Rotate a Vec3 by Y and X angles
  const rotateVec3 = (v: Vec3, rotX: number, rotY: number): Vec3 => {
    // 1. Rotation about Y-axis (spin)
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const x1 = v.x * cosY - v.z * sinY;
    const z1 = v.x * sinY + v.z * cosY;

    // 2. Rotation about X-axis (tilt/skew)
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const y2 = v.y * cosX - z1 * sinX;
    const z2 = v.y * sinX + z1 * cosX;

    return { x: x1, y: y2, z: z2 };
  };

  // Support quick interpolation to focused state
  const targetRotationY = useRef<number | null>(null);
  const targetRotationX = useRef<number | null>(null);

  const focusOnNode = (node: NetworkNode) => {
    // Geodetic to rotation angle formulas
    // Convert target longitude/latitude to angle variables appropriate for the coordinate frame
    // We want to bring the node directly to the center face of the sphere
    targetRotationY.current = -node.lon * (Math.PI / 180) + Math.PI / 2;
    targetRotationX.current = node.lat * (Math.PI / 180) * 0.5; // Scoped tilt modifier
    lastActiveTime.current = Date.now();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let pulseTime = 0;

    // Projected coordinate arrays for mouse hit-testing
    let projectedNodes: Array<{ node: NetworkNode; sx: number; sy: number; visible: boolean }> = [];

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      
      // Keep canvas crisp using device ratio
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial resize call

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Interpolation to focused node coordinates
      if (targetRotationY.current !== null && targetRotationX.current !== null) {
        const diffY = targetRotationY.current - rotationY.current;
        const diffX = targetRotationX.current - rotationX.current;

        // Apply spherical wrap cleanup logic so we don't spin the wrong way
        const nearestDiffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));

        rotationY.current += nearestDiffY * 0.1;
        rotationX.current += diffX * 0.1;

        if (Math.abs(nearestDiffY) < 0.01 && Math.abs(diffX) < 0.01) {
          targetRotationY.current = null;
          targetRotationX.current = null;
        }
      }

      // Auto rotation factor when idle
      if (!isDragging.current && targetRotationY.current === null && Date.now() - lastActiveTime.current > 4000) {
        rotationY.current += 0.003; // Gentle rotation
      }

      const CX = w / 2;
      const CY = h / 2;
      const R = Math.min(w, h) * 0.38; // Radius fit

      // Draw Atmospheric Background Shading / Inner Shadow Globe Circle
      const gradInside = ctx.createRadialGradient(CX, CY, R * 0.3, CX, CY, R);
      gradInside.addColorStop(0, 'rgba(10, 10, 10, 0.9)');
      gradInside.addColorStop(0.8, 'rgba(15, 15, 15, 0.98)');
      gradInside.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = gradInside;
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fill();

      // Outer atmosphere neon glow ring
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Atmospheric outer halo ring
      ctx.beginPath();
      ctx.arc(CX, CY, R + 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw Grid Lines (Latitude circles)
      const lats = [-60, -30, 0, 30, 60];
      lats.forEach(lat => {
        ctx.beginPath();
        let first = true;
        for (let lonStep = -180; lonStep <= 180; lonStep += 6) {
          const v = latLonToVec3(lat, lonStep);
          const rot = rotateVec3(v, rotationX.current, rotationY.current);
          const sx = CX + rot.x * R;
          const sy = CY - rot.y * R;

          // Backside dots vs frontside dots
          if (rot.z > 0) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.lineWidth = 0.6;
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          }
        }
        ctx.stroke();
      });

      // Draw Grid Lines (Longitude meridians)
      const lons = [-125, -60, 0, 60, 125, 180];
      lons.forEach(lon => {
        ctx.beginPath();
        let first = true;
        for (let latStep = -90; latStep <= 90; latStep += 6) {
          const v = latLonToVec3(latStep, lon);
          const rot = rotateVec3(v, rotationX.current, rotationY.current);
          const sx = CX + rot.x * R;
          const sy = CY - rot.y * R;

          if (rot.z > 0) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 0.6;
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          }
        }
        ctx.stroke();
      });

      // Project and Index coordinates
      projectedNodes = NODES.map(node => {
        const baseVec = latLonToVec3(node.lat, node.lon);
        const rotVec = rotateVec3(baseVec, rotationX.current, rotationY.current);
        const sx = CX + rotVec.x * R;
        const sy = CY - rotVec.y * R;
        return {
          node,
          sx,
          sy,
          visible: rotVec.z > 0
        };
      });

      const pakNode = projectedNodes.find(p => p.node.id === 'pakistan');

      // ──────────────────────────────────────────────
      // DRAW TRAVELING SIGNAL ARCH PIPELINES (HQ TO NATIONS)
      // ──────────────────────────────────────────────
      pulseTime += 0.007; // Core signal speed factor

      if (pakNode && pakNode.visible) {
        projectedNodes.forEach(dest => {
          if (dest.node.id === 'pakistan') return;

          const isSelected = selectedNode.id === dest.node.id || selectedNode.country === dest.node.country;
          const isHovered = hoveredNode?.id === dest.node.id || hoveredNode?.country === dest.node.country;
          const isTargeted = isSelected || isHovered;

          // Points on coordinate sphere
          const p1 = latLonToVec3(NODES[0].lat, NODES[0].lon); // Gujrat HQ
          const p2 = latLonToVec3(dest.node.lat, dest.node.lon); // Client Node destination

          ctx.beginPath();
          let pathStarted = false;
          
          // Draw geodesic path curves using spherical Interpolation (Slerp-inspired arc)
          for (let t = 0; t <= 1; t += 0.03) {
            const interpX = p1.x * (1 - t) + p2.x * t;
            const interpY = p1.y * (1 - t) + p2.y * t;
            const interpZ = p1.z * (1 - t) + p2.z * t;
            
            // Standardize projection magnitude onto physical radius limit
            const len = Math.sqrt(interpX * interpX + interpY * interpY + interpZ * interpZ);
            const v = { x: interpX / len, y: interpY / len, z: interpZ / len };
            
            // Rotate the point based on sphere transformation state
            const rot = rotateVec3(v, rotationX.current, rotationY.current);
            const sx = CX + rot.x * R;
            const sy = CY - rot.y * R;

            if (rot.z > 0) {
              if (!pathStarted) {
                ctx.moveTo(sx, sy);
                pathStarted = true;
              } else {
                ctx.lineTo(sx, sy);
              }
            } else {
              pathStarted = false; // Break path once it goes around back of the globe sphere
            }
          }
          ctx.strokeStyle = isTargeted ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = isTargeted ? 1.5 : 0.8;
          ctx.stroke();

          // Draw skipping signal pulse along active path
          // Staggered offsets for beautiful organic flow
          const tPulse = (pulseTime + (NODES.indexOf(dest.node) * 0.12)) % 1.0;
          const px = p1.x * (1 - tPulse) + p2.x * tPulse;
          const py = p1.y * (1 - tPulse) + p2.y * tPulse;
          const pz = p1.z * (1 - tPulse) + p2.z * tPulse;
          const plen = Math.sqrt(px * px + py * py + pz * pz);
          
          const pv = { x: px / plen, y: py / plen, z: pz / plen };
          const prot = rotateVec3(pv, rotationX.current, rotationY.current);
          
          if (prot.z > 0) {
            const psx = CX + prot.x * R;
            const psy = CY - prot.y * R;

            // Draw glowing white active signal bead
            ctx.beginPath();
            ctx.arc(psx, psy, isTargeted ? 3.5 : 2.2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = isTargeted ? 8 : 3;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset canvas shadows
          }
        });
      }

      // ──────────────────────────────────────────────
      // DRAW PHYSICAL NODES & TEXT LABELS
      // ──────────────────────────────────────────────
      projectedNodes.forEach(p => {
        if (!p.visible) return;

        const isHub = p.node.id === 'pakistan';
        const isSelected = selectedNode.id === p.node.id || selectedNode.country === p.node.country;
        const isHovered = hoveredNode?.id === p.node.id || hoveredNode?.country === p.node.country;
        const active = isSelected || isHovered;

        const baseRadius = isHub ? 7 : (Math.sqrt(p.node.clients) * 1.5 + 2);

        // Core Hover / Selection visual ring target
        if (active) {
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, baseRadius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Clean solid circle indicator
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = active ? '#ffffff' : '#0a0a0a';
        ctx.strokeStyle = active ? '#ffffff' : '#888888';
        ctx.lineWidth = 1.3;
        ctx.fill();
        ctx.stroke();

        // Node country notation label adjacent to marker
        ctx.fillStyle = active ? '#ffffff' : 'rgba(255, 255, 255, 0.45)';
        ctx.font = 'bold 8.5px ui-monospace, SFMono-Regular, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(
          `${p.node.country.substring(0, 3).toUpperCase()} (${p.node.clients})`,
          p.sx + baseRadius + 5,
          p.sy + 3
        );
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    // ──────────────────────────────────────────────
    // MOUSE & TOUCH EVENT BINDINGS FOR SPHERE DRAG
    // ──────────────────────────────────────────────
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastActiveTime.current = Date.now();
      dragStart.current = { x: e.clientX, y: e.clientY };
      dragStartRot.current = { x: rotationY.current, y: rotationX.current };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      if (isDragging.current) {
        lastActiveTime.current = Date.now();
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;

        // Apply drag changes directly to current rotation coordinates
        rotationY.current = dragStartRot.current.x + dx * 0.0055;
        rotationX.current = Math.max(-1.4, Math.min(1.4, dragStartRot.current.y + dy * 0.0055));
      } else {
        // Run proximity hit-testing to check hover targets over projected nodes
        let match: NetworkNode | null = null;
        for (const p of projectedNodes) {
          if (!p.visible) continue;
          const dist = Math.hypot(p.sx - relativeX, p.sy - relativeY);
          if (dist < 14) {
            match = p.node;
            break;
          }
        }

        if (match) {
          canvas.style.cursor = 'pointer';
          if (hoveredNode?.id !== match.id) {
            setHoveredNode(match);
          }
        } else {
          canvas.style.cursor = 'grab';
          if (hoveredNode !== null) {
            setHoveredNode(null);
          }
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (isDragging.current) {
        isDragging.current = false;
        
        // Match selection tap/click if drag offset is minute
        const relativeX = e.clientX - canvas.getBoundingClientRect().left;
        const relativeY = e.clientY - canvas.getBoundingClientRect().top;
        const offset = Math.hypot(e.clientX - dragStart.current.x, e.clientY - dragStart.current.y);

        if (offset < 5) {
          let match: NetworkNode | null = null;
          for (const p of projectedNodes) {
            if (!p.visible) continue;
            const dist = Math.hypot(p.sx - relativeX, p.sy - relativeY);
            if (dist < 16) {
              match = p.node;
              break;
            }
          }
          if (match) {
            setSelectedNode(match);
            focusOnNode(match);
          }
        }
      }
    };

    // Responsive Mobile Touch interactions
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        lastActiveTime.current = Date.now();
        dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        dragStartRot.current = { x: rotationY.current, y: rotationX.current };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches.length === 1) {
        lastActiveTime.current = Date.now();
        const dx = e.touches[0].clientX - dragStart.current.x;
        const dy = e.touches[0].clientY - dragStart.current.y;

        rotationY.current = dragStartRot.current.x + dx * 0.006;
        rotationX.current = Math.max(-1.4, Math.min(1.4, dragStartRot.current.y + dy * 0.006));
      }
    };

    const onTouchEnd = () => {
      isDragging.current = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [hoveredNode, selectedNode]);

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-8 bg-neutral-900/40 p-6 md:p-8 border border-neutral-800 rounded-none overflow-hidden select-none">
      
      {/* MAP HEADER STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-neutral-800 pb-6">
        <div>
          <div className="text-[9px] font-extrabold tracking-wider text-neutral-500 uppercase flex items-center gap-1.5 mb-1.5">
            <Globe2 className="w-3.5 h-3.5 text-neutral-400" /> ACTIVE COUNTRIES
          </div>
          <div className="text-xl md:text-2xl font-light text-neutral-100 font-sans tracking-tight">
            {countriesSummary.length} <span className="text-xs text-neutral-500 font-mono">Nations</span>
          </div>
        </div>
        <div>
          <div className="text-[9px] font-extrabold tracking-wider text-neutral-500 uppercase flex items-center gap-1.5 mb-1.5">
            <Users className="w-3.5 h-3.5 text-neutral-400" /> TOTAL WORLDWIDE CLIENTS
          </div>
          <div className="text-xl md:text-2xl font-light text-neutral-100 font-sans tracking-tight">
            {totalClients} <span className="text-xs text-neutral-500 font-mono">Active Projects</span>
          </div>
        </div>
        <div>
          <div className="text-[9px] font-extrabold tracking-wider text-neutral-500 uppercase flex items-center gap-1.5 mb-1.5">
            <Activity className="w-3.5 h-3.5 text-white animate-pulse" /> NETWORK RELIABILITY
          </div>
          <div className="text-xl md:text-2xl font-light text-neutral-100 font-sans tracking-tight flex items-baseline gap-1">
            99.98% <span className="text-xs text-neutral-500 font-mono uppercase">Uptime</span>
          </div>
        </div>
        <div>
          <div className="text-[9px] font-extrabold tracking-wider text-neutral-500 uppercase flex items-center gap-1.5 mb-1.5">
            <Shield className="w-3.5 h-3.5 text-neutral-400" /> BACKEND ARCHITECTURE
          </div>
          <div className="text-xl md:text-2xl font-light text-neutral-200 lg:text-neutral-100 font-sans tracking-tight">
            SSH / VPN <span className="text-xs text-neutral-500 font-mono uppercase">TUNNELS</span>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN DIRECTORY + 3D GLOBE CANVAS VIEWPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* INTERACTIVE COUNTRY LIST (左 / SIDEBAR) */}
        <div className="flex flex-col gap-2.5 bg-neutral-950/75 p-4 border border-neutral-800 rounded-none lg:col-span-4 flex-grow">
          <div className="pb-2 border-b border-neutral-800 mb-1">
            <h4 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase font-mono">
              INTERNATIONAL REPERTOIRE
            </h4>
            <p className="text-[9px] text-neutral-600 mt-0.5 font-light">
              Select or tap to focus 3D coordinate
            </p>
          </div>

          <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto lg:max-h-[340px] pr-1 pb-2 lg:pb-0 scrollbar-thin">
            {countriesSummary.map((item) => {
              const matchesSelected = selectedNode.country === item.country;
              const matchesHovered = hoveredNode?.country === item.country;
              const isActive = matchesSelected || matchesHovered;

              return (
                <button
                  key={item.country}
                  onClick={() => {
                    setSelectedNode(item.representativeNode);
                    focusOnNode(item.representativeNode);
                  }}
                  onMouseEnter={() => setHoveredNode(item.representativeNode)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`flex items-center justify-between text-left px-3 py-2 text-xs font-mono font-light uppercase border transition-all duration-150 rounded-none shrink-0 lg:shrink-1 select-none cursor-pointer ${
                    isActive
                      ? 'bg-white text-neutral-950 border-white font-medium'
                      : 'bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {matchesSelected && <Check className="w-3.5 h-3.5 stroke-[2.5px]" />}
                    <span>{item.country}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-none ml-2 ${
                    isActive ? 'bg-neutral-950 text-white' : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    {item.clients} Proj
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D INTERACTIVE GLOBE CANVAS (右 / VIEWPORT) */}
        <div className="relative bg-neutral-950 border border-neutral-800 rounded-none overflow-hidden lg:col-span-8 flex items-center justify-center p-0 group aspect-[16/9]">
          
          <canvas
            ref={canvasRef}
            className="w-full h-full block touch-none"
          />

          {/* Coordinate overlay details */}
          <div className="absolute bottom-3 left-4 font-mono text-[8px] text-neutral-600 select-none hidden sm:block">
            STAGE: 3D_ORTHO_PROJECTION // DRAG_X DRAG_Y: SUPPORTED
          </div>
          <div className="absolute top-3 right-4 font-mono text-[8.5px] text-neutral-500 select-none hidden sm:block flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white inline-block animate-pulse"></span>
            PIPELINES ROTATION: ACTIVE
          </div>

          {/* Floating Instructions Banner */}
          <div className="absolute bottom-3 right-4 font-mono text-[8px] text-neutral-600 select-none pointer-events-none hidden sm:block">
            DRAG_GLOBE TO ORBIT SPHERE
          </div>

          {/* Telemetry Tooltip popover over active node coordinates */}
          <AnimatePresence>
            {(hoveredNode || selectedNode) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-4 bg-neutral-950/95 border border-neutral-800 p-4 rounded-none text-left z-20 pointer-events-none font-mono text-[10px] uppercase w-52 shadow-2xl backdrop-blur-md"
              >
                <div className="font-bold text-white flex items-center justify-between pb-1.5 border-b border-neutral-800 mb-2">
                  <span>{(hoveredNode || selectedNode).country}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                </div>
                <div className="flex flex-col gap-1.5 text-neutral-400">
                  <div className="flex justify-between">
                    <span>REGION NODE:</span>
                    <span className="text-white font-bold">{(hoveredNode || selectedNode).name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LOCAL LATENCY:</span>
                    <span className="text-white">{(hoveredNode || selectedNode).latency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ACTIVE POOL:</span>
                    <span className="text-white font-bold font-sans">{(hoveredNode || selectedNode).clients} PROJECTS</span>
                  </div>
                  <div className="flex justify-between mt-1 pt-1.5 border-t border-neutral-900 text-neutral-500">
                    <span>SECURITY LINK:</span>
                    <span className="text-emerald-400">ENCRYPTED</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* STACK PANEL FOR SELECTED COUNTRY SPECIFICATION */}
      <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-extrabold tracking-widest text-neutral-400 uppercase font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span> CURRENT GLOBE METRIC
          </span>
          <h4 className="text-base font-light text-neutral-100 tracking-wide uppercase">
            {selectedNode.country} — {selectedNode.name}
          </h4>
          <p className="text-xs font-light text-neutral-500 max-w-xl leading-relaxed">
            Managing a cluster of <span className="text-neutral-300 font-normal">{selectedNode.clients} client systems</span>. Our localized pipeline relays support seamless automated webhook actions, server cron loops, and optimized user integrations.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 w-full md:w-auto min-w-[260px] bg-neutral-900/60 border border-neutral-800 p-4 rounded-none">
          <div className="text-[9px] font-bold tracking-wider text-neutral-400 font-mono uppercase pb-1.5 border-b border-neutral-800 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-neutral-400" /> INSTALLED STACK CONFIGURATIONS
          </div>
          <div className="flex flex-col gap-1.5">
            {selectedNode.tech.map((skill, index) => (
              <div key={index} className="text-[11px] text-neutral-300 font-light flex items-center gap-2">
                <span className="w-1 h-1 bg-white rounded-full"></span>
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
