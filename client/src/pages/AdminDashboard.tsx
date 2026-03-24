import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthContext } from '../contexts/AuthContext';
import { Send, LogOut, CheckCircle } from 'lucide-react';

interface Message {
  role: 'admin' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AdminDashboard() {
  const { user, logout } = useAuthContext();
  const [, setLocation] = useLocation();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [broadcastReady, setBroadcastReady] = useState(false);
  const [finalMessage, setFinalMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    
    // Add admin message to chat
    setMessages(prev => [...prev, {
      role: 'admin',
      content: userMessage,
      timestamp: new Date()
    }]);
    
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call n8n broadcast-chat webhook
      const response = await fetch('https://barperezpersonal.app.n8n.cloud/webhook/broadcast-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userId: user?.userId,
          username: user?.username,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Add AI response to chat
      if (data.response) {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: data.response,
          timestamp: new Date()
        }]);
      }

      // Check if broadcast is ready
      if (data.broadcastReady === true) {
        setBroadcastReady(true);
        setFinalMessage(data.finalMessage || data.response);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'שגיאה בשליחת ההודעה. אנא נסה שוב.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAndBroadcast = async () => {
    if (!finalMessage || isBroadcasting) return;

    setIsBroadcasting(true);

    try {
      // Call n8n broadcast-send webhook
      const response = await fetch('https://barperezpersonal.app.n8n.cloud/webhook/broadcast-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          finalMessage,
          userId: user?.userId,
          username: user?.username,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to broadcast message');
      }

      const data = await response.json();

      // Show success message
      setMessages(prev => [...prev, {
        role: 'ai',
        content: data.message || 'ההודעה נשלחה בהצלחה לכל המשתמשים! 🎉',
        timestamp: new Date()
      }]);

      // Clear chat and reset state
      setTimeout(() => {
        setMessages([]);
        setBroadcastReady(false);
        setFinalMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error broadcasting message:', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'שגיאה בשליחת ההודעה. אנא נסה שוב.',
        timestamp: new Date()
      }]);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav 
        className="glass-card border-b"
        style={{
          background: 'rgba(33, 23, 49, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(79, 70, 229, 0.2)',
        }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Fix Phone" 
                className="h-12 w-auto"
              />
            </a>
            <div>
              <h1 className="text-xl font-bold text-gradient-primary">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                {user?.username}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
          >
            <LogOut className="w-4 h-4" />
            התנתק
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Broadcast Message Creator Card */}
          <div 
            className="glass-card rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(33, 23, 49, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(79, 70, 229, 0.2)',
            }}
          >
            {/* Header */}
            <div 
              className="px-6 py-4 border-b"
              style={{
                borderBottom: '1px solid rgba(79, 70, 229, 0.2)',
              }}
            >
              <h2 className="text-2xl font-bold text-gradient-primary">
                Broadcast Message Creator
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                שתף פעולה עם ה-AI ליצירת הודעות broadcast מקצועיות
              </p>
            </div>

            {/* Messages Area */}
            <div 
              className="p-6 h-[500px] overflow-y-auto"
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
              }}
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-center">
                    התחל שיחה עם ה-AI ליצירת הודעת broadcast
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className="max-w-[80%] px-4 py-3 rounded-lg"
                        style={{
                          background: msg.role === 'admin' 
                            ? 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)'
                            : 'rgba(100, 100, 100, 0.3)',
                          color: '#ffffff',
                        }}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString('he-IL', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div 
              className="p-6 border-t"
              style={{
                borderTop: '1px solid rgba(79, 70, 229, 0.2)',
              }}
            >
              <div className="flex gap-3">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="הקלד הודעה..."
                  disabled={isLoading}
                  rows={3}
                  className="flex-1 px-4 py-3 rounded-lg text-foreground resize-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(79, 70, 229, 0.3)',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center gap-2"
                  style={{
                    background: isLoading || !inputMessage.trim()
                      ? 'rgba(79, 70, 229, 0.3)'
                      : 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                    cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Send className="w-5 h-5" />
                  {isLoading ? 'שולח...' : 'שלח'}
                </button>
              </div>

              {/* Approve & Broadcast Button */}
              {broadcastReady && (
                <div className="mt-4">
                  <button
                    onClick={handleApproveAndBroadcast}
                    disabled={isBroadcasting}
                    className="w-full px-6 py-4 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background: isBroadcasting
                        ? 'rgba(34, 197, 94, 0.5)'
                        : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      cursor: isBroadcasting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isBroadcasting) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(34, 197, 94, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.3)';
                    }}
                  >
                    <CheckCircle className="w-6 h-6" />
                    {isBroadcasting ? 'שולח...' : 'אשר ושלח Broadcast'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
