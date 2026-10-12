"use client";

import React, { useState } from "react";
import {
  Wrench,
  ShieldCheck,
  Calendar,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Gauge,
  Cpu,
  Disc,
  Settings2,
  FileSearch,
  Star,
  ExternalLink,
  Car,
  AlertCircle
} from "lucide-react";

export default function Home() {
  // Estimator State
  const [vehicleTier, setVehicleTier] = useState<"euro" | "jap" | "suv">("euro");
  const [selectedService, setSelectedService] = useState<string>("minor");
  
  // Booking Form State
  const [submitted, setSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    rego: "",
    service: "Minor Logbook Service",
    date: "",
    notes: ""
  });

  const tiers = {
    euro: {
      label: "European Specialist",
      models: "BMW, Mercedes-Benz, Audi, Porsche, VW",
      factor: 1.2
    },
    jap: {
      label: "Japanese Precision",
      models: "Toyota, Lexus, Subaru, Honda, Nissan",
      factor: 1.0
    },
    suv: {
      label: "AWD & Heavy Commercial",
      models: "LandCruiser, Prado, Patrol, Ranger, Amarok",
      factor: 1.25
    }
  };

  const servicesConfig: Record<string, { title: string; base: number; dealer: number; turnaround: string; points: string[] }> = {
    minor: {
      title: "Minor Logbook Service",
      base: 289,
      dealer: 460,
      turnaround: "2.5 Hours",
      points: ["Full synthetic factory-grade engine oil", "OEM Mahle/Mann oil filter renewal", "58-point digital safety inspection", "Digital logbook stamped & cleared"]
    },
    major: {
      title: "Major Inspection & Fluid Flush",
      base: 549,
      dealer: 890,
      turnaround: "Same Day (4 Hours)",
      points: ["All minor service inclusions", "Brake & radiator fluid chemical analysis & flush", "Spark plug & cabin filter inspection", "Diagnostic fault code module scan"]
    },
    diagnostics: {
      title: "Master Diagnostic Scan (CAN-Bus)",
      base: 180,
      dealer: 320,
      turnaround: "1.5 Hours",
      points: ["Live freeze-frame live data interrogation", "Sensor waveform oscilloscope checks", "Electrical harness voltage-drop testing", "Actionable technician report & repair plan"]
    },
    brakes: {
      title: "Performance Brake Overhaul (Axle)",
      base: 395,
      dealer: 680,
      turnaround: "2.0 Hours",
      points: ["Brembo / Textar OEM-grade pads", "Disc rotor run-out micrometer measurement", "DOT 4.1 pressure brake fluid flush", "Caliper sliding pin service & re-torque"]
    }
  };

  const activeServiceInfo = servicesConfig[selectedService] || servicesConfig.minor;
  const estimatedPrice = Math.round(activeServiceInfo.base * tiers[vehicleTier].factor);
  const dealerPrice = Math.round(activeServiceInfo.dealer * tiers[vehicleTier].factor);
  const savings = dealerPrice - estimatedPrice;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#F8FAFC] antialiased selection:bg-[#F59E0B] selection:text-black">
      {/* 1. TOP AGENCY PORTFOLIO DEMONSTRATION NOTICE */}
      <div className="bg-[#14171F] border-b border-[#293040] py-2.5 px-4 text-xs font-mono text-[#94A3B8]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[#F8FAFC] font-semibold">AGENCY PORTFOLIO DEMONSTRATION</span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline">High-Conversion Prototype Designed by Zarrak Khan (I.T Helpers)</span>
          </div>
          <a
            href="https://ithelpers.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#F59E0B] hover:underline hover:text-amber-400 ml-auto"
          >
            <span>Visit Agency (ithelpers.com.au)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. STICKY DESKTOP & TABLET HEADER */}
      <header className="sticky top-0 z-40 bg-[#0B0D11]/90 backdrop-blur-md border-b border-[#293040]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B] flex items-center justify-center text-black font-black">
              <Wrench className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-lg sm:text-xl flex items-center gap-1.5">
                <span>APEX PRECISION</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1D222D] border border-[#293040] text-[#F59E0B] font-mono font-medium">MECHANICAL</span>
              </div>
              <p className="text-[11px] font-mono text-[#94A3B8]">Factory-Grade European & Japanese Specialists</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
            <a href="#services" className="hover:text-[#F8FAFC] transition">Services</a>
            <a href="#estimator" className="hover:text-[#F8FAFC] transition">Cost Estimator</a>
            <a href="#standards" className="hover:text-[#F8FAFC] transition">Quality Standards</a>
            <a href="#location" className="hover:text-[#F8FAFC] transition">Workshop Hub</a>
          </nav>

          <div className="hidden sm:flex items-center gap-4">
            <a
              href="tel:0289013400"
              className="flex items-center gap-2 text-sm font-mono text-[#F8FAFC] hover:text-[#F59E0B] transition"
            >
              <Phone className="w-4 h-4 text-[#F59E0B]" />
              <span>(02) 8901 3400</span>
            </a>
            <a
              href="#booking"
              className="px-5 py-2.5 rounded-lg bg-[#F59E0B] text-black font-bold text-sm hover:bg-amber-400 transition shadow-lg shadow-amber-500/10"
            >
              Book Service
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION WITH VALUE PROPOSITION */}
      <section className="relative pt-12 pb-20 md:py-24 border-b border-[#293040] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D222D] border border-[#293040] text-xs font-mono text-[#F59E0B]">
                <ShieldCheck className="w-4 h-4" />
                <span>100% STATUTORY NEW CAR WARRANTY SAFE</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Dealer Precision. <br />
                <span className="text-[#F59E0B]">Independent Honesty.</span>
              </h1>
              
              <p className="text-lg text-[#94A3B8] max-w-2xl leading-relaxed">
                Factory-grade diagnostics, dealer-level logbook servicing, and mechanical repairs in Alexandria. We use genuine OEM components and dealer diagnostics without voiding your manufacturer warranty.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#estimator"
                  className="px-6 py-3.5 rounded-lg bg-[#F59E0B] text-black font-bold hover:bg-amber-400 transition flex items-center gap-2"
                >
                  <span>Instant Service Estimator</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="#booking"
                  className="px-6 py-3.5 rounded-lg bg-[#14171F] border border-[#293040] text-[#F8FAFC] font-semibold hover:border-[#F59E0B] transition"
                >
                  Book Workshop Directly
                </a>
              </div>

              {/* Fast Proof Points */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#293040]/70 font-mono text-xs">
                <div>
                  <div className="text-white font-bold text-base">24-Month</div>
                  <div className="text-[#94A3B8]">Parts & Labour Guarantee</div>
                </div>
                <div>
                  <div className="text-white font-bold text-base">OEM Direct</div>
                  <div className="text-[#94A3B8]">Mahle, Mann, Brembo, Bosch</div>
                </div>
                <div>
                  <div className="text-white font-bold text-base">4.9 / 5.0</div>
                  <div className="text-[#F59E0B] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                    <span>420+ Verified Reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Interactive Calculator Box */}
            <div id="estimator" className="lg:col-span-5">
              <div className="bg-[#14171F] border border-[#293040] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#293040] pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-[#F59E0B]" />
                      <span>Instant Cost Calculator</span>
                    </h2>
                    <p className="text-xs text-[#94A3B8] font-mono mt-0.5">Transparent Sydney Metro Pricing</p>
                  </div>
                  <span className="text-[11px] font-mono bg-[#1D222D] border border-[#293040] px-2.5 py-1 rounded text-emerald-400">
                    Est. Savings: ${savings}
                  </span>
                </div>

                {/* Tier Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">1. Select Vehicle Make</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["euro", "jap", "suv"] as const).map((tierKey) => (
                      <button
                        key={tierKey}
                        onClick={() => setVehicleTier(tierKey)}
                        className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition flex flex-col items-center gap-1 ${
                          vehicleTier === tierKey
                            ? "bg-[#F59E0B] border-[#F59E0B] text-black"
                            : "bg-[#1D222D] border-[#293040] text-[#94A3B8] hover:border-zinc-500"
                        }`}
                      >
                        <Car className="w-4 h-4" />
                        <span>{tierKey === "euro" ? "European" : tierKey === "jap" ? "Japanese" : "SUV / 4WD"}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#94A3B8] font-mono mt-1 italic">
                    Includes: {tiers[vehicleTier].models}
                  </p>
                </div>

                {/* Service Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">2. Service Requirement</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(servicesConfig).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedService(key)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition ${
                          selectedService === key
                            ? "bg-[#1D222D] border-[#F59E0B] text-white"
                            : "bg-[#0B0D11] border-[#293040] text-[#94A3B8] hover:border-zinc-600"
                        }`}
                      >
                        <div className="font-semibold truncate">{config.title}</div>
                        <div className="font-mono text-[10px] text-[#F59E0B] mt-0.5">from ${Math.round(config.base * tiers[vehicleTier].factor)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Output */}
                <div className="bg-[#0B0D11] border border-[#293040] rounded-xl p-4 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-mono text-[#94A3B8]">Estimated Workshop Cost:</span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono">${estimatedPrice}</span>
                      <span className="text-xs text-[#94A3B8] font-mono block line-through">Dealer: ${dealerPrice}</span>
                    </div>
                  </div>
                  
                  <div className="text-[11px] font-mono text-[#94A3B8] flex items-center justify-between border-t border-[#293040] pt-2">
                    <span>Turnaround Time:</span>
                    <span className="text-white font-medium">{activeServiceInfo.turnaround}</span>
                  </div>

                  <ul className="space-y-1 text-xs text-[#94A3B8] pt-1">
                    {activeServiceInfo.points.map((pt, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                        <span className="text-[11px] truncate">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#booking"
                  className="w-full py-3 rounded-lg bg-[#F59E0B] text-black font-bold text-center block text-sm hover:bg-amber-400 transition"
                >
                  Book This Estimate
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES MATRIX */}
      <section id="services" className="py-20 bg-[#14171F] border-b border-[#293040]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-mono text-[#F59E0B] tracking-wider uppercase">Precision Workshop Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Engineered For Mechanical Perfection</h2>
            <p className="text-sm sm:text-base text-[#94A3B8]">
              We eliminate dealership markup while providing dealership-level equipment, factory scan tools, and certified master mechanical repairs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Logbook Servicing",
                desc: "100% statutory new vehicle warranty compliance. Stamped digital logs using factory-specified fluids and OEM replacement filters."
              },
              {
                icon: Cpu,
                title: "Computer Diagnostics",
                desc: "CAN-bus system interrogation, ECU live data analysis, oscilloscope sensor waveform testing, and complex fault tracing."
              },
              {
                icon: Disc,
                title: "Brake & Dynamic Systems",
                desc: "Rotor micrometer run-out verification, high-performance pad compounds (Brembo/Pagid), and hydraulic pressure flushing."
              },
              {
                icon: Settings2,
                title: "Transmission & Driveline",
                desc: "ZF 6HP/8HP lifeguard fluid service, DSG mechatronic adaptations, clutch calibration, transfer case renewals."
              },
              {
                icon: Gauge,
                title: "Steering & Suspension",
                desc: "Hunter HawkEye laser alignments, control arm hydraulic bush replacement, Bilstein/KW damper upgrades."
              },
              {
                icon: FileSearch,
                title: "Pre-Purchase Inspections",
                desc: "Comprehensive 120-point digital mechanical audit, paint-depth gauge bodywork checks, and ECU freeze-frame scan reports."
              }
            ].map((srv, idx) => (
              <div key={idx} className="bg-[#1D222D] border border-[#293040] rounded-xl p-6 hover:border-[#F59E0B] transition space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#14171F] border border-[#293040] flex items-center justify-center text-[#F59E0B]">
                  <srv.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{srv.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE BOOKING WORKSHOP FORM */}
      <section id="booking" className="py-20 border-b border-[#293040]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#14171F] border border-[#293040] rounded-2xl p-6 sm:p-10 shadow-2xl">
            <div className="mb-8 space-y-2">
              <span className="text-xs font-mono text-[#F59E0B] uppercase">Fast-Track Service Portal</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Book Workshop Inspection</h2>
              <p className="text-sm text-[#94A3B8]">
                Submit your vehicle details below. Our service advisors respond within 30 minutes with an itemized quote.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#1D222D] border border-emerald-500/40 rounded-xl p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Booking Confirmation Generated</h3>
                <p className="text-sm text-[#94A3B8] max-w-md mx-auto">
                  Thank you, <span className="text-white font-semibold">{bookingData.name || "Customer"}</span>. Your booking reference <span className="font-mono text-[#F59E0B]">#APEX-{Math.floor(1000 + Math.random() * 9000)}</span> has been registered for your vehicle <span className="text-white font-mono">{bookingData.rego || "rego"}</span>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-mono text-[#F59E0B] hover:underline"
                  >
                    Submit Another Booking
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#94A3B8]">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      className="w-full bg-[#0B0D11] border border-[#293040] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#94A3B8]">Contact Mobile *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0400 000 000"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                      className="w-full bg-[#0B0D11] border border-[#293040] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#94A3B8]">Vehicle Rego / Model *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BMW M340i / [NSW REGO]"
                      value={bookingData.rego}
                      onChange={(e) => setBookingData({ ...bookingData, rego: e.target.value })}
                      className="w-full bg-[#0B0D11] border border-[#293040] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#94A3B8]">Service Scope *</label>
                    <select
                      value={bookingData.service}
                      onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                      className="w-full bg-[#0B0D11] border border-[#293040] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                    >
                      <option>Minor Logbook Service</option>
                      <option>Major Logbook Service</option>
                      <option>Computer Diagnostic Scan</option>
                      <option>Brake Service / Overhaul</option>
                      <option>Mechanical Inspection & Noise Check</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#94A3B8]">Preferred Drop-Off Date</label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      className="w-full bg-[#0B0D11] border border-[#293040] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#94A3B8]">Vehicle Symptoms / Specific Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Brake squeal when cold, oil service notification on dash, rough idle..."
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                    className="w-full bg-[#0B0D11] border border-[#293040] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-[#F59E0B] text-black font-extrabold text-sm hover:bg-amber-400 transition"
                >
                  Confirm Workshop Booking
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 6. WORKSHOP HUB & LOCATION */}
      <footer id="location" className="bg-[#0B0D11] py-16 text-sm text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <div className="font-extrabold text-white text-lg">Apex Precision Mechanical</div>
            <p className="text-xs leading-relaxed">
              Licensed Workshop NSW Lic #MVRL58291. Dealer-equivalent diagnostics, genuine OEM parts, and certified master technician repairs.
            </p>
            <div className="text-xs font-mono text-[#F59E0B]">Sydney Metro Hub · Alexandria NSW</div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="text-white font-bold uppercase tracking-wider text-sm font-sans">Operating Hours</div>
            <div className="flex justify-between border-b border-[#293040] pb-1.5">
              <span>Mon – Fri:</span>
              <span className="text-white">7:30 AM – 5:30 PM</span>
            </div>
            <div className="flex justify-between border-b border-[#293040] pb-1.5">
              <span>Saturday:</span>
              <span className="text-white">8:00 AM – 1:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday / Public Holidays:</span>
              <span className="text-zinc-600">Closed (Key Drop Active)</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-sm font-sans">Workshop Address</div>
            <div className="text-xs space-y-1">
              <p className="text-white">Unit 4, 42 Collins Street</p>
              <p>Alexandria NSW 2015</p>
              <p className="font-mono text-[#F59E0B] pt-1">Direct: (02) 8901 3400</p>
            </div>
            <div className="pt-2">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#F59E0B] hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Open Google Maps Directions</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 mt-12 border-t border-[#293040] text-center text-xs font-mono text-zinc-600">
          Demonstration project developed for I.T Helpers Agency · mechanic.ithelpers.com.au
        </div>
      </footer>

      {/* 7. STICKY MOBILE CALL / BOOK BAR (<768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#14171F] border-t border-[#293040] p-3 flex gap-3">
        <a
          href="tel:0289013400"
          className="flex-1 py-3 rounded-lg bg-[#1D222D] border border-[#293040] text-white font-bold text-center text-xs flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4 text-[#F59E0B]" />
          <span>Call Workshop</span>
        </a>
        <a
          href="#booking"
          className="flex-1 py-3 rounded-lg bg-[#F59E0B] text-black font-extrabold text-center text-xs flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Service</span>
        </a>
      </div>
    </div>
  );
}