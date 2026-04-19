'use client';
import { useState, useEffect } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import VerifyButton from '../../components/VerifyButton';

export default function DivePage() {
  const [trashItems, setTrashItems] = useState([]);
  const [verifiedIds, setVerifiedIds] = useState([]); 
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // --- MOBILE DETECTION ---
  useEffect(() => {
    setIsMobile(window.innerWidth < 600);
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    document.body.style.backgroundColor = '#000814';
    document.body.style.margin = '0';
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.backgroundColor = '';
    };
  }, []);

  const { scrollY } = useScroll();
  const [currentDepth, setCurrentDepth] = useState(0);

  const bgColor = useTransform(
    scrollY,
    [0, 1500, 4000, 8000, 12000], 
    ['#0077b6', '#023e8a', '#03045e', '#000814', '#000000']
  );

  const introOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const rayOpacity = useTransform(scrollY, [0, 600], [0.5, 0]);

  useEffect(() => {
    return scrollY.on("change", (v) => setCurrentDepth(Math.round(v)));
  }, [scrollY]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/trash');
        const data = await res.json();
        setTrashItems(data.sort((a, b) => a.required_unlock_depth - b.required_unlock_depth));
        setLoading(false);
      } catch (error) {
        console.error("Sonar Failure:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const nextLockedItem = trashItems.find(item => !verifiedIds.includes(item.id));
  const lockedIndex = trashItems.findIndex(item => !verifiedIds.includes(item.id));
  const dynamicHeight = nextLockedItem ? (lockedIndex + 1) * 1200 + 1000 : 15000; 

  const handleVerify = (id) => {
    setVerifiedIds(prev => [...prev, id]); 
    setScore(prev => prev + 100);
  };

  const isSwimmer = (name) => !['Staghorn Coral', 'Sea Cucumber', 'Abyssal Holothurian', 'Polychaete Worm', 'Dungeness Crab'].includes(name);

  return (
    <motion.main style={{ backgroundColor: bgColor, color: '#00d4ff', height: `${dynamicHeight}px`, minHeight: '100vh', fontFamily: 'monospace', position: 'relative', overflowX: 'hidden' }}>
      
      {/* SCENIC BACKGROUNDS */}
      <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '600px', background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) 40%, transparent 60%)', filter: 'blur(50px)', opacity: rayOpacity, zIndex: 1 }} />

      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div key={i} initial={{ y: '110vh', x: `${Math.random() * 100}vw` }} animate={{ y: '-10vh' }} transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }} style={{ position: 'fixed', width: '6px', height: '6px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', zIndex: 2 }} />
      ))}
      
      {/* HUD */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', padding: isMobile ? '10px' : '20px', backgroundColor: 'rgba(0, 8, 20, 0.95)', borderBottom: '1px solid rgba(0, 212, 255, 0.2)' }}>
        <Link href="/" style={{ color: '#00d4ff', textDecoration: 'none', border: '1px solid #00d4ff', padding: '8px 15px', fontSize: isMobile ? '0.7rem' : '0.9rem' }}>← ABORT</Link>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: isMobile ? '1rem' : '1.5rem' }}>{currentDepth}m</h2>
          <p style={{ margin: 0, color: '#ff0055', fontSize: '0.7rem' }}>SCORE: {score}</p>
        </div>
      </div>
      
      {/* INTRO */}
      <motion.div style={{ position: 'absolute', top: '400px', width: '100%', textAlign: 'center', opacity: introOpacity }}>
        <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', color: '#fff', textShadow: '0 0 20px #00d4ff' }}>BEGIN DESCENT</h1>
        <p style={{ color: '#bde0fe', padding: '0 20px' }}>Verify pollutants to dive deeper.</p>
      </motion.div>
        
      {/* RESPONSIVE CARDS */}
      {trashItems.map((item, index) => {
        const isVerified = verifiedIds.includes(item.id);
        const isCurrentTarget = nextLockedItem && nextLockedItem.id === item.id;
        if (!isVerified && !isCurrentTarget && index > lockedIndex) return null;

        return (
          <div key={item.id}>
            <motion.div style={{ 
              position: 'absolute', 
              top: `${(index + 1) * 1200}px`, 
              left: '50%', 
              transform: 'translateX(-50%)', 
              border: `1px solid ${isVerified ? '#00ffaa' : '#00d4ff'}`, 
              padding: isMobile ? '15px' : '30px', 
              width: '85%', 
              maxWidth: '450px', 
              backgroundColor: 'rgba(0, 10, 20, 0.9)', 
              zIndex: 20, 
              opacity: currentDepth > (index * 1200) - 400 ? 1 : 0 
            }}>
              <h3 style={{ color: isVerified ? '#00ffaa' : '#fff', textAlign: 'center', fontSize: isMobile ? '1rem' : '1.4rem' }}>
                {isVerified ? `[CLEARED]` : ''} {item.item_name}
              </h3>
              {item.image_url && <img src={item.image_url} alt={item.item_name} style={{ width: '100%', height: isMobile ? '140px' : '220px', objectFit: 'contain', mixBlendMode: 'screen', margin: '10px 0' }} />}
              <p style={{ color: '#bde0fe', fontSize: isMobile ? '0.75rem' : '0.9rem', borderTop: '1px solid rgba(0,212,255,0.1)', paddingTop: '10px', lineHeight: '1.4' }}>{item.impact_fact}</p>
              
              {isCurrentTarget && <VerifyButton itemId={item.id} onVerifySuccess={handleVerify} />}
            </motion.div>

            {/* ANIMALS */}
            <AnimatePresence>
              {isVerified && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: ['Sperm Whale', 'Sunken Cargo Container'].includes(item.animal_name) ? (isMobile ? 1.8 : 2.5) : 1,
                    x: isSwimmer(item.animal_name) ? ['-40vw', '140vw'] : (index % 2 === 0 ? ['-2vw', '2vw', '-2vw'] : ['2vw', '-2vw', '2vw']),
                    y: [0, -25, 10, -15, 0] 
                  }}
                  transition={{
                    x: { duration: isSwimmer(item.animal_name) ? (item.animal_name === 'Sperm Whale' ? 45 : 25) : 5, repeat: Infinity, ease: isSwimmer(item.animal_name) ? "linear" : "easeInOut" },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{ position: 'absolute', top: `${(index + 1) * 1200 + 150}px`, left: isSwimmer(item.animal_name) ? '0' : (index % 2 === 0 ? '5%' : 'auto'), right: isSwimmer(item.animal_name) ? 'auto' : (index % 2 !== 0 ? '5%' : 'auto'), width: isMobile ? '140px' : '200px', zIndex: 5, pointerEvents: 'none' }}
                >
                  <img src={item.animal_image_url} alt={item.animal_name} style={{ width: '100%', filter: 'drop-shadow(0 0 8px rgba(0, 255, 170, 0.2))', transform: isSwimmer(item.animal_name) ? 'scaleX(-1)' : 'none' }} />
                  <p style={{ color: '#00ffaa', fontSize: '0.6rem', marginTop: '5px', textAlign: 'center' }}>{item.animal_name}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.main>
  );
}