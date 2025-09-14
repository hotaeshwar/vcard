import React, { useState, useEffect, useRef } from 'react';
import { Share2, Phone, Globe, Building2, QrCode, Edit3, X, MessageCircle, Download } from 'lucide-react';

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
    
    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw QR code pattern
    ctx.fillStyle = '#d4af37';
    const cellSize = canvas.width / 12;
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 12; j++) {
        if ((i + j) % 3 === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
    
    // Add corner squares
    const cornerSize = cellSize * 3;
    ctx.fillRect(0, 0, cornerSize, cornerSize);
    ctx.fillRect(canvas.width - cornerSize, 0, cornerSize, cornerSize);
    ctx.fillRect(0, canvas.height - cornerSize, cornerSize, cornerSize);
    
    ctx.fillStyle = 'white';
    const innerSize = cellSize;
    ctx.fillRect(innerSize, innerSize, innerSize, innerSize);
    ctx.fillRect(canvas.width - cornerSize + innerSize, innerSize, innerSize, innerSize);
    ctx.fillRect(innerSize, canvas.height - cornerSize + innerSize, innerSize, innerSize);
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
      padding: ${isHorizontal ? '8px' : '12px'};
    }
    .business-card {
      background: #000000;
      border: 2px solid #d4af37;
      border-radius: ${isHorizontal ? '12px' : '16px'};
      box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
      overflow: hidden;
      width: 100%;
      max-width: ${isHorizontal ? '600px' : '300px'};
      max-height: ${isHorizontal ? '350px' : '450px'};
      ${isHorizontal ? 'display: flex; align-items: stretch;' : ''}
    }
    .header {
      background: linear-gradient(135deg, #d4af37, #f1c40f);
      padding: ${isHorizontal ? '15px' : '20px'};
      text-align: center;
      ${isHorizontal ? 'flex: 0 0 200px; display: flex; flex-direction: column; justify-content: center;' : ''}
    }
    .photo {
      width: ${isHorizontal ? '70px' : '80px'};
      height: ${isHorizontal ? '70px' : '80px'};
      border-radius: 50%;
      margin: 0 auto ${isHorizontal ? '8px' : '12px'};
      border: 3px solid #000000;
      object-fit: cover;
      display: block;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    .name {
      font-size: ${isHorizontal ? '16px' : '18px'};
      font-weight: bold;
      color: #000000;
      margin-bottom: 4px;
      line-height: 1.2;
    }
    .title {
      color: #000000;
      font-size: ${isHorizontal ? '12px' : '13px'};
      opacity: 0.8;
      line-height: 1.2;
    }
    .content {
      padding: ${isHorizontal ? '12px 15px' : '16px'};
      background: #000000;
      ${isHorizontal ? 'flex: 1; display: flex; flex-direction: column; justify-content: center;' : ''}
    }
    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: ${isHorizontal ? '6px 0' : '8px 0'};
      transition: all 0.3s ease;
      ${isHorizontal ? '' : 'border-bottom: 1px solid #333333;'}
    }
    .contact-item:last-child { border-bottom: none; }
    .contact-item:hover {
      background-color: #1a1a1a;
      padding-left: 6px;
      border-radius: 6px;
    }
    .icon {
      background: linear-gradient(135deg, #d4af37, #f1c40f);
      color: #000000;
      padding: ${isHorizontal ? '5px' : '6px'};
      border-radius: 6px;
      min-width: ${isHorizontal ? '24px' : '28px'};
      height: ${isHorizontal ? '24px' : '28px'};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .contact-info {
      flex: 1;
      min-width: 0;
    }
    .contact-label {
      font-size: ${isHorizontal ? '9px' : '10px'};
      color: #999999;
      margin-bottom: 2px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .contact-value {
      color: #d4af37;
      font-size: ${isHorizontal ? '11px' : '12px'};
      font-weight: 500;
      text-decoration: none;
      line-height: 1.3;
      word-break: break-word;
    }
    .contact-value:hover { color: #f1c40f; }
    .business-text {
      color: #ffffff;
      font-size: ${isHorizontal ? '10px' : '11px'};
      line-height: 1.3;
      word-break: break-word;
    }
    .qr-section {
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
      padding: ${isHorizontal ? '12px' : '16px'};
      text-align: center;
      border-top: ${isHorizontal ? 'none' : '2px solid #d4af37'};
      ${isHorizontal ? 'border-left: 2px solid #d4af37; flex: 0 0 140px; display: flex; flex-direction: column; justify-content: center;' : ''}
    }
    .qr-title {
      font-size: ${isHorizontal ? '10px' : '12px'};
      font-weight: bold;
      color: #d4af37;
      margin-bottom: ${isHorizontal ? '6px' : '10px'};
    }
    .qr-container {
      background: white;
      padding: ${isHorizontal ? '6px' : '10px'};
      border-radius: ${isHorizontal ? '6px' : '8px'};
      display: inline-block;
      margin-bottom: ${isHorizontal ? '6px' : '10px'};
    }
    .action-buttons {
      ${isHorizontal ? 'display: flex; flex-direction: column; gap: 4px;' : 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px;'}
    }
    .btn {
      background: linear-gradient(135deg, #d4af37, #f1c40f);
      color: #000000;
      border: none;
      padding: ${isHorizontal ? '4px 6px' : '8px 12px'};
      border-radius: 4px;
      font-weight: bold;
      font-size: ${isHorizontal ? '9px' : '11px'};
      cursor: pointer;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
      white-space: nowrap;
    }
    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(212, 175, 55, 0.4);
    }
    .footer {
      text-align: center;
      padding: ${isHorizontal ? '8px' : '10px'};
      font-size: ${isHorizontal ? '8px' : '10px'};
      color: #999999;
      background: #000000;
      ${isHorizontal ? 'position: absolute; bottom: 0; left: 0; right: 0;' : ''}
    }
    ${isHorizontal ? '.business-card { position: relative; }' : ''}
    
    @media (max-width: 768px) {
      .business-card { 
        ${isHorizontal ? 'flex-direction: column; max-width: 300px; max-height: none;' : 'max-width: 280px;'} 
      }
      .header { ${isHorizontal ? 'flex: none; padding: 16px;' : 'padding: 16px;'} }
      .content { ${isHorizontal ? 'flex: none; padding: 12px;' : 'padding: 12px;'} }
      .qr-section { ${isHorizontal ? 'flex: none; border-left: none; border-top: 2px solid #d4af37; padding: 12px;' : ''} }
      .action-buttons { ${isHorizontal ? 'display: grid; grid-template-columns: 1fr 1fr; gap: 6px;' : ''} }
      .photo { width: 60px; height: 60px; }
      .name { font-size: 14px; }
      .title { font-size: 11px; }
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
            <svg class="lucide-icon" width="14" height="14" viewBox="0 0 24 24">
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
            <svg class="lucide-icon" width="14" height="14" viewBox="0 0 24 24">
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
        
        <div class="contact-item">
          <div class="icon">
            <svg class="lucide-icon" width="14" height="14" viewBox="0 0 24 24">
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
    
    <div class="qr-section">
      <div class="qr-title">Scan to Save</div>
      <div class="qr-container">
        <canvas id="qr-code" width="${isHorizontal ? '70' : '80'}" height="${isHorizontal ? '70' : '80'}"></canvas>
      </div>
      
      <div class="action-buttons">
        <button class="btn" onclick="saveContact()">
          ${isHorizontal ? 'Save' : 'Save Contact'}
        </button>
        <a href="tel:${formData.phone}" class="btn">
          ${isHorizontal ? 'Call' : 'Call Now'}
        </a>
        ${isHorizontal ? '<a href="https://' + formData.website + '" target="_blank" class="btn">Visit</a>' : 
        '<a href="https://' + formData.website + '" target="_blank" class="btn" style="grid-column: 1 / -1;">Visit Website</a>'}
      </div>
    </div>
    
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
      showNotification(`${mode === 'horizontal' ? 'Horizontal' : 'Vertical'} business card created!`, 'success');

    } catch (err) {
      console.error('Error creating business card:', err);
      showNotification('Error creating business card', 'error');
    }
  };

  const shareOnWhatsApp = async () => {
    try {
      // First create and open the horizontal card
      await createInteractiveCard('horizontal');
      
      // Then prepare WhatsApp message
      const message = `🌟 *${formData.name}* - Digital Business Card\n\n📱 Phone: ${formData.phone}\n🌐 Website: ${formData.website}\n🏢 ${formData.business.split(',')[0]}\n\n💡 Scan the QR code to save my contact instantly!`;
      
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      
      // Small delay to ensure the card opens first
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        showNotification('WhatsApp share opened! Share the horizontal card.', 'success');
      }, 1000);
      
    } catch (err) {
      console.error('Error sharing on WhatsApp:', err);
      showNotification('Error sharing on WhatsApp', 'error');
    }
  };

  const downloadCard = async (mode) => {
    try {
      await createInteractiveCard(mode);
      showNotification(`${mode === 'horizontal' ? 'Horizontal' : 'Vertical'} card downloaded!`, 'success');
    } catch (err) {
      showNotification('Error downloading card', 'error');
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
                Edit Business Card
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
                Profile Photo
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
                Name
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
                Title
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
                Phone
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
                Website
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
                Business (comma separated)
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
      <div style={{ width: '100%', maxWidth: viewMode === 'horizontal' ? '600px' : '300px', margin: '0 auto' }}>
        <div 
          style={{
            backgroundColor: '#000000',
            border: '2px solid #d4af37',
            borderRadius: '16px',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.2)',
            overflow: 'hidden',
            animation: 'glow 2s ease-in-out infinite alternate',
            display: viewMode === 'horizontal' ? 'flex' : 'block',
            alignItems: viewMode === 'horizontal' ? 'stretch' : 'normal',
            maxHeight: viewMode === 'horizontal' ? '350px' : '450px'
          }}
        >
          <style>{`
            @keyframes glow {
              from {
                box-shadow: 0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.2);
              }
              to {
                box-shadow: 0 0 40px rgba(212, 175, 55, 0.5), 0 0 80px rgba(212, 175, 55, 0.3);
              }
            }
          `}</style>

          {/* Header Section */}
          <div 
            style={{
              background: 'linear-gradient(to right, #d4af37, #f1c40f)',
              padding: viewMode === 'horizontal' ? '15px' : '20px',
              textAlign: 'center',
              position: 'relative',
              flex: viewMode === 'horizontal' ? '0 0 200px' : 'none',
              display: viewMode === 'horizontal' ? 'flex' : 'block',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ marginBottom: viewMode === 'horizontal' ? '8px' : '12px' }}>
              <img 
                src={formData.photo} 
                alt="Profile" 
                style={{
                  width: viewMode === 'horizontal' ? '70px' : '80px',
                  height: viewMode === 'horizontal' ? '70px' : '80px',
                  borderRadius: '50%',
                  margin: '0 auto',
                  border: '3px solid #000000',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            <h1 style={{
              fontSize: viewMode === 'horizontal' ? '16px' : '18px',
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '4px',
              margin: 0,
              lineHeight: 1.2
            }}>
              {formData.name}
            </h1>
            {formData.title && (
              <p style={{
                fontSize: viewMode === 'horizontal' ? '12px' : '13px',
                color: '#000000',
                margin: '4px 0 0 0',
                opacity: 0.8,
                lineHeight: 1.2
              }}>
                {formData.title}
              </p>
            )}
          </div>

          {/* Contact Information Section */}
          <div style={{ 
            padding: viewMode === 'horizontal' ? '12px 15px' : '16px',
            backgroundColor: '#000000',
            flex: viewMode === 'horizontal' ? '1' : 'none',
            display: viewMode === 'horizontal' ? 'flex' : 'block',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: viewMode === 'horizontal' ? '8px' : '10px'
            }}>
              {/* Phone */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: viewMode === 'horizontal' ? '6px 0' : '8px 0',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s ease',
                borderBottom: viewMode === 'horizontal' ? 'none' : '1px solid #333333'
              }}>
                <div style={{
                  backgroundColor: '#d4af37',
                  padding: viewMode === 'horizontal' ? '5px' : '6px',
                  borderRadius: '6px',
                  minWidth: viewMode === 'horizontal' ? '24px' : '28px',
                  height: viewMode === 'horizontal' ? '24px' : '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Phone size={viewMode === 'horizontal' ? 12 : 14} color="#000000" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: viewMode === 'horizontal' ? '9px' : '10px',
                    color: '#999999',
                    marginBottom: '2px',
                    textTransform: 'uppercase',
                    fontWeight: 600
                  }}>
                    Phone
                  </div>
                  <a 
                    href={`tel:${formData.phone}`} 
                    style={{
                      fontSize: viewMode === 'horizontal' ? '11px' : '12px',
                      color: '#d4af37',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      lineHeight: 1.3,
                      wordBreak: 'break-word'
                    }}
                  >
                    {formData.phone}
                  </a>
                </div>
              </div>

              {/* Website */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: viewMode === 'horizontal' ? '6px 0' : '8px 0',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s ease',
                borderBottom: viewMode === 'horizontal' ? 'none' : '1px solid #333333'
              }}>
                <div style={{
                  backgroundColor: '#d4af37',
                  padding: viewMode === 'horizontal' ? '5px' : '6px',
                  borderRadius: '6px',
                  minWidth: viewMode === 'horizontal' ? '24px' : '28px',
                  height: viewMode === 'horizontal' ? '24px' : '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Globe size={viewMode === 'horizontal' ? 12 : 14} color="#000000" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: viewMode === 'horizontal' ? '9px' : '10px',
                    color: '#999999',
                    marginBottom: '2px',
                    textTransform: 'uppercase',
                    fontWeight: 600
                  }}>
                    Website
                  </div>
                  <a 
                    href={`https://${formData.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      fontSize: viewMode === 'horizontal' ? '11px' : '12px',
                      color: '#d4af37',
                      textDecoration: 'underline',
                      transition: 'color 0.2s ease',
                      lineHeight: 1.3,
                      wordBreak: 'break-word'
                    }}
                  >
                    {formData.website}
                  </a>
                </div>
              </div>

              {/* Business */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: viewMode === 'horizontal' ? '6px 0' : '8px 0',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s ease'
              }}>
                <div style={{
                  backgroundColor: '#d4af37',
                  padding: viewMode === 'horizontal' ? '5px' : '6px',
                  borderRadius: '6px',
                  minWidth: viewMode === 'horizontal' ? '24px' : '28px',
                  height: viewMode === 'horizontal' ? '24px' : '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Building2 size={viewMode === 'horizontal' ? 12 : 14} color="#000000" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: viewMode === 'horizontal' ? '9px' : '10px',
                    color: '#999999',
                    marginBottom: '2px',
                    textTransform: 'uppercase',
                    fontWeight: 600
                  }}>
                    Business
                  </div>
                  <div style={{
                    fontSize: viewMode === 'horizontal' ? '10px' : '11px',
                    lineHeight: 1.3,
                    color: '#ffffff',
                    wordBreak: 'break-word'
                  }}>
                    {formData.business.split(',').map((business, index) => (
                      <span 
                        key={index}
                        style={{ 
                          display: 'block', 
                          fontWeight: 'bold', 
                          color: index % 2 === 0 ? '#f1c40f' : '#d4af37',
                          marginBottom: '1px'
                        }}
                      >
                        {business.trim()}
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
              padding: viewMode === 'horizontal' ? '12px' : '16px',
              textAlign: 'center',
              borderTop: viewMode === 'horizontal' ? 'none' : '2px solid #d4af37',
              borderLeft: viewMode === 'horizontal' ? '2px solid #d4af37' : 'none',
              flex: viewMode === 'horizontal' ? '0 0 140px' : 'none',
              display: viewMode === 'horizontal' ? 'flex' : 'block',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <h3 style={{
              fontSize: viewMode === 'horizontal' ? '10px' : '12px',
              fontWeight: 'bold',
              color: '#d4af37',
              marginBottom: viewMode === 'horizontal' ? '6px' : '10px',
              margin: 0
            }}>
              Scan to Save
            </h3>
            <div style={{
              backgroundColor: 'white',
              padding: viewMode === 'horizontal' ? '6px' : '10px',
              borderRadius: viewMode === 'horizontal' ? '6px' : '8px',
              display: 'inline-block',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              marginBottom: viewMode === 'horizontal' ? '6px' : '10px'
            }}>
              <canvas 
                ref={qrCanvasRef}
                style={{
                  width: viewMode === 'horizontal' ? '70px' : '80px',
                  height: viewMode === 'horizontal' ? '70px' : '80px',
                  cursor: 'pointer',
                  display: 'block'
                }}
              ></canvas>
            </div>
            
            <div style={{
              display: viewMode === 'horizontal' ? 'flex' : 'grid',
              gridTemplateColumns: viewMode === 'horizontal' ? 'none' : '1fr 1fr',
              flexDirection: viewMode === 'horizontal' ? 'column' : 'none',
              gap: viewMode === 'horizontal' ? '4px' : '8px'
            }}>
              <button 
                onClick={() => createInteractiveCard()}
                style={{
                  backgroundColor: '#d4af37',
                  color: '#000000',
                  border: 'none',
                  padding: viewMode === 'horizontal' ? '4px 6px' : '8px 12px',
                  borderRadius: '4px',
                  fontSize: viewMode === 'horizontal' ? '9px' : '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Share2 size={viewMode === 'horizontal' ? 12 : 14} />
                <span>{viewMode === 'horizontal' ? 'Share' : 'Share Card'}</span>
              </button>
              
              <button 
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  backgroundColor: isEditing ? '#ef4444' : '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: viewMode === 'horizontal' ? '4px 6px' : '8px 12px',
                  borderRadius: '4px',
                  fontSize: viewMode === 'horizontal' ? '9px' : '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  whiteSpace: 'nowrap'
                }}
              >
                {isEditing ? <X size={viewMode === 'horizontal' ? 12 : 14} /> : <Edit3 size={viewMode === 'horizontal' ? 12 : 14} />}
                <span>{isEditing ? 'Close' : 'Edit'}</span>
              </button>
              
              {viewMode === 'vertical' && (
                <a 
                  href={`https://${formData.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#d4af37',
                    color: '#000000',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    textDecoration: 'none',
                    gridColumn: '1 / -1'
                  }}
                >
                  <Globe size={14} />
                  <span>Visit Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
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
            onClick={() => downloadCard('horizontal')}
            style={{
              backgroundColor: '#6366f1',
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
            <Download size={16} />
            <span>Download Horizontal</span>
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
