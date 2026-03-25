import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, User, MessageSquare, Calendar } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const DUMMY_POSTS = [
  {
    id: 1,
    title: "איך לשמור על בריאות הסוללה ב-2026?",
    category: "תחזוקה",
    excerpt: "טיפים עדכניים לטעינה נכונה וניהול מחזורי טעינה במכשירי אפל ואנדרואיד.",
    date: "24/03/2026",
    commentsCount: 12
  },
  {
    id: 2,
    title: "מהפכת ה-AI בתיקוני חומרה",
    category: "חדשנות",
    excerpt: "סקירה על כלים חדשים המאפשרים אבחון תקלות בלוח האם באמצעות בינה מלאכותית.",
    date: "22/03/2026",
    commentsCount: 8
  },
  {
    id: 3,
    title: "מדריך: אבטחת מידע לעסקים קטנים",
    category: "IT & Cyber",
    excerpt: "צעדים ראשונים בהגנה על שרת ה-SaaS הארגוני שלכם מפני התקפות כופר.",
    date: "15/03/2026",
    commentsCount: 24
  },
  {
    id: 4,
    title: "השוואה: M3 vs M4 - האם כדאי לשדרג?",
    category: "חומרה",
    excerpt: "ניתוח ביצועים ביישומי עריכה כבדים וניהול זיכרון מאוחד.",
    date: "10/03/2026",
    commentsCount: 45
  }
];

const FILTERS = ["הכל", "מדריכים", "חדשות", "ייעוץ טכני"];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("הכל");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="pt-32 pb-20 flex-grow">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient-primary">פורום TECH</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              דיונים, מדריכים והתייעצויות מקצועיות
            </p>
          </div>

          <div className="mb-10 space-y-5">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="חיפוש בפורום..." 
                className="pr-10 bg-[#16131c] border-border h-12 text-lg rounded-xl focus:border-primary/50 transition-smooth" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {FILTERS.map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  onClick={() => setActiveFilter(filter)}
                  className={activeFilter === filter ? "gradient-primary hover-glow-primary rounded-full px-6" : "bg-[#16131c] hover:bg-[#201c29] text-muted-foreground rounded-full border-border/50 px-6"}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {DUMMY_POSTS.map((post) => (
              <Card key={post.id} className="p-6 bg-[#120f18] hover:bg-[#16131c] border border-border/40 hover:border-primary/40 transition-all duration-300 shadow-none rounded-xl overflow-hidden cursor-pointer group">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold mb-2 text-foreground truncate group-hover:text-primary transition-colors">{post.title}</h2>
                    <p className="text-muted-foreground line-clamp-2 mb-5">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-5 text-sm text-foreground/70">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary/70" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border border-primary/20 font-medium px-2.5 py-0.5 rounded-full">
                          {post.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-secondary/80" />
                        <span>{post.commentsCount} תגובות</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
