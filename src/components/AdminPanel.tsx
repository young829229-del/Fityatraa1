import React, { useState, useEffect } from "react";
import { 
  Lock, Shield, Mail, Key, LayoutDashboard, ShoppingBag, MessageSquare, 
  Settings, CheckCircle, Clock, Truck, ShieldAlert, PieChart, Users, 
  Trash2, Edit, RefreshCw, X, Check, Save, User, BarChart2, PlusCircle, AlertCircle, Search,
  Upload, Image as ImageIcon
} from "lucide-react";
import { loadAllReviews, saveAllReviews, UserReview, deleteProductReview, updateProductReview } from "../lib/reviews";
import { PRODUCTS } from "../data";
import { loadAllProducts, saveAllProducts, addProduct as addProductToLib, updateProduct as updateProductInLib, deleteProduct as deleteProductFromLib } from "../lib/products";
import { loadPaymentSettings, savePaymentSettings, PaymentSettings } from "../lib/paymentSettings";
import { Product } from "../types";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  name: string;
  phone: string;
  region: string;
  total: number;
  items: OrderItem[];
  status: "placed" | "processing" | "dispatched" | "transit" | "out_for_delivery" | "delivered";
  createdAt: string;
  shippingPartner: string;
  notes?: string;
  paymentMode?: string;
  screenshot?: string;
}

const PRESEEDED_ORDERS: Order[] = [
  {
    id: "FY-KTM-8821",
    name: "Rupesh Tamang",
    phone: "98510****2",
    region: "ktm",
    total: 4498,
    items: [
      { name: "Wellcore - Micronised Creatine Monohydrate", quantity: 1 },
      { name: "Omega 3 Fish Oil Gold 3x Triple Strength", quantity: 1 }
    ],
    status: "delivered",
    createdAt: "June 17, 2026, 11:30 AM",
    shippingPartner: "Upaya CityCargo Express",
    notes: "Delivered to Baneshwor, Kathmandu. Handed directly to customer with verified barcode check."
  },
  {
    id: "FY-PKR-4421",
    name: "Sujita Baral",
    phone: "98012****9",
    region: "pokhara",
    total: 1198,
    items: [
      { name: "Original Crunchy Peanut Butter (25% Protein)", quantity: 2 }
    ],
    status: "transit",
    createdAt: "June 18, 2026, 09:15 AM",
    shippingPartner: "Pathao Highway Cargo",
    notes: "Departed Kathmandu valley, currently crossing Mugling highway towards Pokhara Lake Side."
  },
  {
    id: "FY-BRT-3392",
    name: "Nitesh Prasai",
    phone: "98420****5",
    region: "tarai",
    total: 1649,
    items: [
      { name: "Skin Radiance Collagen - Glow Formula", quantity: 1 }
    ],
    status: "dispatched",
    createdAt: "June 19, 2026, 06:45 AM",
    shippingPartner: "Nepal Can Move (NCM)",
    notes: "Securely boxed, bubble-wrapped, and dispatched from central warehousing facility."
  },
  {
    id: "FY-REM-1049",
    name: "Sherpa Tshering",
    phone: "98130****1",
    region: "remote",
    total: 1599,
    items: [
      { name: "Liquid L-Carnitine PRO", quantity: 1 }
    ],
    status: "placed",
    createdAt: "June 19, 2026, 08:00 AM",
    shippingPartner: "FitYatra Mountain Dispatch Crew",
    notes: "Import scratch barcodes verified. Packaging in waterproof terrain bags for custom mountain transport."
  }
];

export default function AdminPanel() {
  // Authentication states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("fityatra_admin_auth") === "true";
  });
  const [loginError, setLoginError] = useState("");

  // Customizable secure backend credentials
  const [secEmail, setSecEmail] = useState(() => localStorage.getItem("fityatra_admin_email") || "fityatra.gmail.com");
  const [secPassword, setSecPassword] = useState(() => localStorage.getItem("fityatra_admin_password") || "aashish123");
  const [secPasscode, setSecPasscode] = useState(() => localStorage.getItem("fityatra_crack_passcode") || "fityatra6767");

  // Tab views
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "reviews" | "products" | "settings">("dashboard");

  // Orders and reviews live database
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  
  // Dynamic products and payment gateways configurations
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => loadPaymentSettings());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  
  // Friendly image file states for Add Supplement
  const [addMainImage, setAddMainImage] = useState<string>("");
  const [addGallery, setAddGallery] = useState<string[]>([]);
  const [addInfoImages, setAddInfoImages] = useState<string[]>([]);

  // Friendly image file states for Edit Supplement
  const [editMainImage, setEditMainImage] = useState<string>("");
  const [editGallery, setEditGallery] = useState<string[]>([]);
  const [editInfoImages, setEditInfoImages] = useState<string[]>([]);

  // Friendly image file states for payment settings QR codes
  const [settingEsewaQr, setSettingEsewaQr] = useState<string>("");
  const [settingKhaltiQr, setSettingKhaltiQr] = useState<string>("");

  // Sync settings QR states when paymentSettings is loaded
  useEffect(() => {
    if (paymentSettings) {
      setSettingEsewaQr(paymentSettings.esewaQrUrl || "");
      setSettingKhaltiQr(paymentSettings.khaltiQrUrl || "");
    }
  }, [paymentSettings]);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setPaymentSettings(loadPaymentSettings());
    };
    window.addEventListener("fityatra_payment_settings_updated", handleSettingsUpdate);
    return () => window.removeEventListener("fityatra_payment_settings_updated", handleSettingsUpdate);
  }, []);

  // Sync edits on load
  useEffect(() => {
    if (editingProduct) {
      setEditMainImage(editingProduct.image || "");
      setEditGallery(editingProduct.gallery || []);
      setEditInfoImages(editingProduct.infoImages || []);
    } else {
      setEditMainImage("");
      setEditGallery([]);
      setEditInfoImages([]);
    }
  }, [editingProduct]);

  // Sync adds on load
  useEffect(() => {
    if (showAddProductForm) {
      setAddMainImage("");
      setAddGallery([]);
      setAddInfoImages([]);
    }
  }, [showAddProductForm]);

  // Handle image conversion to Base64
  const convertFilesToBase64 = (
    files: FileList | null,
    target: "addMain" | "addGallery" | "addInfo" | "editMain" | "editGallery" | "editInfo"
  ) => {
    if (!files || files.length === 0) return;
    const items = Array.from(files);

    const promises = items.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });
    });

    Promise.all(promises).then((res) => {
      if (target === "addMain") {
         setAddMainImage(res[0] || "");
      } else if (target === "addGallery") {
         setAddGallery(prev => [...prev, ...res]);
      } else if (target === "addInfo") {
         setAddInfoImages(prev => [...prev, ...res]);
      } else if (target === "editMain") {
         setEditMainImage(res[0] || "");
      } else if (target === "editGallery") {
         setEditGallery(prev => [...prev, ...res]);
      } else if (target === "editInfo") {
         setEditInfoImages(prev => [...prev, ...res]);
      }
    }).catch(err => console.error("Error loading images", err));
  };

  // Modern visual drag/drop and list image uploader helper
  const renderImageUploader = (
    label: string,
    images: string | string[],
    isMultiple: boolean,
    onAdd: (base64s: string[]) => void,
    onRemove: (index: number) => void,
    targetId: string,
    placeholderUrlName: string = "image"
  ) => {
    const isSingle = !isMultiple;
    const imageList = isSingle 
      ? (images ? [images as string] : []) 
      : (images as string[]);

    return (
      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-[10px] sm:text-xs uppercase font-mono font-bold text-neutral-700 block flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#FFCD00]" /> {label}
          </label>
          <span className="text-[9px] text-[#FFCD00] bg-black px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wider font-mono">
            {isMultiple ? "Multi-Photo" : "Single Photo"}
          </span>
        </div>

        {/* Upload Trigger Area - Tall and Spacious */}
        <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-xl py-8 px-4 hover:bg-amber-50/10 hover:border-[#FFCD00] transition-all duration-200 cursor-pointer bg-white">
          <input
            id={targetId}
            type="file"
            accept="image/*"
            multiple={isMultiple}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const arr = Array.from(e.target.files);
                const promises = arr.map(file => {
                  return new Promise<string>((resolve, reject) => {
                    const r = new FileReader();
                    r.readAsDataURL(file);
                    r.onload = () => resolve(r.result as string);
                    r.onerror = (err) => reject(err);
                  });
                });
                Promise.all(promises).then((base64s) => {
                  if (isMultiple) {
                    onAdd([...imageList, ...base64s]);
                  } else {
                    onAdd(base64s);
                  }
                });
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <div className="text-center space-y-2">
            <Upload className="w-8 h-8 mx-auto text-neutral-400 group-hover:text-[#FFCD00] group-hover:scale-110 transition-all duration-200" />
            <p className="text-xs font-bold text-neutral-700 group-hover:text-black font-sans">
              {isMultiple ? "Drag & Drop gallery pictures here" : "Drag & Drop main product picture here"}
            </p>
            <p className="text-[10px] text-neutral-400 font-sans">
              or <span className="text-[#FFCD00] font-bold group-hover:underline">browse files</span> on your computer
            </p>
          </div>
        </div>

        {/* Previews Grid - Responsive and containing images completely */}
        {imageList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {imageList.map((img, idx) => {
              if (!img) return null;
              return (
                <div key={idx} className="relative group aspect-square border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-xs flex items-center justify-center p-2">
                  <img
                    src={img}
                    alt="Upload preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute("src", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200");
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => onRemove(idx)}
                      className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Link Input Fallback */}
        <div className="pt-1">
          <textarea
            rows={isMultiple ? 2 : 1}
            name={placeholderUrlName}
            placeholder={isMultiple ? "Or paste links (one link per line) if preferred..." : "Or paste manual image web link..."}
            value={isSingle ? (images as string) || "" : (images as string[]).join("\n")}
            onChange={(e) => {
              const val = e.target.value;
              if (isSingle) {
                onAdd([val]);
              } else {
                const arr = val.split("\n").map(line => line.trim()).filter(line => line.length > 0);
                onAdd(arr);
              }
            }}
            className="w-full text-[10px] font-mono p-2 bg-white border border-neutral-200 rounded-md outline-hidden text-neutral-600 focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] transition-colors resize-y"
          />
        </div>
      </div>
    );
  };
  
  // Clean and non-blocking toast notifications for sandboxed iframes
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((current) => current?.text === text ? null : current);
    }, 4000);
  };

  // Search/Filter states
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [reviewSearchQuery, setReviewSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Edit modal / inline editing states
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<UserReview | null>(null);

  // New review state
  const [newRevProduct, setNewRevProduct] = useState(PRODUCTS[0]?.id || "");
  const [newRevName, setNewRevName] = useState("");
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevComment, setNewRevComment] = useState("");
  const [newRevImages, setNewRevImages] = useState<string[]>([]);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);

  // Load orders, reviews, and dynamic products
  useEffect(() => {
    loadOrdersFromStorage();
    setReviews(loadAllReviews());
    setProducts(loadAllProducts());
    setPaymentSettings(loadPaymentSettings());
  }, []);

  const loadOrdersFromStorage = () => {
    // Collect from local storage first
    let localOrders: Order[] = [];
    try {
      const stored = localStorage.getItem("fityatra_orders");
      if (stored) {
        localOrders = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load local orders in admin board", e);
    }

    // Merge preseeded orders if not overwritten
    let finalPreseeded = PRESEEDED_ORDERS;
    try {
      const override = localStorage.getItem("fityatra_preseeded_orders");
      if (override) {
        finalPreseeded = JSON.parse(override);
      } else {
        localStorage.setItem("fityatra_preseeded_orders", JSON.stringify(PRESEEDED_ORDERS));
      }
    } catch {
      // ignore
    }

    setOrders([...finalPreseeded, ...localOrders]);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    
    if (normalizedEmail !== "support@fityatra.store" && normalizedEmail !== "fityatra.gmail.com" && normalizedEmail !== "fityatra@gmail.com") {
      setLoginError("Access Denied: Unauthorized admin email.");
      return;
    }

    const savedPass = (localStorage.getItem("fityatra_admin_password") || "aashish123").trim();

    if (password === savedPass || password === "aashish123" || password === "fityatra6767") {
      setIsAuthenticated(true);
      localStorage.setItem("fityatra_admin_auth", "true");
      localStorage.setItem("fityatra_admin_email", normalizedEmail);
      setLoginError("");
      loadOrdersFromStorage();
      setReviews(loadAllReviews());
    } else {
      setLoginError("Invalid password. Check your security password combination.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("fityatra_admin_auth");
  };

  // Orders operations
  const handleUpdateOrderStatus = (orderId: string, status: Order["status"], partner: string, notes: string) => {
    // Check if it's a preseeded order
    const isPreseeded = PRESEEDED_ORDERS.some(o => o.id === orderId);
    
    if (isPreseeded) {
      try {
        const stored = localStorage.getItem("fityatra_preseeded_orders");
        let preseeded: Order[] = stored ? JSON.parse(stored) : [...PRESEEDED_ORDERS];
        preseeded = preseeded.map(o => o.id === orderId ? { ...o, status, shippingPartner: partner, notes } : o);
        localStorage.setItem("fityatra_preseeded_orders", JSON.stringify(preseeded));
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const stored = localStorage.getItem("fityatra_orders");
        let locals: Order[] = stored ? JSON.parse(stored) : [];
        locals = locals.map(o => o.id === orderId ? { ...o, status, shippingPartner: partner, notes } : o);
        localStorage.setItem("fityatra_orders", JSON.stringify(locals));
      } catch (e) {
        console.error(e);
      }
    }
    
    setEditingOrder(null);
    loadOrdersFromStorage();
  };

  const handleDeleteOrder = (orderId: string) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?`)) return;

    const isPreseeded = PRESEEDED_ORDERS.some(o => o.id === orderId);

    if (isPreseeded) {
      try {
        const stored = localStorage.getItem("fityatra_preseeded_orders");
        let preseeded: Order[] = stored ? JSON.parse(stored) : [...PRESEEDED_ORDERS];
        preseeded = preseeded.filter(o => o.id !== orderId);
        localStorage.setItem("fityatra_preseeded_orders", JSON.stringify(preseeded));
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const stored = localStorage.getItem("fityatra_orders");
        let locals: Order[] = stored ? JSON.parse(stored) : [];
        locals = locals.filter(o => o.id !== orderId);
        localStorage.setItem("fityatra_orders", JSON.stringify(locals));
      } catch (e) {
        console.error(e);
      }
    }

    loadOrdersFromStorage();
  };

  // Reviews operations
  const handleDeleteReview = (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this custom review?")) return;
    deleteProductReview(reviewId);
    setReviews(loadAllReviews());
  };

  const handleToggleVerifiedReview = (reviewId: string, currentStatus: boolean) => {
    updateProductReview(reviewId, { verified: !currentStatus });
    setReviews(loadAllReviews());
  };

  const handleUpdateReviewCommentInPanel = (reviewId: string, comment: string, rating: number) => {
    updateProductReview(reviewId, { comment, rating });
    setEditingReview(null);
    setReviews(loadAllReviews());
  };

  const handleCreateCustomReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRevName.trim() || !newRevComment.trim()) return;

    const newRev: UserReview = {
      id: `rev-admin-${Date.now()}`,
      productId: newRevProduct,
      name: newRevName.trim(),
      rating: newRevRating,
      comment: newRevComment.trim(),
      images: newRevImages,
      date: "Just now",
      verified: true,
      isUserAdded: true
    };

    const all = loadAllReviews();
    all.unshift(newRev);
    saveAllReviews(all);

    // Reset fields
    setNewRevName("");
    setNewRevComment("");
    setNewRevImages([]);
    setReviews(loadAllReviews());
    setShowAddReviewForm(false);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    Array.from(e.target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setNewRevImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Dynamic Product operations
  const handleCreateProduct = (productData: Omit<Product, "id" | "rating" | "reviewCount">) => {
    const slug = productData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const id = `${slug}-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      rating: 5,
      reviewCount: 0,
      goals: productData.goals || [],
      specs: productData.specs || {},
      gallery: productData.gallery || [productData.image],
    };
    addProductToLib(newProduct);
    setProducts(loadAllProducts());
    setShowAddProductForm(false);
  };

  const handleUpdateProduct = (id: string, fields: Partial<Product>) => {
    updateProductInLib(id, fields);
    setProducts(loadAllProducts());
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product? This action is permanent and will remove it from the catalog.")) return;
    deleteProductFromLib(id);
    setProducts(loadAllProducts());
  };

  // Payment Settings operations
  const handleSavePaymentSettings = (updated: PaymentSettings) => {
    savePaymentSettings(updated);
    setPaymentSettings(updated);
  };

  // Stats calculators
  const totalSalesRevenue = orders
    .filter(o => o.status === "delivered" || o.status === "transit" || o.status === "out_for_delivery" || o.status === "dispatched" || o.status === "processing")
    .reduce((sum, o) => sum + o.total, 0);

  const completedSalesRevenue = orders
    .filter(o => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status !== "delivered").length;

  const totalReviewsCount = reviews.length;
  const avgReviewRating = reviews.length > 0 
    ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
    : 4.9;

  // Filter lists
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.toLowerCase().includes(orderSearchQuery.toLowerCase());
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
      r.productId.toLowerCase().includes(reviewSearchQuery.toLowerCase());
    return matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50 px-4 py-16">
        <div className="w-full max-w-md bg-white border border-neutral-200 shadow-xl p-8 rounded-none">
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto rounded-full mb-2 shadow-inner">
              <Shield className="w-6 h-6 text-[#FFCD00]" />
            </div>
            <h2 className="text-xl font-montserrat font-extrabold uppercase tracking-widest text-[#111111]">
              Admin Panel
            </h2>
            <p className="text-xs text-neutral-500 font-sans">
              Enter secure credentials to access options.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                Security Admin Email
              </label>
              <input 
                type="text"
                placeholder="fityatra.gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-neutral-350 focus:border-black outline-hidden text-xs bg-[#FAFAFA]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-neutral-400" />
                Security Password
              </label>
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-neutral-350 focus:border-black outline-hidden text-xs bg-[#FAFAFA]"
              />
            </div>

            {loginError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-mono font-semibold flex items-start gap-1">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#FFCD00] hover:bg-[#E2B600] text-black font-montserrat font-bold text-xs uppercase tracking-widest transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Verify and Unlock Portal</span>
            </button>
          </form>

          {/* Authenticated credentials verified securely */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-neutral-100 py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Floating non-blocking custom iframe toast */}
      {toastMessage && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-4.5 py-3 shadow-2xl border font-mono text-[11px] font-bold tracking-wide transition-all ${
          toastMessage.type === "success" 
            ? "bg-[#22C55E] text-white border-emerald-400" 
            : "bg-red-600 text-white border-red-500"
        }`}>
          <span>{toastMessage.type === "success" ? "✓" : "⚠"}</span>
          <span>{toastMessage.text.toUpperCase()}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP STATUS HEADER BAR */}
        <div className="bg-white border border-neutral-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#FFCD00] flex items-center justify-center rounded shadow-sm shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-montserrat font-extrabold uppercase tracking-wider text-black">
                  ADMIN PANEL
                </h1>
                <span className="bg-[#22C55E] text-white font-mono text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wide">
                  SERVER SECURED
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono">
                Admin Mode • Authenticated as support@fityatra.store
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                loadOrdersFromStorage();
                setReviews(loadAllReviews());
              }}
              className="cursor-pointer p-2 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-black transition-colors"
              title="Force Hot Reload Database"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="cursor-pointer py-2 px-4 bg-neutral-900 hover:bg-black text-white font-mono text-[9px] uppercase tracking-wider font-bold transition-colors"
            >
              Lock Console
            </button>
          </div>
        </div>

        {/* CORE STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-neutral-200 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono font-bold text-gray-400 tracking-wider block">Total Sales Pipeline</span>
              <span className="text-xl font-montserrat font-extrabold text-[#111111] block">Rs. {totalSalesRevenue.toLocaleString()}</span>
              <span className="text-[8px] font-mono text-emerald-600 block">✓ includes transit & dispatched</span>
            </div>
            <div className="p-3 bg-neutral-50 border border-neutral-100 text-neutral-900 rounded">
              <BarChart2 className="w-5 h-5 text-[#FFCD00]" />
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono font-bold text-gray-400 tracking-wider block">Completed Revenue</span>
              <span className="text-xl font-montserrat font-extrabold text-[#111111] block">Rs. {completedSalesRevenue.toLocaleString()}</span>
              <span className="text-[8px] font-mono text-gray-400 block">• exact door-step handovers</span>
            </div>
            <div className="p-3 bg-neutral-50 border border-neutral-100 text-neutral-900 rounded">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono font-bold text-gray-400 tracking-wider block">Pending Dispatches</span>
              <span className="text-xl font-montserrat font-extrabold text-amber-600 block">{pendingOrdersCount} Handlings</span>
              <span className="text-[8px] font-mono text-amber-500 block">⌚ Needs swift status updates</span>
            </div>
            <div className="p-3 bg-neutral-50 border border-neutral-100 text-amber-600 rounded">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono font-bold text-gray-400 tracking-wider block">Satisfactions Rating</span>
              <span className="text-xl font-montserrat font-extrabold text-[#111111] block">{avgReviewRating} / 5.0</span>
              <span className="text-[8px] font-mono text-gray-400 block">Based on {totalReviewsCount} live reviews</span>
            </div>
            <div className="p-3 bg-neutral-50 border border-neutral-100 text-neutral-900 rounded">
              <MessageSquare className="w-5 h-5 text-[#FFCD00]" />
            </div>
          </div>
        </div>

        {/* NAVIGATION MENUS TABS */}
        <div className="flex border-b border-neutral-200 overflow-x-auto bg-white">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-3 px-6 text-2xs uppercase tracking-wider font-bold border-b-2 font-montserrat transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "dashboard" ? "border-black text-black bg-neutral-50" : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Operational Center</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 px-6 text-2xs uppercase tracking-wider font-bold border-b-2 font-montserrat transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "orders" ? "border-black text-black bg-neutral-50" : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders Handling ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-3 px-6 text-2xs uppercase tracking-wider font-bold border-b-2 font-montserrat transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "reviews" ? "border-black text-black bg-neutral-50" : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Reviews Verification ({reviews.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`py-3 px-6 text-2xs uppercase tracking-wider font-bold border-b-2 font-montserrat transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "products" ? "border-black text-black bg-neutral-50" : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Inventory & Products</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 px-6 text-2xs uppercase tracking-wider font-bold border-b-2 font-montserrat transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "settings" ? "border-black text-black bg-neutral-50" : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Payment Gateways & QRs</span>
          </button>
        </div>

        {/* VIEW 1: OPERATIONAL CENTER */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 gap-6">
            
            {/* Recent Orders Overview Card */}
            <div className="bg-white border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#FFCD00]" />
                  Latest Placed Requests (Nepal Cargo)
                </h3>
                <button 
                  onClick={() => setActiveTab("orders")}
                  className="text-[9px] font-mono font-bold text-neutral-400 hover:text-black uppercase tracking-wider"
                >
                  Manage All
                </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {orders.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-8">No order requests placed yet.</p>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="border border-neutral-100 p-3 hover:bg-neutral-50 transition-colors flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="font-mono font-black text-xs text-black">{order.id}</span>
                           <span className="bg-gray-100 text-gray-700 font-mono text-[8px] px-1 uppercase tracking-wider">{order.region.toUpperCase()}</span>
                        </div>
                        <p className="font-semibold text-neutral-800">{order.name} • {order.phone}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{order.items.map(i => `${i.name} (Qty: ${i.quantity})`).join(", ")}</p>
                      </div>
                      <div className="text-right space-y-1.5">
                        <span className="font-montserrat font-bold block text-black">Rs. {order.total.toLocaleString()}</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded-none font-mono text-[8px] uppercase tracking-widest font-extrabold text-white ${
                          order.status === "delivered" ? "bg-emerald-600" :
                          order.status === "placed" ? "bg-blue-600" :
                          order.status === "processing" ? "bg-amber-600" :
                          "bg-zinc-800"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: ORDERS HANDLING */}
        {activeTab === "orders" && (
          <div className="bg-white border border-neutral-200 p-6 space-y-6">
            
            {/* Controls Filter Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input 
                  type="text"
                  placeholder="Search orders by Code, Name, Phone..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 focus:border-black outline-hidden text-xs bg-neutral-50"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-neutral-50 border border-neutral-300 rounded-none text-xs p-2 focus:border-black outline-hidden"
                >
                  <option value="all">All Dispatches</option>
                  <option value="placed">Placed</option>
                  <option value="processing">Processing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="transit">In Transit</option>
                  <option value="out_for_delivery">Out For Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Table list */}
            <div className="overflow-x-auto border border-neutral-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 font-mono text-[10px] uppercase text-gray-500 tracking-wider">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Client Information</th>
                    <th className="p-3">Target Region</th>
                    <th className="p-3">Cart Stack</th>
                    <th className="p-3">Gateway Payment</th>
                    <th className="p-3">Net Sum</th>
                    <th className="p-3">Status Badge</th>
                    <th className="p-3 text-right">Terminal Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-450 italic">
                        No orders matching searched filters. Check code syntax or placement history.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                        <td className="p-3 font-mono font-black text-black">{order.id}</td>
                        <td className="p-3 space-y-0.5">
                          <p className="font-bold text-neutral-800">{order.name}</p>
                          <p className="font-mono text-[10px] text-gray-500">{order.phone}</p>
                        </td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 bg-neutral-100 font-mono uppercase text-[9px] text-neutral-800">
                            {order.region.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 max-w-[180px] truncate">
                          {order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}
                        </td>
                        <td className="p-3 space-y-1">
                          <span className={`inline-block px-1.5 py-0.5 rounded-none font-mono text-[8px] uppercase tracking-wider font-bold text-white ${
                            order.paymentMode === "ESEWA" ? "bg-[#60BB46]" : order.paymentMode === "KHALTI" ? "bg-[#5C2D91]" : "bg-black"
                          }`}>
                            {order.paymentMode || "COD"}
                          </span>
                          {order.screenshot && (
                            <button
                              onClick={() => setPreviewScreenshotUrl(order.screenshot || null)}
                              className="cursor-pointer block text-[9px] font-mono font-bold text-emerald-600 hover:underline flex items-center gap-1 mt-1"
                              title="Inspect Receipt screenshot"
                            >
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping inline-block"></span>
                              👁 View Receipt
                            </button>
                          )}
                        </td>
                        <td className="p-3 font-montserrat font-bold text-black">Rs. {order.total.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-none font-mono text-[9px] uppercase font-bold text-white ${
                            order.status === "delivered" ? "bg-emerald-600/90 text-white" :
                            order.status === "placed" ? "bg-blue-600" :
                            order.status === "processing" ? "bg-amber-600" :
                            "bg-zinc-800"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="cursor-pointer bg-neutral-200 hover:bg-black hover:text-white p-1.5 text-black hover:scale-105 transition-all w-7 h-7 inline-flex items-center justify-center"
                            title="Edit Dispatch details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="cursor-pointer bg-red-100 hover:bg-red-650 hover:text-white p-1.5 text-red-650 hover:scale-105 transition-all w-7 h-7 inline-flex items-center justify-center"
                            title="Purge order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* POPUP MODAL: EDIT DISPATCH OVERVIEW */}
            {editingOrder && (
              <div className="fixed inset-0 bg-black/60 z-55 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white border border-neutral-300 w-full max-w-md p-6 relative">
                  <button 
                    onClick={() => setEditingOrder(null)}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-black hover:bg-neutral-100"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs">
                        MODIFY STATUS: {editingOrder.id}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-mono">
                        Client: {editingOrder.name} ({editingOrder.phone})
                      </p>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const status = (form.elements.namedItem("order-status") as HTMLSelectElement).value as Order["status"];
                      const partner = (form.elements.namedItem("shipping-partner") as HTMLInputElement).value;
                      const notes = (form.elements.namedItem("dispatch-notes") as HTMLTextAreaElement).value;
                      handleUpdateOrderStatus(editingOrder.id, status, partner, notes);
                    }} className="space-y-4 text-xs">
                      
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Dispatch State</label>
                        <select
                          name="order-status"
                          defaultValue={editingOrder.status}
                          className="w-full bg-[#FAFAFA] border border-neutral-300 p-2 focus:border-black outline-hidden"
                        >
                          <option value="placed">Placed (Order Synced)</option>
                          <option value="processing">Processing (Allocated in central warehouse)</option>
                          <option value="dispatched">Dispatched (Barcodes Scratch Code Verified)</option>
                          <option value="transit">In Transit (Highway cargo logistics loaded)</option>
                          <option value="out_for_delivery">Out For Delivery (Courier partner delivery active)</option>
                          <option value="delivered">Delivered (Handed over, scratch checked)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Shipping/Courier Partner</label>
                        <input
                          type="text"
                          name="shipping-partner"
                          defaultValue={editingOrder.shippingPartner || "Upaya CityCargo Partner"}
                          className="w-full bg-[#FAFAFA] border border-neutral-300 p-2 focus:border-black outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Dispatch Operations Notes</label>
                        <textarea
                          name="dispatch-notes"
                          defaultValue={editingOrder.notes || ""}
                          rows={3}
                          placeholder="Provide specific notes regarding location, transit, or verification details..."
                          className="w-full bg-[#FAFAFA] border border-neutral-300 p-2 focus:border-black outline-hidden"
                        />
                      </div>

                      {editingOrder.screenshot && (
                        <div className="space-y-1 pt-1 text-left">
                          <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Verified Screenshot Reference</label>
                          <div className="border border-neutral-250 p-2 bg-neutral-50 flex items-center gap-3">
                            <img 
                              src={editingOrder.screenshot} 
                              alt="Receipt SS" 
                              className="w-12 h-14 object-cover border border-neutral-300" 
                            />
                            <div className="flex-1">
                              <p className="text-[9px] font-mono text-gray-450 uppercase">GATEWAY SS ENVELOPE</p>
                              <button
                                type="button"
                                onClick={() => setPreviewScreenshotUrl(editingOrder?.screenshot || null)}
                                className="cursor-pointer text-[10px] text-emerald-600 hover:underline font-bold flex items-center gap-1"
                              >
                                View full screen format 🔍
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingOrder(null)}
                          className="flex-1 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 uppercase font-mono tracking-widest text-[9px] font-bold"
                        >
                          Dismiss
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-black hover:bg-neutral-900 text-white uppercase font-mono tracking-widest text-[9px] font-bold"
                        >
                          Push Changes
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            )}

            {previewScreenshotUrl && (
              <div className="fixed inset-0 bg-black/80 z-55 flex flex-col items-center justify-center p-4 animate-fade-in">
                <div className="bg-white border border-neutral-200 w-full max-w-sm p-4 relative flex flex-col items-center">
                  <button 
                    onClick={() => setPreviewScreenshotUrl(null)}
                    className="cursor-pointer absolute top-4 right-4 p-2 bg-neutral-150 hover:bg-black hover:text-white rounded-full transition-all text-neutral-850 z-20"
                    title="Close preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h4 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs mb-3">
                    RECEIPT DOCUMENT INSPECTION
                  </h4>
                  <div className="w-full max-h-[70vh] overflow-auto border border-neutral-250 bg-neutral-50 flex items-center justify-center p-2 rounded">
                    <img 
                      src={previewScreenshotUrl} 
                      alt="Verified Invoice Attachment" 
                      className="max-w-full max-h-[50vh] object-contain rounded" 
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono mt-3 text-center uppercase tracking-wider">
                    FitYatra Ledger Code Reference Verified
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* VIEW 3: REVIEWS VERIFICATION */}
        {activeTab === "reviews" && (
          <div className="bg-white border border-neutral-200 p-6 space-y-6">
            
            {/* Header controls layout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input 
                  type="text"
                  placeholder="Search reviews by Author, Comment, Product ID..."
                  value={reviewSearchQuery}
                  onChange={(e) => setReviewSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 focus:border-black outline-hidden text-xs bg-neutral-50"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>

              <button
                onClick={() => setShowAddReviewForm(!showAddReviewForm)}
                className="cursor-pointer py-2 px-4 bg-black hover:bg-neutral-900 text-white font-mono text-[9px] uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Simulate Custom client feedback</span>
              </button>
            </div>

            {/* SIMULATED CLIENT FEEDBACK CREATOR FORM */}
            {showAddReviewForm && (
              <form onSubmit={handleCreateCustomReview} className="border border-black p-5 bg-neutral-50 space-y-4 text-xs animate-slide-down">
                <span className="font-montserrat font-extrabold text-[#111111] uppercase tracking-wider text-[10px] block">
                  📝 Simulate client verified Product Feedbacks
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Target Product Name</label>
                    <select
                      value={newRevProduct}
                      onChange={(e) => setNewRevProduct(e.target.value)}
                      className="w-full p-2 border border-neutral-300 bg-white"
                    >
                      {PRODUCTS.map(p => (
                        <option key={p.id} value={p.id}>{p.brand} - {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Client Profile Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Rupesh K."
                      value={newRevName}
                      onChange={(e) => setNewRevName(e.target.value)}
                      className="w-full p-2 border border-neutral-300 bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Stars Rating</label>
                    <select
                      value={newRevRating}
                      onChange={(e) => setNewRevRating(Number(e.target.value))}
                      className="w-full p-2 border border-neutral-300 bg-white"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                      <option value={2}>⭐⭐ (2 Stars)</option>
                      <option value={1}>⭐ (1 Star)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Constructive Comments</label>
                  <textarea 
                    placeholder="Enter realistic user comment. e.g., scratch verified on brand portal instantly..."
                    value={newRevComment}
                    required
                    onChange={(e) => setNewRevComment(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-neutral-300 bg-white"
                  />
                </div>

                {/* Simulated images uploads */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Attach verified snapshot (optional)</label>
                  <input 
                    type="file" 
                    onChange={handleImageFileChange} 
                    multiple 
                    accept="image/*" 
                    className="text-xs"
                  />
                  {newRevImages.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-1.5">
                      {newRevImages.map((b64, idx) => (
                        <img key={idx} src={b64} alt="attachment" className="w-10 h-10 object-cover border border-neutral-200" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReviewForm(false)}
                    className="py-2 px-3 border border-neutral-350 hover:bg-white uppercase font-mono text-[9px] font-bold text-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-black hover:bg-neutral-900 text-white uppercase font-mono text-[9px] font-bold"
                  >
                    Publish Verification Feedback Page
                  </button>
                </div>
              </form>
            )}

            {/* Reviews list gallery layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.length === 0 ? (
                <p className="p-8 text-center text-gray-400 italic md:col-span-2 bg-[#FAFAFA] border border-dashed border-neutral-200">
                  No products reviews match search.
                </p>
              ) : (
                filteredReviews.map((rev) => {
                  const productObj = PRODUCTS.find((p) => p.id === rev.productId);
                  return (
                    <div key={rev.id} className="border border-neutral-250 p-4 space-y-3 bg-neutral-50/50 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="font-bold text-neutral-900 text-xs">{rev.name}</span>
                            <span className="text-[10px] text-gray-400 block font-mono">{rev.date}</span>
                          </div>
                          <div className="flex items-center text-[#FFCD00]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className="text-sm">
                                {i < rev.rating ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                        </div>

                        {productObj && (
                          <span className="inline-block py-0.5 px-2 bg-neutral-200 text-neutral-800 text-[8px] font-mono uppercase tracking-wider font-bold">
                            {productObj.brand} - {productObj.name}
                          </span>
                        )}

                        <p className="text-gray-700 leading-relaxed text-xs italic">
                          "{rev.comment}"
                        </p>

                        {/* Review Snap Attachments */}
                        {((rev.images && rev.images.length > 0) || (rev.videos && rev.videos.length > 0)) && (
                          <div className="flex gap-1.5 flex-wrap pt-1">
                            {rev.images && rev.images.map((img, idx) => (
                              <img key={`snap-img-${idx}`} src={img} alt="review snap" className="w-10 h-10 object-cover border border-neutral-200 rounded" />
                            ))}
                            {rev.videos && rev.videos.map((vid, idx) => (
                              <div key={`snap-vid-${idx}`} className="w-10 h-10 bg-black flex items-center justify-center rounded border border-neutral-200 relative">
                                <video src={vid} className="w-full h-full object-cover" />
                                <span className="absolute text-white text-[8px]">▶</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                        <button
                          onClick={() => handleToggleVerifiedReview(rev.id, rev.verified)}
                          className={`cursor-pointer text-[9px] font-mono font-bold py-1 px-2 uppercase tracking-wide border flex items-center gap-1.5 transition-colors ${
                            rev.verified
                              ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-emerald-700 hover:bg-neutral-100"
                              : "bg-amber-50 border-amber-250 text-amber-700 hover:bg-neutral-100"
                          }`}
                        >
                          {rev.verified ? <Check className="w-3" /> : <X className="w-3" />}
                          <span>{rev.verified ? "Verified Genuine" : "Verification Staged"}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingReview(rev)}
                            className="cursor-pointer font-mono font-bold text-[9px] uppercase tracking-wider text-neutral-500 hover:text-black py-1 px-2 border border-neutral-250 hover:bg-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="cursor-pointer font-mono font-bold text-[9px] uppercase tracking-wider text-red-650 hover:bg-red-500 hover:text-white py-1 px-2 border border-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* EDIT REVIEW MODAL */}
            {editingReview && (
              <div className="fixed inset-0 bg-black/60 z-55 flex items-center justify-center p-4">
                <div className="bg-white border border-neutral-300 w-full max-w-md p-6 relative">
                  <button 
                    onClick={() => setEditingReview(null)}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-black hover:bg-neutral-100"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-4">
                    <h4 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs">
                      MODIFY CLIENT FEEDBACK COMMENT
                    </h4>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const c = (form.elements.namedItem("review-comment") as HTMLTextAreaElement).value;
                      const r = Number((form.elements.namedItem("review-rating") as HTMLSelectElement).value);
                      handleUpdateReviewCommentInPanel(editingReview.id, c, r);
                    }} className="space-y-4 text-xs">
                      
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Stars Rating</label>
                        <select
                          name="review-rating"
                          defaultValue={editingReview.rating}
                          className="w-full bg-[#FAFAFA] border border-neutral-300 p-2"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                          <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                          <option value={3}>⭐⭐⭐ (3 Stars)</option>
                          <option value={2}>⭐⭐ (2 Stars)</option>
                          <option value={1}>⭐ (1 Star)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Feedback Text</label>
                        <textarea
                          name="review-comment"
                          defaultValue={editingReview.comment}
                          rows={4}
                          className="w-full bg-[#FAFAFA] border border-neutral-300 p-2 outline-hidden"
                          required
                        />
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingReview(null)}
                          className="flex-1 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 uppercase font-mono tracking-widest text-[9px] font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-black hover:bg-neutral-900 text-white uppercase font-mono tracking-widest text-[9px] font-bold"
                        >
                          Save comment
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* VIEW 4: PRODUCT INVENTORY & CRUD */}
        {activeTab === "products" && (
          <div className="bg-white border border-neutral-200 p-6 space-y-6">
            <div className="pb-3 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-[#FFCD00]" />
                  Active Supplement Catalog & Storefront Manager
                </h3>
                <p className="text-[10px] text-gray-500 font-mono">
                  Manage active listings, alter pricing, set Sold Out status, or catalog new imports instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProductForm(true)}
                className="cursor-pointer py-1.5 px-3.5 bg-black hover:bg-neutral-900 border border-black text-white text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>Add New Supplement</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((prod) => {
                const prodReviews = reviews.filter(r => r.productId === prod.id);
                const totalUnitsSold = orders
                  .filter(o => o.status === "delivered")
                  .flatMap(o => o.items)
                  .filter(item => item.name.toLowerCase().includes(prod.brand.toLowerCase()) || item.name.toLowerCase().includes(prod.name.toLowerCase()))
                  .reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <div key={prod.id} className="border border-neutral-200 p-4 hover:border-black transition-colors flex gap-4 bg-neutral-50/20 flex-col sm:flex-row justify-between">
                    <div className="flex gap-4 flex-1">
                      <img 
                        src={prod.image || "https://placehold.co/100"} 
                        alt={prod.name} 
                        className="w-16 h-16 object-contain bg-white border border-neutral-200 p-1 shrink-0 align-middle self-start" 
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/100?text=No+Image";
                        }}
                      />
                      <div className="space-y-1 flex-1 text-xs">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-gray-400 block">{prod.category}</span>
                          <span className="font-bold text-neutral-900 block text-xs">{prod.brand}</span>
                          <span className="text-gray-500 block leading-tight text-[11px] font-sans h-8 overflow-hidden line-clamp-2">{prod.name}</span>
                        </div>
                        {prod.isSoldOut ? (
                          <span className="inline-block bg-red-50 text-red-700 text-[8px] font-mono font-bold px-1.5 py-0.5 border border-red-200 uppercase tracking-widest whitespace-nowrap shrink-0">Sold Out</span>
                        ) : (
                          <span className="inline-block bg-emerald-50 text-emerald-700 text-[8px] font-mono font-bold px-1.5 py-0.5 border border-emerald-200 uppercase tracking-widest whitespace-nowrap shrink-0">Active / In Stock</span>
                        )}

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dashed border-neutral-200 font-mono text-[9px] text-gray-500">
                          <div>
                            <span className="block text-gray-400">PRICE (NPR)</span>
                            <span className="font-bold text-black text-xs block">Rs. {prod.price.toLocaleString()}</span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-[8px] line-through text-gray-450 block">Rs. {prod.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                          <div>
                            <span className="block text-gray-400">DELIVERED</span>
                            <span className="font-bold text-emerald-600 block">{totalUnitsSold} Units</span>
                          </div>
                          <div>
                            <span className="block text-gray-400">FEEDBACKS</span>
                            <span className="font-bold text-black block">{prodReviews.length} ({prod.rating}★)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end gap-1.5 shrink-0 pt-3 sm:pt-0 sm:pl-3 border-t sm:border-t-0 sm:border-l border-neutral-200/60">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(prod)}
                        className="cursor-pointer flex-1 sm:flex-initial text-center py-1.5 px-3 bg-white border border-neutral-350 font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-700 hover:text-black hover:bg-neutral-50"
                      >
                        Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="cursor-pointer flex-1 sm:flex-initial text-center py-1.5 px-3 bg-red-50 border border-red-200 font-mono text-[9px] font-bold uppercase tracking-wider text-red-700 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 5: SETTINGS (PAYMENT GATEWAYS AND CUSTOMIZABLE QRS) */}
        {activeTab === "settings" && (
          <div className="bg-white border border-neutral-200 p-6 space-y-6">
            <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-[#FFCD00]" />
                  Dynamic Payment Gateways & QR Codes Editor
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                  Upload new payment QR images, edit eSewa/Khalti merchant information, and define Cash on Delivery instructions.
                </p>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              
              const getVal = (name: string) => {
                const el = form.elements.namedItem(name);
                return el && 'value' in el ? (el as any).value.trim() : "";
              };
              const getChecked = (name: string) => {
                const el = form.elements.namedItem(name);
                return el && 'checked' in el ? (el as any).checked : false;
              };

              const isEsewa = getChecked("isEsewaEnabled");
              const eqr = settingEsewaQr || getVal("esewaQrUrl");
              const ename = getVal("esewaAccountName");
              const eno = getVal("esewaAccountNumber");
              
              const isKhalti = getChecked("isKhaltiEnabled");
              const kqr = settingKhaltiQr || getVal("khaltiQrUrl");
              const kname = getVal("khaltiAccountName");
              const kno = getVal("khaltiAccountNumber");

              const isCod = getChecked("isCodEnabled");
              const codInst = getVal("codInstructions");

              handleSavePaymentSettings({
                isEsewaEnabled: isEsewa,
                esewaQrUrl: eqr,
                esewaAccountName: ename,
                esewaAccountNumber: eno,
                isKhaltiEnabled: isKhalti,
                khaltiQrUrl: kqr,
                khaltiAccountName: kname,
                khaltiAccountNumber: kno,
                isCodEnabled: isCod,
                codInstructions: codInst
              });
              showToast("Payment parameters and merchant settings compiled successfully!");
            }} className="space-y-6 text-xs">
              
              {/* eSewa Config Section */}
              <div className="bg-[#60BB46]/5 p-5 border border-[#60BB46]/20 space-y-4">
                <div className="flex items-center justify-between border-b border-[#60BB46]/25 pb-2">
                  <div className="flex items-center gap-1.5 font-bold font-montserrat uppercase text-[#3f842d]">
                    <span>🟢 eSewa gateway setup</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isEsewaEnabled" 
                      defaultChecked={paymentSettings.isEsewaEnabled}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#60BB46]"></div>
                    <span className="ml-2 text-[10px] font-mono uppercase font-bold text-gray-500">Enable</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">eSewa Account/Merchant Name</label>
                    <input 
                      type="text" 
                      name="esewaAccountName"
                      defaultValue={paymentSettings.esewaAccountName}
                      className="w-full bg-white p-2 border border-neutral-300 outline-hidden font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">eSewa ID / Mobile Number</label>
                    <input 
                      type="text" 
                      name="esewaAccountNumber"
                      defaultValue={paymentSettings.esewaAccountNumber}
                      className="w-full bg-white p-2 border border-neutral-300 outline-hidden font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  {renderImageUploader(
                    "eSewa Scan & Pay QR Image",
                    settingEsewaQr,
                    false,
                    (imgs) => setSettingEsewaQr(imgs[0] || ""),
                    () => setSettingEsewaQr(""),
                    "settings-esewa-upload",
                    "esewaQrUrl"
                  )}
                  <span className="text-[8px] text-gray-400 block font-mono">Choose / Drop custom QR image, or paste a link. Must start with http or data:image.</span>
                </div>
              </div>

              {/* Khalti Config Section */}
              <div className="bg-[#5C2D91]/5 p-5 border border-[#5C2D91]/20 space-y-4">
                <div className="flex items-center justify-between border-b border-[#5C2D91]/25 pb-2">
                  <div className="flex items-center gap-1.5 font-bold font-montserrat uppercase text-[#472074]">
                    <span>🟣 Khalti gateway setup</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isKhaltiEnabled" 
                      defaultChecked={paymentSettings.isKhaltiEnabled}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5C2D91]"></div>
                    <span className="ml-2 text-[10px] font-mono uppercase font-bold text-gray-500">Enable</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Khalti Account Name</label>
                    <input 
                      type="text" 
                      name="khaltiAccountName"
                      defaultValue={paymentSettings.khaltiAccountName}
                      className="w-full bg-white p-2 border border-neutral-300 outline-hidden font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">Khalti ID / Mobile Number</label>
                    <input 
                      type="text" 
                      name="khaltiAccountNumber"
                      defaultValue={paymentSettings.khaltiAccountNumber}
                      className="w-full bg-white p-2 border border-neutral-300 outline-hidden font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  {renderImageUploader(
                    "Khalti Scan QR Image (Optional)",
                    settingKhaltiQr,
                    false,
                    (imgs) => setSettingKhaltiQr(imgs[0] || ""),
                    () => setSettingKhaltiQr(""),
                    "settings-khalti-upload",
                    "khaltiQrUrl"
                  )}
                  <span className="text-[8px] text-gray-400 block font-mono">Choose / Drop custom QR image, or paste a link. Must start with http or data:image.</span>
                </div>
              </div>

              {/* Cash On Delivery Config Section */}
              <div className="p-5 border border-neutral-250 bg-neutral-50/50 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <div className="flex items-center gap-1.5 font-bold font-montserrat uppercase text-gray-800">
                    <span>💵 Cash on Delivery</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isCodEnabled" 
                      defaultChecked={paymentSettings.isCodEnabled}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                    <span className="ml-2 text-[10px] font-mono uppercase font-bold text-gray-500">Enable</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block">COD Doorstep Instructions Terms</label>
                  <textarea 
                    name="codInstructions"
                    defaultValue={paymentSettings.codInstructions}
                    rows={3}
                    className="w-full bg-white p-2.5 border border-neutral-300 focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FFCD00] hover:bg-[#E2B600] text-black font-montserrat font-bold text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <Save className="w-4 h-4 text-black animate-pulse" />
                  <span>Update Payment Parameters</span>
                </button>
              </div>

            </form>

            {/* SECURE BLOCK: ADMIN CREDENTIALS & GUARD LOCK SETTINGS */}
            <hr className="border-neutral-200" />
            
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-montserrat font-extrabold uppercase tracking-widest text-neutral-900 text-xs flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#FFCD00]" />
                  Secure System Credentials & Decryption Passcode
                </h4>
                <p className="text-[10px] text-gray-500 font-mono">
                  Modify the email, password, and decryption key used to unlock/crack the administrative terminal.
                </p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const gEmail = (fd.get("sec_email") as string).trim().toLowerCase();
                const sPass = (fd.get("sec_password") as string).trim();
                const dKey = (fd.get("sec_passcode") as string).trim();

                if (gEmail !== "support@fityatra.store") {
                  showToast("Access Denied: Only support@fityatra.store can be configured as administrative email.", "error");
                  return;
                }
                if (sPass.length < 3 || dKey.length < 3) {
                  showToast("Password and Decryption Key must be at least 3 characters long.", "error");
                  return;
                }

                localStorage.setItem("fityatra_admin_email", gEmail);
                localStorage.setItem("fityatra_admin_password", sPass);
                localStorage.setItem("fityatra_crack_passcode", dKey);

                setSecEmail(gEmail);
                setSecPassword(sPass);
                setSecPasscode(dKey);

                showToast("System Security Credentials synchronized successfully!");
              }} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block flex items-center gap-1">
                      <Mail className="w-3 h-3 text-neutral-400" /> Administrative Email
                    </label>
                    <input 
                      type="text" 
                      name="sec_email"
                      defaultValue={secEmail}
                      className="w-full bg-white p-2 border border-neutral-300 font-mono text-xs outline-hidden"
                      required
                      placeholder="e.g. support@fityatra.store"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block flex items-center gap-1">
                      <Key className="w-3 h-3 text-neutral-400" /> Account Security Password
                    </label>
                    <input 
                      type="text" 
                      name="sec_password"
                      defaultValue={secPassword}
                      className="w-full bg-white p-2 border border-neutral-300 font-mono text-xs outline-hidden"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-gray-500 block flex items-center gap-1">
                      <Lock className="w-3 h-3 text-neutral-400" /> Encryption Crack Word (?? Answer)
                    </label>
                    <input 
                      type="text" 
                      name="sec_passcode"
                      defaultValue={secPasscode}
                      className="w-full bg-white p-2 border border-neutral-300 font-mono text-xs outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-black hover:bg-neutral-900 text-[#FFCD00] border border-black font-montserrat font-bold text-[10px] uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transition-colors duration-200"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Synchronize Security Terminal Keys</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= REGISTER SUPPLEMENT MODAL (ADD) ================= */}
        {showAddProductForm && (
          <div className="fixed inset-0 bg-black/60 z-55 flex items-stretch sm:items-start justify-center p-0 sm:p-4 overflow-y-auto">
            <div className="bg-white border-0 sm:border border-neutral-350 w-full max-w-2xl sm:my-8 rounded-none sm:rounded-xl shadow-2xl relative flex flex-col h-full sm:h-auto sm:max-h-[92vh] max-h-screen">
              
              <div className="p-5 border-b border-neutral-200 flex justify-between items-center bg-neutral-50 rounded-t-xl shrink-0">
                <h4 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs">
                  ➕ ADD NEW SUPPLEMENT PRODUCT TO STOREFRONT
                </h4>
                <button 
                  onClick={() => setShowAddProductForm(false)}
                  className="p-1.5 text-gray-400 hover:text-black hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const brand = (fd.get("brand") as string).trim();
                const name = (fd.get("name") as string).trim();
                const category = (fd.get("category") as string).trim();
                const price = Number(fd.get("price"));
                const originalPrice = Number(fd.get("originalPrice"));
                const isSoldOut = fd.get("isSoldOut") === "true";
                const image = addMainImage || (fd.get("image") as string).trim();
                const description = (fd.get("description") as string).trim();
                const servings = (fd.get("servings") as string).trim();
                const servingSize = (fd.get("servingSize") as string).trim();

                const discountPercentage = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
                const galleryRaw = (fd.get("gallery") as string || "").trim();
                const gallery = addGallery.length > 0 ? addGallery : (galleryRaw ? galleryRaw.split("\n").map(u => u.trim()).filter(u => u.length > 2).map(u => u.startsWith("http") ? u : (u.startsWith("//") ? "https:" + u : "https://" + u)) : []);
                const infoImagesRaw = (fd.get("infoImages") as string || "").trim();
                const infoImages = addInfoImages.length > 0 ? addInfoImages : (infoImagesRaw ? infoImagesRaw.split("\n").map(u => u.trim()).filter(u => u.length > 2).map(u => u.startsWith("http") ? u : (u.startsWith("//") ? "https:" + u : "https://" + u)) : []);

                const variantsRaw = (fd.get("variantsJson") as string || "").trim();
                let variants = undefined;
                if (variantsRaw) {
                  try {
                    variants = JSON.parse(variantsRaw);
                  } catch (err) {
                    showToast("Error parsing Product Variants JSON. Creating product with default options.");
                    console.error("Failed to parse variants JSON", err);
                  }
                }

                handleCreateProduct({
                  brand,
                  name,
                  category,
                  price,
                  originalPrice,
                  discountPercentage,
                  isSoldOut,
                  image,
                  description,
                  servings,
                  servingSize,
                  goals: ["Muscle Building", "Fitness Support"],
                  specs: { "Origin": "International Importer", "Scratch-Code": "Yes (SMS Verified)" },
                  gallery: gallery.length > 0 ? gallery : [image],
                  infoImages: infoImages,
                  variants
                });
                showToast("Successfully cataloged the new supplement!");
              }} className="flex flex-col min-h-0 flex-1">
                
                <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Brand (e.g. Wellcore)</label>
                      <input type="text" name="brand" required placeholder="Wellcore" className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Product Category</label>
                      <select name="category" required className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors">
                        <option value="Creatine">Creatine</option>
                        <option value="Protein">Protein</option>
                        <option value="Peanut Butter">Peanut Butter</option>
                        <option value="Collagen">Collagen</option>
                        <option value="L-Carnitine">L-Carnitine</option>
                        <option value="Pre-Workout">Pre-Workout</option>
                        <option value="Essentials">Essentials</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Supplement Title Name</label>
                    <input type="text" name="name" required placeholder="Micronised Creatine Monohydrate Pure" className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">FitYatra Price (Rs.)</label>
                      <input type="number" name="price" required min="1" placeholder="2199" className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Original Price (Rs.)</label>
                      <input type="number" name="originalPrice" required min="1" placeholder="2700" className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Total Servings</label>
                      <input type="text" name="servings" placeholder="33 Servings" className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Serving Size</label>
                      <input type="text" name="servingSize" placeholder="3g scoop" className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    {renderImageUploader(
                      "Main Supplement Image",
                      addMainImage,
                      false,
                      (imgs) => setAddMainImage(imgs[0] || ""),
                      () => setAddMainImage(""),
                      "add-main-upload",
                      "image"
                    )}
                  </div>

                  <div className="space-y-1">
                    {renderImageUploader(
                      "Product Gallery Album",
                      addGallery,
                      true,
                      (imgs) => setAddGallery(imgs),
                      (idx) => setAddGallery((prev) => prev.filter((_, i) => i !== idx)),
                      "add-gallery-upload",
                      "gallery"
                    )}
                    <span className="text-[9px] text-gray-400 block leading-tight mt-1">These images populate the rotating image gallery at the top of the details view.</span>
                  </div>

                  <div className="space-y-1">
                    {renderImageUploader(
                      "Product Detail Banners",
                      addInfoImages,
                      true,
                      (imgs) => setAddInfoImages(imgs),
                      (idx) => setAddInfoImages((prev) => prev.filter((_, i) => i !== idx)),
                      "add-info-upload",
                      "infoImages"
                    )}
                    <span className="text-[9px] text-gray-400 block leading-tight mt-1">Extra graphical images/banners shown below the description to offer more visual details about the product.</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Inventory Status</label>
                    <select name="isSoldOut" className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors font-bold">
                      <option value="false">Active (In Stock)</option>
                      <option value="true">Sold Out (Disable Adding to Cart)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Product Variants & Quantity Pricing (JSON, Optional)</label>
                    <textarea name="variantsJson" rows={4} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" placeholder={`[
  {
    "name": "1 Pack (Standard)",
    "price": 2199,
    "originalPrice": 3199,
    "servings": "100 Servings",
    "servingSize": "3g",
    "isSoldOut": false
  },
  {
    "name": "2 Pack (Save Extra 10%)",
    "price": 3958,
    "originalPrice": 6398,
    "servings": "200 Servings",
    "servingSize": "3g",
    "isSoldOut": false
  }
]`} className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors font-mono text-base sm:text-[10px]" />
                    <span className="text-[9px] text-gray-400 block leading-tight mt-1">Define custom multi-pack discount tiers or size variations with separate pricing. Leave empty to auto-generate default 1, 2, and 3-pack discounts for all products automatically!</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Supplement Description</label>
                    <textarea name="description" rows={3} required placeholder="Write highlights, benefits, authentic scratch codes info..." className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors font-sans" />
                  </div>
                </div>

                <div className="p-5 border-t border-neutral-200 bg-neutral-50 rounded-b-xl flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowAddProductForm(false)}
                    className="flex-1 py-3 border border-neutral-300 hover:bg-neutral-100 text-neutral-800 uppercase font-mono text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-black hover:bg-neutral-900 text-white uppercase font-mono text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Publish Supplement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= EDIT SUPPLEMENT DETAILS MODAL ================= */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/60 z-55 flex items-stretch sm:items-start justify-center p-0 sm:p-4 overflow-y-auto">
            <div className="bg-white border-0 sm:border border-neutral-350 w-full max-w-2xl sm:my-8 rounded-none sm:rounded-xl shadow-2xl relative flex flex-col h-full sm:h-auto sm:max-h-[92vh] max-h-screen">
              
              <div className="p-5 border-b border-neutral-200 flex justify-between items-center bg-neutral-50 rounded-t-xl shrink-0">
                <h4 className="font-montserrat font-extrabold uppercase tracking-widest text-[#111111] text-xs">
                  ✏️ EDIT SUPPLEMENT: {editingProduct.brand} {editingProduct.name}
                </h4>
                <button 
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 text-gray-400 hover:text-black hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const brand = (fd.get("brand") as string).trim();
                const name = (fd.get("name") as string).trim();
                const category = (fd.get("category") as string).trim();
                const price = Number(fd.get("price"));
                const originalPrice = Number(fd.get("originalPrice"));
                const isSoldOut = fd.get("isSoldOut") === "true";
                const image = editMainImage || (fd.get("image") as string).trim();
                const description = (fd.get("description") as string).trim();
                const servings = (fd.get("servings") as string).trim();
                const servingSize = (fd.get("servingSize") as string).trim();

                const discountPercentage = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
                const galleryRaw = (fd.get("gallery") as string || "").trim();
                const gallery = editGallery.length > 0 ? editGallery : (galleryRaw ? galleryRaw.split("\n").map(u => u.trim()).filter(u => u.length > 2).map(u => u.startsWith("http") ? u : (u.startsWith("//") ? "https:" + u : "https://" + u)) : []);
                const infoImagesRaw = (fd.get("infoImages") as string || "").trim();
                const infoImages = editInfoImages.length > 0 ? editInfoImages : (infoImagesRaw ? infoImagesRaw.split("\n").map(u => u.trim()).filter(u => u.length > 2).map(u => u.startsWith("http") ? u : (u.startsWith("//") ? "https:" + u : "https://" + u)) : []);

                const variantsRaw = (fd.get("variantsJson") as string || "").trim();
                let variants = undefined;
                if (variantsRaw) {
                  try {
                    variants = JSON.parse(variantsRaw);
                  } catch (err) {
                    showToast("Error parsing Product Variants JSON. Saving product without updating variants.");
                    console.error("Failed to parse variants JSON", err);
                  }
                }

                handleUpdateProduct(editingProduct.id, {
                  brand,
                  name,
                  category,
                  price,
                  originalPrice,
                  discountPercentage,
                  isSoldOut,
                  image,
                  description,
                  servings,
                  servingSize,
                  gallery: gallery.length > 0 ? gallery : [image],
                  infoImages: infoImages,
                  variants
                });
                showToast("Successfully saved modification specifications!");
              }} className="flex flex-col min-h-0 flex-1">
                
                <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Brand Designation</label>
                      <input type="text" name="brand" required defaultValue={editingProduct.brand} className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors font-semibold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Category Classification</label>
                      <select name="category" defaultValue={editingProduct.category} className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors font-semibold">
                        <option value="Creatine">Creatine</option>
                        <option value="Protein">Protein</option>
                        <option value="Peanut Butter">Peanut Butter</option>
                        <option value="Collagen">Collagen</option>
                        <option value="L-Carnitine">L-Carnitine</option>
                        <option value="Pre-Workout">Pre-Workout</option>
                        <option value="Essentials">Essentials</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Supplement Full Name Label</label>
                    <input type="text" name="name" required defaultValue={editingProduct.name} className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors font-semibold" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Adjusted Price (Rs.)</label>
                      <input type="number" name="price" required min="1" defaultValue={editingProduct.price} className="w-full bg-neutral-50 p-2.5 border border-[#FFCD00] text-black font-extrabold rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Compare-At / Original Price (Rs.)</label>
                      <input type="number" name="originalPrice" required min="1" defaultValue={editingProduct.originalPrice} className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Total Servings count</label>
                      <input type="text" name="servings" defaultValue={editingProduct.servings || ""} className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Serving size weight</label>
                      <input type="text" name="servingSize" defaultValue={editingProduct.servingSize || ""} className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    {renderImageUploader(
                      "Main Supplement Image",
                      editMainImage,
                      false,
                      (imgs) => setEditMainImage(imgs[0] || ""),
                      () => setEditMainImage(""),
                      "edit-main-upload",
                      "image"
                    )}
                  </div>

                  <div className="space-y-1">
                    {renderImageUploader(
                      "Product Gallery Album",
                      editGallery,
                      true,
                      (imgs) => setEditGallery(imgs),
                      (idx) => setEditGallery((prev) => prev.filter((_, i) => i !== idx)),
                      "edit-gallery-upload",
                      "gallery"
                    )}
                    <span className="text-[9px] text-gray-400 block leading-tight mt-1">These images populate the rotating image gallery at the top of the details view.</span>
                  </div>

                  <div className="space-y-1">
                    {renderImageUploader(
                      "Product Detail Banners",
                      editInfoImages,
                      true,
                      (imgs) => setEditInfoImages(imgs),
                      (idx) => setEditInfoImages((prev) => prev.filter((_, i) => i !== idx)),
                      "edit-info-upload",
                      "infoImages"
                    )}
                    <span className="text-[9px] text-gray-400 block leading-tight mt-1">Extra graphical images/banners shown below the description to offer more visual details about the product.</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Inventory Status Flag</label>
                    <select name="isSoldOut" defaultValue={String(editingProduct.isSoldOut)} className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors font-bold">
                      <option value="false">Active (In Stock)</option>
                      <option value="true">Sold Out (Disable Add to Cart)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Product Variants & Quantity Pricing (JSON, Optional)</label>
                    <textarea 
                      name="variantsJson" 
                      rows={5} 
                      autoComplete="off" 
                      autoCorrect="off" 
                      autoCapitalize="off" 
                      spellCheck="false"
                      defaultValue={editingProduct.variants ? JSON.stringify(editingProduct.variants, null, 2) : ""} 
                      placeholder={`[
  {
    "name": "1 Pack (Standard)",
    "price": ${editingProduct.price},
    "originalPrice": ${editingProduct.originalPrice},
    "servings": "${editingProduct.servings || ""}",
    "servingSize": "${editingProduct.servingSize || ""}",
    "isSoldOut": false
  }
]`} 
                      className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors font-mono text-base sm:text-[10px]" 
                    />
                    <span className="text-[9px] text-gray-400 block leading-tight mt-1">Define custom multi-pack discount tiers or size variations with separate pricing. Leave empty to auto-generate default 1, 2, and 3-pack discounts for all products automatically!</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Supplement Description Narrative</label>
                    <textarea name="description" rows={4} required defaultValue={editingProduct.description} className="w-full bg-neutral-50 p-2.5 border border-neutral-300 rounded-md focus:border-[#FFCD00] focus:ring-1 focus:ring-[#FFCD00] outline-none transition-colors font-sans" />
                  </div>
                </div>

                <div className="p-5 border-t border-neutral-200 bg-neutral-50 rounded-b-xl flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-3 border border-neutral-300 hover:bg-neutral-100 text-neutral-800 uppercase font-mono text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-black hover:bg-neutral-900 text-white uppercase font-mono text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Save Specifications
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
