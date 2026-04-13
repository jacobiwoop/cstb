import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, CheckCircle2, Play, ArrowRight, Activity, Users, Shield, User, Mail, Coins, CreditCard } from 'lucide-react';
import { donationApi, settingsApi } from '../utils/api';
import { LocalDB } from '../utils/localDb';

export const Vote = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorInfo, setDonorInfo] = useState({
    firstname: "",
    lastname: "",
    email: ""
  });
  
  const [stats, setStats] = useState<any>({ amount: 0, goal: 50000000 });
  const amounts = [5000, 10000, 25000, 50000, 100000];

  useEffect(() => {
    window.scrollTo(0, 0);
    loadFedaPay();
    fetchSettings();
  }, []);

  const loadFedaPay = () => {
    if (!document.getElementById('fedapay-checkout-js')) {
      const script = document.createElement('script');
      script.id = 'fedapay-checkout-js';
      script.src = 'https://cdn.fedapay.com/checkout.js?v=2.1.2';
      script.async = true;
      script.onload = () => console.log("SDK FedaPay chargé dynamiquement");
      script.onerror = () => console.error("Erreur chargement SDK FedaPay");
      document.body.appendChild(script);
    }
  };

  const fetchSettings = async () => {
    try {
      const statsData = await donationApi.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Erreur chargement stats dons:", error);
    }
  };

  const handleDonate = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (!amount || amount < 100) {
      alert("Veuillez sélectionner ou saisir un montant valide (min 100 FCFA)");
      return;
    }

    if (!donorInfo.firstname || !donorInfo.lastname || !donorInfo.email) {
      alert("Veuillez remplir vos informations (Nom, Prénom, Email)");
      return;
    }

    // @ts-ignore - FedaPay est chargé via script externe
    const fp = (window as any).FedaPay;
    
    if (fp) {
      const checkoutOptions = {
        public_key: stats.publicKey || '',
        environment: stats.mode || 'sandbox',
        transaction: {
          amount: amount,
          description: "Don pour le projet CSTB - Un toit pour la santé"
        },
        customer: {
          firstname: donorInfo.firstname,
          lastname: donorInfo.lastname,
          email: donorInfo.email
        },
        onComplete: async (response: any) => {
          if (response.transaction.status === 'approved' || response.transaction.status === 'success') {
            try {
              await donationApi.create({
                amount: amount,
                donorName: `${donorInfo.firstname} ${donorInfo.lastname}`,
                donorEmail: donorInfo.email,
                reference: response.transaction.id.toString()
              });
              alert("Merci infiniment pour votre don ! Votre contribution a été enregistrée.");
              fetchSettings(); 
            } catch (err) {
              console.error("Erreur enregistrement don:", err);
            }
          }
        }
      };

      console.log(`Initialisation FedaPay (${checkoutOptions.environment}) avec la clé: ${checkoutOptions.public_key}`);

      try {
        if (typeof fp.init === 'function') {
          const res = fp.init(checkoutOptions);
          if (res && typeof res.open === 'function') {
            res.open();
          } else if (typeof (window as any).FedaPay.open === 'function') {
             (window as any).FedaPay.open();
          }
        } else if (typeof fp.checkout === 'function') {
          fp.checkout(checkoutOptions);
        } else if (typeof fp === 'function') {
          fp(checkoutOptions);
        } else {
          console.error("Structure FedaPay non reconnue");
          alert("Impossible d'ouvrir le module de paiement.");
        }
      } catch (err: any) {
        console.error("Erreur FedaPay:", err);
        alert("Erreur: " + err.message);
      }
    } else {
      alert("Le service de paiement est encore en cours de chargement.");
    }
  };

  // Calculs pour la barre de progression
  const current = stats.amount;
  const goal = stats.goal;
  const percentage = Math.min(100, Math.round((current / goal) * 100));

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* HERO SECTION */}
      <section className="bg-[#F8FAFC] pt-32 pb-48 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-[#0891b2]/5 blur-3xl"></div>
          <div className="absolute bottom-[20%] -left-[10%] w-[30%] h-[30%] rounded-full bg-[#005a87]/5 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-sans text-[#005a87] text-3xl md:text-4xl mb-4 flex items-center gap-3">
                <Heart size={24} className="fill-[#005a87]" />
                Urgence Sanitaire Sociale
              </h3>
              <h1 className="text-[#0f172a] text-5xl md:text-6xl lg:text-7xl font-sans font-bold leading-tight mb-6">
                Appel à la Solidarité <br/>
                <span className="text-[#0891b2] font-sans text-6xl md:text-7xl lg:text-8xl font-normal">Un toit pour la santé</span>
              </h1>
              <p className="text-[#6b7280] text-lg md:text-xl mb-8 max-w-xl font-light leading-relaxed border-l-2 border-[#FFC107] pl-4">
                "On ne peut pas demander à un homme qui gagne moins que le minimum vital de choisir entre manger et se soigner."
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="bg-[#0891b2] text-[#0f172a] font-bold px-8 py-4 rounded-full hover:bg-[#006ba1] transition-colors flex items-center gap-2 shadow-custom-1 shadow-[#0891b2]/30">
                  Faire un don <ArrowRight size={20} />
                </button>
                <button className="bg-white text-[#0f172a] border-2 border-[#e2e8f0] font-bold px-8 py-4 rounded-full hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-colors">
                  En savoir plus
                </button>
              </div>
            </motion.div>

            {/* Right Content - Masked Image */}
            <div className="relative h-[500px] hidden lg:flex items-center justify-center">
              {/* Decorative Dots */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-10 w-3 h-3 bg-[#005a87] rounded-full"></motion.div>
              <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-24 left-4 w-4 h-4 bg-blue-500 rounded-full"></motion.div>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-1/2 right-4 w-3 h-3 bg-red-500 rounded-full"></motion.div>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 right-20 w-6 h-6 bg-[#0891b2] rounded-full opacity-60"></motion.div>
              
              {/* Large decorative shape on the right edge */}
              <div className="absolute top-1/2 -right-12 w-24 h-48 bg-[#0891b2] rounded-full -translate-y-1/2 opacity-90"></div>

              {/* Masked Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-[450px] h-[450px] z-10"
                style={{
                  WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(45 200 200)'%3E%3Crect x='75' y='100' width='50' height='200' rx='25' fill='black'/%3E%3Crect x='140' y='20' width='50' height='360' rx='25' fill='black'/%3E%3Crect x='205' y='20' width='50' height='360' rx='25' fill='black'/%3E%3Crect x='270' y='100' width='50' height='200' rx='25' fill='black'/%3E%3C/g%3E%3C/svg%3E")`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(45 200 200)'%3E%3Crect x='75' y='100' width='50' height='200' rx='25' fill='black'/%3E%3Crect x='140' y='20' width='50' height='360' rx='25' fill='black'/%3E%3Crect x='205' y='20' width='50' height='360' rx='25' fill='black'/%3E%3Crect x='270' y='100' width='50' height='200' rx='25' fill='black'/%3E%3C/g%3E%3C/svg%3E")`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80" 
                  alt="Children" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* PROGRESS BANNER (Overlapping) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-12 md:-mt-24">
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-custom-3">
          {/* Yellow Side */}
          <div className="bg-[#0891b2] p-6 md:p-12 md:w-1/2">
            <h3 className="text-[#0f172a] text-xl md:text-2xl font-sans font-bold mb-6">Fonds Récoltés</h3>
            <div className="relative w-full h-2 bg-black/10 rounded-full mb-4">
              <div className="absolute top-0 left-0 h-full bg-[#0f172a] rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
              <div className="absolute -top-8 font-bold text-sm text-[#0f172a]" style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}>{percentage}%</div>
            </div>
            <div className="flex justify-between text-[#0f172a] font-bold">
              <div>
                <span className="block text-xs md:text-sm opacity-80">Récolté</span>
                <span className="text-lg md:text-xl">{current.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="text-right">
                <span className="block text-xs md:text-sm opacity-80">Objectif</span>
                <span className="text-lg md:text-xl">{goal.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          </div>
          {/* Green Side */}
          <div className="bg-[#005a87] p-6 md:p-12 md:w-1/2 text-white">
            <span className="inline-block border border-white/30 rounded-full px-4 py-1 text-xs md:text-sm mb-4">Clinique CSTB</span>
            <h3 className="text-xl md:text-3xl font-sans font-bold mb-4">Acquisition du local d'Accronville</h3>
            <p className="text-[#ecfeff] font-light text-sm md:text-base leading-relaxed">
              La Clinique du CSTB a été pensée pour eux. Elle est le dernier rempart pour ceux que le système de santé classique oublie.
            </p>
          </div>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Image */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative pr-8 pb-8 md:pr-12 md:pb-12"
            >
              <div className="rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&q=80" 
                  alt="Solidarity" 
                  className="w-full h-[400px] md:h-[500px] object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Yellow Heart Overlay */}
              <div className="absolute top-8 left-8 text-[#0891b2] z-10">
                <Heart size={48} className="fill-[#0891b2] drop-shadow-custom-1" />
              </div>
              {/* Overlapping Circular Image */}
              <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-white overflow-hidden shadow-xl z-10">
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80" 
                  alt="Children" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-sans text-[#6b7280] text-2xl mb-3 flex items-center gap-2">
                <Heart size={18} className="text-[#005a87]" /> Urgence Sanitaire Sociale
              </h3>
              <h2 className="text-[#0f172a] text-4xl md:text-5xl font-sans font-bold mb-6 leading-tight">
                Soulager <span className="text-[#0891b2]">sans exclure</span> <br/>
                Faire une différence
              </h2>
              <p className="text-[#6b7280] mb-8 leading-relaxed">
                À Accronville, des milliers de travailleurs luttent chaque jour pour subvenir à leurs besoins avec des revenus inférieurs au SMIG. Pour eux, tomber malade est une double peine : l'impossibilité de travailler et l'incapacité financière de payer des soins, même les plus basiques.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="w-14 h-14 rounded-full bg-[#0891b2]/20 flex items-center justify-center shrink-0">
                    <Activity className="text-[#0891b2]" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0f172a] text-lg mb-1">Premiers soins</h4>
                    <p className="text-sm text-[#6b7280] leading-snug">Consultations abordables et soins d'urgence.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-14 h-14 rounded-full bg-[#0891b2]/20 flex items-center justify-center shrink-0">
                    <Users className="text-[#0891b2]" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0f172a] text-lg mb-1">Prise en charge</h4>
                    <p className="text-sm text-[#6b7280] leading-snug">Une approche humaine sans discrimination.</p>
                  </div>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 mb-10">
                <li className="flex items-center gap-2 text-[#6b7280] font-medium text-sm">
                  <CheckCircle2 className="text-[#005a87]" size={18} /> Consultations abordables
                </li>
                <li className="flex items-center gap-2 text-[#6b7280] font-medium text-sm">
                  <CheckCircle2 className="text-[#005a87]" size={18} /> Soins d'urgence
                </li>
                <li className="flex items-center gap-2 text-[#6b7280] font-medium text-sm">
                  <CheckCircle2 className="text-[#005a87]" size={18} /> Un filet de sécurité
                </li>
                <li className="flex items-center gap-2 text-[#6b7280] font-medium text-sm">
                  <CheckCircle2 className="text-[#005a87]" size={18} /> Dignité préservée
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-6">
                <button className="bg-[#0891b2] text-[#0f172a] font-bold px-8 py-4 rounded-full hover:bg-[#006ba1] transition-colors">
                  Plus de détails
                </button>
                <div className="flex items-center gap-3 border-l-2 border-[#e2e8f0] pl-6">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" 
                    alt="Doctor" 
                    className="w-12 h-12 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-xs text-[#6b7280] font-medium">Responsable Projet</p>
                    <p className="text-sm font-bold text-[#0f172a]">Dr. Amoussou</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* DONATION FORM SECTION */}
      <section className="relative pt-24 pb-32 bg-white">
        {/* Dark Background Banner */}
        <div className="absolute top-0 left-0 w-full h-[75%] bg-[#0f172a] z-0">
          <img 
            src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80" 
            alt="Background" 
            className="w-full h-full object-cover opacity-30 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#0f172a]/80"></div>
          {/* Torn edge effect */}
          <svg className="absolute bottom-0 left-0 w-full h-6 text-white fill-current" viewBox="0 0 1200 24" preserveAspectRatio="none">
            <path d="M0,24 L0,12 L15,20 L30,8 L45,22 L60,10 L75,24 L90,6 L105,20 L120,12 L135,24 L150,8 L165,22 L180,10 L195,24 L210,6 L225,20 L240,12 L255,24 L270,8 L285,22 L300,10 L315,24 L330,6 L345,20 L360,12 L375,24 L390,8 L405,22 L420,10 L435,24 L450,6 L465,20 L480,12 L495,24 L510,8 L525,22 L540,10 L555,24 L570,6 L585,20 L600,12 L615,24 L630,8 L645,22 L660,10 L675,24 L690,6 L705,20 L720,12 L735,24 L750,8 L765,22 L780,10 L795,24 L810,6 L825,20 L840,12 L855,24 L870,8 L885,22 L900,10 L915,24 L930,6 L945,20 L960,12 L975,24 L990,8 L1005,22 L1020,10 L1035,24 L1050,6 L1065,20 L1080,12 L1095,24 L1110,8 L1125,22 L1140,10 L1155,24 L1170,6 L1185,20 L1200,12 L1200,24 Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pb-12 lg:pb-24"
            >
              <h3 className="font-sans text-[#0891b2] text-2xl mb-4 flex items-center gap-2">
                <Heart size={18} className="text-[#0891b2]" /> L'urgence d'un siège définitif
              </h3>
              <h2 className="text-white text-5xl md:text-6xl font-sans font-bold mb-12 leading-tight">
                Bâtissons ensemble <br/>
                l'avenir <span className="text-[#0891b2]">de la santé</span>
              </h2>
              
              <button className="w-16 h-16 bg-[#005a87] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-[0_0_30px_rgba(5,150,105,0.4)]">
                <Play size={24} className="ml-1 fill-white" />
              </button>
            </motion.div>

            {/* Right Content - Donation Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-md mx-auto lg:mx-0 lg:ml-auto w-full lg:translate-y-16 border border-[#f1f5f9]"
            >
              <h3 className="text-2xl font-sans font-bold text-[#0f172a] mb-6 text-center">Soutenir le projet</h3>
              
              {/* Informations Donneur */}
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                    <input 
                      type="text" 
                      placeholder="Prénom"
                      value={donorInfo.firstname}
                      onChange={e => setDonorInfo({...donorInfo, firstname: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e8f0] focus:border-[#005a87] outline-none text-sm transition-all"
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Nom"
                      value={donorInfo.lastname}
                      onChange={e => setDonorInfo({...donorInfo, lastname: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] focus:border-[#005a87] outline-none text-sm transition-all"
                    />
                  </div>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                  <input 
                    type="email" 
                    placeholder="Email"
                    value={donorInfo.email}
                    onChange={e => setDonorInfo({...donorInfo, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e8f0] focus:border-[#005a87] outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Progress Bar Mini */}
              <div className="mb-8 p-4 bg-[#f8fafc] rounded-2xl border border-[#f1f5f9]">
                <div className="flex justify-between text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-2">
                  <span>Progression</span>
                  <span>{percentage}%</span>
                </div>
                <div className="relative w-full h-1.5 bg-[#e2e8f0] rounded-full">
                  <div className="absolute top-0 left-0 h-full bg-[#005a87] rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>

              {/* Amount Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`py-2 px-1 rounded-xl font-bold transition-all text-[11px] border ${
                      selectedAmount === amount && !customAmount
                        ? 'bg-[#005a87] text-white border-[#005a87] shadow-sm' 
                        : 'bg-white text-[#6b7280] border-[#e2e8f0] hover:bg-[#f8fafc]'
                    }`}
                  >
                    {amount.toLocaleString('fr-FR')} FCFA
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="relative mb-8">
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                <input 
                  type="number" 
                  placeholder="Autre montant (FCFA)"
                  value={customAmount}
                  onChange={e => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e8f0] focus:border-[#005a87] outline-none text-sm transition-all font-bold"
                />
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleDonate}
                className="w-full bg-[#005a87] text-white font-bold py-4 rounded-xl hover:bg-[#007cba] transition-all hover:shadow-lg flex items-center justify-center gap-3 text-base group"
              >
                Contribuer maintenant 
                <CreditCard size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#94a3b8] font-medium uppercase tracking-widest">
                <Shield size={12} /> Paiement 100% sécurisé via FedaPay
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

