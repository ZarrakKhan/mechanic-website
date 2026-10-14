"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Phone,
  Calendar,
  Menu,
  X,
  Gauge,
  ChevronRight,
  Calculator,
  Clock,
  ArrowRight,
  Car,
  Wrench,
  CheckCircle2,
  Award,
  Star,
  FileCheck2,
  Cpu,
  Disc,
  Cog,
  Compass,
  SearchCheck,
  MapPin,
  Mail,
  KeyRound,
  Train,
  Coffee,
  Wifi,
  Key,
} from "lucide-react";

// Estimator Data
type VehicleCategory = "euro" | "jap" | "suv";

interface ServiceScope {
  id: string;
  name: string;
  duration: string;
  euroPrice: [number, number];
  japPrice: [number, number];
  suvPrice: [number, number];
  dealerMultiplier: number;
  includes: string[];
}

const SERVICE_SCOPES: ServiceScope[] = [
  {
    id: "logbook-minor",
    name: "Logbook Servicing (Minor / Interim)",
    duration: "2.0 – 2.5 Hours",
    euroPrice: [380, 460],
    japPrice: [280, 350],
    suvPrice: [340, 420],
    dealerMultiplier: 1.48,
    includes: [
      "Factory-spec OEM synthetic lubricant (Liqui Moly / Motul / Castrol)",
      "Genuine Mann / Mahle oil filter replacement",
      "62-point digital mechanical & electronic safety audit",
      "Digital logbook verification & service interval reset",
      "Statutory new car warranty 100% maintained",
    ],
  },
  {
    id: "logbook-major",
    name: "Comprehensive Logbook Service (Major)",
    duration: "4.0 – 5.0 Hours",
    euroPrice: [680, 850],
    japPrice: [490, 620],
    suvPrice: [580, 740],
    dealerMultiplier: 1.55,
    includes: [
      "OEM synthetic engine oil + advanced engine flush",
      "Engine intake & active cabin microfilter replacement",
      "Spark plug renewal or diesel fuel filter replacement",
      "Brake fluid moisture hygroscopic test & pressure flush",
      "Chassis & suspension torque check with digital report",
    ],
  },
  {
    id: "brakes",
    name: "Performance Brake Pad & Rotor Overhaul",
    duration: "2.0 – 3.0 Hours",
    euroPrice: [440, 590],
    japPrice: [340, 460],
    suvPrice: [390, 520],
    dealerMultiplier: 1.42,
    includes: [
      "Brembo, Textar, or OEM friction compound pads",
      "Digital micrometer rotor disc thickness & runout inspection",
      "Caliper slider pin degreasing and high-temp synthetic lube",
      "DOT 4 / 5.1 high-temperature fluid flush",
      "Bedding-in road test and pedal calibration",
    ],
  },
  {
    id: "diagnostics",
    name: "Computer Diagnostics & ECU Fault Isolation",
    duration: "1.5 – 2.0 Hours",
    euroPrice: [220, 290],
    japPrice: [190, 250],
    suvPrice: [210, 270],
    dealerMultiplier: 1.65,
    includes: [
      "Interrogation with factory scan suites (ISTA, ODIS, Star, Techstream)",
      "PicoScope digital oscilloscope sensor waveform capture",
      "Live sensor telemetry review under load conditions",
      "Itemized diagnostic photo report & corrective action plan",
      "Diagnostic fee credited against approved mechanical repairs",
    ],
  },
  {
    id: "driveline",
    name: "Driveline & DSG / ZF Transmission Service",
    duration: "3.5 – 4.5 Hours",
    euroPrice: [580, 750],
    japPrice: [450, 590],
    suvPrice: [520, 680],
    dealerMultiplier: 1.5,
    includes: [
      "Dedicated OEM transmission fluid (ZF Lifeguard / DSG)",
      "Internal filter and mechatronic pan replacement",
      "Transmission adaptation reset and clutch bite-point relearn",
      "AWD differential & transfer case fluid inspection",
    ],
  },
  {
    id: "pre-purchase",
    name: "Master Pre-Purchase Inspection (120-Point)",
    duration: "2.5 Hours",
    euroPrice: [320, 390],
    japPrice: [260, 330],
    suvPrice: [290, 360],
    dealerMultiplier: 1.35,
    includes: [
      "120-point digital mechanical, structural & safety audit",
      "Electronic paint depth gauge scan for hidden panel repair",
      "OBD-II freeze-frame audit & verified mileage validation",
      "Master Technician phone debrief with high-res photo gallery",
    ],
  },
];

export default function Page() {
  // Mobile Nav State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Estimator State
  const [category, setCategory] = useState<VehicleCategory>("euro");
  const [selectedScopeId, setSelectedScopeId] = useState("logbook-minor");

  // Booking Form State
  const [bookName, setBookName] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [bookEmail, setBookEmail] = useState("");
  const [bookVehicle, setBookVehicle] = useState("");
  const [bookService, setBookService] = useState("Logbook Servicing (Minor / Interim)");
  const [bookDate, setBookDate] = useState("");
  const [bookNotes, setBookNotes] = useState("");
  const [loanCarNeeded, setLoanCarNeeded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    reference: string;
    name: string;
    vehicle: string;
    service: string;
    date: string;
    loanCar: boolean;
  } | null>(null);

  // Detect scroll for sticky navbar
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

  const { priceRange, avgDealer, savings } = useMemo(() => {
    let rawRange: [number, number] = [0, 0];
    if (category === "euro") rawRange = currentScope.euroPrice;
    else if (category === "jap") rawRange = currentScope.japPrice;
    else rawRange = currentScope.suvPrice;

    const min = rawRange[0];
    const max = rawRange[1];
    const avgApex = (min + max) / 2;
    const estDealer = Math.round(avgApex * currentScope.dealerMultiplier);
    const estSavings = Math.round(estDealer - avgApex);

    return {
      priceRange: `$${min} – $${max}`,
      avgDealer: `$${estDealer}`,
      savings: `$${estSavings}`,
    };
  }, [category, currentScope]);

  // Apply estimator selection to booking form
  const handleApplyToBooking = () => {
    setBookService(currentScope.name);
    const bookingElement = document.getElementById("booking");
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Submit booking
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const refNumber = `APM-${Math.floor(10000 + Math.random() * 90000)}`;
      setBookingConfirmation({
        reference: refNumber,
        name: bookName || "Valued Client",
        vehicle: bookVehicle || "Vehicle on File",
        service: bookService,
        date: bookDate || "Next Available Morning",
        loanCar: loanCarNeeded,
      });
      setIsSubmitting(false);
    }, 500);
  };

  const handleResetBooking = () => {
    setBookingConfirmation(null);
    setBookName("");
    setBookPhone("");
    setBookEmail("");
    setBookVehicle("");
    setBookNotes("");
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] flex flex-col font-sans selection:bg-[#4A3AFF] selection:text-[#FFFFFF]">
      {/* 1. TOP AGENCY PORTFOLIO BANNER */}
      <aside
        aria-label="Agency Portfolio Demonstration"
        className="bg-[#F8F9FC] border-b border-[#E5E7EB] text-[#4F4F4F] text-xs py-2.5 px-4 relative z-50"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#4A3AFF]/10 border border-[#4A3AFF]/20 text-[#4A3AFF] font-bold text-[11px] tracking-wide uppercase">
              <Sparkles className="w-3 h-3 text-[#4A3AFF]" />
              Commercial Prototype
            </span>
            <span className="font-bold text-[#000000]">
              AGENCY PORTFOLIO DEMONSTRATION | High-Conversion Commercial Prototype by I.T Helpers
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#4A3AFF] font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A3AFF] animate-pulse" />
              mechanic.ithelpers.com.au
            </span>
            <a
              href="https://ithelpers.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-[#4A3AFF] hover:text-[#1557FF] font-semibold underline underline-offset-2 transition-colors"
            >
              Agency Website
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </aside>

      {/* 2. STICKY HEADER & NAVBAR */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E5E7EB]"
            : "bg-white border-b border-[#E5E7EB]/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-3 group focus:outline-none rounded-lg p-1"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#4A3AFF] text-white shadow-md shadow-[#4A3AFF]/25 transition-transform group-hover:scale-105">
                <Gauge className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg sm:text-xl tracking-tight text-[#000000] leading-none">
                  APEX <span className="text-[#4A3AFF]">PRECISION</span>
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-[#4F4F4F] mt-1">
                  Auto Specialists · Sydney NSW
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <a
                href="#services"
                className="text-sm font-semibold text-[#4F4F4F] hover:text-[#4A3AFF] transition-colors"
              >
                Services
              </a>
              <a
                href="#why-us"
                className="text-sm font-semibold text-[#4F4F4F] hover:text-[#4A3AFF] transition-colors"
              >
                Why Us
              </a>
              <a
                href="#estimator"
                className="text-sm font-semibold text-[#4F4F4F] hover:text-[#4A3AFF] transition-colors"
              >
                Pricing Estimator
              </a>
              <a
                href="#process"
                className="text-sm font-semibold text-[#4F4F4F] hover:text-[#4A3AFF] transition-colors"
              >
                Our Process
              </a>
              <a
                href="#packages"
                className="text-sm font-semibold text-[#4F4F4F] hover:text-[#4A3AFF] transition-colors"
              >
                Packages
              </a>
              <a
                href="#location"
                className="text-sm font-semibold text-[#4F4F4F] hover:text-[#4A3AFF] transition-colors"
              >
                Location &amp; Hours
              </a>
            </nav>

            {/* Direct Phone & Primary Pill Button */}
            <div className="hidden sm:flex items-center gap-4">
              <a
                href="tel:0289013400"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F8F9FC] hover:bg-[#F0F2F8] border border-[#E5E7EB] text-[#000000] text-sm font-bold transition-all group"
              >
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <Phone className="w-3.5 h-3.5 text-[#4A3AFF] group-hover:scale-110 transition-transform" />
                <span>(02) 8901 3400</span>
              </a>

              <a
                href="#booking"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4A3AFF] hover:bg-[#1557FF] text-white text-sm font-bold shadow-md shadow-[#4A3AFF]/20 hover:shadow-lg hover:shadow-[#4A3AFF]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Schedule an appointment</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href="tel:0289013400"
                aria-label="Call Workshop"
                className="sm:hidden p-2.5 rounded-full bg-[#F8F9FC] border border-[#E5E7EB] text-[#4A3AFF]"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl border border-[#E5E7EB] text-[#000000] hover:text-[#4A3AFF] focus:outline-none bg-[#F8F9FC]"
                aria-label="Toggle mobile navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#E5E7EB] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              {[
                { label: "Services", href: "#services" },
                { label: "Why Us", href: "#why-us" },
                { label: "Pricing Estimator", href: "#estimator" },
                { label: "Workshop Process", href: "#process" },
                { label: "Packages", href: "#packages" },
                { label: "Book Appointment", href: "#booking" },
                { label: "Location & Hours", href: "#location" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-[#000000] hover:bg-[#F8F9FC] hover:text-[#4A3AFF] transition-colors"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#AAADB0]" />
                </a>
              ))}
            </nav>
            <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2.5">
              <a
                href="tel:0289013400"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#F8F9FC] border border-[#E5E7EB] text-[#000000] font-bold text-sm"
              >
                <Phone className="w-4 h-4 text-[#4A3AFF]" />
                <span>Call Workshop: (02) 8901 3400</span>
              </a>
              <a
                href="#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#4A3AFF] text-white font-bold text-sm shadow-md"
              >
                <span>Schedule an appointment</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1">
        {/* 3. HERO SPLIT SECTION (High-Contrast Vehicle Imagery + CTA) */}
        <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 bg-[#FFFFFF] border-b border-[#E5E7EB] overflow-hidden">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-gradient-to-br from-[#4A3AFF]/5 via-[#1557FF]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headlines & Subtitle & Badges */}
              <div className="lg:col-span-6 flex flex-col items-start text-left">
                {/* Subtitle Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] text-xs font-bold uppercase tracking-wider mb-5">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Car Repair &amp; Specialists · Sydney</span>
                </div>

                {/* Massive Headline */}
                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-[#000000] tracking-tight leading-[1.08] mb-6">
                  Auto maintenance, <br className="hidden sm:inline" />
                  service <span className="text-[#4A3AFF]">&amp; repair</span>
                </h1>

                {/* Value Proposition */}
                <p className="text-base sm:text-lg text-[#4F4F4F] leading-relaxed mb-8 max-w-xl">
                  Dealer precision with independent honesty. We perform dealer-grade computer
                  diagnostics and statutory logbook servicing to exact manufacturer specifications—
                  <strong className="text-[#000000] font-bold">
                    {" "}maintaining your new car factory warranty{" "}
                  </strong>
                  with OEM parts, without dealership markups.
                </p>

                {/* Buttons Row */}
                <div className="flex flex-wrap items-center gap-3.5 mb-10">
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#4A3AFF] hover:bg-[#1557FF] text-white text-sm sm:text-base font-bold shadow-lg shadow-[#4A3AFF]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Schedule an appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#services"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#F8F9FC] border border-[#E5E7EB] text-[#000000] text-sm sm:text-base font-bold transition-colors"
                  >
                    <span>Browse services</span>
                  </a>
                </div>

                {/* Badges / Proof Strip */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#E5E7EB]">
                  {/* Badge 1 */}
                  <div className="p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] flex items-start gap-3">
                    <div className="p-2 rounded-full bg-[#10B981]/15 text-[#10B981] shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#000000] leading-snug">
                        Warranty Protected
                      </div>
                      <div className="text-[11px] text-[#4F4F4F] mt-0.5 leading-snug">
                        100% ACL compliant
                      </div>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div className="p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] flex items-start gap-3">
                    <div className="p-2 rounded-full bg-[#4A3AFF]/15 text-[#4A3AFF] shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#000000] leading-snug">
                        OEM Direct Parts
                      </div>
                      <div className="text-[11px] text-[#4F4F4F] mt-0.5 leading-snug">
                        Bosch, Mahle, Brembo
                      </div>
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div className="p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] flex items-start gap-3">
                    <div className="p-2 rounded-full bg-[#1557FF]/15 text-[#1557FF] shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#000000] leading-snug">
                        24-Mo Guarantee
                      </div>
                      <div className="text-[11px] text-[#4F4F4F] mt-0.5 leading-snug">
                        20,000km warranty
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero High-Contrast Vehicle Imagery (CarRepair X Style) */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-2xl group bg-[#000000]">
                  {/* Vehicle Image */}
                  <img
                    src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80"
                    alt="European & Japanese Automotive Specialist Precision Engineering"
                    className="w-full h-[380px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                  />
                  {/* Angular Cut Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Floating Tech Pill Badge */}
                  <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold text-[#000000] flex items-center gap-2 shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                    <span>Certified Master Technicians On Duty</span>
                  </div>

                  {/* Bottom Stats Banner inside Image */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#AAADB0] font-bold">
                        Specialist Marque Diagnostic Suite
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                        BMW M · AMG · Audi RS · Porsche · Lexus
                      </div>
                    </div>
                    <a
                      href="#estimator"
                      className="px-4 py-2 rounded-full bg-[#4A3AFF] hover:bg-[#1557FF] text-white text-xs font-bold transition-colors shrink-0"
                    >
                      Instant Estimate →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. INTERACTIVE SERVICE ESTIMATOR SECTION */}
        <section id="estimator" className="py-16 bg-[#F8F9FC] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] text-xs font-bold uppercase tracking-wider mb-3">
                Transparent Pricing
              </div>
              <h2 className="text-3xl font-black text-[#000000] tracking-tight">
                Instant Service Estimator
              </h2>
              <p className="text-sm text-[#4F4F4F] mt-1">
                Select your vehicle platform and required service scope to view transparent Sydney rates.
              </p>
            </div>

            <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-8 shadow-xl shadow-[#14142B]/5">
              {/* Category Tabs: Euro, Jap, SUV */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-3">
                  1. Select Vehicle Platform
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "euro", label: "Euro Performance", sub: "BMW, Benz, Audi, Porsche, VW" },
                    { id: "jap", label: "Japanese Precision", sub: "Lexus, Toyota GR, Subaru, Honda" },
                    { id: "suv", label: "Performance SUV", sub: "Macan, X5, RS Q8, Prado" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCategory(t.id as VehicleCategory)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        category === t.id
                          ? "bg-[#4A3AFF] border-[#4A3AFF] text-white shadow-md shadow-[#4A3AFF]/20"
                          : "bg-[#F8F9FC] border-[#E5E7EB] text-[#4F4F4F] hover:border-[#4A3AFF]/40"
                      }`}
                    >
                      <div className={`text-xs font-bold ${category === t.id ? "text-white" : "text-[#000000]"}`}>
                        {t.label}
                      </div>
                      <div className={`text-[11px] mt-0.5 truncate ${category === t.id ? "text-white/80" : "text-[#AAADB0]"}`}>
                        {t.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Scope Selector */}
              <div className="mt-6">
                <label
                  htmlFor="scope-selector"
                  className="block text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-2"
                >
                  2. Select Service Scope
                </label>
                <select
                  id="scope-selector"
                  value={selectedScopeId}
                  onChange={(e) => setSelectedScopeId(e.target.value)}
                  className="w-full bg-[#F8F9FC] border border-[#E5E7EB] focus:border-[#4A3AFF] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-[#000000] cursor-pointer font-medium"
                >
                  {SERVICE_SCOPES.map((scope) => (
                    <option key={scope.id} value={scope.id}>
                      {scope.name} ({scope.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Calculated Price & Savings Box */}
              <div className="mt-6 p-5 sm:p-6 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[#4F4F4F] font-semibold">
                      Estimated Apex Workshop Investment
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-[#000000] tracking-tight">
                        {priceRange}
                      </span>
                      <span className="text-xs text-[#4F4F4F]">inc. GST</span>
                    </div>
                    <div className="text-xs text-[#4A3AFF] font-bold mt-1.5 flex items-center gap-2">
                      <span>Franchised dealership quote: ~{avgDealer}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] font-bold">
                        Save ~{savings}
                      </span>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-bold text-[#000000]">
                      <Clock className="w-3.5 h-3.5 text-[#4A3AFF]" />
                      <span>{currentScope.duration}</span>
                    </div>
                    <div className="text-[11px] text-[#4F4F4F] mt-1 font-medium">
                      Same-day drop-off 7:30 AM
                    </div>
                  </div>
                </div>

                {/* What is Included */}
                <div className="mt-5 pt-4 border-t border-[#E5E7EB] space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#000000] mb-2">
                    Included with this service:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentScope.includes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#4F4F4F]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={handleApplyToBooking}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[#4A3AFF] hover:bg-[#1557FF] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#4A3AFF]/20 transition-all"
                >
                  <span>Lock In Estimate &amp; Proceed to Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ABOUT / "WHAT MAKES US DIFFERENT" (Technician Imagery) */}
        <section id="why-us" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E5E7EB] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Technician Imagery */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xl group bg-[#000000]">
                  <img
                    src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"
                    alt="Certified Master Technician Interrogating Diagnostics"
                    className="w-full h-[420px] sm:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105 opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  
                  {/* Floating Tags */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#000000] border border-[#E5E7EB] shadow">
                    Guild Certified Technicians
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
                    <div className="text-xs font-bold">18+ Years Specialized Trade Experience</div>
                    <div className="text-[11px] text-[#AAADB0] mt-0.5">
                      European Guild trained with dedicated oscilloscope telemetry.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Copy & Benefits */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] text-xs font-bold uppercase tracking-wider mb-4">
                  Why Us
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#000000] tracking-tight mb-6">
                  What makes us different?
                </h2>
                <p className="text-base text-[#4F4F4F] leading-relaxed mb-6">
                  Unlike volume dealership service departments staffed by first-year apprentices under
                  commission-driven quotas, Apex Precision Mechanical is operated by Master Guild
                  Technicians dedicated to precision European and Japanese automotive engineering.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB]">
                    <div className="text-sm font-bold text-[#000000] mb-1">
                      Direct Photo &amp; Video Walkaround
                    </div>
                    <div className="text-xs text-[#4F4F4F]">
                      High-resolution photographic evidence sent to your phone before any wrench turns.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB]">
                    <div className="text-sm font-bold text-[#000000] mb-1">
                      Zero Commission Upsells
                    </div>
                    <div className="text-xs text-[#4F4F4F]">
                      Honest advisory. We never bill for unneeded flushes or surprise add-on services.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB]">
                    <div className="text-sm font-bold text-[#000000] mb-1">
                      Complimentary Loan Cars
                    </div>
                    <div className="text-xs text-[#4F4F4F]">
                      Clean automatic courtesy vehicles available free upon booking reservation.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB]">
                    <div className="text-sm font-bold text-[#000000] mb-1">
                      24-Mo / 20k km Guarantee
                    </div>
                    <div className="text-xs text-[#4F4F4F]">
                      Complete nationwide warranty backing every supplied part and workshop labor hour.
                    </div>
                  </div>
                </div>

                <a
                  href="#booking"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#4A3AFF] hover:bg-[#1557FF] text-white text-sm font-bold shadow-md shadow-[#4A3AFF]/20 transition-all"
                >
                  <span>Schedule an appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 6. SERVICES MATRIX (With Capability Images) */}
        <section id="services" className="py-20 lg:py-28 bg-[#F8F9FC] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] text-xs font-bold uppercase tracking-wider mb-4">
                Services
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#000000] tracking-tight mb-4">
                We offer a wide range of car services
              </h2>
              <p className="text-sm sm:text-base text-[#4F4F4F] leading-relaxed">
                Dealer-grade engineering performed strictly according to factory technical handbooks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Service 1: Maintenance / Engine Bay (Image: 1486006920555-c77dce18193b) */}
              <div className="rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4A3AFF] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#4A3AFF]/5 group">
                <div>
                  <div className="relative h-48 overflow-hidden bg-black">
                    <img
                      src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80"
                      alt="Engine Bay Scheduled Logbook Servicing"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 text-[#10B981] shadow">
                        100% Warranty Safe
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-black text-[#000000] mb-2 group-hover:text-[#4A3AFF] transition-colors">
                      Logbook Servicing &amp; Maintenance
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4F4F4F] leading-relaxed mb-4">
                      Manufacturer interval servicing preserving factory warranty terms. Digital service
                      books stamped and updated on manufacturer cloud records.
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#000000]">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0" />
                        <span>OEM synthetic oils &amp; Mann/Mahle filtration</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0" />
                        <span>62-point digital mechanical audit</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="p-6 pt-0 border-t border-[#E5E7EB]/60 mt-4 flex justify-between items-center text-xs">
                  <span className="font-mono text-[#AAADB0]">ISTA · ODIS · Xentry</span>
                  <a href="#booking" className="font-bold text-[#4A3AFF] hover:underline flex items-center gap-1">
                    Book Service <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Service 2: Brakes & Wheels (Image: 1625047509168-a7026f36de04) */}
              <div className="rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4A3AFF] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#4A3AFF]/5 group">
                <div>
                  <div className="relative h-48 overflow-hidden bg-black">
                    <img
                      src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=800&q=80"
                      alt="Performance Brakes & Caliper Hydraulics"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 text-[#1557FF] shadow">
                        Brembo Tier-1
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-black text-[#000000] mb-2 group-hover:text-[#4A3AFF] transition-colors">
                      Performance Brakes &amp; Wheels
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4F4F4F] leading-relaxed mb-4">
                      Rotor micrometer runout testing, Brembo friction compound pads, high-temperature
                      hygroscopic fluid tests, and caliper hydraulic rebuilds.
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#000000]">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0" />
                        <span>Brembo, Pagid &amp; Textar compounds</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0" />
                        <span>DOT 4/5.1 pressure fluid flush</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="p-6 pt-0 border-t border-[#E5E7EB]/60 mt-4 flex justify-between items-center text-xs">
                  <span className="font-mono text-[#AAADB0]">Micrometer Calibrated</span>
                  <a href="#booking" className="font-bold text-[#4A3AFF] hover:underline flex items-center gap-1">
                    Book Service <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Service 3: Computer Diagnostics (Image: 1563720223185-11003d516935) */}
              <div className="rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4A3AFF] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#4A3AFF]/5 group">
                <div>
                  <div className="relative h-48 overflow-hidden bg-black">
                    <img
                      src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"
                      alt="Computer Diagnostics & Electronic ECU Interrogation"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 text-[#4A3AFF] shadow">
                        Factory Telemetry
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-black text-[#000000] mb-2 group-hover:text-[#4A3AFF] transition-colors">
                      Computer Diagnostics &amp; ECU
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4F4F4F] leading-relaxed mb-4">
                      Interrogation of proprietary CAN-bus and FlexRay networks. Live sensor waveform
                      analysis and oscilloscope testing for zero guesswork.
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#000000]">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0" />
                        <span>Deep ECU module fault decoding</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0" />
                        <span>PicoScope 4-channel wave isolation</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="p-6 pt-0 border-t border-[#E5E7EB]/60 mt-4 flex justify-between items-center text-xs">
                  <span className="font-mono text-[#AAADB0]">ISTA · ODIS · Techstream</span>
                  <a href="#booking" className="font-bold text-[#4A3AFF] hover:underline flex items-center gap-1">
                    Book Service <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Service 4: Driveline & DSG / ZF */}
              <div className="rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4A3AFF] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-[#4A3AFF]/5 group">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] flex items-center justify-center group-hover:bg-[#4A3AFF] group-hover:text-white transition-colors">
                      <Cog className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF]">
                      ZF &amp; DSG
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#000000] mb-2 group-hover:text-[#4A3AFF] transition-colors">
                    Driveline &amp; DSG / ZF
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4F4F4F] leading-relaxed mb-5">
                    Specialist transmission fluid replacement and clutch adaptation resets for ZF
                    8-Speed, dual-clutch DSG/S-Tronic, and Haldex AWD couplings.
                  </p>
                  <ul className="space-y-2 text-xs text-[#000000] mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0" />
                      <span>ZF Lifeguard Fluid &amp; filter pan kits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0" />
                      <span>Haldex pump screen maintenance</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB] flex justify-between items-center text-xs">
                  <span className="font-mono text-[#AAADB0]">Mechatronic Adaptation</span>
                  <a href="#booking" className="font-bold text-[#4A3AFF] hover:underline flex items-center gap-1">
                    Book Service <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Service 5: Suspension & 3D Alignment */}
              <div className="rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4A3AFF] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-[#4A3AFF]/5 group">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] flex items-center justify-center group-hover:bg-[#4A3AFF] group-hover:text-white transition-colors">
                      <Compass className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#1557FF]/10 text-[#1557FF]">
                      3D Laser Precision
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#000000] mb-2 group-hover:text-[#4A3AFF] transition-colors">
                    Suspension &amp; 3D Alignment
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4F4F4F] leading-relaxed mb-5">
                    Hunter HawkEye 3D laser geometry calibration, control arm hydraulic bushing
                    pressing, and Bilstein/KW damper replacements.
                  </p>
                  <ul className="space-y-2 text-xs text-[#000000] mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0" />
                      <span>Hunter 3D laser toe/camber setup</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0" />
                      <span>Hydraulic bushing press extraction</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB] flex justify-between items-center text-xs">
                  <span className="font-mono text-[#AAADB0]">Hunter HawkEye 3D</span>
                  <a href="#booking" className="font-bold text-[#4A3AFF] hover:underline flex items-center gap-1">
                    Book Service <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Service 6: Pre-Purchase Inspections */}
              <div className="rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4A3AFF] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-[#4A3AFF]/5 group">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] flex items-center justify-center group-hover:bg-[#4A3AFF] group-hover:text-white transition-colors">
                      <SearchCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981]">
                      120-Point Audit
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#000000] mb-2 group-hover:text-[#4A3AFF] transition-colors">
                    Pre-Purchase Inspections
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4F4F4F] leading-relaxed mb-5">
                    Rigorous appraisal for pre-owned European and Japanese performance vehicles. Digital
                    paint depth gauge audit and live ECU freeze-frame scan.
                  </p>
                  <ul className="space-y-2 text-xs text-[#000000] mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0" />
                      <span>Digital paint depth accident check</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4A3AFF] shrink-0" />
                      <span>Phone consultation with Master Tech</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB] flex justify-between items-center text-xs">
                  <span className="font-mono text-[#AAADB0]">Comprehensive PDF</span>
                  <a href="#booking" className="font-bold text-[#4A3AFF] hover:underline flex items-center gap-1">
                    Book Service <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. OUR NUMBERS / STATS (CarRepair X Style) */}
        <section className="py-20 lg:py-24 bg-[#000000] text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#4A3AFF] text-xs font-bold uppercase tracking-wider mb-4">
                Our Numbers
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Satisfied Customers Across Sydney
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/15">
              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                  18<span className="text-[#4A3AFF]">+</span>
                </div>
                <div className="text-xs sm:text-sm text-[#AAADB0] mt-2 font-medium">
                  Years of European Specialization
                </div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                  50<span className="text-[#4A3AFF]">k</span>
                </div>
                <div className="text-xs sm:text-sm text-[#AAADB0] mt-2 font-medium">
                  Precision Services Completed
                </div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                  99<span className="text-[#4A3AFF]">%</span>
                </div>
                <div className="text-xs sm:text-sm text-[#AAADB0] mt-2 font-medium">
                  Customer Satisfaction Rate
                </div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-6xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
                  4.9 <Star className="w-8 h-8 fill-[#4A3AFF] text-[#4A3AFF]" />
                </div>
                <div className="text-xs sm:text-sm text-[#AAADB0] mt-2 font-medium">
                  Verified Google Reviews
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. WORKSHOP PROCESS (4-STEP WORKFLOW) */}
        <section id="process" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] text-xs font-bold uppercase tracking-wider mb-4">
                The Process
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#000000] tracking-tight mb-4">
                Our 4-Step Workshop Process
              </h2>
              <p className="text-sm sm:text-base text-[#4F4F4F] leading-relaxed">
                Clear, transparent communication from key drop to handover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB] relative">
                <div className="w-10 h-10 rounded-full bg-[#4A3AFF] text-white font-mono font-bold text-sm flex items-center justify-center mb-4 shadow-sm">
                  01
                </div>
                <h3 className="text-base font-bold text-[#000000] mb-2">Diagnostic Check-in</h3>
                <p className="text-xs text-[#4F4F4F] leading-relaxed">
                  Vehicle received at 7:30 AM drop-off or via 24/7 key safe. Initial computer bus scan
                  performed and physical walkaround logged.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB] relative">
                <div className="w-10 h-10 rounded-full bg-[#4A3AFF] text-white font-mono font-bold text-sm flex items-center justify-center mb-4 shadow-sm">
                  02
                </div>
                <h3 className="text-base font-bold text-[#000000] mb-2">Direct Photo Quotation</h3>
                <p className="text-xs text-[#4F4F4F] leading-relaxed">
                  You receive an SMS/email report with high-res photos showing wear levels (pad thickness,
                  bushing splits, fluid condition) with transparent quotes.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB] relative">
                <div className="w-10 h-10 rounded-full bg-[#4A3AFF] text-white font-mono font-bold text-sm flex items-center justify-center mb-4 shadow-sm">
                  03
                </div>
                <h3 className="text-base font-bold text-[#000000] mb-2">Precision Execution</h3>
                <p className="text-xs text-[#4F4F4F] leading-relaxed">
                  Certified Master Technicians install genuine OEM parts torqued to factory specifications.
                  Zero shortcuts or unauthorized aftermarket substitutions.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB] relative">
                <div className="w-10 h-10 rounded-full bg-[#4A3AFF] text-white font-mono font-bold text-sm flex items-center justify-center mb-4 shadow-sm">
                  04
                </div>
                <h3 className="text-base font-bold text-[#000000] mb-2">Handover &amp; Warranty</h3>
                <p className="text-xs text-[#4F4F4F] leading-relaxed">
                  Digital logbooks stamped, service reminder resets executed, complimentary wash completed,
                  and 24-month/20,000km warranty issued.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. PACKAGES SECTION */}
        <section id="packages" className="py-20 lg:py-28 bg-[#F8F9FC] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] text-xs font-bold uppercase tracking-wider mb-4">
                Packages
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#000000] tracking-tight mb-4">
                Packages for all types of cars
              </h2>
              <p className="text-sm sm:text-base text-[#4F4F4F] leading-relaxed">
                Clear, transparent pricing tiers with 100% manufacturer warranty compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Starter Package */}
              <div className="rounded-2xl bg-white border border-[#E5E7EB] p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-2">
                    Interim Care
                  </div>
                  <h3 className="text-2xl font-black text-[#000000] mb-2">Starter Logbook</h3>
                  <div className="text-3xl font-black text-[#000000] mb-4">
                    $280 – $380 <span className="text-xs font-normal text-[#4F4F4F]">inc. GST</span>
                  </div>
                  <p className="text-xs text-[#4F4F4F] mb-6">
                    Essential manufacturer scheduled interval maintenance for smooth daily driving.
                  </p>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#000000] mb-3">
                    What is included:
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#4F4F4F]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>OEM synthetic engine oil replacement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>Mann / Mahle genuine oil filter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>62-point digital safety inspection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>OBD-II computer fault code scan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>Digital logbook stamp</span>
                    </li>
                  </ul>
                </div>
                <a
                  href="#booking"
                  className="mt-8 w-full py-3.5 rounded-full bg-[#F8F9FC] hover:bg-[#E5E7EB] border border-[#E5E7EB] text-[#000000] text-xs font-bold text-center transition-colors"
                >
                  Book Starter Package
                </a>
              </div>

              {/* Complete Major Package (Featured) */}
              <div className="rounded-2xl bg-white border-2 border-[#4A3AFF] p-8 shadow-xl shadow-[#4A3AFF]/10 flex flex-col justify-between relative transform lg:-translate-y-2">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#4A3AFF] text-white text-xs font-bold tracking-wide uppercase shadow">
                  Most Popular
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#4A3AFF] mb-2 mt-1">
                    Full Scheduled Care
                  </div>
                  <h3 className="text-2xl font-black text-[#000000] mb-2">Comprehensive Major</h3>
                  <div className="text-3xl font-black text-[#000000] mb-4">
                    $580 – $780 <span className="text-xs font-normal text-[#4F4F4F]">inc. GST</span>
                  </div>
                  <p className="text-xs text-[#4F4F4F] mb-6">
                    Full factory major servicing covering fluids, spark plugs, filters and brake hydraulics.
                  </p>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#000000] mb-3">
                    What is included:
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#000000]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>All Starter inclusions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>Engine air &amp; cabin pollen microfilter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>Spark plug renewal or diesel fuel filter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>Brake fluid hygroscopic boil test &amp; flush</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>Suspension torque audit &amp; tyre rotation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>Complimentary courtesy loan vehicle</span>
                    </li>
                  </ul>
                </div>
                <a
                  href="#booking"
                  className="mt-8 w-full py-3.5 rounded-full bg-[#4A3AFF] hover:bg-[#1557FF] text-white text-xs font-bold text-center shadow-md transition-all"
                >
                  Book Comprehensive Major
                </a>
              </div>

              {/* Performance / Track Care */}
              <div className="rounded-2xl bg-white border border-[#E5E7EB] p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-2">
                    High Performance
                  </div>
                  <h3 className="text-2xl font-black text-[#000000] mb-2">M &amp; AMG Performance</h3>
                  <div className="text-3xl font-black text-[#000000] mb-4">
                    Custom Quote <span className="text-xs font-normal text-[#4F4F4F]">tailored</span>
                  </div>
                  <p className="text-xs text-[#4F4F4F] mb-6">
                    Dedicated maintenance for BMW M, Mercedes-AMG, Audi RS, and Porsche GT platforms.
                  </p>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#000000] mb-3">
                    What is included:
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#4F4F4F]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>Dedicated motorsport-grade fluids (Motul 300V)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>Brembo / AP Racing brake fluid flush</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>Hunter 3D laser alignment calibration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>ZF 8-speed / DCT transmission analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A3AFF] shrink-0" />
                      <span>High-resolution telemetry report</span>
                    </li>
                  </ul>
                </div>
                <a
                  href="#booking"
                  className="mt-8 w-full py-3.5 rounded-full bg-[#F8F9FC] hover:bg-[#E5E7EB] border border-[#E5E7EB] text-[#000000] text-xs font-bold text-center transition-colors"
                >
                  Consult Master Technician
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 10. TESTIMONIALS SECTION */}
        <section className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] text-xs font-bold uppercase tracking-wider mb-4">
                Testimonials
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#000000] tracking-tight mb-4">
                What our clients say about us
              </h2>
              <p className="text-sm sm:text-base text-[#4F4F4F] leading-relaxed">
                Independent excellence praised by Sydney European and performance Japanese drivers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB] p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#4A3AFF] text-[#4A3AFF]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#4F4F4F] leading-relaxed italic mb-6">
                    "BMW Sydney quoted me $1,480 for a major service and wanted another $600 for
                    transmission fluids. Apex completed the entire factory logbook, stamped the digital
                    iDrive service history, and gave me a courtesy loan car. Flawless honesty."
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#000000]">Julian Thornton</div>
                    <div className="text-[11px] text-[#4F4F4F]">Paddington, NSW</div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#4A3AFF]">2022 BMW M340i</div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB] p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#4A3AFF] text-[#4A3AFF]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#4F4F4F] leading-relaxed italic mb-6">
                    "Finding an independent mechanic in Sydney who actually understands Haldex AWD pumps
                    and Audi S-Tronic transmissions is rare. They sent high-resolution video proof of pad
                    thickness before commencing any work. Highly recommended."
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#000000]">Marcus Vance</div>
                    <div className="text-[11px] text-[#4F4F4F]">Surry Hills, NSW</div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#4A3AFF]">2021 Audi RS3</div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="rounded-2xl bg-[#F8F9FC] border border-[#E5E7EB] p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#4A3AFF] text-[#4A3AFF]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#4F4F4F] leading-relaxed italic mb-6">
                    "Maintained my statutory factory new car warranty at almost half the dealer cost. The
                    loan car made my commute into the CBD seamless. Car was returned immaculate with an
                    engine bay wipe-down. Apex is now our permanent workshop."
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#000000]">Elena Ross</div>
                    <div className="text-[11px] text-[#4F4F4F]">Alexandria, NSW</div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#4A3AFF]">2023 Lexus IS350</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. INTERACTIVE APPOINTMENT FORM */}
        <section id="booking" className="py-20 lg:py-28 bg-[#F8F9FC] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] text-xs font-bold uppercase tracking-wider mb-4">
                Schedule an Appointment
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#000000] tracking-tight mb-4">
                Book your car service online
              </h2>
              <p className="text-sm sm:text-base text-[#4F4F4F] leading-relaxed">
                Fast confirmation with certified Master Technicians. Free courtesy loan car upon request.
              </p>
            </div>

            {bookingConfirmation ? (
              /* Success Confirmation Card */
              <div className="max-w-2xl mx-auto rounded-2xl bg-white border-2 border-[#10B981] p-8 sm:p-10 shadow-xl text-center">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-mono font-bold uppercase tracking-wider">
                  Appointment Confirmed
                </span>
                <h3 className="text-2xl font-black text-[#000000] mt-4 mb-2">
                  Thank You, {bookingConfirmation.name}!
                </h3>
                <p className="text-xs sm:text-sm text-[#4F4F4F] max-w-md mx-auto mb-6">
                  Your workshop slot is confirmed. An SMS check-in notice has been scheduled for your drop-off morning.
                </p>

                <div className="p-5 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] text-left mb-6 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2.5 border-b border-[#E5E7EB]">
                    <span className="text-[#4F4F4F] uppercase font-bold">Reference Code</span>
                    <span className="font-mono font-bold text-[#4A3AFF] text-sm">
                      {bookingConfirmation.reference}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4F4F4F]">Vehicle:</span>
                    <span className="text-[#000000] font-bold">{bookingConfirmation.vehicle}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4F4F4F]">Service:</span>
                    <span className="text-[#000000] font-bold text-right max-w-[240px] truncate">
                      {bookingConfirmation.service}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4F4F4F]">Date:</span>
                    <span className="text-[#10B981] font-bold">{bookingConfirmation.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4F4F4F]">Loan Car:</span>
                    <span className="text-[#000000] font-bold">
                      {bookingConfirmation.loanCar ? "Yes (Reserved)" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#E5E7EB]">
                    <span className="text-[#4F4F4F]">Workshop:</span>
                    <span className="text-[#000000]">42 Collins St, Alexandria NSW</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="tel:0289013400"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#F8F9FC] border border-[#E5E7EB] text-xs font-bold text-[#000000]"
                  >
                    <Phone className="w-4 h-4 text-[#4A3AFF]" />
                    <span>Call Workshop: (02) 8901 3400</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleResetBooking}
                    className="px-6 py-3 rounded-full bg-[#4A3AFF] text-white text-xs font-bold shadow"
                  >
                    Submit Another Appointment
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-10 shadow-lg">
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="form-name"
                        className="block text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        placeholder="e.g. John Smith"
                        required
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                        className="w-full bg-[#F8F9FC] border border-[#E5E7EB] focus:border-[#4A3AFF] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-[#000000]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="form-phone"
                        className="block text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-1.5"
                      >
                        Phone Number *
                      </label>
                      <input
                        id="form-phone"
                        type="tel"
                        placeholder="e.g. 0412 345 678"
                        required
                        value={bookPhone}
                        onChange={(e) => setBookPhone(e.target.value)}
                        className="w-full bg-[#F8F9FC] border border-[#E5E7EB] focus:border-[#4A3AFF] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-[#000000]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="form-email"
                        className="block text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-1.5"
                      >
                        Email Address
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        placeholder="e.g. client@example.com.au"
                        value={bookEmail}
                        onChange={(e) => setBookEmail(e.target.value)}
                        className="w-full bg-[#F8F9FC] border border-[#E5E7EB] focus:border-[#4A3AFF] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-[#000000]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="form-vehicle"
                        className="block text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-1.5"
                      >
                        Vehicle Rego / Model *
                      </label>
                      <input
                        id="form-vehicle"
                        type="text"
                        placeholder="e.g. APX-92K (2022 BMW M340i)"
                        required
                        value={bookVehicle}
                        onChange={(e) => setBookVehicle(e.target.value)}
                        className="w-full bg-[#F8F9FC] border border-[#E5E7EB] focus:border-[#4A3AFF] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-[#000000]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="form-service"
                        className="block text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-1.5"
                      >
                        Service Required *
                      </label>
                      <select
                        id="form-service"
                        value={bookService}
                        onChange={(e) => setBookService(e.target.value)}
                        className="w-full bg-[#F8F9FC] border border-[#E5E7EB] focus:border-[#4A3AFF] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-[#000000]"
                      >
                        <option value="Logbook Servicing (Minor / Interim)">
                          Logbook Servicing (Minor / Interim)
                        </option>
                        <option value="Comprehensive Logbook Service (Major)">
                          Comprehensive Logbook Service (Major)
                        </option>
                        <option value="Performance Brake Pad & Rotor Overhaul">
                          Performance Brake Pad & Rotor Overhaul
                        </option>
                        <option value="Computer Diagnostics & ECU Fault Isolation">
                          Computer Diagnostics & ECU Fault Isolation
                        </option>
                        <option value="Driveline & DSG / ZF Transmission Service">
                          Driveline & DSG / ZF Transmission Service
                        </option>
                        <option value="Master Pre-Purchase Inspection (120-Point)">
                          Master Pre-Purchase Inspection (120-Point)
                        </option>
                        <option value="Suspension, Steering & 3D Alignment">
                          Suspension, Steering & 3D Alignment
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="form-date"
                        className="block text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-1.5"
                      >
                        Preferred Date *
                      </label>
                      <input
                        id="form-date"
                        type="date"
                        required
                        value={bookDate}
                        onChange={(e) => setBookDate(e.target.value)}
                        className="w-full bg-[#F8F9FC] border border-[#E5E7EB] focus:border-[#4A3AFF] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-[#000000]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] cursor-pointer hover:border-[#4A3AFF] transition-colors">
                      <input
                        type="checkbox"
                        checked={loanCarNeeded}
                        onChange={(e) => setLoanCarNeeded(e.target.checked)}
                        className="w-4 h-4 rounded text-[#4A3AFF] focus:ring-[#4A3AFF]"
                      />
                      <span className="text-xs text-[#000000] font-bold flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-[#4A3AFF]" />
                        Request Complimentary Courtesy Loan Car (Subject to availability)
                      </span>
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="form-notes"
                      className="block text-xs font-bold uppercase tracking-wider text-[#4F4F4F] mb-1.5"
                    >
                      Notes / Symptoms / Specific Requests
                    </label>
                    <textarea
                      id="form-notes"
                      rows={3}
                      placeholder="e.g. Squeal under light braking, check tyre pressures, or specific drop-off details..."
                      value={bookNotes}
                      onChange={(e) => setBookNotes(e.target.value)}
                      className="w-full bg-[#F8F9FC] border border-[#E5E7EB] focus:border-[#4A3AFF] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-[#000000]"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-[#4F4F4F] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                      Zero prepayment required · Pay upon completion
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#4A3AFF] hover:bg-[#1557FF] text-white font-bold text-sm shadow-lg shadow-[#4A3AFF]/20 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Schedule an appointment →"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* 12. WORKSHOP DETAILS & LOCATION */}
        <section id="location" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] text-xs font-bold uppercase tracking-wider mb-4">
                Locations
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#000000] tracking-tight mb-4">
                We have a car workshop near you
              </h2>
              <p className="text-sm sm:text-base text-[#4F4F4F] leading-relaxed">
                Centrally located in Sydney's automotive precinct, 5 minutes from Green Square Station.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Location Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl bg-white border border-[#E5E7EB] p-7 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-[#000000] pb-3 border-b border-[#E5E7EB]">
                    Alexandria Workshop HQ
                  </h3>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-full bg-[#4A3AFF]/10 text-[#4A3AFF] shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#4F4F4F]">
                        Address
                      </div>
                      <div className="text-sm font-bold text-[#000000] mt-0.5">
                        42 Collins Street, Alexandria NSW 2015
                      </div>
                      <div className="text-xs text-[#4F4F4F] mt-0.5">Sydney NSW Metropolitan Area</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-full bg-[#10B981]/10 text-[#10B981] shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#4F4F4F]">
                        Direct Line
                      </div>
                      <a
                        href="tel:0289013400"
                        className="text-lg font-black text-[#000000] hover:text-[#4A3AFF] transition-colors mt-0.5 block"
                      >
                        (02) 8901 3400
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-full bg-[#1557FF]/10 text-[#1557FF] shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#4F4F4F]">
                        Email Enquiries
                      </div>
                      <a
                        href="mailto:service@mechanic.ithelpers.com.au"
                        className="text-xs sm:text-sm font-medium text-[#000000] hover:text-[#4A3AFF] transition-colors mt-0.5 block"
                      >
                        service@mechanic.ithelpers.com.au
                      </a>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5E7EB]">
                    <a
                      href="https://maps.google.com/?q=42+Collins+Street+Alexandria+NSW+2015"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A3AFF] hover:underline"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Operating Hours & Key Drop */}
                <div className="rounded-2xl bg-white border border-[#E5E7EB] p-7 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                    <h3 className="text-sm font-bold text-[#000000] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#4A3AFF]" />
                      Workshop Operating Hours
                    </h3>
                    <span className="text-[11px] font-mono font-bold text-[#10B981]">Open Mon–Sat</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-[#E5E7EB]/60">
                      <span className="text-[#000000] font-medium">Monday – Friday</span>
                      <span className="font-mono text-[#000000] font-bold">7:30 AM – 5:30 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#E5E7EB]/60">
                      <span className="text-[#000000] font-medium">Saturday</span>
                      <span className="font-mono text-[#000000] font-bold">8:00 AM – 1:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#4F4F4F]">Sunday</span>
                      <span className="font-mono text-[#4F4F4F]">Closed (Key Safe Open)</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] text-xs text-[#4F4F4F] flex items-start gap-2.5">
                    <KeyRound className="w-4 h-4 text-[#4A3AFF] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#000000]">24/7 Secure Key Drop-Box Safe:</strong> Early drop-off before 7:30 AM or late pickups after 5:30 PM handled via secure encrypted wall safe.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Amenities & Directions */}
              <div className="lg:col-span-7 rounded-2xl bg-white border border-[#E5E7EB] p-7 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <h3 className="text-base font-black text-[#000000]">
                      Facility &amp; Transport Access
                    </h3>
                    <p className="text-xs text-[#4F4F4F]">
                      Dedicated customer bays and easy railway transit
                    </p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=42+Collins+Street+Alexandria+NSW+2015"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4A3AFF] text-white text-xs font-bold hover:bg-[#1557FF] transition-colors w-fit"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] text-center">
                    <Train className="w-5 h-5 text-[#4A3AFF] mx-auto mb-1.5" />
                    <div className="text-xs font-bold text-[#000000]">Green Square</div>
                    <div className="text-[10px] text-[#4F4F4F]">5 min walk</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] text-center">
                    <Car className="w-5 h-5 text-[#4A3AFF] mx-auto mb-1.5" />
                    <div className="text-xs font-bold text-[#000000]">Loan Cars</div>
                    <div className="text-[10px] text-[#4F4F4F]">Free on booking</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] text-center">
                    <Coffee className="w-5 h-5 text-[#4A3AFF] mx-auto mb-1.5" />
                    <div className="text-xs font-bold text-[#000000]">Customer Lounge</div>
                    <div className="text-[10px] text-[#4F4F4F]">Espresso bar</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] text-center">
                    <Wifi className="w-5 h-5 text-[#4A3AFF] mx-auto mb-1.5" />
                    <div className="text-xs font-bold text-[#000000]">High-Speed Wi-Fi</div>
                    <div className="text-[10px] text-[#4F4F4F]">Quiet work desks</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E5E7EB] text-xs text-[#4F4F4F] leading-relaxed">
                  <strong className="text-[#000000]">Parking &amp; Low-Clearance Access:</strong> Dedicated on-site customer bays. Engineered with flat approach ramps suitable for performance and lowered sports cars (BMW M, Porsche GT, Audi RS, Type R).
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 13. FOOTER */}
      <footer className="bg-[#000000] text-white pb-24 md:pb-12 pt-16 border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/15">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4A3AFF] text-white">
                  <Gauge className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg tracking-tight text-white">
                    APEX <span className="text-[#4A3AFF]">PRECISION</span>
                  </span>
                  <span className="text-[10px] tracking-wider uppercase text-[#AAADB0]">
                    European &amp; Japanese Auto Specialists · Sydney
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#AAADB0] max-w-sm leading-relaxed">
                Dealer-grade diagnostics, statutory logbook servicing, and mechanical repairs in Alexandria,
                Sydney NSW. Preserving new car warranties with certified master technicians.
              </p>

              <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Australian Consumer Law (ACL) Statutory Warranty Protection</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs text-[#AAADB0]">
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#why-us" className="hover:text-white transition-colors">
                    Why Us
                  </a>
                </li>
                <li>
                  <a href="#estimator" className="hover:text-white transition-colors">
                    Estimator
                  </a>
                </li>
                <li>
                  <a href="#process" className="hover:text-white transition-colors">
                    Our Process
                  </a>
                </li>
                <li>
                  <a href="#packages" className="hover:text-white transition-colors">
                    Packages
                  </a>
                </li>
                <li>
                  <a href="#location" className="hover:text-white transition-colors">
                    Locations
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Marques
              </h4>
              <ul className="space-y-1.5 text-xs text-[#AAADB0]">
                <li>BMW &amp; M Power</li>
                <li>Mercedes-Benz &amp; AMG</li>
                <li>Audi &amp; RS Quattro</li>
                <li>Porsche 911 / Macan</li>
                <li>Volkswagen R / GTI</li>
                <li>Lexus F-Sport &amp; Toyota GR</li>
                <li>Subaru STI &amp; Honda Type R</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Contact
              </h4>
              <div className="space-y-2 text-xs text-[#AAADB0]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#4A3AFF]" />
                  <a href="tel:0289013400" className="hover:text-white font-bold text-white">
                    (02) 8901 3400
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#1557FF]" />
                  <a href="mailto:service@mechanic.ithelpers.com.au" className="hover:text-white">
                    service@mechanic.ithelpers.com.au
                  </a>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                  <span>42 Collins St, Alexandria NSW 2015</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-center md:text-left text-[#AAADB0]">
            <div className="space-y-1">
              <p>© {new Date().getFullYear()} Apex Precision Mechanical. All rights reserved.</p>
              <p className="text-[11px] text-[#AAADB0]/70">
                AGENCY PORTFOLIO DEMONSTRATION | High-Conversion Commercial Prototype engineered by{" "}
                <a
                  href="https://ithelpers.com.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4A3AFF] hover:underline font-semibold"
                >
                  I.T Helpers
                </a>
                .
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://ithelpers.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 text-xs font-bold text-white hover:bg-white/20 transition-colors"
              >
                <span>Agency: I.T Helpers</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#4A3AFF]" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 14. MOBILE STICKY BAR (<768px, CarRepair X Style) */}
      <aside
        aria-label="Mobile Quick Actions"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3 px-4 shadow-lg"
      >
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <a
            href="tel:0289013400"
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-[#F8F9FC] border border-[#E5E7EB] text-[#000000] text-xs font-bold active:bg-[#E5E7EB]"
          >
            <Phone className="w-4 h-4 text-[#4A3AFF]" />
            <span>Call Workshop</span>
          </a>

          <a
            href="#booking"
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-[#4A3AFF] text-white text-xs font-bold shadow-md shadow-[#4A3AFF]/20 active:bg-[#1557FF]"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Online</span>
          </a>
        </div>
      </aside>
    </div>
  );
}
