import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Wrench, Building2, Shield, Cloud, Users, ArrowLeft, Zap, CheckCircle2, Phone, MessageCircle, Monitor, Headset } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";

export default function Home() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/972XXXXXXXXX', '_blank'); // Replace with actual WhatsApp number
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+972XXXXXXXXX'; // Replace with actual phone number
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 glass-strong">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Fix Phone Logo" className="w-12 h-12 md:w-16 md:h-16" />
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-bold text-white">Fix Phone</span>
              </div>
              {/* Login Button for Desktop */}
              <Link href="/login" className="hidden md:block">
                <Button variant="ghost" className="hover-glow-primary ml-4" style={{backgroundColor: '#211731'}}>
                  התחבר
                </Button>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/repair-status">
                <Button variant="ghost" className="hover-glow-primary" style={{backgroundColor: '#211731'}}>
                  מעקב תיקון
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="ghost" className="hover-glow-primary" style={{backgroundColor: '#211731'}}>
                  מוצרים
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="ghost" className="hover-glow-primary" style={{backgroundColor: '#211731'}}>
                  פורום TECH
                </Button>
              </Link>
              <Link href="/it-services">
                <Button className="gradient-primary hover-glow-primary" style={{color: '#ffffff', backgroundColor: '#211731'}}>
                  שירותי IT לעסקים
                </Button>
              </Link>
              {/* Contact Buttons */}
              <Button 
                variant="outline" 
                size="icon"
                className="hover-glow-primary bg-green-500 hover:bg-green-600 border-green-500"
                onClick={handleWhatsAppClick}
                title="WhatsApp" style={{backgroundColor: '#0adb3f'}}
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="hover-glow-primary"
                onClick={handlePhoneClick}
                title="טלפון"
              >
                <Phone className="w-5 h-5" />
              </Button>
            </div>
            {/* Mobile Contact Buttons */}
            <div className="flex md:hidden items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                className="hover-glow-primary h-10 w-10 bg-green-500 hover:bg-green-600 border-green-500"
                onClick={handleWhatsAppClick}
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="hover-glow-primary h-10 w-10"
                onClick={handlePhoneClick}
                title="טלפון"
              >
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/hero-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background"></div>
        </div>
        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-in-right">
              <span className="text-gradient-primary">פתרונות טכנולוגיים</span>
            </h1>
            <p 
              className="text-3xl md:text-6xl lg:text-7xl font-black text-right mb-8 animate-slide-in-left"
              style={{
                fontFamily: 'Orbitron, Heebo, sans-serif',
                background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 50%, #9333EA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px rgba(79, 70, 229, 0.3)',
                letterSpacing: '0.02em',
                lineHeight: '1.2'
              }}
            >
              בית חדש לעולם ה TECH שלך
            </p>
          </div>

          {/* Dual Funnel Split */}
          <div className="flex flex-col gap-12 max-w-4xl mx-auto">
            {/* B2C Section - Private Customers */}
            <Card className="glass-card p-8 hover-glow-secondary transition-smooth group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 gradient-primary"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center animate-float">
                    <Smartphone className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">תיקון מכשירים ואביזרים</h2>
                    <p className="text-sm text-muted-foreground">ללקוחות פרטיים</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 group/item">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 group-hover/item:scale-110 transition-smooth" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">תיקון מהיר ומקצועי</h3>
                      <p className="text-sm text-muted-foreground">
                        תיקון מכשירים ניידים, טאבלטים ומחשבים ניידים תוך 24-48 שעות
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 group-hover/item:scale-110 transition-smooth" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">מעקב בזמן אמת</h3>
                      <p className="text-sm text-muted-foreground">
                        עקוב אחר סטטוס התיקון בכל רגע דרך הפורטל המקוון שלנו
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 group-hover/item:scale-110 transition-smooth" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">אביזרים ואיכות</h3>
                      <p className="text-sm text-muted-foreground">
                        מגוון אביזרים איכותיים למכשירים ניידים במחירים נוחים
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full gradient-primary hover-glow-primary" 
                    size="lg"
                    onClick={() => {
                      const choice = window.confirm('בחר את דרך הקשר:\n\nלחץ OK ל-WhatsApp\nלחץ ביטול לטלפון');
                      if (choice) {
                        window.open('https://wa.me/972XXXXXXXXX', '_blank');
                      } else {
                        window.location.href = 'tel:+972XXXXXXXXX';
                      }
                    }}
                  >
                    <MessageCircle className="ml-2 w-5 h-5" />
                    צור קשר
                  </Button>
                </div>
              </div>
            </Card>

            {/* Device Sales Section */}
            <Card className="glass-card p-8 hover-glow-secondary transition-smooth group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 gradient-accent"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
                    <Monitor className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">מכירת מכשירי טכנולוגיה</h2>
                    <p className="text-sm text-muted-foreground">מכשירים חדשים ומשומשים</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 group/item">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-1 group-hover/item:scale-110 transition-smooth" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">טלפונים ניידים</h3>
                      <p className="text-sm text-muted-foreground">
                        מגוון רחב של סמארטפונים חדשים ומשומשים מכל היצרנים המובילים במחירים תחרותיים
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-1 group-hover/item:scale-110 transition-smooth" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">מחשבים ניידים</h3>
                      <p className="text-sm text-muted-foreground">
                        לפטופים למשרד, גיימינג ושימוש יומיומי עם אחריות מלאה ותמיכה טכנית
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-1 group-hover/item:scale-110 transition-smooth" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">טאבלטים ואביזרים</h3>
                      <p className="text-sm text-muted-foreground">
                        טאבלטים לעבודה ובידור, אוזניות, שעונים חכמים ואביזרים נלווים
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/products">
                    <Button className="w-full gradient-accent hover-glow-secondary" size="lg">
                      <Smartphone className="ml-2 w-5 h-5" />
                      לקטלוג המוצרים
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* B2B Section - Business Customers */}
            <Card className="glass-card p-8 hover-glow-secondary transition-smooth group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 gradient-accent"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center animate-float" style={{ animationDelay: '1s', backgroundColor: '#131111' }}>
                    <Headset className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">שירותי IT מקצועיים</h2>
                    <p className="text-sm text-muted-foreground">לעסקים וארגונים</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 group/item">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-1 group-hover/item:scale-110 transition-smooth" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">ניהול IT מלא</h3>
                      <p className="text-sm text-muted-foreground">
                        ניהול תשתיות, תמיכה טכנית ותחזוקה שוטפת למערכות הארגון
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-1 group-hover/item:scale-110 transition-smooth" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">אבטחת מידע</h3>
                      <p className="text-sm text-muted-foreground">
                        הגנה מהדרגים אוטומטיים ואבטחת סייבר למערכות הארגון
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group/item">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-1 group-hover/item:scale-110 transition-smooth" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">פתרונות ענן</h3>
                      <p className="text-sm text-muted-foreground">
                        מעבר לענן, ניהול שרתים ופתרונות SaaS מותאמים
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/it-services">
                    <Button className="w-full gradient-accent hover-glow-secondary" size="lg">
                      <Building2 className="ml-2 w-5 h-5" />
                      קבלו ייעוץ חינם
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="py-20 relative" 
        style={{
          backgroundImage: 'url(/repair-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95"></div>
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gradient-primary">למה לבחור בנו?</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              שירות מקצועי, מהיר ואמין
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="glass-card p-6 hover-glow-primary transition-smooth text-center">
              <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">מהירות ביצוע</h3>
              <p className="text-muted-foreground">
                תיקונים רוב תוך 24-48 שעות עם שירות אקספרס זמין
              </p>
            </Card>

            <Card className="glass-card p-6 hover-glow-secondary transition-smooth text-center">
              <div className="w-16 h-16 rounded-xl gradient-accent flex items-center justify-center mx-auto mb-4">
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">אמינות ואחריות</h3>
              <p className="text-muted-foreground">
                אחריות מלאה על כל התיקונים וחלקי החילוף שלנו
              </p>
            </Card>

            <Card className="glass-card p-6 hover-glow-primary transition-smooth text-center">
              <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <Cloud className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">טכנולוגיה מתקדמת</h3>
              <p className="text-muted-foreground">
                ציוד ואבחון מתקדם לתיקון מדויק ואיכותי
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
