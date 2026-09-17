import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  RefreshCw,
  Award,
  CheckCircle2,
  Maximize2,
  X,
  Zap,
  Activity,
  Smartphone,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import partnershipImg from '../assets/images/partnership_in_action_1789542991550.jpg';

interface Hotspot {
  id: number;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  badge: string;
  metric: string;
  description: string;
  icon: 'cooler' | 'tablet' | 'logistics';
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 1,
    x: 28,
    y: 36,
    title: 'Smart IoT Display Cooler',
    badge: 'Cold-Chain IoT',
    metric: '34°F / 1.1°C',
    description: 'Autonomous temperature monitoring and energy-saving night curtains reduce carbon emissions by 40%.',
    icon: 'cooler',
  },
  {
    id: 2,
    x: 62,
    y: 46,
    title: 'B2B Digital Ordering Portal',
    badge: 'Real-Time Sync',
    metric: '< 24h Fulfillment',
    description: 'Retail managers place automated smart restock orders directly with localized bottling logistics hubs.',
    icon: 'tablet',
  },
  {
    id: 3,
    x: 82,
    y: 72,
    title: 'Circular Return Packaging',
    badge: '100% Recyclable',
    metric: 'Zero Waste Aim',
    description: 'Standardized returnable glass and rPET bottles collected systematically to advance our World Without Waste pledge.',
    icon: 'logistics',
  },
];

export const WhatWeDoCustomers: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(HOTSPOTS[1]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null);

  const activeSpot = hoveredHotspot !== null
    ? HOTSPOTS.find(h => h.id === hoveredHotspot) || selectedHotspot
    : selectedHotspot;

  return (
    <section id="what-we-do" className="py-16 sm:py-20 border-t border-white/10 bg-[#121216]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff4d55]">
            Our Capabilities & Relationships
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            What We Do
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
            We are a total beverage company with a portfolio that reaches consumers across the world. Our global operations blend world-class marketing, precision manufacturing, and deep retail partnerships to bring refreshing moments to every community.
          </p>
        </div>

        {/* 3 Core What We Do Essentials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="rounded-2xl border border-white/10 bg-[#18181e] p-6 transition-all hover:border-white/20">
            <div className="h-10 w-10 rounded-xl bg-[#F40009]/20 text-[#ff4d55] flex items-center justify-center mb-4">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Beverage Formulation & Brand Leadership</h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              We continually evolve our recipes—reducing added sugars, introducing nutrient-enriched sparkling water, botanical infusions, and plant-based refreshments tailored to local palates.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#18181e] p-6 transition-all hover:border-white/20">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Truck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Worldwide Bottling & Cold-Chain Logistics</h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Partnering with independent bottling operators across 160+ countries to produce and distribute our products locally, maintaining unmatched cold-chain freshness.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#18181e] p-6 transition-all hover:border-white/20">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <RefreshCw className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sustainable Circular Economy</h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Committed to collecting and recycling a bottle or can for every one we sell by 2030, replenishing clean water in stressed watersheds, and reducing our global footprint.
            </p>
          </div>

        </div>

        {/* In the bottom of it: Customers Section with Functional Interactive Image */}
        <div className="rounded-3xl border border-white/10 bg-[#18181d] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Descriptions and Highlights */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center space-x-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#ff5c63] mb-4">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Our Customers & Partners</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                Empowering Millions of Global Retailers
              </h3>

              <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
                Our customers are the lifeblood of our ecosystem: from multinational grocery chains, convenience stores, and international restaurant franchises, to family-run corner kiosks and neighborhood cafes in remote villages. We work hand-in-hand with each customer to drive category growth, optimize point-of-sale visibility, and deliver frictionless commercial support.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-neutral-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-[#ff4d55] shrink-0" />
                  <span>30M+ Retail & Dining Customers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-[#ff4d55] shrink-0" />
                  <span>Collaborative Commercial Growth</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-[#ff4d55] shrink-0" />
                  <span>Next-Gen Point-of-Sale Innovation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-[#ff4d55] shrink-0" />
                  <span>Unbroken International Reliability</span>
                </div>
              </div>

              {/* Functional Hotspot Selector Tabs */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block mb-2.5">
                  Interactive Partnership Focus Areas (Click to inspect):
                </span>
                <div className="flex flex-wrap gap-2">
                  {HOTSPOTS.map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedHotspot(spot)}
                      className={`inline-flex items-center space-x-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                        selectedHotspot.id === spot.id
                          ? 'bg-[#F40009] text-white shadow-lg shadow-[#F40009]/30'
                          : 'bg-neutral-800/80 text-neutral-300 border border-neutral-700 hover:border-neutral-500 hover:text-white'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      <span>{spot.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Attractive Functional Interactive Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-neutral-900 shadow-2xl group">
                
                {/* Main Image */}
                <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                  <img
                    src={partnershipImg}
                    alt="Coca-Cola Partnership in Action - Modern retail store collaboration"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Aesthetic multi-stop gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 pointer-events-none" />

                  {/* Top Floating Badges: Live telemetry and Fullscreen inspector */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center space-x-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 px-3 py-1 text-[11px] font-semibold text-white shadow-md">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400 -ml-3" />
                      <span className="uppercase tracking-wider text-[10px] text-emerald-300">Live Telemetry Active</span>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center space-x-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 px-3 py-1 text-[11px] font-medium text-neutral-200 hover:text-white hover:border-white/40 transition-all shadow-md"
                      title="Inspect High-Res View"
                    >
                      <Maximize2 className="h-3.5 w-3.5 text-[#ff4d55]" />
                      <span className="hidden sm:inline">Inspect View</span>
                    </button>
                  </div>

                  {/* Interactive Hotspot Pins overlaid directly onto the image */}
                  {HOTSPOTS.map((spot) => {
                    const isSelected = selectedHotspot.id === spot.id;
                    const isHovered = hoveredHotspot === spot.id;
                    return (
                      <div
                        key={spot.id}
                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                      >
                        <button
                          onClick={() => setSelectedHotspot(spot)}
                          onMouseEnter={() => setHoveredHotspot(spot.id)}
                          onMouseLeave={() => setHoveredHotspot(null)}
                          className={`relative flex items-center justify-center transition-all duration-300 ${
                            isSelected || isHovered ? 'scale-125' : 'hover:scale-110'
                          }`}
                          aria-label={spot.title}
                        >
                          {/* Pulsing radar ring */}
                          <span
                            className={`absolute h-8 w-8 rounded-full transition-opacity ${
                              isSelected
                                ? 'bg-[#F40009] animate-ping opacity-75'
                                : 'bg-white/30 animate-pulse opacity-40'
                            }`}
                          />
                          {/* Inner badge dot */}
                          <span
                            className={`relative flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-lg border-2 ${
                              isSelected
                                ? 'bg-[#F40009] border-white ring-2 ring-[#F40009]/60'
                                : 'bg-[#1e1e24] border-white/80 text-white'
                            }`}
                          >
                            {spot.id}
                          </span>
                        </button>

                        {/* Interactive Tooltip Card on Hover */}
                        {isHovered && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 mb-2 w-48 rounded-xl border border-white/20 bg-[#16161c]/95 p-3 text-left shadow-2xl backdrop-blur-md pointer-events-none z-30 transition-all animate-in fade-in zoom-in-95">
                            <span className="rounded bg-[#F40009]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#ff5c63]">
                              {spot.badge}
                            </span>
                            <h4 className="mt-1 text-xs font-bold text-white leading-snug">{spot.title}</h4>
                            <p className="mt-0.5 text-[10px] text-emerald-400 font-semibold">{spot.metric}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Bottom Functional Telemetry Readout Box */}
                  <div className="absolute bottom-3 inset-x-3 rounded-xl border border-white/20 bg-[#121218]/90 p-3.5 backdrop-blur-md transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F40009] text-white shrink-0">
                          {activeSpot.icon === 'cooler' && <Zap className="h-4 w-4" />}
                          {activeSpot.icon === 'tablet' && <Smartphone className="h-4 w-4" />}
                          {activeSpot.icon === 'logistics' && <Activity className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff5c63]">
                              {activeSpot.badge}
                            </span>
                            <span className="text-[10px] text-neutral-400">•</span>
                            <span className="text-[10px] font-bold text-emerald-400">{activeSpot.metric}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white">{activeSpot.title}</h4>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#ff5c63]">
                          <span>Active Focus #{activeSpot.id}</span>
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>

                    <p className="mt-1.5 text-[11px] text-neutral-300 leading-normal line-clamp-2">
                      {activeSpot.description}
                    </p>
                  </div>

                </div>

                {/* Bottom Bar: 3 Live Key Indicators */}
                <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-[#0e0e13] px-3 py-2 text-center text-[10px]">
                  <div className="py-1">
                    <span className="text-neutral-400 block">On-Time Distribution</span>
                    <span className="font-bold text-white">99.8% Reliability</span>
                  </div>
                  <div className="py-1">
                    <span className="text-neutral-400 block">Connected POS</span>
                    <span className="font-bold text-[#ff4d55]">30,000,000+ Stores</span>
                  </div>
                  <div className="py-1">
                    <span className="text-neutral-400 block">Fulfillment Cycle</span>
                    <span className="font-bold text-emerald-400">&lt; 24h Average</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Modal Inspector for High-Resolution View & Deep Telemetry */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#16161e] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F40009] text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Partnership In Action — Live Field Inspection</h3>
                  <p className="text-xs text-neutral-400">Global Customer & Distribution Network Telemetry</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-neutral-700 bg-neutral-800 p-2 text-neutral-400 hover:text-white hover:border-neutral-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-white/10 mb-6">
                <img
                  src={partnershipImg}
                  alt="High resolution view of Coca-Cola partnership in action"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 bg-black/70 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ff4d55]">Coca-Cola Commercial Network</span>
                    <p className="text-sm font-semibold text-white">Direct collaboration with millions of retailers across 160+ countries</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                      System Operational
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {HOTSPOTS.map((spot) => (
                  <div
                    key={spot.id}
                    onClick={() => {
                      setSelectedHotspot(spot);
                      setIsModalOpen(false);
                    }}
                    className="cursor-pointer rounded-2xl border border-white/10 bg-[#1c1c24] p-4 transition-all hover:border-[#F40009] hover:bg-[#22222c]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded bg-[#F40009]/20 px-2 py-0.5 text-[10px] font-bold uppercase text-[#ff5c63]">
                        {spot.badge}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">{spot.metric}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">{spot.title}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">{spot.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-white/10 bg-[#121217] px-6 py-3.5 flex items-center justify-between text-xs text-neutral-400">
              <span>Connected to Global Bottling Logistics Network</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl bg-[#F40009] px-4 py-1.5 font-bold text-white hover:bg-[#d60008]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

