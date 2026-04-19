'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#000814',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'monospace'
    }}>
      {/* --- BACKGROUND AMBIENCE --- */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at center, #023e8a 0%, #000814 70%)',
        opacity: 0.6,
        zIndex: 0
      }} />

      {/* --- HERO SECTION --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ zIndex: 10, textAlign: 'center', padding: '0 20px' }}
      >
        <h1 style={{ 
          color: '#fff', 
          fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
          textShadow: '0 0 20px #00d4ff',
          margin: '0 0 10px 0'
        }}>
          BALD JOHNS
        </h1>
        <p style={{ color: '#00d4ff', marginBottom: '40px', letterSpacing: '2px' }}>
          DEEP SEA CONSERVATION
        </p>

        <Link href="/dive">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px #00ffaa' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '20px 50px',
              fontSize: '1.5rem',
              backgroundColor: 'transparent',
              color: '#00ffaa',
              border: '2px solid #00ffaa',
              cursor: 'pointer',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              borderRadius: '4px',
              boxShadow: '0 0 15px rgba(0, 255, 170, 0.3)'
            }}
          >
            Start Descent
          </motion.button>
        </Link>
      </motion.div>

      {/* --- MINIMALIST UTILITY BAR (Admin/API) --- */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        zIndex: 10
      }}>
        <Link href="/admin" style={{ 
          color: 'rgba(255, 255, 255, 0.3)', 
          fontSize: '0.7rem', 
          textDecoration: 'none',
          textTransform: 'uppercase',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '4px 10px',
          borderRadius: '2px'
        }}>
          Terminal Admin
        </Link>
        <Link href="/api/trash" style={{ 
          color: 'rgba(255, 255, 255, 0.3)', 
          fontSize: '0.7rem', 
          textDecoration: 'none',
          textTransform: 'uppercase',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '4px 10px',
          borderRadius: '2px'
        }}>
          Sonar Data (API)
        </Link>
      </div>

      {/* --- BUBBLE PARTICLES --- */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [1000, -100], opacity: [0, 0.5, 0] }}
          transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: Math.random() * 5 }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}vw`,
            width: '2px', height: '2px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            zIndex: 1
          }}
        />
      ))}
    </main>
  );
}