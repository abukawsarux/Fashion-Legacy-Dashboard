// components/views/Categories.tsx
"use client";

import React, { useState } from "react";
import { useDashboard, Category } from "../../context/DashboardContext";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Upload, 
  AlertTriangle 
} from "lucide-react";
import Image from "next/image";

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useDashboard();
  
  const getImageUrl = (imgStr: string) => {
    if (!imgStr) return "/images/categories/all.png";
    if (imgStr.startsWith("data:")) return imgStr;
    if (imgStr.startsWith("/") && !imgStr.startsWith("/images/")) {
      const rawUrl = 
        process.env.NEXT_PUBLIC_API_URL || 
        (typeof window !== "undefined"
          ? (window.location.hostname.includes("fashionlegacy.live") || window.location.hostname.includes("vercel.app")
              ? "https://fashion-legacy-backend.vercel.app" 
              : `http://${window.location.hostname}:5000`)
          : "http://localhost:5000");
      const apiBaseUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
      return `${apiBaseUrl}${imgStr}`;
    }
    return imgStr;
  };
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog / Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  // Form states
  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [image, setImage] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Confirmation state
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);

  // Search Filter
  const filteredCategories = categories.filter(c => 
    c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nameBn.includes(searchQuery) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset form helper
  const resetForm = () => {
    setNameEn("");
    setNameBn("");
    setImage("");
    setUploadError("");
  };

  // Utility to compress image file using Canvas
  const compressImage = (file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => {
          resolve(event.target?.result as string); // fallback on load error
        };
      };
      reader.onerror = () => {
        resolve(""); // fallback
      };
    });
  };

  // Image Upload handler (Base64)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    try {
      const compressedBase64 = await compressImage(file);
      if (compressedBase64) {
        setImage(compressedBase64);
      } else {
        setUploadError("Failed to compress image.");
      }
    } catch (err) {
      setUploadError("Failed to parse image file.");
    }
  };

  // Create submission
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim() || !nameBn.trim()) return;

    await addCategory({
      nameEn: nameEn.trim(),
      nameBn: nameBn.trim(),
      image: image || "/images/categories/all.png"
    });

    setIsCreateOpen(false);
    resetForm();
  };

  // Open Edit Modal
  const openEditDialog = (cat: Category) => {
    setSelectedCat(cat);
    setNameEn(cat.nameEn);
    setNameBn(cat.nameBn);
    setImage(cat.image);
    setIsEditOpen(true);
  };

  // Edit submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat || !nameEn.trim() || !nameBn.trim()) return;

    await updateCategory(selectedCat.id, {
      nameEn: nameEn.trim(),
      nameBn: nameBn.trim(),
      image: image
    });

    setIsEditOpen(false);
    setSelectedCat(null);
    resetForm();
  };

  // Confirm delete handler
  const triggerDeleteConfirm = (cat: Category) => {
    setCatToDelete(cat);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmedDelete = async () => {
    if (catToDelete) {
      await deleteCategory(catToDelete.id);
      setIsConfirmDeleteOpen(false);
      setCatToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Category Inventory Catalog</h2>
          <p className="text-xs text-slate-500">Manage the collection directories of the storefront</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#D4A017] hover:bg-[#5c0006] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer select-none"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* 2. SEARCH UTILITIES */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary focus:bg-white transition-all text-slate-700 font-medium"
          />
        </div>
        <span className="text-[11px] font-bold text-slate-400 self-end sm:self-auto uppercase">
          Total Categories: {categories.length}
        </span>
      </div>

      {/* 3. CATEGORIES GRID SHOWCASE */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-3">
          <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search size={20} />
          </div>
          <h4 className="text-xs font-bold text-slate-700 uppercase">No matching categories found</h4>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">Try refining your search filter query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <div 
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Image Preview & ID Tag */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative aspect-[4/3] overflow-hidden">
                <div className="relative h-20 w-20 rounded-full overflow-hidden border border-slate-200/50 shadow-inner bg-white flex items-center justify-center">
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.nameEn}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-800 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                  {cat.id}
                </span>
              </div>

              {/* Metadata & Actions */}
              <div className="p-4 space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">{cat.nameEn}</h3>
                  <h4 className="text-xs font-medium text-slate-500">{cat.nameBn}</h4>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openEditDialog(cat)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition-colors cursor-pointer uppercase"
                  >
                    <Edit size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => triggerDeleteConfirm(cat)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] transition-colors cursor-pointer uppercase"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================= */}
      {/* 4. CREATE MODAL DIALOG */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Create New Category</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Winter Wear"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Category Name (Bengali) *</label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: শীতকালীন পোশাক"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                />
              </div>

              {/* Image Uploader */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase block">Category Logo / Image</label>
                <div className="flex items-center gap-4">
                  {image ? (
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-white">
                      <img src={getImageUrl(image)} alt="preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 hover:scale-105 active:scale-95 shadow-sm transition-transform cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <label className="h-16 w-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-primary flex flex-col items-center justify-center text-slate-400 hover:text-brand-primary transition-colors cursor-pointer bg-slate-50 flex-shrink-0">
                      <Upload size={16} />
                      <span className="text-[8px] font-bold uppercase mt-1">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  <div className="text-[10px] text-slate-400 font-medium">
                    Recommended: Transparent PNG or square image. Max size: 10MB.
                  </div>
                </div>
                {uploadError && (
                  <p className="text-[9px] font-bold text-red-600 animate-pulse mt-1">{uploadError}</p>
                )}
              </div>

              <div className="flex gap-3 justify-end border-t border-slate-100 pt-3.5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4A017] hover:bg-[#5c0006] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-900/10 cursor-pointer select-none"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* 5. EDIT MODAL DIALOG */}
      {isEditOpen && selectedCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Edit Category: {selectedCat.nameEn}</h3>
              <button onClick={() => { setIsEditOpen(false); setSelectedCat(null); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Winter Wear"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Category Name (Bengali) *</label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: শীতকালীন পোশাক"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-primary"
                />
              </div>

              {/* Image Uploader */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase block">Category Logo / Image</label>
                <div className="flex items-center gap-4">
                  {image ? (
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-white">
                      <img src={getImageUrl(image)} alt="preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 hover:scale-105 active:scale-95 shadow-sm transition-transform cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <label className="h-16 w-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-primary flex flex-col items-center justify-center text-slate-400 hover:text-brand-primary transition-colors cursor-pointer bg-slate-50 flex-shrink-0">
                      <Upload size={16} />
                      <span className="text-[8px] font-bold uppercase mt-1">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  <div className="text-[10px] text-slate-400 font-medium">
                    Recommended: Transparent PNG or square image. Max size: 10MB.
                  </div>
                </div>
                {uploadError && (
                  <p className="text-[9px] font-bold text-red-600 animate-pulse mt-1">{uploadError}</p>
                )}
              </div>

              <div className="flex gap-3 justify-end border-t border-slate-100 pt-3.5">
                <button
                  type="button"
                  onClick={() => { setIsEditOpen(false); setSelectedCat(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4A017] hover:bg-[#5c0006] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-900/10 cursor-pointer select-none"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* 6. DELETE CONFIRMATION DIALOG */}
      {isConfirmDeleteOpen && catToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Confirm Category Removal</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to delete the category <span className="font-bold text-slate-700">"{catToDelete.nameEn}"</span>? Products that belong to this category will remain, but will no longer be filterable by this category.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-slate-100 pt-3.5">
              <button
                type="button"
                onClick={() => { setIsConfirmDeleteOpen(false); setCatToDelete(null); }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer select-none"
              >
                Keep Category
              </button>
              <button
                type="button"
                onClick={handleConfirmedDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-900/10 cursor-pointer select-none"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
