"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Phone,
  Calendar,
  MapPin,
  Clock,
  Mail,
  Key,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Shield,
  Video,
  FileText,
  RotateCcw,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// DATA TYPES & STRUCTURES
// ─────────────────────────────────────────────────────────────────────────────

type VehiclePlatform = "vag" | "bmw" | "mercedes" | "prestige";

interface ServiceScope {
  id: string;
  name: string;
  schedule: string;
  turnaround: string;
  hours: number;
  vagPrice: [number, number];
  bmwPrice: [number, number];
  mercedesPrice: [number, number];
  prestigePrice: [number, number];
  dealerMultiplier: number;
  summary: string;
  inclusions: string[];
}

const SERVICE_SCOPES: ServiceScope[] = [
  {
    id: "minor",
    name: "Minor scheduled service",
    schedule: "15,000 km or 12 months",
    turnaround: "Same-day handover · 2.5 hrs",
    hours: 2.5,
    vagPrice: [389, 459],
    bmwPrice: [419, 499],
    mercedesPrice: [409, 479],
    prestigePrice: [459, 549],
    dealerMultiplier: 1.48,
    summary:
      "Statutory warranty-compliant lubrication service using OEM manufacturer-approved synthetic fluids and genuine micro-filtration elements. Directly stamped to factory digital portals.",
    inclusions: [
      "Factory-spec OEM synthetic engine oil (Liqui Moly Top Tec / Castrol Edge Professional)",
      "Mann / Mahle genuine OEM micro-porous oil filter cartridge",
      "62-point chassis, driveline & hydraulic safety inspection",
      "Live ECU scan — fault codes, freeze-frame audit & reset",
      "Direct digital logbook stamp: Audi GeKo / BMW KaSIO / Mercedes DSB",
      "Complimentary fluid top-ups — coolant, windscreen concentrate, power steering",
    ],
  },
  {
    id: "major",
    name: "Major factory inspection",
    schedule: "30,000 km or 24 months",
    turnaround: "Same-day handover · 4.5 hrs",
    hours: 4.5,
    vagPrice: [689, 859],
    bmwPrice: [729, 899],
    mercedesPrice: [699, 869],
    prestigePrice: [789, 969],
    dealerMultiplier: 1.55,
    summary:
      "Deep powertrain, intake, ignition, and hydraulic renewal engineered to uphold statutory warranty and restore thermodynamic efficiency to factory specification.",
    inclusions: [
      "OEM synthetic engine oil renewal + crankcase chemical flush",
      "Engine air intake filter + activated-carbon cabin pollen filter",
      "Brake fluid hygroscopic boiling-point test & pneumatic reverse pressure purge (DOT 4/5.1)",
      "Spark plug inspection or diesel fuel water-separator renewal",
      "Oscilloscope sensor waveform review and timing tolerance audit",
      "Full subframe, bushing deflection & ball joint torque check",
    ],
  },
  {
    id: "brakes",
    name: "Performance brake renewal",
    schedule: "Axle level — front or rear",
    turnaround: "Same-day handover · 3.0 hrs",
    hours: 3.0,
    vagPrice: [449, 599],
    bmwPrice: [479, 629],
    mercedesPrice: [469, 619],
    prestigePrice: [529, 679],
    dealerMultiplier: 1.42,
    summary:
      "Precision braking restoration incorporating micrometer rotor runout measurement, Brembo friction compounds, and electronic parking brake calibration via factory software.",
    inclusions: [
      "Brembo or Textar high-carbon anti-corrosion coated disc rotors",
      "Low-dust European OEM compound brake pads with acoustic shims",
      "Digital micrometer rotor thickness & lateral runout verification (≤ 0.02 mm)",
      "Electronic parking brake (EPB) retraction & zero-point adaptation relearn",
      "Caliper guide pin degreasing & high-temperature ceramic lubrication",
      "Post-installation controlled bed-in cycle & hydraulic line pressure certification",
    ],
  },
  {
    id: "diagnostic",
    name: "Diagnostic investigation",
    schedule: "Component-level fault isolation",
    turnaround: "Priority window · 2.0 hrs",
    hours: 2.0,
    vagPrice: [229, 289],
    bmwPrice: [249, 309],
    mercedesPrice: [239, 299],
    prestigePrice: [269, 329],
    dealerMultiplier: 1.65,
    summary:
      "Direct ECU interrogation using dealer software suites and PicoScope 4-channel oscilloscopes to pinpoint root electrical anomalies — no trial-and-error parts swapping.",
    inclusions: [
      "Full vehicle topology scan: CAN-Bus, LIN-Bus, FlexRay, MOST optical networks",
      "PicoScope 4-channel oscilloscope waveform capture under simulated load",
      "Live data recording: fuel trim, O2 response, boost pressure, rail pressure",
      "Bidirectional actuator testing: injectors, VVT solenoids, wastegates",
      "HD video diagnostic debrief delivered directly to your phone via SMS",
      "Diagnostic fee credited 100% against approved mechanical repair work",
    ],
  },
];

interface Discipline {
  index: string;
  title: string;
  description: string;
  tooling: string;
  window: string;
  points: string[];
}

const DISCIPLINES: Discipline[] = [
  {
    index: "01",
    title: "Logbook servicing",
    description:
      "Complete digital portal logging into German automaker databases. Under the Competition and Consumer Act 2010, you have the statutory right to service your new car outside the dealership without voiding factory warranty.",
    tooling: "ODIS 23 · BMW ISTA+ · XENTRY XDOS · Audi GeKo / BMW KaSIO / Mercedes DSB",
    window: "2.0 – 4.5 hrs",
    points: [
      "Liqui Moly & Motul OEM approvals: VW 504/507, BMW LL-04, MB 229.52",
      "Section 54 ACL statutory guarantees strictly observed",
      "Itemized transparent invoice preserving full resale provenance",
      "Audi, BMW, Mercedes-Benz, Porsche factory portal digital stamps",
    ],
  },
  {
    index: "02",
    title: "Diagnostic & CAN-Bus troubleshooting",
    description:
      "Pinpoint oscilloscope sensor trace. Modern European networks run intricate FlexRay, CAN-Bus, and LIN topologies — we hook digital oscilloscopes directly into sensor leads and measure actual voltage waveforms microsecond by microsecond.",
    tooling: "PicoScope 4425A 4-Channel · Bosch FSA 740 · ODIS · ISTA+ · XENTRY",
    window: "1.5 – 3.0 hrs",
    points: [
      "Microvolt waveform analysis on crankshaft and cam position sensors",
      "Network packet analysis and bus resistance balance verification",
      "Turbocharger wastegate and piezoelectric injector benchmarking",
      "Diagnostic fee credited 100% against approved mechanical repairs",
    ],
  },
  {
    index: "03",
    title: "Dynamic braking & hydraulics",
    description:
      "Rotor runout measurement & Brembo friction. Brake shudder is predominantly caused by lateral hub runout — every rotor we fit is indexed with digital dial gauges to below 0.02 mm, while EPB systems are reset via factory software.",
    tooling: "Mitutoyo 0.001 mm Digital Micrometers · Autel MaxiSys EPB Calibration",
    window: "2.0 – 3.0 hrs",
    points: [
      "Runout micrometer indexing eliminates disc thickness variation",
      "Brembo high-carbon alloy ventilated discs and low-dust pads",
      "DOT 4 / DOT 5.1 high-temperature pneumatic hydraulic fluid flush",
      "Electronic parking brake calibration & service relearn cycle",
    ],
  },
  {
    index: "04",
    title: "Dual-clutch (DSG) & automatic transmissions",
    description:
      "Factory fluid renewal & mechatronic adaptation. Dealerships often claim dual-clutch and ZF 8-speed transmissions are 'filled for life' — ZF themselves recommend fluid and filter changes every 80,000 km to prevent valve body scoring.",
    tooling: "ZF LifeGuard Fill Stations · VAG Mechatronic Calibration Tools",
    window: "3.5 – 5.0 hrs",
    points: [
      "Original ZF Lifeguard and Pentosin dual-clutch fluid formulations",
      "Mechatronic sump replacement with integrated micro-filtration",
      "Electronic clutch adaptation reset for zero shudder takeoff",
      "Differential and Haldex AWD coupling fluid change",
    ],
  },
  {
    index: "05",
    title: "Steering geometry & 3D laser alignment",
    description:
      "Hunter optical calibration. Multi-link European suspensions require millimeter-accurate geometry to preserve dynamic handling. Our 4-camera optical Hunter rig reads camber, caster, and toe in 90 seconds.",
    tooling: "Hunter HawkEye Elite 3D · BMW / VAG Ride-Height Target Sensors",
    window: "1.0 – 1.5 hrs",
    points: [
      "High-resolution 3D optical cameras with wheel-rim surface protection",
      "ADAS sensor compensation for electronic stability & lane assist",
      "Custom camber/toe optimization for spirited street or track use",
      "Before-and-after full-color chassis alignment vector printout",
    ],
  },
  {
    index: "06",
    title: "Pre-purchase vehicle audits",
    description:
      "120-point digital health certificate with paint depth scan. Never acquire a pre-owned European vehicle without verifiable telemetry — our audit scans body panels for non-factory filler, audits ECU logs, and delivers a transparent roadworthiness assessment.",
    tooling: "DeFelsko PosiTector Paint Gauge · Autel OBD Forensic Suite · Olympus Borescope",
    window: "2.5 – 3.0 hrs",
    points: [
      "Ultrasonic paint depth gauge verification across all metal panels",
      "ECU log check for mileage tampering and hidden overheating events",
      "Video evidence of oil leaks, suspension play, and exhaust soot",
      "Master mechanic telephone consultation before purchase decision",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Page() {
  // Navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Cost estimator
  const [platform, setPlatform] = useState<VehiclePlatform>("vag");
  const [selectedScopeId, setSelectedScopeId] = useState("minor");

  // Disciplines accordion
  const [expandedDiscipline, setExpandedDiscipline] = useState<string>("01");

  // Booking form
  const [bookName, setBookName] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [bookRego, setBookRego] = useState("");
  const [bookService, setBookService] = useState("Minor scheduled service");
  const [bookDate, setBookDate] = useState("");
  const [bookLoanCar, setBookLoanCar] = useState(false);
  const [bookNotes, setBookNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    name: string;
    phone: string;
    vehicle: string;
    service: string;
    date: string;
    loanCar: boolean;
  } | null>(null);

  const estimatorRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pricing calculation
  const currentScope = useMemo(
    () => SERVICE_SCOPES.find((s) => s.id === selectedScopeId) ?? SERVICE_SCOPES[0],
    [selectedScopeId]
  );

  const pricing = useMemo(() => {
    let range: [number, number];
    if (platform === "vag") range = currentScope.vagPrice;
    else if (platform === "bmw") range = currentScope.bmwPrice;
    else if (platform === "mercedes") range = currentScope.mercedesPrice;
    else range = currentScope.prestigePrice;

    const midApex = (range[0] + range[1]) / 2;
    const dealer = Math.round(midApex * currentScope.dealerMultiplier);
    const saving = dealer - midApex;
    const pct = Math.round((saving / dealer) * 100);

    return { range, dealer, saving: Math.round(saving), pct };
  }, [platform, currentScope]);

  const handleLockInEstimate = () => {
    setBookService(currentScope.name);
    const el = document.getElementById("reservation");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName.trim() || !bookPhone.trim() || !bookRego.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const suffix = Math.floor(1000 + Math.random() * 9000)
        .toString(16)
        .toUpperCase();
      setConfirmation({
        reference: `#APX-2026-${suffix}`,
        name: bookName,
        phone: bookPhone,
        vehicle: bookRego,
        service: bookService,
        date: bookDate || "Next available morning — 07:30 AM",
        loanCar: bookLoanCar,
      });
      setIsSubmitting(false);
    }, 700);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full bg-[#0B0C0E] text-[#F8F9FA] font-sans selection:bg-[#0062FF] selection:text-white">

      {/* ===================================================================
          SECTION 1 — AGENCY DEMONSTRATION NOTICE
      =================================================================== */}
      <div className="w-full bg-black border-b border-white/10 py-2 px-4 text-center text-xs text-neutral-400">
        AGENCY PORTFOLIO DEMONSTRATION | High-Conversion Commercial Prototype by{" "}
        <a
          href="https://ithelpers.com.au"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-300 underline underline-offset-2 hover:text-white transition-colors"
        >
          Visit Agency (ithelpers.com.au)
        </a>
      </div>

      {/* ===================================================================
          SECTION 2 — FLOATING MINIMALIST NAVIGATION
      =================================================================== */}
      <div className="sticky top-4 z-50 px-4 sm:px-6">
        <nav
          className={`bg-[#0B0C0E]/90 backdrop-blur border border-white/10 rounded-full px-4 sm:px-6 py-3 max-w-6xl mx-auto flex items-center justify-between transition-shadow ${
            scrolled ? "shadow-2xl shadow-black/60" : ""
          }`}
          aria-label="Main navigation"
        >
          {/* Brand */}
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span className="text-xs font-bold tracking-widest text-white uppercase">
              APEX PRECISION MECHANICAL
            </span>
            <span className="hidden sm:inline text-[10px] text-neutral-500 tracking-wider">
              SYDNEY WORKSHOP OPEN
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7 text-xs text-neutral-400">
            <a href="#estimator" className="hover:text-white transition-colors">Services</a>
            <a href="#estimator" className="hover:text-white transition-colors">Cost Estimator</a>
            <a href="#standard" className="hover:text-white transition-colors">The Apex Standard</a>
            <a href="#guarantee" className="hover:text-white transition-colors">Guarantee</a>
            <a href="#reservation" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href="tel:0289013400"
              className="hidden md:flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#0062FF]" />
              (02) 8901 3400
            </a>
            <a
              href="#reservation"
              className="bg-[#0062FF] hover:bg-blue-500 text-white rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-colors"
            >
              Book service
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-neutral-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 max-w-6xl mx-auto bg-[#0B0C0E]/95 backdrop-blur border border-white/10 rounded-[4px] p-4 flex flex-col gap-1">
            {[
              ["#estimator", "Services"],
              ["#estimator", "Cost Estimator"],
              ["#standard", "The Apex Standard"],
              ["#guarantee", "Guarantee"],
              ["#reservation", "Contact"],
            ].map(([href, label]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-neutral-300 hover:text-white py-2.5 px-3 rounded-[4px] hover:bg-white/5 transition-colors"
              >
                {label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 mt-1">
              <a
                href="tel:0289013400"
                className="flex items-center gap-2 text-sm text-neutral-300 py-2 px-3"
              >
                <Phone className="w-4 h-4 text-[#0062FF]" />
                (02) 8901 3400
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================
          SECTION 3 — ASYMMETRIC COMMERCIAL HERO
      =================================================================== */}
      <section className="w-full pt-12 pb-20 lg:pt-16 lg:pb-28 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center">

            {/* Left — Editorial copy */}
            <div className="flex flex-col gap-7">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-medium text-neutral-400 tracking-wide">
                  NSW MVRL Lic #58291 · Alexandria Independent Specialist
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-white leading-[1.08]">
                  Dealership-level precision.
                  <br />
                  <span className="text-neutral-400 font-light">Independent workshop integrity.</span>
                </h1>
                <p className="text-base text-neutral-400 leading-relaxed max-w-lg">
                  Certified European & Japanese mechanical facility. Preserving your statutory new car warranty under{" "}
                  <span className="text-neutral-200">Australian Consumer Law</span> with genuine OEM parts,
                  factory diagnostic computers, and transparent digital video quoting.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#estimator"
                  className="inline-flex items-center gap-2 bg-[#0062FF] hover:bg-blue-500 text-white rounded-full px-6 py-3 text-sm font-semibold transition-colors"
                >
                  Instant service estimator
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="tel:0289013400"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-neutral-300 hover:text-white rounded-full px-6 py-3 text-sm font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0062FF]" />
                  (02) 8901 3400 — Speak to a mechanic
                </a>
              </div>

              {/* Trust signals row */}
              <div className="pt-2 flex flex-wrap items-center gap-5 border-t border-white/10">
                {[
                  "100% ACL statutory warranty safe",
                  "OEM parts only — Mahle, Brembo, Bilstein",
                  "Digital video quoting — approve before we start",
                ].map((signal) => (
                  <div key={signal} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                    <span className="text-xs text-neutral-400">{signal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Vehicle image */}
            <div className="relative">
              <div className="rounded-[4px] border border-white/10 overflow-hidden bg-[#12151A]">
                <img
                  src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80"
                  alt="European vehicle on workshop diagnostic lift at Apex Precision Mechanical"
                  className="w-full h-[360px] sm:h-[420px] object-cover object-center opacity-90"
                />
              </div>
              {/* Floating trust chips */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/80 backdrop-blur border border-white/15 px-3 py-1.5 text-[11px] font-medium text-neutral-200">
                  <Check className="w-3 h-3 text-[#10B981]" />
                  100% ACL Statutory Warranty Safe
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/80 backdrop-blur border border-white/15 px-3 py-1.5 text-[11px] font-medium text-neutral-200">
                  <Check className="w-3 h-3 text-[#0062FF]" />
                  Factory Diagnostic Parity
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 4 — FOUR COMMERCIAL WORKSHOP PILLARS
      =================================================================== */}
      <section className="w-full py-10 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0B0C0E]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              {
                n: "01",
                title: "Statutory warranty safe",
                body: "100% manufacturer warranty protected by Australian Consumer Law — we service your new car for less, legally.",
              },
              {
                n: "02",
                title: "OEM components only",
                body: "Mahle, Mann, Brembo, Bilstein genuine tier-1 components. No pattern parts, no compromises.",
              },
              {
                n: "03",
                title: "Digital video quoting",
                body: "HD video inspection sent to your phone before any work begins. You approve every dollar spent.",
              },
              {
                n: "04",
                title: "Licensed master mechanics",
                body: "Dedicated senior technicians handling every engine bay. No unsupervised apprentices on your vehicle.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="py-8 px-6 first:pl-0 last:pr-0 sm:first:pl-6 sm:last:pr-6 lg:first:pl-0 lg:last:pr-0 flex flex-col gap-3">
                <span className="text-[10px] font-mono text-neutral-600 tracking-widest">Pillar {n}</span>
                <h3 className="text-sm font-semibold text-white leading-snug">{title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 5 — INTERACTIVE SERVICE COST & TRANSPARENCY ENGINE
      =================================================================== */}
      <section
        id="estimator"
        ref={estimatorRef as React.RefObject<HTMLElement>}
        className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#12151A]"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase">
              Transparent pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Service cost & transparency engine
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Real pricing based on factory standard times and direct OEM component procurement.
              Compare our workshop investment against authorized dealership benchmarks.
            </p>
          </div>

          {/* Brand selector pills */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "vag", label: "Audi / Volkswagen" },
                { id: "bmw", label: "BMW / MINI" },
                { id: "mercedes", label: "Mercedes-Benz" },
                { id: "prestige", label: "Porsche / Prestige" },
              ] as { id: VehiclePlatform; label: string }[]
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPlatform(id)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  platform === id
                    ? "bg-[#0062FF] text-white"
                    : "border border-white/15 text-neutral-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Estimator workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

            {/* Scope selection */}
            <div className="flex flex-col gap-3">
              <p className="text-xs text-neutral-500 mb-1">Select service scope</p>
              {SERVICE_SCOPES.map((scope) => {
                const isSelected = scope.id === selectedScopeId;
                let range: [number, number];
                if (platform === "vag") range = scope.vagPrice;
                else if (platform === "bmw") range = scope.bmwPrice;
                else if (platform === "mercedes") range = scope.mercedesPrice;
                else range = scope.prestigePrice;

                return (
                  <button
                    key={scope.id}
                    type="button"
                    onClick={() => setSelectedScopeId(scope.id)}
                    className={`text-left rounded-[4px] p-4 border transition-all ${
                      isSelected
                        ? "border-[#0062FF] bg-[#0062FF]/5 ring-1 ring-[#0062FF]/20"
                        : "border-white/10 bg-[#0B0C0E] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                            isSelected
                              ? "border-[#0062FF] bg-[#0062FF]"
                              : "border-white/20"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white leading-snug">
                            {scope.name}
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            {scope.schedule}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-white font-mono">
                          ${range[0]}–${range[1]}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {scope.turnaround.split("·")[0].trim()}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Financial breakdown panel */}
            <div className="rounded-[4px] border border-white/10 bg-[#0B0C0E] p-6 flex flex-col gap-6 sticky top-24">
              {/* Apex investment */}
              <div className="flex flex-col gap-1 pb-5 border-b border-white/10">
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
                  Apex workshop investment
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-bold text-white font-mono tracking-tight">
                    ${pricing.range[0]}–${pricing.range[1]}
                  </span>
                  <span className="text-xs text-neutral-500">inc. GST</span>
                </div>
                <span className="text-[11px] text-neutral-500 mt-1">
                  {currentScope.turnaround}
                </span>
              </div>

              {/* Savings grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[4px] border border-white/10 bg-[#12151A] p-3">
                  <div className="text-[10px] text-neutral-500 uppercase mb-1">
                    Average franchise dealer
                  </div>
                  <div className="text-lg font-bold text-neutral-400 line-through font-mono">
                    ${pricing.dealer}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Dealer benchmark</div>
                </div>
                <div className="rounded-[4px] border border-[#10B981]/25 bg-[#10B981]/5 p-3">
                  <div className="text-[10px] text-[#10B981] uppercase mb-1">
                    Direct customer savings
                  </div>
                  <div className="text-lg font-bold text-[#10B981] font-mono">
                    −${pricing.saving}
                  </div>
                  <div className="text-[10px] text-[#10B981]/70 mt-0.5">{pricing.pct}% below dealer</div>
                </div>
              </div>

              {/* Inclusions */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
                  What's included
                </span>
                <ul className="flex flex-col gap-2">
                  {currentScope.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                      <Check className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={handleLockInEstimate}
                className="w-full bg-[#0062FF] hover:bg-blue-500 text-white rounded-[4px] py-3.5 px-5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Lock in this estimate & book bay
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-neutral-600 -mt-3">
                Pre-fills reservation below · No deposit required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 6 — CORE MECHANICAL DISCIPLINES (STRUCTURED ASYMMETRIC MATRIX)
      =================================================================== */}
      <section className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0B0C0E]">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          {/* Header + photos row */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase">
                Mechanical disciplines
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Six domains. One standard.
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-lg">
                Engineered service protocols exceeding factory dealer criteria. Every vehicle receives
                oscilloscope fault tracing, micrometer rotor runout indexing, and direct factory portal logging.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[4px] border border-white/10 overflow-hidden h-36">
                <img
                  src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80"
                  alt="Apex Precision Mechanical workshop bay"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="rounded-[4px] border border-white/10 overflow-hidden h-36">
                <img
                  src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=800&q=80"
                  alt="Apex Precision Mechanical engine service"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>
          </div>

          {/* Accordion disciplines list */}
          <div className="border border-white/10 rounded-[4px] overflow-hidden divide-y divide-white/10">
            {DISCIPLINES.map((d) => {
              const isOpen = expandedDiscipline === d.index;
              return (
                <div key={d.index}>
                  <button
                    type="button"
                    onClick={() => setExpandedDiscipline(isOpen ? "" : d.index)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-5">
                      <span className="font-mono text-xs text-neutral-600 w-6 flex-shrink-0">
                        {d.index}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-white">{d.title}</div>
                        <div className="text-[11px] text-neutral-500 mt-0.5 hidden sm:block">
                          {d.tooling.split("·")[0].trim()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="hidden md:block text-xs text-neutral-500 font-mono">
                        {d.window}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-1 bg-[#12151A] border-t border-white/10">
                      <div className="flex flex-col gap-5 ml-11">
                        <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
                          {d.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {d.points.map((pt, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                              <Check className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                          <span className="text-[11px] text-neutral-500 font-mono">
                            Tooling: {d.tooling}
                          </span>
                          <a
                            href="#reservation"
                            className="ml-auto inline-flex items-center gap-1.5 bg-[#0062FF] hover:bg-blue-500 text-white rounded-[4px] px-3.5 py-2 text-xs font-semibold transition-colors"
                          >
                            Book this service
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 7 — THE APEX STANDARD (PHOTO-EDITORIAL SPLIT)
      =================================================================== */}
      <section id="standard" className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#12151A]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 lg:gap-16 items-start">

            {/* Left — portrait */}
            <div className="flex flex-col gap-4">
              <div className="rounded-[4px] border border-white/10 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"
                  alt="Master European diagnostic specialist at Apex Precision Mechanical Alexandria"
                  className="w-full h-[480px] object-cover object-top opacity-90"
                />
              </div>
              <div className="flex items-center gap-2 px-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[11px] text-neutral-500">Licensed master specialists · IAME certified</span>
              </div>
            </div>

            {/* Right — editorial copy */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase">
                  Workshop philosophy
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Built by mechanics,<br className="hidden sm:block" /> not service advisors.
                </h2>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  We built Apex to eliminate the deceptive practices that plague franchised car dealerships.
                  Three non-negotiable standards govern every bay in our Alexandria workshop.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {/* 01 */}
                <div className="flex gap-5 pb-5 border-b border-white/10">
                  <div className="w-8 h-8 rounded-[4px] border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Video className="w-4 h-4 text-[#0062FF]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-600 tracking-widest">01</span>
                      <h3 className="text-sm font-semibold text-white">Direct SMS video quotations</h3>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Inspect the worn part on video before approving costs. Our technicians record the exact
                      worn bushing, weeping seal, or scored rotor with micrometer measurements and a voice
                      explanation, sent directly to your phone. Zero unauthorized bolt-turning.
                    </p>
                  </div>
                </div>

                {/* 02 */}
                <div className="flex gap-5 pb-5 border-b border-white/10">
                  <div className="w-8 h-8 rounded-[4px] border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-[#0062FF]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-600 tracking-widest">02</span>
                      <h3 className="text-sm font-semibold text-white">Zero mark-up mystery</h3>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Fixed-price labor rates with itemized parts invoices. Every component we supply is
                      listed by part number, OEM supplier, and price. No bundled service packages that mask
                      inflated margins. You see exactly what you're paying for.
                    </p>
                  </div>
                </div>

                {/* 03 */}
                <div className="flex gap-5">
                  <div className="w-8 h-8 rounded-[4px] border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-[#0062FF]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-600 tracking-widest">03</span>
                      <h3 className="text-sm font-semibold text-white">Direct digital service book stamping</h3>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Directly logged to Audi GeKo, BMW KaSIO, and Mercedes DSB. We maintain authenticated
                      portal access to manufacturer databases, ensuring your electronic service history
                      remains unbroken and preserves full factory provenance and resale value.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 7b — ACL STATUTORY GUARANTEE (id="guarantee")
      =================================================================== */}
      <section id="guarantee" className="w-full py-14 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0B0C0E]">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-[4px] border border-white/10 bg-[#12151A] p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="flex flex-col gap-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#10B981]" />
                <span className="text-xs font-semibold text-[#10B981] tracking-wide uppercase">
                  ACL Section 54 statutory guarantee
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Your new car warranty is protected by law.
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Under the <strong className="text-neutral-200">Competition and Consumer Act 2010</strong> (Schedule 2 —
                Australian Consumer Law, Section 54), any attempt by a manufacturer or dealer to void your factory
                warranty because you serviced at an independent workshop is <strong className="text-neutral-200">unlawful</strong>.
                We supply statutory-compliant OEM parts, factory-approved lubricants, and issue a fully itemized
                tax invoice — fulfilling every legal requirement for warranty preservation.
              </p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Compliant with NSW Fair Trading guidelines. Documentation available upon request.
                This notice does not constitute legal advice.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                "OEM-spec lubricants & filters used",
                "Itemized tax invoice issued",
                "Factory portal digital service stamp",
                "ACL Section 54 fully observed",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#10B981]" />
                  </div>
                  <span className="text-sm text-neutral-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 8 — BAY RESERVATION TERMINAL
      =================================================================== */}
      <section
        id="reservation"
        className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#12151A]"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          {/* Header */}
          <div className="text-center flex flex-col gap-3">
            <span className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase">
              Workshop intake
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Reserve your service bay
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xl mx-auto">
              Lock in your diagnostic or mechanical bay. Pre-fill your registration and service scope
              for expedited morning intake from 07:30 AM.
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-[4px] border border-white/10 bg-[#0B0C0E] p-6 sm:p-8">
            {confirmation ? (
              /* ── Confirmation state ── */
              <div className="flex flex-col gap-6">
                <div className="rounded-[4px] border border-[#10B981]/30 bg-[#10B981]/5 p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div>
                      <div className="text-xs text-[#10B981] font-semibold uppercase tracking-wide">
                        Reservation confirmed
                      </div>
                      <div className="text-xl font-bold text-white font-mono">
                        {confirmation.reference}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    {[
                      ["Name", confirmation.name],
                      ["Mobile", confirmation.phone],
                      ["Vehicle", confirmation.vehicle],
                      ["Service", confirmation.service],
                      ["Preferred date", confirmation.date],
                      ["Loan car", confirmation.loanCar ? "Requested — subject to availability" : "Not required"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider">{label}</span>
                        <span className="text-xs text-neutral-200 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[4px] bg-[#12151A] border border-white/10 p-3.5 text-xs text-neutral-400 leading-relaxed">
                    <strong className="text-neutral-200">Intake instructions:</strong> Please arrive at{" "}
                    <strong className="text-neutral-200">42 Collins Street, Alexandria NSW 2015</strong> between{" "}
                    <strong className="text-neutral-200">07:30 AM and 09:00 AM</strong> on your selected day.
                    For after-hours arrivals, deposit your keys in the secure lock box at Bay 01 using code{" "}
                    <strong className="text-neutral-200">APX-KEY</strong>.
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmation(null)}
                    className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-neutral-300 hover:text-white rounded-[4px] px-4 py-2.5 text-xs font-medium transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    New reservation
                  </button>
                  <a
                    href="tel:0289013400"
                    className="inline-flex items-center gap-2 bg-[#0062FF] hover:bg-blue-500 text-white rounded-[4px] px-4 py-2.5 text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call workshop
                  </a>
                </div>
              </div>
            ) : (
              /* ── Form state ── */
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-medium">
                      Full name <span className="text-[#0062FF]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. James Hartmann"
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      className="rounded-[4px] bg-[#12151A] border border-white/10 text-white focus:border-[#0062FF] focus:outline-none focus:ring-1 focus:ring-[#0062FF]/20 px-3.5 py-2.5 text-sm placeholder:text-neutral-600"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-medium">
                      Mobile number <span className="text-[#0062FF]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0412 345 678"
                      value={bookPhone}
                      onChange={(e) => setBookPhone(e.target.value)}
                      className="rounded-[4px] bg-[#12151A] border border-white/10 text-white focus:border-[#0062FF] focus:outline-none focus:ring-1 focus:ring-[#0062FF]/20 px-3.5 py-2.5 text-sm placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-medium">
                      Rego / make & model <span className="text-[#0062FF]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NSW BZF82E · 2023 Audi S4"
                      value={bookRego}
                      onChange={(e) => setBookRego(e.target.value)}
                      className="rounded-[4px] bg-[#12151A] border border-white/10 text-white focus:border-[#0062FF] focus:outline-none focus:ring-1 focus:ring-[#0062FF]/20 px-3.5 py-2.5 text-sm placeholder:text-neutral-600"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Service scope</label>
                    <select
                      value={bookService}
                      onChange={(e) => setBookService(e.target.value)}
                      className="rounded-[4px] bg-[#12151A] border border-white/10 text-white focus:border-[#0062FF] focus:outline-none focus:ring-1 focus:ring-[#0062FF]/20 px-3.5 py-2.5 text-sm"
                    >
                      {SERVICE_SCOPES.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Preferred drop-off date</label>
                    <input
                      type="date"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="rounded-[4px] bg-[#12151A] border border-white/10 text-white focus:border-[#0062FF] focus:outline-none focus:ring-1 focus:ring-[#0062FF]/20 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Loan car required?</label>
                    <div className="flex gap-2 h-full items-end pb-0.5">
                      {["Yes", "No"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setBookLoanCar(opt === "Yes")}
                          className={`flex-1 rounded-[4px] border py-2.5 text-xs font-medium transition-colors ${
                            (opt === "Yes" && bookLoanCar) || (opt === "No" && !bookLoanCar)
                              ? "border-[#0062FF] bg-[#0062FF]/10 text-white"
                              : "border-white/10 text-neutral-500 hover:border-white/20 hover:text-neutral-300"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-400 font-medium">
                    Notes / fault symptoms
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe any warning lights, noises, vibration patterns, or past maintenance history..."
                    value={bookNotes}
                    onChange={(e) => setBookNotes(e.target.value)}
                    className="rounded-[4px] bg-[#12151A] border border-white/10 text-white focus:border-[#0062FF] focus:outline-none focus:ring-1 focus:ring-[#0062FF]/20 px-3.5 py-2.5 text-sm placeholder:text-neutral-600 resize-none"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0062FF] hover:bg-blue-500 disabled:bg-neutral-700 text-white rounded-[4px] py-3.5 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Confirming reservation…
                      </span>
                    ) : (
                      <>
                        Confirm bay reservation
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-neutral-600 mt-2">
                    Instant confirmation issued · No payment required upfront
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 9 — ALEXANDRIA FACILITY DETAILS & FOOTER
      =================================================================== */}
      <footer className="w-full bg-[#0B0C0E] border-t border-white/10 pt-16 pb-28 md:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">

          {/* Facility info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-white/10">
            {/* Address */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0062FF]" />
                <span className="text-xs font-semibold text-white uppercase tracking-wide">
                  Alexandria workshop
                </span>
              </div>
              <p className="text-sm text-neutral-300 font-medium">
                42 Collins Street<br />Alexandria NSW 2015
              </p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Inner-south Sydney European automotive precinct. 650 m from Green Square
                Station with rapid transit to Sydney CBD.
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <a href="tel:0289013400" className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#0062FF]" />
                  (02) 8901 3400
                </a>
                <a href="mailto:dispatch@apexprecision.com.au" className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#0062FF]" />
                  dispatch@apexprecision.com.au
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0062FF]" />
                <span className="text-xs font-semibold text-white uppercase tracking-wide">
                  Operating hours
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  ["Mon – Fri", "7:30 AM – 5:30 PM"],
                  ["Saturday", "8:00 AM – 1:00 PM"],
                  ["Sunday", "Closed"],
                ].map(([day, time]) => (
                  <div key={day} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs text-neutral-400">{day}</span>
                    <span className="text-xs text-neutral-200 font-medium">{time}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Key className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-neutral-500 leading-relaxed">
                  <strong className="text-neutral-300">24/7 secure after-hours key drop box</strong> available at Bay 01 for early
                  morning or late-night drop-offs. Instructions provided upon reservation.
                </p>
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-white uppercase tracking-wide">Quick access</span>
              <div className="flex flex-col gap-1">
                {[
                  ["#estimator", "Service cost estimator"],
                  ["#estimator", "Core disciplines"],
                  ["#standard", "The Apex standard"],
                  ["#guarantee", "ACL warranty guarantee"],
                  ["#reservation", "Book a service bay"],
                ].map(([href, label]) => (
                  <a
                    key={label}
                    href={href}
                    className="text-xs text-neutral-500 hover:text-neutral-200 transition-colors py-1"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ACL compliance + copyright */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-600">
            <div className="flex flex-wrap items-center gap-3">
              <span>NSW MVRL: 58291</span>
              <span className="text-neutral-700">·</span>
              <span>IAME Certified</span>
              <span className="text-neutral-700">·</span>
              <span className="text-neutral-400">
                ACL Section 54 compliant — warranty preserved at independent repairers under the
                Competition and Consumer Act 2010 (Cth)
              </span>
            </div>
            <div className="flex-shrink-0">
              © 2026 Apex Precision Mechanical. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* ===================================================================
          MOBILE STICKY BOTTOM ACTION BAR (< 768px)
      =================================================================== */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0B0C0E]/95 backdrop-blur border-t border-white/10 p-3 flex items-center gap-3">
        <a
          href="tel:0289013400"
          className="flex-1 flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 text-neutral-200 rounded-full py-3 text-xs font-semibold transition-colors"
        >
          <Phone className="w-4 h-4 text-[#0062FF]" />
          Call (02) 8901 3400
        </a>
        <a
          href="#reservation"
          className="flex-1 flex items-center justify-center gap-2 bg-[#0062FF] hover:bg-blue-500 text-white rounded-full py-3 text-xs font-semibold transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Book online
        </a>
      </div>
    </div>
  );
}
