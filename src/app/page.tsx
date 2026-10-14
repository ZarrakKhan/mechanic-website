"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Wrench,
  ShieldCheck,
  Calendar,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  Gauge,
  Cpu,
  ExternalLink,
  ArrowRight,
  Key,
  Check,
  Menu,
  X,
  Activity,
} from "lucide-react";

// Platform Categories
type PlatformCategory = "euro" | "jap" | "perf";

interface PlatformOption {
  id: PlatformCategory;
  name: string;
  subLabel: string;
  badge: string;
}

const PLATFORMS: PlatformOption[] = [
  {
    id: "euro",
    name: "European Specialist",
    subLabel: "BMW · VAG (Audi/VW) · Mercedes-Benz · Porsche",
    badge: "ODIS / ISTA / XENTRY",
  },
  {
    id: "jap",
    name: "Japanese Precision",
    subLabel: "Toyota GR · Lexus F · Subaru STI · Nissan GT-R",
    badge: "Techstream / G-Scan",
  },
  {
    id: "perf",
    name: "AWD & Performance Commercial",
    subLabel: "Audi Quattro · Ford Ranger Raptor · Hilux GR · AMG 4MATIC",
    badge: "Heavy Duty & Dyno Spec",
  },
];

interface ServiceScopeItem {
  id: string;
  name: string;
  scopeTag: string;
  duration: string;
  turnaroundBadge: string;
  euroCost: number;
  euroDealerBenchmark: number;
  japCost: number;
  japDealerBenchmark: number;
  perfCost: number;
  perfDealerBenchmark: number;
  summary: string;
  technicalInclusions: string[];
  imageUrl: string;
  telemetryMetric: string;
}

const SERVICE_SCOPES: ServiceScopeItem[] = [
  {
    id: "minor-logbook",
    name: "Manufacturer Logbook Servicing",
    scopeTag: "Statutory Warranty Safe",
    duration: "2.0 – 2.5 Hours",
    turnaroundBadge: "Same-Day Handover (2.5h)",
    euroCost: 425,
    euroDealerBenchmark: 640,
    japCost: 315,
    japDealerBenchmark: 480,
    perfCost: 385,
    perfDealerBenchmark: 580,
    summary:
      "Strict manufacturer schedule execution adhering to OEM specifications. Genuine Mahle/Mann filtration with factory diagnostic oil service reset.",
    technicalInclusions: [
      "OEM synthetic engine lubricant meeting OEM manufacturer spec (Castrol Edge / Liqui Moly)",
      "Genuine Mann / Mahle micro-particle oil filter replacement",
      "62-point digital chassis, suspension, steering & brake safety telemetry audit",
      "Factory diagnostic service interval reset via ODIS / ISTA / XENTRY port",
      "Full statutory new car warranty preservation under Australian Consumer Law (ACL)",
      "Digital logbook authentication record and physical service ledger stamped",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
    telemetryMetric: "100% ACL Statutory Protection",
  },
  {
    id: "major-comprehensive",
    name: "Major Comprehensive Service & Overhaul",
    scopeTag: "Deep Powertrain Maintenance",
    duration: "4.0 – 5.0 Hours",
    turnaroundBadge: "Full-Day Precision (4.5h)",
    euroCost: 785,
    euroDealerBenchmark: 1250,
    japCost: 560,
    japDealerBenchmark: 890,
    perfCost: 670,
    perfDealerBenchmark: 1080,
    summary:
      "Complete engine induction, spark ignition, fuel delivery, and fluid hygiene overhaul engineered for high-output thermal reliability.",
    technicalInclusions: [
      "OEM synthetic engine lubricant flush and renewal with high-flow filtration",
      "High-efficiency engine intake air filter & activated charcoal cabin microfilter replacement",
      "OEM iridium long-life spark plugs or high-pressure diesel fuel filter replacement",
      "Hydraulic brake fluid hygroscopic boil analysis & DOT 4/5.1 pressure bleeder flush",
      "Deep ECU diagnostic interrogation, sensor adaptation reset, and battery conductance scan",
      "Comprehensive cooling system pressure test and auxiliary drive belt inspection",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80",
    telemetryMetric: "Dyno & Thermal Parity",
  },
  {
    id: "performance-braking",
    name: "Performance Brake Systems & Rotors",
    scopeTag: "Braking Precision",
    duration: "2.0 – 3.0 Hours",
    turnaroundBadge: "Precision Overhaul (2.5h)",
    euroCost: 520,
    euroDealerBenchmark: 860,
    japCost: 400,
    japDealerBenchmark: 640,
    perfCost: 455,
    perfDealerBenchmark: 730,
    summary:
      "Micrometer rotor runout verification, Brembo/Textar OEM friction compounds, caliper slider ultrasonic degrease, and high-temp pressure bleed.",
    technicalInclusions: [
      "Brembo, Textar, or Pagid low-dust compound performance brake pads",
      "Digital micrometer rotor runout & parallel thickness variation check (<0.02mm tolerance)",
      "Caliper guide pins degreased and lubricated with synthetic ceramic paste",
      "Full closed-loop DOT 4 / 5.1 high-temperature brake fluid hydraulic flush",
      "Controlled dynamic road bedding-in protocol to seat friction boundary layers",
      "Electronic parking brake (EPB) service mode reset and calibration via scan tool",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=800&q=80",
    telemetryMetric: "Runout <0.02mm Spec",
  },
  {
    id: "canbus-diagnostics",
    name: "CAN-Bus Deep Diagnostic Telemetry",
    scopeTag: "Telemetry & Electrical Trace",
    duration: "1.0 – 1.5 Hours",
    turnaroundBadge: "Rapid Diagnostic (1.5h)",
    euroCost: 255,
    euroDealerBenchmark: 420,
    japCost: 210,
    japDealerBenchmark: 340,
    perfCost: 225,
    perfDealerBenchmark: 370,
    summary:
      "PicoScope 4-channel digital oscilloscope telemetry, factory software interrogation (ODIS, ISTA, XENTRY), and intermittent circuit tracing.",
    technicalInclusions: [
      "PicoScope 4-channel digital oscilloscope live sensor wave capture and analysis",
      "OEM factory diagnostic software session (ODIS, ISTA, XENTRY, Techstream)",
      "Intermittent DTC freeze-frame data extraction and historical fault correlation",
      "CAN-Bus high/low network communication resistance and ground-loop verification",
      "Actuator bi-directional functional testing (wastegates, VVT solenoids, EVAP purge)",
      "Itemized diagnostic report with identified root cause and transparent remedy pathway",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    telemetryMetric: "PicoScope 4-Ch Waveform",
  },
  {
    id: "transmission-dsg",
    name: "Transmission & DSG / ZF Fluid Renewal",
    scopeTag: "Driveline & Mechatronics",
    duration: "2.5 – 3.5 Hours",
    turnaroundBadge: "Specialist Service (3h)",
    euroCost: 620,
    euroDealerBenchmark: 990,
    japCost: 440,
    japDealerBenchmark: 710,
    perfCost: 535,
    perfDealerBenchmark: 840,
    summary:
      "ZF Lifeguard 6/8/9 and OEM dual-clutch fluid flush, internal pan filter replacement, mechatronic adaptation relearn, and differential inspection.",
    technicalInclusions: [
      "Genuine ZF Lifeguard or OEM specification dual-clutch transmission synthetic fluid renewal",
      "Internal transmission sump filter and integrated magnet pan gasket replacement",
      "Factory scan-tool mechatronic valve body clutch engagement adaptation reset",
      "Thermal level leveling calibrated within strict 35°C – 45°C live diagnostic window",
      "Front and rear hypoid gear differential fluid condition analysis and top-up",
      "Controlled driveline load test verifying seamless shift line pressure and torque handoff",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
    telemetryMetric: "ZF & DSG Clutch Adaptation",
  },
  {
    id: "prepurchase-audit",
    name: "120-Point Pre-Purchase Mechanical Audit",
    scopeTag: "Due Diligence Dossier",
    duration: "2.0 – 2.5 Hours",
    turnaroundBadge: "Comprehensive Audit (2h)",
    euroCost: 350,
    euroDealerBenchmark: 560,
    japCost: 290,
    japDealerBenchmark: 450,
    perfCost: 320,
    perfDealerBenchmark: 510,
    summary:
      "Digital paint thickness depth gauge assessment, complete OBD historic freeze-frame telemetry report, borescope cylinder inspection, and road test.",
    technicalInclusions: [
      "Ultrasonic digital paint gauge coating measurement across 28 body points (accident repair check)",
      "Full ECU diagnostic interrogation documenting historic over-revs and clearing patterns",
      "Endoscopic borescope cylinder wall and timing chain elongation tensioner inspection",
      "Chassis subframe, ball joint, damper seal, and steering rack kinematic check",
      "High-speed dynamic road test analyzing NVH, driveline shunt, and boost linearity",
      "Comprehensive multi-page digital PDF report featuring high-resolution photographic evidence",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    telemetryMetric: "28-Point Paint Depth Scan",
  },
];

interface BookingSubmission {
  referenceId: string;
  name: string;
  phone: string;
  vehicle: string;
  serviceId: string;
  date: string;
  courtesyCar: boolean;
  notes: string;
}

export default function ApexMechanicalPage() {
  // Navigation & UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estimator States
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformCategory>("euro");
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    "minor-logbook"
  );

  // Booking Intake States
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingVehicle, setBookingVehicle] = useState("");
  const [bookingService, setBookingService] = useState("minor-logbook");
  const [bookingDate, setBookingDate] = useState("");
  const [courtesyCar, setCourtesyCar] = useState(false);
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSuccess, setBookingSuccess] =
    useState<BookingSubmission | null>(null);

  // Active Service Object
  const activeService = useMemo(() => {
    return (
      SERVICE_SCOPES.find((s) => s.id === selectedServiceId) ||
      SERVICE_SCOPES[0]
    );
  }, [selectedServiceId]);

  // Dynamic Price Calculations based on selected platform and scope
  const { currentPrice, dealerBenchmarkPrice, dollarSavings, savingsPercent } =
    useMemo(() => {
      let price = activeService.euroCost;
      let benchmark = activeService.euroDealerBenchmark;

      if (selectedPlatform === "jap") {
        price = activeService.japCost;
        benchmark = activeService.japDealerBenchmark;
      } else if (selectedPlatform === "perf") {
        price = activeService.perfCost;
        benchmark = activeService.perfDealerBenchmark;
      }

      const savings = benchmark - price;
      const percent = Math.round((savings / benchmark) * 100);

      return {
        currentPrice: price,
        dealerBenchmarkPrice: benchmark,
        dollarSavings: savings,
        savingsPercent: percent,
      };
    }, [activeService, selectedPlatform]);

  // Handle Transfer from Estimator to Booking Form
  const handleTransferToBooking = (serviceIdToSelect?: string) => {
    const idToUse = serviceIdToSelect || selectedServiceId;
    setBookingService(idToUse);
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle Booking Form Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim()) {
      return;
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newSubmission: BookingSubmission = {
      referenceId: `#APX-${randomSuffix}`,
      name: bookingName,
      phone: bookingPhone,
      vehicle: bookingVehicle || "Vehicle Not Specified",
      serviceId: bookingService,
      date: bookingDate || "Next Available Morning (7:30 AM)",
      courtesyCar,
      notes: bookingNotes,
    };

    setBookingSuccess(newSubmission);
  };

  const handleResetBooking = () => {
    setBookingSuccess(null);
    setBookingName("");
    setBookingPhone("");
    setBookingVehicle("");
    setBookingNotes("");
    setCourtesyCar(false);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-sans selection:bg-[#0057CB] selection:text-white">
      {/* 1. TOP AGENCY PORTFOLIO NOTICE */}
      <aside
        aria-label="Portfolio Demonstration Banner"
        className="w-full bg-[#000000] text-[#888888] border-b border-[#4C4C4C]/40 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#8DD9E7]" />
          <span className="font-mono text-[#EDEDED] font-medium tracking-wide">
            AGENCY PORTFOLIO DEMONSTRATION | High-Conversion Commercial Prototype by I.T Helpers
          </span>
        </div>
        <a
          href="https://ithelpers.com.au"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[#0082FF] hover:text-[#FFFFFF] transition-colors duration-150 underline decoration-[#0082FF]/40 underline-offset-2"
        >
          <span>Visit Agency (ithelpers.com.au)</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </aside>

      {/* 2. PRECISION NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-[#4C4C4C]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Live Status Beacon */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-[4px] bg-[#0057CB] flex items-center justify-center text-white font-bold text-sm tracking-wider">
              AP
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-wider text-[#FFFFFF] group-hover:text-[#0082FF] transition-colors">
                APEX PRECISION MECHANICAL
              </span>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B3F076] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B3F076]" />
                </span>
                <span className="text-[10px] font-mono text-[#8DD9E7] tracking-wider uppercase">
                  FACILITY ONLINE · 4 BAYS ACTIVE
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Nav Anchors */}
          <nav className="hidden lg:flex items-center gap-6 text-sm text-[#EDEDED]">
            <a
              href="#telemetry"
              className="hover:text-[#0082FF] transition-colors duration-150"
            >
              Telemetry
            </a>
            <a
              href="#services"
              className="hover:text-[#0082FF] transition-colors duration-150"
            >
              Services
            </a>
            <a
              href="#estimator"
              className="hover:text-[#0082FF] transition-colors duration-150"
            >
              Cost Estimator
            </a>
            <a
              href="#standards"
              className="hover:text-[#0082FF] transition-colors duration-150"
            >
              Standards
            </a>
            <a
              href="#booking"
              className="hover:text-[#0082FF] transition-colors duration-150"
            >
              Intake
            </a>
            <a
              href="#location"
              className="hover:text-[#0082FF] transition-colors duration-150"
            >
              Facility Hub
            </a>
          </nav>

          {/* Hotline & Primary Action Pill */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="tel:0289013400"
              className="flex items-center gap-2 text-xs font-mono text-[#EDEDED] hover:text-[#0082FF] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#0082FF]" />
              <span>(02) 8901 3400</span>
            </a>
            <a
              href="#booking"
              className="bg-[#0057CB] hover:bg-[#0082FF] text-white rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-150 inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Reserve Bay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#EDEDED] hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#000000] border-b border-[#4C4C4C]/50 px-4 py-4 space-y-3 text-sm">
            <a
              href="#telemetry"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#EDEDED] hover:text-[#0082FF] py-1"
            >
              Telemetry & Capabilities
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#EDEDED] hover:text-[#0082FF] py-1"
            >
              Six-Tier Service Matrix
            </a>
            <a
              href="#estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#EDEDED] hover:text-[#0082FF] py-1"
            >
              Interactive Cost Estimator
            </a>
            <a
              href="#standards"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#EDEDED] hover:text-[#0082FF] py-1"
            >
              Engineering Standards
            </a>
            <a
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#EDEDED] hover:text-[#0082FF] py-1"
            >
              Bay Reservation Intake
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#EDEDED] hover:text-[#0082FF] py-1"
            >
              Alexandria Facility HQ
            </a>
            <div className="pt-3 border-t border-[#4C4C4C]/40 flex flex-col gap-2">
              <a
                href="tel:0289013400"
                className="flex items-center justify-center gap-2 py-2 text-sm text-[#EDEDED] bg-[#4C4C4C]/30 rounded-[4px]"
              >
                <Phone className="w-4 h-4 text-[#0082FF]" />
                <span>Call Hotline (02) 8901 3400</span>
              </a>
              <a
                href="#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#0057CB] text-white py-2.5 rounded-full font-semibold text-sm"
              >
                Reserve Bay Online
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* 3. TECHNICAL HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 lg:py-20 border-b border-[#4C4C4C]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                {/* Telemetry Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-[#4C4C4C]/30 border border-[#888888]/30 px-3 py-1 text-xs text-[#EDEDED]">
                  <span className="w-2 h-2 rounded-full bg-[#B3F076]" />
                  <span className="font-mono tracking-tight">
                    NSW MOTOR DEALER & REPAIRER LIC #MVRL58291 · BOTANY BAY METRO
                  </span>
                </div>

                {/* Primary Display Headline */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#FFFFFF] leading-snug">
                  Dealer Precision. Independent Honesty.
                </h1>

                {/* Technical Body Copy */}
                <p className="text-sm sm:text-base text-[#EDEDED] leading-relaxed max-w-2xl">
                  Maintain your statutory new vehicle factory warranty under Australian Consumer Law (ACL)
                  without dealership markups or inflated surcharges. Operating genuine ODIS, ISTA, and
                  XENTRY diagnostic software suites, precision micrometers, and certified master technicians
                  dedicated to uncompromising mechanical telemetry.
                </p>

                {/* High-Density Assurance Points */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="border border-[#4C4C4C]/40 rounded-[4px] p-3 bg-[#000000]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B3F076]">
                      <Check className="w-3.5 h-3.5" />
                      <span>ACL Section 54</span>
                    </div>
                    <p className="text-[11px] text-[#888888] mt-1">
                      Statutory new car warranty 100% preserved legally.
                    </p>
                  </div>
                  <div className="border border-[#4C4C4C]/40 rounded-[4px] p-3 bg-[#000000]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8DD9E7]">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>OEM Software</span>
                    </div>
                    <p className="text-[11px] text-[#888888] mt-1">
                      Direct factory portal coding: BMW, VW, Mercedes.
                    </p>
                  </div>
                  <div className="border border-[#4C4C4C]/40 rounded-[4px] p-3 bg-[#000000]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FFE372]">
                      <Gauge className="w-3.5 h-3.5" />
                      <span>Zero Surcharges</span>
                    </div>
                    <p className="text-[11px] text-[#888888] mt-1">
                      Transparent upfront quotes prior to fastener removal.
                    </p>
                  </div>
                </div>

                {/* Action CTA Group */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#estimator"
                    className="bg-[#0057CB] hover:bg-[#0082FF] text-white rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-150 inline-flex items-center gap-2 shadow-sm"
                  >
                    <span>Calculate Service Cost</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#standards"
                    className="border border-[#4C4C4C] text-[#EDEDED] hover:bg-[#4C4C4C]/20 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-150 inline-flex items-center gap-2"
                  >
                    <span>Diagnostic Standards</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Framed Photographic Quarter Visual */}
              <div className="lg:col-span-5">
                <div className="relative rounded-[4px] border border-[#4C4C4C]/50 bg-[#000000] p-2 overflow-hidden shadow-lg group">
                  <div className="relative aspect-[4/3] rounded-[4px] overflow-hidden bg-[#111111]">
                    <Image
                      src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80"
                      alt="Apex Precision Mechanical diagnostic bay with high-performance chassis"
                      width={700}
                      height={525}
                      unoptimized
                      priority
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-80" />

                    {/* Live Telemetry Overlays */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#000000]/80 backdrop-blur border border-[#4C4C4C]/60 px-3 py-1 text-xs text-white">
                        <span className="w-2 h-2 rounded-full bg-[#B3F076]" />
                        <span>OEM Parts Sourced</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#000000]/80 backdrop-blur border border-[#4C4C4C]/60 px-3 py-1 text-xs text-white">
                        <span className="w-2 h-2 rounded-full bg-[#8DD9E7]" />
                        <span>PicoScope Telemetry Verified</span>
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-[#EDEDED] bg-[#000000]/85 backdrop-blur px-3 py-2 rounded-[4px] border border-[#4C4C4C]/50">
                      <div>
                        <span className="text-[#888888] block text-[9px] uppercase">
                          Active Telemetry
                        </span>
                        <span className="text-[#B3F076]">ODIS VAG CAN-Bus Active</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#888888] block text-[9px] uppercase">
                          Bay 02 Status
                        </span>
                        <span>Calibrated 0.01mm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. REAL-TIME TELEMETRY & CAPABILITY BAR (#telemetry) */}
        <section
          id="telemetry"
          className="py-10 bg-[#000000] border-b border-[#4C4C4C]/30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0082FF]" />
                <span className="text-xs font-mono tracking-wider text-[#888888] uppercase">
                  Workshop Telemetry & Statutory Verification Bar
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#B3F076]">
                LIVE FEED · BOTANY BAY FACILITY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 01 */}
              <div className="bg-[#000000] border border-[#4C4C4C]/40 rounded-[4px] p-4 flex flex-col justify-between hover:border-[#0082FF] transition-colors duration-150">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#888888] uppercase font-mono">
                    Metric 01 · Compliance
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B3F076]" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#FFFFFF]">
                    Warranty Safe
                  </h2>
                  <p className="text-xs text-[#EDEDED] mt-0.5">
                    100% ACL Statutory Protection
                  </p>
                </div>
                <p className="text-[11px] text-[#888888] mt-3 pt-2 border-t border-[#4C4C4C]/30">
                  Dealer networks cannot void your Australian Consumer Law warranty.
                </p>
              </div>

              {/* Metric 02 */}
              <div className="bg-[#000000] border border-[#4C4C4C]/40 rounded-[4px] p-4 flex flex-col justify-between hover:border-[#0082FF] transition-colors duration-150">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#888888] uppercase font-mono">
                    Metric 02 · Diagnostics
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8DD9E7]" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#FFFFFF]">
                    Tooling Parity
                  </h2>
                  <p className="text-xs text-[#EDEDED] mt-0.5">
                    ODIS · ISTA · XENTRY · G-Scan
                  </p>
                </div>
                <p className="text-[11px] text-[#888888] mt-3 pt-2 border-t border-[#4C4C4C]/30">
                  Direct online portal licensing for VW, Audi, BMW, and Mercedes-Benz.
                </p>
              </div>

              {/* Metric 03 */}
              <div className="bg-[#000000] border border-[#4C4C4C]/40 rounded-[4px] p-4 flex flex-col justify-between hover:border-[#0082FF] transition-colors duration-150">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#888888] uppercase font-mono">
                    Metric 03 · Hardware Grade
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFFFFF]" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#FFFFFF]">
                    Component Grade
                  </h2>
                  <p className="text-xs text-[#EDEDED] mt-0.5">
                    OEM Mahle, Mann, Brembo, Bilstein
                  </p>
                </div>
                <p className="text-[11px] text-[#888888] mt-3 pt-2 border-t border-[#4C4C4C]/30">
                  Tier-1 European and Japanese precision parts directly unboxed.
                </p>
              </div>

              {/* Metric 04 */}
              <div className="bg-[#000000] border border-[#4C4C4C]/40 rounded-[4px] p-4 flex flex-col justify-between hover:border-[#0082FF] transition-colors duration-150">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#888888] uppercase font-mono">
                    Metric 04 · Handover
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFE372]" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#FFFFFF]">
                    Turnaround Index
                  </h2>
                  <p className="text-xs text-[#EDEDED] mt-0.5">
                    Same-Day Handover Guaranteed
                  </p>
                </div>
                <p className="text-[11px] text-[#888888] mt-3 pt-2 border-t border-[#4C4C4C]/30">
                  Drop off before 9:00 AM, collected by 5:00 PM with SMS inspection video.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE SERVICE COST ESTIMATOR (#estimator) */}
        <section
          id="estimator"
          className="py-16 bg-[#000000] border-b border-[#4C4C4C]/30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0082FF] uppercase tracking-wider mb-2">
                <Gauge className="w-3.5 h-3.5" />
                <span>Diagnostic Cost Telemetry Model</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#FFFFFF]">
                Interactive Service Cost Estimator
              </h2>
              <p className="text-sm text-[#EDEDED] mt-2">
                Evaluate immediate upfront service costs benchmarked against official franchise
                dealership networks. Zero surcharges, zero undisclosed line items.
              </p>
            </div>

            {/* Estimator Container Card */}
            <div className="rounded-[4px] bg-[#000000] border border-[#4C4C4C]/50 p-6 lg:p-8 shadow-lg">
              {/* Step 1: Platform Selection */}
              <div className="space-y-3 mb-8">
                <label className="text-xs font-mono uppercase text-[#888888] tracking-wider block">
                  Step 01 · Select Chassis Engineering Platform
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PLATFORMS.map((platform) => {
                    const isSelected = selectedPlatform === platform.id;
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={`text-left p-4 rounded-[4px] border transition-all duration-150 flex flex-col justify-between ${
                          isSelected
                            ? "bg-[#4C4C4C]/30 border-[#0082FF] text-[#FFFFFF]"
                            : "bg-[#000000] border-[#4C4C4C]/40 text-[#EDEDED] hover:border-[#888888]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">
                              {platform.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#0082FF]" />
                            )}
                          </div>
                          <p className="text-xs text-[#888888] mt-1">
                            {platform.subLabel}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-[#4C4C4C]/30">
                          <span className="text-[10px] font-mono text-[#8DD9E7]">
                            {platform.badge}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Service Scope Selection */}
              <div className="space-y-3 mb-8">
                <label className="text-xs font-mono uppercase text-[#888888] tracking-wider block">
                  Step 02 · Select Calibration / Maintenance Scope
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {SERVICE_SCOPES.map((scope) => {
                    const isSelected = selectedServiceId === scope.id;
                    return (
                      <button
                        key={scope.id}
                        type="button"
                        onClick={() => setSelectedServiceId(scope.id)}
                        className={`px-3 py-2.5 rounded-[4px] border text-xs text-left transition-all duration-150 ${
                          isSelected
                            ? "bg-[#0057CB] border-[#0082FF] text-white font-medium"
                            : "bg-[#000000] border-[#4C4C4C]/40 text-[#EDEDED] hover:border-[#888888]"
                        }`}
                      >
                        <div className="truncate font-semibold">{scope.name}</div>
                        <div
                          className={`text-[10px] truncate mt-0.5 ${
                            isSelected ? "text-[#EDEDED]" : "text-[#888888]"
                          }`}
                        >
                          {scope.turnaroundBadge}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real-Time Telemetry Calculation Readout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 bg-[#000000] border border-[#4C4C4C]/40 rounded-[4px]">
                {/* Pricing Metrics */}
                <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-[#4C4C4C]/30 pb-6 lg:pb-0 lg:pr-6">
                  <div>
                    <span className="text-xs font-mono text-[#888888] uppercase block">
                      Apex Precision Workshop Cost
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-bold text-[#FFFFFF]">
                        ${currentPrice}
                      </span>
                      <span className="text-xs text-[#8DD9E7] font-mono">
                        Inc. GST & Fluids
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#888888]">Dealership Benchmark:</span>
                      <span className="text-[#EDEDED] line-through font-mono">
                        ${dealerBenchmarkPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs bg-[#4C4C4C]/20 p-2 rounded-[4px] border border-[#4C4C4C]/30">
                      <span className="text-[#B3F076] font-semibold">
                        Direct Client Savings:
                      </span>
                      <span className="text-[#B3F076] font-mono font-bold">
                        Save ${dollarSavings} ({savingsPercent}% Lower)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#888888]">
                      <span>Turnaround Window:</span>
                      <span className="text-[#FFFFFF] font-mono">
                        {activeService.duration}
                      </span>
                    </div>
                  </div>

                  {/* Transfer to Booking CTA */}
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => handleTransferToBooking()}
                      className="w-full bg-[#0057CB] hover:bg-[#0082FF] text-white rounded-full py-3 text-sm font-semibold transition-colors duration-150 inline-flex items-center justify-center gap-2"
                    >
                      <span>Transfer Estimate to Workshop Reservation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="block text-[11px] text-center text-[#888888] mt-2">
                      Pre-populates selected tier into the intake registry below.
                    </span>
                  </div>
                </div>

                {/* Itemized Technical Checklist */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#888888] uppercase">
                      Itemized Technical Checklist · {activeService.name}
                    </span>
                    <span className="text-[11px] font-mono text-[#B3F076]">
                      {activeService.technicalInclusions.length} PROTOCOLS
                    </span>
                  </div>

                  <ul className="space-y-2.5">
                    {activeService.technicalInclusions.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-[#EDEDED] leading-relaxed"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#B3F076]/20 text-[#B3F076] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. SIX-TIER SERVICES CAPABILITY MATRIX (#services) */}
        <section
          id="services"
          className="py-16 bg-[#000000] border-b border-[#4C4C4C]/30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0082FF] uppercase tracking-wider mb-2">
                <Wrench className="w-3.5 h-3.5" />
                <span>Mechanical Engineering Disciplines</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#FFFFFF]">
                Six-Tier Services Capability Matrix
              </h2>
              <p className="text-sm text-[#EDEDED] mt-2">
                Every service tier is executed using calibrated OEM test equipment, factory torque
                specifications, and transparent digital documentation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICE_SCOPES.map((service, idx) => (
                <div
                  key={service.id}
                  className="rounded-[4px] bg-[#000000] border border-[#4C4C4C]/40 p-5 flex flex-col justify-between hover:border-[#0082FF] transition-colors duration-150 group"
                >
                  <div>
                    {/* Visual Header with Desaturated Monochrome Base */}
                    <div className="relative aspect-[16/9] rounded-[4px] overflow-hidden mb-4 bg-[#111111]">
                      <Image
                        src={service.imageUrl}
                        alt={service.name}
                        width={600}
                        height={338}
                        unoptimized
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-[#000000]/80 backdrop-blur px-2.5 py-0.5 rounded-full text-[10px] font-mono text-[#B3F076] border border-[#4C4C4C]/50">
                        {service.turnaroundBadge}
                      </div>
                      <div className="absolute bottom-2 left-2 bg-[#000000]/80 backdrop-blur px-2.5 py-0.5 rounded-[4px] text-[10px] font-mono text-[#EDEDED] border border-[#4C4C4C]/50">
                        0{idx + 1} · {service.telemetryMetric}
                      </div>
                    </div>

                    <div className="text-xs font-mono text-[#0082FF] uppercase mb-1">
                      {service.scopeTag}
                    </div>
                    <h3 className="text-base font-semibold text-[#FFFFFF] group-hover:text-[#0082FF] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#888888] mt-2 leading-relaxed">
                      {service.summary}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#4C4C4C]/30 space-y-1.5">
                      <span className="text-[10px] font-mono text-[#888888] uppercase block">
                        Core Diagnostic Deliverables:
                      </span>
                      {service.technicalInclusions.slice(0, 3).map((inc, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 text-xs text-[#EDEDED]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0082FF]" />
                          <span className="truncate">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#4C4C4C]/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#888888] uppercase font-mono block">
                        Estimated Scope
                      </span>
                      <span className="text-xs text-[#B3F076] font-mono">
                        From ${service.japCost} (Inc. GST)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedServiceId(service.id);
                        handleTransferToBooking(service.id);
                      }}
                      className="bg-[#4C4C4C]/30 hover:bg-[#0057CB] text-[#EDEDED] hover:text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-1"
                    >
                      <span>Select Service</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. EDITORIAL WORKSHOP STANDARDS (#standards) */}
        <section
          id="standards"
          className="py-16 bg-[#000000] border-b border-[#4C4C4C]/30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Master Diagnostic Technician Photo */}
              <div className="lg:col-span-5">
                <div className="relative rounded-[4px] border border-[#4C4C4C]/50 bg-[#000000] p-2 overflow-hidden shadow-lg group">
                  <div className="relative aspect-[4/5] rounded-[4px] overflow-hidden bg-[#111111]">
                    <Image
                      src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"
                      alt="Apex Precision Mechanical certified master diagnostic technician"
                      width={600}
                      height={750}
                      unoptimized
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-85" />

                    <div className="absolute bottom-4 left-4 right-4 bg-[#000000]/85 backdrop-blur p-4 rounded-[4px] border border-[#4C4C4C]/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">
                          Master Mechanical Guarantee
                        </span>
                        <span className="text-[#B3F076] font-mono text-[10px]">
                          CERTIFIED LEVEL 4
                        </span>
                      </div>
                      <p className="text-[11px] text-[#888888] leading-relaxed">
                        24-Month / 30,000 km Workmanship Warranty backed across all mechanical,
                        electronic, and driveline overhauls.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 3 Core Engineering Principles */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0082FF] uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Integrity & Verification Framework</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#FFFFFF]">
                    Editorial Workshop Standards
                  </h2>
                  <p className="text-sm text-[#EDEDED] mt-2">
                    We eliminate the opacity of conventional dealership servicing. Every diagnostic
                    hypothesis is backed by real-time sensor waveform captures and transparent digital proof.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Principle 01 */}
                  <div className="border border-[#4C4C4C]/40 rounded-[4px] p-5 bg-[#000000] hover:border-[#0082FF] transition-colors duration-150">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold text-[#0082FF] bg-[#0057CB]/10 px-2 py-1 rounded-[4px] border border-[#0057CB]/30">
                        01
                      </span>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-[#FFFFFF]">
                          Pre-Execution Digital Quotation
                        </h3>
                        <p className="text-xs text-[#EDEDED] leading-relaxed">
                          High-definition video and photo evidence sent directly via SMS before any
                          fastener is turned. You receive the micrometer rotor reading, fluid contamination
                          color test, and itemized part costs prior to authorization.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Principle 02 */}
                  <div className="border border-[#4C4C4C]/40 rounded-[4px] p-5 bg-[#000000] hover:border-[#0082FF] transition-colors duration-150">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold text-[#B3F076] bg-[#B3F076]/10 px-2 py-1 rounded-[4px] border border-[#B3F076]/30">
                        02
                      </span>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-[#FFFFFF]">
                          Master Technicians Only
                        </h3>
                        <p className="text-xs text-[#EDEDED] leading-relaxed">
                          No first-year apprentices wrenching unsupervised on client vehicles. Every
                          chassis is inspected, torqued, and calibrated by factory-trained specialists with
                          a minimum of 10 years European and Japanese performance experience.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Principle 03 */}
                  <div className="border border-[#4C4C4C]/40 rounded-[4px] p-5 bg-[#000000] hover:border-[#0082FF] transition-colors duration-150">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold text-[#8DD9E7] bg-[#8DD9E7]/10 px-2 py-1 rounded-[4px] border border-[#8DD9E7]/30">
                        03
                      </span>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-[#FFFFFF]">
                          Digital Factory Service Stamping
                        </h3>
                        <p className="text-xs text-[#EDEDED] leading-relaxed">
                          Direct portal records uploaded seamlessly to BMW KaSIO, Volkswagen GeKo, and
                          Mercedes-Benz DSB (Digital Service Booklet). Complete digital provenance is
                          preserved, maximizing private resale valuation and warranty audit compliance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. INTERACTIVE CUSTOMER BOOKING INTAKE (#booking) */}
        <section
          id="booking"
          className="py-16 bg-[#000000] border-b border-[#4C4C4C]/30"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0082FF] uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Diagnostic Bay Intake Registry</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#FFFFFF]">
                Interactive Customer Booking Intake
              </h2>
              <p className="text-sm text-[#EDEDED] mt-2">
                Reserve your dedicated service bay. Same-day drop-off available between 7:30 AM and 9:00 AM,
                or utilize our 24/7 key deposit locker box.
              </p>
            </div>

            {/* Diagnostic Form Card */}
            <div className="rounded-[4px] bg-[#000000] border border-[#4C4C4C]/50 p-6 sm:p-8 shadow-lg">
              {bookingSuccess ? (
                /* Confirmed Reservation Voucher */
                <div className="space-y-6 animate-fadeIn">
                  <div className="border border-[#B3F076]/40 bg-[#B3F076]/5 rounded-[4px] p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#B3F076]/20 text-[#B3F076] flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-[#B3F076] tracking-wider uppercase block">
                      Workshop Reservation Confirmed
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      Reservation Voucher {bookingSuccess.referenceId}
                    </h3>
                    <p className="text-xs text-[#EDEDED] max-w-md mx-auto">
                      Thank you, {bookingSuccess.name}. Your dedicated service bay at our Alexandria
                      facility has been provisioned. A confirmation dispatch SMS has been routed to{" "}
                      <span className="font-mono text-white">{bookingSuccess.phone}</span>.
                    </p>
                  </div>

                  {/* Voucher Summary Table */}
                  <div className="border border-[#4C4C4C]/40 rounded-[4px] p-4 bg-[#000000] space-y-3 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#4C4C4C]/30">
                      <span className="text-[#888888]">Vehicle / Rego:</span>
                      <span className="text-white font-medium">
                        {bookingSuccess.vehicle}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#4C4C4C]/30">
                      <span className="text-[#888888]">Selected Discipline:</span>
                      <span className="text-[#8DD9E7] font-medium">
                        {SERVICE_SCOPES.find((s) => s.id === bookingSuccess.serviceId)?.name ||
                          bookingSuccess.serviceId}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#4C4C4C]/30">
                      <span className="text-[#888888]">Drop-Off Schedule:</span>
                      <span className="text-white font-mono">
                        {bookingSuccess.date} (7:30 AM – 9:00 AM)
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#4C4C4C]/30">
                      <span className="text-[#888888]">Loan Vehicle Allocation:</span>
                      <span className="text-white">
                        {bookingSuccess.courtesyCar
                          ? "Yes · Complimentary Loaner Provisioned"
                          : "No · Customer Arranging Transport"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#888888]">Key Drop Protocol:</span>
                      <span className="text-[#B3F076] font-mono">
                        Safe Box #04 PIN Sent via SMS
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-4 justify-between items-center pt-2">
                    <a
                      href="tel:0289013400"
                      className="text-xs text-[#0082FF] hover:underline flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Speak with Workshop Manager (02) 8901 3400</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleResetBooking}
                      className="bg-[#4C4C4C]/30 hover:bg-[#4C4C4C]/50 text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors"
                    >
                      Reserve Another Vehicle
                    </button>
                  </div>
                </div>
              ) : (
                /* Intake Form */
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="booking-name"
                        className="text-xs font-medium text-[#EDEDED]"
                      >
                        Full Name <span className="text-[#0082FF]">*</span>
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="e.g. Marcus Vance"
                        className="w-full rounded-[4px] bg-[#000000] border border-[#4C4C4C] text-[#FFFFFF] px-4 py-2.5 text-sm focus:border-[#0082FF] focus:outline-none placeholder:text-[#888888]"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="booking-phone"
                        className="text-xs font-medium text-[#EDEDED]"
                      >
                        Contact Mobile <span className="text-[#0082FF]">*</span>
                      </label>
                      <input
                        id="booking-phone"
                        type="tel"
                        required
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        placeholder="0400 000 000"
                        className="w-full rounded-[4px] bg-[#000000] border border-[#4C4C4C] text-[#FFFFFF] px-4 py-2.5 text-sm focus:border-[#0082FF] focus:outline-none placeholder:text-[#888888]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Vehicle Make/Model/Rego */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="booking-vehicle"
                        className="text-xs font-medium text-[#EDEDED]"
                      >
                        Rego / Make & Model
                      </label>
                      <input
                        id="booking-vehicle"
                        type="text"
                        value={bookingVehicle}
                        onChange={(e) => setBookingVehicle(e.target.value)}
                        placeholder="e.g. 2021 BMW M340i / NSW #CK82AP"
                        className="w-full rounded-[4px] bg-[#000000] border border-[#4C4C4C] text-[#FFFFFF] px-4 py-2.5 text-sm focus:border-[#0082FF] focus:outline-none placeholder:text-[#888888]"
                      />
                    </div>

                    {/* Service Scope Selection (auto-synced) */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="booking-service"
                        className="text-xs font-medium text-[#EDEDED]"
                      >
                        Service Discipline
                      </label>
                      <select
                        id="booking-service"
                        value={bookingService}
                        onChange={(e) => setBookingService(e.target.value)}
                        className="w-full rounded-[4px] bg-[#000000] border border-[#4C4C4C] text-[#FFFFFF] px-4 py-2.5 text-sm focus:border-[#0082FF] focus:outline-none"
                      >
                        {SERVICE_SCOPES.map((s) => (
                          <option key={s.id} value={s.id} className="bg-[#000000]">
                            {s.name} ({s.turnaroundBadge})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Preferred Date */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="booking-date"
                        className="text-xs font-medium text-[#EDEDED]"
                      >
                        Preferred Drop-Off Date
                      </label>
                      <input
                        id="booking-date"
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full rounded-[4px] bg-[#000000] border border-[#4C4C4C] text-[#FFFFFF] px-4 py-2.5 text-sm focus:border-[#0082FF] focus:outline-none [color-scheme:dark]"
                      />
                    </div>

                    {/* Courtesy Car Checkbox */}
                    <div className="flex items-center gap-3 pt-6">
                      <input
                        id="booking-courtesy"
                        type="checkbox"
                        checked={courtesyCar}
                        onChange={(e) => setCourtesyCar(e.target.checked)}
                        className="w-4 h-4 rounded-[4px] accent-[#0057CB] bg-[#000000] border border-[#4C4C4C]"
                      />
                      <label
                        htmlFor="booking-courtesy"
                        className="text-xs text-[#EDEDED] cursor-pointer"
                      >
                        Request complimentary loan vehicle / Green Square station drop-off
                      </label>
                    </div>
                  </div>

                  {/* Notes & Symptoms */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="booking-notes"
                      className="text-xs font-medium text-[#EDEDED]"
                    >
                      Symptom Notes & Specific Diagnostic Requests
                    </label>
                    <textarea
                      id="booking-notes"
                      rows={3}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="e.g. Intermittent boost hesitation at 3,500 RPM, brake pedal vibration under heavy deceleration, or factory logbook stamping required."
                      className="w-full rounded-[4px] bg-[#000000] border border-[#4C4C4C] text-[#FFFFFF] px-4 py-2.5 text-sm focus:border-[#0082FF] focus:outline-none placeholder:text-[#888888]"
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-[#0057CB] hover:bg-[#0082FF] text-white rounded-full px-8 py-3 text-sm font-semibold transition-colors duration-150 inline-flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Confirm Workshop Reservation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="text-[11px] text-[#888888] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#B3F076]" />
                      <span>Instant SMS Dispatch · Zero Payment Required Upfront</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 9. WORKSHOP TELEMETRY & LOCATION HUB (#location) */}
        <section
          id="location"
          className="py-16 bg-[#000000] border-b border-[#4C4C4C]/30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0082FF] uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Alexandria Technical Operations Facility</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#FFFFFF]">
                Workshop Telemetry & Location Hub
              </h2>
              <p className="text-sm text-[#EDEDED] mt-2">
                Centrally positioned in Alexandria, Sydney, within 350 meters of Green Square Station
                and seamless arterial access to the Eastern Suburbs and Sydney CBD.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Operations Information Card */}
              <div className="lg:col-span-6 space-y-4">
                <div className="rounded-[4px] bg-[#000000] border border-[#4C4C4C]/40 p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#888888] uppercase block">
                        Alexandria Workshop HQ
                      </span>
                      <h3 className="text-base font-semibold text-white mt-0.5">
                        42 Collins Street, Alexandria NSW 2015
                      </h3>
                    </div>
                    <a
                      href="https://maps.google.com/?q=42+Collins+Street+Alexandria+NSW+2015"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#0082FF] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#4C4C4C]/30 text-xs">
                    <div>
                      <span className="text-[#888888] block text-[10px] uppercase font-mono">
                        Direct Phone Hotline
                      </span>
                      <a
                        href="tel:0289013400"
                        className="text-white hover:text-[#0082FF] font-mono mt-0.5 block"
                      >
                        (02) 8901 3400
                      </a>
                    </div>
                    <div>
                      <span className="text-[#888888] block text-[10px] uppercase font-mono">
                        Direct Service Email
                      </span>
                      <a
                        href="mailto:service@mechanic.ithelpers.com.au"
                        className="text-white hover:text-[#0082FF] font-mono mt-0.5 block truncate"
                      >
                        service@mechanic.ithelpers.com.au
                      </a>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#4C4C4C]/30 text-xs space-y-1.5">
                    <span className="text-[#888888] block text-[10px] uppercase font-mono">
                      Operating Hours (Sydney Time)
                    </span>
                    <div className="flex justify-between text-[#EDEDED]">
                      <span>Monday – Friday:</span>
                      <span className="font-mono text-white">7:30 AM – 5:30 PM</span>
                    </div>
                    <div className="flex justify-between text-[#EDEDED]">
                      <span>Saturday:</span>
                      <span className="font-mono text-white">8:00 AM – 1:00 PM (By Appt)</span>
                    </div>
                    <div className="flex justify-between text-[#888888]">
                      <span>Sunday & Public Holidays:</span>
                      <span className="font-mono">Closed</span>
                    </div>
                  </div>
                </div>

                {/* 24/7 Key Safe & Transit Instructions */}
                <div className="rounded-[4px] bg-[#000000] border border-[#4C4C4C]/40 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#FFE372]">
                    <Key className="w-4 h-4" />
                    <span>24/7 After-Hours Drop-Box Safe</span>
                  </div>
                  <p className="text-xs text-[#EDEDED] leading-relaxed">
                    Arriving before 7:30 AM or after 5:30 PM? Deposit your vehicle keys in our steel
                    tamper-proof drop locker situated adjacent to Bay Door 02. Secure one-time SMS PIN
                    is issued upon booking confirmation.
                  </p>
                  <div className="pt-2 border-t border-[#4C4C4C]/30 text-xs text-[#888888] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#8DD9E7]" />
                    <span>5-minute walk (350m) to Green Square Station · Airport Line direct</span>
                  </div>
                </div>
              </div>

              {/* Transit & Interactive Directions Card */}
              <div className="lg:col-span-6">
                <div className="rounded-[4px] bg-[#000000] border border-[#4C4C4C]/40 p-6 space-y-5 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#888888] uppercase block">
                      Facility Transit Directions
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1">
                      Rapid Transit & Customer Courtesy
                    </h3>
                    <p className="text-xs text-[#EDEDED] mt-2 leading-relaxed">
                      Leave your vehicle with our technicians in the morning and take the 5-minute
                      train ride into the Sydney CBD. Complimentary espresso lounge, high-speed Wi-Fi,
                      and courtesy vehicles available upon prior reservation.
                    </p>

                    <div className="mt-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-[#EDEDED] p-2.5 bg-[#4C4C4C]/20 rounded-[4px] border border-[#4C4C4C]/30">
                        <span className="w-2 h-2 rounded-full bg-[#B3F076]" />
                        <span>Complimentary loan vehicles provisioned for major logbook services</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#EDEDED] p-2.5 bg-[#4C4C4C]/20 rounded-[4px] border border-[#4C4C4C]/30">
                        <span className="w-2 h-2 rounded-full bg-[#8DD9E7]" />
                        <span>Private customer lounge with dedicated workspaces</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#EDEDED] p-2.5 bg-[#4C4C4C]/20 rounded-[4px] border border-[#4C4C4C]/30">
                        <span className="w-2 h-2 rounded-full bg-[#FFE372]" />
                        <span>Same-day wash and vacuum with every major overhaul tier</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#4C4C4C]/30 flex flex-wrap gap-3 items-center justify-between">
                    <a
                      href="https://maps.google.com/?q=42+Collins+Street+Alexandria+NSW+2015"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#4C4C4C]/30 hover:bg-[#0057CB] text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Launch Google Navigation</span>
                    </a>
                    <a
                      href="tel:0289013400"
                      className="text-xs font-mono text-[#EDEDED] hover:text-[#0082FF] transition-colors"
                    >
                      Workshop Desk: (02) 8901 3400
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#000000] border-t border-[#4C4C4C]/40 py-12 text-xs text-[#888888]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1 */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-[4px] bg-[#0057CB] flex items-center justify-center text-white font-bold text-xs">
                  AP
                </div>
                <span className="font-semibold text-sm text-[#FFFFFF] tracking-wider">
                  APEX PRECISION MECHANICAL
                </span>
              </div>
              <p className="text-xs text-[#EDEDED] max-w-md leading-relaxed">
                Independent automotive engineering specialist for European, Japanese, and performance
                platforms. Statutory logbook servicing, CAN-Bus diagnostic telemetry, and performance brake
                calibrations under Australian Consumer Law compliance.
              </p>
              <div className="text-[11px] font-mono text-[#888888]">
                NSW MOTOR DEALER & REPAIRER LICENCE: #MVRL58291
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#FFFFFF] block">
                Technical Disciplines
              </span>
              <ul className="space-y-1.5 text-xs text-[#EDEDED]">
                <li>
                  <a href="#services" className="hover:text-[#0082FF]">
                    Manufacturer Logbook Servicing
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#0082FF]">
                    CAN-Bus Deep Diagnostics
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#0082FF]">
                    Performance Brake Systems
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#0082FF]">
                    ZF & DSG Driveline Flush
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#0082FF]">
                    120-Point Pre-Purchase Audits
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#FFFFFF] block">
                Agency Portfolio
              </span>
              <p className="text-xs text-[#EDEDED] leading-relaxed">
                Demonstration prototype developed strictly for commercial portfolio showcase.
              </p>
              <a
                href="https://ithelpers.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#0082FF] hover:text-[#FFFFFF] transition-colors duration-150 pt-1"
              >
                <span>Agency: I.T Helpers</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-[#4C4C4C]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              © 2026 Apex Precision Mechanical. All rights reserved.
            </div>
            <div className="text-[#888888]">
              High-Conversion Commercial Showcase · Synthesized Webflow Architecture
            </div>
          </div>
        </div>
      </footer>

      {/* 10. STICKY MOBILE BAR (<768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#000000]/95 backdrop-blur-md border-t border-[#4C4C4C]/40 p-3 flex items-center gap-3">
        <a
          href="tel:0289013400"
          className="flex-1 bg-[#4C4C4C]/30 hover:bg-[#4C4C4C]/50 text-white rounded-full py-2.5 text-xs font-semibold text-center border border-[#4C4C4C]/50 flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-[#0082FF]" />
          <span>Call Workshop</span>
        </a>
        <a
          href="#booking"
          className="flex-1 bg-[#0057CB] hover:bg-[#0082FF] text-white rounded-full py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Reserve Bay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}