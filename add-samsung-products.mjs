import { drizzle } from "drizzle-orm/mysql2";
import { products } from "./drizzle/schema.js";
import "dotenv/config";

const db = drizzle(process.env.DATABASE_URL);

const samsungProducts = [
  {
    nameHebrew: "Samsung Galaxy S24 Ultra",
    categoryHebrew: "סמארטפונים",
    descriptionHebrew: "הדגל של סמסונג עם מסך 6.8 אינץ' Dynamic AMOLED, מעבד Snapdragon 8 Gen 3, מצלמה 200MP ועט S Pen מובנה",
    price: "4999.00",
    discountPrice: "4499.00",
    stockQuantity: 8,
    imageUrl: null,
  },
  {
    nameHebrew: "Samsung Galaxy S24",
    categoryHebrew: "סמארטפונים",
    descriptionHebrew: "מכשיר דגל קומפקטי עם מסך 6.2 אינץ', מעבד Exynos 2400, מצלמה משולשת 50MP וטעינה אלחוטית מהירה",
    price: "3499.00",
    discountPrice: "3199.00",
    stockQuantity: 12,
    imageUrl: null,
  },
  {
    nameHebrew: "Samsung Galaxy Z Fold 5",
    categoryHebrew: "סמארטפונים",
    descriptionHebrew: "סמארטפון מתקפל פרימיום עם מסך פנימי 7.6 אינץ', מסך חיצוני 6.2 אינץ', מעבד Snapdragon 8 Gen 2 ומצלמה משולשת",
    price: "7499.00",
    discountPrice: null,
    stockQuantity: 3,
    imageUrl: null,
  },
  {
    nameHebrew: "Samsung Galaxy A54 5G",
    categoryHebrew: "סמארטפונים",
    descriptionHebrew: "מכשיר ביניים מעולה עם מסך Super AMOLED 6.4 אינץ', מעבד Exynos 1380, מצלמה 50MP ועמידות במים IP67",
    price: "1799.00",
    discountPrice: "1599.00",
    stockQuantity: 20,
    imageUrl: null,
  },
  {
    nameHebrew: "Samsung Galaxy Z Flip 5",
    categoryHebrew: "סמארטפונים",
    descriptionHebrew: "סמארטפון מתקפל קומפקטי עם מסך חיצוני 3.4 אינץ', מסך פנימי 6.7 אינץ', מעבד Snapdragon 8 Gen 2 ועיצוב אופנתי",
    price: "4299.00",
    discountPrice: "3999.00",
    stockQuantity: 6,
    imageUrl: null,
  },
];

async function addProducts() {
  try {
    console.log("Adding Samsung products to database...");
    
    for (const product of samsungProducts) {
      await db.insert(products).values(product);
      console.log(`✓ Added: ${product.nameHebrew}`);
    }
    
    console.log("\n✅ All Samsung products added successfully!");
  } catch (error) {
    console.error("❌ Error adding products:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

addProducts();
