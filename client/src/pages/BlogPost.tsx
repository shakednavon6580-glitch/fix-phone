import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, ArrowRight, Calendar, User } from "lucide-react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug || "";

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: slug.length > 0 }
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Main Content */}
      <div className="pt-32 pb-20">
        <div className="container max-w-4xl">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">טוען פוסט...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="glass-card p-12 text-center">
              <h3 className="text-2xl font-bold mb-2 text-foreground">פוסט לא נמצא</h3>
              <p className="text-muted-foreground mb-6">
                הפוסט שחיפשת לא קיים במערכת
              </p>
              <Link href="/blog">
                <Button className="gradient-primary hover-glow-primary">
                  חזרה לבלוג
                </Button>
              </Link>
            </Card>
          )}

          {/* Post Content */}
          {post && !isLoading && (
            <article>
              {/* Post Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-primary/20 text-primary">{post.category}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("he-IL")
                      : ""}
                  </div>
                </div>

                <h1 className="text-5xl font-bold mb-4 text-gradient-primary">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="text-xl text-muted-foreground">{post.excerpt}</p>
                )}
              </div>

              {/* Featured Image */}
              {post.imageUrl && (
                <Card className="glass-card overflow-hidden mb-8">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-auto"
                  />
                </Card>
              )}

              {/* Post Body */}
              <Card className="glass-card p-8">
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </Card>

              {/* Back to Blog */}
              <div className="mt-12 text-center">
                <Link href="/blog">
                  <Button className="gradient-primary hover-glow-primary" size="lg">
                    <ArrowRight className="ml-2 w-5 h-5" />
                    חזרה לכל הפוסטים
                  </Button>
                </Link>
              </div>
            </article>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
