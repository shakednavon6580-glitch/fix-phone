import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthContext } from '../contexts/AuthContext';
import { trpc } from '../lib/trpc';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthContext();
  const [, setLocation] = useLocation();

  const localLoginMutation = trpc.auth.localLogin.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Try local authentication first (for testing)
      try {
        const localResult = await localLoginMutation.mutateAsync({
          username,
          password,
        });

        if (localResult.success) {
          login({
            userId: localResult.userId!,
            username: localResult.username!,
            role: localResult.role!,
          });

          // Redirect based on role
          if (localResult.role === 'admin') {
            setLocation('/dashboard/admin');
          } else {
            setLocation('/dashboard/user');
          }
          return;
        } else {
          setError(localResult.message || 'שם משתמש או סיסמה שגויים');
          setIsLoading(false);
          return;
        }
      } catch (localError) {
        console.log('Local auth not available, trying n8n webhook...');
      }

      // Fallback to n8n webhook
      const response = await fetch('https://barperezpersonal.app.n8n.cloud/webhook/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('התחברות נכשלה');
      }

      const data = await response.json();

      if (data.success) {
        login({
          userId: data.userId || data.user_id || username,
          username: data.username || username,
          role: data.role || 'user',
        });

        if (data.role === 'admin') {
          setLocation('/dashboard/admin');
        } else {
          setLocation('/dashboard/user');
        }
      } else {
        setError(data.message || 'שם משתמש או סיסמה שגויים');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('שגיאה בהתחברות. אנא נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div 
          className="glass-card p-8 rounded-2xl"
          style={{
            background: 'rgba(33, 23, 49, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(79, 70, 229, 0.2)',
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/logo.png" 
              alt="Fix Phone" 
              className="h-16 w-auto"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2 text-gradient-primary">
            התחברות
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            היכנס לחשבון שלך
          </p>

          {/* Error Message */}
          {error && (
            <div 
              className="mb-6 p-4 rounded-lg text-center"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
              }}
            >
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium mb-2 text-foreground"
              >
                שם משתמש
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-foreground"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(79, 70, 229, 0.6)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(79, 70, 229, 0.3)';
                }}
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2 text-foreground"
              >
                סיסמה
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-foreground"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(79, 70, 229, 0.6)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(79, 70, 229, 0.3)';
                }}
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300"
              style={{
                background: isLoading 
                  ? 'rgba(79, 70, 229, 0.5)' 
                  : 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(79, 70, 229, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isLoading ? 'מתחבר...' : 'התחבר'}
            </button>
          </form>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              חזרה לדף הבית
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
