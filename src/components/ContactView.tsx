'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Briefcase, DollarSign, Send, CheckCircle2, RefreshCw, Terminal, ArrowUpRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { MOHSIN_BIO } from '../data';
import { ContactSubmission } from '../types';
import DefaultPageLayout, { Container } from './DefaultPageLayout';
import DynamicPageHeader from './DynamicPageHeader';
import ReusableCard from './ReusableCard';
import Button from './Button';

export default function ContactView() {
  const { addContactMessage } = useData();
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState('automation-systems');
  const [budget, setBudget] = useState('$1,500 - $2,500');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<ContactSubmission | null>(null);
  const [simulatedRefCode, setSimulatedRefCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Extract initial parameters from URL search params
  const searchParams = useSearchParams();
  useEffect(() => {
    const srvParam = searchParams.get('service');
    const bdgParam = searchParams.get('budget');
    const msgParam = searchParams.get('message');
    if (srvParam) setService(srvParam);
    if (bdgParam) setBudget(bdgParam.startsWith('$') ? bdgParam : `$${bdgParam}`);
    if (msgParam) setMessage(msgParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setFormError("Please fill in the required fields: Name, Email and Description.");
      return;
    }
    setFormError(null);

    setIsSubmitting(true);

    try {
      const refCode = await addContactMessage({
        name,
        email,
        company: company || 'Self/Solo operator',
        service: service.toUpperCase().replace('-', ' '),
        budget,
        content: message,
        subject: `Inquiry: ${service.toUpperCase().replace(/-/g, ' ')}`,
        type: 'booking'
      });

      const payload: ContactSubmission = {
        name,
        email,
        company: company || 'Self/Solo operator',
        service: service.toUpperCase().replace(/-/g, ' '),
        budget,
        message,
        submittedAt: new Date().toLocaleDateString('en-US', {
          month: 'short', day: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      };

      setSimulatedRefCode(refCode);
      setSubmissionSuccess(payload);
    } catch (err: any) {
      setFormError("Failed to submit message to ingestion sync: " + (err.message || String(err)));
    } finally {
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    }
  };

  const resetForm = () => {
    setSubmissionSuccess(null);
    setSimulatedRefCode('');
  };

  return (
    <DefaultPageLayout>
      <Container>
        {/* PAGE INTRO HEADER */}
        <DynamicPageHeader
          badge="CONNECT"
          title="BOOK A CALL"
          subtitle="Tell me about your business bottlenecks or requirements. I’ll perform a granular review of your scope and approach you with a deployment plan."
          hasBorder={true}
        />

        {/* DOUBLE COLUMN LAYOUT: DIRECT DETAILS VS PLANNER FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12 lg:gap-20 items-stretch">
          
          {/* LEFT SIDE: DIRECT DIRECTORIES */}
          <ReusableCard hoverable={false} variant="muted" className="p-6 md:p-8 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-8">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-3 font-mono">DIRECT CHANNEL</span>
                <a
                  href={`mailto:${MOHSIN_BIO.email}`}
                  className="text-sm font-medium text-neutral-950 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-950 block"
                  id="contact-email-direct"
                >
                  {MOHSIN_BIO.email}
                </a>
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-3 font-mono">REMOTE AVAILABILITY</span>
                <ul className="flex flex-col gap-2 list-none">
                  <li className="text-xs font-light text-neutral-600 flex items-center justify-between">
                    <span>WORKING HOURS:</span>
                    <span className="font-mono text-[11px] font-bold text-neutral-800">MON-FRI (09:00 - 18:00 UTC)</span>
                  </li>
                  <li className="text-xs font-light text-neutral-600 flex items-center justify-between">
                    <span>DEPLOY CODES:</span>
                    <span className="font-mono text-[11px] font-bold text-neutral-800">REMOTE / ALL REGIONS</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6 mt-8">
              <p className="text-[11px] font-light text-neutral-400 leading-relaxed">
                All requests are typically processed within 24 business hours. You will receive a secure pipeline reference immediately upon submitting the portal planner details on the right.
              </p>
            </div>
          </ReusableCard>

          {/* RIGHT SIDE: INTERACTIVE PORTAL PLANNER */}
          <ReusableCard hoverable={false} variant="white" className="p-6 md:p-8 flex flex-col justify-between h-full">
            {submissionSuccess ? (
              /* Core Submission Success Board ticket receipt */
              <div className="relative overflow-hidden w-full h-full flex flex-col justify-between" id="planner-receipt">
                <div>
                  <div className="absolute top-0 right-0 px-3 py-1 bg-neutral-950 text-white font-mono text-[10px] font-bold tracking-widest uppercase">
                    ACTIVE PIPELINE
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">TRANSACTION SECURED</span>
                  </div>

                  <h2 className="text-xl font-light uppercase text-neutral-950 tracking-tight mb-4">
                    PROJECT PLANNED SUCCESSFULLY
                  </h2>
                  
                  <p className="text-xs font-light text-neutral-500 leading-relaxed mb-8">
                    Your ticket parameters have been synced securely into my local background intake table. Here is your structured system receipt:
                  </p>

                  {/* System variables tables receipt */}
                  <div className="bg-neutral-950 text-neutral-300 p-6 md:p-8 font-mono text-xs leading-relaxed border-l-4 border-neutral-900 mb-8 max-w-full overflow-x-auto">
                    <div className="flex items-center gap-1 text-[9px] text-neutral-500 font-bold uppercase tracking-widest mb-4 border-b border-neutral-900/50 pb-2">
                      <Terminal className="w-3 h-3" /> INGESTION RECORD // REF: {simulatedRefCode}
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-900/50">
                      <span className="text-neutral-500 uppercase">PROSPECT NAME:</span>
                      <span className="text-white">{submissionSuccess.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-900/50">
                      <span className="text-neutral-500 uppercase">EMAIL ADDR:</span>
                      <span className="text-white">{submissionSuccess.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-900/50">
                      <span className="text-neutral-500 uppercase">AFFILIATION:</span>
                      <span className="text-white">{submissionSuccess.company}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-900/50">
                      <span className="text-neutral-500 uppercase">SELECTED WORK:</span>
                      <span className="text-white text-right">{submissionSuccess.service}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-900/50">
                      <span className="text-neutral-500 uppercase">BUDGET SCALE:</span>
                      <span className="text-white font-bold">{submissionSuccess.budget}</span>
                    </div>
                    <div className="pt-4 text-left">
                      <span className="text-neutral-500 uppercase block mb-1">MESSAGE EXTRACT:</span>
                      <span className="text-white block italic leading-normal">"{submissionSuccess.message}"</span>
                    </div>
                    <div className="text-[9px] text-neutral-500 uppercase text-right mt-6">
                      TIMESTAMP: {submissionSuccess.submittedAt}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 border-t border-neutral-100 pt-6">
                  <Button
                    onClick={resetForm}
                    variant="secondary"
                    className="flex-grow flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> RE-SUBMIT TO INTAKE
                  </Button>
                  <Link
                    href="/"
                    className="py-3 px-6 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs tracking-wider uppercase text-center block flex-grow"
                  >
                    RETURN TO HOME
                  </Link>
                </div>
              </div>
            ) : (
              /* Core Input Planner Form */
              <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full gap-6 w-full" id="planner-form">
                <div className="flex flex-col gap-6">
                  {/* Purpose Selection Toggles */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">REQUIRED SERVICE CAPABILITY</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 'automation-systems', label: 'AUTOMATIONS' },
                        { id: 'revenue-engines', label: 'REVENUE ENG.' },
                        { id: 'product-design-dev', label: 'PRODUCT DESIGN' },
                        { id: 'custom-scope', label: 'CUSTOM SCOPE' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setService(item.id)}
                          className={`py-3 px-3 border text-center transition-all cursor-pointer text-[10px] font-bold tracking-wider uppercase rounded-none ${
                            service === item.id
                              ? 'bg-neutral-950 border-neutral-950 text-white'
                              : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget selection buttons row */}
                  <div className="flex flex-col gap-3 mb-2">
                    <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">ESTIMATED INVESTMENT SCOPE</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        '$1,500 - $2,500',
                        '$2,500 - $5,000',
                        '$5,000 - $10,000',
                        'WEEKLY retainer',
                      ].map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setBudget(b)}
                          className={`py-3 px-3 border text-center transition-all cursor-pointer text-[10px] font-bold tracking-wider uppercase rounded-none ${
                            budget === b
                              ? 'bg-neutral-950 border-neutral-950 text-white'
                              : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">FULL NAME *</label>
                      <input
                        type="text"
                        placeholder="ENTER FULL NAME"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full text-xs font-semibold tracking-wider text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-950 px-4 py-3 outline-hidden rounded-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        placeholder="ENTER EMAIL ADDRESS"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full text-xs font-semibold tracking-wider text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-950 px-4 py-3 outline-hidden rounded-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">COMPANY AFFILIATION (OPTIONAL)</label>
                    <input
                      type="text"
                      placeholder="ENTER COMPANY OR DEPLOYMENT DOMAIN"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full text-xs font-semibold tracking-wider text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-950 px-4 py-3 outline-hidden rounded-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">PROJECT BRIEF DESCRIPTION *</label>
                    <textarea
                      rows={5}
                      placeholder="DESCRIBE THE SYSTEM, CHALLENGE, OR SCRIPT PARAMETERS IN FULL DETAILS..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full text-xs font-semibold tracking-wider text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-950 px-4 py-3 outline-hidden rounded-none resize-y"
                    />
                  </div>
                </div>

                {/* Submitting buttons indicator */}
                <div className="pt-4 border-t border-neutral-100">
                  {formError && (
                    <div className="mb-4 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-3 font-mono uppercase">
                      {formError}
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> ESTABLISHING PIPELINE...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 mr-2" /> SECURE DISCOVERY CALL
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </ReusableCard>
        </div>
      </Container>
    </DefaultPageLayout>
  );
}
