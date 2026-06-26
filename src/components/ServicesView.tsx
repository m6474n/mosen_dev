import React, { useState } from 'react';
import { Cpu, TrendingUp, Code, CheckCircle, Calculator, PhoneCall, HelpCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { ESTIMATOR_FEATURES, SERVICES_FAQ } from '../data';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';
import Button from './Button';

export default function ServicesView() {
  const { services } = useData();

  // Interactive estimator state
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'custom-page', 'api-integration'
  ]);
  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({});


  const toggleFaq = (index: number) => {
    setOpenIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const features = ESTIMATOR_FEATURES;

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter(item => item !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const calculateTotal = () => {
    let cost = 0;
    let days = 0;
    features.forEach(f => {
      if (selectedFeatures.includes(f.id)) {
        cost += f.cost;
        days += f.time;
      }
    });
    return { cost, days };
  };

  const totals = calculateTotal();

  return (
    <DefaultPageLayout>
      {/* ─── SERVICES HEADER ─── */}
      <section className="border-b border-neutral-100 pb-12">
        <Container>
          <DynamicPageHeader
            badge="CATALOGUE"
            title="CORE SERVICES & VALUE ENGINES"
            subtitle="I build systems that directly influence business performance. Whether by automating administrative overhead, developing custom lead-generation engines, or shipping modern native UI frontends."
            hasBorder={false}
          />
        </Container>
      </section>

      {/* ─── DETAILED SERVICE OPTIONS ─── */}
      <section className="py-8">
        <Container className="flex flex-col gap-12">
          <h2 className="font-sans font-light text-2xl md:text-3xl tracking-tight text-neutral-950 uppercase border-b border-neutral-100 pb-4">
            THE THREE CORE OFFERINGS
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((srv) => {
              const IconComp = srv.id === 'automation-systems' ? Cpu : srv.id === 'revenue-engines' ? TrendingUp : Code;
              return (
                <ReusableCard key={srv.id} hoverable={true} variant="white" className="p-8 justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[10px] font-bold tracking-widest text-neutral-400">{srv.num}</span>
                      <IconComp className="w-5 h-5 text-neutral-900" />
                    </div>
                    <h3 className="text-xl font-light text-neutral-900 mb-6 uppercase tracking-tight">
                      {srv.title.toUpperCase()}
                    </h3>
                    <p className="text-xs font-light text-neutral-600 leading-relaxed mb-8">
                      {srv.description}
                    </p>

                    <div className="border-t border-neutral-200 pt-6 mb-8">
                      <h4 className="text-[10px] font-light tracking-widest text-neutral-400 uppercase mb-4">Core Deliverables</h4>
                      <ul className="flex flex-col gap-3.5 list-none">
                        {srv.outcomes.map((out, idx) => (
                          <li key={idx} className="text-xs font-light text-neutral-600 flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full mt-1.5 shrink-0"></span>
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-neutral-400 uppercase tracking-widest">Pricing Model</span>
                      <span className="font-bold text-neutral-900 font-mono">{srv.pricing}</span>
                    </div>
                    <a
                      href="#/contact"
                      className="w-full text-center py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold tracking-wider transition-colors block uppercase"
                    >
                      Enquire For Setup
                    </a>
                  </div>
                </ReusableCard>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── INTERACTIVE ESTIMATOR TOOL ─── */}
      <section className="py-8 md:py-12 bg-neutral-50 border-y border-neutral-100">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-stretch">
          <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center gap-2 text-neutral-400">
              <Calculator className="w-4 h-4 text-neutral-900" />
              <span className="text-[10px] font-extrabold tracking-widest uppercase">ESTIMATOR TOOL</span>
            </div>
            <h2 className="font-sans font-light text-2xl md:text-3xl tracking-tight text-neutral-950 uppercase">
              INTERACTIVE SCOPE BUDGET CALCULATOR
            </h2>
            <p className="text-xs font-light text-neutral-500 leading-relaxed tracking-wide">
              Pick the required modules you want to establish for your product or internal system workflow. This provides a transparent estimate of development timelines and flat cost targets.
            </p>
            <div className="flex flex-col gap-3.5 bg-white p-6 border border-neutral-100 shadow-xs flex-grow">
              <h4 className="text-xs font-light text-neutral-900 uppercase">Feature Modules</h4>
              <div className="flex flex-col gap-3">
                {features.map((f) => (
                  <label
                    key={f.id}
                    className={`flex items-start gap-3 p-3 border transition-all cursor-pointer ${
                      selectedFeatures.includes(f.id)
                        ? 'border-neutral-950 bg-neutral-50/50'
                        : 'border-neutral-100 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(f.id)}
                      onChange={() => toggleFeature(f.id)}
                      className="mt-1 accent-neutral-950 cursor-pointer"
                    />
                    <div className="flex-grow">
                      <div className="text-xs font-light text-neutral-900 uppercase">{f.label}</div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">COST: ${f.cost} • EST. TIME: {f.time} DAYS</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <ReusableCard hoverable={false} variant="white" className="p-8 md:p-12 h-full">
            <div>
              <h4 className="text-[10px] font-light tracking-widest text-neutral-400 uppercase mb-6">Estimated Totals</h4>
              
              <div className="flex flex-col gap-6 border-b border-neutral-100 pb-8 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-light text-neutral-500 uppercase tracking-wide">Selected Systems</span>
                  <span className="text-xs font-semibold text-neutral-950">{selectedFeatures.length} Modules</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-light text-neutral-500 uppercase tracking-wide">Estimated Days</span>
                  <span className="text-xs font-bold font-mono text-neutral-950">{totals.days} Working Days</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-neutral-100 pt-6 mt-2">
                  <span className="text-xs uppercase tracking-widest text-neutral-400">Project Budget</span>
                  <span className="font-mono text-neutral-950 text-2xl">${totals.cost} USD</span>
                </div>
              </div>

              {/* MARKED FEATURES LIST */}
              <div className="mb-8">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-4">Included Modules</span>
                {selectedFeatures.length === 0 ? (
                  <p className="text-xs font-light text-neutral-400 italic">No modules selected. Select elements on the left to estimate build.</p>
                ) : (
                  <ul className="flex flex-col gap-3.5 list-none">
                    {features
                      .filter(f => selectedFeatures.includes(f.id))
                      .map(f => (
                        <li key={f.id} className="text-xs font-light text-neutral-600 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full mt-1.5 shrink-0"></span>
                          <div className="flex flex-col">
                            <span className="uppercase text-neutral-900 font-medium tracking-wide text-[11px] leading-tight">{f.label}</span>
                            <span className="text-[9px] text-neutral-400 font-mono mt-0.5">${f.cost} • {f.time} DAYS</span>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-neutral-100 pt-6">
              <p className="text-[11px] font-light text-neutral-400 leading-relaxed">
                Estimates are calculated using standard production complexities and are fully custom-adjustable. This allows us to establish flat-rate billing bounds without hidden charges.
              </p>
              <a
                href={`#/contact?service=custom-scope&budget=${totals.cost}&message=Estimated features list: ${selectedFeatures.join(', ')}`}
                className="w-full text-center py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold tracking-wider transition-colors uppercase"
              >
                Book Scope Verification Call
              </a>
            </div>
          </ReusableCard>
        </Container>
      </section>

      {/* ─── FREQUENT QUESTIONS ─── */}
      <section className="py-12 md:py-16 border-t border-neutral-100 bg-neutral-50/20">
        <Container>
          <div className="flex flex-col items-center text-center justify-center mb-12">
            <HelpCircle className="w-5 h-5 text-neutral-400 mb-4" />
            <h2 className="font-sans font-black text-2xl md:text-3xl tracking-tight text-neutral-950 uppercase">
              Service FAQ
            </h2>
            <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-2">
              Common enquiries about building structure, scope, & delivery schedules
            </p>
          </div>

          <div className="w-full flex flex-col border-t border-neutral-200">
            {SERVICES_FAQ.map((faq, idx) => {
              const isOpen = !!openIndices[idx];
              return (
                <div 
                  key={idx} 
                  className="border-b border-neutral-200 py-5 transition-colors duration-200 hover:bg-neutral-50/50"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left py-2 group cursor-pointer focus:outline-none"
                  >
                    <span className="font-sans font-semibold text-xs md:text-sm tracking-wide text-neutral-900 group-hover:text-neutral-950 uppercase">
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 135 : 0 }}
                      className="text-neutral-400 group-hover:text-neutral-950 shrink-0 ml-4"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-4 text-xs font-light text-neutral-500 leading-relaxed max-w-4xl">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </DefaultPageLayout>
  );
}
