import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";

const DUMMY_PRODUCTS = [
  { id: 1, category: "טלפונים", name: 'iPhone 15 Pro Max 256GB', price: 5400 },
  { id: 2, category: "טלפונים", name: 'Samsung Galaxy S24 Ultra', price: 4800 },
  { id: 3, category: "שעונים", name: 'Apple Watch Ultra 2', price: 3200 },
  { id: 4, category: "שעונים", name: 'Galaxy Watch 6 Classic', price: 1400 },
  { id: 5, category: "מחשבים", name: 'MacBook Air M3 13"', price: 5100 },
  { id: 6, category: "מחשבים", name: 'Dell XPS 13 9315', price: 4900 },
];

export default function Products() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(DUMMY_PRODUCTS.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === "all"
      ? DUMMY_PRODUCTS
      : DUMMY_PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient-primary">קטלוג מוצרים</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              חנות תצוגה פעילה - בחר מוצר והוסף לעגלה
            </p>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="glass-card overflow-hidden hover-glow-primary transition-smooth bg-card/60 backdrop-blur-md text-card-foreground border border-border"
              >
                <div className="h-64 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
                   {/* High Res Placeholder */}
                   <Package className="w-24 h-24 text-primary opacity-50" />
                </div>
                <div className="p-6 flex flex-col justify-between h-[200px]">
                  <div>
                    <Badge className="mb-3 bg-secondary/20 text-secondary border-none">
                      {product.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-primary">
                      ₪{product.price.toLocaleString()}
                    </span>
                    <Button 
                      className="gradient-primary hover-glow-primary text-white" 
                      onClick={() => addToCart()}
                    >
                      <ShoppingCart className="ml-2 w-4 h-4" />
                      הוסף לעגלה
                    </Button>
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
