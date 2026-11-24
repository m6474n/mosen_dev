'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Send, CheckCircle2, RefreshCw, ArrowUpRight, Clock, Globe2, MessageSquare } from 'lucide-react';
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
  const [service, setService] = useState('Fullstack Product');
  const [budget, setBudget] = useState('$2,500 – $5,000');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<ContactSubmission | null>(null);
  const [simulatedRefCode, setSimulatedRefCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

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
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError('Please fill in your name, email, and project details.');
      return;
    }
    setFormError(null);
    setIsSubmitting(true);

    try {
      const refCode = await addContactMessage({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || 'Independent',
        service,
        budget,
        content: message.trim(),
        subject: `Project Inquiry: ${name.trim()} (${service})`,
        type: 'booking',
      });

      const payload: ContactSubmission = {
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || 'Independent',
        service,
        budget,
        message: message.trim(),
        submittedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setSimulatedRefCode(refCode);
      setSubmissionSuccess(payload);
    } catch (err: any) {
      setFormError('Failed to send message: ' + (err.message || String(err)));
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
        {/* Page Header */}
        <DynamicPageHeader
          badge="GET IN TOUCH"
          title="START A PROJECT"
          subtitle="Have a product to build, a system to automate, or an existing platform to scale? Share the scope below and I'll respond within 24 hours."
          hasBorder={true}
        />

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-12 items-start mb-16">
          {/* Left Column: Direct Info & Availability */}
          <div className="flex flex-col gap-6">
            <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between space-y-8">
              <div>
                <span className="text-[11px] font-mono font-semibold tracking-wider text-neutral-400 uppercase block mb-3">
                  DIRECT INQUIRIES
                </span>
                <a
                  href={`mailto:${MOHSIN_BIO.email}`}
                  className="text-base sm:text-lg font-semibold text-neutral-950 hover:text-neutral-600 transition-colors inline-flex items-center gap-2 group"
                  id="contact-email-direct"
                >
                  <Mail className="w-4 h-4 text-neutral-500 group-hover:text-neutral-950 transition-colors" />
                  {MOHSIN_BIO.email}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              <div className="border-t border-neutral-200/80 pt-6 space-y-4">
                <span className="text-[11px] font-mono font-semibold tracking-wider text-neutral-400 uppercase block">
                  AVAILABILITY & LOCATION
                </span>
                <div className="space-y-3 text-xs text-neutral-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-neutral-500">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" /> Response Time:
                    </span>
                    <span className="font-medium text-neutral-900">Within 24 Hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-neutral-500">
                      <Globe2 className="w-3.5 h-3.5 text-neutral-400" /> Location:
                    </span>
                    <span className="font-medium text-neutral-900">Remote / Global</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-neutral-500">
                      <MessageSquare className="w-3.5 h-3.5 text-neutral-400" /> Booking:
                    </span>
                    <span className="font-mono text-[11px] font-bold text-neutral-900 bg-neutral-200/60 px-2 py-0.5 rounded">
                      OPEN FOR Q2/Q3
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200/80 pt-6">
                <p className="text-xs font-light text-neutral-500 leading-relaxed">
                  No account managers or sales intermediaries. You talk directly with the engineer who designs and writes every line of your product.
                </p>
              </div>
            </div>

            {/* Quick Scope Advice Card */}
            <div className="p-6 rounded-2xl border border-neutral-200/60 bg-white space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                WHAT TO INCLUDE
              </span>
              <p className="text-xs font-light text-neutral-600 leading-relaxed">
                A brief overview of your business, what problem needs solving, any existing tools/repos in use, and your ideal timeline.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            {submissionSuccess ? (
              <div className="flex flex-col items-center text-center py-8 space-y-6" id="planner-receipt">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                    MESSAGE DELIVERED
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-950 uppercase font-[family-name:var(--font-inter-tight)]">
                    Thank You, {submissionSuccess.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-light text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Your inquiry has been received. I'll review your requirements and follow up via email at <strong className="font-semibold text-neutral-900">{submissionSuccess.email}</strong>.
                  </p>
                </div>

                <div className="w-full max-w-md p-5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-left text-xs font-mono space-y-2 text-neutral-700">
                  <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                    <span className="text-neutral-400">REFERENCE ID:</span>
                    <span className="font-bold text-neutral-900">{simulatedRefCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200/60 pb-2">
                    <span className="text-neutral-400">CATEGORY:</span>
                    <span className="font-medium text-neutral-900">{submissionSuccess.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">BUDGET TIER:</span>
                    <span className="font-medium text-neutral-900">{submissionSuccess.budget}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
                  <Button
                    onClick={resetForm}
                    variant="secondary"
                    className="flex-1 text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-2" /> SEND ANOTHER NOTE
                  </Button>
                  <Link
                    href="/"
                    className="flex-1 py-3 px-5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs tracking-wider uppercase text-center rounded-full transition-colors"
                  >
                    BACK TO HOME
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" id="contact-form">
                {/* Service Interest */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-mono font-semibold tracking-wider text-neutral-500 uppercase block">
                    PROJECT TYPE
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      'Fullstack Product',
                      'Workflow Automation',
                      'Custom Scraping/AI',
                      'Architecture Audit',
                    ].map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setService(item)}
                        className={`py-2.5 px-3 border text-center transition-all cursor-pointer text-xs font-medium rounded-xl select-none ${
                          service === item
                            ? 'bg-neutral-950 border-neutral-950 text-white font-semibold'
                            : 'bg-white border-neutral-200/90 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-mono font-semibold tracking-wider text-neutral-500 uppercase block">
                    EXPECTED BUDGET
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      '$1,500 – $2,500',
                      '$2,500 – $5,000',
                      '$5,000 – $10,000',
                      '$10,000+',
                    ].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setBudget(b)}
                        className={`py-2.5 px-3 border text-center transition-all cursor-pointer text-xs font-medium rounded-xl select-none ${
                          budget === b
                            ? 'bg-neutral-950 border-neutral-950 text-white font-semibold'
                            : 'bg-white border-neutral-200/90 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inputs: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-semibold tracking-wider text-neutral-500 uppercase block">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full text-sm text-neutral-900 bg-neutral-50/60 border border-neutral-200/90 focus:border-neutral-950 focus:bg-white px-4 py-3 outline-none rounded-xl transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-semibold tracking-wider text-neutral-500 uppercase block">
                      WORK EMAIL *
                    </label>
                    <input
                      type="email"
                      placeholder="alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full text-sm text-neutral-900 bg-neutral-50/60 border border-neutral-200/90 focus:border-neutral-950 focus:bg-white px-4 py-3 outline-none rounded-xl transition-all"
                    />
                  </div>
                </div>

                {/* Company / Website */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-semibold tracking-wider text-neutral-500 uppercase block">
                    COMPANY OR WEBSITE <span className="text-neutral-400 normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. acme.com or Acme Inc."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full text-sm text-neutral-900 bg-neutral-50/60 border border-neutral-200/90 focus:border-neutral-950 focus:bg-white px-4 py-3 outline-none rounded-xl transition-all"
                  />
                </div>

                {/* Project Description */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-semibold tracking-wider text-neutral-500 uppercase block">
                    PROJECT DETAILS *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell me about what you're building, the core problem, timeline, or any technical constraints..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full text-sm text-neutral-900 bg-neutral-50/60 border border-neutral-200/90 focus:border-neutral-950 focus:bg-white px-4 py-3 outline-none rounded-xl resize-y transition-all"
                  />
                </div>

                {/* Error Banner */}
                {formError && (
                  <div className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">
                    {formError}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-bold text-xs tracking-wider uppercase rounded-full cursor-pointer flex items-center justify-center gap-2 transition-all shadow-xs"
                    id="submit-contact-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> SENDING INQUIRY...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> SEND PROJECT INQUIRY
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-neutral-400 mt-3 font-light">
                    Direct communication. No spam, ever.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </DefaultPageLayout>
  );
}
