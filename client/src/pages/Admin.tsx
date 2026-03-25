import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, LayoutDashboard, Wrench, Building2, Package, AlertCircle, TrendingUp, Users, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Navbar } from "@/components/Navbar";

export default function Admin() {
  const { user, loading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedRepair, setSelectedRepair] = useState<number | null>(null);
  const [selectedLead, setSelectedLead] = useState<number | null>(null);

  const { data: stats } = trpc.dashboard.getStats.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: repairs, refetch: refetchRepairs } = trpc.repairs.getAll.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: leads, refetch: refetchLeads } = trpc.b2bLeads.getAll.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: lowStockProducts } = trpc.products.getLowStock.useQuery(undefined, {
    enabled: !!user,
  });

  const updateRepairMutation = trpc.repairs.update.useMutation({
    onSuccess: () => {
      toast.success("התיקון עודכן בהצלחה");
      refetchRepairs();
      setSelectedRepair(null);
    },
    onError: () => {
      toast.error("שגיאה בעדכון התיקון");
    },
  });

  const updateLeadMutation = trpc.b2bLeads.update.useMutation({
    onSuccess: () => {
      toast.success("הליד עודכן בהצלחה");
      refetchLeads();
      setSelectedLead(null);
    },
    onError: () => {
      toast.error("שגיאה בעדכון הליד");
    },
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  // Redirect to login if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = getLoginUrl();
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Main Content */}
      <div className="pt-32 pb-20">
        <div className="container">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient-primary">לוח בקרה</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              ניהול תיקונים, לידים ומלאי
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-primary-foreground" />
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">
                {stats?.activeRepairs || 0}
              </h3>
              <p className="text-muted-foreground">תיקונים פעילים</p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-accent-foreground" />
                </div>
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">
                {stats?.newLeads || 0}
              </h3>
              <p className="text-muted-foreground">לידים חדשים</p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">
                {stats?.totalCustomers || 0}
              </h3>
              <p className="text-muted-foreground">סה"כ לקוחות</p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">
                {stats?.lowStockAlerts || 0}
              </h3>
              <p className="text-muted-foreground">התראות מלאי</p>
            </Card>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="repairs" className="space-y-6">
            <TabsList className="glass-card p-1">
              <TabsTrigger value="repairs" className="gap-2">
                <Wrench className="w-4 h-4" />
                ניהול תיקונים
              </TabsTrigger>
              <TabsTrigger value="leads" className="gap-2">
                <Building2 className="w-4 h-4" />
                ניהול לידים
              </TabsTrigger>
              <TabsTrigger value="inventory" className="gap-2">
                <Package className="w-4 h-4" />
                מלאי נמוך
              </TabsTrigger>
            </TabsList>

            {/* Repairs Tab */}
            <TabsContent value="repairs">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground">תיקונים</h2>
                <div className="space-y-4">
                  {repairs && repairs.length > 0 ? (
                    repairs.map((repair) => (
                      <Card key={repair.id} className="glass p-4 hover-glow-primary transition-smooth">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className="bg-primary/20 text-primary">
                                {repair.caseNumber}
                              </Badge>
                              <Badge
                                className={
                                  repair.status === "completed" || repair.status === "delivered"
                                    ? "bg-green-500/20 text-green-500"
                                    : repair.status === "canceled"
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-yellow-500/20 text-yellow-500"
                                }
                              >
                                {repair.status}
                              </Badge>
                            </div>
                            <h3 className="font-bold text-foreground">{repair.customerName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {repair.deviceType} - {repair.issueDescription}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(repair.createdAt).toLocaleDateString("he-IL")}
                            </p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="hover-glow-primary"
                                onClick={() => setSelectedRepair(repair.id)}
                              >
                                עדכן
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>עדכון תיקון - {repair.caseNumber}</DialogTitle>
                              </DialogHeader>
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  const formData = new FormData(e.currentTarget);
                                  updateRepairMutation.mutate({
                                    id: repair.id,
                                    status: formData.get("status") as any,
                                    finalPrice: formData.get("finalPrice") as string,
                                    technicianNotes: formData.get("technicianNotes") as string,
                                  });
                                }}
                                className="space-y-4"
                              >
                                <div>
                                  <Label htmlFor="status">סטטוס</Label>
                                  <Select name="status" defaultValue={repair.status}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="awaiting_service">ממתין לשירות</SelectItem>
                                      <SelectItem value="in_progress">בתהליך</SelectItem>
                                      <SelectItem value="awaiting_parts">ממתין לחלקים</SelectItem>
                                      <SelectItem value="completed">הושלם</SelectItem>
                                      <SelectItem value="delivered">נמסר</SelectItem>
                                      <SelectItem value="canceled">בוטל</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="finalPrice">מחיר סופי</Label>
                                  <Input
                                    id="finalPrice"
                                    name="finalPrice"
                                    type="number"
                                    step="0.01"
                                    defaultValue={repair.finalPrice || ""}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="technicianNotes">הערות טכנאי</Label>
                                  <Textarea
                                    id="technicianNotes"
                                    name="technicianNotes"
                                    defaultValue={repair.technicianNotes || ""}
                                    rows={4}
                                  />
                                </div>
                                <Button
                                  type="submit"
                                  className="w-full gradient-primary hover-glow-primary"
                                  disabled={updateRepairMutation.isPending}
                                >
                                  {updateRepairMutation.isPending ? "מעדכן..." : "עדכן תיקון"}
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">אין תיקונים</p>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Leads Tab */}
            <TabsContent value="leads">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground">לידים B2B</h2>
                <div className="space-y-4">
                  {leads && leads.length > 0 ? (
                    leads.map((lead) => (
                      <Card key={lead.id} className="glass p-4 hover-glow-secondary transition-smooth">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className="bg-secondary/20 text-secondary">
                                {lead.companyName}
                              </Badge>
                              <Badge
                                className={
                                  lead.status === "won"
                                    ? "bg-green-500/20 text-green-500"
                                    : lead.status === "lost"
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-blue-500/20 text-blue-500"
                                }
                              >
                                {lead.status}
                              </Badge>
                            </div>
                            <h3 className="font-bold text-foreground">{lead.contactName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {lead.contactEmail} | {lead.contactPhone}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              גודל: {lead.companySize} | {new Date(lead.createdAt).toLocaleDateString("he-IL")}
                            </p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="hover-glow-secondary"
                                onClick={() => setSelectedLead(lead.id)}
                              >
                                עדכן
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>עדכון ליד - {lead.companyName}</DialogTitle>
                              </DialogHeader>
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  const formData = new FormData(e.currentTarget);
                                  updateLeadMutation.mutate({
                                    id: lead.id,
                                    status: formData.get("status") as any,
                                    notes: formData.get("notes") as string,
                                  });
                                }}
                                className="space-y-4"
                              >
                                <div>
                                  <Label htmlFor="status">סטטוס</Label>
                                  <Select name="status" defaultValue={lead.status}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">חדש</SelectItem>
                                      <SelectItem value="contacted">נוצר קשר</SelectItem>
                                      <SelectItem value="qualified">מוסמך</SelectItem>
                                      <SelectItem value="proposal_sent">הצעה נשלחה</SelectItem>
                                      <SelectItem value="won">נסגר</SelectItem>
                                      <SelectItem value="lost">אבד</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="notes">הערות</Label>
                                  <Textarea
                                    id="notes"
                                    name="notes"
                                    defaultValue={lead.notes || ""}
                                    rows={4}
                                  />
                                </div>
                                <Button
                                  type="submit"
                                  className="w-full gradient-accent hover-glow-secondary"
                                  disabled={updateLeadMutation.isPending}
                                >
                                  {updateLeadMutation.isPending ? "מעדכן..." : "עדכן ליד"}
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">אין לידים</p>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground">מלאי נמוך</h2>
                <div className="space-y-4">
                  {lowStockProducts && lowStockProducts.length > 0 ? (
                    lowStockProducts.map((product) => (
                      <Card key={product.id} className="glass p-4 border-destructive/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-foreground">{product.nameHebrew}</h3>
                            <p className="text-sm text-muted-foreground">{product.categoryHebrew}</p>
                          </div>
                          <div className="text-left">
                            <Badge className="bg-destructive/20 text-destructive">
                              {product.stockQuantity} יחידות
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">אין מוצרים במלאי נמוך</p>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
