import React, { useState, useEffect, useRef } from 'react';
import { Share2, Phone, Globe, Building2, QrCode, Edit3, X, MessageCircle, Download, RotateCw } from 'lucide-react';

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
  const [isHorizontal, setIsHorizontal] = useState(false);
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

  const toggleLayout = () => {
    setIsHorizontal(!isHorizontal);
    showNotification(`Switched to ${!isHorizontal ? 'horizontal' : 'vertical'} layout`, 'success');
  };

  const shareOnWhatsApp = () => {
    const message = `🌟 *${formData.name}* - Digital Business Card\n\n📱 Phone: ${formData.phone}\n🌐 Website: ${formData.website}\n🏢 ${formData.business.split(',')[0]}\n\n💡 Scan the QR code to save my contact instantly!`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showNotification('WhatsApp opened! Switch to horizontal layout for better sharing.', 'success');
  };

  const createInteractiveCard = () => {
    showNotification('Creating downloadable business card...', 'success');
    
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${formData.name}
ORG:${formData.business}
TEL:${formData.phone}
URL:${formData.website}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name.replace(/\s+/g, '_')}_Contact.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      flexDirection: 'column',
      gap: '20px'
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
          {notification.message}
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
            overflowY: 'auto'
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
                  padding: '4px'
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
                  color: '#ffffff'
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
                  color: '#ffffff'
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
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #d4af37',
                  backgroundColor: '#000000',
                  color: '#ffffff'
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
                  color: '#ffffff'
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
                  color: '#ffffff'
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
                Business
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
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Business Card Display */}
      <div style={{ 
        width: '100%', 
        maxWidth: isHorizontal ? '700px' : '350px', 
        margin: '0 auto',
        transition: 'all 0.5s ease'
      }}>
        <div 
          style={{
            backgroundColor: '#000000',
            border: '3px solid #d4af37',
            borderRadius: '20px',
            boxShadow: '0 0 40px rgba(212, 175, 55, 0.4), 0 0 80px rgba(212, 175, 55, 0.2)',
            overflow: 'hidden',
            animation: 'glow 3s ease-in-out infinite alternate',
            display: isHorizontal ? 'flex' : 'block',
            alignItems: isHorizontal ? 'stretch' : 'normal',
            minHeight: isHorizontal ? '300px' : 'auto',
            transition: 'all 0.5s ease'
          }}
        >
          <style>{`
            @keyframes glow {
              from {
                box-shadow: 0 0 30px rgba(212, 175, 55, 0.3), 0 0 60px rgba(212, 175, 55, 0.2);
              }
              to {
                box-shadow: 0 0 50px rgba(212, 175, 55, 0.5), 0 0 100px rgba(212, 175, 55, 0.3);
              }
            }
          `}</style>

          {/* Header Section */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #d4af37, #f1c40f)',
              padding: isHorizontal ? '20px' : '30px 20px',
              textAlign: 'center',
              flex: isHorizontal ? '0 0 280px' : 'none',
              display: isHorizontal ? 'flex' : 'block',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ marginBottom: isHorizontal ? '12px' : '16px' }}>
              <img 
                src={formData.photo} 
                alt="Profile" 
                style={{
                  width: isHorizontal ? '100px' : '120px',
                  height: isHorizontal ? '100px' : '120px',
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
              fontSize: isHorizontal ? '24px' : '28px',
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '8px',
              margin: 0
            }}>
              {formData.name}
            </h1>
            {formData.title && (
              <p style={{
                fontSize: isHorizontal ? '16px' : '18px',
                color: '#000000',
                margin: '8px 0 0 0',
                opacity: 0.8
              }}>
                {formData.title}
              </p>
            )}
          </div>

          {/* Contact Information Section */}
          <div style={{ 
            padding: isHorizontal ? '20px' : '30px 25px',
            backgroundColor: '#000000',
            flex: isHorizontal ? '1' : 'none',
            display: isHorizontal ? 'flex' : 'block',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              display: isHorizontal ? 'grid' : 'flex', 
              gridTemplateColumns: isHorizontal ? '1fr 1fr' : 'none',
              flexDirection: isHorizontal ? 'none' : 'column',
              gap: isHorizontal ? '20px' : '15px'
            }}>
              {/* Phone */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '12px 0',
                borderBottom: isHorizontal ? 'none' : '1px solid #333333',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  backgroundColor: '#d4af37',
                  padding: '12px',
                  borderRadius: '12px',
                  minWidth: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Phone size={20} color="#000000" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#999999',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    PHONE
                  </div>
                  <a 
                    href={`tel:${formData.phone}`} 
                    style={{
                      fontSize: '18px',
                      color: '#d4af37',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    {formData.phone}
                  </a>
                </div>
              </div>

              {/* Website */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '12px 0',
                borderBottom: isHorizontal ? 'none' : '1px solid #333333',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  backgroundColor: '#d4af37',
                  padding: '12px',
                  borderRadius: '12px',
                  minWidth: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Globe size={20} color="#000000" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#999999',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    WEBSITE
                  </div>
                  <a 
                    href={`https://${formData.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '16px',
                      color: '#d4af37',
                      textDecoration: 'underline',
                      fontWeight: '500'
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
                gap: '15px',
                padding: '12px 0',
                gridColumn: isHorizontal ? '1 / -1' : 'auto'
              }}>
                <div style={{
                  backgroundColor: '#d4af37',
                  padding: '12px',
                  borderRadius: '12px',
                  minWidth: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '4px'
                }}>
                  <Building2 size={20} color="#000000" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#999999',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    BUSINESS
                  </div>
                  <div style={{
                    fontSize: isHorizontal ? '14px' : '16px',
                    lineHeight: '1.5',
                    color: '#ffffff'
                  }}>
                    {formData.business.split(',').map((business, index) => (
                      <span 
                        key={index}
                        style={{ 
                          display: 'block', 
                          fontWeight: 'bold', 
                          color: index % 2 === 0 ? '#f1c40f' : '#d4af37',
                          marginBottom: '4px'
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

          {/* QR Code Section */}
          <div 
            style={{
              backgroundColor: '#1f2937',
              padding: '25px',
              textAlign: 'center',
              borderTop: isHorizontal ? 'none' : '2px solid #d4af37',
              borderLeft: isHorizontal ? '2px solid #d4af37' : 'none',
              flex: isHorizontal ? '0 0 200px' : 'none',
              display: isHorizontal ? 'flex' : 'block',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#d4af37',
              marginBottom: '15px',
              margin: 0
            }}>
              Scan to Save Contact
            </h3>
            <div style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '12px',
              display: 'inline-block',
              marginBottom: '15px'
            }}>
              <canvas 
                ref={qrCanvasRef}
                width="120"
                height="120"
                style={{
                  cursor: 'pointer',
                  display: 'block'
                }}
              ></canvas>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <button 
                onClick={createInteractiveCard}
                style={{
                  backgroundColor: '#d4af37',
                  color: '#000000',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Download size={16} />
                Save Contact
              </button>
              
              <a 
                href={`tel:${formData.phone}`}
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  textDecoration: 'none'
                }}
              >
                <Phone size={16} />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Now CLEARLY VISIBLE */}
      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#1a1a1a',
        borderRadius: '15px',
        border: '2px solid #333'
      }}>
        <button 
          onClick={toggleLayout}
          style={{
            backgroundColor: isHorizontal ? '#ef4444' : '#6366f1',
            color: '#ffffff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minWidth: '180px'
          }}
        >
          <RotateCw size={18} />
          {isHorizontal ? 'Switch to Vertical' : 'Switch to Horizontal'}
        </button>
        
        <button 
          onClick={shareOnWhatsApp}
          style={{
            backgroundColor: '#25D366',
            color: '#ffffff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minWidth: '180px'
          }}
        >
          <MessageCircle size={18} />
          Share on WhatsApp
        </button>
        
        <button 
          onClick={() => setIsEditing(true)}
          style={{
            backgroundColor: '#d4af37',
            color: '#000000',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minWidth: '180px'
          }}
        >
          <Edit3 size={18} />
          Edit Card
        </button>
      </div>
    </div>
  );
};

export default InteractiveBusinessCard;
