import { useAuthContext } from '../contexts/AuthContext';
import { useLocation } from 'wouter';

export default function UserDashboard() {
  const { user, logout } = useAuthContext();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation('/login');
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
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Fix Phone" 
              className="h-12 w-auto"
            />
          </a>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <span className="text-foreground">
              {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
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
              התנתק
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div 
            className="glass-card p-12 rounded-2xl text-center"
            style={{
              background: 'rgba(33, 23, 49, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(79, 70, 229, 0.2)',
            }}
          >
            <h1 className="text-5xl font-bold mb-6">
              <span className="text-gradient-primary">
                ברוך הבא, {user?.username}!
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              זהו לוח המחוונים האישי שלך
            </p>

            <div 
              className="inline-block px-6 py-3 rounded-lg"
              style={{
                background: 'rgba(79, 70, 229, 0.1)',
                border: '1px solid rgba(79, 70, 229, 0.3)',
              }}
            >
              <p className="text-foreground">
                <strong>תפקיד:</strong> {user?.role}
              </p>
            </div>

            {/* Quick Links */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="/"
                className="glass-card p-6 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(79, 70, 229, 0.1)',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(79, 70, 229, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 className="text-xl font-bold text-foreground mb-2">דף הבית</h3>
                <p className="text-sm text-muted-foreground">חזרה לדף הראשי</p>
              </a>

              <a
                href="/products"
                className="glass-card p-6 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(6, 182, 212, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 className="text-xl font-bold text-foreground mb-2">מוצרים</h3>
                <p className="text-sm text-muted-foreground">עיין בקטלוג המוצרים</p>
              </a>

              <a
                href="/repair-status"
                className="glass-card p-6 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(147, 51, 234, 0.1)',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(147, 51, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 className="text-xl font-bold text-foreground mb-2">מעקב תיקון</h3>
                <p className="text-sm text-muted-foreground">בדוק סטטוס תיקון</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
