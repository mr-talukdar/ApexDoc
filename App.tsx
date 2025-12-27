import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  Database, 
  Brain, 
  Shield, 
  ArrowDown, 
  CheckCircle, 
  XCircle, 
  Layers, 
  Code,
  FileJson,
  Play,
  Terminal,
  AlertCircle,
  Smartphone,
  Share2,
  Cpu,
  Globe,
  Zap,
  Layout,
  MousePointer2,
  FileText,
  GitCommit,
  ArrowRight,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';
import { UserStatus, MembershipStatus, UserRole, GroupJoinPolicy } from './types';
import { canJoinGroup } from './domain/rules';

// --- Lifecycle Diagram Component ---

const RequestLifecycle = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((prev) => {
          if (prev >= 5) {
            setIsPlaying(false);
            return 5;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const steps = [
    { 
      id: 0, 
      label: 'Initiate', 
      desc: 'User clicks "Join Group"',
      source: 'CLIENT', 
      target: 'API',
      sourceIcon: Smartphone,
      targetIcon: Server
    },
    { 
      id: 1, 
      label: 'Fetch Facts', 
      desc: 'API gets User & Group data',
      source: 'API', 
      target: 'DB',
      sourceIcon: Server,
      targetIcon: Database
    },
    { 
      id: 2, 
      label: 'Return Facts', 
      desc: 'DB returns raw entities',
      source: 'DB', 
      target: 'API',
      sourceIcon: Database,
      targetIcon: Server
    },
    { 
      id: 3, 
      label: 'Validate', 
      desc: 'API maps to Domain Types & asks Rules',
      source: 'API', 
      target: 'DOMAIN',
      sourceIcon: Server,
      targetIcon: Brain
    },
    { 
      id: 4, 
      label: 'Decision', 
      desc: 'Domain returns { allowed: true/false }',
      source: 'DOMAIN', 
      target: 'API',
      sourceIcon: Brain,
      targetIcon: Server
    },
    { 
      id: 5, 
      label: 'Response', 
      desc: 'API updates DB (if allowed) & responds',
      source: 'API', 
      target: 'CLIENT',
      sourceIcon: Server,
      targetIcon: Smartphone
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-8 my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h4 className="text-lg font-bold text-slate-900 font-serif">Visual Trace</h4>
           <p className="text-sm text-slate-500">Simulating the path of a single request.</p>
        </div>
        <button 
          onClick={() => { setStep(0); setIsPlaying(true); }}
          disabled={isPlaying && step < 5}
          className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isPlaying ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        >
          {step === 5 && !isPlaying ? <RefreshCw size={16} /> : <Play size={16} />}
          {step === 5 && !isPlaying ? 'Replay Trace' : isPlaying ? 'Tracing...' : 'Start Trace'}
        </button>
      </div>

      {/* Diagram Container */}
      <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 py-4 md:py-8 px-2 md:px-4">
        
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-slate-200 -z-0"></div>

        {/* Nodes */}
        {['CLIENT', 'API', 'DB', 'DOMAIN'].map((node, index) => {
          let isActive = false;
          let isSource = currentStep.source === node;
          let isTarget = currentStep.target === node;
          
          if (node === 'CLIENT') isActive = isSource || isTarget;
          if (node === 'API') isActive = isSource || isTarget; // API is almost always active
          if (node === 'DB') isActive = step === 1 || step === 2;
          if (node === 'DOMAIN') isActive = step === 3 || step === 4;

          const icons = { CLIENT: Smartphone, API: Server, DB: Database, DOMAIN: Brain };
          const Icon = icons[node as keyof typeof icons];
          
          return (
            <div key={node} className={`relative z-10 flex flex-col items-center transition-all duration-500 ${isActive ? 'scale-110' : 'opacity-60 grayscale'}`}>
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border-4 shadow-xl transition-colors duration-500 ${
                 isActive 
                 ? 'bg-white border-indigo-500 text-indigo-600' 
                 : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}>
                <Icon size={28} className="md:w-8 md:h-8" />
              </div>
              <span className="mt-2 md:mt-4 font-bold text-[10px] md:text-xs tracking-widest text-slate-500">{node}</span>
            </div>
          )
        })}
      </div>

      {/* Step Indicator */}
      <div className="mt-8 bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-center gap-4 shadow-sm min-h-[80px]">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
                <currentStep.sourceIcon size={20} />
             </div>
             <ArrowRight size={20} className="text-slate-300" />
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
                <currentStep.targetIcon size={20} />
             </div>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Step {step + 1}: {currentStep.label}</span>
            <p className="text-slate-700 font-medium text-sm">{currentStep.desc}</p>
          </div>
      </div>
    </div>
  );
};

// --- Architecture Explorer Component ---

const ArchitectureExplorer = () => {
  const [activeLayerId, setActiveLayerId] = useState('api');

  const layers = [
    {
      id: 'client',
      navTitle: 'Client Layer',
      navSubtitle: 'UI / Presentation',
      icon: Smartphone,
      colorClass: 'blue',
      details: {
        title: 'Client Layer',
        quote: '"Reflects the outcome of decisions."',
        items: [
          { icon: Layout, label: 'View', text: 'Renders the UI based on state returned by the API.' },
          { icon: Zap, label: 'Action', text: 'Captures user intent (e.g., "Join Group") and sends it to the API.' },
          { icon: Globe, label: 'Passive', text: 'Never calculates business rules locally. It only displays what the domain allows.' }
        ]
      }
    },
    {
      id: 'api',
      navTitle: 'API Layer',
      navSubtitle: 'Orchestration',
      icon: Share2,
      colorClass: 'indigo',
      details: {
        title: 'API Orchestrator',
        quote: '"The bridge between facts and decisions."',
        items: [
          { icon: Shield, label: 'Authenticate', text: 'Verify Google/NextAuth sessions.' },
          { icon: Layers, label: 'Map & Ask', text: 'Pulls DB facts, maps to Domain Types, and calls the Domain engine.' },
          { icon: CheckCircle, label: 'Execute', text: 'Only updates the DB if the Domain allows the decision.' }
        ]
      }
    },
    {
      id: 'domain',
      navTitle: 'Domain Layer',
      navSubtitle: 'The Brain',
      icon: Cpu,
      colorClass: 'pink',
      details: {
        title: 'The Brain',
        quote: '"Pure, deterministic business logic."',
        items: [
          { icon: Shield, label: 'Authorize', text: 'Defines exactly what is allowed (e.g., canJoinGroup).' },
          { icon: Code, label: 'Rules', text: 'Encodes complex business requirements and state transitions.' },
          { icon: XCircle, label: 'Pure', text: 'Zero dependencies. No Database, no API, no UI knowledge.' }
        ]
      }
    },
    {
      id: 'data',
      navTitle: 'Data Layer',
      navSubtitle: 'Facts & Persistence',
      icon: Database,
      colorClass: 'emerald',
      details: {
        title: 'Data Access Layer',
        quote: '"The single source of truth."',
        items: [
          { icon: Database, label: 'Store', text: 'Persists entities (Users, Groups, Memberships).' },
          { icon: ArrowDown, label: 'Retrieve', text: 'Fetches raw facts for the API layer to use.' },
          { icon: XCircle, label: 'Dumb', text: 'Contains no business rules or logic. It just holds data.' }
        ]
      }
    }
  ];

  const activeLayer = layers.find(l => l.id === activeLayerId) || layers[1];

  // Helper to get color styles dynamically
  const getStyles = (color: string, isActive: boolean) => {
    const baseColors: Record<string, any> = {
      blue: { 
        border: 'border-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-500/20', iconBg: 'bg-blue-100',
        lightBg: 'bg-blue-600', lightText: 'text-blue-100'
      },
      indigo: { 
        border: 'border-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-500/20', iconBg: 'bg-indigo-100',
        lightBg: 'bg-indigo-600', lightText: 'text-indigo-100'
      },
      pink: { 
        border: 'border-pink-600', bg: 'bg-pink-50', text: 'text-pink-700', ring: 'ring-pink-500/20', iconBg: 'bg-pink-100',
        lightBg: 'bg-pink-600', lightText: 'text-pink-100'
      },
      emerald: { 
        border: 'border-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-500/20', iconBg: 'bg-emerald-100',
        lightBg: 'bg-emerald-600', lightText: 'text-emerald-100'
      },
    };
    return baseColors[color];
  };

  const activeStyles = getStyles(activeLayer.colorClass, true);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Left Column: Navigation (Scrollable on Mobile) */}
      <div className="flex flex-row overflow-x-auto pb-4 lg:pb-0 lg:flex-col gap-3 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
        {layers.map((layer) => {
          const isActive = layer.id === activeLayerId;
          const styles = getStyles(layer.colorClass, isActive);
          
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayerId(layer.id)}
              className={`group text-left p-4 rounded-lg border transition-all duration-200 flex items-center gap-4 relative flex-shrink-0 lg:flex-shrink min-w-[260px] lg:min-w-0 ${
                isActive 
                  ? `bg-white ${styles.border} shadow-sm ring-1 ${styles.ring}` 
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-md transition-colors ${
                isActive ? `${styles.iconBg} ${styles.text}` : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
              }`}>
                <layer.icon size={20} />
              </div>
              <div className="flex-1">
                <div className={`font-bold text-sm ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                  {layer.navTitle}
                </div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
                  {layer.navSubtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Column: Details */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 h-full shadow-sm relative overflow-hidden transition-all duration-500">
           {/* Decorative Top Line */}
           <div className={`absolute top-0 left-0 w-full h-1 ${activeStyles.lightBg}`}></div>

           <div className="flex items-center gap-3 mb-6">
              <activeLayer.icon className={activeStyles.text} size={28} />
              <h3 className="text-2xl font-bold text-slate-900 font-serif">{activeLayer.details.title}</h3>
           </div>

           <p className="text-lg text-slate-600 italic mb-8 font-serif border-l-2 pl-4 py-1 border-slate-200">
              {activeLayer.details.quote}
           </p>

           <div className="space-y-6">
              {activeLayer.details.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 animate-in slide-in-from-bottom-2 fade-in duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                   <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full ${activeStyles.iconBg} ${activeStyles.text} flex items-center justify-center`}>
                      <item.icon size={16} />
                   </div>
                   <div>
                      <h5 className="font-bold text-slate-900 text-base mb-1">{item.label}</h5>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};


// --- Brain Sandbox Component ---

const BrainSandbox = () => {
  // Simplified UI States
  const [userType, setUserType] = useState<string>('REGULAR');
  const [groupType, setGroupType] = useState<string>('ACTIVE');
  const [membership, setMembership] = useState<MembershipStatus>(MembershipStatus.NONE);

  // 1. Map UI State -> Domain Entities
  // This simulates fetching data from the DB layer
  const mockUser = { 
    id: 'sim-user', 
    name: userType === 'ADMIN' ? 'Admin User' : 'Sim User', 
    email: 'sim@apex.com', 
    role: userType === 'ADMIN' ? UserRole.ADMIN : UserRole.RIDER, 
    status: userType === 'SUSPENDED' ? UserStatus.SUSPENDED : UserStatus.ACTIVE 
  };

  const mockGroup = { 
    id: 'sim-group', 
    name: 'Simulation Group', 
    description: 'A test group', 
    isActive: groupType !== 'ARCHIVE', 
    policy: groupType === 'PRIVATE' ? GroupJoinPolicy.INVITE_ONLY : GroupJoinPolicy.OPEN, 
    imageUrl: '' 
  };

  // 2. 🧠 EXECUTE DOMAIN RULE (Pure Function)
  const decision = canJoinGroup(mockUser, mockGroup, membership);

  return (
    <section id="sandbox" className="scroll-mt-24">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Controls */}
        <div>
          <div className="flex items-center gap-2 mb-4">
             <Brain className="text-pink-600" size={24} />
             <h3 className="text-2xl font-bold text-slate-900 font-serif">The Brain Sandbox</h3>
          </div>
          
          <p className="text-base text-slate-600 mb-8 leading-relaxed">
            The Domain layer is a pure function. Toggle the states below to see how the system reaches a decision. 
            This logic is identical whether called from the Web dashboard or the Mobile app.
          </p>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6 text-slate-400 text-[10px] font-bold tracking-wider uppercase">
              <Code size={12} /> Simulation Input
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">User Identity</label>
                <select 
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-pink-500 focus:border-pink-500 block p-2.5"
                >
                  <option value="REGULAR">Regular User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUSPENDED">Suspended User</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Group State</label>
                <select 
                   value={groupType}
                   onChange={(e) => setGroupType(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-pink-500 focus:border-pink-500 block p-2.5"
                >
                  <option value="ACTIVE">Active Group</option>
                  <option value="ARCHIVE">Archive (Inactive)</option>
                  <option value="PRIVATE">Private (Invite Only)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Membership</label>
              <select 
                 value={membership}
                 onChange={(e) => setMembership(e.target.value as MembershipStatus)}
                 className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-pink-500 focus:border-pink-500 block p-2.5"
              >
                <option value={MembershipStatus.NONE}>None (New User)</option>
                <option value={MembershipStatus.PENDING}>Pending</option>
                <option value={MembershipStatus.ACTIVE}>Accepted (Active)</option>
                <option value={MembershipStatus.REJECTED}>Rejected Previously</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Terminal Output */}
        <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden ring-1 ring-slate-900/5 mt-4 lg:mt-0">
          {/* Terminal Header */}
          <div className="bg-slate-950 px-4 py-2 flex justify-between items-center border-b border-slate-800">
             <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
             </div>
             <div className="text-[10px] text-slate-500 font-mono">DOMAIN::DECISION_MODEL</div>
          </div>

          <div className="p-4 md:p-6">
            <div className="font-mono text-xs text-blue-400 mb-4 opacity-75">// Output</div>
            
            {/* Outcome Card */}
            <div className={`rounded-lg p-5 mb-8 border transition-colors duration-300 ${
              decision.allowed 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-1.5 rounded-full ${
                  decision.allowed ? 'bg-green-500 text-slate-900' : 'bg-red-500 text-white'
                }`}>
                  {decision.allowed ? <CheckCircle size={18} /> : <XCircle size={18} />}
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${
                    decision.allowed ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {decision.allowed ? 'Allowed' : 'Denied'}
                  </h4>
                  <p className="text-slate-400 mt-1 text-sm">
                    {decision.reason || 'Transition allowed.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Trace Log */}
            <div className="space-y-2 font-mono text-xs">
              <div className="text-slate-500 text-[10px] font-bold tracking-wider mb-2">DEBUG LOG</div>
              <div className="text-blue-300">Evaluating: <span className="text-white">canJoinGroup(...)</span></div>
              
              <div className="pl-3 border-l border-slate-700 flex flex-col gap-1 text-slate-400 mt-2">
                <div className="flex gap-2">
                  <span className="text-slate-500">{'>'} User:</span> 
                  <span className={mockUser.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}>
                    {mockUser.status}
                  </span>
                  <span className="text-slate-600">({mockUser.role})</span>
                </div>
                
                <div className="flex gap-2">
                  <span className="text-slate-500">{'>'} Group:</span>
                  <span className={mockGroup.isActive ? 'text-green-400' : 'text-red-400'}>
                    {mockGroup.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <span className="text-slate-600">({mockGroup.policy})</span>
                </div>

                <div className="flex gap-2">
                  <span className="text-slate-500">{'>'} Membership:</span>
                  <span className="text-indigo-400">{membership}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-800 text-emerald-400 flex items-center gap-2">
                <span>{'>'} Return:</span> 
                <span className={`font-bold ${decision.allowed ? 'text-green-400' : 'text-red-400'}`}>
                  {decision.allowed ? 'ALLOWED' : 'DENIED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Logic: triggers when the element is in the top 40% of the screen roughly
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['intro', 'lifecycle', 'architecture', 'sandbox'];
    
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const NavItem = ({ id, label }: { id: string, label: string }) => (
    <a 
      href={`#${id}`}
      onClick={() => setIsMobileMenuOpen(false)}
      className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        activeSection === id 
        ? 'text-indigo-700 bg-indigo-50 font-bold' 
        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
      }`}
    >
      {label}
    </a>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
      
      {/* Mobile Header (Sticky) */}
      <div className="lg:hidden bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="bg-slate-900 text-white p-1.5 rounded">
              <GitCommit size={18} />
           </div>
           <span className="font-serif font-bold text-lg tracking-tight">Apex <span className="text-slate-400 text-sm font-normal">Docs</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen max-w-7xl mx-auto">
        
        {/* Sidebar Navigation */}
        <aside className={`
            fixed inset-0 z-40 bg-white pt-20 lg:pt-0
            lg:w-64 lg:flex-shrink-0 lg:border-r border-slate-200 lg:h-screen lg:sticky lg:top-0
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
           <div className="p-6 h-full overflow-y-auto">
              <div className="hidden lg:flex items-center gap-2 mb-8">
                <div className="bg-slate-900 text-white p-1.5 rounded">
                  <GitCommit size={20} />
                </div>
                <span className="font-serif font-bold text-xl tracking-tight">Apex <span className="text-slate-400 text-base font-normal">Docs</span></span>
              </div>

              <nav className="space-y-1">
                <NavItem id="intro" label="Introduction" />
                <NavItem id="lifecycle" label="Lifecycle of a Request" />
                <NavItem id="architecture" label="System Components" />
                <NavItem id="sandbox" label="Domain Logic" />
              </nav>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Meta</h5>
                <div className="text-xs text-slate-500 space-y-2">
                  <div className="flex justify-between"><span>Version</span> <span>1.2.1</span></div>
                  <div className="flex justify-between"><span>Status</span> <span className="text-green-600 font-medium">Stable</span></div>
                  <div className="flex justify-between"><span>Last Upd</span> <span>Dec 27 2025</span></div>
                </div>
              </div>
           </div>
        </aside>

        {/* Overlay for mobile when menu is open */}
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
            />
        )}

        {/* Main Content */}
        <main className="flex-1 px-4 py-8 lg:px-16 lg:py-12 max-w-4xl w-full mx-auto">
          
          {/* Header */}
          <header id="intro" className="mb-12 md:mb-16 pb-8 border-b border-slate-100">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
              System Design Document
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight font-serif">
              Apex Governance <br/> Architecture
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-serif">
              A decision-driven architecture designed to separate core business logic from data persistence and API orchestration.
            </p>
          </header>

          {/* Lifecycle Section (NEW) */}
          <section id="lifecycle" className="mb-16 md:mb-20 scroll-mt-24">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-slate-100 rounded-lg"><RefreshCw size={20} className="text-slate-700"/></div>
               <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">Lifecycle of a Request</h2>
             </div>
             <p className="text-slate-600 mb-6 text-sm md:text-base">
               The system follows a strict unidirectional flow for every state change. The API acts as the orchestrator, ensuring data is validated against the Domain model before any persistence occurs.
             </p>
             
             {/* The Interactive Diagram */}
             <RequestLifecycle />

          </section>

          <hr className="border-slate-100 my-12 md:my-16" />

          {/* Architecture Section */}
          <section id="architecture" className="mb-16 md:mb-20 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg"><Layers size={20} className="text-slate-700"/></div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">System Components</h2>
            </div>
            <p className="mb-8 text-slate-600 text-sm md:text-base">
              The application is stratified into four distinct layers. Click a layer below to view its specific responsibilities and isolation rules.
            </p>
            
            <ArchitectureExplorer />
          </section>

          <hr className="border-slate-100 my-12 md:my-16" />

          {/* Sandbox Section */}
          <section id="sandbox" className="mb-20">
             {/* Component handles its own headers */}
             <BrainSandbox />
          </section>

          {/* Footer */}
          <footer className="mt-20 md:mt-32 pt-12 border-t border-slate-200 text-center">
             <div className="flex items-center justify-center gap-2 mb-4 text-slate-400">
                <FileText size={16} />
                <span className="text-sm font-medium">End of Document</span>
             </div>
             <p className="text-slate-500 text-sm">
               &copy; {new Date().getFullYear()} <a href="https://github.com/mr-talukdar">Rahul Talukdar</a>.
             </p>
          </footer>

        </main>
      </div>
    </div>
  );
}