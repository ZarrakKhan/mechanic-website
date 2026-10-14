"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Wrench,
  ShieldCheck,
  Cpu,
  Gauge,
  Clock,
  Calendar,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Phone,
  MapPin,
  Mail,
  Key,
  ArrowRight,
  Sliders,
  ExternalLink,
  FileText,
  Check,
  Menu,
  X,
  Radio,
  Zap,
  RotateCcw,
  Printer,
} from "lucide-react";

// Platform Categories
type PlatformCategory = "euro" | "jap" | "suv";

interface ServiceScopeItem {
  id: string;
  name: string;
  tag: string;
  turnaround: string;
  hours: number;
  euroPrice: [number, number];
  japPrice: [number, number];
  suvPrice: [number, number];
  dealerMultiplier: number;
  protocolSummary: string;
  includedItems: string[];
  oemStandards: string;
}

const SERVICE_SCOPES: ServiceScopeItem[] = [
  {
    id: "scope-minor",
    name: "Factory Minor Logbook Service",
    tag: "SCHEDULE A // 15,000 KM OR 12 MO",
    turnaround: "Same-Day Handover (2.0 – 2.5 hrs)",
    hours: 2.2,
    euroPrice: [380, 460],
    japPrice: [280, 350],
    suvPrice: [340, 420],
    dealerMultiplier: 1.48,
    protocolSummary:
      "Statutory warranty compliant lubrication service using OEM manufacturer-approved synthetic fluids and original micro-filtration elements.",
    oemStandards: "ODIS 23 · BMW ISTA+ · XENTRY XDOS · ACL Section 54 Compliant",
    includedItems: [
      "Factory-spec OEM synthetic lubricant (Liqui Moly Top Tec / Motul 8100 / Castrol Edge Professional)",
      "Mann / Mahle genuine OEM micro-porous oil filter cartridge replacement",
      "62-point precision chassis, driveline & hydraulic safety audit",
      "Live ECU telemetry scan with fault code read, freeze-frame audit & reset",
      "Direct digital logbook verification logged to factory portals (GeKo, KaSIO, DSB)",
      "Complimentary fluid top-ups (windscreen concentrate, factory coolant, power steering)",
    ],
  },
  {
    id: "scope-major",
    name: "Comprehensive Major Inspection & Fluid Renewal",
    tag: "SCHEDULE B // 30,000 KM OR 24 MO",
    turnaround: "Same-Day Handover (4.0 – 5.0 hrs)",
    hours: 4.5,
    euroPrice: [680, 850],
    japPrice: [490, 620],
    suvPrice: [580, 740],
    dealerMultiplier: 1.55,
    protocolSummary:
      "Deep powertrain, intake, ignition, and hydraulic renewal designed to uphold statutory warranty and optimize thermodynamic efficiency.",
    oemStandards: "Factory Diagnostic Reset · GeKo Stamped · Brake Hygroscopic Tested",
    includedItems: [
      "OEM synthetic engine oil renewal + high-viscosity crankcase chemical flush",
      "Engine intake induction micro-filter + active activated-carbon cabin pollen filter",
      "Brake fluid hygroscopic boiling-point test & pneumatic reverse pressure purge (DOT 4/5.1)",
      "Spark plug electrode inspection or diesel fuel water-separator element renewal",
      "Oscilloscope telemetry review of sensor waveforms and timing tolerances",
      "Full chassis subframe, bushing deflection & ball joint torque calibration check",
    ],
  },
  {
    id: "scope-brakes",
    name: "Performance Brake Disc & Pad Replacement (Brembo)",
    tag: "AXLE LEVEL // FRONT OR REAR",
    turnaround: "Same-Day Handover (2.5 – 3.0 hrs)",
    hours: 2.8,
    euroPrice: [440, 590],
    japPrice: [340, 460],
    suvPrice: [390, 520],
    dealerMultiplier: 1.42,
    protocolSummary:
      "Precision braking restoration incorporating micrometer rotor runout measurement, Brembo friction compounds, and electronic parking brake calibration.",
    oemStandards: "Brembo / Textar OEM · Runout ≤ 0.02mm · Electronic Caliper Retraction",
    includedItems: [
      "High-carbon anti-corrosion coated Brembo or Textar OEM disc rotors",
      "Low-dust European OEM compound brake pads with integrated acoustic shims",
      "Digital micrometer rotor disc thickness & lateral runout verification (tolerance ≤ 0.02mm)",
      "Electronic parking brake (EPB) service mode retraction & zero-point adaptation relearn",
      "Caliper guide slider pin degreasing and high-temperature ceramic synthetic lubrication",
      "Post-installation controlled bed-in cycle and hydraulic line pressure certification",
    ],
  },
  {
    id: "scope-diagnostics",
    name: "CAN-Bus Electrical Diagnostic & Telemetry Scan",
    tag: "COMPONENT LEVEL // ISOLATION AUDIT",
    turnaround: "Priority Diagnostic Window (1.5 – 2.5 hrs)",
    hours: 2.0,
    euroPrice: [220, 290],
    japPrice: [190, 250],
    suvPrice: [210, 270],
    dealerMultiplier: 1.65,
    protocolSummary:
      "Direct ECU interrogation utilizing dealer software suites and PicoScope 4-channel oscilloscopes to pinpoint root electrical anomalies without shotgun parts swapping.",
    oemStandards: "PicoScope 4425A · ISTA+ · ODIS · XENTRY · 100% Diagnostic Credited",
    includedItems: [
      "Full vehicle topology scan across CAN-Bus, LIN-Bus, FlexRay, and MOST optical networks",
      "PicoScope 4-channel digital oscilloscope sensor waveform capture under simulated load",
      "Live sensor data recording: fuel trim, oxygen sensor response, boost pressure, rail pressure",
      "Actuator functional bidirectional testing (injectors, variable valve timing solenoids, wastegates)",
      "High-definition digital photo/video diagnostic debrief sent directly via SMS/portal",
      "Diagnostic fee credited 100% against approved mechanical repair procedures",
    ],
  },
  {
    id: "scope-driveline",
    name: "DSG / Dual-Clutch & ZF Transmission Service",
    tag: "DRIVELINE // CLUTCH & VALVE BODY",
    turnaround: "Same-Day Handover (3.5 – 4.5 hrs)",
    hours: 4.0,
    euroPrice: [580, 750],
    japPrice: [450, 590],
    suvPrice: [520, 680],
    dealerMultiplier: 1.5,
    protocolSummary:
      "Specialized transmission fluid evacuation, pan/filter replacement, mechatronic magnet cleanout, and diagnostic clutch pack bite-point recalibration.",
    oemStandards: "ZF Lifeguard 8/9 · Pentosin FFL-2 · VAG / BMW Software Adaptation",
    includedItems: [
      "Genuine factory transmission fluid replenishment (ZF LifeguardFluid 6/8/9 or VAG DSG G052182)",
      "Internal high-capacity filter and integrated mechatronic sump pan replacement with new hardware",
      "Mechatronic magnet inspection, metallic debris audit, and high-pressure valve body flush",
      "Temperature-regulated fluid leveling procedure at specified internal 35°C–45°C window",
      "Diagnostic clutch kiss-point adaptation and hydraulic shift solenoid pressure relearn",
      "Transfer case and front/rear differential synthetic gear oil level & seal inspection",
    ],
  },
  {
    id: "scope-prepurchase",
    name: "Pre-Purchase 120-Point Mechanical Audit",
    tag: "ACQUISITION AUDIT // 120 CHECKPOINTS",
    turnaround: "Comprehensive Session (2.5 – 3.0 hrs)",
    hours: 2.8,
    euroPrice: [320, 390],
    japPrice: [260, 330],
    suvPrice: [290, 360],
    dealerMultiplier: 1.35,
    protocolSummary:
      "Forensic vehicle assessment combining ultrasonic paint depth scanning, borescope engine camera audit, chassis integrity inspection, and ECU freeze-frame analysis.",
    oemStandards: "Paint Depth Ultrasonic Gauge · OBD-II Mileage Log · 4K Evidence Vault",
    includedItems: [
      "120-point digital mechanical, underbody structural, and electronic safety audit",
      "Digital magnetic & ultrasonic paint depth meter scan across all panels to detect hidden accident repair",
      "ECU freeze-frame audit, stored crash records interrogation, and verified mileage validation",
      "Fluid contamination chemical strip testing (coolant electrolysis, brake fluid copper content)",
      "Master European technician direct telephone consultation and comprehensive 35+ page PDF report",
      "Itemized prospective maintenance schedule detailing impending 12-month mechanical costs",
    ],
  },
];

interface EngineeringCapability {
  index: string;
  title: string;
  subtitle: string;
  tooling: string;
  sla: string;
  details: string;
  imageUrl: string;
  points: string[];
}

const CAPABILITIES_DATA: EngineeringCapability[] = [
  {
    index: "01",
    title: "Manufacturer Logbook Servicing",
    subtitle: "Statutory new car warranty preservation under Australian Consumer Law",
    tooling: "ODIS 23 · ISTA+ 4.4 · XENTRY XDOS · GeKo / KaSIO Cloud",
    sla: "2.0 – 4.5 Hours",
    imageUrl:
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80",
    details:
      "Under the Competition and Consumer Act 2010, vehicle owners have the statutory right to service new cars outside the dealership without voiding factory warranty. We strictly install OEM filters and Liqui Moly/Motul factory-approved lubricants, registering service data directly into official European manufacturer digital portals.",
    points: [
      "Audi GeKo, BMW KaSIO, Mercedes-Benz DSB digital book updates",
      "Liqui Moly & Motul OEM approvals (VW 504/507, BMW LL-04, MB 229.52)",
      "Strict compliance with Section 54 ACL statutory guarantees",
      "Itemized transparent tax invoice preserving resale provenance",
    ],
  },
  {
    index: "02",
    title: "Oscilloscope CAN-Bus Fault Diagnostics",
    subtitle: "Component-level fault isolation eliminating trial-and-error parts replacement",
    tooling: "PicoScope 4425A 4-Channel · Bosch FSA 740 · Fluke 88V",
    sla: "1.5 – 3.0 Hours",
    imageUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    details:
      "Modern European networks run intricate FlexRay, CAN-Bus, and LIN topologies. We hook digital oscilloscopes directly into sensor leads and network wiring to measure actual voltage waveforms and bus traffic microsecond by microsecond, diagnosing intermittent gremlins at the circuit board level.",
    points: [
      "Oscilloscopic microvolt waveform analysis on crankshaft/cam sensors",
      "Network packet sniffing and bus resistance balance verification",
      "Turbocharger wastegate actuator and piezoelectric injector benchmarking",
      "Diagnostic fee 100% credited against approved mechanical repairs",
    ],
  },
  {
    index: "03",
    title: "Dynamic Braking & Hydraulic Renewal",
    subtitle: "Brembo / Textar OEM component renewal with digital rotor runout measurement",
    tooling: "Mitutoyo 0.001mm Digital Micrometers · Autel MaxiSys EPB Calibration",
    sla: "2.0 – 3.0 Hours",
    imageUrl:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
    details:
      "Brake shudder and premature pad wear are predominantly caused by lateral hub runout and improper disc bedding. Every brake rotor we fit is indexed with digital dial gauges to ensure lateral runout is below 0.02mm, while electronic parking brake systems are reset via software to avoid motor burnouts.",
    points: [
      "Runout micrometer indexing to eliminates disc thickness variation",
      "Brembo high-carbon alloy ventilated discs and low-dust pads",
      "DOT 4 / DOT 5.1 high-temperature pneumatic hydraulic fluid flush",
      "Electronic parking brake calibration & service relearn cycle",
    ],
  },
  {
    index: "04",
    title: "Driveline, DSG & ZF Mechatronic Care",
    subtitle: "Specialized transmission fluid evacuation, filter renewal and clutch calibration",
    tooling: "ZF LifeGuard Fill Stations · VAG Mechatronic Calibration Tools",
    sla: "3.5 – 5.0 Hours",
    imageUrl:
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80",
    details:
      "Dealerships often claim dual-clutch and ZF 8-speed transmissions are 'filled for life'. ZF themselves recommends fluid and filter changes every 80,000 km to prevent valve body scoring. We carry out precision temperature-controlled fills and relearn the wet-clutch biting points for silk-smooth gear changes.",
    points: [
      "Original ZF Lifeguard and Pentosin dual-clutch fluid formulations",
      "Mechatronic sump replacement with integrated micro-filtration",
      "Electronic clutch adaptation reset for zero shudder takeoff",
      "Differential and Haldex AWD coupling fluid change and screen clean",
    ],
  },
  {
    index: "05",
    title: "Hunter 3D Optical Laser Wheel Alignment",
    subtitle: "High-definition chassis geometry calibration on Hawkeye Elite platforms",
    tooling: "Hunter HawkEye Elite 3D · BMW / VAG Ride-Height Target Sensors",
    sla: "1.0 – 1.5 Hours",
    imageUrl:
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
    details:
      "Multi-link European suspensions require millimeter-accurate geometry to preserve dynamic handling and prevent inside-edge tyre shredding. Our 4-camera optical Hunter rig reads camber, caster, and toe in 90 seconds, followed by chassis subframe adjustment to exact factory road-load specs.",
    points: [
      "High-resolution 3D optical cameras with wheel-rim surface protection",
      "Compensation for electronic stability and lane assist sensors (ADAS)",
      "Custom camber/toe optimization for spirited street or track use",
      "Before-and-after full-color chassis alignment vector printout",
    ],
  },
  {
    index: "06",
    title: "Mechanical Safety & Pre-Purchase Audits",
    subtitle: "120-point digital inspection with ultrasonic paint depth analysis",
    tooling: "DeFelsko PosiTector Paint Gauge · Autel OBD Forensic Suite · Olympus Scope",
    sla: "2.5 – 3.0 Hours",
    imageUrl:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80",
    details:
      "Never acquire a pre-owned European vehicle without verifiable telemetry. Our comprehensive pre-purchase audit scans body panels for non-factory filler, audits ECU logs for wiped fault codes, inspects cylinder bores for scoring, and delivers a transparent roadworthiness assessment.",
    points: [
      "Ultrasonic paint depth gauge verification across all metal panels",
      "ECU log check for mileage tampering and hidden past overheating",
      "Video evidence of oil leaks, suspension play, and exhaust soot",
      "Direct master mechanic phone consultation before purchase decision",
    ],
  },
];

export default function Page() {
  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Estimator Engine states
  const [platform, setPlatform] = useState<PlatformCategory>("euro");
  const [selectedScopeId, setSelectedScopeId] = useState("scope-minor");

  // Capabilities Matrix state
  const [expandedCapability, setExpandedCapability] = useState<string>("01");

  // Booking Form states
  const [bookName, setBookName] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [bookRego, setBookRego] = useState("");
  const [bookService, setBookService] = useState("Factory Minor Logbook Service");
  const [bookDate, setBookDate] = useState("");
  const [bookLoanCar, setBookLoanCar] = useState(false);
  const [bookNotes, setBookNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    reference: string;
    name: string;
    phone: string;
    vehicle: string;
    service: string;
    date: string;
    loanCar: boolean;
    bay: string;
    timestamp: string;
  } | null>(null);

  // Synchronize scroll listener for frosted navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute estimator pricing
  const currentScope = useMemo(
    () => SERVICE_SCOPES.find((s) => s.id === selectedScopeId) || SERVICE_SCOPES[0],
    [selectedScopeId]
  );

  const { priceRange, avgDealer, savingsValue, savingsPercent } = useMemo(() => {
    let rawRange: [number, number] = [0, 0];
    if (platform === "euro") rawRange = currentScope.euroPrice;
    else if (platform === "jap") rawRange = currentScope.japPrice;
    else rawRange = currentScope.suvPrice;

    const min = rawRange[0];
    const max = rawRange[1];
    const avgApex = (min + max) / 2;
    const estDealer = Math.round(avgApex * currentScope.dealerMultiplier);
    const savings = estDealer - avgApex;
    const percent = Math.round((savings / estDealer) * 100);

    return {
      priceRange: rawRange,
      avgDealer: estDealer,
      savingsValue: Math.round(savings),
      savingsPercent: percent,
    };
  }, [platform, currentScope]);

  // Handle locking in estimate to prefill booking
  const handleLockInEstimate = () => {
    setBookService(currentScope.name);
    const element = document.getElementById("reservation");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle booking submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName.trim() || !bookPhone.trim() || !bookRego.trim()) {
      alert("Please enter customer name, phone number, and vehicle registration / model.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const hex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
      const ref = `#APX-2026-${hex}`;
      const randomBay = ["BAY 01 (DIAGNOSTIC)", "BAY 02 (MECHANICAL)", "BAY 03 (HOIST)", "BAY 04 (PRECISION)"][
        Math.floor(Math.random() * 4)
      ];

      setBookingConfirmation({
        reference: ref,
        name: bookName,
        phone: bookPhone,
        vehicle: bookRego,
        service: bookService,
        date: bookDate || "Next Available Morning (07:30 AM)",
        loanCar: bookLoanCar,
        bay: randomBay,
        timestamp: "2026-10-15 07:30 AEST",
      });
      setIsSubmitting(false);

      const confirmElement = document.getElementById("reservation");
      if (confirmElement) {
        confirmElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-[#F6F6F6] font-sans selection:bg-[#0057CB] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. STANDARD AGENCY PORTFOLIO TOP BAR (Strictly Anonymized)                */}
      {/* ========================================================================= */}
      <aside
        aria-label="Portfolio Demonstration Notice"
        className="w-full bg-[#000000] border-b border-[#4C4C4C]/40 py-2 px-4 text-center text-[11px] uppercase tracking-wider text-[#F6F6F6]/80 flex flex-wrap items-center justify-center gap-2 relative z-50"
      >
        <span className="inline-flex items-center gap-1.5 font-mono text-[#8DD9E7]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8DD9E7]" />
          COMMERCIAL PROTOTYPE
        </span>
        <span className="hidden sm:inline text-[#4C4C4C]">|</span>
        <span className="font-medium text-[#F6F6F6]">
          AGENCY PORTFOLIO DEMONSTRATION | High-Conversion Commercial Prototype by{" "}
          <a
            href="https://ithelpers.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F6F6F6] hover:text-[#0082FF] underline decoration-[#0082FF]/40 underline-offset-2 transition-colors font-semibold"
          >
            I.T Helpers
          </a>
        </span>
        <span className="hidden md:inline text-[#4C4C4C]">|</span>
        <span className="hidden md:inline font-mono text-xs text-[#FFE372]">
          ZERO PERSONAL NAMES · BESPOKE ARCHITECTURE
        </span>
      </aside>

      {/* ========================================================================= */}
      {/* 2. FROSTED MISSION-CONTROL NAVBAR                                         */}
      {/* ========================================================================= */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          scrolled
            ? "bg-[#000000]/95 backdrop-blur-md border-[#4C4C4C]/60 shadow-lg"
            : "bg-[#000000]/90 backdrop-blur-md border-[#4C4C4C]/30"
        } px-4 sm:px-6 lg:px-8 py-3.5`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Mark */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-[4px] bg-[#000000] border border-[#4C4C4C] group-hover:border-[#0082FF] flex items-center justify-center transition-colors">
              <Gauge className="w-4 h-4 text-[#0082FF]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white uppercase">
                  APEX PRECISION
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B3F076] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B3F076]" />
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-wider text-[#8DD9E7]">
                BAY TELEMETRY ONLINE
              </span>
            </div>
          </a>

          {/* Technical Anchors (Desktop) */}
          <nav
            aria-label="Technical Navigation"
            className="hidden xl:flex items-center gap-6 text-xs font-mono tracking-wider text-[#F6F6F6]/75"
          >
            <a
              href="#telemetry"
              className="hover:text-[#0082FF] transition-colors py-1 hover:border-b hover:border-[#0082FF]"
            >
              [01 // TELEMETRY]
            </a>
            <a
              href="#services"
              className="hover:text-[#0082FF] transition-colors py-1 hover:border-b hover:border-[#0082FF]"
            >
              [02 // SERVICES]
            </a>
            <a
              href="#estimator"
              className="hover:text-[#0082FF] transition-colors py-1 hover:border-b hover:border-[#0082FF]"
            >
              [03 // ESTIMATOR]
            </a>
            <a
              href="#standards"
              className="hover:text-[#0082FF] transition-colors py-1 hover:border-b hover:border-[#0082FF]"
            >
              [04 // STANDARDS]
            </a>
            <a
              href="#reservation"
              className="hover:text-[#0082FF] transition-colors py-1 hover:border-b hover:border-[#0082FF]"
            >
              [05 // BAY RESERVATION]
            </a>
          </nav>

          {/* Right Direct Line & CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="tel:0289013400"
              className="hidden md:flex items-center gap-1.5 text-xs font-mono text-[#F6F6F6] hover:text-[#0082FF] transition-colors py-1 px-2.5 rounded-[4px] border border-[#4C4C4C]/40 hover:border-[#4C4C4C]"
            >
              <Phone className="w-3.5 h-3.5 text-[#0082FF]" />
              <span>(02) 8901 3400</span>
            </a>

            <a
              href="#reservation"
              className="bg-[#0057CB] hover:bg-[#0082FF] rounded-full px-4 sm:px-5 py-2 text-xs font-semibold tracking-wider text-white shadow-sm transition-all duration-150 inline-flex items-center gap-2 uppercase"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>[ RESERVE WORKSHOP BAY ]</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-[4px] border border-[#4C4C4C] hover:border-[#0082FF] text-[#F6F6F6]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-[#4C4C4C]/40 px-2 pb-2 flex flex-col gap-2 font-mono text-xs">
            <a
              href="#telemetry"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-[4px] hover:bg-[#111111] text-[#F6F6F6] flex items-center justify-between"
            >
              <span>[01 // TELEMETRY]</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#4C4C4C]" />
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-[4px] hover:bg-[#111111] text-[#F6F6F6] flex items-center justify-between"
            >
              <span>[02 // SERVICES]</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#4C4C4C]" />
            </a>
            <a
              href="#estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-[4px] hover:bg-[#111111] text-[#F6F6F6] flex items-center justify-between"
            >
              <span>[03 // ESTIMATOR]</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#4C4C4C]" />
            </a>
            <a
              href="#standards"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-[4px] hover:bg-[#111111] text-[#F6F6F6] flex items-center justify-between"
            >
              <span>[04 // STANDARDS]</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#4C4C4C]" />
            </a>
            <a
              href="#reservation"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-[4px] hover:bg-[#111111] text-[#F6F6F6] flex items-center justify-between"
            >
              <span>[05 // BAY RESERVATION]</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#4C4C4C]" />
            </a>
            <div className="pt-2 border-t border-[#4C4C4C]/30 flex flex-col gap-2">
              <a
                href="tel:0289013400"
                className="py-2 px-3 rounded-[4px] bg-[#111111] text-[#F6F6F6] flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#0082FF]" />
                <span>DIRECT LINE: (02) 8901 3400</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 3. ASYMMETRIC CINEMATIC HERO                                              */}
      {/* ========================================================================= */}
      <section className="relative w-full pt-8 pb-16 lg:pt-14 lg:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#4C4C4C]/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left 60% Editorial */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Pill Tag */}
              <div className="inline-flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#111111] border border-[#4C4C4C]/60 px-3.5 py-1 text-[11px] font-mono tracking-wider text-[#8DD9E7] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B3F076]" />
                  NSW MVRL58291 · ALEXANDRIA WORKSHOP · AUDI · BMW · MERCEDES · PORSCHE
                </span>
              </div>

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.12]">
                Dealer Diagnostic Capability.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F6F6F6] to-[#8DD9E7]">
                  Independent Workshop Integrity.
                </span>
              </h1>

              {/* Compact Editorial Paragraph */}
              <p className="text-sm sm:text-base text-[#F6F6F6]/80 leading-relaxed max-w-2xl">
                Statutory new car warranty 100% preserved under Australian Consumer Law
                (Section 54, Competition and Consumer Act 2010). Direct factory diagnostic software
                parity via ODIS 23, BMW ISTA+, and Mercedes-Benz XENTRY XDOS. Transparent itemized
                digital quoting with mandatory 4K video evidence before any mechanical intervention.
              </p>

              {/* Dual Action Group */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <a
                  href="#estimator"
                  className="bg-[#0057CB] hover:bg-[#0082FF] text-white rounded-full px-6 py-3 text-xs font-semibold tracking-wider transition-all duration-150 inline-flex items-center gap-2 uppercase shadow-lg shadow-[#0057CB]/20"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>[ OPEN INSTANT COST CALCULATOR ]</span>
                </a>

                <a
                  href="#standards"
                  className="border border-[#4C4C4C] hover:border-[#F6F6F6] text-[#F6F6F6] rounded-full px-6 py-3 text-xs font-semibold tracking-wider transition-all duration-150 inline-flex items-center gap-2 uppercase bg-[#000000]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8DD9E7]" />
                  <span>[ VIEW DIAGNOSTIC STANDARDS ]</span>
                </a>
              </div>

              {/* Telemetry Micro-Readouts */}
              <div className="pt-4 border-t border-[#4C4C4C]/40 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B3F076]" />
                  <span className="text-[#F6F6F6]/80">ZERO DEALER MARKUP</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8DD9E7]" />
                  <span className="text-[#F6F6F6]/80">100% OE / OEM COMPONENTS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFE372]" />
                  <span className="text-[#F6F6F6]/80">SAME-DAY EXPEDITED HANDOVER</span>
                </div>
              </div>
            </div>

            {/* Right 40% Technical Image HUD */}
            <div className="lg:col-span-5">
              <div className="relative rounded-[4px] border border-[#4C4C4C]/60 bg-[#000000] overflow-hidden shadow-2xl group">
                {/* Vehicle Studio Photography */}
                <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden bg-[#0A0A0A]">
                  <img
                    src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80"
                    alt="Precision European Vehicle on Workshop Diagnostic Lift"
                    className="w-full h-full object-cover object-center filter grayscale contrast-125 opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
                </div>

                {/* Live Telemetry HUD Overlays */}
                <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 pointer-events-none">
                  <div className="self-start rounded-full bg-[#000000]/85 backdrop-blur-md border border-[#B3F076]/50 px-3 py-1 text-[11px] font-mono tracking-wider text-[#B3F076] flex items-center gap-2 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B3F076] animate-pulse" />
                    PicoScope 4-Channel Telemetry: CALIBRATED
                  </div>
                  <div className="self-start rounded-full bg-[#000000]/85 backdrop-blur-md border border-[#8DD9E7]/50 px-3 py-1 text-[11px] font-mono tracking-wider text-[#8DD9E7] flex items-center gap-2 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8DD9E7]" />
                    OEM Parts Verification: 100% AUDITED
                  </div>
                </div>

                {/* Bottom HUD Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-[#000000]/90 backdrop-blur-md border-t border-[#4C4C4C]/50 p-3 flex items-center justify-between text-[11px] font-mono text-[#F6F6F6]/80">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-[#0082FF] animate-pulse" />
                    <span>ALEXANDRIA BAY 03 // LIVE</span>
                  </div>
                  <span className="text-[#B3F076]">CAN-BUS ACTIVE (500 kbps)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DIAGNOSTIC TELEMETRY & PARITY BAR                                     */}
      {/* ========================================================================= */}
      <section
        id="telemetry"
        className="w-full bg-[#000000] border-y border-[#4C4C4C]/40 py-5 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#4C4C4C]/40">
            {/* Col 1 */}
            <div className="py-3 md:py-0 md:px-5 first:pl-0 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B3F076]" />
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  STATUS: 100% STATUTORY WARRANTY PROTECTED
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#F6F6F6]/70">
                NSW Fair Trading & ACL Certified // Section 54 Preserved
              </p>
            </div>

            {/* Col 2 */}
            <div className="py-3 md:py-0 md:px-5 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8DD9E7]" />
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  SOFTWARE: ODIS 23 · ISTA+ · XENTRY XDOS
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#F6F6F6]/70">
                Full Factory Telemetry Handshake // Direct Cloud Portal Upload
              </p>
            </div>

            {/* Col 3 */}
            <div className="py-3 md:py-0 md:px-5 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFE372]" />
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  COMPONENTS: MAHLE · MANN · BREMBO · BILSTEIN
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#F6F6F6]/70">
                Direct Tier-1 OEM Sourcing // 24-Month / 20,000km Guarantee
              </p>
            </div>

            {/* Col 4 */}
            <div className="py-3 md:py-0 md:px-5 last:pr-0 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0082FF]" />
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  RATING: 4.98 / 5.0 RATING
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#F6F6F6]/70">
                Over 480+ Verified European Vehicle Mechanical Audits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE WORKSHOP COST & SAVINGS ENGINE                             */}
      {/* ========================================================================= */}
      <section
        id="estimator"
        className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#4C4C4C]/40 bg-[#050505]"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#4C4C4C]/40">
            <div className="flex flex-col gap-3">
              <span className="rounded-full self-start bg-[#111111] border border-[#0082FF]/40 text-[#8DD9E7] px-3.5 py-1 text-[11px] font-mono tracking-wider flex items-center gap-2">
                <Cpu className="w-3 h-3 text-[#0082FF]" />
                [ ESTIMATION ENGINE // ALGORITHM V4.2 ]
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
                Interactive Workshop Cost & Savings Engine
              </h2>
              <p className="text-sm text-[#F6F6F6]/75 max-w-2xl">
                Diagnostic parts & labor calibration based on factory standard times (FRU) and
                direct OEM component procurement. Compare Apex precision pricing against authorized
                dealership benchmarks.
              </p>
            </div>

            {/* Platform Switcher Pills */}
            <div className="flex flex-wrap items-center gap-2 bg-[#000000] p-1.5 rounded-full border border-[#4C4C4C]">
              <button
                type="button"
                onClick={() => setPlatform("euro")}
                className={`rounded-full px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all duration-150 ${
                  platform === "euro"
                    ? "bg-[#0057CB] text-white shadow-sm font-bold"
                    : "text-[#F6F6F6]/70 hover:text-white"
                }`}
              >
                [ EUROPEAN SPECIALIST ]
              </button>
              <button
                type="button"
                onClick={() => setPlatform("jap")}
                className={`rounded-full px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all duration-150 ${
                  platform === "jap"
                    ? "bg-[#0057CB] text-white shadow-sm font-bold"
                    : "text-[#F6F6F6]/70 hover:text-white"
                }`}
              >
                [ JAPANESE PERFORMANCE ]
              </button>
              <button
                type="button"
                onClick={() => setPlatform("suv")}
                className={`rounded-full px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all duration-150 ${
                  platform === "suv"
                    ? "bg-[#0057CB] text-white shadow-sm font-bold"
                    : "text-[#F6F6F6]/70 hover:text-white"
                }`}
              >
                [ COMMERCIAL 4WD & SUV ]
              </button>
            </div>
          </div>

          {/* Engine Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Scope Selection Buttons (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8DD9E7] pb-1">
                SELECT DIAGNOSTIC & SERVICE SCOPE:
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {SERVICE_SCOPES.map((scope) => {
                  const isSelected = scope.id === selectedScopeId;
                  let scopePrice: [number, number] = scope.euroPrice;
                  if (platform === "jap") scopePrice = scope.japPrice;
                  else if (platform === "suv") scopePrice = scope.suvPrice;

                  return (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setSelectedScopeId(scope.id)}
                      className={`text-left rounded-[4px] p-4 transition-all duration-150 border ${
                        isSelected
                          ? "bg-[#000000] border-[#0082FF] shadow-md ring-1 ring-[#0082FF]/40"
                          : "bg-[#0A0A0A] border-[#4C4C4C]/40 hover:border-[#4C4C4C] hover:bg-[#111111]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-[#0082FF] bg-[#0057CB]"
                                : "border-[#4C4C4C] bg-transparent"
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white block">
                              {scope.name}
                            </span>
                            <span className="font-mono text-[10px] text-[#8DD9E7] block">
                              {scope.tag}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-white block">
                            ${scopePrice[0]} – ${scopePrice[1]}
                          </span>
                          <span className="font-mono text-[10px] text-[#FFE372] block">
                            {scope.turnaround.split("(")[0]}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Calculation Readout Terminal (Right 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="rounded-[4px] bg-[#000000] border border-[#4C4C4C] p-6 flex flex-col gap-6 shadow-xl relative overflow-hidden">
                {/* Header status */}
                <div className="flex items-center justify-between border-b border-[#4C4C4C]/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B3F076]" />
                    <span className="font-mono text-xs uppercase tracking-wider text-white">
                      CALCULATED TELEMETRY READOUT
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#8DD9E7]">
                    SLA: {currentScope.turnaround}
                  </span>
                </div>

                {/* Primary Investment Numbers */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-mono uppercase text-[#F6F6F6]/70">
                    Apex Estimated Investment
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-mono">
                      ${priceRange[0]} – ${priceRange[1]}
                    </span>
                    <span className="text-xs font-mono text-[#8DD9E7]">INC GST</span>
                  </div>
                </div>

                {/* Benchmark & Direct Savings */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#4C4C4C]/40 font-mono">
                  <div className="rounded-[4px] bg-[#0A0A0A] border border-[#4C4C4C]/40 p-3 flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-[#F6F6F6]/60">
                      Dealer Benchmark
                    </span>
                    <span className="text-base font-bold text-[#F6F6F6]/75 line-through">
                      ${avgDealer}
                    </span>
                    <span className="text-[10px] text-[#FFE372]">Direct Franchise Quote</span>
                  </div>

                  <div className="rounded-[4px] bg-[#0A0A0A] border border-[#B3F076]/40 p-3 flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-[#B3F076]">
                      Your Direct Savings
                    </span>
                    <span className="text-base font-bold text-[#B3F076]">
                      -${savingsValue} ({savingsPercent}%)
                    </span>
                    <span className="text-[10px] text-[#8DD9E7]">Preserves Full Warranty</span>
                  </div>
                </div>

                {/* Itemized Dynamic Checklist */}
                <div className="flex flex-col gap-2.5 pt-2 border-t border-[#4C4C4C]/40">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#8DD9E7]">
                    ITEMIZED SCOPE SPECIFICATION:
                  </span>
                  <ul className="flex flex-col gap-2 text-xs text-[#F6F6F6]/85">
                    {currentScope.includedItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#B3F076] mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Trigger */}
                <div className="pt-3 border-t border-[#4C4C4C]/40 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleLockInEstimate}
                    className="w-full bg-[#0057CB] hover:bg-[#0082FF] text-white rounded-[4px] py-3.5 px-5 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-150 shadow-md"
                  >
                    <span>Lock In This Estimate & Pre-fill Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-center font-mono text-[#F6F6F6]/60">
                    Pre-fills reservation terminal below · No deposit required upfront
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CAPABILITIES & ENGINEERING MATRIX (Technical Table / Accordion)        */}
      {/* ========================================================================= */}
      <section
        id="services"
        className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#4C4C4C]/40 bg-[#000000]"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <span className="rounded-full self-start bg-[#111111] border border-[#4C4C4C] text-[#8DD9E7] px-3.5 py-1 text-[11px] font-mono tracking-wider flex items-center gap-2">
              <Wrench className="w-3 h-3 text-[#0082FF]" />
              [ WORKSHOP MATRIX // 6 CAPABILITY DOMAINS ]
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
              Capabilities & Engineering Matrix
            </h2>
            <p className="text-sm text-[#F6F6F6]/75 max-w-2xl">
              Engineered service protocols exceeding factory dealer criteria. Every vehicle undergo
              digital oscilloscope fault tracing, micrometer rotor runout indexing, and factory portal
              logging.
            </p>
          </div>

          {/* Technical Interactive Table */}
          <div className="rounded-[4px] border border-[#4C4C4C] bg-[#050505] overflow-hidden divide-y divide-[#4C4C4C]/40 shadow-xl">
            {CAPABILITIES_DATA.map((cap) => {
              const isExpanded = expandedCapability === cap.index;

              return (
                <div key={cap.index} className="flex flex-col transition-colors">
                  {/* Table Row Trigger */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCapability(isExpanded ? "" : cap.index)
                    }
                    className={`w-full p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left hover:bg-[#0E0E0E] transition-colors ${
                      isExpanded ? "bg-[#0E0E0E]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span className="font-mono text-sm font-bold text-[#8DD9E7] w-8">
                        {cap.index}
                      </span>
                      <div>
                        <span className="text-base font-semibold text-white block">
                          {cap.title}
                        </span>
                        <span className="text-xs text-[#F6F6F6]/70 hidden sm:block">
                          {cap.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 font-mono text-xs">
                      <div className="hidden lg:flex flex-col text-right">
                        <span className="text-[10px] text-[#F6F6F6]/50">FACTORY TOOLING</span>
                        <span className="text-[#F6F6F6]/90">{cap.tooling}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-[#F6F6F6]/50">EST. WINDOW</span>
                        <span className="text-[#FFE372]">{cap.sla}</span>
                      </div>
                      <div className="w-8 h-8 rounded-[4px] border border-[#4C4C4C] flex items-center justify-center text-white">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#0082FF]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#4C4C4C]" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Technical Drawer */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 bg-[#000000] border-t border-[#4C4C4C]/40 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* Left: Capability Image with contrast overlay */}
                      <div className="lg:col-span-5 rounded-[4px] overflow-hidden border border-[#4C4C4C]/60 h-64 sm:h-72 relative">
                        <img
                          src={cap.imageUrl}
                          alt={cap.title}
                          className="w-full h-full object-cover filter grayscale contrast-125"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
                          <span className="bg-[#000000]/90 border border-[#4C4C4C] text-[#8DD9E7] px-2.5 py-0.5 rounded-[4px]">
                            {cap.tooling.split("·")[0]}
                          </span>
                          <span className="text-[#B3F076]">VERIFIED PROTOCOL</span>
                        </div>
                      </div>

                      {/* Right: Technical Protocol Specs */}
                      <div className="lg:col-span-7 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-xs uppercase text-[#8DD9E7]">
                            ENGINEERING STANDARD SPECIFICATION:
                          </span>
                          <p className="text-sm text-[#F6F6F6]/85 leading-relaxed">
                            {cap.details}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#4C4C4C]/40">
                          {cap.points.map((pt, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-2 text-xs text-[#F6F6F6]/80">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#B3F076] mt-0.5 flex-shrink-0" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 flex items-center justify-between flex-wrap gap-3">
                          <span className="font-mono text-xs text-[#FFE372]">
                            STATUTORY WARRANTY MAINTAINED UNDER ACL SECTION 54
                          </span>
                          <a
                            href="#reservation"
                            className="bg-[#0057CB] hover:bg-[#0082FF] text-white rounded-[4px] px-4 py-2 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                          >
                            <span>Book Bay For This Service</span>
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

      {/* ========================================================================= */}
      {/* 7. THE APEX STANDARDS (Photo-Editorial Split)                             */}
      {/* ========================================================================= */}
      <section
        id="standards"
        className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#4C4C4C]/40 bg-[#050505]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Master Technician Editorial Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-[4px] border border-[#4C4C4C]/60 bg-[#000000] overflow-hidden shadow-2xl">
                <div className="relative h-[420px] sm:h-[480px] w-full">
                  <img
                    src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"
                    alt="Master European Diagnostic Specialist at Apex Precision"
                    className="w-full h-full object-cover object-center filter grayscale contrast-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-80" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-[#000000]/90 backdrop-blur-md border border-[#4C4C4C] p-3 rounded-[4px] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B3F076]" />
                    <span className="text-white">LICENSED MASTER SPECIALISTS</span>
                  </div>
                  <span className="text-[#8DD9E7]">IAME CERTIFIED</span>
                </div>
              </div>
            </div>

            {/* Right: 3 Core Engineering Rules */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="rounded-full self-start bg-[#111111] border border-[#4C4C4C] text-[#8DD9E7] px-3.5 py-1 text-[11px] font-mono tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-[#0082FF]" />
                  [ WORKSHOP CODE // 3 PILLARS ]
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
                  The Apex Engineering Standards
                </h2>
                <p className="text-sm text-[#F6F6F6]/75">
                  We built our workshop to eliminate the deceptive practices that plague franchised
                  car dealerships. Three non-negotiable operational laws govern every bay.
                </p>
              </div>

              {/* 3 Core Rules */}
              <div className="flex flex-col gap-4 font-sans">
                {/* Rule 01 */}
                <div className="rounded-[4px] border border-[#4C4C4C]/60 bg-[#000000] p-5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#8DD9E7]">
                      01 // VIDEO QUOTATION MANDATE
                    </span>
                    <span className="font-mono text-[10px] text-[#B3F076]">100% TRANSPARENCY</span>
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    Mandatory 4K Video Evidence Before Repairs
                  </h3>
                  <p className="text-xs text-[#F6F6F6]/75 leading-relaxed">
                    No repairs proceed without video evidence. Our technicians record the exact worn
                    bushing, weeping seal, or scored rotor with micrometer measurements and voice
                    explanation, sent directly to your phone. Zero unauthorized bolt-turning.
                  </p>
                </div>

                {/* Rule 02 */}
                <div className="rounded-[4px] border border-[#4C4C4C]/60 bg-[#000000] p-5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#8DD9E7]">
                      02 // ZERO UNSUPERVISED APPRENTICES
                    </span>
                    <span className="font-mono text-[10px] text-[#FFE372]">SENIOR TECHS ONLY</span>
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    Master Technician Engine Bay Handshake
                  </h3>
                  <p className="text-xs text-[#F6F6F6]/75 leading-relaxed">
                    Dealerships regularly bill master-mechanic labor rates while assigning junior
                    trainees to your vehicle. At Apex, only fully licensed senior master technicians
                    with a minimum 8 years European diagnostic experience touch your engine bay.
                  </p>
                </div>

                {/* Rule 03 */}
                <div className="rounded-[4px] border border-[#4C4C4C]/60 bg-[#000000] p-5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#8DD9E7]">
                      03 // DIRECT DIGITAL SERVICE BOOK STAMPING
                    </span>
                    <span className="font-mono text-[10px] text-[#0082FF]">FACTORY PORTALS</span>
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    Direct Cloud Telemetry to Factory Portals
                  </h3>
                  <p className="text-xs text-[#F6F6F6]/75 leading-relaxed">
                    We maintain authenticated portal access to Audi GeKo, BMW KaSIO, Mercedes-Benz
                    Digital Service Booklet (DSB), and Porsche PIWIS. Your electronic service history
                    remains unbroken, preserving full factory provenance and maximum vehicle resale value.
                  </p>
                </div>
              </div>

              {/* Statutory Guarantee Badge */}
              <div className="p-4 rounded-[4px] bg-[#000000] border border-[#B3F076]/40 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#B3F076] flex-shrink-0" />
                <p className="text-xs font-mono text-[#F6F6F6]/90">
                  <span className="text-[#B3F076] font-bold">STATUTORY ACL CITATION:</span> The
                  Australian Consumer Law Section 54 explicitly protects consumer choice of repairer.
                  Factory warranties remain 100% enforceable across all makes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. INTERACTIVE BAY RESERVATION TERMINAL                                    */}
      {/* ========================================================================= */}
      <section
        id="reservation"
        className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#4C4C4C]/40 bg-[#000000]"
      >
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2 text-center items-center">
            <span className="rounded-full bg-[#111111] border border-[#0082FF]/40 text-[#8DD9E7] px-3.5 py-1 text-[11px] font-mono tracking-wider flex items-center gap-2">
              <Calendar className="w-3 h-3 text-[#0082FF]" />
              [ RESERVATION TERMINAL // ALEXANDRIA WORKSHOP ]
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
              Reserve Your Workshop Bay
            </h2>
            <p className="text-sm text-[#F6F6F6]/75 max-w-xl">
              Lock in your diagnostic or mechanical bay slot. Pre-fill your registration and service
              scope for expedited morning intake.
            </p>
          </div>

          {/* Terminal Console Card */}
          <div className="rounded-[4px] border border-[#4C4C4C] bg-[#0A0A0A] p-6 sm:p-8 shadow-2xl relative">
            {/* Terminal Status Header */}
            <div className="flex items-center justify-between border-b border-[#4C4C4C]/40 pb-4 mb-6 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B3F076] animate-pulse" />
                <span className="text-white font-bold">TERMINAL ID: APX-ALX-01</span>
              </div>
              <span className="text-[#8DD9E7]">DISPATCH STATUS: ACTIVE</span>
            </div>

            {/* Confirmation Voucher Mode */}
            {bookingConfirmation ? (
              <div className="flex flex-col gap-6 py-4 animate-in fade-in duration-300">
                <div className="rounded-[4px] bg-[#000000] border-2 border-[#B3F076]/80 p-6 flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#4C4C4C]/40 pb-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-[#B3F076] font-bold">
                        BAY RESERVATION CONFIRMED
                      </span>
                      <span className="text-2xl font-mono font-bold text-white tracking-wider">
                        {bookingConfirmation.reference}
                      </span>
                    </div>
                    <div className="rounded-[4px] bg-[#111111] border border-[#4C4C4C] px-3 py-1.5 self-start sm:self-auto font-mono text-xs text-[#8DD9E7]">
                      {bookingConfirmation.bay}
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-[#F6F6F6]/50 uppercase">CLIENT NAME:</span>
                      <span className="text-white font-semibold">{bookingConfirmation.name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#F6F6F6]/50 uppercase">CONTACT MOBILE:</span>
                      <span className="text-white font-semibold">{bookingConfirmation.phone}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#F6F6F6]/50 uppercase">VEHICLE DETAILS:</span>
                      <span className="text-[#8DD9E7] font-semibold">
                        {bookingConfirmation.vehicle}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#F6F6F6]/50 uppercase">SERVICE SCOPE:</span>
                      <span className="text-white font-semibold">{bookingConfirmation.service}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#F6F6F6]/50 uppercase">REQUESTED DATE:</span>
                      <span className="text-[#FFE372] font-semibold">{bookingConfirmation.date}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#F6F6F6]/50 uppercase">COMPLIMENTARY LOAN CAR:</span>
                      <span
                        className={
                          bookingConfirmation.loanCar ? "text-[#B3F076] font-semibold" : "text-[#F6F6F6]/60"
                        }
                      >
                        {bookingConfirmation.loanCar
                          ? "ALLOCATED (EUROPEAN LOAN FLEET)"
                          : "NOT REQUESTED"}
                      </span>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-3.5 rounded-[4px] bg-[#0A0A0A] border border-[#4C4C4C]/40 text-xs text-[#F6F6F6]/80 flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] text-[#8DD9E7] font-bold uppercase">
                      INTAKE PROTOCOL INSTRUCTIONS:
                    </span>
                    <p>
                      Please arrive at <strong>42 Collins Street, Alexandria NSW 2015</strong> between{" "}
                      <strong>07:30 AM and 09:00 AM</strong> on your selected day. For outside-hours
                      arrivals, deposit your keys in the digital lock safe located at Bay 01 using code{" "}
                      <strong>APX-KEY</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingConfirmation(null)}
                    className="rounded-[4px] border border-[#4C4C4C] hover:border-white px-4 py-2.5 text-xs font-mono uppercase text-[#F6F6F6] inline-flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Create Another Intake</span>
                  </button>

                  <a
                    href="tel:0289013400"
                    className="bg-[#0057CB] hover:bg-[#0082FF] rounded-[4px] px-5 py-2.5 text-xs font-semibold uppercase text-white inline-flex items-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Workshop Dispatch</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Interactive Form Terminal */
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs uppercase text-[#F6F6F6]/80">
                      Customer Full Name <span className="text-[#0082FF]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      className="rounded-[4px] bg-[#000000] border border-[#4C4C4C] text-[#F6F6F6] focus:border-[#0082FF] focus:outline-none px-4 py-2.5 text-sm font-sans"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs uppercase text-[#F6F6F6]/80">
                      Mobile Phone (SMS Video Updates) <span className="text-[#0082FF]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0412 345 678"
                      value={bookPhone}
                      onChange={(e) => setBookPhone(e.target.value)}
                      className="rounded-[4px] bg-[#000000] border border-[#4C4C4C] text-[#F6F6F6] focus:border-[#0082FF] focus:outline-none px-4 py-2.5 text-sm font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Rego / Make & Model */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs uppercase text-[#F6F6F6]/80">
                      Rego / Make & Model <span className="text-[#0082FF]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NSW BZF82E · 2022 BMW M340i"
                      value={bookRego}
                      onChange={(e) => setBookRego(e.target.value)}
                      className="rounded-[4px] bg-[#000000] border border-[#4C4C4C] text-[#F6F6F6] focus:border-[#0082FF] focus:outline-none px-4 py-2.5 text-sm font-sans"
                    />
                  </div>

                  {/* Service Scope Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs uppercase text-[#F6F6F6]/80">
                      Service Scope
                    </label>
                    <select
                      value={bookService}
                      onChange={(e) => setBookService(e.target.value)}
                      className="rounded-[4px] bg-[#000000] border border-[#4C4C4C] text-[#F6F6F6] focus:border-[#0082FF] focus:outline-none px-4 py-2.5 text-sm font-sans"
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
                  {/* Preferred Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs uppercase text-[#F6F6F6]/80">
                      Preferred Bay Date
                    </label>
                    <input
                      type="date"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="rounded-[4px] bg-[#000000] border border-[#4C4C4C] text-[#F6F6F6] focus:border-[#0082FF] focus:outline-none px-4 py-2.5 text-sm font-sans"
                    />
                  </div>

                  {/* Loan Car Toggle */}
                  <div className="flex flex-col gap-1.5 justify-end">
                    <label className="flex items-center gap-3 p-2.5 rounded-[4px] border border-[#4C4C4C] bg-[#000000] cursor-pointer hover:border-[#0082FF] transition-colors">
                      <input
                        type="checkbox"
                        checked={bookLoanCar}
                        onChange={(e) => setBookLoanCar(e.target.checked)}
                        className="rounded-[2px] w-4 h-4 text-[#0057CB] focus:ring-0 bg-[#111111] border-[#4C4C4C]"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">
                          Require European Loan Vehicle?
                        </span>
                        <span className="text-[10px] font-mono text-[#8DD9E7]">
                          Complimentary subject to availability
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Technical Notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs uppercase text-[#F6F6F6]/80">
                    Technical Notes / Specific Fault Symptoms
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe any diagnostic warning lights, noises, vibration speeds, or past maintenance history..."
                    value={bookNotes}
                    onChange={(e) => setBookNotes(e.target.value)}
                    className="rounded-[4px] bg-[#000000] border border-[#4C4C4C] text-[#F6F6F6] focus:border-[#0082FF] focus:outline-none px-4 py-2 text-sm font-sans"
                  />
                </div>

                {/* Submit Trigger */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0057CB] hover:bg-[#0082FF] disabled:bg-[#4C4C4C] text-white rounded-[4px] py-3.5 px-6 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    {isSubmitting ? (
                      <span className="font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        TRANSMITTING TELEMETRY TO BAY DISPATCH...
                      </span>
                    ) : (
                      <>
                        <span>Submit Workshop Bay Reservation</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <span className="block text-center text-[10px] font-mono text-[#F6F6F6]/60 pt-2">
                    Instant confirmation voucher issued · Zero card details required upfront
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. ALEXANDRIA WORKSHOP HUB & TELEMETRY FOOTER                             */}
      {/* ========================================================================= */}
      <footer className="w-full bg-[#000000] border-t border-[#4C4C4C]/40 pt-16 pb-24 md:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {/* Upper Hub Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
            {/* Alexandria Location Col (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-[4px] bg-[#000000] border border-[#4C4C4C] flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-[#0082FF]" />
                </div>
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  ALEXANDRIA WORKSHOP FACILITY
                </span>
              </div>
              <p className="text-sm font-semibold text-white">
                42 Collins Street, Alexandria NSW 2015
              </p>
              <p className="text-xs text-[#F6F6F6]/75 leading-relaxed">
                Centrally positioned in Sydney’s inner-south European automotive precinct. 650m walk
                from Green Square Railway Station with rapid transit to Sydney CBD.
              </p>

              <div className="pt-2 flex flex-col gap-1.5 font-mono text-xs text-[#8DD9E7]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#0082FF]" />
                  <span>Workshop Phone: (02) 8901 3400</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#0082FF]" />
                  <span>Email: dispatch@apexprecision.com.au</span>
                </div>
              </div>
            </div>

            {/* Operating Hours (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFE372]" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  OPERATING HOURS & LOGISTICS
                </span>
              </div>

              <div className="rounded-[4px] bg-[#0A0A0A] border border-[#4C4C4C]/40 p-3.5 flex flex-col gap-2 font-mono text-xs">
                <div className="flex justify-between text-[#F6F6F6]">
                  <span>Monday – Friday:</span>
                  <span className="text-[#8DD9E7]">07:30 AM – 05:30 PM</span>
                </div>
                <div className="flex justify-between text-[#F6F6F6]">
                  <span>Saturday:</span>
                  <span className="text-[#FFE372]">By Diagnostic Appt</span>
                </div>
                <div className="flex justify-between text-[#F6F6F6]/60">
                  <span>Sunday:</span>
                  <span>Closed (Key Safe Active)</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-[#F6F6F6]/80">
                <Key className="w-4 h-4 text-[#B3F076] mt-0.5 flex-shrink-0" />
                <span>
                  <strong>24/7 Digital Key Safe:</strong> After-hours vehicle drop-off and pickup
                  available using secure PIN locker telemetry.
                </span>
              </div>
            </div>

            {/* Quick Diagnostic Anchors (3 Cols) */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                TECHNICAL PROTOCOLS
              </span>
              <ul className="flex flex-col gap-2 font-mono text-xs text-[#F6F6F6]/75">
                <li>
                  <a href="#telemetry" className="hover:text-[#0082FF] transition-colors">
                    // Telemetry & Parity Bar
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#0082FF] transition-colors">
                    // Capabilities Matrix
                  </a>
                </li>
                <li>
                  <a href="#estimator" className="hover:text-[#0082FF] transition-colors">
                    // Cost & Savings Engine
                  </a>
                </li>
                <li>
                  <a href="#standards" className="hover:text-[#0082FF] transition-colors">
                    // 3 Engineering Rules
                  </a>
                </li>
                <li>
                  <a href="#reservation" className="hover:text-[#0082FF] transition-colors">
                    // Bay Reservation Terminal
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Lower Compliance & Copyright */}
          <div className="pt-8 border-t border-[#4C4C4C]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#F6F6F6]/60">
            <div className="flex flex-wrap items-center gap-3">
              <span>NSW MVRL: 58291</span>
              <span>·</span>
              <span>IAME CERTIFIED</span>
              <span>·</span>
              <span className="text-[#B3F076]">ACL SECTION 54 GUARANTEED</span>
            </div>

            <div className="flex items-center gap-2">
              <span>© 2026 Apex Precision Mechanical Engineering.</span>
              <span>All Rights Reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* FIXED MOBILE STICKY BAR (< 768px)                                         */}
      {/* ========================================================================= */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#000000]/95 backdrop-blur-md border-t border-[#4C4C4C]/50 p-3 flex items-center gap-3 shadow-2xl">
        <a
          href="tel:0289013400"
          className="border border-[#4C4C4C] hover:border-white text-[#F6F6F6] rounded-full text-xs font-mono font-semibold py-2.5 px-4 flex-1 flex items-center justify-center gap-1.5 transition-colors uppercase bg-[#000000]"
        >
          <Phone className="w-3.5 h-3.5 text-[#0082FF]" />
          <span>[ CALL WORKSHOP ]</span>
        </a>
        <a
          href="#reservation"
          className="bg-[#0057CB] hover:bg-[#0082FF] text-white rounded-full text-xs font-mono font-semibold py-2.5 px-4 flex-1 flex items-center justify-center gap-1.5 transition-colors uppercase shadow-md"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>[ BOOK ONLINE ]</span>
        </a>
      </div>
    </div>
  );
}
