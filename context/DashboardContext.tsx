"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ProductColor {
  nameEn: string;
  nameBn: string;
  hex: string;
}

export interface Product {
  id: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  category: "cat_hot" | "cat_women" | "cat_men" | "cat_shoes" | "cat_watches" | "cat_kids";
  costUSD: number; // Kena Price (Buying Price)
  priceUSD: number; // Sell Price
  discountPercent: number;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  rating: number;
  reviewsCount: number;
  stock: number;
}

export interface OrderItem {
  productId: string;
  nameEn: string;
  nameBn: string;
  priceUSD: number;
  quantity: number;
  size: string;
  colorEn: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: OrderItem[];
  totalUSD: number;
  costUSD: number; // total buying price for profit calculation
  createdAt: string;
  status: "Pending" | "Shipped" | "Delivered";
}

export interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  conversions: number;
}

export interface AdminUser {
  name: string;
  email: string;
  role: string;
  avatar: string;
  lastLogin: string;
}

interface DashboardContextType {
  products: Product[];
  orders: Order[];
  trafficData: TrafficData[];
  adminUser: AdminUser;
  isAuthenticated: boolean;
  loginError: string | null;
  notification: { message: string; type: "info" | "success" } | null;
  login: (password: string) => boolean;
  logout: () => void;
  updateAdminProfile: (name: string, email: string, avatar: string) => void;
  addProduct: (product: Omit<Product, "id" | "rating" | "reviewsCount">) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: "Pending" | "Shipped" | "Delivered") => void;
  simulatePurchase: () => void;
  clearNotification: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Initial Categories definitions
export const CATEGORIES = [
  { id: "cat_hot", nameEn: "Hot Sale", nameBn: "হট সেল" },
  { id: "cat_women", nameEn: "Women's Fashion", nameBn: "মেয়েদের ফ্যাশন" },
  { id: "cat_men", nameEn: "Men's Fashion", nameBn: "ছেলেদের ফ্যাশন" },
  { id: "cat_shoes", nameEn: "Shoes", nameBn: "জুতো কালেকশন" },
  { id: "cat_watches", nameEn: "Watches & Acc.", nameBn: "ঘড়ি ও অ্যাক্সেসরিজ" },
  { id: "cat_kids", nameEn: "Kids & Toys", nameBn: "বাচ্চাদের খেলনা ও পোশাক" },
] as const;

// Preset initial products with cost (buying) and price (selling)
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-hot-1",
    nameEn: "Chic Woolen Knitted Cardigan",
    nameBn: "চটকদার উলের বোনা কার্ডিগান",
    descriptionEn: "Wrap yourself in cozy luxury. Expertly knitted from extra-fine merino wool blend.",
    descriptionBn: "আরাম ও বিলাসিতার চমৎকার সংমিশ্রণ। অতিরিক্ত মিহি মেরিনো উলের মিশ্রণে তৈরি।",
    category: "cat_hot",
    costUSD: 28.50,
    priceUSD: 59.99,
    discountPercent: 50,
    images: ["/images/products/cardigan_1.png"],
    sizes: ["S", "M", "L"],
    colors: [
      { nameEn: "Creamy Beige", nameBn: "ক্রিম বেইজ", hex: "#F5F5DC" },
      { nameEn: "Dusty Rose", nameBn: "হালকা গোলাপী", hex: "#D8BFD8" }
    ],
    rating: 4.8,
    reviewsCount: 110,
    stock: 45
  },
  {
    id: "prod-hot-2",
    nameEn: "Casual Linen Shirt Long Sleeve",
    nameBn: "ক্যাজুয়াল লিনেন শার্ট ফুল হাতা",
    descriptionEn: "Stay fresh and fashionable in warmer weather. Loose, casual drape with spread collar.",
    descriptionBn: "গরমের আবহাওয়ায় থাকুন সতেজ ও স্টাইলিশ। ঢিলেঢালা আরামদায়ক ফিট।",
    category: "cat_hot",
    costUSD: 16.00,
    priceUSD: 39.99,
    discountPercent: 45,
    images: ["/images/products/linen_shirt_1.png"],
    sizes: ["M", "L", "XL"],
    colors: [
      { nameEn: "Ocean Blue", nameBn: "সাগর নীল", hex: "#4682B4" },
      { nameEn: "Desert Khaki", nameBn: "মরু খাকি", hex: "#F0E68C" }
    ],
    rating: 4.5,
    reviewsCount: 72,
    stock: 80
  },
  {
    id: "prod-women-1",
    nameEn: "Vintage Floral Summer Maxi Dress",
    nameBn: "ভিন্টেজ ফ্লোরাল সামার ম্যাক্সি ড্রেস",
    descriptionEn: "Experience supreme comfort and breezy elegance in our floral maxi dress.",
    descriptionBn: "আমাদের ভিন্টেজ ফ্লোরাল ম্যাক্সি ড্রেসে পাবেন অসাধারণ আরাম এবং স্নিগ্ধতা।",
    category: "cat_women",
    costUSD: 20.00,
    priceUSD: 49.99,
    discountPercent: 30,
    images: ["/images/products/maxi_dress_1.png"],
    sizes: ["S", "M", "L"],
    colors: [
      { nameEn: "Peach Puff", nameBn: "পিচ", hex: "#FFDAB9" },
      { nameEn: "Emerald", nameBn: "পান্না সবুজ", hex: "#50C878" }
    ],
    rating: 4.8,
    reviewsCount: 124,
    stock: 35
  },
  {
    id: "prod-men-1",
    nameEn: "Premium Urban Denim Jacket",
    nameBn: "প্রিমিয়াম আরবান ডেনিম জ্যাকেট",
    descriptionEn: "A timeless wardrobe staple. Crafted from premium organic cotton denim.",
    descriptionBn: "সব ঋতুর জন্য মানানসই ও চমৎকার পোশাক। প্রিমিয়াম কটন ডেনিম কাপড়ে তৈরি।",
    category: "cat_men",
    costUSD: 25.00,
    priceUSD: 59.99,
    discountPercent: 25,
    images: ["/images/products/denim_jacket_1.png"],
    sizes: ["M", "L", "XL"],
    colors: [
      { nameEn: "Classic Blue", nameBn: "ক্ল্যাসিক নীল", hex: "#3B5998" },
      { nameEn: "Charcoal Black", nameBn: "কয়লা কালো", hex: "#2B2B2B" }
    ],
    rating: 4.7,
    reviewsCount: 98,
    stock: 28
  },
  {
    id: "prod-shoes-1",
    nameEn: "Ultra-Lightweight Athletic Sneakers",
    nameBn: "আল্ট্রা-লাইটওয়েট অ্যাথলেটিক স্নিকার্স",
    descriptionEn: "Engineered for maximum speed and endurance. responsive foam cushions.",
    descriptionBn: "দৌড়ানো ও হাঁটার সময় সর্বোচ্চ গতি ও স্থায়িত্বের জন্য ডিজাইনকৃত।",
    category: "cat_shoes",
    costUSD: 35.00,
    priceUSD: 79.99,
    discountPercent: 40,
    images: ["/images/products/shoes_sneakers_1.png"],
    sizes: ["40", "41", "42", "43"],
    colors: [
      { nameEn: "Crimson Gold", nameBn: "লাল সোনালী", hex: "#B22234" },
      { nameEn: "Stealth Black", nameBn: "কালো", hex: "#111111" }
    ],
    rating: 4.9,
    reviewsCount: 156,
    stock: 50
  },
  {
    id: "prod-watch-1",
    nameEn: "Aero-Luxury Chronograph Watch",
    nameBn: "অ্যারো-লাক্সারি ক্রোনোগ্রাফ ঘড়ি",
    descriptionEn: "Make a powerful statement of style and precision. sapphire crystal glass.",
    descriptionBn: "আপনার ব্যক্তিত্ব ও সময়ানুবর্তিতার বহিঃপ্রকাশ। স্যাফায়ার ক্রিস্টাল গ্লাস।",
    category: "cat_watches",
    costUSD: 65.00,
    priceUSD: 149.99,
    discountPercent: 35,
    images: ["/images/luxury_watch_1.png"],
    sizes: ["One Size"],
    colors: [
      { nameEn: "Sapphire Gold", nameBn: "স্যাফায়ার গোল্ড", hex: "#D4AF37" },
      { nameEn: "Classic Silver", nameBn: "ক্ল্যাসিক সিলভার", hex: "#C0C0C0" }
    ],
    rating: 4.6,
    reviewsCount: 84,
    stock: 15
  },
  {
    id: "prod-kids-1",
    nameEn: "Kids Playtime Cotton Set",
    nameBn: "কিডস প্লে-টাইম কটন সেট",
    descriptionEn: "Cute and playful clothing set for kids, made from 100% organic cotton.",
    descriptionBn: "শিশুদের জন্য সুন্দর ও আরামদায়ক সুতি কাপড়ের সেট, যা ১০০% অর্গানিক কটন দ্বারা তৈরি।",
    category: "cat_kids",
    costUSD: 11.50,
    priceUSD: 29.99,
    discountPercent: 30,
    images: ["/images/kids_clothing_set_1.png"],
    sizes: ["2-3Y", "3-4Y", "4-5Y"],
    colors: [
      { nameEn: "Sunshine Yellow", nameBn: "রোদেলা হলুদ", hex: "#FFD700" },
      { nameEn: "Sky Blue", nameBn: "আকাশী নীল", hex: "#87CEEB" }
    ],
    rating: 4.7,
    reviewsCount: 52,
    stock: 60
  }
];

// Preset initial simulated orders
const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-2891",
    customerName: "Rifat Hasan",
    customerEmail: "rifat@gmail.com",
    customerAddress: "Dhanmondi, Dhaka, Bangladesh",
    items: [
      {
        productId: "prod-hot-1",
        nameEn: "Chic Woolen Knitted Cardigan",
        nameBn: "চটকদার উলের বোনা কার্ডিগান",
        priceUSD: 59.99,
        quantity: 1,
        size: "M",
        colorEn: "Creamy Beige"
      }
    ],
    totalUSD: 59.99,
    costUSD: 28.50,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    status: "Pending"
  },
  {
    id: "ORD-2890",
    customerName: "Anika Rahman",
    customerEmail: "anika@yahoo.com",
    customerAddress: "Gulshan-2, Dhaka, Bangladesh",
    items: [
      {
        productId: "prod-women-1",
        nameEn: "Vintage Floral Summer Maxi Dress",
        nameBn: "ভিন্টেজ ফ্লোরাল সামার ম্যাক্সি ড্রেস",
        priceUSD: 49.99,
        quantity: 2,
        size: "S",
        colorEn: "Peach Puff"
      }
    ],
    totalUSD: 99.98,
    costUSD: 40.00,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(), // 6 hours ago
    status: "Shipped"
  },
  {
    id: "ORD-2889",
    customerName: "Tahsan Chowdhury",
    customerEmail: "tahsan@outlook.com",
    customerAddress: "Nasirabad, Chittagong, Bangladesh",
    items: [
      {
        productId: "prod-shoes-1",
        nameEn: "Ultra-Lightweight Athletic Sneakers",
        nameBn: "আল্ট্রা-লাইটওয়েট অ্যাথলেটিক স্নিকার্স",
        priceUSD: 79.99,
        quantity: 1,
        size: "42",
        colorEn: "Stealth Black"
      },
      {
        productId: "prod-hot-2",
        nameEn: "Casual Linen Shirt Long Sleeve",
        nameBn: "ক্যাজুয়াল লিনেন শার্ট ফুল হাতা",
        priceUSD: 39.99,
        quantity: 1,
        size: "L",
        colorEn: "Ocean Blue"
      }
    ],
    totalUSD: 119.98,
    costUSD: 51.00,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
    status: "Delivered"
  }
];

// 7 days preset traffic analytics
const INITIAL_TRAFFIC: TrafficData[] = [
  { date: "30 Jun", visitors: 420, pageViews: 1250, conversions: 12 },
  { date: "01 Jul", visitors: 510, pageViews: 1530, conversions: 15 },
  { date: "02 Jul", visitors: 480, pageViews: 1390, conversions: 11 },
  { date: "03 Jul", visitors: 620, pageViews: 1860, conversions: 22 },
  { date: "04 Jul", visitors: 730, pageViews: 2190, conversions: 28 },
  { date: "05 Jul", visitors: 690, pageViews: 2010, conversions: 24 },
  { date: "06 Jul", visitors: 850, pageViews: 2600, conversions: 31 }
];

const INITIAL_ADMIN: AdminUser = {
  name: "Raihan Chowdhury",
  email: "raihan@fashionlegacy.live",
  role: "Lead Administrator",
  avatar: "avatar_men",
  lastLogin: new Date().toISOString()
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [trafficData, setTrafficData] = useState<TrafficData[]>(INITIAL_TRAFFIC);
  const [adminUser, setAdminUser] = useState<AdminUser>(INITIAL_ADMIN);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "info" | "success" } | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem("fl_dashboard_products");
    const savedOrders = localStorage.getItem("fl_dashboard_orders");
    const savedTraffic = localStorage.getItem("fl_dashboard_traffic");
    const savedAdmin = localStorage.getItem("fl_dashboard_admin");
    const savedAuth = localStorage.getItem("fl_dashboard_auth");

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedTraffic) setTrafficData(JSON.parse(savedTraffic));
    if (savedAdmin) setAdminUser(JSON.parse(savedAdmin));
    if (savedAuth) setIsAuthenticated(JSON.parse(savedAuth));
  }, []);

  // Sync to localStorage helpers
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem("fl_dashboard_products", JSON.stringify(newProducts));
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem("fl_dashboard_orders", JSON.stringify(newOrders));
  };

  const saveAdmin = (newAdmin: AdminUser) => {
    setAdminUser(newAdmin);
    localStorage.setItem("fl_dashboard_admin", JSON.stringify(newAdmin));
  };

  // Auth Operations
  const login = (password: string): boolean => {
    // Authenticate with specific admin credentials
    if (password === "sajolbd" || password === "abubd") {
      setIsAuthenticated(true);
      setLoginError(null);
      localStorage.setItem("fl_dashboard_auth", JSON.stringify(true));
      
      const name = password === "sajolbd" ? "Sajol" : "Abu Kawsar";
      const email = password === "sajolbd" ? "sajol@fashionlegacy.live" : "abu@fashionlegacy.live";
      
      const updatedAdmin = { 
        ...adminUser, 
        name, 
        email, 
        lastLogin: new Date().toISOString() 
      };
      saveAdmin(updatedAdmin);
      triggerNotification(`Login successful. Welcome back, ${name}!`, "success");
      return true;
    } else {
      setLoginError("Incorrect password. Access denied.");
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("fl_dashboard_auth", JSON.stringify(false));
    triggerNotification("Logged out successfully.", "info");
  };

  const updateAdminProfile = (name: string, email: string, avatar: string) => {
    const updated = { ...adminUser, name, email, avatar };
    saveAdmin(updated);
    triggerNotification("Admin profile updated successfully.", "success");
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, "id" | "rating" | "reviewsCount">) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${productData.category.split("_")[1]}-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewsCount: 0
    };
    const updated = [newProduct, ...products];
    saveProducts(updated);
    triggerNotification(`Product "${productData.nameEn}" added.`, "success");
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p));
    saveProducts(updated);
    triggerNotification(`Product was successfully updated.`, "success");
  };

  const deleteProduct = (id: string) => {
    const targetProduct = products.find((p) => p.id === id);
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    if (targetProduct) {
      triggerNotification(`Product "${targetProduct.nameEn}" deleted.`, "info");
    }
  };

  // Order Status Updates
  const updateOrderStatus = (id: string, status: "Pending" | "Shipped" | "Delivered") => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    saveOrders(updated);
    triggerNotification(`Order #${id.split("-")[1] || id} status updated to ${status}.`, "success");
  };

  // Notification triggers
  const triggerNotification = (message: string, type: "info" | "success") => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  // Simulated purchase notification trigger (e.g. from Website storefront)
  const simulatePurchase = () => {
    // Pick a random product
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    if (!randomProduct) return;

    const names = ["Sabbir Ahmed", "Nusrat Jahan", "Kamrul Islam", "Fariha Sultana", "Jamil Hossain", "Sadia Afrin"];
    const cities = ["Uttara, Dhaka", "Mirpur-10, Dhaka", "Sylhet Sadar, Sylhet", "Khulna City, Khulna", "Rajshahi Town, Rajshahi"];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const quantity = Math.floor(Math.random() * 2) + 1;
    const randomSize = randomProduct.sizes[Math.floor(Math.random() * randomProduct.sizes.length)] || "M";
    const randomColor = randomProduct.colors[Math.floor(Math.random() * randomProduct.colors.length)] || { nameEn: "Default" };

    const itemTotal = Number((randomProduct.priceUSD * quantity).toFixed(2));
    const costTotal = Number((randomProduct.costUSD * quantity).toFixed(2));

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: randomName,
      customerEmail: `${randomName.toLowerCase().replace(" ", "")}@mock.com`,
      customerAddress: `${randomCity}, Bangladesh`,
      items: [
        {
          productId: randomProduct.id,
          nameEn: randomProduct.nameEn,
          nameBn: randomProduct.nameBn,
          priceUSD: randomProduct.priceUSD,
          quantity,
          size: randomSize,
          colorEn: randomColor.nameEn
        }
      ],
      totalUSD: itemTotal,
      costUSD: costTotal,
      createdAt: new Date().toISOString(),
      status: "Pending"
    };

    // Prepend to orders list
    const newOrders = [newOrder, ...orders];
    saveOrders(newOrders);

    // Subtract from product stock
    const updatedProducts = products.map((p) => {
      if (p.id === randomProduct.id) {
        const newStock = Math.max(0, p.stock - quantity);
        return { ...p, stock: newStock };
      }
      return p;
    });
    saveProducts(updatedProducts);

    // Add conversion metrics to today's traffic
    const updatedTraffic = [...trafficData];
    const todayIndex = updatedTraffic.length - 1;
    if (todayIndex >= 0) {
      updatedTraffic[todayIndex].conversions += 1;
      updatedTraffic[todayIndex].visitors += Math.floor(Math.random() * 3) + 1;
      updatedTraffic[todayIndex].pageViews += Math.floor(Math.random() * 10) + 5;
      setTrafficData(updatedTraffic);
      localStorage.setItem("fl_dashboard_traffic", JSON.stringify(updatedTraffic));
    }

    triggerNotification(`New Purchase alert! ${randomName} bought ${quantity}x "${randomProduct.nameEn}"`, "success");
  };

  return (
    <DashboardContext.Provider
      value={{
        products,
        orders,
        trafficData,
        adminUser,
        isAuthenticated,
        loginError,
        notification,
        login,
        logout,
        updateAdminProfile,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        simulatePurchase,
        clearNotification
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
