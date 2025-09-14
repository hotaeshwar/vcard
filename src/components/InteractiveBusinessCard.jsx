import React, { useState, useEffect, useRef } from 'react';
import { Share2, Phone, Globe, Building2, QrCode, Edit3, X, MessageCircle } from 'lucide-react';

const InteractiveBusinessCard = () => {
  const [formData, setFormData] = useState({
    name: 'Himanshu Khanegwal',
    title: 'Digital Business Consultant',
    phone: '+91 8054481253',
    website: 'www.buildingindiadigital.com',
    business: 'Building India Digital, Amey Marketing & Distribution, Madhav, Anant Traders, Arc Infra',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    socialMedia: {
      linkedin: '',
      twitter: '',
      instagram: '',
      facebook: '',
      youtube: '',
      whatsapp: ''
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState('vertical'); // 'vertical' or 'horizontal'
  const [notification, setNotification] = useState(null);
  const qrCanvasRef = useRef(null);

  const generateQRCode = () => {
    if (!qrCanvasRef.current) return;
    
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${formData.name}
ORG:${formData.business}
TEL:${formData.phone}
URL:${formData.website}
END:VCARD`;

    // Simple QR code simulation with canvas
    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 120, 120);
    
    // Draw a simple pattern to represent QR code
    ctx.fillStyle = '#d4af37';
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 12; j++) {
        if ((i + j) % 3 === 0) {
          ctx.fillRect(i * 10, j * 10, 8, 8);
        }
      }
    }
    
    // Add corner squares
    ctx.fillRect(0, 0, 30, 30);
    ctx.fillRect(90, 0, 30, 30);
    ctx.fillRect(0, 90, 30, 30);
    
    ctx.fillStyle = 'white';
    ctx.fillRect(5, 5, 20, 20);
    ctx.fillRect(95, 5, 20, 20);
    ctx.fillRect(5, 95, 20, 20);
  };

  useEffect(() => {
    generateQRCode();
  }, [formData]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, photo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const createInteractiveCard = async (mode = viewMode) => {
    try {
      showNotification(`Creating ${mode} business card...`, 'success');

      let photoBase64 = formData.photo;
      if (!formData.photo.startsWith('data:')) {
        photoBase64 = formData.photo;
      }

      const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${formData.name}
ORG:${formData.business}
TEL:${formData.phone}
URL:${formData.website}
END:VCARD`;

      const isHorizontal = mode === 'horizontal';
      
      const cardHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formData.name} - Digital Business Card</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .business-card {
      background: #000000;
      border: 3px solid #d4af37;
      border-radius: 20px;
      box-shadow: 0 0 40px rgba(212, 175, 55, 0.4), 0 0 80px rgba(212, 175, 55, 0.2);
      overflow: hidden;
      width: 100%;
      max-width: ${isHorizontal ? '800px' : '400px'};
      animation: glow 3s ease-in-out infinite alternate;
      ${isHorizontal ? 'display: flex; align-items: stretch;' : ''}
    }
    @keyframes glow {
      from { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.2); }
      to { box-shadow: 0 0 40px rgba(212, 175, 55, 0.5), 0 0 80px rgba(212, 175, 55, 0.3); }
    }
    .header {
      background: linear-gradient(135deg, #d4af37, #f1c40f);
      padding: 30px 20px;
      text-align: center;
      ${isHorizontal ? 'flex: 0 0 320px; display: flex; flex-direction: column; justify-content: center;' : ''}
    }
    .photo {
      width: ${isHorizontal ? '120px' : '100px'};
      height: ${isHorizontal ? '120px' : '100px'};
      border-radius: 50%;
      margin: 0 auto 15px;
      border: 4px solid #000000;
      object-fit: cover;
      display: block;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
    .name {
      font-size: ${isHorizontal ? '28px' : '24px'};
      font-weight: bold;
      color: #000000;
      margin-bottom: 8px;
    }
    .title {
      color: #000000;
      font-size: ${isHorizontal ? '18px' : '16px'};
      opacity: 0.8;
    }
    .content {
      padding: 25px 20px;
      background: #000000;
      ${isHorizontal ? 'flex: 1; display: flex; flex-direction: column; justify-content: space-between;' : ''}
    }
    .contact-section {
      ${isHorizontal ? 'display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;' : ''}
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: ${isHorizontal ? '12px 0' : '10px 0'};
      ${isHorizontal ? '' : 'border-bottom: 1px solid #333333;'}
      transition: all 0.3s ease;
    }
    .contact-item:last-child { border-bottom: none; }
    .contact-item:hover {
      background-color: #1a1a1a;
      padding-left: 8px;
      border-radius: 8px;
    }
    .icon {
      background: linear-gradient(135deg, #d4af37, #f1c40f);
      color: #000000;
      padding: 10px;
      border-radius: 10px;
      min-width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
    }
    .contact-info {
      flex: 1;
    }
    .contact-label {
      font-size: 12px;
      color: #999999;
      margin-bottom: 4px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .contact-value {
      color: #d4af37;
      font-size: ${isHorizontal ? '16px' : '14px'};
      font-weight: 500;
      text-decoration: none;
      line-height: 1.3;
    }
    .contact-value:hover { color: #f1c40f; }
    .business-text {
      color: #ffffff;
      font-size: ${isHorizontal ? '15px' : '13px'};
      line-height: 1.4;
    }
    .qr-section {
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
      padding: 20px;
      text-align: center;
      border-top: 2px solid #d4af37;
      ${isHorizontal ? 'border-top: none; border-left: 2px solid #d4af37; flex: 0 0 200px; display: flex; flex-direction: column; justify-content: center;' : ''}
    }
    .qr-title {
      font-size: 14px;
      font-weight: bold;
      color: #d4af37;
      margin-bottom: 15px;
    }
    .qr-container {
      background: white;
      padding: 15px;
      border-radius: 12px;
      display: inline-block;
      margin-bottom: 15px;
    }
    .action-buttons {
      ${isHorizontal ? 'display: flex; flex-direction: column; gap: 8px;' : 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;'}
    }
    .btn {
      background: linear-gradient(135deg, #d4af37, #f1c40f);
      color: #000000;
      border: none;
      padding: ${isHorizontal ? '8px 12px' : '10px 15px'};
      border-radius: 8px;
      font-weight: bold;
      font-size: ${isHorizontal ? '12px' : '13px'};
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #999999;
      background: #000000;
      ${isHorizontal ? 'position: absolute; bottom: 0; left: 0; right: 0;' : ''}
    }
    ${isHorizontal ? '.business-card { position: relative; }' : ''}
    @media (max-width: 768px) {
      .business-card { 
        ${isHorizontal ? 'flex-direction: column; max-width: 400px;' : 'max-width: 350px;'} 
      }
      .header { ${isHorizontal ? 'flex: none;' : ''} }
      .content { ${isHorizontal ? 'flex: none;' : 'padding: 20px 15px;'} }
      .contact-section { ${isHorizontal ? 'grid-template-columns: 1fr;' : ''} }
      .qr-section { ${isHorizontal ? 'flex: none; border-left: none; border-top: 2px solid #d4af37;' : ''} }
      .action-buttons { ${isHorizontal ? 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px;' : ''} }
    }
    .lucide-icon {
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  </style>
</head>
<body>
  <div class="business-card">
    <div class="header">
      <img src="${photoBase64}" alt="${formData.name}" class="photo">
      <div class="name">${formData.name}</div>
      ${formData.title ? `<div class="title">${formData.title}</div>` : ''}
    </div>
    
    <div class="content">
      <div class="contact-section">
        <div class="contact-item">
          <div class="icon">
            <svg class="lucide-icon" width="20" height="20" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div class="contact-info">
            <div class="contact-label">Phone</div>
            <a href="tel:${formData.phone}" class="contact-value">${formData.phone}</a>
          </div>
        </div>
        
        <div class="contact-item">
          <div class="icon">
            <svg class="lucide-icon" width="20" height="20" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="m4.93 6.93 14.14 14.14"/>
              <path d="M6.93 4.93 19.07 19.07"/>
            </svg>
          </div>
          <div class="contact-info">
            <div class="contact-label">Website</div>
            <a href="https://${formData.website}" target="_blank" class="contact-value">${formData.website}</a>
          </div>
        </div>
        
        <div class="contact-item" style="${isHorizontal ? 'grid-column: 1 / -1;' : ''}">
          <div class="icon">
            <svg class="lucide-icon" width="20" height="20" viewBox="0 0 24 24">
              <path d="M3 21h18"/>
              <path d="M5 21V7l8-4v18"/>
              <path d="M19 21V11l-6-4"/>
            </svg>
          </div>
          <div class="contact-info">
            <div class="contact-label">Business</div>
            <div class="business-text">${formData.business}</div>
          </div>
        </div>
      </div>
    </div>
    
    ${isHorizontal ? `
    <div class="qr-section">
      <div class="qr-title">Scan to Save</div>
      <div class="qr-container">
        <canvas id="qr-code" width="100" height="100"></canvas>
      </div>
      
      <div class="action-buttons">
        <button class="btn" onclick="saveContact()">
          Save Contact
        </button>
        <a href="tel:${formData.phone}" class="btn">
          Call Now
        </a>
        <a href="https://${formData.website}" target="_blank" class="btn">
          Visit Site
        </a>
      </div>
    </div>
    ` : `
    <div class="qr-section">
      <div class="qr-title">Scan to Save Contact</div>
      <div class="qr-container">
        <canvas id="qr-code" width="120" height="120"></canvas>
      </div>
      
      <div class="action-buttons">
        <button class="btn" onclick="saveContact()">
          <svg class="lucide-icon" width="16" height="16" viewBox="0 0 24 24" style="margin-right: 4px;">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Save Contact
        </button>
        <a href="tel:${formData.phone}" class="btn">
          <svg class="lucide-icon" width="16" height="16" viewBox="0 0 24 24" style="margin-right: 4px;">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Call Now
        </a>
        <a href="https://${formData.website}" target="_blank" class="btn" style="grid-column: 1 / -1;">
          <svg class="lucide-icon" width="16" height="16" viewBox="0 0 24 24" style="margin-right: 4px;">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="m4.93 6.93 14.14 14.14"/>
            <path d="M6.93 4.93 19.07 19.07"/>
          </svg>
          Visit Website
        </a>
      </div>
    </div>
    `}
    
    <div class="footer">
      Building India Digital
    </div>
  </div>

  <script>
    window.addEventListener('DOMContentLoaded', function() {
      const canvas = document.getElementById('qr-code');
      const ctx = canvas.getContext('2d');
      
      // Simple QR code pattern
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#d4af37';
      const cellSize = canvas.width / 12;
      for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {
          if ((i + j) % 3 === 0) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
          }
        }
      }
      
      // Corner squares
      const cornerSize = cellSize * 3;
      ctx.fillRect(0, 0, cornerSize, cornerSize);
      ctx.fillRect(canvas.width - cornerSize, 0, cornerSize, cornerSize);
      ctx.fillRect(0, canvas.height - cornerSize, cornerSize, cornerSize);
      
      ctx.fillStyle = 'white';
      const innerSize = cellSize;
      ctx.fillRect(innerSize, innerSize, innerSize, innerSize);
      ctx.fillRect(canvas.width - cornerSize + innerSize, innerSize, innerSize, innerSize);
      ctx.fillRect(innerSize, canvas.height - cornerSize + innerSize, innerSize, innerSize);
    });
    
    function saveContact() {
      const vCardData = \`${vCardData}\`;
      const blob = new Blob([vCardData], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '${formData.name.replace(/\s+/g, '_')}_Contact.vcf';
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;

      const blob = new Blob([cardHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      showNotification(`${mode === 'horizontal' ? 'Horizontal' : 'Vertical'} business card opened!`, 'success');

    } catch (err) {
      console.error('Error creating business card:', err);
      showNotification('Error creating business card', 'error');
    }
  };

  const shareOnWhatsApp = async () => {
    try {
      // Create the horizontal card for WhatsApp sharing
      await createInteractiveCard('horizontal');
      
      // Create WhatsApp message
      const message = `Check out my digital business card! 🌟\n\n👤 ${formData.name}\n📱 ${formData.phone}\n🌐 ${formData.website}\n🏢 ${formData.business.split(',')[0]}\n\nScan the QR code to save my contact instantly!`;
      
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      showNotification('WhatsApp share opened!', 'success');
    } catch (err) {
      console.error('Error sharing on WhatsApp:', err);
      showNotification('Error sharing on WhatsApp', 'error');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px'
    }}>
      {notification && (
        <div 
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            zIndex: 50,
            backgroundColor: notification.type === 'success' ? '#22c55e' : '#ef4444',
            transform: 'translateX(0)',
            transition: 'all 0.3s ease'
          }}
        >
          <span>{notification.message}</span>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#1f2937',
            border: '2px solid #d4af37',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#d4af37',
                margin: 0
              }}>
                <span>Edit Business Card</span>
              </h2>
              <button 
                onClick={() => setIsEditing(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#d4af37',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Photo Upload */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#d4af37',
                marginBottom: '8px'
              }}>
                <span>Profile Photo</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #d4af37',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
            </div>
            
            {/* Name Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#d4af37',
                marginBottom: '8px'
              }}>
                <span>Name</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #d4af37',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
            </div>
            
            {/* Title Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#d4af37',
                marginBottom: '8px'
              }}>
                <span>Title</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Digital Business Consultant"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #d4af37',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
            </div>
            
            {/* Phone Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#d4af37',
                marginBottom: '8px'
              }}>
                <span>Phone</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #d4af37',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
            </div>
            
            {/* Website Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#d4af37',
                marginBottom: '8px'
              }}>
                <span>Website</span>
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #d4af37',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
            </div>
            
            {/* Business Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#d4af37',
                marginBottom: '8px'
              }}>
                <span>Business (comma separated)</span>
              </label>
              <textarea
                value={formData.business}
                onChange={(e) => handleInputChange('business', e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #d4af37',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Business Card Display */}
      <div style={{ width: '100%', maxWidth: viewMode === 'horizontal' ? '800px' : '384px', margin: '0 auto' }}>
        <div 
          style={{
            backgroundColor: '#000000',
            border: '1px solid #d4af37',
            borderRadius: '16px',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            animation: 'glow 2s ease-in-out infinite alternate',
            display: viewMode === 'horizontal' ? 'flex' : 'block',
            alignItems: viewMode === 'horizontal' ? 'stretch' : 'normal'
          }}
        >
          <style>{`
            @keyframes glow {
              from {
                box-shadow: 0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              }
              to {
                box-shadow: 0 0 40px rgba(212, 175, 55, 0.5), 0 0 80px rgba(212, 175, 55, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              }
            }
          `}</style>

          {/* Header Section */}
          <div 
            style={{
              background: 'linear-gradient(to right, #d4af37, #f1c40f)',
              padding: '24px',
              textAlign: 'center',
              position: 'relative',
              flex: viewMode === 'horizontal' ? '0 0 320px' : 'none',
              display: viewMode === 'horizontal' ? 'flex' : 'block',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <img 
                src={formData.photo} 
                alt="Profile" 
                style={{
                  width: viewMode === 'horizontal' ? '120px' : '112px',
                  height: viewMode === 'horizontal' ? '120px' : '112px',
                  borderRadius: '50%',
                  margin: '0 auto',
                  border: '4px solid #000000',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            <h1 style={{
              fontSize: viewMode === 'horizontal' ? '28px' : '20px',
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '4px',
              margin: 0
            }}>
              <span>{formData.name}</span>
            </h1>
            {formData.title && (
              <p style={{
                fontSize: viewMode === 'horizontal' ? '18px' : '14px',
                color: '#000000',
                margin: '4px 0 0 0',
                opacity: 0.8
              }}>
                <span>{formData.title}</span>
              </p>
            )}
          </div>

          {/* Contact Information Section */}
          <div style={{ 
            padding: '24px',
            backgroundColor: '#000000',
            flex: viewMode === 'horizontal' ? '1' : 'none',
            display: viewMode === 'horizontal' ? 'flex' : 'block',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ 
              display: viewMode === 'horizontal' ? 'grid' : 'flex', 
              gridTemplateColumns: viewMode === 'horizontal' ? '1fr 1fr' : 'none',
              flexDirection: viewMode === 'horizontal' ? 'none' : 'column',
              gap: viewMode === 'horizontal' ? '20px' : '12px',
              marginBottom: viewMode === 'horizontal' ? '20px' : '0'
            }}>
              {/* Phone */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: viewMode === 'horizontal' ? '12px 0' : '8px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s ease',
                borderBottom: viewMode === 'horizontal' ? 'none' : '1px solid #333333'
              }}>
                <div style={{
                  backgroundColor: '#d4af37',
                  padding: viewMode === 'horizontal' ? '10px' : '8px',
                  borderRadius: viewMode === 'horizontal' ? '10px' : '8px'
                }}>
                  <Phone size={viewMode === 'horizontal' ? 20 : 16} color="#000000" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#999999',
                    marginBottom: '3px',
                    textTransform: 'uppercase'
                  }}>
                    <span>Phone</span>
                  </div>
                  <a 
                    href={`tel:${formData.phone}`} 
                    style={{
                      fontSize: viewMode === 'horizontal' ? '16px' : '16px',
                      color: '#d4af37',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    <span>{formData.phone}</span>
                  </a>
                </div>
              </div>

              {/* Website */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: viewMode === 'horizontal' ? '12px 0' : '8px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s ease',
                borderBottom: viewMode === 'horizontal' ? 'none' : '1px solid #333333'
              }}>
                <div style={{
                  backgroundColor: '#d4af37',
                  padding: viewMode === 'horizontal' ? '10px' : '8px',
                  borderRadius: viewMode === 'horizontal' ? '10px' : '8px'
                }}>
                  <Globe size={viewMode === 'horizontal' ? 20 : 16} color="#000000" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#999999',
                    marginBottom: '3px',
                    textTransform: 'uppercase'
                  }}>
                    <span>Website</span>
                  </div>
                  <a 
                    href={`https://${formData.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      fontSize: viewMode === 'horizontal' ? '16px' : '16px',
                      color: '#d4af37',
                      textDecoration: 'underline',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    <span>{formData.website}</span>
                  </a>
                </div>
              </div>

              {/* Business */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: viewMode === 'horizontal' ? '12px 0' : '8px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s ease',
                gridColumn: viewMode === 'horizontal' ? '1 / -1' : 'auto'
              }}>
                <div style={{
                  backgroundColor: '#d4af37',
                  padding: viewMode === 'horizontal' ? '10px' : '8px',
                  borderRadius: viewMode === 'horizontal' ? '10px' : '8px',
                  marginTop: '4px'
                }}>
                  <Building2 size={viewMode === 'horizontal' ? 20 : 16} color="#000000" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#999999',
                    marginBottom: '3px',
                    textTransform: 'uppercase'
                  }}>
                    <span>Business</span>
                  </div>
                  <div style={{
                    fontSize: viewMode === 'horizontal' ? '15px' : '14px',
                    lineHeight: '1.5'
                  }}>
                    {formData.business.split(',').map((business, index) => (
                      <span 
                        key={index}
                        style={{ 
                          display: 'block', 
                          fontWeight: 'bold', 
                          color: index % 2 === 0 ? '#f1c40f' : '#d4af37',
                          marginBottom: '2px'
                        }}
                      >
                        <span>{business.trim()}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code and Actions Section */}
          <div 
            style={{
              backgroundColor: '#1f2937',
              padding: '24px',
              textAlign: 'center',
              borderTop: viewMode === 'horizontal' ? 'none' : '1px solid #d4af37',
              borderLeft: viewMode === 'horizontal' ? '2px solid #d4af37' : 'none',
              flex: viewMode === 'horizontal' ? '0 0 200px' : 'none',
              display: viewMode === 'horizontal' ? 'flex' : 'block',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#d4af37',
              marginBottom: '12px',
              margin: 0
            }}>
              <span>Scan to Save</span>
            </h3>
            <div style={{
              backgroundColor: 'white',
              padding: '12px',
              borderRadius: '12px',
              display: 'inline-block',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              marginBottom: '16px'
            }}>
              <canvas 
                ref={qrCanvasRef}
                style={{
                  width: viewMode === 'horizontal' ? '100px' : '112px',
                  height: viewMode === 'horizontal' ? '100px' : '112px',
                  cursor: 'pointer',
                  display: 'block'
                }}
              ></canvas>
            </div>
            
            <div style={{
              display: viewMode === 'horizontal' ? 'flex' : 'grid',
              gridTemplateColumns: viewMode === 'horizontal' ? 'none' : '1fr 1fr',
              flexDirection: viewMode === 'horizontal' ? 'column' : 'none',
              gap: viewMode === 'horizontal' ? '8px' : '12px'
            }}>
              <button 
                onClick={() => createInteractiveCard()}
                style={{
                  backgroundColor: '#d4af37',
                  color: '#000000',
                  border: 'none',
                  padding: viewMode === 'horizontal' ? '8px 12px' : '12px 16px',
                  borderRadius: '8px',
                  fontSize: viewMode === 'horizontal' ? '12px' : '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Share2 size={16} />
                <span>Share Card</span>
              </button>
              
              <button 
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  backgroundColor: isEditing ? '#ef4444' : '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: viewMode === 'horizontal' ? '8px 12px' : '12px 16px',
                  borderRadius: '8px',
                  fontSize: viewMode === 'horizontal' ? '12px' : '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                <span>{isEditing ? 'Close' : 'Edit'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Layout Toggle and WhatsApp Share */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '16px',
          justifyContent: 'center'
        }}>
          <button 
            onClick={() => setViewMode(viewMode === 'vertical' ? 'horizontal' : 'vertical')}
            style={{
              backgroundColor: '#374151',
              color: '#d4af37',
              border: '1px solid #d4af37',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <QrCode size={16} />
            <span>{viewMode === 'vertical' ? 'Horizontal View' : 'Vertical View'}</span>
          </button>
          
          <button 
            onClick={shareOnWhatsApp}
            style={{
              backgroundColor: '#25D366',
              color: '#ffffff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <MessageCircle size={16} />
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveBusinessCard;
