import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, ArrowRight, BookOpen, Calendar, User } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Footer } from "@/components/Footer";

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.getAll.useQuery();

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
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient-primary">בלוג</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              מדריכים, טיפים וחדשות מעולם הטכנולוגיה
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">טוען פוסטים...</p>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!isLoading && posts && posts.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="glass-card overflow-hidden hover-glow-primary transition-smooth cursor-pointer h-full">
                    {/* Post Image */}
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-20 h-20 text-primary" />
                      )}
                    </div>

                    {/* Post Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-primary/20 text-primary">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("he-IL")
                            : ""}
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold mb-3 text-foreground line-clamp-2">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      <Button variant="ghost" className="hover-glow-primary p-0">
                        קרא עוד
                        <ArrowRight className="mr-2 w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && posts && posts.length === 0 && (
            <Card className="glass-card p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-foreground">אין פוסטים</h3>
              <p className="text-muted-foreground">
                אין פוסטים פורסמו עדיין. חזור בקרוב לתוכן חדש!
              </p>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
