import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MessageCircle, Phone } from "lucide-react";

export function Navbar() {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/972XXXXXXXXX", "_blank");
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+972XXXXXXXXX";
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 glass-strong">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/logo.png" alt="Fix Phone Logo" className="w-12 h-12 md:w-16 md:h-16" />
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl font-bold text-white">Fix Phone</span>
                </div>
              </div>
            </Link>
            
            {/* Desktop Navbar Actions */}
            <div className="hidden md:flex items-center gap-2 ml-4">
              <Link href="/login">
                <Button variant="ghost" className="hover-glow-primary ml-2" style={{ backgroundColor: "#211731" }}>
                  התחבר
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/products">
              <Button variant="ghost" className="hover-glow-primary" style={{ backgroundColor: "#211731" }}>
                מוצרים
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" className="hover-glow-primary" style={{ backgroundColor: "#211731" }}>
                פורום TECH
              </Button>
            </Link>
            <Link href="/it-services">
              <Button className="gradient-primary hover-glow-primary" style={{ color: "#ffffff", backgroundColor: "#211731" }}>
                שירותי IT לעסקים
              </Button>
            </Link>

            {/* Contact Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="hover-glow-primary bg-green-500 hover:bg-green-600 border-green-500"
              onClick={handleWhatsAppClick}
              title="WhatsApp"
              style={{ backgroundColor: "#0adb3f" }}
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

          {/* Mobile Actions */}
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
  );
}
