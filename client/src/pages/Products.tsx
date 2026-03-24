import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, ArrowRight, Package, ShoppingCart, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";

export default function Products() {
  const { data: products, isLoading } = trpc.products.getAll.useQuery();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories
  const categories = products
    ? ["all", ...Array.from(new Set(products.map((p) => p.categoryHebrew)))]
    : ["all"];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products?.filter((p) => p.categoryHebrew === selectedCategory);

  const handleInquiry = (productName: string) => {
    toast.success(`פנייה עבור ${productName} נשלחה בהצלחה!`);
  };

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
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient-primary">קטלוג מוצרים</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              אביזרים וחלקי חילוף איכותיים למכשירים ניידים
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category
                    ? "gradient-primary hover-glow-primary"
                    : "hover-glow-primary"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "כל המוצרים" : category}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">טוען מוצרים...</p>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && filteredProducts && filteredProducts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="glass-card overflow-hidden hover-glow-primary transition-smooth"
                >
                  {/* Product Image */}
                  <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.nameHebrew}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <Package className="w-20 h-20 text-primary" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge className="mb-2 bg-secondary/20 text-secondary">
                          {product.categoryHebrew}
                        </Badge>
                        <h3 className="text-xl font-bold text-foreground">
                          {product.nameHebrew}
                        </h3>
                      </div>
                    </div>

                    {product.descriptionHebrew && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {product.descriptionHebrew}
                      </p>
                    )}

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 mb-4">
                      {product.stockQuantity > 0 ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-green-500">במלאי</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-orange-500">אזל מהמלאי</span>
                        </>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-3 mb-4">
                      {product.discountPrice ? (
                        <>
                          <span className="text-3xl font-bold text-secondary">
                            ₪{parseFloat(product.discountPrice).toFixed(2)}
                          </span>
                          <span className="text-lg text-muted-foreground line-through">
                            ₪{parseFloat(product.price).toFixed(2)}
                          </span>
                          <Badge className="bg-destructive/20 text-destructive">
                            מבצע!
                          </Badge>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-primary">
                          ₪{parseFloat(product.price).toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full gradient-primary hover-glow-primary"
                      onClick={() => handleInquiry(product.nameHebrew)}
                      disabled={product.stockQuantity === 0}
                    >
                      <ShoppingCart className="ml-2 w-4 h-4" />
                      {product.stockQuantity > 0 ? "פנה לרכישה" : "הודע כשיגיע"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredProducts && filteredProducts.length === 0 && (
            <Card className="glass-card p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-foreground">אין מוצרים</h3>
              <p className="text-muted-foreground">
                לא נמצאו מוצרים בקטגוריה זו. נסה לבחור קטגוריה אחרת.
              </p>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
