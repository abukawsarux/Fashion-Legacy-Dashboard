"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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
  category: string | string[];
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

export interface Category {
  id: string;
  nameEn: string;
  nameBn: string;
  image: string;
}

interface DashboardContextType {
  products: Product[];
  orders: Order[];
  trafficData: TrafficData[];
  categories: Category[];
  adminUser: AdminUser;
  isAuthenticated: boolean;
  loginError: string | null;
  notification: { message: string; type: "info" | "success" } | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  updateAdminProfile: (name: string, email: string, avatar: string) => void;
  addProduct: (product: Omit<Product, "id" | "rating" | "reviewsCount">) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (categoryData: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, updatedCategory: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: "Pending" | "Shipped" | "Delivered") => void;
  simulatePurchase: () => void;
  clearNotification: () => void;
  recentLogs: { timestamp: string; action: string; details: string }[];
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
const INITIAL_PRODUCTS: Product[] = [];

const INITIAL_ORDERS: Order[] = [];

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [adminUser, setAdminUser] = useState<AdminUser>(INITIAL_ADMIN);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "info" | "success" } | null>(null);
  const [recentLogs, setRecentLogs] = useState<{ timestamp: string; action: string; details: string }[]>([]);

  const rawApiUrl = 
    process.env.NEXT_PUBLIC_API_URL || 
    (typeof window !== "undefined"
      ? (window.location.hostname.includes("fashionlegacy.live") || window.location.hostname.includes("vercel.app")
          ? "https://fashion-legacy-backend.vercel.app" 
          : `http://${window.location.hostname}:5000`)
      : "http://localhost:5000");
  const apiBaseUrl = rawApiUrl.endsWith("/") ? rawApiUrl.slice(0, -1) : rawApiUrl;

  const fetchDashboardData = useCallback(async () => {
    try {
      const [prodRes, ordRes, statRes, catRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/products`, { cache: "no-store" }),
        fetch(`${apiBaseUrl}/api/orders`, { cache: "no-store" }),
        fetch(`${apiBaseUrl}/api/analytics/stats`, { cache: "no-store" }),
        fetch(`${apiBaseUrl}/api/categories`, { cache: "no-store" })
      ]);

      if (prodRes.ok && ordRes.ok && statRes.ok && catRes.ok) {
        const prodData = await prodRes.json();
        const ordData = await ordRes.json();
        const statData = await statRes.json();
        const catData = await catRes.json();

        setProducts(prodData);
        setOrders(ordData);
        setTrafficData(statData.traffic);
        setRecentLogs(statData.recentLogs || []);
        setCategories(catData);
      }
    } catch (e) {
      console.error("Failed to load dashboard data from Backend API", e);
    }
  }, [apiBaseUrl]);

  // Load from localStorage
  useEffect(() => {
    const savedAdmin = localStorage.getItem("fl_dashboard_admin");
    const savedAuth = localStorage.getItem("fl_dashboard_auth");

    if (savedAuth && JSON.parse(savedAuth) === true) {
      setIsAuthenticated(true);
      if (savedAdmin) setAdminUser(JSON.parse(savedAdmin));
    }
  }, []);

  // Poll for updates if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchDashboardData]);

  const saveAdmin = (newAdmin: AdminUser) => {
    setAdminUser(newAdmin);
    localStorage.setItem("fl_dashboard_admin", JSON.stringify(newAdmin));
  };

  // Auth Operations
  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success && data.admin) {
        setIsAuthenticated(true);
        setLoginError(null);
        localStorage.setItem("fl_dashboard_auth", JSON.stringify(true));
        saveAdmin(data.admin);
        triggerNotification(`Login successful. Welcome back, ${data.admin.name}!`, "success");
        return true;
      } else {
        setLoginError(data.error || "Incorrect password. Access denied.");
        return false;
      }
    } catch (e) {
      console.error("Admin login API failed", e);
      setLoginError("Failed to connect to authentication server.");
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("fl_dashboard_auth", JSON.stringify(false));
    localStorage.removeItem("fl_dashboard_admin");
    triggerNotification("Logged out successfully.", "info");
  };

  const updateAdminProfile = (name: string, email: string, avatar: string) => {
    const updated = { ...adminUser, name, email, avatar };
    saveAdmin(updated);
    triggerNotification("Admin profile updated successfully.", "success");
  };

  // Category CRUD
  const addCategory = async (categoryData: Omit<Category, "id">) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData)
      });
      if (res.ok) {
        fetchDashboardData();
        triggerNotification(`Category "${categoryData.nameEn}" added successfully.`, "success");
      }
    } catch (e) {
      console.error("Failed to add category", e);
    }
  };

  const updateCategory = async (id: string, updatedCategory: Partial<Category>) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategory)
      });
      if (res.ok) {
        fetchDashboardData();
        triggerNotification(`Category was successfully updated.`, "success");
      }
    } catch (e) {
      console.error("Failed to update category", e);
    }
  };

  const deleteCategory = async (id: string) => {
    const targetCat = categories.find((c) => c.id === id);
    try {
      const res = await fetch(`${apiBaseUrl}/api/categories/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchDashboardData();
        if (targetCat) {
          triggerNotification(`Category "${targetCat.nameEn}" deleted.`, "info");
        }
      }
    } catch (e) {
      console.error("Failed to delete category", e);
    }
  };

  // Product CRUD
  const addProduct = async (productData: Omit<Product, "id" | "rating" | "reviewsCount">) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        fetchDashboardData();
        triggerNotification(`Product "${productData.nameEn}" added successfully.`, "success");
      }
    } catch (e) {
      console.error("Failed to add product", e);
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) {
        fetchDashboardData();
        triggerNotification(`Product was successfully updated.`, "success");
      }
    } catch (e) {
      console.error("Failed to update product", e);
    }
  };

  const deleteProduct = async (id: string) => {
    const targetProduct = products.find((p) => p.id === id);
    try {
      const res = await fetch(`${apiBaseUrl}/api/products/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchDashboardData();
        if (targetProduct) {
          triggerNotification(`Product "${targetProduct.nameEn}" deleted.`, "info");
        }
      }
    } catch (e) {
      console.error("Failed to delete product", e);
    }
  };

  // Order Status Updates
  const updateOrderStatus = async (id: string, status: "Pending" | "Shipped" | "Delivered") => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDashboardData();
        triggerNotification(`Order #${id.split("-")[1] || id} status updated to ${status}.`, "success");
      }
    } catch (e) {
      console.error("Failed to update order status", e);
    }
  };

  // Notification triggers
  const triggerNotification = (message: string, type: "info" | "success") => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  // Simulated purchase notification trigger (e.g. from Website storefront)
  const simulatePurchase = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/analytics/simulate`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        fetchDashboardData();
        triggerNotification(`New Purchase simulated! ${data.order?.customerName} bought ${data.order?.items[0]?.nameEn}`, "success");
      }
    } catch (e) {
      console.error("Failed to simulate purchase", e);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        products,
        orders,
        trafficData,
        categories,
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
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
        simulatePurchase,
        clearNotification,
        recentLogs
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
