"use client";

import React, { useState, useMemo } from "react";
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
  Star,
  ExternalLink,
  Car,
  ArrowRight,
  Sparkles,
  Award,
  FileCheck2,
  Settings,
  Key,
  Coffee,
  Wifi,
  Navigation,
  Check,
  Menu,
  X,
} from "lucide-react";

// Types
type VehicleCategory = "euro" | "jap" | "suv";

interface ServiceScope {
  id: string;
  name: string;
  categoryTag: string;
  duration: string;
  euroPrice: [number, number];
  japPrice: [number, number];
  suvPrice: [number, number];
  dealerMultiplier: number;
  highlight: string;
  includes: string[];
}

const SERVICE_SCOPES: ServiceScope[] = [
  {
    id: "logbook-minor",
    name: "Statutory Minor Logbook Service",
    categoryTag: "Warranty Safe",
    duration: "2.0 – 2.5 Hours",
    euroPrice: [385, 465],
    japPrice: [285, 345],
    suvPrice: [345, 415],
    dealerMultiplier: 1.45,
    highlight: "Factory oil renewal + 62-point digital safety audit",
    includes: [
      "OEM synthetic engine lubricant (Liqui Moly / Castrol Edge)",
      "Genuine Mann / Mahle oil filter replacement",
      "62-point digital suspension, brake & fluid safety audit",
      "Digital logbook validation & factory service reminder reset",
      "Statutory new car warranty 100% legally maintained",
    ],
  },
  {
    id: "logbook-major",
    name: "Comprehensive Major Service & Flush",
    categoryTag: "Deep Maintenance",
    duration: "4.0 – 5.0 Hours",
    euroPrice: [695, 875],
    japPrice: [495, 625],
    suvPrice: [595, 745],
    dealerMultiplier: 1.55,
    highlight: "Full fluid overhaul + spark ignition / fuel system renewal",
    includes: [
      "Full synthetic engine oil replacement + internal engine flush",
      "Engine intake filter & high-efficiency cabin microfilter",
      "OEM iridium spark plugs or diesel fuel filter replacement",
      "Brake fluid hygroscopic boil test & DOT 4/5.1 pressure flush",
      "Comprehensive diagnostic ECU health check & battery conductance test",
    ],
  },
  {
    id: "brakes",
    name: "Performance Brake Pad & Rotor Overhaul",
    categoryTag: "Braking Precision",
    duration: "2.0 – 3.0 Hours",
    euroPrice: [450, 595],
    japPrice: [340, 460],
    suvPrice: [390, 520],
    dealerMultiplier: 1.42,
    highlight: "Brembo / Textar OEM friction compound replacement",
    includes: [
      "Brembo, Textar, or OEM low-dust ceramic compound brake pads",
      "Micrometer rotor runout & thickness variation inspection",
      "Caliper slider pin degreasing and synthetic high-temp lubrication",
      "DOT 4 / 5.1 high-temperature brake fluid flush",
      "Controlled bedding-in road evaluation & pedal feel calibration",
    ],
  },
  {
    id: "diagnostics",
    name: "Master ECU & CAN-Bus Fault Isolation",
    categoryTag: "Factory Telemetry",
    duration: "1.5 – 2.0 Hours",
    euroPrice: [220, 290],
    japPrice: [180, 240],
    suvPrice: [210, 270],
    dealerMultiplier: 1.6,
    highlight: "Dealer-grade ISTA, ODIS & PicoScope oscilloscope interrogation",
    includes: [
      "Dealer-level scan suites (BMW ISTA, VAG ODIS, Mercedes Xentry, Techstream)",
      "PicoScope oscilloscope live sensor waveform capture",
      "Live dynamic telemetry & boost/fuel rail pressure interrogation",
      "Itemized diagnostic report with high-res photos and repair roadmap",
      "Diagnostic inspection fee credited towards approved repairs",
    ],
  },
  {
    id: "driveline",
    name: "DSG, ZF & Automatic Transmission Service",
    categoryTag: "Driveline Specialist",
    duration: "3.5 – 4.5 Hours",
    euroPrice: [590, 760],
    japPrice: [420, 540],
    suvPrice: [510, 680],
    dealerMultiplier: 1.5,
    highlight: "Mechatronic filter replacement & factory clutch adaptation",
    includes: [
      "OEM ZF Lifeguard / DSG dual-clutch transmission fluid flush",
      "Internal transmission pan & integrated microfilter renewal",
      "Mechatronic temperature-dependent fluid level equalization",
      "Diagnostic clutch pack pressure & shift adaptation recalibration",
      "Driveshaft universal joint & differential seal inspection",
    ],
  },
  {
    id: "suspension",
    name: "Suspension, Bushings & Active Damper Service",
    categoryTag: "Chassis & Dynamics",
    duration: "3.0 – 4.0 Hours",
    euroPrice: [490, 680],
    japPrice: [380, 520],
    suvPrice: [440, 610],
    dealerMultiplier: 1.45,
    highlight: "Lemförder / Bilstein OEM control arm & damper overhaul",
    includes: [
      "Hydraulic bushing leak check & ball joint play tolerance test",
      "Active damper (EDC / MagneRide / Airmatic) leak audit",
      "Anti-roll sway bar link rod renewal and bushing lube",
      "Laser chassis alignment geometry verification",
      "NVH vibration dampening and road compliance road test",
    ],
  },
];

const VEHICLE_DATA = {
  euro: {
    label: "European Marques",
    desc: "BMW, Mercedes-Benz, Audi, Porsche, Volkswagen, Volvo, MINI",
    badge: "Dealer Diagnostic Level",
    oemSpecs: "Liqui Moly, Castrol Edge, Brembo, Mann-Filter, ZF",
  },
  jap: {
    label: "Japanese Precision",
    desc: "Toyota, Lexus, Subaru, Honda, Nissan, Mazda, Mitsubishi",
    badge: "Strict OEM Tolerances",
    oemSpecs: "Idemitsu, Denso, Akebono, NGK, Aisin",
  },
  suv: {
    label: "AWD, 4WD & SUV",
    desc: "LandCruiser, Prado, Patrol, Ranger, Hilux, Macan, Touareg",
    badge: "Heavy-Duty Driveline",
    oemSpecs: "Motul Heavy Duty, Bilstein, Terrain Tamer, OEM",
  },
};

export default function Home() {
  // Navigation State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estimator State
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>("euro");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("logbook-minor");

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    rego: "",
    makeModel: "",
    serviceId: "logbook-minor",
    date: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Active Service Calculation
  const activeService = useMemo(() => {
    return (
      SERVICE_SCOPES.find((s) => s.id === selectedServiceId) ||
      SERVICE_SCOPES[0]
    );
  }, [selectedServiceId]);

  const priceRange = useMemo(() => {
    if (selectedCategory === "euro") return activeService.euroPrice;
    if (selectedCategory === "jap") return activeService.japPrice;
    return activeService.suvPrice;
  }, [selectedCategory, activeService]);

  const dealerBenchmark = useMemo(() => {
    const avgApex = (priceRange[0] + priceRange[1]) / 2;
    return Math.round(avgApex * activeService.dealerMultiplier);
  }, [priceRange, activeService]);

  const estimatedSavings = useMemo(() => {
    const avgApex = (priceRange[0] + priceRange[1]) / 2;
    return Math.round(dealerBenchmark - avgApex);
  }, [dealerBenchmark, priceRange]);

  const handleBookFromEstimator = (serviceId: string) => {
    setBookingForm((prev) => ({ ...prev, serviceId }));
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedCode = `APX-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedId(generatedCode);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] flex flex-col font-sans">
      {/* Top Agency Portfolio Banner */}
      <aside aria-label="Portfolio Demonstration Notice" className="w-full bg-[#000000] text-[#FFFFFF] text-xs py-2.5 px-4 text-center border-b border-[#293040]">
        <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1557FF] text-[#FFFFFF] font-bold text-[11px] tracking-wide uppercase">
            Notice
          </span>
          <span className="font-medium text-[#AAADB0]">
            AGENCY PORTFOLIO DEMONSTRATION | High-Conversion Commercial Prototype by{" "}
            <a
              href="https://ithelpers.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFFFFF] underline decoration-[#1557FF] underline-offset-4 hover:text-[#1557FF] font-semibold transition-colors inline-flex items-center gap-1"
            >
              I.T Helpers
              <ExternalLink className="w-3 h-3 inline" />
            </a>
          </span>
        </div>
      </aside>

      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E7EB] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-[#000000] flex items-center justify-center text-[#FFFFFF] shadow-sm group-hover:bg-[#1557FF] transition-colors">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-[#000000]">
                  APEX
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1557FF]/10 text-[#1557FF]">
                  Workshop
                </span>
              </div>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#4F4F4F]">
                Precision Mechanical
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#4F4F4F]">
            <a
              href="#services"
              className="hover:text-[#1557FF] transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#estimator"
              className="hover:text-[#1557FF] transition-colors flex items-center gap-1.5"
            >
              <span>Instant Estimator</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-[#4A3AFF]/10 text-[#4A3AFF] rounded-full">
                Interactive
              </span>
            </a>
            <a href="#about" className="hover:text-[#1557FF] transition-colors">
              Why Apex
            </a>
            <a href="#process" className="hover:text-[#1557FF] transition-colors">
              Workflow
            </a>
            <a href="#booking" className="hover:text-[#1557FF] transition-colors">
              Reserve Bay
            </a>
            <a href="#location" className="hover:text-[#1557FF] transition-colors">
              Alexandria HQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="tel:0289013400"
              className="flex items-center gap-2 text-sm font-bold text-[#000000] hover:text-[#1557FF] transition-colors px-3 py-2"
            >
              <Phone className="w-4 h-4 text-[#1557FF]" />
              <span>(02) 8901 3400</span>
            </a>
            <a
              href="#booking"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#1557FF] hover:bg-[#4A3AFF] text-[#FFFFFF] text-sm font-semibold shadow-sm hover:shadow-md transition-all"
            >
              Book Workshop
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#000000] hover:bg-[#F8F9FC] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFFFFF] border-b border-[#E5E7EB] px-4 pt-2 pb-6 space-y-3">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#4F4F4F] hover:text-[#1557FF]"
            >
              Capabilities
            </a>
            <a
              href="#estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#4F4F4F] hover:text-[#1557FF]"
            >
              Instant Estimator
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#4F4F4F] hover:text-[#1557FF]"
            >
              Why Apex
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#4F4F4F] hover:text-[#1557FF]"
            >
              Workflow
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#4F4F4F] hover:text-[#1557FF]"
            >
              Alexandria Location & Hours
            </a>
            <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-3">
              <a
                href="tel:0289013400"
                className="flex items-center justify-center gap-2 py-3 rounded-full border border-[#E5E7EB] text-[#000000] font-bold text-sm"
              >
                <Phone className="w-4 h-4 text-[#1557FF]" />
                Call (02) 8901 3400
              </a>
              <a
                href="#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center py-3 rounded-full bg-[#1557FF] text-[#FFFFFF] font-bold text-sm"
              >
                Book Service Bay
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Split Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F8F9FC] to-[#FFFFFF] pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1557FF]/10 border border-[#1557FF]/20 text-[#1557FF] text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sydney European & Japanese Automotive Specialist</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#000000] leading-[1.1]">
                Dealer Precision. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1557FF] to-[#4A3AFF]">
                  Independent Honesty.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#4F4F4F] max-w-2xl leading-relaxed">
                Dealer-level diagnostic telemetry, statutory logbook servicing,
                and performance repairs. We maintain your new car statutory warranty
                under Australian Consumer Law without dealer markups.
              </p>

              {/* Badges List */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm text-xs font-semibold text-[#000000]">
                  <ShieldCheck className="w-4 h-4 text-[#1557FF]" />
                  <span>100% New Car Warranty Safe</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm text-xs font-semibold text-[#000000]">
                  <Award className="w-4 h-4 text-[#4A3AFF]" />
                  <span>OEM Direct Parts & Lubricants</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm text-xs font-semibold text-[#000000]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>24-Month / 20,000km Guarantee</span>
                </div>
              </div>

              {/* Hero CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <a
                  href="#estimator"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1557FF] hover:bg-[#4A3AFF] text-[#FFFFFF] font-bold text-base shadow-md hover:shadow-lg transition-all"
                >
                  <span>Calculate Service Estimate</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="tel:0289013400"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#FFFFFF] hover:bg-[#F8F9FC] text-[#000000] font-bold text-base border border-[#E5E7EB] shadow-sm transition-all"
                >
                  <Phone className="w-4 h-4 text-[#1557FF]" />
                  <span>(02) 8901 3400</span>
                </a>
              </div>

              {/* Trust Metric Snapshot */}
              <div className="pt-6 border-t border-[#E5E7EB] flex items-center gap-6">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <div className="text-xs text-[#4F4F4F]">
                  <span className="font-bold text-[#000000]">4.9 / 5.0 Rating</span>{" "}
                  based on 340+ verified Sydney European & Japanese vehicle owners.
                </div>
              </div>
            </div>

            {/* Hero Right Visual: High-contrast vehicle imagery */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E5E7EB] bg-[#000000]">
                {/* Vehicle Hero Image */}
                <img
                  src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80"
                  alt="Apex Precision Mechanical European Vehicle Service"
                  className="w-full h-[420px] sm:h-[480px] object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-90"
                />

                {/* Overlaid Badge 1: Top Left */}
                <div className="absolute top-4 left-4 bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl p-3 border border-[#FFFFFF]/20 shadow-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1557FF] text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#000000]">
                      ACCC Compliant
                    </p>
                    <p className="text-[11px] text-[#4F4F4F]">
                      Statutory Warranty Retained
                    </p>
                  </div>
                </div>

                {/* Overlaid Badge 2: Bottom Right */}
                <div className="absolute bottom-4 right-4 bg-[#000000]/85 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 shadow-lg text-white max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      Live Workshop Active
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white/90">
                    Alexandria Bays: 4 Certified Master Techs On-Site
                  </p>
                </div>
              </div>

              {/* Subtle background glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#1557FF]/15 to-[#4A3AFF]/15 -z-10 rounded-3xl blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Key Numbers / Trust Proof Band */}
      <section className="bg-[#FFFFFF] py-12 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center">
            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB]">
              <div className="text-3xl lg:text-4xl font-black text-[#000000]">
                18+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#1557FF] mt-1">
                Years Operating
              </div>
              <div className="text-xs text-[#4F4F4F] mt-1">
                Sydney marque specialists
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB]">
              <div className="text-3xl lg:text-4xl font-black text-[#000000]">
                100%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#1557FF] mt-1">
                Logbook Warranty
              </div>
              <div className="text-xs text-[#4F4F4F] mt-1">
                Protected by consumer law
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB]">
              <div className="text-3xl lg:text-4xl font-black text-[#000000]">
                24 Mo
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#1557FF] mt-1">
                Guarantee
              </div>
              <div className="text-xs text-[#4F4F4F] mt-1">
                Or 20,000km on all repairs
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB]">
              <div className="text-3xl lg:text-4xl font-black text-[#000000]">
                4.9 / 5
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#1557FF] mt-1">
                Verified Rating
              </div>
              <div className="text-xs text-[#4F4F4F] mt-1">
                Over 340+ customer reviews
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Instant Service Estimator */}
      <section
        id="estimator"
        className="py-20 bg-[#F8F9FC] border-b border-[#E5E7EB] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1557FF]/10 text-[#1557FF] text-xs font-bold tracking-wider uppercase">
              Transparent Workshop Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#000000] mt-3">
              Interactive Instant Service Estimator
            </h2>
            <p className="text-base text-[#4F4F4F] mt-2">
              Select your vehicle category and mechanical service scope to see
              accurate workshop pricing, dealer benchmarks, and estimated savings.
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E7EB] shadow-xl p-6 sm:p-8 lg:p-10">
            {/* Step 1: Vehicle Category Selection */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-3">
                1. Select Vehicle Platform
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(VEHICLE_DATA) as VehicleCategory[]).map((catKey) => {
                  const data = VEHICLE_DATA[catKey];
                  const isSelected = selectedCategory === catKey;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setSelectedCategory(catKey)}
                      className={`text-left p-5 rounded-2xl border transition-all relative ${
                        isSelected
                          ? "border-[#1557FF] bg-[#1557FF]/5 ring-2 ring-[#1557FF]/20"
                          : "border-[#E5E7EB] bg-[#FFFFFF] hover:border-[#AAADB0]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-base font-bold ${
                            isSelected ? "text-[#1557FF]" : "text-[#000000]"
                          }`}
                        >
                          {data.label}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#1557FF] text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#4F4F4F] leading-relaxed">
                        {data.desc}
                      </p>
                      <div className="mt-3">
                        <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#E5E7EB] text-[#4F4F4F]">
                          {data.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Service Scope Selection */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-3">
                2. Select Service Scope
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SERVICE_SCOPES.map((scope) => {
                  const isSelected = selectedServiceId === scope.id;
                  return (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setSelectedServiceId(scope.id)}
                      className={`text-left p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? "border-[#4A3AFF] bg-[#4A3AFF]/5 ring-2 ring-[#4A3AFF]/20"
                          : "border-[#E5E7EB] bg-[#FFFFFF] hover:border-[#AAADB0]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1557FF]">
                          {scope.categoryTag}
                        </span>
                        <span className="text-[11px] text-[#4F4F4F] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {scope.duration}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#000000]">
                        {scope.name}
                      </h4>
                      <p className="text-xs text-[#4F4F4F] mt-1 line-clamp-1">
                        {scope.highlight}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calculation Output Card */}
            <div className="bg-[#F8F9FC] rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Pricing Benchmark */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <span className="text-xs uppercase font-bold text-[#1557FF] tracking-wider">
                      Estimated Workshop Quote
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl sm:text-5xl font-black text-[#000000]">
                        ${priceRange[0]} – ${priceRange[1]}
                      </span>
                      <span className="text-xs text-[#4F4F4F] font-semibold">
                        incl. GST & Parts
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#4F4F4F]">
                      <span>Typical Dealership Benchmark:</span>
                      <span className="font-bold line-through text-[#4F4F4F]">
                        ~${dealerBenchmark}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-emerald-600">
                      <span>Estimated Direct Savings:</span>
                      <span>~${estimatedSavings} (≈35–42%)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#4F4F4F]">
                    <Clock className="w-4 h-4 text-[#1557FF]" />
                    <span>
                      Estimated Turnaround: <strong>{activeService.duration}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookFromEstimator(activeService.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1557FF] hover:bg-[#4A3AFF] text-[#FFFFFF] font-bold text-sm shadow-md transition-all"
                  >
                    <span>Reserve Bay for This Estimate</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: Inclusions Checklist */}
                <div className="lg:col-span-7 bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] p-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#000000] flex items-center justify-between">
                    <span>What Is Included in this Scope</span>
                    <span className="text-[11px] font-normal text-[#4F4F4F]">
                      Statutory Warranty Protected
                    </span>
                  </h4>
                  <ul className="space-y-2.5">
                    {activeService.includes.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-[#4F4F4F]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#4F4F4F]">
                    <span>
                      Specified OEM oils:{" "}
                      <strong>{VEHICLE_DATA[selectedCategory].oemSpecs}</strong>
                    </span>
                    <span className="text-emerald-700 font-bold">
                      Digital Logbook Stamped
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section: What Makes Us Different with Technician Imagery */}
      <section id="about" className="py-20 bg-[#FFFFFF] border-b border-[#E5E7EB] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual: Technician Imagery */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-xl bg-[#000000] relative">
                <img
                  src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"
                  alt="Apex Precision Mechanical Certified Master Technician"
                  className="w-full h-[460px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1557FF] text-white inline-block mb-2">
                    Master Technician Standard
                  </span>
                  <p className="text-base font-bold">
                    Zero Apprentices Without Supervision
                  </p>
                  <p className="text-xs text-[#AAADB0] mt-1">
                    Every torque specification is calibrated with snap-on digital tools and cross-checked on digital worksheets.
                  </p>
                </div>
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-[#FFFFFF] rounded-2xl p-4 border border-[#E5E7EB] shadow-lg max-w-[220px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-[#000000]">
                      100% Genuine
                    </div>
                    <div className="text-[11px] text-[#4F4F4F]">
                      OEM filters & fluids only
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content: Pillars */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#1557FF]/10 text-[#1557FF] text-xs font-bold tracking-wider uppercase">
                The Apex Standard
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#000000] leading-tight">
                Engineered for Drivers Who Demand Factory Rigor Without the Dealership Premium.
              </h2>
              <p className="text-base text-[#4F4F4F] leading-relaxed">
                Many modern dealerships treat servicing as an assembly line, rushing billable hours
                and charging inflated rates. At Apex Precision Mechanical, our Alexandria facility is
                equipped with genuine factory diagnostic suites, oscilloscope analyzers, and factory-trained
                technicians dedicated to European and Japanese automotive marques.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB]">
                  <div className="w-8 h-8 rounded-full bg-[#1557FF]/10 text-[#1557FF] flex items-center justify-center mb-2.5">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#000000]">
                    Dealer-Level Telemetry
                  </h4>
                  <p className="text-xs text-[#4F4F4F] mt-1">
                    Live ECU interrogation using ISTA, ODIS, Xentry and PicoScope digital oscilloscopes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB]">
                  <div className="w-8 h-8 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] flex items-center justify-center mb-2.5">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#000000]">
                    Transparent Photo Quotes
                  </h4>
                  <p className="text-xs text-[#4F4F4F] mt-1">
                    Direct high-resolution photos sent to your smartphone before any wrench is turned.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB]">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#000000]">
                    Warranty 100% Protected
                  </h4>
                  <p className="text-xs text-[#4F4F4F] mt-1">
                    Australian Consumer Law guarantees your factory statutory warranty remains completely valid.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB]">
                  <div className="w-8 h-8 rounded-full bg-[#000000]/10 text-[#000000] flex items-center justify-center mb-2.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#000000]">
                    24-Mo / 20k km Warranty
                  </h4>
                  <p className="text-xs text-[#4F4F4F] mt-1">
                    Every replaced component and labor procedure is backed by our comprehensive guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Capability Matrix with High-Contrast Service Photos */}
      <section id="services" className="py-20 bg-[#F8F9FC] border-b border-[#E5E7EB] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1557FF]/10 text-[#1557FF] text-xs font-bold tracking-wider uppercase">
              Workshop Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#000000] mt-3">
              Precision Automotive Services
            </h2>
            <p className="text-base text-[#4F4F4F] mt-2">
              From statutory factory logbook servicing to complex transmission re-calibrations
              and track-ready brake builds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Maintenance / Engine Bay (with user-requested imagery) */}
            <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
              <div className="relative h-48 overflow-hidden bg-[#000000]">
                <img
                  src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80"
                  alt="Engine Bay and Factory Logbook Maintenance"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#000000]/80 backdrop-blur-md text-white text-[11px] font-bold">
                  Statutory Logbook
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#000000] mb-2">
                    Logbook Servicing & Engine Maintenance
                  </h3>
                  <p className="text-xs text-[#4F4F4F] leading-relaxed mb-4">
                    Factory-compliant schedule maintenance utilizing OEM-certified synthetic lubricants
                    (Liqui Moly, Castrol) and Mann/Mahle filtration. Digital logbook validation.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#4F4F4F] mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Warranty compliant without dealer markups</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>62-point comprehensive digital checklist</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleBookFromEstimator("logbook-minor")}
                  className="w-full py-2.5 rounded-full border border-[#E5E7EB] hover:border-[#1557FF] hover:bg-[#1557FF] hover:text-white text-xs font-bold transition-all text-[#000000]"
                >
                  Book Logbook Service
                </button>
              </div>
            </div>

            {/* Card 2: Brakes & Wheels (with user-requested imagery) */}
            <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
              <div className="relative h-48 overflow-hidden bg-[#000000]">
                <img
                  src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=800&q=80"
                  alt="Performance Brakes & Rotor Overhaul"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#000000]/80 backdrop-blur-md text-white text-[11px] font-bold">
                  Braking Systems
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#000000] mb-2">
                    Performance Brake Pads & Rotors
                  </h3>
                  <p className="text-xs text-[#4F4F4F] leading-relaxed mb-4">
                    Micrometer runout tolerance measurement, Brembo/Textar low-dust compounds,
                    caliper slider pin servicing, and DOT 4.1 pressure fluid bleed.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#4F4F4F] mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Zero brake squeal or vibration guarantee</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bedding-in process & high-temp synthetic lube</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleBookFromEstimator("brakes")}
                  className="w-full py-2.5 rounded-full border border-[#E5E7EB] hover:border-[#1557FF] hover:bg-[#1557FF] hover:text-white text-xs font-bold transition-all text-[#000000]"
                >
                  Book Brake Service
                </button>
              </div>
            </div>

            {/* Card 3: Computer Diagnostics (with user-requested imagery) */}
            <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
              <div className="relative h-48 overflow-hidden bg-[#000000]">
                <img
                  src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"
                  alt="Master Computer Diagnostics and ECU Telemetry"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#000000]/80 backdrop-blur-md text-white text-[11px] font-bold">
                  CAN-Bus Diagnostics
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#000000] mb-2">
                    Computer Diagnostics & ECU Telemetry
                  </h3>
                  <p className="text-xs text-[#4F4F4F] leading-relaxed mb-4">
                    True dealer-level scanning with ISTA, ODIS, Star and PicoScope oscilloscopes.
                    We diagnose electrical and drivability issues without guesswork.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#4F4F4F] mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Freeze-frame live sensor data capture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Fee credited towards approved mechanical repairs</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleBookFromEstimator("diagnostics")}
                  className="w-full py-2.5 rounded-full border border-[#E5E7EB] hover:border-[#1557FF] hover:bg-[#1557FF] hover:text-white text-xs font-bold transition-all text-[#000000]"
                >
                  Book Diagnostics Scan
                </button>
              </div>
            </div>

            {/* Card 4: Driveline / DSG / ZF */}
            <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#1557FF]/10 text-[#1557FF] flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1557FF]">
                  Transmission
                </span>
                <h3 className="text-lg font-bold text-[#000000] mt-1 mb-2">
                  DSG & ZF Transmission Servicing
                </h3>
                <p className="text-xs text-[#4F4F4F] leading-relaxed mb-4">
                  Full fluid extraction and filter replacement for Volkswagen/Audi DSG,
                  BMW ZF 6/8HP, and Porsche PDK systems, including clutch pack adaptions.
                </p>
                <ul className="space-y-1.5 text-xs text-[#4F4F4F] mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Exact temperature fill level calibration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Smooth shift adaptation software reset</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleBookFromEstimator("driveline")}
                className="w-full py-2.5 rounded-full border border-[#E5E7EB] hover:border-[#1557FF] hover:bg-[#1557FF] hover:text-white text-xs font-bold transition-all text-[#000000]"
              >
                Inquire Driveline Service
              </button>
            </div>

            {/* Card 5: Suspension & Steering */}
            <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#4A3AFF]/10 text-[#4A3AFF] flex items-center justify-center mb-4">
                  <Gauge className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A3AFF]">
                  Chassis Dynamics
                </span>
                <h3 className="text-lg font-bold text-[#000000] mt-1 mb-2">
                  Suspension, Bushings & Steering
                </h3>
                <p className="text-xs text-[#4F4F4F] leading-relaxed mb-4">
                  Eliminate knocks, clunks and wandering steering. Control arm replacement,
                  hydraulic bushing renewal (Lemförder/SuperPro), and laser wheel alignment.
                </p>
                <ul className="space-y-1.5 text-xs text-[#4F4F4F] mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Airmatic, EDC & MagneRide calibration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Restores original factory handling composure</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleBookFromEstimator("suspension")}
                className="w-full py-2.5 rounded-full border border-[#E5E7EB] hover:border-[#1557FF] hover:bg-[#1557FF] hover:text-white text-xs font-bold transition-all text-[#000000]"
              >
                Inquire Suspension Overhaul
              </button>
            </div>

            {/* Card 6: Pre-Purchase Inspections */}
            <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Buyer Protection
                </span>
                <h3 className="text-lg font-bold text-[#000000] mt-1 mb-2">
                  Pre-Purchase Technical Audit
                </h3>
                <p className="text-xs text-[#4F4F4F] leading-relaxed mb-4">
                  Planning to buy a pre-owned European or Japanese vehicle in Sydney?
                  Comprehensive 120-point mechanical, chassis, paint gauge and diagnostic report.
                </p>
                <ul className="space-y-1.5 text-xs text-[#4F4F4F] mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Digital paint-depth meter accident detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Itemized repair cost negotiation sheet</span>
                  </li>
                </ul>
              </div>
              <a
                href="#booking"
                className="w-full py-2.5 rounded-full border border-[#E5E7EB] hover:border-[#1557FF] hover:bg-[#1557FF] hover:text-white text-xs font-bold transition-all text-center block text-[#000000]"
              >
                Book Inspection
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Workshop Workflow Section */}
      <section id="process" className="py-20 bg-[#FFFFFF] border-b border-[#E5E7EB] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1557FF]/10 text-[#1557FF] text-xs font-bold tracking-wider uppercase">
              Transparent Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#000000] mt-3">
              The 4-Step Workshop Workflow
            </h2>
            <p className="text-base text-[#4F4F4F] mt-2">
              No mystery bills. No unauthorized repairs. Just clear digital communication
              at every step of your vehicle&apos;s visit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-[#F8F9FC] border border-[#E5E7EB] relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-[#1557FF]/30 block mb-2">
                  01
                </span>
                <h3 className="text-base font-bold text-[#000000] mb-2">
                  Diagnostic Check-in
                </h3>
                <p className="text-xs text-[#4F4F4F] leading-relaxed">
                  Vehicle arrives at Alexandria workshop or via 24/7 key drop.
                  Immediate electronic intake scan and technician walkaround.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E7EB] text-[11px] font-semibold text-[#1557FF]">
                Within 30 mins of drop-off
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-[#F8F9FC] border border-[#E5E7EB] relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-[#1557FF]/30 block mb-2">
                  02
                </span>
                <h3 className="text-base font-bold text-[#000000] mb-2">
                  Direct Photo Quotation
                </h3>
                <p className="text-xs text-[#4F4F4F] leading-relaxed">
                  Receive an SMS/email link with high-resolution photos of worn parts
                  and an itemized quote before any work commences.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E7EB] text-[11px] font-semibold text-[#1557FF]">
                100% Client Authorization
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-[#F8F9FC] border border-[#E5E7EB] relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-[#1557FF]/30 block mb-2">
                  03
                </span>
                <h3 className="text-base font-bold text-[#000000] mb-2">
                  Precision Execution
                </h3>
                <p className="text-xs text-[#4F4F4F] leading-relaxed">
                  Certified master technicians complete authorized repairs to OEM torque
                  tolerances using genuine parts and calibrated tooling.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E7EB] text-[11px] font-semibold text-[#1557FF]">
                Snap-on Digital Calibrated
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-[#F8F9FC] border border-[#E5E7EB] relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-[#1557FF]/30 block mb-2">
                  04
                </span>
                <h3 className="text-base font-bold text-[#000000] mb-2">
                  Handover & Warranty
                </h3>
                <p className="text-xs text-[#4F4F4F] leading-relaxed">
                  Final road verification test, digital logbook stamping, and clean vehicle
                  handover backed by our 24-Mo/20k km guarantee.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E7EB] text-[11px] font-semibold text-emerald-600">
                24-Mo Guarantee Issued
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Reviews Section */}
      <section className="py-20 bg-[#F8F9FC] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1557FF]/10 text-[#1557FF] text-xs font-bold tracking-wider uppercase">
              Client Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#000000] mt-3">
              Trusted by Sydney Drivers
            </h2>
            <p className="text-base text-[#4F4F4F] mt-2">
              Real owners of European performance and Japanese vehicles sharing their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#4F4F4F] italic leading-relaxed mb-4">
                  &ldquo;Took my BMW M3 to Apex after the dealership quoted $2,400 for a major inspection.
                  Apex identified exactly what needed doing, sent video evidence of the microfilter
                  and brake runout, and charged half. The car drives like brand new.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5E7EB]">
                <div className="text-xs font-bold text-[#000000]">Marcus T.</div>
                <div className="text-[11px] text-[#4F4F4F]">BMW F80 M3 Owner • Surry Hills</div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#4F4F4F] italic leading-relaxed mb-4">
                  &ldquo;Audi RS3 dual-clutch transmission service was handled flawlessly. They used factory
                  fluid and ran the clutch adaptation cycle while keeping my logbook warranty intact.
                  Clean workshop and very professional team.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5E7EB]">
                <div className="text-xs font-bold text-[#000000]">Elena R.</div>
                <div className="text-[11px] text-[#4F4F4F]">Audi RS3 Sportback • Double Bay</div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#4F4F4F] italic leading-relaxed mb-4">
                  &ldquo;Our family LandCruiser had an intermittent electrical boost sensor fault that two
                  other workshops couldn&apos;t pin down. Apex&apos;s technician put an oscilloscope on the harness,
                  found a chafed wire within 40 minutes, and resolved it.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5E7EB]">
                <div className="text-xs font-bold text-[#000000]">David K.</div>
                <div className="text-[11px] text-[#4F4F4F]">Toyota LandCruiser 200 Series • Mascot</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Booking Form Section */}
      <section id="booking" className="py-20 bg-[#FFFFFF] border-b border-[#E5E7EB] scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1557FF]/10 text-[#1557FF] text-xs font-bold tracking-wider uppercase">
              Direct Reservation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#000000] mt-3">
              Book Your Service Bay
            </h2>
            <p className="text-base text-[#4F4F4F] mt-2">
              Lock in your preferred date. Our master service advisor will confirm vehicle
              intake within 2 business hours.
            </p>
          </div>

          <div className="bg-[#F8F9FC] rounded-3xl border border-[#E5E7EB] shadow-xl p-6 sm:p-10">
            {submittedId ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider inline-block">
                  Booking Request Confirmed
                </span>
                <h3 className="text-2xl font-black text-[#000000]">
                  Bay Reserved: {submittedId}
                </h3>
                <p className="text-sm text-[#4F4F4F] max-w-md mx-auto">
                  Thank you! We have received your booking details for{" "}
                  <strong>{bookingForm.makeModel || "your vehicle"}</strong> (Rego:{" "}
                  <strong>{bookingForm.rego || "Provided"}</strong>). A service advisor will call{" "}
                  <strong>{bookingForm.phone || "your number"}</strong> to confirm final drop-off.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedId(null);
                      setBookingForm({
                        name: "",
                        phone: "",
                        email: "",
                        rego: "",
                        makeModel: "",
                        serviceId: "logbook-minor",
                        date: "",
                        notes: "",
                      });
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#1557FF] text-white text-xs font-bold hover:bg-[#4A3AFF] transition-all"
                  >
                    Book Another Vehicle
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.name}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, name: e.target.value })
                      }
                      placeholder="e.g. Alexander Mitchell"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#1557FF] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, phone: e.target.value })
                      }
                      placeholder="e.g. 0412 345 678"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#1557FF] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, email: e.target.value })
                      }
                      placeholder="e.g. alex@example.com.au"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#1557FF] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Vehicle Rego */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                      Vehicle Rego *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.rego}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, rego: e.target.value })
                      }
                      placeholder="e.g. NSW-ABC-123"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] uppercase focus:outline-none focus:ring-2 focus:ring-[#1557FF] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Make & Model */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                      Make & Model *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.makeModel}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, makeModel: e.target.value })
                      }
                      placeholder="e.g. 2021 BMW 330i or Lexus RX350"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#1557FF] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Preferred Service */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                      Service Scope
                    </label>
                    <select
                      value={bookingForm.serviceId}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, serviceId: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#1557FF] focus:border-transparent transition-all"
                    >
                      {SERVICE_SCOPES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.duration})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, date: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#1557FF] focus:border-transparent transition-all"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                    Known Symptoms / Specific Requests
                  </label>
                  <textarea
                    rows={3}
                    value={bookingForm.notes}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, notes: e.target.value })
                    }
                    placeholder="e.g. Slight steering wheel shudder under heavy braking, check front brake pad thickness."
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#1557FF] focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-[#4F4F4F]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    No upfront payment required. You will review and approve all costs before any work begins.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#1557FF] hover:bg-[#4A3AFF] text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Confirming Bay Availability...</span>
                  ) : (
                    <>
                      <span>Confirm Workshop Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Workshop Details & Alexandria Location Section */}
      <section id="location" className="py-20 bg-[#F8F9FC] border-b border-[#E5E7EB] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Workshop Information */}
            <div className="lg:col-span-6 space-y-6">
              <span className="px-3.5 py-1.5 rounded-full bg-[#1557FF]/10 text-[#1557FF] text-xs font-bold tracking-wider uppercase">
                Facility & Access
              </span>
              <h2 className="text-3xl font-black text-[#000000]">
                Alexandria Workshop & Customer Facilities
              </h2>
              <p className="text-base text-[#4F4F4F] leading-relaxed">
                Centrally positioned in Alexandria, Sydney with rapid access to the Eastern Distributor,
                Mascot Airport precinct, and Green Square.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB]">
                  <div className="w-10 h-10 rounded-full bg-[#1557FF]/10 text-[#1557FF] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#000000]">
                      Workshop Address
                    </h4>
                    <p className="text-xs text-[#4F4F4F] mt-0.5">
                      Unit 4, 32-36 Ralph Street, Alexandria NSW 2015
                    </p>
                    <a
                      href="https://maps.google.com/?q=Unit+4+32-36+Ralph+Street+Alexandria+NSW+2015"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#1557FF] font-bold hover:underline inline-flex items-center gap-1 mt-1.5"
                    >
                      Get Driving Directions
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB]">
                  <div className="w-10 h-10 rounded-full bg-[#1557FF]/10 text-[#1557FF] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#000000]">
                      Operating Hours
                    </h4>
                    <div className="text-xs text-[#4F4F4F] mt-1 space-y-0.5">
                      <p>Monday – Friday: 7:30 AM – 5:30 PM</p>
                      <p>Saturday: 8:00 AM – 1:00 PM (Pre-booked bays)</p>
                      <p>Sunday & Public Holidays: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB]">
                  <div className="w-10 h-10 rounded-full bg-[#1557FF]/10 text-[#1557FF] flex items-center justify-center shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#000000]">
                      24/7 Secure Key Drop Box
                    </h4>
                    <p className="text-xs text-[#4F4F4F] mt-0.5">
                      Early morning commuter or late-night drop-off? Deposit your key in our
                      CCTV-monitored, reinforced drop vault at Bay Entrance A.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Amenities Card */}
            <div className="lg:col-span-6 bg-[#FFFFFF] rounded-3xl border border-[#E5E7EB] p-6 lg:p-8 space-y-6">
              <h3 className="text-lg font-bold text-[#000000]">
                Customer Lounge & Commuter Amenities
              </h3>
              <p className="text-xs text-[#4F4F4F] leading-relaxed">
                Whether waiting for an express minor logbook service or dropping your keys for the day:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB]">
                  <Wifi className="w-5 h-5 text-[#1557FF] mb-2" />
                  <h4 className="text-xs font-bold text-[#000000]">
                    High-Speed Wi-Fi
                  </h4>
                  <p className="text-[11px] text-[#4F4F4F] mt-0.5">
                    Quiet dedicated work stations for remote laptops.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB]">
                  <Coffee className="w-5 h-5 text-[#4A3AFF] mb-2" />
                  <h4 className="text-xs font-bold text-[#000000]">
                    Barista Espresso Bar
                  </h4>
                  <p className="text-[11px] text-[#4F4F4F] mt-0.5">
                    Complimentary fresh artisan coffee and sparkling water.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB]">
                  <Navigation className="w-5 h-5 text-emerald-600 mb-2" />
                  <h4 className="text-xs font-bold text-[#000000]">
                    Train Station Transit
                  </h4>
                  <p className="text-[11px] text-[#4F4F4F] mt-0.5">
                    600m from Mascot Station and 10 mins to Sydney CBD.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB]">
                  <Car className="w-5 h-5 text-[#000000] mb-2" />
                  <h4 className="text-xs font-bold text-[#000000]">
                    Replacement Vehicles
                  </h4>
                  <p className="text-[11px] text-[#4F4F4F] mt-0.5">
                    Pre-bookable loan cars available for major repair bookings.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1557FF]/5 border border-[#1557FF]/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#000000]">
                    Speak Directly With Our Master Advisor
                  </p>
                  <p className="text-[11px] text-[#4F4F4F]">
                    Technical questions or custom builds welcome
                  </p>
                </div>
                <a
                  href="tel:0289013400"
                  className="px-4 py-2 rounded-full bg-[#1557FF] text-white text-xs font-bold hover:bg-[#4A3AFF] transition-all"
                >
                  (02) 8901 3400
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FFFFFF] border-t border-[#E5E7EB] pt-14 pb-24 md:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#000000] text-white flex items-center justify-center font-bold text-xs">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-base font-black tracking-tight text-[#000000]">
                  APEX PRECISION
                </span>
              </div>
              <p className="text-xs text-[#4F4F4F] leading-relaxed">
                European & Japanese specialist automotive mechanical workshop in Alexandria, Sydney NSW.
              </p>
              <p className="text-[11px] text-[#AAADB0]">
                ABN: 48 912 345 678 | MVRL Lic: MVRL-49201
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#000000] mb-3">
                Capabilities
              </h4>
              <ul className="space-y-2 text-xs text-[#4F4F4F]">
                <li><a href="#services" className="hover:text-[#1557FF]">Logbook Servicing</a></li>
                <li><a href="#services" className="hover:text-[#1557FF]">Performance Brakes</a></li>
                <li><a href="#services" className="hover:text-[#1557FF]">ECU Diagnostics (CAN-Bus)</a></li>
                <li><a href="#services" className="hover:text-[#1557FF]">ZF & DSG Transmission</a></li>
                <li><a href="#services" className="hover:text-[#1557FF]">Suspension & Laser Alignment</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#000000] mb-3">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs text-[#4F4F4F]">
                <li><a href="#estimator" className="hover:text-[#1557FF]">Instant Estimator</a></li>
                <li><a href="#about" className="hover:text-[#1557FF]">Why Apex Standards</a></li>
                <li><a href="#process" className="hover:text-[#1557FF]">4-Step Workflow</a></li>
                <li><a href="#booking" className="hover:text-[#1557FF]">Reserve Bay Online</a></li>
                <li><a href="#location" className="hover:text-[#1557FF]">Alexandria Directions</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#000000] mb-3">
                Portfolio Demonstration
              </h4>
              <p className="text-xs text-[#4F4F4F] leading-relaxed mb-3">
                Commercial prototype crafted by <strong>I.T Helpers</strong> to showcase high-conversion
                web architectures for automotive workshops.
              </p>
              <a
                href="https://ithelpers.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1557FF] hover:underline"
              >
                Visit Agency Website
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#4F4F4F] gap-4">
            <p>
              © 2026 Apex Precision Mechanical. All rights reserved.
            </p>
            <p className="text-[11px] text-[#AAADB0]">
              Brand trademarks (BMW, Mercedes-Benz, Audi, Porsche, etc.) remain property of their respective holders and are referenced solely for technical compatibility.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Action Bar (< md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E5E7EB] p-3 flex gap-3 shadow-2xl">
        <a
          href="tel:0289013400"
          className="flex-1 py-3 rounded-full bg-[#FFFFFF] border border-[#E5E7EB] text-[#000000] text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
        >
          <Phone className="w-4 h-4 text-[#1557FF]" />
          <span>Call Workshop</span>
        </a>
        <a
          href="#booking"
          className="flex-1 py-3 rounded-full bg-[#1557FF] text-[#FFFFFF] text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Online</span>
        </a>
      </div>
    </div>
  );
}