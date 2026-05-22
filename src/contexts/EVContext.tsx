// ==========================================================
// Professional Project Content Component
// E-Guard: Smart EV Battery Intelligence System
// ==========================================================

import {
  BatteryCharging,
  ShieldCheck,
  BrainCircuit,
  MapPinned,
  Thermometer,
  Cpu,
  Activity,
  AlertTriangle,
  Users,
  Radar,
} from 'lucide-react';

export const ProjectOverview = () => {
  return (
    <section className="w-full py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* HERO SECTION */}
        <div className="rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-10 shadow-2xl">

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <BatteryCharging className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                E-Guard
              </h1>

              <p className="text-lg text-slate-300 mt-1">
                Smart EV Battery Intelligence System
              </p>
            </div>
          </div>

          <p className="text-slate-300 leading-8 text-[15px]">
            E-Guard presents a next-generation AI-powered platform
            designed to enhance electric vehicle battery safety,
            performance, and reliability using Digital Twin Technology,
            IoT, Machine Learning, and Real-Time Analytics.
            The system continuously monitors critical battery
            parameters including State of Charge (SOC),
            State of Health (SOH), voltage, current, and temperature
            to provide predictive insights, thermal protection,
            intelligent range estimation, and smart navigation support.
          </p>

          {/* TAGS */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              'Artificial Intelligence',
              'Digital Twin',
              'IoT Monitoring',
              'Predictive Analytics',
              'Battery Intelligence',
              'Smart Navigation',
            ].map((tag) => (
              <div
                key={tag}
                className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-slate-200"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

          {/* CARD 1 */}
          <div className="rounded-2xl border bg-background p-6 shadow-sm hover:shadow-lg transition-all">
            <BrainCircuit className="w-10 h-10 text-primary mb-4" />

            <h3 className="text-xl font-semibold mb-3">
              AI Digital Twin
            </h3>

            <p className="text-muted-foreground leading-7 text-sm">
              Creates a real-time virtual replica of the EV battery
              for predictive analysis, intelligent diagnostics,
              and accurate performance simulation.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="rounded-2xl border bg-background p-6 shadow-sm hover:shadow-lg transition-all">
            <Activity className="w-10 h-10 text-green-600 mb-4" />

            <h3 className="text-xl font-semibold mb-3">
              Battery Health Monitoring
            </h3>

            <p className="text-muted-foreground leading-7 text-sm">
              Continuously monitors SOC, SOH, voltage,
              current, and battery temperature to improve
              efficiency and maximize battery lifespan.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="rounded-2xl border bg-background p-6 shadow-sm hover:shadow-lg transition-all">
            <Radar className="w-10 h-10 text-cyan-600 mb-4" />

            <h3 className="text-xl font-semibold mb-3">
              Predictive DTE Analytics
            </h3>

            <p className="text-muted-foreground leading-7 text-sm">
              AI models analyze environmental conditions,
              load variations, and degradation patterns to
              provide accurate Distance-to-Empty predictions.
            </p>
          </div>

          {/* CARD 4 */}
          <div className="rounded-2xl border bg-background p-6 shadow-sm hover:shadow-lg transition-all">
            <Thermometer className="w-10 h-10 text-red-500 mb-4" />

            <h3 className="text-xl font-semibold mb-3">
              Thermal Safety Protection
            </h3>

            <p className="text-muted-foreground leading-7 text-sm">
              Detects abnormal temperature fluctuations
              and instantly triggers safety alerts to prevent
              overheating and thermal runaway.
            </p>
          </div>

          {/* CARD 5 */}
          <div className="rounded-2xl border bg-background p-6 shadow-sm hover:shadow-lg transition-all">
            <MapPinned className="w-10 h-10 text-orange-500 mb-4" />

            <h3 className="text-xl font-semibold mb-3">
              Smart GPS Navigation
            </h3>

            <p className="text-muted-foreground leading-7 text-sm">
              Provides real-time EV tracking and intelligent
              charging station navigation using integrated
              GPS and cloud-based mapping services.
            </p>
          </div>

          {/* CARD 6 */}
          <div className="rounded-2xl border bg-background p-6 shadow-sm hover:shadow-lg transition-all">
            <AlertTriangle className="w-10 h-10 text-yellow-500 mb-4" />

            <h3 className="text-xl font-semibold mb-3">
              SOS Emergency System
            </h3>

            <p className="text-muted-foreground leading-7 text-sm">
              Enables one-click emergency alerts with
              live vehicle location and battery information
              for enhanced driver safety.
            </p>
          </div>
        </div>

        {/* TECH STACK */}
        <div className="mt-12 rounded-3xl border bg-muted/30 p-8">

          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-7 h-7 text-primary" />

            <h2 className="text-2xl font-bold">
              Technology Stack
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            {[
              'Raspberry Pi / ESP32',
              'Python & Scikit-Learn',
              'IoT Sensors',
              'Cloud Analytics',
              'Machine Learning',
              'GPS Module',
              'Digital Twin System',
              'Real-Time Dashboard',
            ].map((tech) => (
              <div
                key={tech}
                className="rounded-xl border bg-background p-4 text-center text-sm font-medium"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* BATTERY SPECIFICATIONS */}
        <div className="mt-12 rounded-3xl border p-8 bg-background">

          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />

            <h2 className="text-2xl font-bold">
              Battery Specifications
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="rounded-2xl bg-muted/40 p-6">
              <h3 className="font-semibold mb-4">
                Battery Type
              </h3>

              <p className="text-muted-foreground text-sm leading-7">
                48V Lithium Iron Phosphate (LFP) Prismatic Battery
              </p>
            </div>

            <div className="rounded-2xl bg-muted/40 p-6">
              <h3 className="font-semibold mb-4">
                Capacity
              </h3>

              <p className="text-muted-foreground text-sm leading-7">
                90Ah – 100Ah
              </p>
            </div>

            <div className="rounded-2xl bg-muted/40 p-6">
              <h3 className="font-semibold mb-4">
                Lifecycle
              </h3>

              <p className="text-muted-foreground text-sm leading-7">
                Approximately 2000 – 5000 charge cycles
              </p>
            </div>

            <div className="rounded-2xl bg-muted/40 p-6">
              <h3 className="font-semibold mb-4">
                Efficiency
              </h3>

              <p className="text-muted-foreground text-sm leading-7">
                90% – 95% Energy Efficiency
              </p>
            </div>

          </div>
        </div>

        {/* COMMUNITY SECTION */}
        <div className="mt-12 rounded-3xl border bg-gradient-to-r from-primary/10 to-emerald-500/10 p-8">

          <div className="flex items-center gap-3 mb-5">
            <Users className="w-7 h-7 text-primary" />

            <h2 className="text-2xl font-bold">
              Smart EV Community Ecosystem
            </h2>
          </div>

          <p className="text-muted-foreground leading-8">
            E-Guard includes a collaborative community platform
            where EV users can share charging station availability,
            report real-time charging experiences, discuss vehicle
            performance, and exchange valuable insights to improve
            EV reliability and user confidence.
          </p>
        </div>

      </div>
    </section>
  );
};
