/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  UserProfile, 
  Material, 
  Activity, 
  StudentProgress, 
  RPGStats, 
  BillingConfig, 
  StudentSubscription, 
  GlobalMessage, 
  FullAppState, 
  UserRole 
} from './types';
import { 
  Award, 
  BookOpen, 
  Compass, 
  Coins, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Send, 
  Upload, 
  User, 
  CheckCircle, 
  Lock, 
  X, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Terminal, 
  RefreshCw, 
  Eye, 
  QrCode, 
  Link, 
  LogOut, 
  HelpCircle,
  FileText
} from 'lucide-react';

export default function App() {
  // Session states
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [sessionRole, setSessionRole] = useState<UserRole | null>(null);
  const [currentTeacherId, setCurrentTeacherId] = useState<string>('teacher-garcia'); // Linked teacher context for student/guest

  // Database application State synchronized with Express backend
  const [appState, setAppState] = useState<FullAppState | null>(null);
  const [isLoadingState, setIsLoadingState] = useState<boolean>(true);

  // Active student activity work and timers
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [focusModeActive, setFocusModeActive] = useState<boolean>(false);
  const [focusTimerSeconds, setFocusTimerSeconds] = useState<number>(0);
  const [checkpointResponse, setCheckpointResponse] = useState<string>('');
  const [isSubmittingActivity, setIsSubmittingActivity] = useState<boolean>(false);

  // AI Chat assistant integration
  const [aiChatQuery, setAiChatQuery] = useState<string>('');
  const [aiChatResponse, setAiChatResponse] = useState<string>('');
  const [isLoadingAiChat, setIsLoadingAiChat] = useState<boolean>(false);
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'assistant', text: string }>>([
    { sender: 'assistant', text: '¡Hola aventurero! Soy tu guía de MentorAI. ¿Qué misterio científico o matemático de la clase de hoy resolveremos juntos?' }
  ]);

  // Docente Creation states
  const [newMaterialTitle, setNewMaterialTitle] = useState<string>('');
  const [newMaterialContent, setNewMaterialContent] = useState<string>('');
  const [newMaterialType, setNewMaterialType] = useState<'pdf_text' | 'video_link' | 'text_note'>('pdf_text');
  
  const [newActivityTitle, setNewActivityTitle] = useState<string>('');
  const [newActivityInstructions, setNewActivityInstructions] = useState<string>('');
  const [newActivityDuration, setNewActivityDuration] = useState<number>(5);
  const [newActivityPoints, setNewActivityPoints] = useState<number>(30);
  const [newActivityInvCode, setNewActivityInvCode] = useState<string>('');
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);

  // Docente billing configs
  const [docenteWalletType, setDocenteWalletType] = useState<'Nequi' | 'Daviplata' | 'Pago Movil' | 'Alias / Otro'>('Nequi');
  const [docenteWalletDetail, setDocenteWalletDetail] = useState<string>('');
  const [docenteWeeklyPrice, setDocenteWeeklyPrice] = useState<number>(2000);
  const [docenteMonthlyPrice, setDocenteMonthlyPrice] = useState<number>(6000);

  // Broadcast
  const [broadTitle, setBroadTitle] = useState<string>('');
  const [broadBody, setBroadBody] = useState<string>('');

  // Audio settings
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Invitation Code check / Growth loop preview
  const [guestInvitationCodeInput, setGuestInvitationCodeInput] = useState<string>('');
  const [guestActiveActivity, setGuestActiveActivity] = useState<Activity | null>(null);

  // Google onboarding mock states
  const [onboardName, setOnboardName] = useState<string>('');
  const [onboardEmail, setOnboardEmail] = useState<string>('');
  const [invitationCodeForReg, setInvitationCodeForReg] = useState<string>('');

  // Live traffic visual ticker
  const [apiHits, setApiHits] = useState<number>(45);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch full state from server on load
  const fetchState = async () => {
    try {
      const response = await fetch('/api/state');
      const data = await response.json();
      setAppState(data);
      if (data.metrics?.totalRequests) {
        setApiHits(data.metrics.totalRequests);
      }
    } catch (e) {
      console.error("Error communicating with MentorAI backend:", e);
    } finally {
      setIsLoadingState(false);
    }
  };

  useEffect(() => {
    fetchState();
    // Simulate real-time central infrastructure pinging for Admin / metrics view
    const interval = setInterval(() => {
      setApiHits(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Sync Focus Mode pedestal countdown
  useEffect(() => {
    if (focusModeActive && focusTimerSeconds > 0) {
      timerRef.current = setTimeout(() => {
        setFocusTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (focusModeActive && focusTimerSeconds === 0) {
      playChime('success');
      alert("🏆 ¡Cronómetro Pedagógico Terminado! Excelente cumplimiento del tiempo enfocado. Ahora describe tu aprendizaje para registrar la recompensa.");
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [focusModeActive, focusTimerSeconds]);

  // Custom retro frequency synthesizers using Web Audio API for high-fidelity RPG engagement
  const playChime = (type: 'success' | 'levelup' | 'click' | 'focus') => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'focus') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(554, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'success') {
        // Happy RPG progression sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.36); // C6
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
      } else if (type === 'levelup') {
        // Epic Level Up retro scale
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
        osc.frequency.setValueAtTime(392, ctx.currentTime + 0.1); // G4
        osc.frequency.setValueAtTime(523.25, ctx.currentTime + 0.2); // C5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.4); // C6
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.5); // E6
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.0);
      }
    } catch (e) {
      console.warn("AudioContext initialization failed or blocked by browser user gesture policies.");
    }
  };

  // Google Onboarding simulator route
  const handleOnboardSubmit = async (e: React.FormEvent, selectedRole: UserRole) => {
    e.preventDefault();
    if (!onboardName || !onboardEmail) {
      alert("Por favor introduce un nombre y correo electrónico para simular la verificación de Google.");
      return;
    }

    setIsLoadingState(true);
    let assignedTeacher = undefined;

    // Multi-tenant check: if isStudent and provides invitation token
    if (selectedRole === 'estudiante') {
      if (invitationCodeForReg) {
        // Lookup teacher who created the activity invitation
        const matchedAct = appState?.activities.find(a => a.invitationCode.toUpperCase() === invitationCodeForReg.toUpperCase().trim());
        if (matchedAct) {
          assignedTeacher = matchedAct.teacherId;
          setCurrentTeacherId(matchedAct.teacherId);
        } else {
          // Default fallbacks to guarantee robust UX
          assignedTeacher = 'teacher-garcia';
        }
      } else {
        assignedTeacher = 'teacher-garcia';
      }
    }

    const payload = {
      id: selectedRole === 'admin' ? 'admin-koby' : `${selectedRole}-${Math.random().toString(36).substr(2, 9)}`,
      name: onboardName,
      email: onboardEmail,
      role: selectedRole,
      registeredUnderTeacherId: assignedTeacher
    };

    try {
      const response = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        setSessionRole(selectedRole);
        // Refresh full state
        setAppState(data.state);
        playChime('success');
      }
    } catch (err) {
      console.error(err);
      // Client offline resilience
      const fallbackUser: UserProfile = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role as UserRole,
        registeredUnderTeacherId: payload.registeredUnderTeacherId,
        dateJoined: new Date().toISOString()
      };
      setCurrentUser(fallbackUser);
      setSessionRole(selectedRole);
    } finally {
      setIsLoadingState(false);
    }
  };

  // Multi-tenant verification helper
  // Returns true if the student has an active (non-expired) subscription to their teacher
  const isStudentSubscribed = () => {
    if (!currentUser || !appState) return false;
    const tId = currentUser.registeredUnderTeacherId || currentTeacherId;
    const sub = appState.subscriptions.find(s => s.studentId === currentUser.id && s.teacherId === tId);
    if (!sub) return false;
    if (sub.status === 'expired') return false;
    
    // Check Date
    const expiresAtMs = new Date(sub.expiresAt).getTime();
    return expiresAtMs > Date.now();
  };

  // Direct mock instant payment simulation
  const handleSimulatePayment = async (type: 'weekly' | 'monthly') => {
    if (!currentUser || !appState) return;
    const tId = currentUser.registeredUnderTeacherId || currentTeacherId;
    const tBilling = appState.billing.find(b => b.teacherId === tId) || { weeklyPrice: 2000, monthlyPrice: 6000 };
    const price = type === 'weekly' ? tBilling.weeklyPrice : tBilling.monthlyPrice;

    setIsLoadingState(true);
    try {
      const res = await fetch('/api/payment-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentUser.id,
          teacherId: tId,
          amount: price,
          type: type
        })
      });
      const data = await res.json();
      if (data.success) {
        playChime('success');
        fetchState();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingState(false);
    }
  };

  // Webhook sandbox tester (helps Docente test instant activation manually)
  const handleSimulateWebhook = async (studentId: string, type: 'weekly' | 'monthly') => {
    if (!currentUser || !appState) return;
    const tId = currentUser.id; // current teacher trigger index
    const price = type === 'weekly' ? docenteWeeklyPrice : docenteMonthlyPrice;

    try {
      const res = await fetch('/api/payment-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookSecret: "mentorai_sec_778",
          studentId: studentId,
          teacherId: tId,
          amount: price,
          type: type
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("🛡️ ¡Notificacion Webhook OK! Billetera móvil procesó el cobro de forma instantánea. Suscripción activada automáticamente en el tenant.");
        playChime('success');
        fetchState();
      } else {
        alert("Fallo de firma: " + data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Manual Trigger to Simulate Subscription Cutoff immediately (Aids QA/Wayground flow demonstration)
  const handleCutoffSubscription = () => {
    if (!currentUser || !appState) return;
    const tId = currentUser.registeredUnderTeacherId || currentTeacherId;
    
    // Modify client local copy & mock subscription state
    const updatedSub = appState.subscriptions.map(s => {
      if (s.studentId === currentUser.id && s.teacherId === tId) {
        return {
          ...s,
          status: 'expired' as const,
          expiresAt: new Date(Date.now() - 3600000).toISOString() // Expired 1 hour ago
        };
      }
      return s;
    });

    setAppState(prev => prev ? { ...prev, subscriptions: updatedSub } : null);
    playChime('click');
  };

  // Create material handler
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialTitle || !newMaterialContent || !currentUser) return;

    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: currentUser.id,
          title: newMaterialTitle,
          content: newMaterialContent,
          type: newMaterialType
        })
      });
      const data = await response.json();
      if (data.success) {
        setNewMaterialTitle('');
        setNewMaterialContent('');
        playChime('success');
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Material Handler
  const handleDeleteMaterial = async (id: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/materials/${id}?teacherId=${currentUser.id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        playChime('click');
        fetchState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Activity Handler
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle || !newActivityInstructions || !currentUser) return;

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: currentUser.id,
          title: newActivityTitle,
          instructions: newActivityInstructions,
          suggestedMaterialIds: selectedMaterialIds,
          durationMinutes: Number(newActivityDuration),
          points: Number(newActivityPoints),
          invitationCode: newActivityInvCode
        })
      });
      const data = await response.json();
      if (data.success) {
        setNewActivityTitle('');
        setNewActivityInstructions('');
        setNewActivityInvCode('');
        setSelectedMaterialIds([]);
        playChime('success');
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send Broadcast superuser message
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadTitle || !broadBody || !currentUser) return;

    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: currentUser.id,
          title: broadTitle,
          body: broadBody
        })
      });
      const data = await res.json();
      if (data.success) {
        setBroadTitle('');
        setBroadBody('');
        playChime('success');
        fetchState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Billing configure Teacher wallet
  const handleSaveBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !docenteWalletDetail) return;

    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: currentUser.id,
          walletType: docenteWalletType,
          walletDetail: docenteWalletDetail,
          weeklyPrice: docenteWeeklyPrice,
          monthlyPrice: docenteMonthlyPrice
        })
      });
      const data = await res.json();
      if (data.success) {
        playChime('success');
        alert("💰 Tarifario e indicaciones de pago actualizadas y vinculadas a tu isla privada.");
        fetchState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit focus activity to convert into RPG statistics and evidence folder
  const handleFinishAndSubmitProgressByStudent = async () => {
    if (!currentUser || !activeActivity) return;
    setIsSubmittingActivity(true);

    try {
      // Basic grade prediction - standard simulated evaluation based on compliance
      // High score (>80) rewarded if student focused the required duration
      const calculatedScore = checkpointResponse.trim().length > 15 ? 95 : 75;
      const spentTime = activeActivity.durationMinutes * 60; // seconds

      const response = await fetch('/api/submit-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentUser.id,
          activityId: activeActivity.id,
          score: calculatedScore,
          timeSpentSeconds: spentTime
        })
      });

      const data = await response.json();
      if (data.success) {
        // RPG stats upgrade chime! Check if level up occurred
        const previousRPG = appState?.rpg.find(r => r.studentId === currentUser.id);
        const nextRPG: RPGStats = data.rpg;

        if (previousRPG && nextRPG.level > previousRPG.level) {
          playChime('levelup');
          alert(`🎉 ¡FELICIDADES EXPLORADOR! Has alcanzado el NIVEL ${nextRPG.level}! Tu Avatar ha evolucionado con nueva indumentaria estelar.`);
        } else {
          playChime('success');
        }

        setCheckpointResponse('');
        setActiveActivity(null);
        setFocusModeActive(false);
        fetchState();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingActivity(false);
    }
  };

  // Query AI Chat with custom materials reference on server side securely
  const handleQueryAiGuia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatQuery.trim() || !currentUser) return;

    const userMessageText = aiChatQuery;
    setAiChatHistory(prev => [...prev, { sender: 'user', text: userMessageText }]);
    setAiChatQuery('');
    setIsLoadingAiChat(true);

    const rStat = appState?.rpg.find(r => r.studentId === currentUser.id);
    const lvl = rStat?.level || 1;
    const tId = currentUser.registeredUnderTeacherId || currentTeacherId;

    try {
      const response = await fetch('/api/chat-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessageText,
          teacherId: tId,
          studentId: currentUser.id,
          studentLevel: lvl
        })
      });
      const data = await response.json();
      if (data.response) {
        setAiChatHistory(prev => [...prev, { sender: 'assistant', text: data.response }]);
      }
    } catch (err) {
      console.error(err);
      setAiChatHistory(prev => [...prev, { sender: 'assistant', text: 'Error de transmisión. El robot guía de IA está recalculando coordenadas de tu material de clase.' }]);
    } finally {
      setIsLoadingAiChat(false);
    }
  };

  // Viral Growth code check route for external previews
  const handleCheckViralInvitation = () => {
    if (!guestInvitationCodeInput.trim() || !appState) return;
    const foundAct = appState.activities.find(a => a.invitationCode.toUpperCase() === guestInvitationCodeInput.toUpperCase().trim());
    if (foundAct) {
      setGuestActiveActivity(foundAct);
      setCurrentTeacherId(foundAct.teacherId);
      playChime('success');
    } else {
      alert("❌ Código de invitación educativa no encontrado en MentorAI. Compruebe las letras con su profesor.");
    }
  };

  // Convert Guest directly to student via registration onboarding auto-fill
  const handleConvertGuestToStudent = (inviteCodeUsed: string) => {
    setInvitationCodeForReg(inviteCodeUsed);
    setGuestActiveActivity(null);
    setSessionRole('estudiante');
    setOnboardName('');
    setOnboardEmail('');
    setGuestInvitationCodeInput('');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#1A1A1A] font-sans flex flex-col antialiased">
      {/* 5-color top bar (Yellow, Green, Orange, Blue, Pink) */}
      <div className="h-3 w-full flex">
        <div className="flex-1 bg-yellow-400" title="Amarillo / Desafíos RPG" />
        <div className="flex-1 bg-green-500" title="Verde / Matrícula y Finanzas" />
        <div className="flex-1 bg-orange-500" title="Naranja / Modo Enfoque" />
        <div className="flex-1 bg-blue-500" title="Azul / Isla del Docente" />
        <div className="flex-1 bg-pink-500" title="Rosado / Central de Koby Admin" />
      </div>

      {/* Editorial aesthetic header with gorgeous multi-colored highlights */}
      <header className="border-b-4 border-neutral-900 mx-4 sm:mx-10 py-6 mt-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-300 font-bold">
              Multi-tenant Ed-Tech Architecture / V1.0.8
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse border border-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight mt-1 select-none">
            Mentor<span className="font-serif italic font-light text-pink-500">AI</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs uppercase tracking-wider font-bold">
          {currentUser ? (
            <div className="flex items-center space-x-3 bg-neutral-100 p-2 rounded-lg border border-neutral-300">
              <span className="text-neutral-500 lowercase font-mono">sesión:</span>
              <span className="text-neutral-900 font-serif lowercase italic text-sm">{currentUser.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                currentUser.role === 'admin' ? 'bg-purple-200 text-purple-900 border border-purple-300' :
                currentUser.role === 'docente' ? 'bg-sky-200 text-sky-900 border border-sky-300' : 'bg-amber-200 text-amber-900 border border-amber-300'
              }`}>
                {currentUser.role}
              </span>
              <button 
                onClick={() => {
                  setCurrentUser(null);
                  setSessionRole(null);
                  setActiveActivity(null);
                  setFocusModeActive(false);
                }}
                className="text-red-600 hover:text-red-800 ml-1 flex items-center gap-1 normal-case font-sans"
              >
                <LogOut className="h-3 w-3" />
                <span>Salir</span>
              </button>
            </div>
          ) : (
            <span className="text-neutral-400 font-serif italic uppercase">Acceso Restringido</span>
          )}

          {/* Sound & Sync Controls */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => { setAudioEnabled(!audioEnabled); playChime('click'); }}
              title={audioEnabled ? "Silenciar sonidos RPG" : "Activar sonidos RPG"}
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-md transition text-neutral-800"
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button 
              onClick={fetchState}
              title="Sincronizar isla de datos"
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-md transition text-neutral-800 flex items-center space-x-1"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Broadcast Marquee Ticker */}
      {appState && appState.broadcasts.length > 0 && (
        <div className="bg-amber-100/80 border-b border-amber-300 px-4 sm:px-10 py-2.5 text-xs text-amber-950 flex items-center gap-2 overflow-x-auto">
          <span className="bg-amber-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">
            DIFUSIÓN MASIVA KOBY:
          </span>
          <div className="flex items-center space-x-2">
            <strong className="font-serif italic">{appState.broadcasts[appState.broadcasts.length - 1].title}</strong>
            <span className="opacity-70">—</span>
            <span>{appState.broadcasts[appState.broadcasts.length - 1].body}</span>
          </div>
        </div>
      )}

      {/* Active Area Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-10">
        
        {/* VIEW 1: ONBOARDING ACCESO (Google simulators with Role select) */}
        {!currentUser && !sessionRole && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column/Manifesto: Beautiful responsive cards featuring vibrant layouts */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              <div className="bg-orange-100 border-2 border-neutral-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_#ea580c] space-y-4">
                <span className="text-[10px] uppercase font-mono tracking-widest bg-orange-200 text-orange-950 px-2.5 py-0.5 rounded-full border border-orange-350 font-bold block w-fit">
                  MANIFIESTO PEDAGÓGICO
                </span>
                <h3 className="text-3xl font-extrabold text-neutral-900 leading-tight">
                  Tutor escolar inteligente y de <span className="font-serif italic font-normal text-orange-650">doble impacto</span>
                </h3>
                <p className="text-xs leading-relaxed text-neutral-700 font-medium">
                  MentorAI revoluciona el grado 3ro y 4to de primaria. Un ecosistema que combina el rigor del <strong>Modo Enfoque con Cronómetro</strong> con el entusiasmo de avatares gamedev RPG.
                </p>
                <div className="border-t border-[#ea580c]/20 pt-3">
                  <p className="text-[11px] text-orange-950 italic font-serif">
                    &ldquo;El aislamiento de datos asegura que la base de datos de cada docente esté en una isla privada, manteniendo temas escolares y pagos totalmente independientes.&rdquo;
                  </p>
                </div>
              </div>

              <div className="bg-[#E6F4EA] border-2 border-neutral-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_#16a34a] space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-green-800 block">VISITANTE O ACUDIENTE</span>
                <p className="text-xs text-neutral-750 font-medium font-sans">
                  Prueba el flujo de invitación educativa sin registro ingresando códigos como <strong>SOLAR8</strong> o <strong>PIZZA4</strong> en la sección inferior de <strong>Vigilancia Viral</strong>.
                </p>
              </div>

              <div className="bg-pink-100 border-2 border-neutral-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_#db2777]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-pink-800 font-black">Monitoreo de Infraestructura</span>
                  <span className="h-3 w-3 rounded-full bg-emerald-500 border border-emerald-600 animate-pulse" />
                </div>
                <div className="text-3xl font-serif font-black tracking-tight text-neutral-900">{apiHits} hits totales</div>
                <p className="text-[10px] text-neutral-600 mt-2 font-mono leading-relaxed">
                  Tráfico seguro en el puerto 3000 contra el motor de Gemini. Aislamiento estricto de base de datos por tenant.
                </p>
              </div>
            </div>

            {/* Right Column/Google simulator details */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl flex items-start gap-3">
                <span className="text-2xl mt-0.5">🎓</span>
                <div>
                  <h2 className="text-xl font-extrabold text-blue-950 tracking-tight">Acceso Escolar Simulado Google Workspace</h2>
                  <p className="text-xs text-blue-900 mt-0.5 leading-relaxed">
                    Entra de inmediato a MentorAI simulando tokens oficiales de Google. Elige tu nombre y rol a continuación para acceder a tu sección correspondiente.
                  </p>
                </div>
              </div>

              {/* Identity simulation Form */}
              <form className="bg-white border-2 border-neutral-900 p-6 sm:p-8 rounded-3xl space-y-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold">Identidad / Nombre Completo</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Profesor Carlos" 
                      value={onboardName}
                      onChange={(e) => setOnboardName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border-2 border-neutral-900 rounded-lg text-xs leading-relaxed text-neutral-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold">Correo de la Institución</label>
                    <input 
                      type="email" 
                      required
                      placeholder="carlos.garcia@colegio.edu" 
                      value={onboardEmail}
                      onChange={(e) => setOnboardEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border-2 border-neutral-900 rounded-lg text-xs leading-relaxed text-neutral-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 border-2 border-yellow-350 rounded-xl text-xs text-neutral-700 space-y-1 shadow-[2px_2px_0px_0px_#eab308]">
                  <div className="flex items-center space-x-2 font-bold text-yellow-800">
                    <HelpCircle className="h-4 w-4 text-yellow-600 shrink-0" />
                    <span>¿Tienes un código de invitación docente?</span>
                  </div>
                  <p className="text-[10px] text-yellow-700 font-medium">Enlazará tu perfil de alumno directamente a la isla privada de dicho profesor.</p>
                  <input 
                    type="text"
                    placeholder="Ej. SOLAR8 o PIZZA4 (Opcional)"
                    value={invitationCodeForReg}
                    onChange={(e) => setInvitationCodeForReg(e.target.value.toUpperCase())}
                    className="mt-2 w-full px-3 py-1.5 bg-white border-2 border-neutral-900 rounded-lg font-mono text-xs text-neutral-800 uppercase font-extrabold focus:outline-none"
                  />
                </div>

                {/* Role choices submit with Yellow, Blue, Pink branding accents */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-mono uppercase font-black text-neutral-600 tracking-wider">
                    👉 HAGA CLICK EN EL ROL PARA INGRESAR EN ESTA IDENTIDAD:
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Estudiante: Amarillo */}
                    <button 
                      type="submit" 
                      onClick={(e) => handleOnboardSubmit(e, 'estudiante')} 
                      className="p-4 bg-yellow-250 hover:bg-yellow-300 border-2 border-neutral-900 rounded-xl text-left transition-all hover:-translate-y-1 shadow-[4px_4px_0px_0px_#eab308] active:translate-y-0.5"
                    >
                      <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-yellow-800 block">
                        🎒 01 / ESTU
                      </span>
                      <strong className="text-sm text-neutral-900 block mt-1 leading-3">PROGRESO RPG</strong>
                      <span className="text-[9px] text-neutral-700 block leading-tight mt-1.5 font-medium">
                        Estudia con cronómetros, gana XP y evoluciona tu avatar guía.
                      </span>
                    </button>

                    {/* Docente: Azul */}
                    <button 
                      type="submit" 
                      onClick={(e) => handleOnboardSubmit(e, 'docente')} 
                      className="p-4 bg-blue-200 hover:bg-blue-300 border-2 border-neutral-900 rounded-xl text-left transition-all hover:-translate-y-1 shadow-[4px_4px_0px_0px_#2563eb] active:translate-y-0.5"
                    >
                      <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-blue-800 block">
                        👩‍🏫 02 / DOCEN
                      </span>
                      <strong className="text-sm text-neutral-900 block mt-1 leading-3">GESTIÓN & PAYWALL</strong>
                      <span className="text-[9px] text-neutral-700 block leading-tight mt-1.5 font-medium">
                        Sube materiales didácticos, configura precios y audita evidencias.
                      </span>
                    </button>

                    {/* Admin: Rosado */}
                    <button 
                      type="submit" 
                      onClick={(e) => handleOnboardSubmit(e, 'admin')} 
                      className="p-4 bg-pink-200 hover:bg-pink-300 border-2 border-neutral-900 rounded-xl text-left transition-all hover:-translate-y-1 shadow-[4px_4px_0px_0px_#db2777] active:translate-y-0.5"
                    >
                      <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-pink-800 block">
                        👑 03 / ADMIN
                      </span>
                      <strong className="text-sm text-neutral-900 block mt-1 leading-3">MÉTRICAS GLOBAL</strong>
                      <span className="text-[9px] text-neutral-700 block leading-tight mt-1.5 font-medium">
                        Consola del superusuario Koby. Difusiones y control de hits.
                      </span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Acceso Rápido Integrado */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 font-bold block">Llaves de Credenciales Básicas:</span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => {
                      setOnboardName("Profesor Carlos García");
                      setOnboardEmail("carlos.garcia@gmail.com");
                      alert("¡Profe Carlos seleccionado! Haz clic ahora en el botón azul (02 / Docente) de arriba.");
                    }}
                    className="px-3 py-1.5 bg-sky-200/50 hover:bg-sky-200 border border-sky-300 rounded text-xs text-sky-900 font-medium"
                  >
                    Profe Carlos (Docente Premium)
                  </button>
                  <button 
                    onClick={() => {
                      setOnboardName("Carlitos Ruiz");
                      setOnboardEmail("carlitos.ruiz@gmail.com");
                      alert("¡Carlitos seleccionado! Haz clic ahora en el botón naranja (01 / Estudiante) de arriba.");
                    }}
                    className="px-3 py-1.5 bg-amber-200/50 hover:bg-amber-200 border border-amber-300 rounded text-xs text-amber-900 font-medium"
                  >
                    Carlitos Ruiz (Estudiante de 3ro)
                  </button>
                  <button 
                    onClick={() => {
                      setOnboardName("Koby Admin");
                      setOnboardEmail("koby@mentorai.edu");
                      alert("¡Koby Admin seleccionado! Haz clic ahora en el botón morado (03 / Administrador) de arriba.");
                    }}
                    className="px-3 py-1.5 bg-purple-200/50 hover:bg-purple-200 border border-purple-300 rounded text-xs text-purple-900 font-medium"
                  >
                    Koby (Superusuario del Sistema)
                  </button>
                </div>
              </div>

              {/* VIRAL GROWTH LOOP EXTRAPOLATION PREVIEW AREA */}
              <div className="border border-neutral-900 p-6 rounded-sm bg-stone-100/60 space-y-4">
                <div>
                  <span className="text-[10px] tracking-widest font-mono text-red-650 font-bold block animate-pulse">🔥 GROWTH LOOP: VISTA PREVIA VIRAL</span>
                  <h4 className="text-lg font-serif italic text-neutral-800 mt-1">¿Recibiste un código de invitación? Compruébalo como visitante libre:</h4>
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ej. SOLAR8 o PIZZA4" 
                    value={guestInvitationCodeInput}
                    onChange={(e) => setGuestInvitationCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-mono text-neutral-900 uppercase focus:outline-none"
                  />
                  <button 
                    onClick={handleCheckViralInvitation}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold rounded"
                  >
                    Ver Actividad
                  </button>
                </div>

                {/* Show simulated action with PUBLICIDAD NATIVA conversion prompt */}
                {guestActiveActivity && (
                  <div className="bg-white border border-neutral-900 p-5 rounded-md mt-4 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-500 text-white font-mono text-[8px] uppercase tracking-widest px-2.5 py-1">
                      Vista Limitada
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-neutral-400 block">Docente creador: Profe Carlos</span>
                      <h5 className="font-serif italic text-lg text-neutral-900">{guestActiveActivity.title}</h5>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed font-mono whitespace-pre-wrap bg-neutral-50 p-2.5 rounded border border-neutral-200">
                      Instrucción parcial de prueba: <br />
                      {guestActiveActivity.instructions}
                    </p>

                    {/* PUBLICIDAD NATIVA AD CAMPAIGN WITH REGISTRATION ACTION */}
                    <div className="bg-rose-50 border border-rose-350 p-4 rounded-sm text-xs text-rose-950 space-y-2">
                      <div className="flex items-center space-x-1.5 text-rose-800 font-bold">
                        <Sparkles className="h-4 w-4 shrink-0 text-amber-500 animate-spin" />
                        <span>¡Sube de Nivel RPG y Chatea con el Avatar de IA!</span>
                      </div>
                      <p className="text-[11px] text-rose-900">
                        Has accedido como docente / invitado externo. Para poder iniciar el <strong>Modo Enfoque con Cronómetro Pedagógico</strong>, registrar tus evidencias en tu portafolio, y ganar hasta <strong>{guestActiveActivity.points} puntos de nivel XP</strong> para evolucionar tu avatar RPG, regístrate en MentorAI. ¡Es instantáneo con tu correo de la escuela!
                      </p>
                      
                      <button 
                        onClick={() => handleConvertGuestToStudent(guestActiveActivity.invitationCode)}
                        className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white py-1.5 rounded text-xs font-mono uppercase font-bold tracking-wider"
                      >
                        Convertirme en Miembro Registrado →
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: ROLES ENTORNO ACTIVE */}
        {currentUser && (
          <div className="space-y-10">
            
            {/* ROLE: ADMINISTRADOR (KOBY) */}
            {currentUser.role === 'admin' && appState && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Global infrastructure side panel */}
                <div className="lg:col-span-4 space-y-6 lg:border-r lg:border-neutral-300 lg:pr-8">
                  <div className="bg-pink-50 p-6 rounded-2xl border-2 border-neutral-900 shadow-[4px_4px_0px_0px_#db2777]">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pink-700 font-bold block">Supervisión en Tiempo Real</span>
                    <h2 className="text-3xl font-serif italic text-neutral-900 mt-1">Isletas Multi-Tenant</h2>
                    <p className="text-xs text-neutral-600 mt-2">
                      La base de datos aislada posee múltiples docentes activos. Toda interacción de IA está encriptada y sujeta a auditoría.
                    </p>
                  </div>

                  {/* Real Metrics counters */}
                  <div className="bg-[#1A1A1A] text-[#F9F8F6] p-6 rounded-3xl space-y-4 border-2 border-neutral-900 shadow-[4px_4px_0px_0px_#ea580c]">
                    <div className="border-b border-neutral-700 pb-2">
                      <span className="text-[10px] uppercase font-mono block tracking-widest text-pink-400 font-black">Canales de Datos</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] block opacity-75">Tasa de Tráfico</span>
                        <strong className="text-xl font-serif text-yellow-300">{apiHits} hits</strong>
                      </div>
                      <div>
                        <span className="text-[10px] block opacity-75">Suscripciones</span>
                        <strong className="text-xl font-serif text-green-400">
                          {appState.subscriptions.filter(s => s.status === 'active').length} activas
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] block opacity-75">Docentes Premium</span>
                        <strong className="text-xl font-serif text-blue-400">
                          {appState.users.filter(u => u.role === 'docente').length}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] block opacity-75">Estudiantes RPG</span>
                        <strong className="text-xl font-serif text-pink-400">
                          {appState.users.filter(u => u.role === 'estudiante').length}
                        </strong>
                      </div>
                    </div>

                    <div className="bg-neutral-800 p-2.5 rounded-xl border border-neutral-700 text-[10px] font-mono text-neutral-400 flex items-center space-x-1">
                      <Terminal className="h-3 w-3 text-pink-400 shrink-0" />
                      <span>Cluster Status: Multi-Tenant isolated</span>
                    </div>
                  </div>

                  {/* Users overview */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-pink-700 block">Listado Estudiantes Registrados:</span>
                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                      {appState.users.filter(u => u.role === 'estudiante').map(st => {
                        const rpg = appState.rpg.find(r => r.studentId === st.id);
                        return (
                          <div key={st.id} className="p-3 bg-white border-2 border-neutral-900 rounded-xl text-xs flex justify-between items-center shadow-sm">
                            <div>
                              <strong className="text-neutral-800 block font-serif lowercase italic text-sm">{st.name}</strong>
                              <span className="text-[10px] text-neutral-450 block font-mono">{st.email}</span>
                            </div>
                            <span className="text-[10px] font-mono bg-yellow-101 text-yellow-800 px-1.5 py-0.5 rounded font-bold border border-yellow-350">
                              Nivel {rpg?.level || 1} — {rpg?.currentXp || 0} XP
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Broadcast and action view - fully responsive */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="border-b-2 border-neutral-900 pb-3">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-pink-700 block">Centro de Control de Koby</span>
                    <h3 className="text-xl font-serif italic text-neutral-900">Difusión de Emergencia Educativa Nacional o Anuncios</h3>
                  </div>

                  <form onSubmit={handleSendBroadcast} className="bg-pink-50 border-2 border-neutral-900 p-6 sm:p-8 rounded-3xl space-y-4 shadow-[4px_4px_0px_0px_rgba(219,39,119,1)]">
                    <p className="text-xs text-neutral-700 leading-relaxed font-sans font-medium">
                      El superusuario administrador tiene privilegios sobre el canal global de red. Al emitir un comunicado, este se pintará instantáneamente en la cabecera de todas las cuentas de docentes y estudiantes en tiempo real.
                    </p>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-bold text-neutral-700 uppercase tracking-widest">Título del Anuncio</label>
                      <input 
                        type="text" 
                        required
                        value={broadTitle}
                        onChange={(e) => setBroadTitle(e.target.value)}
                        placeholder="Ej. Simulacro de Evaluación Distrital de Matemáticas"
                        className="w-full px-3 py-2 bg-white border-2 border-neutral-900 rounded-xl text-xs text-neutral-800 font-bold focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-bold text-neutral-700 uppercase tracking-widest">Cuerpo del Comunicado</label>
                      <textarea 
                        required
                        rows={4}
                        value={broadBody}
                        onChange={(e) => setBroadBody(e.target.value)}
                        placeholder="Escribe el cuerpo de la actividad o noticia general masiva aquí..."
                        className="w-full px-3 py-2 bg-white border-2 border-neutral-900 rounded-xl text-xs text-neutral-800 font-medium focus:outline-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-pink-500 hover:bg-pink-650 hover:scale-[1.02] text-white font-mono uppercase tracking-widest text-[11px] font-black py-3 rounded-xl border-2 border-neutral-900 transition-all active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Transmitir Señal de Banda Ancha Masiva →
                    </button>
                  </form>

                  {/* History of broadcasts */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-black uppercase tracking-wider text-pink-700">Historial de Radiodifusión Reciente:</h4>
                    <div className="space-y-2">
                      {appState.broadcasts.map(br => (
                        <div key={br.id} className="p-4 bg-white border-2 border-neutral-900 rounded-2xl text-xs space-y-1 shadow-sm">
                          <div className="flex justify-between items-center">
                            <strong className="text-neutral-900 italic font-serif text-sm">{br.title}</strong>
                            <span className="text-[10px] text-neutral-400 font-mono">{new Date(br.sentAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-neutral-700 leading-relaxed font-sans">{br.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ROLE: DOCENTE (PREMIUM) */}
            {currentUser.role === 'docente' && appState && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left side: Class Materials & Custom Billing Configurations */}
                <div className="lg:col-span-5 space-y-6 lg:border-r lg:border-neutral-300 lg:pr-8">
                  
                  {/* Private silho badge info - Beautifully blue theme */}
                  <div className="p-5 bg-blue-50 border-2 border-neutral-900 rounded-2xl shadow-[4px_4px_0px_0px_#2563eb] space-y-2">
                    <span className="text-[10px] font-mono font-black text-blue-800 uppercase block tracking-widest">
                      🔒 ISLA DE DATOS SEGURA ACTIVADA
                    </span>
                    <h3 className="text-lg font-serif italic text-neutral-950 font-black">
                      Propietario del Tenant: {currentUser.name}
                    </h3>
                    <p className="text-[11px] text-blue-900 font-medium leading-relaxed">
                      Tus materiales educativos y listado de alumnos están aislados de forma multi-tenant. Ningún otro docente de MentorAI puede ver tu material o transacciones.
                    </p>
                  </div>

                  {/* Materials addition */}
                  <div className="bg-white border-2 border-neutral-900 p-6 rounded-3xl shadow-[4px_4px_0px_0px_#2563eb] space-y-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-blue-500 block">Módulo Científico</span>
                      <h4 className="font-serif italic text-xl font-bold text-neutral-900">Subir Material Didáctico (PDF / Nota)</h4>
                    </div>

                    <form onSubmit={handleAddMaterial} className="space-y-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase">Título del Documento</label>
                        <input 
                          type="text" 
                          required
                          value={newMaterialTitle}
                          onChange={(e) => setNewMaterialTitle(e.target.value)}
                          placeholder="Ej. Ciclo del Agua y Lluvias Primaria"
                          className="w-full px-3 py-2 bg-stone-50 border-2 border-neutral-900 rounded-xl text-xs text-neutral-900 font-bold focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase">Tipo de Recurso</label>
                        <select 
                          value={newMaterialType}
                          onChange={(e: any) => setNewMaterialType(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border-2 border-neutral-900 rounded-xl text-xs text-neutral-900 font-bold focus:outline-none"
                        >
                          <option value="pdf_text">Texto de PDF Oficial</option>
                          <option value="text_note">Instrucción para Video/Audio Clase</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono font-bold text-neutral-650 uppercase">Contenido Científico Completo (Entrenamiento de la IA)</label>
                        <textarea 
                          required
                          rows={4}
                          value={newMaterialContent}
                          onChange={(e) => setNewMaterialContent(e.target.value)}
                          placeholder="Introduce todo el contenido científico aquí. Tu Avatar Guía de IA usará exclusivamente estos párrafos para responder las preguntas del niño."
                          className="w-full px-3 py-2 bg-stone-50 border-2 border-neutral-900 rounded-xl text-xs leading-relaxed font-medium focus:bg-white focus:outline-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 hover:scale-[1.01] text-white font-mono uppercase tracking-widest text-[11px] font-black py-2.5 rounded-xl border-2 border-neutral-900 transition-all active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        Cargar Material Didáctico
                      </button>
                    </form>
                  </div>

                  {/* List of Private materials uploaded */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase font-black tracking-wider text-blue-700 block">Tus Materiales Disponibles en tu Isla ({appState.materials.filter(m => m.teacherId === currentUser.id).length}):</span>
                    
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                      {appState.materials.filter(m => m.teacherId === currentUser.id).map(mat => (
                        <div key={mat.id} className="p-4 bg-white border-2 border-neutral-900 rounded-2xl text-xs flex justify-between items-start gap-2 shadow-sm">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-extrabold bg-blue-100 text-blue-800 uppercase px-2 py-0.5 rounded border border-blue-200">
                              {mat.type === 'pdf_text' ? 'PDF' : 'Instrucción Video'}
                            </span>
                            <strong className="text-neutral-900 block text-xs mt-1.5">{mat.title}</strong>
                            <p className="text-[10px] text-neutral-600 line-clamp-2 mt-0.5 font-medium">{mat.content}</p>
                          </div>
                          
                          <button 
                            onClick={() => handleDeleteMaterial(mat.id)}
                            className="p-1 text-red-600 hover:text-red-900 font-mono text-[10px] uppercase font-bold tracking-normal hover:underline shrink-0"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Docente Billing Settings - Colored beautiful Green represents earnings */}
                  <div className="bg-emerald-50 border-2 border-neutral-900 p-6 rounded-3xl shadow-[4px_4px_0px_0px_#16a34a] space-y-4">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest font-black text-emerald-800 uppercase block">Monetización del Tutor (Pasarela de Pagos)</span>
                      <h4 className="font-serif italic text-xl font-bold text-neutral-900">Configuración de Pasarela con Billetera Móvil</h4>
                    </div>

                    <form onSubmit={handleSaveBilling} className="space-y-3">
                      <p className="text-[11px] text-emerald-950 leading-relaxed font-sans font-medium">
                        Configura las líneas de pago para tus alumnos. El cobro recurrente al expirar el periodo impedirá que el alumno chatee con la IA o envíe actividades hasta que la transacción se valide.
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <label className="block text-[9px] font-mono font-bold text-neutral-600 uppercase">Método de Cobro</label>
                          <select 
                            value={docenteWalletType}
                            onChange={(e: any) => setDocenteWalletType(e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border-2 border-neutral-900 rounded-lg text-xs text-neutral-800 font-bold"
                          >
                            <option value="Nequi">Nequi</option>
                            <option value="Daviplata">Daviplata</option>
                            <option value="Pago Movil">Pago Móvil</option>
                            <option value="Alias / Otro">Alias / Banco</option>
                          </select>
                        </div>

                        <div className="space-y-0.5">
                          <label className="block text-[9px] font-mono font-bold text-neutral-600 uppercase">Teléfono / Detalle Billetera</label>
                          <input 
                            type="text" 
                            required
                            value={docenteWalletDetail}
                            onChange={(e) => setDocenteWalletDetail(e.target.value)}
                            placeholder="Ej. 3123456789 o correo"
                            className="w-full px-2 py-1.5 bg-white border-2 border-neutral-900 rounded-lg text-xs text-neutral-900 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <label className="block text-[9px] font-mono font-bold text-neutral-600 uppercase">Precio Semanal ($ COP)</label>
                          <input 
                            type="number" 
                            value={docenteWeeklyPrice}
                            onChange={(e) => setDocenteWeeklyPrice(Number(e.target.value))}
                            className="w-full px-2 py-1.5 bg-white border-2 border-neutral-900 rounded-lg text-xs text-neutral-900 font-bold font-mono"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <label className="block text-[9px] font-mono font-bold text-neutral-600 uppercase">Precio Mensual ($ COP)</label>
                          <input 
                            type="number" 
                            value={docenteMonthlyPrice}
                            onChange={(e) => setDocenteMonthlyPrice(Number(e.target.value))}
                            className="w-full px-2 py-1.5 bg-white border-2 border-neutral-900 rounded-lg text-xs text-neutral-900 font-bold font-mono"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-mono uppercase tracking-widest text-[11px] py-2.5 rounded-xl border-2 border-neutral-900 transition-all font-black active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        Actualizar Tarifario de Cobro Móvil
                      </button>
                    </form>
                  </div>

                </div>

                {/* Right side: Activities Generator & Portafolio of Student Evidence */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Activities Generation form */}
                  <div className="bg-white border-2 border-neutral-900 p-6 sm:p-8 rounded-3xl space-y-4 shadow-[4px_4px_0px_0px_#2563eb]">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-blue-600 font-extrabold block">Desafíos de Aula</span>
                      <h3 className="text-xl font-serif italic font-bold text-neutral-900">Diseñar Actividad Educativa e Invitación</h3>
                    </div>

                    <form onSubmit={handleAddActivity} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase">Nombre Desafío</label>
                          <input 
                            type="text" 
                            required
                            value={newActivityTitle}
                            onChange={(e) => setNewActivityTitle(e.target.value)}
                            placeholder="Ej. Explorando las estrellas..."
                            className="w-full px-3 py-2 bg-stone-50 border-2 border-neutral-900 rounded-xl text-xs text-neutral-900 font-bold focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase">Código de Reto Invitación</label>
                          <input 
                            type="text" 
                            value={newActivityInvCode}
                            onChange={(e) => setNewActivityInvCode(e.target.value.toUpperCase().trim())}
                            placeholder="Ej. SISTEMAX"
                            className="w-full px-3 py-2 bg-stone-50 border-2 border-neutral-900 rounded-xl text-xs font-mono text-neutral-900 uppercase font-black focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono font-bold text-neutral-650 uppercase">Instrucciones y Checkpoints Pedagógicos</label>
                        <textarea 
                          required
                          rows={3}
                          value={newActivityInstructions}
                          onChange={(e) => setNewActivityInstructions(e.target.value)}
                          placeholder="Describe qué pregunta debe responder el estudiante para superar el reto escolar..."
                          className="w-full px-3 py-2 bg-stone-50 border-2 border-neutral-900 rounded-xl text-xs leading-relaxed font-medium focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase">Cronómetro (Minutos)</label>
                          <input 
                            type="number" 
                            value={newActivityDuration}
                            onChange={(e) => setNewActivityDuration(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-stone-50 border-2 border-neutral-900 rounded-xl text-xs text-neutral-900 font-bold focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase">Recompensa RPG (XP)</label>
                          <input 
                            type="number" 
                            value={newActivityPoints}
                            onChange={(e) => setNewActivityPoints(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-stone-50 border-2 border-neutral-900 rounded-xl text-xs text-neutral-900 font-bold focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Select associated materials on this tenant */}
                      <div className="space-y-2">
                        <span className="block text-[10px] font-mono font-bold text-neutral-650 uppercase">Vincular Guía de Lectura de la Isla (Opcional):</span>
                        <div className="flex flex-wrap gap-2">
                          {appState.materials.filter(m => m.teacherId === currentUser.id).map(mat => {
                            const isSelected = selectedMaterialIds.includes(mat.id);
                            return (
                              <button 
                                type="button"
                                key={mat.id}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedMaterialIds(prev => prev.filter(mid => mid !== mat.id));
                                  } else {
                                    setSelectedMaterialIds(prev => [...prev, mat.id]);
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border-2 transition-all ${
                                  isSelected ? 'bg-blue-500 text-white border-neutral-900 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-stone-50 text-neutral-700 border-neutral-300'
                                }`}
                              >
                                {mat.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-mono uppercase tracking-widest text-xs font-black py-3 rounded-xl border-2 border-neutral-900 transition-all active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        Publicar Actividad y Generar Código QR →
                      </button>
                    </form>
                  </div>

                  {/* Interactive Dashboard showing students under this teacher tenant with Webhook Tester */}
                  <div className="space-y-4">
                    <div className="border-b-2 border-neutral-900 pb-2">
                      <span className="text-[10px] tracking-widest uppercase font-mono text-blue-700 font-black">Portafolio Escolar</span>
                      <h4 className="text-xl font-serif italic font-bold text-neutral-900">Alumnos Suscriptos y Carpeta de Evidencias</h4>
                    </div>

                    <div className="space-y-4">
                      {appState.users.filter(u => u.registeredUnderTeacherId === currentUser.id).length === 0 ? (
                        <p className="text-xs text-neutral-600 italic p-6 bg-white border-2 border-neutral-900 rounded-3xl text-center">
                          Aún no hay alumnos vinculados. Invítalos a ingresar a la plataforma usando tus códigos QR o enlaces de reto escolares.
                        </p>
                      ) : (
                        appState.users.filter(u => u.registeredUnderTeacherId === currentUser.id).map(st => {
                          const rpg = appState.rpg.find(r => r.studentId === st.id);
                          const sub = appState.subscriptions.find(s => s.studentId === st.id && s.teacherId === currentUser.id);
                          const progressList = appState.progress.filter(p => p.studentId === st.id && p.teacherId === currentUser.id);
                          const hasPaid = sub && sub.status === 'active';

                          return (
                            <div key={st.id} className="bg-white border-2 border-neutral-900 p-5 rounded-3xl space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-2 border-neutral-100 pb-3">
                                <div>
                                  <strong className="text-sm font-serif italic text-neutral-900">{st.name}</strong>
                                  <span className="text-[10px] text-neutral-500 block font-mono">{st.email}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] bg-yellow-100 text-yellow-900 font-mono px-2 py-0.5 rounded-lg border-2 border-neutral-900 uppercase font-bold">
                                    ⚔️ RPG Nivel {rpg?.level || 1}
                                  </span>
                                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border-2 border-neutral-900 uppercase font-black ${
                                    hasPaid ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                                  }`}>
                                    {hasPaid ? 'Abonado' : 'Sin pago'}
                                  </span>
                                </div>
                              </div>

                              {/* Webhook tester trigger to sandbox activate with nice color bands */}
                              {!hasPaid ? (
                                <div className="bg-orange-50 border-2 border-neutral-900 p-4 rounded-2xl text-xs space-y-3">
                                  <p className="text-[11.5px] text-orange-950 font-medium">
                                    El alumno no posee suscripción activa o expiró su rango semanal. Simula una transferencia de Billetera Móvil para activar su tutela educativa mediante webhook.
                                  </p>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <button 
                                      onClick={() => handleSimulateWebhook(st.id, 'weekly')}
                                      className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[9px] py-2 rounded-lg transition-colors font-bold uppercase"
                                    >
                                      Simular Pago Semanal (Webhook)
                                    </button>
                                    <button 
                                      onClick={() => handleSimulateWebhook(st.id, 'monthly')}
                                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[9px] py-2 rounded-lg transition-colors font-bold uppercase"
                                    >
                                      Simular Pago Mensual (Webhook)
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-emerald-50 border-2 border-neutral-900 p-3.5 rounded-2xl text-xs text-emerald-950 flex flex-col sm:flex-row justify-between items-center gap-2">
                                  <span className="font-medium">🚀 Suscripción activa mediante Webhook. Expiración: <strong className="font-mono">{new Date(sub.expiresAt).toLocaleDateString()}</strong></span>
                                  <button 
                                    onClick={() => handleSimulateWebhook(st.id, 'weekly')}
                                    className="bg-neutral-950 hover:bg-neutral-800 font-mono text-[9px] text-white px-2.5 py-1 rounded-lg font-black uppercase"
                                  >
                                    Extender (Webhook)
                                  </button>
                                </div>
                              )}

                              {/* Progress evidence folder submitted */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-neutral-500 block">Carpeta de Evidencias Escolares:</span>
                                {progressList.length === 0 ? (
                                  <span className="text-[10px] text-neutral-400 italic block pl-1">Aún no hay evidencia de actividades completadas para este alumno.</span>
                                ) : (
                                  <div className="space-y-2">
                                    {progressList.map(pr => (
                                      <div key={pr.id} className="p-3 bg-neutral-50 border-2 border-neutral-900 rounded-2xl text-xs space-y-1">
                                        <div className="flex justify-between items-center text-[10px]">
                                          <strong className="text-neutral-900 font-serif italic text-sm">{pr.activityTitle}</strong>
                                          <span className="font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded font-bold">Nota: {pr.score}%</span>
                                        </div>
                                        <p className="text-[11px] text-neutral-700 italic leading-relaxed pl-1 font-medium">
                                          &ldquo;{pr.feedback}&rdquo;
                                        </p>
                                        <div className="text-[9px] text-neutral-400 font-mono flex gap-2">
                                          <span>Tiempo Enfoque: {Math.round(pr.timeSpentSeconds / 60)} min</span>
                                          <span>•</span>
                                          <span>Fecha: {new Date(pr.completedAt).toLocaleString()}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* List of active activities created on this tenant with responsive layout */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase font-black tracking-wider text-blue-700 block">Enlaces o Códigos Activos de tu Escuela ({appState.activities.filter(a => a.teacherId === currentUser.id).length}):</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {appState.activities.filter(a => a.teacherId === currentUser.id).map(act => (
                        <div key={act.id} className="p-5 bg-white border-2 border-neutral-900 rounded-3xl text-xs space-y-3 relative overflow-hidden shadow-sm">
                          <span className="absolute top-0 right-0 bg-neutral-900 text-white font-mono text-[9px] uppercase px-3 py-1 font-bold">
                            {act.points} XP
                          </span>
                          <div className="space-y-1">
                            <strong className="text-neutral-900 block font-serif tracking-tight text-sm italic">{act.title}</strong>
                            <p className="text-[10px] text-neutral-600 leading-snug line-clamp-2">{act.instructions}</p>
                          </div>

                          <div className="border-t border-dashed border-neutral-300 pt-2 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] uppercase font-mono block text-neutral-450">Invite Code</span>
                              <span className="font-mono font-black text-neutral-900 bg-yellow-101 px-2 py-1 text-[11px] border-2 border-neutral-900 rounded select-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                {act.invitationCode}
                              </span>
                            </div>

                            {/* Simulated QR vector mockup */}
                            <div className="bg-[#1A1A1A] p-2 rounded-xl" title="Reto QR Escolar">
                              <QrCode className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ROLE: ESTUDIANTE (CON GAMIFICACIÓN RPG, AVATAR GUÍA DE IA, MODO ENFOQUE CON CRONÓMETRO) */}
            {currentUser.role === 'estudiante' && appState && (
              <div className="space-y-8">
                
                {/* Header info detailing current RPG Rank, and Tenant connection */}
                {(() => {
                  const rStat = appState.rpg.find(r => r.studentId === currentUser.id) || { level: 1, currentXp: 0, totalCompletedTimeSeconds: 0, totalActivitiesCompleted: 0 };
                  const earns = appState.progress.filter(p => p.studentId === currentUser.id);
                  const activeSubscribed = isStudentSubscribed();
                  const linkedTeacher = appState.users.find(u => u.id === (currentUser.registeredUnderTeacherId || currentTeacherId));

                  return (
                    <div className="space-y-6">
                      
                      {/* RPG Avatar banner in charcoal with neon-yellow and pink highlights */}
                      <div className="bg-[#1A1A1A] text-[#F9F8F6] p-6 sm:p-8 rounded-3xl border-2 border-neutral-900 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden shadow-[4px_4px_0px_0px_#db2777]">
                        <div className="absolute top-0 right-0 bg-yellow-400 text-neutral-950 font-mono text-[9px] uppercase tracking-wider font-black px-4 py-1.5 border-b-2 border-l-2 border-neutral-900">
                          CONSOLA RPG AVENTURERO
                        </div>

                        <div className="space-y-2 relative z-10">
                          <span className="text-[10px] text-yellow-300 font-mono uppercase tracking-[0.15em] block">
                            Tutor asignado: {linkedTeacher ? linkedTeacher.name : "Profesor de Planta"}
                          </span>
                          <h2 className="text-3xl font-serif italic text-white leading-none">
                            ¡Bienvenido al Aula Virtual, {currentUser.name}!
                          </h2>
                          <p className="text-xs text-neutral-350 max-w-xl font-medium">
                            Supera las actividades cronometradas de tu profesor para habilitar las medallas de oro, incrementar tu nivel RPG aventurero de primaria, y hacer que tu Avatar Guía sea más inteligente de acuerdo a las guías escolares.
                          </p>
                        </div>

                        {/* RPG Stat displays in high-contrast blue/pink border box */}
                        <div className="flex items-center space-x-4 shrink-0 bg-neutral-900 p-4 border-2 border-neutral-900 rounded-2xl relative z-10 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
                          {/* Simulated Avatar Visual Profile */}
                          <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-full bg-neutral-800 border-2 border-yellow-400 flex items-center justify-center text-2xl shadow-sm">
                              {rStat.level >= 5 ? '🧙‍♂️' : rStat.level >= 3 ? '🛡️' : '🏹'}
                            </div>
                            <span className="absolute -bottom-1.5 -right-1 bg-pink-500 text-white text-[9px] font-mono leading-none font-black px-1.5 py-0.5 rounded-lg border border-neutral-900">
                              LVL {rStat.level}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-neutral-400 font-bold">Progreso XP:</span>
                              <span className="text-yellow-400 font-black">{rStat.currentXp} / 100</span>
                            </div>
                            {/* XP Progress bar with precise indicators */}
                            <div className="w-36 bg-neutral-850 h-2.5 border border-neutral-700 rounded-full overflow-hidden">
                              <div 
                                className="bg-yellow-400 h-full transition-all duration-300"
                                style={{ width: `${rStat.currentXp}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-neutral-400 block font-mono">
                              {rStat.totalActivitiesCompleted} tareas de clase conquistadas
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* WAYGROUND PAYWALL CHECKER */}
                      {!activeSubscribed ? (
                        <div className="bg-yellow-50 text-neutral-900 p-6 sm:p-8 rounded-3xl border-2 border-neutral-900 space-y-5 shadow-[4px_4px_0px_0px_#ea580c]">
                          <div className="flex items-center space-x-2 text-orange-600">
                            <Lock className="h-5 w-5 shrink-0" />
                            <h3 className="font-serif italic text-lg font-black">Acceso a Tutoría IA y Desafíos Protegido</h3>
                          </div>
                          
                          <p className="text-xs text-neutral-700 leading-relaxed max-w-2xl font-medium">
                            Tu período de prueba con el <strong>Profe Carlos García</strong> ha finalizado, o no se ha recibido la transferencia correspondiente a su tarifaria móvil. Realiza un abono a la billetera registrada del docente para desbloquear de inmediato el Robot de Inteligencia Artificial para el grado 3ro y 4to de primaria.
                          </p>

                          {/* Billing settings retrieved from teacher data */}
                          {(() => {
                            const tConfig = appState.billing.find(b => b.teacherId === (currentUser.registeredUnderTeacherId || currentTeacherId));
                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border-2 border-neutral-900 p-5 rounded-2xl text-xs text-neutral-800 shadow-sm">
                                <div>
                                  <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-500 block mb-1 font-black">Método Oficial del Docente</span>
                                  <strong className="text-neutral-950 text-sm font-serif italic">{tConfig?.walletType || 'Nequi'}</strong>
                                  <span className="block mt-1 font-mono">Línea de envío: <strong className="text-orange-600 select-all font-black">{tConfig?.walletDetail || '3123456789'}</strong></span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-500 block font-black">Planes de Suscripción</span>
                                  <div className="flex justify-between font-mono font-medium">
                                    <span>Plan Semanal Escolar:</span>
                                    <strong className="text-emerald-700 font-extrabold">${tConfig?.weeklyPrice || 2000} COP</strong>
                                  </div>
                                  <div className="flex justify-between font-mono font-medium">
                                    <span>Plan Mensual Cósmico:</span>
                                    <strong className="text-emerald-700 font-extrabold">${tConfig?.monthlyPrice || 6000} COP</strong>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Instant simulation payment for Student sandbox testing */}
                          <div className="flex flex-col sm:flex-row gap-3 border-t-2 border-dashed border-neutral-300 pt-4">
                            <button 
                              onClick={() => handleSimulatePayment('weekly')}
                              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-mono text-xs uppercase font-black tracking-wider py-3 px-4 rounded-xl border-2 border-neutral-900 transition-all active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                              Simular Transferencia Semanal Instantánea ($ COP)
                            </button>
                            <button 
                              onClick={() => handleSimulatePayment('monthly')}
                              className="flex-1 bg-white hover:bg-neutral-50 text-neutral-900 font-mono text-xs uppercase font-black tracking-wider py-3 px-4 rounded-xl border-2 border-neutral-900 transition-all active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                              Simular Transferencia Mensual
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border-2 border-neutral-900 p-4 sm:p-6 rounded-3xl text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[4px_4px_0px_0px_#16a34a]">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                            <span className="font-medium text-emerald-950">
                              Tu suscripción en la isla del docente está <strong>ACTIVA</strong>. Próximo período de corte automático: <strong className="font-mono">{new Date(appState.subscriptions.find(s => s.studentId === currentUser.id && s.teacherId === (currentUser.registeredUnderTeacherId || currentTeacherId))?.expiresAt || '').toLocaleDateString()}</strong>
                            </span>
                          </div>
                          <button 
                            onClick={handleCutoffSubscription}
                            className="bg-rose-100 hover:bg-rose-200 border-2 border-neutral-900 text-rose-900 font-mono text-[9px] px-3 py-2 rounded-xl transition font-black uppercase tracking-wider"
                          >
                            🛡️ Forzar Vencimiento para Demostración
                          </button>
                        </div>
                      )}

                      {/* MAIN DESK GRID (Unlocked if subscribed) */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-6 space-y-6">
                          <div className="border-b-2 border-neutral-900 pb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-700 font-black">Desafíos Asignados</span>
                            <h3 className="text-xl font-serif italic text-neutral-900 font-bold">Tus Tareas Escolares Disponibles:</h3>
                          </div>

                          {!activeSubscribed ? (
                            <div className="p-10 border-2 border-dashed border-neutral-400 rounded-3xl text-center text-xs text-neutral-500 bg-stone-50/50">
                              Las asignaturas escolares se desbloquearán una vez liquidada la matrícula móvil arriba.
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {appState.activities.filter(a => a.teacherId === (currentUser.registeredUnderTeacherId || currentTeacherId)).map(act => {
                                const hasFinished = earns.some(e => e.activityId === act.id);
                                return (
                                  <div key={act.id} className="bg-white border-2 border-neutral-900 p-6 rounded-3xl space-y-4 relative overflow-hidden shadow-[4px_4px_0px_0px_#ea580c]">
                                    {hasFinished && (
                                      <div className="absolute top-0 right-0 bg-yellow-400 border-b-2 border-l-2 border-neutral-900 text-neutral-900 text-[10px] font-mono uppercase px-3 py-1 font-black">
                                        Completada ✓
                                      </div>
                                    )}

                                    <div>
                                      <span className="text-[9px] font-mono text-neutral-450 block uppercase font-bold">Nivel recomendado</span>
                                      <h4 className="text-lg font-serif italic text-neutral-900 leading-tight mt-0.5 font-black">{act.title}</h4>
                                    </div>

                                    <p className="text-xs text-neutral-700 leading-relaxed font-sans font-medium">{act.instructions}</p>

                                    {/* Linked Materials preview buttons */}
                                    {act.suggestedMaterialIds && act.suggestedMaterialIds.length > 0 && (
                                      <div className="space-y-1">
                                        <span className="text-[9px] font-mono uppercase text-[#2563eb] font-extrabold block">Material Guía Vinculado o Libro de Estudio:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                          {act.suggestedMaterialIds.map(mid => {
                                            const mat = appState.materials.find(m => m.id === mid);
                                            return mat ? (
                                              <span key={mid} className="bg-sky-50 border-2 border-neutral-900 px-3 py-1 text-[10px] rounded-lg text-neutral-800 font-serif italic flex items-center space-x-1.5 font-black">
                                                <FileText className="h-3 w-3 inline text-blue-600 shrink-0" />
                                                <span>{mat.title}</span>
                                              </span>
                                            ) : null;
                                          })}
                                        </div>
                                      </div>
                                    )}

                                    <div className="flex md:items-center justify-between flex-col md:flex-row gap-3 border-t-2 border-neutral-100 pt-4">
                                      <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-neutral-500">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>Requisito Enfoque: {act.durationMinutes} minutos</span>
                                      </div>
                                      
                                      <button 
                                        onClick={() => {
                                          setActiveActivity(act);
                                          setFocusTimerSeconds(act.durationMinutes * 60);
                                          setFocusModeActive(true);
                                          playChime('focus');
                                          setCheckpointResponse('');
                                        }}
                                        className="bg-yellow-400 hover:bg-yellow-500 hover:scale-[1.01] active:scale-[0.99] text-neutral-950 px-4 py-2 rounded-xl border-2 border-neutral-900 font-mono text-xs uppercase tracking-wider font-black shadow-[2px_2px_0px_0px_#000] transition-transform"
                                      >
                                        👨‍🚀 Iniciar Actividad
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Custom Avatar Guía Interactive Chat with primary school tones */}
                        <div className="lg:col-span-6 space-y-4">
                          <div className="border-b-2 border-neutral-900 pb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-700 font-black block">Templo del Saber</span>
                            <h3 className="text-xl font-serif italic text-neutral-900 font-bold">Habla con tu Avatar de IA</h3>
                          </div>

                          {!activeSubscribed ? (
                            <div className="p-10 border-2 border-dashed border-neutral-400 rounded-3xl text-center text-xs text-neutral-500 bg-stone-50/50">
                              Habilita la pasarela de pagos arriba para comunicarte con la memoria del Avatar de IA.
                            </div>
                          ) : (
                            <div className="bg-white border-2 border-neutral-900 rounded-3xl overflow-hidden p-6 shadow-[4px_4px_0px_0px_#2563eb] space-y-4 flex flex-col h-[480px]">
                              
                              {/* Dialogue container */}
                              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                                {aiChatHistory.map((ch, idx) => (
                                  <div key={idx} className={`p-4 rounded-2xl leading-relaxed ${
                                    ch.sender === 'user' 
                                      ? 'bg-neutral-100 text-neutral-900 ml-10 border-2 border-neutral-900 font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium' 
                                      : 'bg-yellow-50 text-neutral-900 border-2 border-neutral-900 mr-10 font-sans shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium'
                                  }`}>
                                    <span className="text-[8px] font-mono uppercase tracking-widest block font-bold text-neutral-400 mb-1">
                                      {ch.sender === 'user' ? 'Tú (Aventurero Creador)' : 'Avatar Guía de IA'}
                                    </span>
                                    {ch.text}
                                  </div>
                                ))}
                                {isLoadingAiChat && (
                                  <div className="p-3 bg-neutral-100 border-2 border-neutral-900 rounded-xl mr-10 text-xs text-neutral-500 font-mono animate-pulse">
                                    Conectando con la glándula de aprendizaje de gemini-3.5-flash...
                                  </div>
                                )}
                              </div>

                              <form onSubmit={handleQueryAiGuia} className="flex gap-2 border-t-2 border-neutral-100 pt-4">
                                <input 
                                  type="text" 
                                  value={aiChatQuery}
                                  onChange={(e) => setAiChatQuery(e.target.value)}
                                  placeholder="Pregúntame sobre los planetas, pizzas o ciencia..."
                                  className="flex-1 px-4 py-2 bg-stone-50 border-2 border-neutral-900 rounded-xl text-xs text-neutral-900 font-bold focus:bg-white focus:outline-none"
                                />
                                <button 
                                  type="submit" 
                                  disabled={isLoadingAiChat || !aiChatQuery.trim()}
                                  className="bg-yellow-400 hover:bg-yellow-500 hover:scale-[1.02] text-neutral-950 font-mono tracking-wider font-extrabold text-xs uppercase px-4 py-2 border-2 border-neutral-900 rounded-xl shrink-0 transition-transform"
                                >
                                  <Send className="h-4 w-4" />
                                </button>
                              </form>

                              <span className="text-[9px] text-neutral-400 text-center font-mono font-bold block">
                                La IA del Avatar responde exclusivamente basándose en los materiales didácticos cargados por tu docente.
                              </span>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })()}

              </div>
            )}

          </div>
        )}

      </main>

      {/* MODO ENFOQUE PEDAGÓGICO OVERLAY */}
      {focusModeActive && activeActivity && (
        <div 
          id="focus-modal" 
          className="fixed inset-0 bg-[#F9F8F6] text-[#1A1A1A] z-50 flex flex-col p-4 sm:p-10 overflow-y-auto"
        >
          {/* Header resembling a workspace blockout sheet */}
          <div className="w-full max-w-4xl mx-auto border-b border-neutral-900 pb-4 mb-8 flex justify-between items-end">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-red-600 font-bold block animate-pulse">
                ⏰ MODO ENFOQUE ACTIVO — DISTRACTORES DESACTIVADOS
              </span>
              <h1 className="text-3xl font-serif italic text-neutral-900">{activeActivity.title}</h1>
            </div>

            <button 
              onClick={() => {
                if (confirm("¿Estás seguro que deseas abandonar el cronómetro pedagógico? Cancelarás tu racha y no se guardará la evidencia.")) {
                  setFocusModeActive(false);
                  setActiveActivity(null);
                }
              }}
              className="px-3 py-1 border border-neutral-900 hover:bg-neutral-100 font-mono text-xs uppercase font-bold transition"
            >
              Cancelar reto
            </button>
          </div>

          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 flex-1">
            
            {/* Countdown timer left column */}
            <div className="md:col-span-5 flex flex-col justify-center items-center p-8 bg-white border border-neutral-900 rounded-xl shadow-sm text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">Reloj Escolar</span>
              
              {/* Massive focus countdown indicator */}
              <div className="text-6xl sm:text-7xl font-serif font-light tabular-nums tracking-tighter text-neutral-900">
                {String(Math.floor(focusTimerSeconds / 60)).padStart(2, '0')}:
                {String(focusTimerSeconds % 60).padStart(2, '0')}
              </div>

              <div className="mt-4 w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-neutral-900 h-full transition-all duration-1000"
                  style={{ width: `${(focusTimerSeconds / (activeActivity.durationMinutes * 60)) * 100}%` }}
                />
              </div>

              <p className="text-xs text-neutral-500 mt-4 leading-relaxed font-sans">
                La interfaz principal y los complementos de chat están bloqueados temporalmente para evitar distracciones durante la sesión de lectura científica profunda de primaria.
              </p>
            </div>

            {/* Scientific checkpoint question right column */}
            <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="bg-stone-50 border border-neutral-300 p-5 rounded">
                  <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 block">Consigna del Docente:</span>
                  <p className="text-sm text-neutral-800 leading-relaxed font-serif italic mt-1 whitespace-pre-wrap">
                    &ldquo;{activeActivity.instructions}&rdquo;
                  </p>
                </div>

                {/* Show linked science text right there */}
                {activeActivity.suggestedMaterialIds && activeActivity.suggestedMaterialIds.length > 0 && (
                  <div className="bg-amber-50/50 border border-amber-200 p-4 rounded text-xs space-y-2">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-amber-800 font-bold block">Material Didáctico Vinculado para lectura rápida:</span>
                    {activeActivity.suggestedMaterialIds.map(mid => {
                      const mat = appState?.materials.find(m => m.id === mid);
                      return mat ? (
                        <div key={mid} className="space-y-1">
                          <strong className="text-neutral-800 block text-xs">{mat.title}</strong>
                          <p className="text-neutral-700 leading-relaxed max-h-[140px] overflow-y-auto pr-1 text-[11px] font-sans">
                            {mat.content}
                          </p>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-600 uppercase">Respuesta / Evidencia del Estudiante</label>
                  <textarea 
                    rows={4}
                    disabled={focusTimerSeconds > 0}
                    value={checkpointResponse}
                    onChange={(e) => setCheckpointResponse(e.target.value)}
                    placeholder={focusTimerSeconds > 0 ? "Se habilitará cuando finalice el cronómetro de lectura profunda..." : "Describe tu comprensión científica en al menos 15 letras para ganar la recompense..."}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-serif leading-relaxed focus:outline-none"
                  />
                  {focusTimerSeconds > 0 && (
                    <span className="text-[10px] text-amber-600 font-mono block">
                      ⚠️ Lee en silencio los textos de arriba. El cuadro de respuestas se habilitará al vencer el tiempo de estudio.
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <button 
                  onClick={handleFinishAndSubmitProgressByStudent}
                  disabled={focusTimerSeconds > 0 || checkpointResponse.trim().length < 5 || isSubmittingActivity}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white font-mono uppercase font-bold tracking-widest text-xs py-3 rounded transition"
                >
                  {isSubmittingActivity ? "Enviando evidencia..." : "Registrar Evidencia y Subir Nivel RPG →"}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Editorial footer */}
      <footer className="mt-auto border-t border-neutral-900/10 mx-4 sm:mx-10 py-6 text-[10px] uppercase tracking-widest font-medium flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
          <span>Infraestructura: <span className="text-emerald-700 font-bold">Operational</span></span>
          <span className="text-neutral-400">|</span>
          <span>Aislamiento: <span className="text-neutral-600 font-bold">Multi-tenant secured</span></span>
        </div>

        <div className="flex gap-6 items-center italic text-neutral-500 text-center sm:text-right">
          <span>MentorAI Platform by Senior Architect</span>
          <div className="w-10 h-[1px] bg-neutral-400 hidden sm:block" />
          <span>© 2026</span>
        </div>
      </footer>

    </div>
  );
}
