import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Building2, Shield, Cloud, Server, Users, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const services = [
  { id: "managed-it", label: "ניהול IT מלא", icon: Server },
  { id: "security", label: "אבטחת מידע וסייבר", icon: Shield },
  { id: "cloud", label: "פתרונות ענן", icon: Cloud },
  { id: "support", label: "תמיכה טכנית", icon: Users },
  { id: "backup", label: "גיבויים ושחזור", icon: Shield },
  { id: "consulting", label: "ייעוץ טכנולוגי", icon: Zap },
];

export default function ITServices() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    companySize: "",
    message: "",
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const createLeadMutation = trpc.b2bLeads.create.useMutation({
    onSuccess: () => {
      toast.success("הבקשה נשלחה בהצלחה! ניצור איתך קשר בקרוב");
      setFormData({
        companyName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        companySize: "",
        message: "",
      });
      setSelectedServices([]);
    },
    onError: (error) => {
      toast.error("שגיאה בשליחת הבקשה. אנא נסה שוב");
      console.error(error);
    },
  });

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName || !formData.contactName || !formData.contactEmail || !formData.contactPhone || !formData.companySize) {
      toast.error("אנא מלא את כל השדות החובה");
      return;
    }

    if (selectedServices.length === 0) {
      toast.error("אנא בחר לפחות שירות אחד");
      return;
    }

    createLeadMutation.mutate({
      ...formData,
      companySize: formData.companySize as "1-10" | "11-50" | "51-100" | "100+",
      servicesInterested: JSON.stringify(selectedServices),
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-accent/5 to-background"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-6 animate-float" style={{backgroundColor: '#e6e6e6'}}>
              <Building2 className="w-10 h-10 text-accent-foreground" />
            </div>
            <h1 className="text-6xl font-bold mb-6">
              <span className="text-gradient-accent">שירותי IT מקצועיים</span>
              <br />
              <span className="text-foreground">לעסק שלך</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              פתרונות טכנולוגיים מתקדמים, ניהול IT מלא ותמיכה מקצועית 24/7
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="glass-card p-6 hover-glow-secondary transition-smooth text-center">
                  <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#ffffff'}}>
                    <Icon className="w-7 h-7 text-accent-foreground" style={{backgroundColor: '#f2f2f2'}} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{service.label}</h3>
                </Card>
              );
            })}
          </div>

          {/* Benefits Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="text-gradient-accent">למה לבחור בנו?</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">ניסיון וידע</h3>
                  <p className="text-muted-foreground">
                    צוות מומחים עם ניסיון רב בניהול תשתיות IT לעסקים בכל הגדלים
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">זמינות 24/7</h3>
                  <p className="text-muted-foreground">
                    תמיכה טכנית מקצועית זמינה בכל שעות היממה
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">פתרונות מותאמים</h3>
                  <p className="text-muted-foreground">
                    כל פתרון מותאם אישית לצרכים הספציפיים של העסק שלך
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">מחירים תחרותיים</h3>
                  <p className="text-muted-foreground">
                    שירות מקצועי במחירים הוגנים ותחרותיים
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="py-20 relative">
        <div className="container max-w-3xl">
          <Card className="glass-card p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-gradient-accent" style={{color: '#fffafa', backgroundColor: '#f9f1f1'}}>קבלו ייעוץ חינם</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                מלאו את הפרטים ונחזור אליכם בהקדם לייעוץ ראשוני ללא התחייבות
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div>
                <Label htmlFor="companyName">שם החברה *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="הזן שם חברה"
                  required
                />
              </div>

              {/* Contact Name */}
              <div>
                <Label htmlFor="contactName">שם איש קשר *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="הזן שם מלא"
                  required
                />
              </div>

              {/* Email and Phone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">דוא"ל *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">טלפון *</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="050-1234567"
                    required
                  />
                </div>
              </div>

              {/* Company Size */}
              <div>
                <Label htmlFor="companySize">גודל החברה *</Label>
                <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                  <SelectTrigger id="companySize">
                    <SelectValue placeholder="בחר גודל חברה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 עובדים</SelectItem>
                    <SelectItem value="11-50">11-50 עובדים</SelectItem>
                    <SelectItem value="51-100">51-100 עובדים</SelectItem>
                    <SelectItem value="100+">מעל 100 עובדים</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Services Selection */}
              <div>
                <Label className="mb-3 block">שירותים מעניינים *</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {services.map((service) => {
                    const Icon = service.icon;
                    return (
                      <div
                        key={service.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-smooth cursor-pointer ${
                          selectedServices.includes(service.id)
                            ? "border-secondary bg-secondary/10"
                            : "border-border hover:border-secondary/50"
                        }`}
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <Icon className="w-5 h-5 text-secondary" />
                        <span className="text-sm font-medium text-foreground">{service.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message">הודעה נוספת (אופציונלי)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="ספר לנו עוד על הצרכים שלך..."
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full gradient-accent hover-glow-secondary"
                disabled={createLeadMutation.isPending}
              >
                {createLeadMutation.isPending ? "שולח..." : "שלח בקשה"}
              </Button>
            </form>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
