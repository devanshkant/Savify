import React, { useState, useEffect } from 'react';
import {
  Heart, Plus, Droplets, Hospital, Search, Share2, Activity, Users,
  ShieldCheck, PlusCircle, History, Bell, LogOut, MapPin, Loader2, RefreshCcw, X, BellRing,
  Clock, AlertCircle, CheckCircle, Navigation, Calendar, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Blood group enum name → display label
const BLOOD_GROUP_ENUM_TO_LABEL = {
  A_POSITIVE: 'A+', A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+', B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+', AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+', O_NEGATIVE: 'O-',
};

const RescueBlood = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const userRole = localStorage.getItem('role') || 'guest';
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // ── toggleAvailability (Spring Boot shape) ──────────────────────────────────
  // Spring: PUT /api/user/availability  body: { id: Long, available: Boolean }
  const toggleAvailability = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (availabilityLoading || !userId) return;

    try {
      setAvailabilityLoading(true);
      const newStatus = !isAvailable;
      setIsAvailable(newStatus); // Optimistic update

      const res = await fetch(`${apiUrl}/api/user/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: Number(userId), available: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Toggle failed');
      }
    } catch (err) {
      setIsAvailable(prev => !prev); // Rollback on error
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };


  // --- DONOR VIEW ---
  // NOTE: Nearby requests (GET /api/blood-requests/nearby) and accept donation
  // (POST /api/donations/accept) are not yet implemented in Spring Boot (Phase 4).
  // The toggle and stats panels are functional; the feed shows a placeholder.
  const DonorView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-20"
    >
      <section className="text-center space-y-8 relative">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-display font-bold text-forest leading-[0.95] mb-4">
            Find Someone to
          </h1>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-crimson leading-[0.95] mb-2">
            Save Today
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-crimson via-terracotta to-sage mx-auto rounded-full mt-6 animate-pulse-slow"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex justify-center gap-6 items-center flex-wrap pt-8"
        >
          <div className="organic-card text-center min-w-[200px] group hover:scale-105 transition-all duration-500">
            <div className="mb-5 p-4 bg-gradient-to-br from-white to-stone-50 rounded-2xl shadow-sm inline-block">
              <Activity className="text-crimson" size={28} />
            </div>
            <div className="text-5xl font-display font-bold text-forest mb-2">—</div>
            <div className="text-[9px] font-body font-bold text-sage/60 uppercase tracking-[0.25em]">Lives Saved</div>
            <div className="text-xs text-sage/50 mt-1">(Coming in Phase 4)</div>
          </div>
          <div className="organic-card group hover:scale-105 transition-all duration-500">
            <div className="text-[9px] font-bold text-sage/60 uppercase tracking-[0.2em] mb-4 font-body">Availability</div>
            <button
              type="button"
              onClick={(e) => toggleAvailability(e)}
              disabled={availabilityLoading || !userId}
              className={`w-16 h-9 rounded-full transition-all relative shadow-inner 
                ${isAvailable ? 'bg-gradient-to-r from-sage to-emerald-400' : 'bg-stone-300'}
                ${availabilityLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className={`absolute top-1 w-7 h-7 bg-cream rounded-full shadow-lg transition-all ${isAvailable ? 'left-8' : 'left-1'}`}>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-stone-100"></div>
              </div>
            </button>
            <span className={`text-[9px] font-bold mt-3 block font-body tracking-wider ${isAvailable ? 'text-sage' : 'text-stone-400'}`}>
              {isAvailable ? 'READY TO HELP' : 'OFFLINE'}
            </span>
          </div>
        </motion.div>
      </section>

      <section id="feed">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex justify-between items-end mb-10"
        >
          <div>
            <h2 className="text-4xl font-display font-bold text-forest mb-2">Emergency Feed</h2>
            <p className="text-xs font-body font-semibold text-sage/70 uppercase flex items-center gap-2 tracking-wider">
              <MapPin size={14} className="text-terracotta" />
              Real-time alerts coming in Phase 4
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-center py-28 organic-card-empty"
        >
          <div className="relative inline-block mb-6">
            <Droplets className="text-sage/20" size={72} />
            <div className="absolute inset-0 blur-xl bg-sage/10 rounded-full"></div>
          </div>
          <p className="font-body font-semibold text-sage/60 italic text-lg">
            Live donor feed will appear here once Phase 4 (WebSocket) is complete.
          </p>
          <p className="font-body text-sage/40 text-sm mt-2">
            Use the toggle above to mark yourself as available in the meantime.
          </p>
        </motion.div>
      </section>
    </motion.div>
  );


  // --- HOSPITAL VIEW ---
  // NOTE: GET /api/blood-requests/my-requests and accepted donors are not yet in Spring Boot.
  // The "Create Emergency Alert" button navigates to BloodRequestForm which IS wired.
  const HospitalView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-16"
    >
      <section className="grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="lg:col-span-2 broadcast-card group"
        >
          <div className="relative z-10">
            <h2 className="text-5xl font-display font-bold mb-4 text-cream">Broadcast Need</h2>
            <p className="text-cream/80 mb-10 text-lg font-body font-medium max-w-md leading-relaxed">
              Instantly notify all available donors within 5 km of your facility
            </p>
            <button onClick={() => navigate('/bloodForm')} className="cta-button group/btn">
              <PlusCircle size={24} className="group-hover/btn:rotate-90 transition-transform duration-500" />
              Create Emergency Alert
            </button>
          </div>
          <div className="absolute -right-16 -bottom-16 opacity-20">
            <Droplets size={350} className="text-cream rotate-12" />
          </div>
          <div className="absolute top-10 right-20 w-32 h-32 bg-cream/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="organic-card text-center"
        >
          <div className="mb-5 p-4 bg-gradient-to-br from-white to-stone-50 rounded-2xl shadow-sm inline-block">
            <Users className="text-sage" size={28} />
          </div>
          <div className="text-5xl font-display font-bold text-forest mb-2">—</div>
          <div className="text-[9px] font-body font-bold text-sage/60 uppercase tracking-[0.25em]">Accepted Donors</div>
          <div className="text-xs text-sage/40 mt-1">(Phase 4 feature)</div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="organic-card"
      >
        <h3 className="text-3xl font-display font-bold text-forest mb-6">My Blood Requests</h3>
        <div className="text-center py-12 text-sage/60">
          <Droplets className="text-sage/20 mx-auto mb-4" size={48} />
          <p className="font-body font-semibold">Request history will be available in a future update.</p>
          <p className="text-sm mt-2 text-sage/40">Your submitted requests are saved — create one above to get started!</p>
        </div>
      </motion.section>
    </motion.div>
  );


  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');

        :root {
          --cream: #FDF8F3;
          --crimson: #C1403D;
          --terracotta: #E07856;
          --sage: #5A7A6B;
          --forest: #2F4538;
          --sand: #E8DDD0;
        }

        * { box-sizing: border-box; }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #FDF8F3 0%, #F5EDE3 50%, #EDE3D8 100%);
          position: relative;
          overflow-x: hidden;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .app-container::before {
          content: '';
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(193, 64, 61, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(90, 122, 107, 0.08) 0%, transparent 50%);
          animation: breathe 20s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }

        .font-display { font-family: 'Crimson Pro', serif; }
        .font-body { font-family: 'Outfit', sans-serif; }
        .text-forest { color: var(--forest); }
        .text-crimson { color: var(--crimson); }
        .text-sage { color: var(--sage); }
        .text-terracotta { color: var(--terracotta); }
        .text-cream { color: var(--cream); }

        .organic-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border-radius: 40px;
          padding: 3rem;
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 20px 60px rgba(47, 69, 56, 0.08);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .organic-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 80px rgba(47, 69, 56, 0.12);
        }

        .organic-card-empty {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(20px);
          border-radius: 50px;
          padding: 4rem;
          border: 3px dashed rgba(90, 122, 107, 0.2);
        }

        .organic-button-small {
          padding: 0.875rem;
          background: rgba(255, 255, 255, 0.8);
          color: var(--sage);
          border-radius: 20px;
          border: 2px solid rgba(90, 122, 107, 0.1);
          box-shadow: 0 4px 15px rgba(90, 122, 107, 0.1);
          transition: all 0.4s;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .organic-button-small:hover {
          background: white;
          color: var(--crimson);
          transform: translateY(-2px);
        }

        .broadcast-card {
          background: linear-gradient(135deg, var(--crimson) 0%, #A63634 100%);
          border-radius: 45px;
          padding: 3.5rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 70px rgba(193, 64, 61, 0.3);
          transition: all 0.5s;
        }

        .broadcast-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 35px 90px rgba(193, 64, 61, 0.4);
        }

        .cta-button {
          background: var(--cream);
          color: var(--crimson);
          padding: 1.25rem 2.5rem;
          border-radius: 25px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.4s;
          border: none;
          cursor: pointer;
          text-transform: uppercase;
        }

        .cta-button:hover {
          transform: translateY(-3px) scale(1.02);
        }

        .donor-card {
          padding: 1.75rem;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 30px;
          border: 2px solid rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.4s;
          box-shadow: 0 5px 20px rgba(47, 69, 56, 0.05);
        }

        .donor-card:hover {
          background: white;
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(47, 69, 56, 0.12);
        }

        .blood-badge {
          width: 4rem;
          height: 4rem;
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(193, 64, 61, 0.1), rgba(224, 120, 86, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Crimson Pro', serif;
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--crimson);
          border: 2px solid rgba(193, 64, 61, 0.2);
          transition: all 0.3s;
        }

        .donor-card:hover .blood-badge {
          background: linear-gradient(135deg, var(--crimson), var(--terracotta));
          color: var(--cream);
          border-color: transparent;
        }

        .hospital-request-card {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          border: 2px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 10px 30px rgba(47, 69, 56, 0.08);
          transition: all 0.3s;
        }

        .hospital-request-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(47, 69, 56, 0.12);
        }

        .blood-badge-large {
          width: 5rem;
          height: 5rem;
          border-radius: 25px;
          background: linear-gradient(135deg, rgba(193, 64, 61, 0.15), rgba(224, 120, 86, 0.15));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Crimson Pro', serif;
          font-weight: 800;
          font-size: 1.75rem;
          color: var(--crimson);
          border: 3px solid rgba(193, 64, 61, 0.3);
        }

        .urgency-badge {
          padding: 0.5rem 1rem;
          border-radius: 15px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .urgency-high {
          background: linear-gradient(135deg, rgba(193, 64, 61, 0.15), rgba(193, 64, 61, 0.1));
          color: var(--crimson);
          border: 2px solid rgba(193, 64, 61, 0.2);
        }

        .urgency-medium {
          background: linear-gradient(135deg, rgba(224, 120, 86, 0.15), rgba(224, 120, 86, 0.1));
          color: var(--terracotta);
          border: 2px solid rgba(224, 120, 86, 0.2);
        }

        .urgency-low {
          background: linear-gradient(135deg, rgba(90, 122, 107, 0.15), rgba(90, 122, 107, 0.1));
          color: var(--sage);
          border: 2px solid rgba(90, 122, 107, 0.2);
        }

        .status-badge {
          padding: 0.5rem 1.25rem;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .status-open {
          background: linear-gradient(135deg, rgba(90, 122, 107, 0.15), rgba(90, 122, 107, 0.1));
          color: var(--sage);
          border: 2px solid rgba(90, 122, 107, 0.2);
        }

        .status-in_progress {
          background: linear-gradient(135deg, rgba(224, 120, 86, 0.15), rgba(224, 120, 86, 0.1));
          color: var(--terracotta);
          border: 2px solid rgba(224, 120, 86, 0.2);
        }

        .status-completed {
          background: linear-gradient(135deg, rgba(52, 211, 153, 0.15), rgba(52, 211, 153, 0.1));
          color: #10b981;
          border: 2px solid rgba(52, 211, 153, 0.2);
        }

        nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2.5rem;
          backdrop-filter: blur(30px);
          background: rgba(253, 248, 243, 0.8);
          border-bottom: 2px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 5px 30px rgba(47, 69, 56, 0.05);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .logo-container:hover {
          transform: translateY(-2px);
        }

        .logo-icon {
          background: var(--crimson);
          padding: 0.625rem;
          border-radius: 18px;
          transform: rotate(3deg);
          box-shadow: 0 5px 20px rgba(193, 64, 61, 0.3);
          transition: all 0.3s;
        }

        .logo-icon:hover {
          transform: rotate(-3deg) scale(1.05);
        }

        .logo-text {
          font-family: 'Crimson Pro', serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--crimson);
          text-transform: uppercase;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-left: 1.5rem;
          border-left: 2px solid rgba(90, 122, 107, 0.2);
        }

        .nav-user-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--forest);
        }

        .nav-button {
          padding: 0.875rem 1.25rem;
          background: rgba(255, 255, 255, 0.9);
          color: var(--sage);
          border-radius: 18px;
          border: 2px solid rgba(90, 122, 107, 0.1);
          font-weight: 700;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .nav-button:hover {
          background: white;
          color: var(--crimson);
          transform: translateY(-2px);
        }

        .signin-button {
          background: var(--forest);
          color: var(--cream);
          padding: 1rem 2rem;
          border-radius: 20px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
        }

        .signin-button:hover {
          background: var(--crimson);
          transform: translateY(-2px);
        }

        main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem 8rem;
          position: relative;
          z-index: 1;
        }

        .blood-request-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(25px);
          border-radius: 35px;
          border: 2px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 20px 60px rgba(47, 69, 56, 0.1);
          overflow: hidden;
          transition: all 0.5s;
        }

        .blood-request-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 35px 80px rgba(47, 69, 56, 0.15);
        }

        .request-header {
          padding: 2rem 2rem 1.5rem;
          border-bottom: 2px solid rgba(90, 122, 107, 0.08);
        }

        .request-body {
          padding: 2rem;
        }

        .request-footer {
          padding: 1.5rem 2rem 2rem;
          background: rgba(90, 122, 107, 0.02);
        }

        .hospital-info {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .hospital-avatar {
          background: linear-gradient(135deg, var(--sage), var(--forest));
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(90, 122, 107, 0.25);
        }

        .hospital-details h3 {
          font-family: 'Crimson Pro', serif;
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--forest);
          margin: 0 0 0.25rem;
        }

        .request-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--sage);
          text-transform: uppercase;
        }

        .blood-requirement {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(193, 64, 61, 0.05), rgba(224, 120, 86, 0.05));
          border-radius: 25px;
          border: 2px solid rgba(193, 64, 61, 0.1);
          margin-bottom: 1.5rem;
        }

        .blood-type-display {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .blood-icon-large {
          background: linear-gradient(135deg, var(--crimson), var(--terracotta));
          padding: 1.25rem;
          border-radius: 22px;
          box-shadow: 0 10px 30px rgba(193, 64, 61, 0.3);
        }

        .blood-type-text {
          font-family: 'Crimson Pro', serif;
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--crimson);
          line-height: 1;
        }

        .units-display {
          text-align: right;
        }

        .units-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--sage);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .units-value {
          font-family: 'Crimson Pro', serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--forest);
          line-height: 1;
        }

        .description-section {
          margin-bottom: 1.5rem;
        }

        .description-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--forest);
          font-weight: 500;
        }

        .location-section {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(90, 122, 107, 0.05);
          border-radius: 20px;
          margin-bottom: 1.5rem;
        }

        .location-icon {
          background: rgba(224, 120, 86, 0.15);
          padding: 0.75rem;
          border-radius: 15px;
          color: var(--terracotta);
        }

        .location-text {
          font-size: 0.9rem;
          color: var(--forest);
          font-weight: 600;
          line-height: 1.5;
        }

        .action-button {
          width: 100%;
          background: linear-gradient(135deg, var(--crimson), #A63634);
          color: white;
          padding: 1.25rem;
          border-radius: 20px;
          border: none;
          font-weight: 800;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 30px rgba(193, 64, 61, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .action-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(193, 64, 61, 0.4);
        }

        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          nav { padding: 1.25rem 1.5rem; }
          main { padding: 2rem 1.5rem 6rem; }
          .logo-text { font-size: 1.5rem; }
          .nav-user-name { display: none; }
        }
      `}</style>

      <nav className="flex items-center justify-between">
        <div className="logo-container flex items-center gap-2" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <Droplets className="text-cream" size={26} />
          </div>
          <span className="logo-text">Savify</span>
        </div>

        {/* <div className="flex items-center gap-6">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/map")}>Map</button>
          <button onClick={() => navigate("/chat")}>Chat</button>
        </div> */}

        <div className="flex items-center gap-6">
          {userRole !== "guest" ? (
            <div className="nav-user flex items-center gap-3">
              <p className="nav-user-name">{localStorage.getItem("userName")}</p>
              <button onClick={handleLogout} className="nav-button">
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/auth')} className="signin-button">
              Sign In
            </button>
          )}
        </div>
      </nav>

      <main>
        {userRole === "donor" && <DonorView />}
        {userRole === "hospital" && <HospitalView />}
        {userRole === "guest" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center space-y-16 py-24"
          >
            <div>
              <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="text-7xl md:text-9xl font-display font-bold text-forest leading-[0.85] mb-6"
              >
                Kindness in
              </motion.h1>
              <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-7xl md:text-9xl font-display font-bold text-crimson leading-[0.85] mb-8"
              >
                Every Drop
              </motion.h1>
            </div>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              onClick={() => navigate('/auth')}
              className="cta-button"
              style={{ fontSize: '1.1rem', padding: '1.5rem 3rem' }}
            >
              Start Saving Lives
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* DonationConfirmationModal removed — no backend endpoint yet */}
    </div>
  );
};
export default RescueBlood;