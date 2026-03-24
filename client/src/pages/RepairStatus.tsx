import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Search, Clock, Wrench, Package, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";

const statusConfig = {
  awaiting_service: {
    label: "ממתין לשירות",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  in_progress: {
    label: "בתהליך תיקון",
    icon: Wrench,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  awaiting_parts: {
    label: "ממתין לחלקים",
    icon: Package,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  completed: {
    label: "הושלם",
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  delivered: {
    label: "נמסר ללקוח",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-600/10",
  },
  canceled: {
    label: "בוטל",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
};

export default function RepairStatus() {
  const [caseNumber, setCaseNumber] = useState("");
  const [searchedCaseNumber, setSearchedCaseNumber] = useState("");

  const { data: repair, isLoading, error } = trpc.repairs.getByCaseNumber.useQuery(
    { caseNumber: searchedCaseNumber },
    { enabled: searchedCaseNumber.length > 0, retry: false }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (caseNumber.trim()) {
      setSearchedCaseNumber(caseNumber.trim());
    } else {
      toast.error("אנא הזן מספר תיקון");
    }
  };

  const StatusIcon = repair ? statusConfig[repair.status].icon : Clock;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 glass-strong">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-gradient-primary">Fix Phone</span>
              </div>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="hover-glow-primary">
                <ArrowRight className="ml-2 w-4 h-4" />
                חזרה לדף הבית
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient-primary">מעקב אחר תיקון</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              הזן את מספר התיקון שלך כדי לעקוב אחר הסטטוס
            </p>
          </div>

          {/* Search Form */}
          <Card className="glass-card p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="caseNumber" className="text-lg mb-2 block">
                  מספר תיקון
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="caseNumber"
                    type="text"
                    placeholder="הזן מספר תיקון (לדוגמה: FP-2024-001)"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    className="flex-1 text-lg"
                    dir="ltr"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="gradient-primary hover-glow-primary"
                    disabled={isLoading}
                  >
                    <Search className="ml-2 w-5 h-5" />
                    חפש
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="glass-card p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">מחפש את התיקון שלך...</p>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="glass-card p-8 text-center border-destructive/50">
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-foreground">לא נמצא</h3>
              <p className="text-muted-foreground">
                מספר התיקון שהזנת לא נמצא במערכת. אנא בדוק את המספר ונסה שוב.
              </p>
            </Card>
          )}

          {/* Repair Details */}
          {repair && !isLoading && (
            <div className="space-y-6">
              {/* Status Card */}
              <Card className="glass-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl ${statusConfig[repair.status].bgColor} flex items-center justify-center`}>
                      <StatusIcon className={`w-8 h-8 ${statusConfig[repair.status].color}`} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {statusConfig[repair.status].label}
                      </h2>
                      <p className="text-muted-foreground">מספר תיקון: {repair.caseNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-muted rounded-full mb-8">
                  <div
                    className="absolute top-0 right-0 h-full gradient-primary rounded-full transition-all duration-500"
                    style={{
                      width: repair.status === "awaiting_service" ? "20%" :
                             repair.status === "in_progress" ? "40%" :
                             repair.status === "awaiting_parts" ? "60%" :
                             repair.status === "completed" ? "80%" :
                             repair.status === "delivered" ? "100%" : "0%"
                    }}
                  ></div>
                </div>

                {/* Device Info */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">מכשיר</h3>
                    <p className="text-lg font-medium text-foreground">
                      {repair.deviceType} {repair.deviceModel && `- ${repair.deviceModel}`}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">תאריך קבלה</h3>
                    <p className="text-lg font-medium text-foreground">
                      {new Date(repair.createdAt).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                </div>

                {/* Issue Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">תיאור התקלה</h3>
                  <p className="text-foreground">{repair.issueDescription}</p>
                </div>

                {/* Pricing */}
                <div className="grid md:grid-cols-2 gap-6">
                  {repair.estimatedPrice && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">מחיר משוער</h3>
                      <p className="text-2xl font-bold text-primary">
                        ₪{parseFloat(repair.estimatedPrice).toFixed(2)}
                      </p>
                    </div>
                  )}
                  {repair.finalPrice && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">מחיר סופי</h3>
                      <p className="text-2xl font-bold text-secondary">
                        ₪{parseFloat(repair.finalPrice).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Technician Notes */}
              {repair.technicianNotes && (
                <Card className="glass-card p-8">
                  <h3 className="text-xl font-bold mb-4 text-foreground">הערות טכנאי</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{repair.technicianNotes}</p>
                </Card>
              )}

              {/* Contact Info */}
              <Card className="glass-card p-8 text-center">
                <h3 className="text-xl font-bold mb-2 text-foreground">יש שאלות?</h3>
                <p className="text-muted-foreground mb-4">
                  צור קשר איתנו בטלפון 03-1234567 או בדוא"ל info@fixphone.co.il
                </p>
                <Button className="gradient-primary hover-glow-primary">
                  צור קשר
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
