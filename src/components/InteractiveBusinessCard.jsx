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
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw QR code pattern - BLACK
    ctx.fillStyle = '#000000';
    const cellSize = canvas.width / 12;
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 12; j++) {
        if ((i + j) % 3 === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
    
    // Add corner squares
    ctx.fillStyle = '#000000';
    const cornerSize = cellSize * 3;
    ctx.fillRect(0, 0, cornerSize, cornerSize);
    ctx.fillRect(canvas.width - cornerSize, 0, cornerSize, cornerSize);
    ctx.fillRect(0, canvas.height - cornerSize, cornerSize, cornerSize);
    
    ctx.fillStyle = '#ffffff';
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
    // Create a compact text version for sharing
    const businessList = formData.business.split(',').map(b => b.trim()).join('\n');
    const message = `*${formData.name}*\n${formData.title}\n\n📱 ${formData.phone}\n🌐 ${formData.website}\n\n🏢 *Businesses:*\n${businessList}`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showNotification('Compact business card shared!', 'success');
  };

  const createInteractiveCard = () => {
    showNotification('Creating downloadable business card...', 'success');
    
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${formData.name}
TITLE:${formData.title}
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
      padding: '16px',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {notification && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            zIndex: 50,
            backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            border: '2px solid #333',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '480px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#ffffff',
                margin: 0
              }}>
                Edit Business Card
              </h2>
              <button 
                onClick={() => setIsEditing(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Photo Upload */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              {/* Name Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              {/* Title Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              {/* Phone Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              {/* Website Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Website
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              {/* Business Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  Business (comma separated)
                </label>
                <textarea
                  value={formData.business}
                  onChange={(e) => handleInputChange('business', e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Card Display */}
      <div style={{ 
        width: '100%', 
        maxWidth: isHorizontal ? '700px' : '340px', 
        margin: '0 auto'
      }}>
        <div 
          style={{
            backgroundColor: '#000000',
            border: '2px solid #333',
            borderRadius: '16px',
            boxShadow: '0 20px 30px -10px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            display: isHorizontal ? 'flex' : 'block',
            alignItems: isHorizontal ? 'stretch' : 'normal'
          }}
        >
          {/* Header Section */}
          <div 
            style={{
              background: '#111111',
              padding: isHorizontal ? '16px' : '24px 16px',
              textAlign: 'center',
              flex: isHorizontal ? '0 0 260px' : 'none',
              display: isHorizontal ? 'flex' : 'block',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ marginBottom: isHorizontal ? '10px' : '14px' }}>
              <img 
                src={formData.photo} 
                alt="Profile" 
                style={{
                  width: isHorizontal ? '90px' : '100px',
                  height: isHorizontal ? '90px' : '100px',
                  borderRadius: '50%',
                  margin: '0 auto',
                  border: '3px solid #ffffff',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            <h1 style={{
              fontSize: isHorizontal ? '20px' : '22px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: 0
            }}>
              {formData.name}
            </h1>
            {formData.title && (
              <p style={{
                fontSize: isHorizontal ? '13px' : '14px',
                color: '#cccccc',
                margin: '6px 0 0 0'
              }}>
                {formData.title}
              </p>
            )}
          </div>

          {/* Contact Information Section */}
          <div style={{ 
            padding: isHorizontal ? '16px' : '20px 16px',
            backgroundColor: '#000000',
            flex: isHorizontal ? '1' : 'none'
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '12px'
            }}>
              {/* Phone */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  backgroundColor: '#1a1a1a',
                  padding: '8px',
                  borderRadius: '8px',
                  minWidth: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Phone size={16} color="#ffffff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    marginBottom: '2px',
                    textTransform: 'uppercase'
                  }}>
                    PHONE
                  </div>
                  <a 
                    href={`tel:${formData.phone}`} 
                    style={{
                      fontSize: '14px',
                      color: '#ffffff',
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
                gap: '12px'
              }}>
                <div style={{
                  backgroundColor: '#1a1a1a',
                  padding: '8px',
                  borderRadius: '8px',
                  minWidth: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Globe size={16} color="#ffffff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    marginBottom: '2px',
                    textTransform: 'uppercase'
                  }}>
                    WEBSITE
                  </div>
                  <a 
                    href={`https://${formData.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '13px',
                      color: '#ffffff',
                      textDecoration: 'none',
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
                gap: '12px'
              }}>
                <div style={{
                  backgroundColor: '#1a1a1a',
                  padding: '8px',
                  borderRadius: '8px',
                  minWidth: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px'
                }}>
                  <Building2 size={16} color="#ffffff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    marginBottom: '4px',
                    textTransform: 'uppercase'
                  }}>
                    BUSINESSES
                  </div>
                  <div style={{
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: '#ffffff'
                  }}>
                    {formData.business.split(',').map((business, index) => (
                      <div 
                        key={index}
                        style={{ 
                          color: '#ffffff',
                          marginBottom: '2px',
                          fontSize: '13px'
                        }}
                      >
                        • {business.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div 
            style={{
              backgroundColor: '#111111',
              padding: '16px',
              textAlign: 'center',
              borderTop: isHorizontal ? 'none' : '1px solid #333',
              borderLeft: isHorizontal ? '1px solid #333' : 'none',
              flex: isHorizontal ? '0 0 140px' : 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <h3 style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '10px',
              margin: '0 0 10px 0'
            }}>
              SCAN TO SAVE
            </h3>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '8px',
              borderRadius: '8px',
              display: 'inline-block',
              marginBottom: '10px'
            }}>
              <canvas 
                ref={qrCanvasRef}
                width="90"
                height="90"
                style={{
                  display: 'block'
                }}
              ></canvas>
            </div>
            
            <button 
              onClick={createInteractiveCard}
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '1px solid #333',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                width: '100%'
              }}
            >
              <Download size={12} />
              Save Contact
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: '#111111',
        borderRadius: '12px',
        border: '1px solid #333',
        maxWidth: '700px',
        width: '100%'
      }}>
        <button 
          onClick={toggleLayout}
          style={{
            backgroundColor: isHorizontal ? '#dc2626' : '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            flex: '1',
            minWidth: '140px'
          }}
        >
          <RotateCw size={16} />
          {isHorizontal ? 'Vertical' : 'Horizontal'}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            flex: '1',
            minWidth: '140px'
          }}
        >
          <MessageCircle size={16} />
          Share
        </button>
        
        <button 
          onClick={() => setIsEditing(true)}
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            border: '1px solid #333',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            flex: '1',
            minWidth: '140px'
          }}
        >
          <Edit3 size={16} />
          Edit
        </button>
      </div>
    </div>
  );
};

export default InteractiveBusinessCard;
