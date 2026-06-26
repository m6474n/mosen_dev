import React, { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, Cpu, HardDrive, Terminal, Shield, Play, 
  RefreshCw, CheckCircle2, AlertCircle, Sparkles, Lock, 
  Send, Layers, Server, Search, Check, ChevronRight, Truck, Database,
  ArrowRight
} from 'lucide-react';

interface MockupProps {
  screenshotId: string;
}

export default function InteractiveScreenshotMockup({ screenshotId }: MockupProps) {
  switch (screenshotId) {
    case 'field-bidding-screen':
      return <AppexBiddingTerminalMockup />;
    case 'offline-sync-queue':
      return <AppexOfflineQueueMockup />;
    case 'scale-ops-control':
      return <WeighbridgeOperationsMockup />;
    case 'mobile-leads-alert':
      return <LeadsAlertMockup />;
    case 'crm-web-kanban':
      return <CRMWebKanbanMockup />;
    default:
      return (
        <div className="text-center text-neutral-500 font-mono text-xs">
          Interactive preview under construction
        </div>
      );
  }
}

// ─── 1. APPEX GLOBAL TRADING - FIELD BIDDING TERMINAL ───
function AppexBiddingTerminalMockup() {
  const [commodity, setCommodity] = useState('BASMATI RICE - SUPER');
  const [weight, setWeight] = useState(150); // Tons
  const [localBidsCount, setLocalBidsCount] = useState(2);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastBidSaved, setLastBidSaved] = useState<string | null>(null);

  const pricePerTonMap: Record<string, number> = {
    'BASMATI RICE - SUPER': 148000,
    'IRRI-6 COARSE RICE': 92000,
    'KHALIS WHEAT PREMIUM': 118000,
    'WHITE MAIZE SPECIAL': 84000
  };

  const currentPricePerTon = pricePerTonMap[commodity] || 100000;
  const totalPricePKR = weight * currentPricePerTon;

  const handleSaveBid = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLocalBidsCount(prev => prev + 1);
      setLastBidSaved(`${commodity.split(' ')[0]} - ${weight}T`);
      setIsSyncing(false);
    }, 850);
  };

  return (
    <div className="w-full max-w-[310px] mx-auto bg-neutral-950 border-[6px] border-neutral-900 rounded-none overflow-hidden shadow-2xl relative flex flex-col font-mono text-xs text-neutral-300 aspect-[9/18.5]">
      {/* Phone Notch */}
      <div className="absolute top-0 inset-x-0 h-5 bg-neutral-950 flex items-center justify-center z-20">
        <div className="w-24 h-3.5 bg-neutral-900 rounded-none"></div>
      </div>

      {/* Phone Status Bar */}
      <div className="h-9 bg-neutral-950 px-5 pt-4 flex justify-between items-center text-[9px] text-neutral-500 font-bold tracking-tight select-none">
        <span>11:49 AM</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] bg-red-950/45 px-1 border border-red-500/20 text-red-400 rounded">OFFLINE</span>
          <WifiOff className="w-3 h-3 text-neutral-600" />
        </div>
      </div>

      {/* Mobile App Header */}
      <div className="bg-neutral-900/90 border-b border-neutral-800 p-3 flex flex-col justify-between h-14 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-neutral-300">APPEX FIELD BID v3.2</span>
          </div>
          <span className="text-[9px] bg-neutral-800 text-neutral-400 px-1.5 uppercase leading-none py-0.5 rounded-none">
            LOCAL DB IDLE
          </span>
        </div>
      </div>

      {/* Mobile Scrollable Form Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-neutral-950">
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-bold text-neutral-500 tracking-wider">SELECT TARGET COMMODITY</label>
          <div className="grid grid-cols-1 gap-1.5">
            {Object.keys(pricePerTonMap).map((comm) => (
              <button 
                key={comm} 
                onClick={() => setCommodity(comm)}
                className={`w-full text-left p-2.5 rounded-none text-[10px] transition duration-200 border ${
                  commodity === comm 
                    ? 'bg-neutral-900 border-neutral-700 text-white' 
                    : 'bg-neutral-950/30 border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-800'
                }`}
              >
                <span>{comm}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[9px] font-bold text-neutral-500">
            <span>SPECIFY WEIGHT (TONS)</span>
            <span className="text-white">{weight} T</span>
          </div>
          <input 
            type="range" 
            min="20" 
            max="500" 
            value={weight} 
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full accent-neutral-200 cursor-pointer h-1.5 bg-neutral-800 rounded-none outline-none"
          />
        </div>

        {/* Dynamic Bid Valuation Box */}
        <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-none flex flex-col gap-1.5">
          <span className="text-[9px] text-neutral-500 tracking-wider">LOCAL VALUATION CALCULATOR</span>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-neutral-400">Total Contract Value</span>
            <span className="text-sm font-semibold text-white tracking-tight">
              PKR {totalPricePKR.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-[8px] text-neutral-500 border-t border-neutral-800/40 pt-1.5">
            <span>RATE: PKR {currentPricePerTon.toLocaleString()} / Ton</span>
            <span>SYNC: OFFLINE QUEUE READY</span>
          </div>
        </div>

        {/* Stats Indicator */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className="bg-neutral-900/20 border border-neutral-850/60 p-2 rounded text-center">
            <span className="text-[8px] text-neutral-500 uppercase block">Local Queue</span>
            <span className="text-xs font-bold text-neutral-100">{localBidsCount} Bids</span>
          </div>
          <div className="bg-neutral-900/20 border border-neutral-850/60 p-2 rounded text-center">
            <span className="text-[8px] text-neutral-500 uppercase block font-semibold text-neutral-400">Last Queue</span>
            <span className="text-[9px] text-orange-400 truncate block mt-0.5">{lastBidSaved || 'None (Cleared)'}</span>
          </div>
        </div>
      </div>

      {/* Button Block */}
      <div className="p-3.5 bg-neutral-900/45 border-t border-neutral-900">
        <button 
          onClick={handleSaveBid}
          disabled={isSyncing}
          className="w-full py-2.5 bg-neutral-200 hover:bg-white text-neutral-950 font-bold tracking-wider rounded text-[10px] uppercase transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> SECURING TRANS...
            </>
          ) : (
            <>
              <Database className="w-3.5 h-3.5" /> QUEUE OFFLINE BID
            </>
          )}
        </button>
      </div>

      <div className="h-6 bg-neutral-950 flex items-center justify-center pb-2 select-none">
        <div className="w-32 h-1 bg-neutral-800 rounded-full"></div>
      </div>
    </div>
  );
}

// ─── 2. APPEX GLOBAL TRADING - OFFLINE SYNC QUEUE ───
function AppexOfflineQueueMockup() {
  const [networkState, setNetworkState] = useState<'offline' | 'recon' | 'online'>('offline');
  const [logs, setLogs] = useState<string[]>([
    'System: Local database daemon initialized.',
    'SQLite: 2 local bidding transactions active.',
    'Relay: Connectivity failed (timeout 12000ms).'
  ]);
  const [syncStatus, setSyncStatus] = useState<string>('IDLE');
  const [queueCount, setQueueCount] = useState<number>(2);

  const triggerReconnectAndSync = () => {
    if (networkState !== 'offline') return;
    
    setNetworkState('recon');
    setSyncStatus('CHECKING');
    setLogs(prev => [...prev, 'Router: Spawning connection probe...', 'Handshake: Ping to google.com failed.']);

    setTimeout(() => {
      setLogs(prev => [...prev, 'Router: Rerouting DNS to emergency network [AWS-EDGE]...']);
    }, 1000);

    setTimeout(() => {
      setNetworkState('online');
      setSyncStatus('SYNCHRONIZING');
      setLogs(prev => [...prev, 'Network: Connected. Syncing queues...', 'Queue Client: Commencing batch Gzip compression.']);
    }, 2800);

    setTimeout(() => {
      setQueueCount(0);
      setSyncStatus('FINISHED');
      setLogs(prev => [...prev, 'Sync Server: 2 payloads uploaded.', 'Sync Server: Database replicated [STABLE].']);
    }, 5000);
  };

  const resetSimulation = () => {
    setNetworkState('offline');
    setSyncStatus('IDLE');
    setQueueCount(2);
    setLogs([
      'System: Local database daemon initialized.',
      'SQLite: 2 local bidding transactions active.',
      'Relay: Connectivity failed (timeout 12000ms).'
    ]);
  };

  return (
    <div className="w-full max-w-[310px] mx-auto bg-neutral-950 border-[6px] border-neutral-900 rounded-[36px] overflow-hidden shadow-2xl relative flex flex-col font-mono text-xs text-neutral-300 aspect-[9/18.5]">
      {/* Phone Notch */}
      <div className="absolute top-0 inset-x-0 h-5 bg-neutral-950 flex items-center justify-center z-20">
        <div className="w-24 h-3.5 bg-neutral-900 rounded-b-xl"></div>
      </div>

      {/* Phone Status Bar */}
      <div className="h-9 bg-neutral-950 px-5 pt-4 flex justify-between items-center text-[9px] text-neutral-500 font-bold tracking-tight select-none">
        <span>11:51 AM</span>
        <div className="flex items-center gap-1.5 animate-pulse">
          {networkState === 'offline' && (
            <>
              <span className="text-[8px] bg-red-950 px-1 border border-red-500/20 text-red-400 rounded">OFFLINE</span>
              <WifiOff className="w-3 h-3 text-red-500" />
            </>
          )}
          {networkState === 'recon' && (
            <>
              <span className="text-[8px] bg-orange-950 px-1 border border-orange-500/20 text-orange-400 rounded">DIALING</span>
              <RefreshCw className="w-2.5 h-2.5 text-orange-500 animate-spin" />
            </>
          )}
          {networkState === 'online' && (
            <>
              <span className="text-[8px] bg-emerald-950 px-1 border border-emerald-500/20 text-emerald-400 rounded">CONNECTED</span>
              <Wifi className="w-3 h-3 text-emerald-500" />
            </>
          )}
        </div>
      </div>

      {/* Sync Queue Screen */}
      <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex flex-col justify-between h-20">
        <span className="text-[9px] text-neutral-500 tracking-widest font-black uppercase">SYNC ENGINE TELEMETRY</span>
        <div className="flex justify-between items-baseline mt-1">
          <h4 className="text-xs font-bold text-neutral-200">QUEUED TRANSACTIONS</h4>
          <span className="text-lg font-extralight text-orange-500">{queueCount}</span>
        </div>
      </div>

      {/* Active Queue list item list */}
      <div className="flex-1 overflow-y-auto p-4 bg-neutral-950 flex flex-col gap-2.5">
        <span className="text-[9px] text-neutral-500 tracking-wider font-bold">MUTATION LOG RECORD COLLECTION</span>
        
        {queueCount > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="bg-neutral-900 border border-neutral-850 p-2.5 rounded flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-neutral-200 font-bold">BID_WHEAT_#7081</span>
                <span className="text-[8px] text-neutral-500">150 Tons @ Basmati. Local Stamp.</span>
              </div>
              <span className="text-[8px] px-1 bg-orange-950/40 border border-orange-500/35 text-orange-400 rounded animate-pulse">QUEUED</span>
            </div>

            <div className="bg-neutral-900 border border-neutral-850 p-2.5 rounded flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-neutral-200 font-bold">BID_RICE_#7080</span>
                <span className="text-[8px] text-neutral-500">90 Tons @ IRRI-6. Local Stamp.</span>
              </div>
              <span className="text-[8px] px-1 bg-orange-950/40 border border-orange-500/35 text-orange-400 rounded animate-pulse">QUEUED</span>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/15 border border-emerald-900/35 p-6 rounded-none text-center flex flex-col gap-1 items-center justify-center py-8">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-bounce mb-1" />
            <span className="text-[11px] font-bold text-emerald-400">SYNC ENTIRELY COMPLETED</span>
            <span className="text-[8px] text-neutral-500">All local mutations safely cataloged on Rails DB</span>
          </div>
        )}

        {/* Real-time terminal logs */}
        <div className="flex-1 bg-neutral-900/80 rounded-none border border-neutral-850 p-2.5 flex flex-col gap-1 overflow-y-auto min-h-[120px] max-h-[180px]">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-1 mb-1 text-[8px] text-neutral-500 font-bold">
            <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-orange-500" /> ENGINE_LOG_STDOUT</span>
            <span>STABLE</span>
          </div>
          <div className="flex flex-col gap-1 text-[8px] font-mono leading-tight tracking-tight text-neutral-400">
            {logs.map((log, index) => (
              <p key={index} className="break-all border-b border-neutral-900/10 last:border-0 pb-0.5">
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="p-3.5 bg-neutral-900/40 border-t border-neutral-900 flex gap-2">
        {networkState === 'offline' ? (
          <button 
            onClick={triggerReconnectAndSync}
            className="flex-1 py-2 bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-[9px] uppercase rounded-none select-none flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> RE-ROUTE CONNECTIVITY
          </button>
        ) : (
          <button 
            onClick={resetSimulation}
            disabled={syncStatus !== 'FINISHED'}
            className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 border border-neutral-700 font-bold text-[9px] uppercase rounded-none select-none flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
          >
            DISCONNECT CLIENT
          </button>
        )}
      </div>

      <div className="h-6 bg-neutral-950 flex items-center justify-center pb-2 select-none">
        <div className="w-32 h-1 bg-neutral-800 rounded-full"></div>
      </div>
    </div>
  );
}

// ─── 3. WEIGHBRIDGE ERP - OPERATIONS COMMAND CENTER ───
function WeighbridgeOperationsMockup() {
  const [scaleWeight, setScaleWeight] = useState(0);
  const [truckNo, setTruckNo] = useState('QA-70-H1');
  const [indicatorState, setIndicatorState] = useState<'IDLE' | 'READING' | 'STABLE'>('IDLE');
  const [camFeedActive, setCamFeedActive] = useState(true);
  const [savedTicket, setSavedTicket] = useState<{ id: string; weight: number; plate: string } | null>(null);

  const handleSimulateTruckScale = () => {
    setIndicatorState('READING');
    setScaleWeight(12430);
    setTruckNo(['QA-70-H1', 'BK-992-K', 'LH-4021-M'][Math.floor(Math.random() * 3)]);
    
    // Incrementally increase weight to simulate realistic scale
    let w = 12430;
    const interval = setInterval(() => {
      w += Math.floor(Math.random() * 8000) + 1200;
      if (w >= 38500) {
        clearInterval(interval);
        setScaleWeight(38480);
        setIndicatorState('STABLE');
      } else {
        setScaleWeight(w);
      }
    }, 180);
  };

  const handlePrintTicket = () => {
    if (indicatorState !== 'STABLE') return;
    setSavedTicket({
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      weight: scaleWeight,
      plate: truckNo
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-neutral-950 border border-neutral-800 rounded-none overflow-hidden shadow-2xl flex flex-col font-mono text-[11px] text-neutral-300 aspect-[16/9.5]">
      {/* Windows App Title Bar */}
      <div className="bg-neutral-900 border-b border-neutral-850 px-3 py-1.5 flex justify-between items-center select-none shrink-0">
        <div className="flex items-center gap-2">
          {/* OS Windows controls lights */}
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-650 inline-block border border-red-900/50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-550 inline-block border border-yellow-900/50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-650 inline-block border border-emerald-900/50"></span>
          </div>
          <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide">WEIGHBRIDGE PRO CONTROL Suite v4.0f</span>
        </div>
        <span className="text-[9px] text-neutral-600 bg-neutral-950 px-1.5 leading-tight py-0.5 border border-neutral-800">COM_STDOUT: COM3/9600 [CONNECTED]</span>
      </div>

      {/* Main Panel splitting */}
      <div className="flex-1 flex min-h-0">
        {/* Left Side: COM reader stream */}
        <div className="w-2/5 border-r border-neutral-850 p-3 bg-neutral-950 flex flex-col gap-3 min-w-[200px]">
          <div>
            <span className="text-[9px] text-neutral-500 font-bold block uppercase tracking-wide pb-1 border-b border-neutral-900">SERIAL PORT MONITOR</span>
            <div className="space-y-1.5 mt-2">
              <div className="flex justify-between items-baseline bg-neutral-900/50 p-2 border border-neutral-850 rounded-none">
                <span className="text-neutral-500 text-[10px]">Indicators:</span>
                <span className="text-xs text-neutral-200 font-bold">YAOHUA XK3190</span>
              </div>
              <div className="flex justify-between items-baseline bg-neutral-900/50 p-2 border border-neutral-850 rounded-none">
                <span className="text-neutral-500 text-[10px]">Read State:</span>
                <span className={`text-[10px] font-bold px-1.5 rounded-none uppercase ${
                  indicatorState === 'READING' ? 'text-orange-400 bg-orange-950/25 animate-pulse' :
                  indicatorState === 'STABLE' ? 'text-emerald-400 bg-emerald-950/25' :
                  'text-neutral-500 bg-neutral-900'
                }`}>
                  {indicatorState}
                </span>
              </div>
            </div>
          </div>

          {/* Large Scale Display readout */}
          <div className="bg-black border border-neutral-800/80 p-3 flex flex-col justify-between items-end rounded-none text-right relative overflow-hidden bg-radial-gradient">
            <div className="absolute top-1 left-2 text-[8px] font-bold text-neutral-700">INDICATOR FEED</div>
            <div className="text-xs text-neutral-400 mt-2 font-mono uppercase tracking-widest">{truckNo}</div>
            <div className={`text-2xl font-light font-mono ${indicatorState === 'STABLE' ? 'text-emerald-500 animate-pulse' : indicatorState === 'READING' ? 'text-orange-500' : 'text-neutral-700'}`}>
              {scaleWeight.toLocaleString()} <span className="text-xs">kg</span>
            </div>
            <span className="text-[8px] text-neutral-600 font-bold mt-1">NET WEIGHT VALUE</span>
          </div>

          {/* Quick Operations Button */}
          <button 
            onClick={handleSimulateTruckScale}
            disabled={indicatorState === 'READING'}
            className="w-full py-2 bg-neutral-100 hover:bg-white text-neutral-950 font-bold tracking-wider text-[10px] rounded-none uppercase cursor-pointer disabled:opacity-50 select-none flex items-center justify-center gap-1"
          >
            <Truck className="w-3.5 h-3.5" /> SIMULATE SCALE ENTRY
          </button>
        </div>

        {/* Right Side: RTSP Video Feed & Print Logs output */}
        <div className="flex-1 bg-neutral-950 p-3 flex flex-col gap-3 min-w-0">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
            {/* RTSP Camera simulator */}
            <div className="bg-neutral-900 border border-neutral-850 rounded-none relative flex flex-col overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-1.5 py-0.5 rounded-none text-[8px] font-bold border border-red-950/40 text-red-400 select-none">
                <span className="w-1.5 h-1.5 bg-red-650 rounded-full animate-ping"></span>
                RTSP CAM_01 [TRUCK LANE IN]
              </div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/60 px-1.5 py-0.5 rounded-none text-[8px] tracking-wide text-neutral-400 font-bold uppercase select-none">
                STABILIZED SCANNER
              </div>
              
              {/* Mock camera content */}
              <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950/95 relative grayscale select-none border-b border-neutral-800">
                {/* Crosshair indicator */}
                <div className="absolute inset-x-8 inset-y-6 border border-neutral-500/10 flex items-center justify-center">
                  <div className="w-6 h-[1px] bg-red-500/35"></div>
                  <div className="h-6 w-[1px] bg-red-500/35"></div>
                </div>
                {indicatorState === 'READING' ? (
                  <div className="text-center">
                    <Truck className="w-8 h-8 text-neutral-500 animate-bounce mx-auto" />
                    <p className="text-[9px] text-neutral-500 mt-1 uppercase font-semibold">Truck positioning...</p>
                  </div>
                ) : indicatorState === 'STABLE' ? (
                  <div className="text-center relative">
                    <div className="absolute -top-6 -left-6 w-3 h-3 border-t-2 border-l-2 border-emerald-500"></div>
                    <div className="absolute -top-6 -right-6 w-3 h-3 border-t-2 border-r-2 border-emerald-500"></div>
                    <div className="absolute -bottom-6 -left-6 w-3 h-3 border-b-2 border-l-2 border-emerald-500"></div>
                    <div className="absolute -bottom-6 -right-6 w-3 h-3 border-b-2 border-r-2 border-emerald-500"></div>
                    <span className="text-[14px] font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-none border border-emerald-500/30 uppercase">{truckNo}</span>
                    <p className="text-[8px] text-emerald-500 mt-1 uppercase font-semibold text-center tracking-wider">PLATE SCANNER RETRIEVED</p>
                  </div>
                ) : (
                  <div className="text-center text-neutral-600">
                    <Database className="w-8 h-8 mx-auto" />
                    <p className="text-[9px] mt-1 uppercase">Ready for inbound vehicle</p>
                  </div>
                )}
              </div>
            </div>

            {/* Generated transaction output */}
            <div className="bg-neutral-900 border border-neutral-850 rounded-none p-2.5 flex flex-col justify-between">
              <div>
                <span className="text-[9px] text-neutral-500 font-bold block uppercase tracking-wide mb-1.5">TICKET PREVIEW WRITER</span>
                {savedTicket ? (
                  <div className="font-mono text-[9px] bg-neutral-950 border border-neutral-850 p-2 rounded-none text-neutral-400 leading-tight space-y-1 select-none">
                    <p className="font-bold border-b border-neutral-900 pb-1 mb-1 text-neutral-300">WEIGHBRIDGE RECEIPT</p>
                    <p><span className="text-neutral-500">TKT CLASS:</span> {savedTicket.id}</p>
                    <p><span className="text-neutral-500">PLATE ID:</span>  {savedTicket.plate}</p>
                    <p><span className="text-neutral-500">GROSS WT:</span>  {savedTicket.weight.toLocaleString()} kg</p>
                    <p><span className="text-neutral-500">STAMPED :</span>  {new Date().toLocaleTimeString()}</p>
                    <p className="text-emerald-500 text-[8px] font-bold border-t border-neutral-900 pt-1 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> PARSED & DISPATCHED TO CLOUD
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-neutral-600 flex flex-col justify-center items-center h-28 border border-dashed border-neutral-800 rounded-none">
                    <Terminal className="w-6 h-6 mb-1 text-neutral-700" />
                    <p className="text-[8px] uppercase tracking-wide">Awaiting stability trigger</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handlePrintTicket}
                disabled={indicatorState !== 'STABLE'}
                className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-750 text-white font-bold tracking-wider text-[9px] border border-neutral-750 uppercase rounded-none cursor-pointer disabled:opacity-40"
              >
                SUBMIT & RECORD TICKET
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 4. LEAD QUALIFICATION AGENT - Slack Alerts Companion ───
function LeadsAlertMockup() {
  const [selectedLead, setSelectedLead] = useState<'saasify' | 'bizzpro'>('saasify');
  const [isQualified, setIsQualified] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState(false);

  const handleCopy = () => {
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const leadsData = {
    saasify: {
      name: "SaaSify Inc",
      domain: "saasify.io",
      icpScore: "96%",
      funding: "$14M Series A",
      scrapedInd: "Enterprise Pricing package, $12k MRR minimum, Hubspot CRM traces...",
      snippet: "Looking to deploy scalable CRM pipelines. Contact details mapped to verified business email arrays."
    },
    bizzpro: {
      name: "BizzPro Logistics",
      domain: "bizzpro-logistics.com",
      icpScore: "88%",
      funding: "Bootstrapped ($50M+ ARR)",
      scrapedInd: "RTSP camera stream software updates, cargo trucking indicators...",
      snippet: "Enterprise distribution logistics provider running multi-tenant warehouse models. Operations coordinates outgoings."
    }
  };

  const currentLead = leadsData[selectedLead];

  return (
    <div className="w-full max-w-[310px] mx-auto bg-neutral-950 border-[6px] border-neutral-900 rounded-none overflow-hidden shadow-2xl relative flex flex-col font-mono text-xs text-neutral-300 aspect-[9/18.5]">
      {/* Phone Notch */}
      <div className="absolute top-0 inset-x-0 h-5 bg-neutral-950 flex items-center justify-center z-20">
        <div className="w-24 h-3.5 bg-neutral-900 rounded-none"></div>
      </div>

      {/* Phone Status bar */}
      <div className="h-9 bg-neutral-950 px-5 pt-4 flex justify-between items-center text-[9px] text-neutral-500 font-bold tracking-tight select-none">
        <span>11:53 AM</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] bg-sky-950 px-1 border border-sky-500/20 text-sky-400 rounded-none">SLACK LINK</span>
          <Wifi className="w-3 h-3 text-neutral-400" />
        </div>
      </div>

      {/* Screen App bar */}
      <div className="bg-neutral-900/90 border-b border-neutral-850 p-3 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-none bg-neutral-850 border border-neutral-700/50">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <span className="text-[10px] font-bold text-neutral-200">ICP INTEL CHRONICLER</span>
        </div>
        <span className="text-[9px] bg-sky-950/40 text-sky-400 border border-sky-800/40 px-1.5 py-0.5 rounded-none uppercase font-bold">
          LIVE DIALS
        </span>
      </div>

      {/* Contacts List Feed */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 bg-neutral-950">
        {/* Toggle leads button bar */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-900 rounded-none">
          <button 
            onClick={() => setSelectedLead('saasify')}
            className={`py-1.5 text-[9px] rounded-none font-bold uppercase transition select-none cursor-pointer text-center ${
              selectedLead === 'saasify' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            SaaSify Inc
          </button>
          <button 
            onClick={() => setSelectedLead('bizzpro')}
            className={`py-1.5 text-[9px] rounded-none font-bold uppercase transition select-none cursor-pointer text-center ${
              selectedLead === 'bizzpro' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            BizzPro
          </button>
        </div>

        {/* Lead profile detail card */}
        <div className="bg-neutral-900/45 border border-neutral-850 p-3 rounded-none flex flex-col gap-2.5">
          <div className="flex justify-between items-start border-b border-neutral-800/40 pb-2">
            <div>
              <h5 className="font-bold text-neutral-100">{currentLead.name}</h5>
              <p className="text-[8px] text-neutral-500 hover:underline cursor-pointer">{currentLead.domain}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-extrabold text-sky-400 font-bold bg-sky-950/45 border border-sky-500/20 px-1.5 py-0.5 rounded-none block mb-0.5">
                {currentLead.icpScore} FIT
              </span>
              <span className="text-[7px] text-neutral-500 tracking-wider">ICP CLASSIFIER</span>
            </div>
          </div>

          <div className="space-y-2 text-[9px]">
            <div>
              <span className="text-neutral-500 font-bold uppercase block tracking-wider text-[8px] mb-0.5">FUNDING HIGHLIGHTS</span>
              <span className="text-neutral-200">{currentLead.funding}</span>
            </div>

            <div>
              <span className="text-neutral-500 font-bold uppercase block tracking-wider text-[8px] mb-0.5">AI EXTRACTED SIGNALS</span>
              <p className="text-neutral-450 leading-relaxed italic">
                "{currentLead.scrapedInd}"
              </p>
            </div>

            <div>
              <span className="text-neutral-500 font-bold uppercase block tracking-wider text-[8px] mb-0.5 font-bold">RECRUITS INTENT DEMAND</span>
              <p className="text-neutral-400 leading-normal font-sans text-[10px]">
                {currentLead.snippet}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export outreach button actions */}
      <div className="p-3 bg-neutral-900/40 border-t border-neutral-900 flex flex-col gap-2 shrink-0">
        <button 
          onClick={handleCopy}
          className="w-full py-2 bg-neutral-150 hover:bg-white text-neutral-950 font-bold tracking-wider text-[9px] uppercase rounded-none cursor-pointer select-none flex items-center justify-center gap-1.5"
        >
          {copiedText ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" /> COPIED INTEGRATION HOOK
            </>
          ) : (
            <>
              <Send className="w-3 h-3" /> EXPORT TO COLD-SEQUENCE
            </>
          )}
        </button>
      </div>

      <div className="h-6 bg-neutral-950 flex items-center justify-center pb-2 select-none">
        <div className="w-32 h-1 bg-neutral-800 rounded-full"></div>
      </div>
    </div>
  );
}

// ─── 5. CRM WITH LEADS MODULE - Web Kanban Workstream ───
function CRMWebKanbanMockup() {
  const [boardLanes, setBoardLanes] = useState({
    incoming: [
      { id: '1', title: 'Streamline ERP', domain: 'streamline.io', score: '94%' },
      { id: '2', title: 'TechVibe Corp', domain: 'techvibe.com', score: '89%' }
    ],
    qualified: [
      { id: '3', title: 'Aegis Networks', domain: 'aegis.net', score: '97%' }
    ],
    contacted: [
      { id: '4', title: 'Zeta Labs', domain: 'zeta.io', score: '91%' }
    ]
  });

  const [activeLaneDetails, setActiveLaneDetails] = useState<string | null>(null);

  const handlePromoteLead = (leadId: string, fromLane: 'incoming' | 'qualified') => {
    const item = boardLanes[fromLane].find(i => i.id === leadId);
    if (!item) return;

    if (fromLane === 'incoming') {
      setBoardLanes(prev => ({
        ...prev,
        incoming: prev.incoming.filter(i => i.id !== leadId),
        qualified: [...prev.qualified, item]
      }));
    } else if (fromLane === 'qualified') {
      setBoardLanes(prev => ({
        ...prev,
        qualified: prev.qualified.filter(i => i.id !== leadId),
        contacted: [...prev.contacted, item]
      }));
    }
  };

  const handleResetLeads = () => {
    setBoardLanes({
      incoming: [
        { id: '1', title: 'Streamline ERP', domain: 'streamline.io', score: '94%' },
        { id: '2', title: 'TechVibe Corp', domain: 'techvibe.com', score: '89%' }
      ],
      qualified: [
        { id: '3', title: 'Aegis Networks', domain: 'aegis.net', score: '97%' }
      ],
      contacted: [
        { id: '4', title: 'Zeta Labs', domain: 'zeta.io', score: '91%' }
      ]
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-neutral-950 border border-neutral-850 rounded-none overflow-hidden shadow-2xl flex flex-col font-sans text-xs text-neutral-300 aspect-[16/10]">
      {/* Browser address bar mockup */}
      <div className="bg-neutral-900 border-b border-neutral-850 px-3 py-2 flex items-center gap-3 shrink-0 select-none">
        <div className="flex gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-neutral-800 flex items-center justify-center text-[8px] font-bold">←</span>
          <span className="w-3 h-3 rounded-full bg-neutral-800 flex items-center justify-center text-[8px] font-bold">→</span>
          <span className="w-3 h-3 rounded-full bg-neutral-800 flex items-center justify-center text-[8px] font-bold">↻</span>
        </div>
        <div className="flex-1 bg-neutral-950 rounded-none px-3 py-1 font-mono text-[10px] text-neutral-500 border border-neutral-800 flex justify-between items-center">
          <span className="truncate">https://leads.mosen.dev/dashboard/kanban</span>
          <span className="text-[8px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-1 py-0.5 rounded-none leading-none">HTTPS : TLS v1.3</span>
        </div>
        <button 
          onClick={handleResetLeads}
          className="p-1 px-2 border border-neutral-800 hover:border-neutral-700 hover:text-white rounded-none text-[10px] bg-neutral-950 font-mono transition inline-block cursor-pointer select-none"
        >
          RESET BOARD
        </button>
      </div>

      {/* Main Kanban Content Area */}
      <div className="flex-1 bg-neutral-950 p-4 flex gap-4 min-h-0 overflow-x-auto select-none">
        {/* Lane 1: Incoming */}
        <div className="flex-1 flex flex-col gap-3 min-w-[140px] bg-neutral-900/30 border border-neutral-900 p-2.5 rounded-none">
          <div className="flex justify-between items-center border-b border-neutral-900/60 pb-1.5 shrink-0">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Incoming (AI Logs)</span>
            <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded-none">{boardLanes.incoming.length}</span>
          </div>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-0 pr-0.5">
            {boardLanes.incoming.map(lead => (
              <div 
                key={lead.id}
                className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800/80 p-2.5 rounded-none transition duration-200 cursor-pointer flex flex-col gap-2 group relative"
              >
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-neutral-200">{lead.title}</span>
                  <span className="text-[9px] text-neutral-500 font-mono">{lead.domain}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[8px] bg-orange-950/50 border border-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-none font-mono">{lead.score} fit</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePromoteLead(lead.id, 'incoming'); }}
                    className="p-1 px-1.5 bg-neutral-800 text-[8px] uppercase tracking-wide font-bold hover:bg-white hover:text-neutral-950 transition rounded-none font-mono cursor-pointer"
                  >
                    Promote →
                  </button>
                </div>
              </div>
            ))}
            {boardLanes.incoming.length === 0 && (
              <span className="text-[10px] text-neutral-600 block text-center mt-6 italic">Lane dry</span>
            )}
          </div>
        </div>

        {/* Lane 2: Qualified */}
        <div className="flex-1 flex flex-col gap-3 min-w-[140px] bg-neutral-900/30 border border-neutral-900 p-2.5 rounded-none text-left">
          <div className="flex justify-between items-center border-b border-neutral-900/60 pb-1.5 shrink-0">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Qualified Leads</span>
            <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded-none">{boardLanes.qualified.length}</span>
          </div>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-0 pr-0.5">
            {boardLanes.qualified.map(lead => (
              <div 
                key={lead.id}
                className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800/80 p-2.5 rounded-none transition duration-200 cursor-pointer flex flex-col gap-2 group"
              >
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-neutral-200">{lead.title}</span>
                  <span className="text-[9px] text-neutral-500 font-mono">{lead.domain}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[8px] bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-none font-mono">{lead.score} fit</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePromoteLead(lead.id, 'qualified'); }}
                    className="p-1 px-1.5 bg-neutral-800 text-[8px] uppercase tracking-wide font-bold hover:bg-white hover:text-neutral-950 transition rounded-none font-mono cursor-pointer"
                  >
                    Promote →
                  </button>
                </div>
              </div>
            ))}
            {boardLanes.qualified.length === 0 && (
              <span className="text-[10px] text-neutral-600 block text-center mt-6 italic">Lane dry</span>
            )}
          </div>
        </div>

        {/* Lane 3: Outbox Contacted */}
        <div className="flex-1 flex flex-col gap-3 min-w-[140px] bg-neutral-900/30 border border-neutral-900 p-2.5 rounded-none">
          <div className="flex justify-between items-center border-b border-neutral-900/60 pb-1.5 shrink-0">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Contacted Outreach</span>
            <span className="text-[10px] font-bold text-neutral-400 bg-neutral-955 px-1.5 py-0.5 rounded-none">{boardLanes.contacted.length}</span>
          </div>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-0 pr-0.5">
            {boardLanes.contacted.map(lead => (
              <div 
                key={lead.id}
                className="bg-neutral-905/85 border border-dashed border-neutral-800 p-2.5 rounded-none opacity-80 flex flex-col gap-1 text-left"
              >
                <span className="text-[11px] font-semibold text-neutral-300">{lead.title}</span>
                <span className="text-[8px] text-neutral-500 font-mono mb-1">{lead.domain}</span>
                <div className="flex items-center gap-1 text-[8px] text-neutral-500 font-mono border-t border-neutral-900 pt-1">
                  <Check className="w-2.5 h-2.5 text-emerald-500" /> OUTBOX SENT
                </div>
              </div>
            ))}
            {boardLanes.contacted.length === 0 && (
              <span className="text-[10px] text-neutral-600 block text-center mt-6 italic">No emails dispatched</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
