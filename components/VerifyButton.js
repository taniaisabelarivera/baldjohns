'use client';
import { useState, useRef } from 'react';

export default function VerifyButton({ itemId, onVerifySuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('targetId', itemId);

      const response = await fetch('/api/verify', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.verified) {
        onVerifySuccess(itemId);
      } else {
        alert("SCAN REJECTED: Object doesn't match known pollutant. Try closer!");
      }
    } catch (error) {
      alert("COMMS ERROR: Check sonar connection.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ width: '100%', marginTop: '10px' }}>
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />
      <button 
        onClick={() => fileInputRef.current.click()}
        disabled={isUploading}
        style={{ 
          width: '100%', padding: '15px', borderRadius: '8px',
          backgroundColor: isUploading ? '#111' : '#00ffaa', 
          color: '#000', fontWeight: 'bold', border: 'none',
          cursor: isUploading ? 'not-allowed' : 'pointer'
        }}
      >
        {isUploading ? 'AI ANALYZING...' : '📷 SCAN POLLUTANT'}
      </button>
    </div>
  );
}