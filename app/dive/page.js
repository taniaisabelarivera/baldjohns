'use client';
import { useState, useEffect } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import VerifyButton from '../../components/VerifyButton';

export default function DivePage() {
  const [trashItems, setTrashItems] = useState([]);
  const [verifiedIds, setVerifiedIds] = useState([]); 
  const [score, setScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 600);
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    document.body.style.backgroundColor = '#000814';
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollY } = useScroll();
  const [currentDepth, setCurrentDepth] = useState(0);

  const bgColor = useTransform(scrollY, [0, 4000, 12000], ['#0077b6', '#03045e', '#000000']);
  const introOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    return scrollY.on("change", (v) => setCurrentDepth(Math.round(v)));
  }, [scrollY]);

  useEffect(() => {
    fetch('/api/trash').then(res => res.json()).then(data => {
      setTrashItems(data.sort((a, b) => a.required_unlock_depth - b.required_unlock_depth));
    });
  }, []);

  const nextLockedItem = trashItems.find(item => !verifiedIds.includes(item.id));
  const lockedIndex = trashItems.findIndex(item => !verifiedIds.includes(item.id));
  const dynamicHeight = nextLockedItem ? (lockedIndex + 1) * 1200 + 1000 : 15000; 

  const handleVerify = (id) => {
    setVerifiedIds(prev => [...prev, id]); 
    setScore(prev => prev + 100);
  };

  const isSwimmer = (name) => !['Staghorn Coral', 'Sea Cucumber', 'Dungeness Crab'].includes(name);

  return (
    <motion.main style={{ backgroundColor: bgColor, color: '#00d4ff', height: `${dynamicHeight}px`, position: 'relative', overflowX: 'hidden', fontFamily: 'monospace' }}>
      
      {/* HUD */}
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: 'rgba(0, 8, 20, 0.9)', borderBottom: '1px solid #00d4ff33' }}>
        <Link href="/" style={{ color: '#00d4ff', border: '1px solid #00d4ff', padding: '5px 10px', textDecoration: 'none', fontSize: '0.8rem' }}>← ABORT</Link>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{currentDepth}m</h2>
          <p style={{ margin: 0, color: '#ff0055', fontSize: '0.7rem' }}>SCORE: {score}</p>
        </div>
      </div>
      
      <motion.div style={{ position: 'absolute', top: '400px', width: '100%', textAlign: 'center', opacity: introOpacity }}>
        <h1 style={{ fontSize: isMobile ? '2rem' : '3.5rem', color: '#fff' }}>BEGIN DESCENT</h1>
      </motion.div>
        
      {trashItems.map((item, index) => {
        const isVerified = verifiedIds.includes(item.id);
        const isCurrentTarget = nextLockedItem?.id === item.id;
        if (!isVerified && !isCurrentTarget && index > lockedIndex) return null;

        return (
          <div key={item.id}>
            {/* THE SLIM CARD */}
            <motion.div style={{ 
              position: 'absolute', top: `${(index + 1) * 1200}px`, left: '50%', transform: 'translateX(-50%)', 
              border: `1px solid ${isVerified ? '#00ffaa' : '#00d4ff'}`, padding: isMobile ? '12px' : '25px', 
              width: isMobile ? '92%' : '450px', backgroundColor: 'rgba(0, 10, 20, 0.85)', zIndex: 20 
            }}>
              <h3 style={{ textAlign: 'center', fontSize: isMobile ? '0.9rem' : '1.3rem', margin: '0 0 10px 0' }}>{item.item_name}</h3>
              {item.image_url && <img src={item.image_url} style={{ width: '100%', height: isMobile ? '110px' : '200px', objectFit: 'contain' }} />}
              <p style={{ fontSize: isMobile ? '0.7rem' : '0.9rem', opacity: 0.8 }}>{item.impact_fact}</p>
              {isCurrentTarget && <VerifyButton itemId={item.id} onVerifySuccess={handleVerify} />}
            </motion.div>

            {/* THE ANIMALS */}
            <AnimatePresence>
              {isVerified && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ 
                    opacity: 1, 
                    scale: item.animal_name === 'Sperm Whale' ? (isMobile ? 1.8 : 2.5) : 1,
                    x: isSwimmer(item.animal_name) ? ['-40vw', '140vw'] : ['-1vw', '1vw', '-1vw']
                  }}
                  transition={{ x: { duration: item.animal_name === 'Sperm Whale' ? 45 : 20, repeat: Infinity, ease: 'linear' } }}
                  style={{ position: 'absolute', top: `${(index + 1) * 1200 + 180}px`, width: '150px', zIndex: 5, pointerEvents: 'none' }}
                >
                  <img src={item.animal_image_url} style={{ width: '100%', filter: 'drop-shadow(0 0 10px #00ffaa44)' }} />
                  <p style={{ color: '#00ffaa', fontSize: '0.6rem', textAlign: 'center' }}>{item.animal_name}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.main>
  );
}