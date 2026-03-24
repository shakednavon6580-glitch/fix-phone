import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/97236728841', '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:03-672-8841';
  };

  return (
    <footer className="pt-16 pb-8 border-t border-border/50 bg-background/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Fix Phone Logo" className="w-12 h-12" />
              <span className="text-xl font-bold text-gradient-primary">Fix Phone</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              פתרונות טכנולוגיים מתקדמים, תיקון מכשירים ניידים, שירותי IT לעסקים ומכירת ציוד קצה באיכות הגבוהה ביותר.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-foreground">ניווט מהיר</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer block">דף הבית</span>
                </Link>
              </li>

              <li>
                <Link href="/products">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer block">קטלוג מוצרים</span>
                </Link>
              </li>
              <li>
                <Link href="/it-services">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer block">שירותי IT לעסקים</span>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer block">פורום TECH</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-foreground">שירות לקוחות</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>רחוב יגאל אלון 94, תל אביב-יפו</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span dir="ltr">03-672-8841</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>fixphone.tlv.office@gmail.com</span>
              </li>
              <li>
                <Link href="/login">
                  <span className="text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer block mt-2">
                    התחבר לאזור אישי
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Working Hours & Actions */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-foreground">שעות פעילות</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p>א׳ - ה׳: 09:00 - 19:00</p>
                  <p>ו׳: 09:00 - 14:00</p>
                </div>
              </li>
            </ul>
            <div className="flex flex-col gap-3">
              <Button 
                variant="default" 
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                שלח הודעת WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handlePhoneClick}
              >
                <Phone className="w-4 h-4 ml-2" />
                חיוג מהיר
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex items-center justify-center">
          <p className="text-muted-foreground text-sm text-center">
            © {new Date().getFullYear()} Fix Phone. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
