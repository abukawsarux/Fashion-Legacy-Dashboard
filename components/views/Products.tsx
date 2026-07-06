"use client";

import React, { useState } from "react";
import { useDashboard, Product, CATEGORIES } from "../../context/DashboardContext";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  DollarSign, 
  Check,
  AlertTriangle
} from "lucide-react";

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useDashboard();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog Open States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // Active product target for edit/delete operations
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);

  // Form Field States
  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [category, setCategory] = useState<Product["category"]>("cat_hot");
  const [costUSD, setCostUSD] = useState("0");
  const [priceUSD, setPriceUSD] = useState("0");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [stock, setStock] = useState(50);
  const [sizesInput, setSizesInput] = useState("S, M, L");
  const [colorHex, setColorHex] = useState("#000000");
  const [colorNameEn, setColorNameEn] = useState("Stealth Black");
  const [colorNameBn, setColorNameBn] = useState("কালো");

  // Filtering products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = 
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameBn.includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate markup/profit details for dialogs
  const calculateMargin = (cost: string, price: string) => {
    const costVal = parseFloat(cost) || 0;
    const priceVal = parseFloat(price) || 0;
    if (priceVal === 0) return 0;
    const profit = priceVal - costVal;
    return ((profit / priceVal) * 100).toFixed(1);
  };

  const calculateProfit = (cost: string, price: string) => {
    const costVal = parseFloat(cost) || 0;
    const priceVal = parseFloat(price) || 0;
    return (priceVal - costVal).toFixed(2);
  };

  // Reset form
  const resetForm = () => {
    setNameEn("");
    setNameBn("");
    setDescriptionEn("");
    setDescriptionBn("");
    setCategory("cat_hot");
    setCostUSD("0");
    setPriceUSD("0");
    setDiscountPercent(0);
    setStock(50);
    setSizesInput("S, M, L");
    setColorHex("#000000");
    setColorNameEn("Stealth Black");
    setColorNameBn("কালো");
    setTargetProduct(null);
  };

  // Trigger Add Modal
  const openCreateDialog = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  // Trigger Edit Modal
  const openEditDialog = (product: Product) => {
    setTargetProduct(product);
    setNameEn(product.nameEn);
    setNameBn(product.nameBn);
    setDescriptionEn(product.descriptionEn);
    setDescriptionBn(product.descriptionBn);
    setCategory(product.category);
    setCostUSD(product.costUSD.toString());
    setPriceUSD(product.priceUSD.toString());
    setDiscountPercent(product.discountPercent);
    setStock(product.stock);
    setSizesInput(product.sizes.join(", "));
    
    // Pick the first color if existing
    if (product.colors && product.colors.length > 0) {
      setColorHex(product.colors[0].hex);
      setColorNameEn(product.colors[0].nameEn);
      setColorNameBn(product.colors[0].nameBn);
    } else {
      setColorHex("#000000");
      setColorNameEn("Default Black");
      setColorNameBn("কালো");
    }
    
    setIsEditOpen(true);
  };

  // Save new product
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !priceUSD || !costUSD) return;

    const sizes = sizesInput.split(",").map(s => s.trim()).filter(s => s.length > 0);
    
    addProduct({
      nameEn,
      nameBn: nameBn || nameEn,
      descriptionEn,
      descriptionBn: descriptionBn || descriptionEn,
      category,
      costUSD: parseFloat(costUSD) || 0,
      priceUSD: parseFloat(priceUSD) || 0,
      discountPercent: discountPercent || 0,
      images: ["/images/logo.png"], // fallback placeholder
      sizes,
      colors: [{ nameEn: colorNameEn, nameBn: colorNameBn, hex: colorHex }],
      stock: stock || 0
    });

    setIsCreateOpen(false);
    resetForm();
  };

  // Update existing product
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProduct || !nameEn || !priceUSD || !costUSD) return;

    const sizes = sizesInput.split(",").map(s => s.trim()).filter(s => s.length > 0);

    updateProduct(targetProduct.id, {
      nameEn,
      nameBn: nameBn || nameEn,
      descriptionEn,
      descriptionBn: descriptionBn || descriptionEn,
      category,
      costUSD: parseFloat(costUSD) || 0,
      priceUSD: parseFloat(priceUSD) || 0,
      discountPercent: discountPercent || 0,
      sizes,
      colors: [{ nameEn: colorNameEn, nameBn: colorNameBn, hex: colorHex }],
      stock: stock || 0
    });

    setIsEditOpen(false);
    resetForm();
  };

  // Trigger Delete confirmation
  const openDeleteDialog = (product: Product) => {
    setTargetProduct(product);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (targetProduct) {
      deleteProduct(targetProduct.id);
      setIsDeleteConfirmOpen(false);
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name, Bangle, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary transition-colors"
          />
        </div>
        
        {/* Add Product Button */}
        <button
          onClick={openCreateDialog}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#740108] hover:bg-[#5c0006] text-white rounded-xl text-xs font-black tracking-wide shadow-md shadow-red-950/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeCategory === "all"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeCategory === cat.id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {cat.nameEn} ({cat.nameBn})
          </button>
        ))}
      </div>

      {/* Product List Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-5">Product Name</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Buying Price (Cost)</th>
                <th className="py-3.5 px-5">Sell Price</th>
                <th className="py-3.5 px-5">Gross Margin</th>
                <th className="py-3.5 px-5">Stock Level</th>
                <th className="py-3.5 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const profit = p.priceUSD - p.costUSD;
                  const marginPercent = p.priceUSD > 0 ? ((profit / p.priceUSD) * 100).toFixed(1) : "0";
                  
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-5 font-semibold text-slate-500">{p.id}</td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-800">{p.nameEn}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{p.nameBn}</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[9px]">
                          {CATEGORIES.find(c => c.id === p.category)?.nameEn || p.category}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-semibold text-slate-500">
                        ৳{p.costUSD.toFixed(2)}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-800">
                        ৳{p.priceUSD.toFixed(2)}
                        {p.discountPercent > 0 && (
                          <span className="text-[9px] text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.2 rounded ml-1.5 font-bold">
                            -{p.discountPercent}%
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-emerald-600">৳{profit.toFixed(2)}</div>
                        <div className="text-[9px] text-slate-400">Margin: {marginPercent}%</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            p.stock <= 15 ? "bg-red-500 animate-pulse" :
                            p.stock <= 40 ? "bg-amber-500" :
                            "bg-emerald-500"
                          }`} />
                          <span className="font-bold text-slate-700">{p.stock} units</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditDialog(p)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => openDeleteDialog(p)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-medium">
                    No products found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE DIALOG POPUP */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800">Add New Inventory Product</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreate} className="p-6 space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name English */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Product Name (EN) *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Premium Cotton Polo Shirt"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                  />
                </div>
                {/* Name Bangla */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Product Name (BN)</label>
                  <input
                    type="text"
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    placeholder="যেমনঃ প্রিমিয়াম কটন পোলো শার্ট"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Description EN */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Description (English)</label>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Enter details of the product attributes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category select */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Product["category"])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.nameEn}</option>
                    ))}
                  </select>
                </div>
                {/* Stock */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Initial Stock Count</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                  />
                </div>
                {/* Sizes comma-separated */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Available Sizes</label>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="Comma separated: S, M, L"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* BUYING PRICE & SELLING PRICE COMPONENT */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1.5">Pricing & Financial Calculations</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Cost Price */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <span>Buying Price (Cost) *</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-sans">৳</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={costUSD}
                        onChange={(e) => setCostUSD(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary bg-white"
                      />
                    </div>
                  </div>

                  {/* Selling Price */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <span>Selling Price *</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-sans">৳</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={priceUSD}
                        onChange={(e) => setPriceUSD(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary bg-white"
                      />
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Discount Percent (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary bg-white"
                    />
                  </div>
                </div>

                {/* Estimate Outputs */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 bg-white border border-slate-100 p-3 rounded-xl shadow-inner">
                  <div>Estimated Profit Margin:</div>
                  <div className="flex gap-4">
                    <div>Profit: <span className="text-emerald-600 font-extrabold">৳{calculateProfit(costUSD, priceUSD)}</span></div>
                    <div>Margin: <span className="text-brand-primary font-extrabold">{calculateMargin(costUSD, priceUSD)}%</span></div>
                  </div>
                </div>
              </div>

              {/* Color Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Color Hex Code</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="h-8 w-12 rounded border border-slate-200 cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{colorHex}</span>
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Color Name (EN)</label>
                  <input
                    type="text"
                    value={colorNameEn}
                    onChange={(e) => setColorNameEn(e.target.value)}
                    placeholder="e.g. Navy Blue"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Color Name (BN)</label>
                  <input
                    type="text"
                    value={colorNameBn}
                    onChange={(e) => setColorNameBn(e.target.value)}
                    placeholder="যেমনঃ নেভি ব্লু"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#740108] hover:bg-[#5c0006] text-white rounded-xl text-xs font-bold cursor-pointer shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DIALOG POPUP */}
      {isEditOpen && targetProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800">Edit Product: {targetProduct.id}</h3>
              <button onClick={() => setIsEditOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Product Name (EN) *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Product Name (BN)</label>
                  <input
                    type="text"
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Description (English)</label>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Product["category"])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Inventory Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Available Sizes</label>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* BUYING PRICE & SELLING PRICE COMPONENT */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1.5">Pricing & Financial Calculations</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Cost Price */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Buying Price (Cost) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-sans">৳</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={costUSD}
                        onChange={(e) => setCostUSD(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary bg-white"
                      />
                    </div>
                  </div>

                  {/* Selling Price */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Selling Price *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-sans">৳</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={priceUSD}
                        onChange={(e) => setPriceUSD(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary bg-white"
                      />
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Discount Percent (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary bg-white"
                    />
                  </div>
                </div>

                {/* Estimate Outputs */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 bg-white border border-slate-100 p-3 rounded-xl shadow-inner">
                  <div>Estimated Profit Margin:</div>
                  <div className="flex gap-4">
                    <div>Profit: <span className="text-emerald-600 font-extrabold">৳{calculateProfit(costUSD, priceUSD)}</span></div>
                    <div>Margin: <span className="text-brand-primary font-extrabold">{calculateMargin(costUSD, priceUSD)}%</span></div>
                  </div>
                </div>
              </div>

              {/* Color Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Color Hex Code</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="h-8 w-12 rounded border border-slate-200 cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{colorHex}</span>
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Color Name (EN)</label>
                  <input
                    type="text"
                    value={colorNameEn}
                    onChange={(e) => setColorNameEn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Color Name (BN)</label>
                  <input
                    type="text"
                    value={colorNameBn}
                    onChange={(e) => setColorNameBn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#740108] hover:bg-[#5c0006] text-white rounded-xl text-xs font-bold cursor-pointer shadow-md"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {isDeleteConfirmOpen && targetProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDeleteConfirmOpen(false)} />
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-800">Confirm Product Deletion</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to permanently delete the product <span className="font-bold text-slate-800">"{targetProduct.nameEn}"</span> (ID: {targetProduct.id}) from the Fashion Legacy database? This action is irreversible.
            </p>

            <div className="pt-3 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
