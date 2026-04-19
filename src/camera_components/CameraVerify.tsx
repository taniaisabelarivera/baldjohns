'use client';
import { useState, useEffect, useMemo } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import VerifyButton from '../../components/VerifyButton';

export default function DivePage() {
  const [trashItems, setTrashItems] = useState([]);
  const [verifiedIds, setVerifiedIds] = useState([]); 
  const [score, setScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  const [currentDepth, setCurrentDepth] = useState(0);

  useEffect(() => {
    setIsMobile(window.innerWidth < 600);
    document.body.style.backgroundColor = '#000814';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

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
        if (Array.isArray(data)) {
          setTrashItems(data.sort((a, b) => a.required_unlock_depth - b.required_unlock_depth));
        }
      } catch (error) { console.error("Sonar Failure:", error); }
    }
    fetchData();
  }, []);

  const nextLockedItem = trashItems.find(item => !verifiedIds.includes(item.id));
  const lockedIndex = trashItems.findIndex(item => !verifiedIds.includes(item.id));
  const dynamicHeight = nextLockedItem ? (lockedIndex + 1) * 1200 + 1000 : 15000; 

  // --- MEMOIZED BUBBLES ---
  // Using absolute positioning so they move WITH the scroll, not against it.
  const bubbles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 15 + 5,
      left: Math.random() * 100,
      top: Math.random() * 100, // Percentage of the total height
      duration: Math.random() * 20 + 10,
      delay: Math.random() * -20, // Start mid-animation
      depth: Math.random() * 4, // For blur depth
    }));
  }, []);

  const handleVerify = (id) => {
    setVerifiedIds(prev => [...prev, id]); 
    setScore(prev => prev + 100);
  };

  const isSwimmer = (name) => !['Staghorn Coral', 'Sea Cucumber', 'Abyssal Holothurian', 'Polychaete Worm', 'Dungeness Crab'].includes(name);

  return (
    <motion.main style={{ backgroundColor: bgColor, color: '#00d4ff', height: `${dynamicHeight}px`, minHeight: '100vh', fontFamily: 'monospace', position: 'relative', overflowX: 'hidden' }}>
      
      {/* SCENIC RAYS */}
      <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '600px', background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) 40%, transparent 60%)', filter: 'blur(50px)', opacity: rayOpacity, zIndex: 1, pointerEvents: 'none' }} />

      {/* --- REFINED BUBBLES --- */}
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          initial={{ y: `${b.top + 20}%`, opacity: 0 }}
          animate={{ 
            y: [`${b.top + 20}%`, `${b.top - 20}%`], 
            x: [0, 15, -15, 0], // Subtle side-to-side "wobble"
            opacity: [0, 0.4, 0.4, 0] 
          }}
          transition={{ 
            y: { duration: b.duration, repeat: Infinity, ease: "linear", delay: b.delay },
            x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: b.duration, repeat: Infinity, ease: "linear", delay: b.delay }
          }}
          style={{ 
            position: 'absolute', // Absolute makes them move with the water
            left: `${b.left}%`,
            width: `${b.size}px`, 
            height: `${b.size}px`, 
            borderRadius: '50%', 
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 70%)',
            border: '0.5px solid rgba(255,255,255,0.2)',
            boxShadow: '0 0 5px rgba(255,255,255,0.1)',
            filter: `blur(${b.depth}px)`,
            zIndex: 2, 
            pointerEvents: 'none' 
          }}
        />
      ))}
      
      {/* HUD */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', padding: isMobile ? '10px' : '20px', backgroundColor: 'rgba(0, 8, 20, 0.95)', borderBottom: '1px solid rgba(0, 212, 255, 0.2)' }}>
        <Link href="/" style={{ color: '#00d4ff', textDecoration: 'none', border: '1px solid #00d4ff', padding: '8px 15px', fontSize: isMobile ? '0.7rem' : '0.9rem' }}>← ABORT</Link>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: isMobile ? '1.1rem' : '1.5rem' }}>{currentDepth}m</h2>
          <p style={{ margin: 0, color: '#ff0055', fontSize: '0.7rem' }}>SCORE: {score}</p>
        </div>
      </div>
      
      {/* INTRO */}
      <motion.div style={{ position: 'absolute', top: '400px', width: '100%', textAlign: 'center', opacity: introOpacity }}>
        <h1 style={{ fontSize: isMobile ? '2.5rem' : '4rem', color: '#fff', textShadow: '0 0 20px #00d4ff', margin: 0 }}>BEGIN DESCENT</h1>
        <p style={{ color: '#bde0fe', fontSize: '1.1rem', marginTop: '10px' }}>Verify pollutants to dive deeper.</p>
        <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ marginTop: '40px', fontSize: '2.5rem', color: '#00d4ff' }}>↓</motion.div>
      </motion.div>
        
      {trashItems.map((item, index) => {
        const isVerified = verifiedIds.includes(item.id);
        const isCurrentTarget = nextLockedItem && nextLockedItem.id === item.id;
        if (!isVerified && !isCurrentTarget && index > lockedIndex) return null;

        const moveRightToLeft = index % 2 === 0; 
        const leftPoint = '-25vw';
        const rightPoint = '125vw';
        const xMovement = moveRightToLeft ? [rightPoint, leftPoint] : [leftPoint, rightPoint];
        const isTurtle = item.animal_name.toLowerCase().includes('turtle'); 

        let finalTransform = 'none';
        if (isSwimmer(item.animal_name)) {
          if (isTurtle) {
             finalTransform = moveRightToLeft ? 'scaleX(1)' : 'scaleX(-1)';
          } else {
             finalTransform = moveRightToLeft ? 'scaleX(-1)' : 'scaleX(1)';
          }
        }

        return (
          <div key={item.id}>
            <motion.div style={{ 
              position: 'absolute', top: `${(index + 1) * 1200}px`, left: '50%', transform: 'translateX(-50%)', 
              border: `1px solid ${isVerified ? '#00ffaa' : '#00d4ff'}`, padding: isMobile ? '12px' : '25px', 
              width: isMobile ? '90%' : '450px', backgroundColor: 'rgba(0, 10, 20, 0.95)', zIndex: 20, 
              opacity: currentDepth > (index * 1200) - 400 ? 1 : 0 
            }}>
              <h3 style={{ color: isVerified ? '#00ffaa' : '#fff', textAlign: 'center', margin: '0 0 10px 0' }}>
                {isVerified ? `[CLEARED]` : ''} {item.item_name}
              </h3>
              <img src={item.image_url} alt={item.item_name} style={{ width: '100%', height: isMobile ? '120px' : '200px', objectFit: 'contain' }} />
              <p style={{ color: '#bde0fe', fontSize: '0.85rem', borderTop: '1px solid rgba(0,212,255,0.1)', paddingTop: '10px' }}>{item.impact_fact}</p>
              {isCurrentTarget && <VerifyButton itemId={item.id} onVerifySuccess={handleVerify} />}
            </motion.div>

            <AnimatePresence>
              {isVerified && (
                <motion.div
                  initial={{ opacity: 0, x: xMovement[0] }}
                  animate={{ 
                    opacity: 1, 
                    x: isSwimmer(item.animal_name) ? xMovement : 0, 
                    y: [0, -12, 12, -6, 0] 
                  }}
                  transition={{
                    x: { duration: 18, repeat: Infinity, ease: "linear", delay: Math.random() * 2 },
                    y: { duration: 5, repeat: Infinity }
                  }}
                  style={{ 
                    position: 'absolute', 
                    top: `${(index + 1) * 1200 + 200}px`, 
                    width: isMobile ? '200px' : '260px', 
                    zIndex: 5,
                    transform: finalTransform 
                  }}
                >
                  <img src={item.animal_image_url} alt={item.animal_name} style={{ width: '100%', filter: 'none' }} />
                  <p style={{ color: '#00ffaa', fontSize: '0.8rem', textAlign: 'center', marginTop: '12px' }}>{item.animal_name}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.main>
  );
}