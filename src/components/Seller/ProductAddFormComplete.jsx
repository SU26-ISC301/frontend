import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Save, Send, AlertCircle, HelpCircle, ChevronDown, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductImageUploadV3 } from './ProductImageUploadV3';
import { BrandSelectorField } from './BrandSelectorField';
import { CategorySelectorField, ELECTRONICS_CATEGORIES } from './CategorySelectorField';
import { ProductAttributesField } from './ProductAttributesField';
import { ProductDescriptionEditor } from './ProductDescriptionEditor';
import { ProductVariantsField } from './ProductVariantsField';
import { cn } from '../../lib/utils';
import { sellerApi } from '../../api/sellerAPI';
import { marketResearchApi } from '../../api/marketResearchAPI';
import { VENDOR_FEATURES } from '../../config/vendorFeatures';
import { productStorage, mapBackendProductToLocal, mergeProductData, STATIC_CATEGORY_SLUG_MAP } from '../../utils/productStorage';
import SubscriptionPlanModal, {
  getVendorPlan,
  consumeOneSlot,
} from './SubscriptionPlanModal';

export function ProductAddFormComplete({ isEdit }) {
  const navigate = useNavigate();
  const { sku } = useParams();
  const mainRef = useRef(null);
  const sectionRefs = {
    basic: useRef(null),
    detail: useRef(null),
    sales: useRef(null),
    shipping: useRef(null),
  };

  const imagesRef = useRef(null);
  const nameRef = useRef(null);
  const categoryRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    // Section 1: Thông tin cơ bản
    images: [],
    productName: '',
    brand: '',
    category: '',
    attributes: {},

    // Section 2: Chi tiết sản phẩm
    description: '',
    video: null,

    // Section 3: Thông tin bán hàng
    hasVariant: false,
    variants: [],
    skus: [],
    singlePrice: '',
    singleStock: '0',
    singleDiscount: '',
    singleSku: '',
    price: '',
    stock: '',
    discount: '',
    sku: '',
    dangerousGoods: 'no',

    // Section 4: Tuần thử sản phẩm
    hasTrialWeek: false,
    trialStartDate: '',
    trialEndDate: '',

    // Section 5: Vận chuyển
    weight: '500',
    weightUnit: 'g',
    length: '10',
    width: '10',
    height: '10',
    shippingType: 'default',
    customPlatforms: {
      standard: true,
      bulky: true,
      express24h: true,
      instant: true,
    },
    codEnabled: true,
    shippingMethod: 'standard',
    shippingFee: '',
  });

  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('basic');
  const [activeSubSection, setActiveSubSection] = useState('images');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitNotice, setSubmitNotice] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [showWeightUnitMenu, setShowWeightUnitMenu] = useState(false);
  const [isBasicExpanded, setIsBasicExpanded] = useState(true);
  const [categoriesList, setCategoriesList] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const list = await sellerApi.getProductCategories();
        if (Array.isArray(list)) {
          setCategoriesList(list);
          return;
        }
      } catch (err) {
        console.warn('Lỗi gọi getProductCategories, thử /vendors/market-research:', err);
      }

      try {
        const res = await marketResearchApi.getVendorMarketResearch();
        if (res && Array.isArray(res.categories)) {
          setCategoriesList(res.categories);
        }
      } catch (err) {
        console.warn('Không thể tải danh mục từ cả hai API:', err);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryLeaves = (nodes) => {
    const result = [];
    const recurse = (list) => {
      list.forEach(node => {
        if (!node.children || node.children.length === 0) {
          result.push(node);
        } else {
          recurse(node.children);
        }
      });
    };
    recurse(nodes);
    return result;
  };

  const getBackendCategoryId = (categorySlug) => {
    if (!categorySlug) return null;
    const staticId = STATIC_CATEGORY_SLUG_MAP[categorySlug];
    if (staticId) return staticId;

    const leaves = getCategoryLeaves(ELECTRONICS_CATEGORIES);
    const localLeaf = leaves.find(l => l.id === categorySlug);
    if (!localLeaf) {
      if (!isNaN(categorySlug)) return parseInt(categorySlug, 10);
      return null;
    }

    const localName = localLeaf.name.trim().toLowerCase();
    const backendMatch = categoriesList.find(
      c => c.name && c.name.trim().toLowerCase() === localName
    );

    if (backendMatch) {
      return parseInt(backendMatch.id, 10);
    }

    const backendMatchSlug = categoriesList.find(
      c => c.id && c.id.toString().trim().toLowerCase() === categorySlug.trim().toLowerCase()
    );
    if (backendMatchSlug) {
      return parseInt(backendMatchSlug.id, 10);
    }

    if (!isNaN(categorySlug)) return parseInt(categorySlug, 10);
    return null;
  };

  // Subscription plan quota
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planData, setPlanData] = useState(() => getVendorPlan());
  const remainingSlots = planData.totalSlots === -1
    ? Infinity
    : Math.max(0, (planData.totalSlots || 3) - (planData.usedSlots || 0));
  const isQuotaExhausted = remainingSlots <= 0;

  const isScrollingProgrammatically = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const fillFormWithProduct = (product) => {
    if (!product) return;
    try {
      const safeImages = (product.images || []).map(img => {
        if (!img) return { preview: '', file: null, name: '' };
        if (typeof img === 'string') {
          return { preview: img, file: null, name: img.split('/').pop() || '' };
        }
        return {
          preview: img.preview || img.url || img,
          file: null,
          name: img.name || ''
        };
      });

      const safeVariants = (() => {
        try {
          if (!product.variants) return [];
          const parsed = typeof product.variants === 'string' ? JSON.parse(product.variants) : product.variants;
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error("Error parsing product.variants:", e);
          return [];
        }
      })();

      const safeSkus = (() => {
        try {
          if (!product.skus) return [];
          const parsed = typeof product.skus === 'string' ? JSON.parse(product.skus) : product.skus;
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error("Error parsing product.skus:", e);
          return [];
        }
      })();

      const toSafeString = (val) => (val !== undefined && val !== null) ? String(val) : '';

      setFormData({
        images: safeImages,
        productName: product.name || '',
        brand: product.brand || '',
        category: product.category || '',
        attributes: product.attributes || {},
        description: product.description || '',
        video: product.video || null,
        hasVariant: !!product.hasVariant,
        variants: safeVariants,
        skus: safeSkus,
        singlePrice: product.hasVariant ? '' : toSafeString(product.price),
        singleStock: product.hasVariant ? '0' : toSafeString(product.stock),
        singleDiscount: toSafeString(product.discount),
        singleSku: product.hasVariant ? '' : (product.sku || ''),
        price: product.price || '',
        stock: product.stock || '',
        discount: product.discount || '',
        sku: product.sku || '',
        dangerousGoods: product.dangerousGoods || 'no',
        weight: toSafeString(product.weight || 500),
        weightUnit: product.weightUnit || 'g',
        length: toSafeString(product.length || 10),
        width: toSafeString(product.width || 10),
        height: toSafeString(product.height || 10),
        shippingType: product.shippingType || 'default',
        customPlatforms: product.customPlatforms || {
          standard: true,
          bulky: true,
          express24h: true,
          instant: true,
        },
        codEnabled: product.codEnabled !== undefined ? product.codEnabled : true,
        shippingMethod: product.shippingMethod || 'standard',
        shippingFee: product.shippingFee || '',
      });
    } catch (e) {
      console.error("Lỗi điền thông tin sản phẩm vào form:", e);
    }
  };

  useEffect(() => {
    if (isEdit && sku) {
      const loadProduct = async () => {
        let product;
        try {
          product = productStorage.getProductBySku(sku);
        } catch (storageErr) {
          console.error("Lỗi lấy sản phẩm từ localStorage:", storageErr);
        }

        // ── IMMEDIATE MAPPING ──
        // Điền dữ liệu từ Local Storage vào Form ngay lập tức để tránh giao diện bị trống khi tải trang
        if (product) {
          fillFormWithProduct(product);
        }

        try {
          let categories = [];
          try {
            categories = await sellerApi.getProductCategories();
          } catch (catErr) {
            console.warn('Lỗi gọi getProductCategories, thử /vendors/market-research:', catErr);
            try {
              const res = await marketResearchApi.getVendorMarketResearch();
              if (res && Array.isArray(res.categories)) {
                categories = res.categories;
              }
            } catch (mrErr) {
              console.warn('Không thể tải danh mục từ market-research:', mrErr);
            }
          }

          // Fallback: Nếu không tìm thấy cục bộ, gọi API lấy danh sách sản phẩm từ backend và khôi phục
          if (!product) {
            try {
              const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo") || "{}");
              const vendorId = vendorInfo?.id || vendorInfo?.vendorId;
              if (vendorId) {
                const backendProducts = await sellerApi.getProductsByVendor(vendorId);
                if (Array.isArray(backendProducts)) {
                  const beProd = backendProducts.find(p => {
                    const mapped = mapBackendProductToLocal(p, categories);
                    return mapped.sku === sku || (p.variants && p.variants.some(v => v.sku === sku || v.sellerSku === sku));
                  });
                  if (beProd) {
                    const mapped = mapBackendProductToLocal(beProd, categories);
                    productStorage.addProduct(mapped);
                    product = mapped;
                    fillFormWithProduct(product);
                  }
                }
              }
            } catch (fallbackErr) {
              console.warn("Lỗi đồng bộ fallback tìm sản phẩm từ BE:", fallbackErr);
            }
          } else {
            // Nếu sản phẩm có sẵn, cập nhật dữ liệu mới nhất từ backend
            const isNumericId = product.id && /^\d+$/.test(String(product.id));
            if (isNumericId) {
              try {
                const beProd = await sellerApi.getProductById(product.id);
                if (beProd) {
                  const mapped = mapBackendProductToLocal(beProd, categories);
                  const merged = mergeProductData(product, mapped);
                  product = merged;
                  productStorage.updateProduct(sku, merged);
                  fillFormWithProduct(product);
                }
              } catch (beGetErr) {
                console.warn("Lỗi khi tải chi tiết sản phẩm qua ID từ BE (vẫn giữ dữ liệu cục bộ):", beGetErr);
              }
            }
          }
        } catch (err) {
          console.warn('Lỗi khi tải chi tiết sản phẩm từ BE:', err);
        }

        if (!product) {
          alert('Không tìm thấy sản phẩm cần chỉnh sửa!');
          navigate('/vendor/san-pham');
        }
      };
      loadProduct();
    }
  }, [isEdit, sku, navigate]);

  useEffect(() => {
    const checkWarehouse = () => {
      try {
        const saved = localStorage.getItem("sellerWarehouses");
        if (!saved) return false;
        const list = JSON.parse(saved);
        if (!Array.isArray(list)) return false;
        const hasPickup = list.some(
          (w) => w.type === "PICKUP" || w.warehouse_type === "PICKUP"
        );
        const hasReturn = list.some(
          (w) => w.type === "RETURN" || w.warehouse_type === "RETURN"
        );
        return hasPickup && hasReturn;
      } catch {
        return false;
      }
    };

    if (VENDOR_FEATURES.warehouse && !checkWarehouse()) {
      alert("Phải thiết lập kho hàng trước khi đăng tin sản phẩm!");
      navigate("/vendor/kho-hang");
    }
  }, [navigate]);

  useEffect(() => {
    const container = mainRef.current;
    const onScroll = () => handleScroll();
    if (container) {
      container.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', onScroll);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainRef.current]);

  const handleScroll = () => {
    const container = mainRef.current;
    if (!container) return;

    if (isScrollingProgrammatically.current) return;

    // Check if scrolled near the bottom of the container
    const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
    if (isAtBottom) {
      setActiveSection('sales');
      return;
    }

    const sections = ['basic', 'detail', 'sales'];
    let currentSection = 'basic';
    const containerRect = container.getBoundingClientRect();

    for (const section of sections) {
      const ref = sectionRefs[section];
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;
        if (relativeTop <= 150) {
          currentSection = section;
        }
      }
    }
    setActiveSection(currentSection);

    // Sub-section spy when in basic section
    if (currentSection === 'basic') {
      const subSections = [
        { id: 'images', ref: imagesRef },
        { id: 'name', ref: nameRef },
        { id: 'category', ref: categoryRef },
      ];
      let currentSubSection = 'images';
      for (const sub of subSections) {
        if (sub.ref?.current) {
          const rect = sub.ref.current.getBoundingClientRect();
          const relativeTop = rect.top - containerRect.top;
          if (relativeTop <= 150) {
            currentSubSection = sub.id;
          }
        }
      }
      setActiveSubSection(currentSubSection);
    }
  };

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    const ref = sectionRefs[sectionId];
    if (ref?.current && mainRef.current) {
      isScrollingProgrammatically.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 800);
    }
  };

  const handleSubSectionClick = (subSectionId, elementRef) => {
    setActiveSection('basic');
    setActiveSubSection(subSectionId);

    if (elementRef?.current && mainRef.current) {
      isScrollingProgrammatically.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 800);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setIsDirty(true);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          video: 'Dung lượng video không được vượt quá 5MB',
        }));
        return;
      }
      handleFieldChange('video', file);
    }
  };

  const getVideoSrc = (video) => {
    if (!video) return '';
    if (video instanceof File || video instanceof Blob) {
      try {
        return URL.createObjectURL(video);
      } catch (e) {
        console.error(e);
        return '';
      }
    }
    if (typeof video === 'string') {
      return video;
    }
    return video.preview || video.url || '';
  };

  const validateForm = () => {
    const next = {};

    // Section 1
    if (formData.images.length === 0) {
      next.images = 'Vui lòng tải lên ít nhất 1 hình ảnh';
    }
    if (!formData.productName.trim()) {
      next.productName = 'Vui lòng nhập tên sản phẩm';
    }
    if (formData.productName.length > 255) {
      next.productName = 'Tên sản phẩm tối đa 255 ký tự';
    }
    if (!formData.category) {
      next.category = 'Vui lòng chọn danh mục';
    } else {
      // Validate dynamic attributes
      const isLaptop = formData.category === 'laptop';
      const isDesktop = formData.category === 'may-tinh-de-ban';
      const attrs = formData.attributes || {};
      const attrErrors = {};

      if (!attrs.warrantyType) attrErrors.warrantyType = 'Vui lòng chọn loại bảo hành';
      if (!attrs.originCountry) attrErrors.originCountry = 'Vui lòng chọn quốc gia xuất xứ';

      if (isLaptop || isDesktop) {
        if (!attrs.responsibleName || !attrs.responsibleName.trim()) {
          attrErrors.responsibleName = 'Vui lòng nhập tên tổ chức chịu trách nhiệm';
        }
      }
      if (isLaptop) {
        if (!attrs.responsibleAddress || !attrs.responsibleAddress.trim()) {
          attrErrors.responsibleAddress = 'Vui lòng nhập địa chỉ tổ chức chịu trách nhiệm';
        }
      }

      if (Object.keys(attrErrors).length > 0) {
        next.attributes = attrErrors;
      }
    }

    // Section 2
    const cleanText = formData.description.replace(/<[^>]*>/g, ' ').trim();
    if (!cleanText) {
      next.description = 'Vui lòng nhập mô tả sản phẩm';
    } else {
      const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
      if (wordCount < 30) {
        next.description = `Mô tả phải có ít nhất 30 từ (hiện có ${wordCount} từ)`;
      }
    }

    // Section 3
    if (!formData.hasVariant) {
      if (!formData.singlePrice) {
        next.price = 'Nhập giá';
      } else if (isNaN(parseFloat(formData.singlePrice)) || parseFloat(formData.singlePrice) <= 0) {
        next.price = 'Giá phải là số dương';
      }
      if (!formData.singleStock && formData.singleStock !== 0 && formData.singleStock !== '0') {
        next.stock = 'Nhập số lượng';
      } else if (isNaN(parseInt(formData.singleStock, 10)) || parseInt(formData.singleStock, 10) < 0) {
        next.stock = 'Tồn kho phải là số không âm';
      }
    } else {
      // Validate Variant Groups and Options
      if (!formData.variants || formData.variants.length === 0) {
        next.variants = 'Nhập SKU';
      } else {
        formData.variants.forEach((group, gIdx) => {
          if (!group.name || !group.name.trim()) {
            next[`variant_group_${gIdx}`] = 'Vui lòng chọn hoặc nhập biến thể';
          }
          group.options.forEach((opt, oIdx) => {
            if (!opt.value || !opt.value.trim()) {
              next[`variant_opt_${gIdx}_${oIdx}`] = 'Nhập một tùy chọn';
            }
          });
        });
      }

      // Validate Generated SKUs
      const hasEmptyOrInvalidSku = !formData.skus || formData.skus.length === 0 || formData.skus.some(sku => !sku.price || !sku.stock || !sku.weight);
      if (hasEmptyOrInvalidSku) {
        next.skus = 'Nhập SKU';
      }

      if (formData.skus && formData.skus.length > 0) {
        formData.skus.forEach((sku, index) => {
          if (!sku.stock && sku.stock !== 0 && sku.stock !== '0') {
            next[`sku_stock_${index}`] = 'Nhập tồn kho';
          } else if (isNaN(parseInt(sku.stock, 10)) || parseInt(sku.stock, 10) < 0) {
            next[`sku_stock_${index}`] = 'Không âm';
          }

          if (!sku.price) {
            next[`sku_price_${index}`] = 'Nhập giá';
          } else if (isNaN(parseFloat(sku.price)) || parseFloat(sku.price) <= 0) {
            next[`sku_price_${index}`] = 'Số dương';
          }

          if (!sku.weight) {
            next[`sku_weight_${index}`] = 'Nhập trọng lượng';
          } else if (isNaN(parseFloat(sku.weight)) || parseFloat(sku.weight) <= 0) {
            next[`sku_weight_${index}`] = 'Số dương';
          }
        });
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildBackendProductPayload = (uploadedImages, uploadedVideo, status) => {
    const categoryId = getBackendCategoryId(formData.category) || 12;

    const mediaList = [];
    uploadedImages.forEach((imgUrl, index) => {
      if (imgUrl) {
        mediaList.push({
          mediaUrl: imgUrl,
          isMain: index === 0,
          mediaType: 'image',
          sortOrder: index
        });
      }
    });
    if (uploadedVideo) {
      mediaList.push({
        mediaUrl: uploadedVideo,
        isMain: false,
        mediaType: 'video',
        sortOrder: mediaList.length
      });
    }

    const attributeLabelMap = {
      warrantyType: 'Loại bảo hành',
      originCountry: 'Quốc gia xuất xứ',
      responsibleName: 'Tổ chức chịu trách nhiệm',
      responsibleAddress: 'Địa chỉ tổ chức chịu trách nhiệm'
    };
    const attributesPayload = Object.entries(formData.attributes || {}).map(([key, val], idx) => ({
      name: attributeLabelMap[key] || key,
      sortOrder: idx,
      values: [
        {
          value: String(val),
          sortOrder: 0
        }
      ]
    }));

    if (formData.hasVariant && Array.isArray(formData.variants)) {
      formData.variants.forEach((v, idx) => {
        if (v.name && v.name.trim()) {
          attributesPayload.push({
            name: v.name.trim(),
            sortOrder: attributesPayload.length,
            values: (v.options || [])
              .filter(opt => opt.value && opt.value.trim())
              .map((opt, oIdx) => ({
                value: opt.value.trim(),
                sortOrder: oIdx
              }))
          });
        }
      });
    }


    const variantsPayload = formData.hasVariant ? formData.skus.map((s, idx) => ({
      sku: s.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
      sellerSku: s.sku || s.sellerSku || '',
      price: parseFloat(s.price) || 0,
      stock: parseInt(s.stock, 10) || 0,
      discountPercent: parseInt(s.discount) || 0,
      imageUrl: s.imageUrl || (uploadedImages[0] || ''),
      attributeValueIds: []
    })) : [
      {
        sku: formData.singleSku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
        sellerSku: formData.singleSku || '',
        price: parseFloat(formData.singlePrice) || 0,
        stock: parseInt(formData.singleStock, 10) || 0,
        discountPercent: parseInt(formData.singleDiscount) || 0,
        imageUrl: uploadedImages[0] || '',
        attributeValueIds: []
      }
    ];

    const weightG = (() => {
      if (!formData.weight) return 0;
      const parsed = parseFloat(formData.weight);
      if (isNaN(parsed)) return 0;
      return formData.weightUnit === 'kg' ? parsed * 1000 : parsed;
    })();

    const brandId = 1;

    return {
      categoryId,
      brandId,
      name: formData.productName,
      description: formData.description,
      status: (status || 'pending').toUpperCase(),
      condition: 'new',
      originCountry: formData.attributes.originCountry || 'Việt Nam',
      warrantyType: formData.attributes.warrantyType || 'Không bảo hành',
      parcelWeightG: Math.round(weightG),
      parcelWidth: formData.width ? parseInt(formData.width, 10) : 0,
      parcelLength: formData.length ? parseInt(formData.length, 10) : 0,
      parcelHeight: formData.height ? parseInt(formData.height, 10) : 0,
      deliveryMethod: 'default',
      mediaList,
      attributes: attributesPayload,
      variants: variantsPayload
    };
  };

  const handleSaveDraft = async () => {
    if (!formData.productName.trim()) {
      alert('Vui lòng nhập ít nhất Tên sản phẩm để lưu bản nháp!');
      return;
    }

    setIsSubmitting(true);
    let uploadedImages = formData.images.map(img => img.preview || img);
    let uploadedVideo = typeof formData.video === 'string' ? formData.video : (formData.video?.preview || formData.video?.url || null);

    const imagesToUpload = formData.images.filter(img => img.file instanceof File).map(img => img.file);
    const videoToUpload = formData.video instanceof File ? formData.video : null;

    const filesToUpload = [...imagesToUpload];
    if (videoToUpload) {
      filesToUpload.push(videoToUpload);
    }

    if (filesToUpload.length > 0) {
      try {
        const urlsList = await sellerApi.uploadProductMedia(filesToUpload);
        let urlIdx = 0;
        uploadedImages = formData.images.map(img => {
          if (img.file instanceof File) {
            return urlsList[urlIdx++];
          }
          return img.preview || img;
        });
        if (videoToUpload) {
          uploadedVideo = urlsList[urlIdx++];
        }
      } catch (uploadError) {
        console.warn('Lỗi tải media lên Backend, sử dụng dự phòng local URLs:', uploadError);
        alert('Lưu ý: Không thể tải ảnh/video lên server Backend (Lỗi mạng hoặc server quá tải).\nHệ thống sẽ tạm thời dùng liên kết cục bộ để bạn tiếp tục lưu bản nháp.');

        uploadedImages = formData.images.map(img => {
          if (img.file instanceof File) {
            try {
              return URL.createObjectURL(img.file);
            } catch (e) {
              return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500';
            }
          }
          return img.preview || img;
        });
        if (videoToUpload) {
          try {
            uploadedVideo = URL.createObjectURL(videoToUpload);
          } catch (e) {
            uploadedVideo = '';
          }
        }
      }
    }

    let calculatedPrice = 0;
    let calculatedStock = 0;
    let calculatedSku = formData.singleSku || '';

    if (!formData.hasVariant) {
      calculatedPrice = formData.singlePrice ? parseFloat(formData.singlePrice) : 0;
      calculatedStock = formData.singleStock ? parseInt(formData.singleStock, 10) : 0;
    } else {
      const prices = formData.skus.map(s => parseFloat(s.price)).filter(p => !isNaN(p));
      calculatedPrice = prices.length > 0 ? Math.min(...prices) : 0;
      calculatedStock = formData.skus.reduce((sum, s) => sum + (parseInt(s.stock, 10) || 0), 0);
      calculatedSku = formData.skus.find(s => s.sku)?.sku || '';
    }

    const backendPayload = buildBackendProductPayload(uploadedImages, uploadedVideo, 'draft');

    let beProduct = null;
    try {
      const productDetails = isEdit ? productStorage.getProductBySku(sku) : null;
      const productId = productDetails?.id;
      const isNumericId = productId && /^\d+$/.test(String(productId));

      if (isEdit && sku && isNumericId) {
        beProduct = await sellerApi.updateProduct(productId, backendPayload);
      } else {
        beProduct = await sellerApi.createProduct(backendPayload);
      }
    } catch (apiError) {
      console.error('Lỗi lưu bản nháp lên Backend:', apiError);
      alert('Không thể lưu bản nháp lên máy chủ Backend.\nChi tiết lỗi: ' + (apiError.response?.data?.message || apiError.response?.data?.error || apiError.message));
      setIsSubmitting(false);
      return;
    }

    const localPayload = {
      id: beProduct?.id || (isEdit ? (productStorage.getProductBySku(sku)?.id) : undefined),
      name: formData.productName,
      brand: formData.brand,
      category: formData.category,
      description: formData.description,
      price: calculatedPrice,
      stock: calculatedStock,
      discount: formData.singleDiscount ? parseFloat(formData.singleDiscount) : 0,
      sku: calculatedSku || `SKU-DRAFT-${Math.floor(1000 + Math.random() * 9000)}`,
      hasVariant: formData.hasVariant,
      dangerousGoods: formData.dangerousGoods,
      weight: formData.weight ? parseFloat(formData.weight) : 0,
      weightUnit: formData.weightUnit,
      length: formData.length ? parseFloat(formData.length) : '',
      width: formData.width ? parseFloat(formData.width) : '',
      height: formData.height ? parseFloat(formData.height) : '',
      shippingType: formData.shippingType,
      customPlatforms: formData.customPlatforms,
      codEnabled: formData.codEnabled,
      images: uploadedImages.map(url => ({ preview: url, name: url.split('/').pop() })),
      attributes: formData.attributes,
      video: uploadedVideo ? { name: formData.video?.name || 'video.mp4', preview: uploadedVideo } : null,
      variants: formData.hasVariant ? formData.variants : [],
      skus: formData.hasVariant ? formData.skus : [],
      status: 'Nháp',
      note: 'Bản nháp'
    };

    if (isEdit && sku) {
      productStorage.updateProduct(sku, localPayload);
      alert('Cập nhật bản nháp thành công!');
    } else {
      productStorage.addProduct(localPayload);
      alert('Lưu bản nháp thành công!');
    }

    setIsSubmitting(false);
    navigate('/vendor/san-pham');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSubmitNotice({
        tone: 'red',
        title: 'Chưa thể gửi xét duyệt',
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc trước khi gửi sản phẩm.',
      });
      mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitNotice(null);
    let uploadedImages = formData.images.map(img => img.preview || img);
    let uploadedVideo = typeof formData.video === 'string' ? formData.video : (formData.video?.preview || formData.video?.url || null);

    const imagesToUpload = formData.images.filter(img => img.file instanceof File).map(img => img.file);
    const videoToUpload = formData.video instanceof File ? formData.video : null;

    const filesToUpload = [...imagesToUpload];
    if (videoToUpload) {
      filesToUpload.push(videoToUpload);
    }

    if (filesToUpload.length > 0) {
      try {
        const urlsList = await sellerApi.uploadProductMedia(filesToUpload);
        let urlIdx = 0;
        uploadedImages = formData.images.map(img => {
          if (img.file instanceof File) {
            return urlsList[urlIdx++];
          }
          return img.preview || img;
        });
        if (videoToUpload) {
          uploadedVideo = urlsList[urlIdx++];
        }
      } catch (uploadError) {
        console.warn('Lỗi tải media lên Backend, sử dụng dự phòng local URLs:', uploadError);
        setSubmitNotice({
          tone: 'orange',
          title: 'Media chưa được tải lên máy chủ',
          message: 'Hệ thống tạm dùng liên kết cục bộ để bạn tiếp tục gửi xét duyệt sản phẩm.',
        });

        uploadedImages = formData.images.map(img => {
          if (img.file instanceof File) {
            try {
              return URL.createObjectURL(img.file);
            } catch (e) {
              return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500';
            }
          }
          return img.preview || img;
        });
        if (videoToUpload) {
          try {
            uploadedVideo = URL.createObjectURL(videoToUpload);
          } catch (e) {
            uploadedVideo = '';
          }
        }
      }
    }

    let calculatedPrice = 0;
    let calculatedStock = 0;
    let calculatedDiscount = 0;
    let calculatedSku = '';

    if (!formData.hasVariant) {
      calculatedPrice = parseFloat(formData.singlePrice);
      calculatedStock = parseInt(formData.singleStock, 10);
      calculatedDiscount = formData.singleDiscount ? parseFloat(formData.singleDiscount) : 0;
      calculatedSku = formData.singleSku;
    } else {
      const prices = formData.skus.map(s => parseFloat(s.price)).filter(p => !isNaN(p));
      calculatedPrice = prices.length > 0 ? Math.min(...prices) : 0;

      calculatedStock = formData.skus.reduce((sum, s) => sum + (parseInt(s.stock, 10) || 0), 0);

      const discounts = formData.skus.map(s => parseFloat(s.discount)).filter(d => !isNaN(d));
      calculatedDiscount = discounts.length > 0 ? Math.max(...discounts) : 0;

      calculatedSku = formData.skus.find(s => s.sku)?.sku || '';
    }

    const backendPayload = buildBackendProductPayload(uploadedImages, uploadedVideo, 'pending');

    let beProduct = null;
    try {
      const productDetails = isEdit ? productStorage.getProductBySku(sku) : null;
      const productId = productDetails?.id;
      const isNumericId = productId && /^\d+$/.test(String(productId));

      if (isEdit && sku && isNumericId) {
        beProduct = await sellerApi.updateProduct(productId, backendPayload);
      } else {
        beProduct = await sellerApi.createProduct(backendPayload);
      }
    } catch (apiError) {
      console.error('Lỗi khi gửi sản phẩm lên Backend:', apiError);
      setSubmitNotice({
        tone: 'red',
        title: 'Không thể gửi xét duyệt',
        message: apiError.response?.data?.message || apiError.response?.data?.error || apiError.message,
      });
      mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSubmitting(false);
      return;
    }

    const localProductPayload = {
      id: beProduct?.id || (isEdit ? (productStorage.getProductBySku(sku)?.id) : undefined),
      name: formData.productName,
      brand: formData.brand,
      category: formData.category,
      description: formData.description,
      price: calculatedPrice,
      stock: calculatedStock,
      discount: calculatedDiscount,
      sku: calculatedSku || `SKU-REVIEW-${Math.floor(1000 + Math.random() * 9000)}`,
      hasVariant: formData.hasVariant,
      dangerousGoods: formData.dangerousGoods,
      weight: formData.weight ? parseFloat(formData.weight) : 0,
      weightUnit: formData.weightUnit,
      length: formData.length ? parseFloat(formData.length) : '',
      width: formData.width ? parseFloat(formData.width) : '',
      height: formData.height ? parseFloat(formData.height) : '',
      shippingType: formData.shippingType,
      customPlatforms: formData.customPlatforms,
      codEnabled: formData.codEnabled,
      images: uploadedImages.map(url => ({ preview: url, name: url.split('/').pop() })),
      attributes: formData.attributes,
      video: uploadedVideo ? { name: formData.video?.name || 'video.mp4', preview: uploadedVideo } : null,
      variants: formData.hasVariant ? formData.variants : [],
      skus: formData.hasVariant ? formData.skus : [],
      status: 'Chờ duyệt',
      note: 'Đang chờ Admin duyệt'
    };

    if (isEdit && sku) {
      productStorage.updateProduct(sku, localProductPayload);
      navigate('/vendor/san-pham', {
        state: {
          toast: {
            title: 'Cập nhật và gửi xét duyệt thành công',
            message: 'Sản phẩm đã được chuyển sang hàng chờ Admin phê duyệt.',
          },
        },
      });
    } else {
      productStorage.addProduct(localProductPayload);
      const updated = consumeOneSlot();
      setPlanData(updated);
      navigate('/vendor/san-pham', {
        state: {
          toast: {
            title: 'Gửi xét duyệt thành công',
            message: 'Sản phẩm đã được chuyển sang hàng chờ Admin phê duyệt.',
          },
        },
      });
    }

    setIsSubmitting(false);
  };

  const sections = [
    { id: 'basic', label: 'Thông tin cơ bản' },
    { id: 'detail', label: 'Chi tiết sản phẩm' },
    { id: 'sales', label: 'Thông tin bán hàng' },
  ];

  return (
    <div className="vendor-app vendor-app-premium flex h-screen bg-slate-50/50 text-slate-800 relative">
      {/* ── Quota Exhausted Overlay (Step 3A) ── */}
      {isQuotaExhausted && (
        <div className="quota-form-overlay">
          <div className="quota-form-block-card">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-stone-900 mb-2">
              Bạn đã dùng hết lượt đăng tin
            </h3>
            <p className="text-sm font-semibold text-stone-500 mb-6 leading-relaxed">
              Gói <span className="font-extrabold text-stone-700 capitalize">{planData.planId}</span> của bạn đã hết{' '}
              <span className="font-extrabold text-red-600">{planData.totalSlots} lượt</span> đăng tin. Nâng cấp gói để tiếp tục.
            </p>
            <button
              type="button"
              className="vendor-primary-button w-full justify-center mb-3"
              onClick={() => setShowPlanModal(true)}
            >
              Nâng cấp gói ngay
            </button>
            <button
              type="button"
              className="vendor-secondary-button w-full justify-center text-xs"
              onClick={() => navigate('/vendor/san-pham')}
            >
              Quay lại trang sản phẩm
            </button>
          </div>
        </div>
      )}

      {/* Plan Modal */}
      <SubscriptionPlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanSelected={(plan) => {
          setPlanData(getVendorPlan());
        }}
        blocksNavigation={isQuotaExhausted}
        currentPlanId={planData.planId}
      />
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200/80 shadow-[1px_0_0_0_rgba(0,0,0,0.02)] overflow-y-auto no-scrollbar sticky top-0 h-screen flex flex-col justify-between z-20">
        <div>
          <div className="bg-white border-b border-slate-200/80 px-6 py-5 flex items-center gap-3">
            <span className="w-2 h-4 rounded-sm bg-[#12372d] flex-shrink-0" />
            <h3 className="font-bold text-slate-800 text-base">Mục lục</h3>
          </div>

          <nav className="p-4 space-y-3">
            {/* THÔNG TIN CƠ BẢN (Collapsible Card) */}
            <div>
              {isBasicExpanded ? (
                <div className={cn(
                  "rounded-2xl p-3 border transition-all shadow-[0_4px_20px_-6px_rgba(0,0,0,0.02)]",
                  activeSection === 'basic'
                    ? "bg-gradient-to-r from-orange-50/60 to-amber-50/10 border-orange-200/80 border-l-4 border-l-orange-500 shadow-sm"
                    : "bg-slate-50/70 border-slate-200/50"
                )}>
                  <button
                    onClick={() => {
                      setIsBasicExpanded(false);
                      handleSectionClick('basic');
                    }}
                    className={cn(
                      "w-full flex items-center justify-between text-left font-bold text-[13px] px-2 py-1 transition-colors",
                      activeSection === 'basic' ? "text-orange-600" : "text-slate-800 hover:text-slate-900"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      Thông tin cơ bản
                      <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-orange-100">
                        4 mặt hàng
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-500 transform rotate-180 transition-transform duration-200" />
                  </button>

                  <div className="mt-2 space-y-1.5">
                    {/* Hình ảnh */}
                    <button
                      onClick={() => handleSubSectionClick('images', imagesRef)}
                      className="w-full text-left focus:outline-none rounded-xl p-3 border border-transparent bg-transparent hover:border-orange-200/60 hover:bg-orange-50/50 hover:shadow-sm transition-all group block"
                    >
                      <h4 className={cn(
                        "text-xs font-bold mb-1.5 transition-colors",
                        activeSubSection === 'images' && activeSection === 'basic' ? "text-orange-600" : "text-slate-700 group-hover:text-orange-600"
                      )}>Hình ảnh</h4>
                      <ul className="space-y-1.5 pl-0.5">
                        <li className={cn(
                          "flex items-start gap-2 text-[11px] font-medium leading-relaxed transition-colors",
                          activeSubSection === 'images' && activeSection === 'basic' ? "text-orange-600/90" : "text-slate-500 group-hover:text-orange-600/90"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 transition-colors",
                            activeSubSection === 'images' && activeSection === 'basic' ? "bg-orange-500" : "bg-slate-400 group-hover:bg-orange-400/80"
                          )} />
                          <span>Có ít hơn 5 ảnh sản phẩm</span>
                        </li>
                        <li className={cn(
                          "flex items-start gap-2 text-[11px] font-medium leading-relaxed transition-colors",
                          activeSubSection === 'images' && activeSection === 'basic' ? "text-orange-600/90" : "text-slate-500 group-hover:text-orange-600/90"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 transition-colors",
                            activeSubSection === 'images' && activeSection === 'basic' ? "bg-orange-500" : "bg-slate-400 group-hover:bg-orange-400/80"
                          )} />
                          <span>Hình ảnh chính có nền chất lượng thấp.</span>
                        </li>
                      </ul>
                    </button>

                    {/* Tên sản phẩm */}
                    <button
                      onClick={() => handleSubSectionClick('name', nameRef)}
                      className="w-full text-left focus:outline-none rounded-xl p-3 border border-transparent bg-transparent hover:border-orange-200/60 hover:bg-orange-50/50 hover:shadow-sm transition-all group block"
                    >
                      <h4 className={cn(
                        "text-xs font-bold mb-1.5 transition-colors",
                        activeSubSection === 'name' && activeSection === 'basic' ? "text-orange-600" : "text-slate-700 group-hover:text-orange-600"
                      )}>Tên sản phẩm</h4>
                      <ul className="space-y-1.5 pl-0.5">
                        <li className={cn(
                          "flex items-start gap-2 text-[11px] font-medium leading-relaxed transition-colors",
                          activeSubSection === 'name' && activeSection === 'basic' ? "text-orange-600/90" : "text-slate-500 group-hover:text-orange-600/90"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 transition-colors",
                            activeSubSection === 'name' && activeSection === 'basic' ? "bg-orange-500" : "bg-slate-400 group-hover:bg-orange-400/80"
                          )} />
                          <span>Tên sản phẩm ít hơn 40 ký tự.</span>
                        </li>
                      </ul>
                    </button>

                    {/* Hạng mục */}
                    <button
                      onClick={() => handleSubSectionClick('category', categoryRef)}
                      className="w-full text-left focus:outline-none rounded-xl p-3 border border-transparent bg-transparent hover:border-orange-200/60 hover:bg-orange-50/50 hover:shadow-sm transition-all group block"
                    >
                      <h4 className={cn(
                        "text-xs font-bold mb-1.5 transition-colors",
                        activeSubSection === 'category' && activeSection === 'basic' ? "text-orange-600" : "text-slate-700 group-hover:text-orange-600"
                      )}>Hạng mục</h4>
                      <ul className="space-y-1.5 pl-0.5">
                        <li className={cn(
                          "flex items-start gap-2 text-[11px] font-medium leading-relaxed transition-colors",
                          activeSubSection === 'category' && activeSection === 'basic' ? "text-orange-600/90" : "text-slate-500 group-hover:text-orange-600/90"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 transition-colors",
                            activeSubSection === 'category' && activeSection === 'basic' ? "bg-orange-500" : "bg-slate-400 group-hover:bg-orange-400/80"
                          )} />
                          <span>Hạng mục cấp 2&3 cần được kiểm tra lại</span>
                        </li>
                      </ul>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsBasicExpanded(true);
                    handleSectionClick('basic');
                  }}
                  className={cn(
                    'w-full text-left px-4 py-3 transition-all flex items-center justify-between text-xs font-bold rounded-xl border border-transparent',
                    activeSection === 'basic'
                      ? 'bg-gradient-to-r from-orange-50/80 to-amber-50/20 text-orange-600 border-l-4 border-l-orange-500 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/60'
                  )}
                >
                  <span className="flex items-center gap-2">
                    Thông tin cơ bản
                    <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold border border-orange-100">
                      4 mặt hàng
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-500 transition-transform duration-200" />
                </button>
              )}
            </div>

            {/* OTHER SECTIONS */}
            {sections
              .filter((item) => item.id !== 'basic')
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 transition-all text-xs font-bold mt-1 flex items-center rounded-xl border border-transparent',
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-orange-50/80 to-amber-50/20 text-orange-600 border-l-4 border-l-orange-500 shadow-sm shadow-orange-500/5'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/60'
                  )}
                >
                  {item.label}
                </button>
              ))}
          </nav>
        </div>

        {/* Info Box */}
        <div className="m-4 p-4 bg-emerald-50/50 border border-emerald-100/80 rounded-xl shadow-[0_2px_8px_rgba(18,55,45,0.02)]">
          <p className="text-xs font-bold text-[#12372d] mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#12372d] animate-pulse" />
            Mẹo nhà bán hàng:
          </p>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            Sản phẩm điện tử có ít nhất 5 hình ảnh góc cạnh khác nhau và mô tả chi tiết thông số kỹ thuật sẽ tăng tỷ lệ duyệt và chốt đơn đến 40%.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="vendor-topbar sticky top-0 px-8 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (isDirty) {
                  setShowExitConfirmModal(true);
                } else {
                  navigate('/vendor/san-pham');
                }
              }}
              className="vendor-icon-button"
              title="Quay lại"
            >
              <ChevronLeft className="h-5 w-5 text-slate-500" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
              <p className="text-xs font-medium text-slate-400">Thiết bị điện tử & Phụ kiện công nghệ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="vendor-secondary-button"
            >
              <Save className="h-4 w-4" />
              Lưu nháp
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="vendor-primary-button gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Gửi xét duyệt
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8 w-full">
          {submitNotice && (
            <div
              className={cn(
                'flex items-start gap-3 rounded-2xl border px-5 py-4 shadow-sm',
                submitNotice.tone === 'red'
                  ? 'border-red-100 bg-red-50 text-red-800'
                  : 'border-orange-100 bg-orange-50 text-orange-800'
              )}
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-extrabold">{submitNotice.title}</p>
                <p className="mt-1 text-xs font-semibold leading-5">{submitNotice.message}</p>
              </div>
              <button
                type="button"
                aria-label="Đóng thông báo"
                onClick={() => setSubmitNotice(null)}
                className="ml-auto rounded-full p-1 opacity-70 transition hover:bg-white/60 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* SECTION 1: THÔNG TIN CƠ BẢN */}
          <section ref={sectionRefs.basic} className="vendor-panel p-8 bg-white space-y-6">
            <div className="relative pl-4 py-0.5 bg-gradient-to-r from-slate-50 to-transparent rounded-r-lg">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#12372d] to-[#ea580c] rounded-full" />
              <h2 className="text-base font-bold text-slate-800 leading-none mb-1.5">Thông tin cơ bản</h2>
              <p className="text-xs text-slate-400 font-medium">Thông tin chung về thiết bị điện tử của bạn</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50/60 to-orange-50/30 border border-amber-200/60 rounded-2xl p-4 flex gap-4 mt-4 shadow-sm items-center">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center flex-shrink-0 shadow-sm shadow-amber-500/5">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950 mb-0.5">Khuyên dùng hình ảnh chất lượng</h4>
                <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
                  Để tăng khả năng hiển thị, vui lòng cung cấp ít nhất 5 hình ảnh chụp rõ nét các góc cạnh khác nhau của thiết bị.
                </p>
              </div>
            </div>

            {/* Images */}
            <div ref={imagesRef}>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Hình ảnh sản phẩm <span className="text-red-500">*</span>
              </label>
              <ProductImageUploadV3
                value={formData.images}
                onChange={(images) => handleFieldChange('images', images)}
                error={errors.images}
              />
            </div>

            {/* Product Name */}
            <div ref={nameRef}>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={255}
                  placeholder="Nhập tên thiết bị (VD: Điện thoại Samsung Galaxy S24 Ultra 256GB)"
                  value={formData.productName}
                  onChange={(e) => handleFieldChange('productName', e.target.value)}
                  className={cn(
                    'vendor-input w-full px-3.5 py-2.5 text-sm transition-all pr-16',
                    errors.productName && 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  )}
                />
                <span className="absolute right-3 top-3.5 text-[10px] font-bold text-slate-400">
                  {formData.productName.length}/255
                </span>
              </div>
              {errors.productName && (
                <p className="text-xs font-bold text-red-600 mt-2 flex items-center gap-1">⚠️ {errors.productName}</p>
              )}
            </div>

            {/* Hạng mục */}
            <div ref={categoryRef}>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Hạng mục <span className="text-red-500">*</span>
              </label>
              <CategorySelectorField
                value={formData.category}
                onChange={(cat) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: cat,
                    attributes: {}
                  }));
                  setErrors((prev) => ({ ...prev, category: '', attributes: {} }));
                  setIsDirty(true);
                }}
                error={errors.category}
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Thương hiệu
              </label>
              <BrandSelectorField
                value={formData.brand}
                onChange={(brand) => handleFieldChange('brand', brand)}
                error={errors.brand}
              />
            </div>

            {/* Thuộc tính động */}
            <ProductAttributesField
              categoryId={formData.category}
              value={formData.attributes}
              onChange={(attrs) => handleFieldChange('attributes', attrs)}
              errors={errors.attributes || {}}
            />
          </section>

          {/* SECTION 2: CHI TIẾT SẢN PHẨM */}
          <section ref={sectionRefs.detail} className="vendor-panel p-8 bg-white space-y-6">
            <div className="relative pl-4 py-0.5 bg-gradient-to-r from-slate-50 to-transparent rounded-r-lg">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#12372d] to-[#ea580c] rounded-full" />
              <h2 className="text-base font-bold text-slate-800 leading-none mb-1.5">Chi tiết sản phẩm</h2>
              <p className="text-xs text-slate-400 font-medium">Cung cấp mô tả kỹ thuật chi tiết của sản phẩm</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <ProductDescriptionEditor
                value={formData.description}
                onChange={(desc) => handleFieldChange('description', desc)}
                error={errors.description}
              />
              <div className="flex items-center justify-between mt-2">
                <span />
                <p className="text-xs font-bold text-slate-400 ml-auto">
                  {formData.description.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length} từ
                </p>
              </div>
            </div>

            {/* Video */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Video giới thiệu sản phẩm <span className="text-slate-400 font-normal normal-case tracking-normal">(Tùy chọn)</span>
              </label>

              {!formData.video ? (
                <div
                  className="border border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-8 text-center transition-all duration-200 hover:border-orange-400 hover:bg-orange-50/10 group cursor-pointer"
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-orange-400', 'bg-orange-50/10'); }}
                  onDragLeave={(e) => { e.currentTarget.classList.remove('border-orange-400', 'bg-orange-50/10'); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-orange-400', 'bg-orange-50/10');
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('video/')) {
                      if (file.size > 5 * 1024 * 1024) {
                        setErrors((prev) => ({ ...prev, video: 'Dung lượng video không được vượt quá 5MB' }));
                      } else {
                        handleFieldChange('video', file);
                        setErrors((prev) => ({ ...prev, video: '' }));
                      }
                    } else if (file) {
                      setErrors((prev) => ({ ...prev, video: 'Chỉ chấp nhận file video (MP4, MOV, AVI, MKV)' }));
                    }
                  }}
                >
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo,video/avi,.mkv"
                    onChange={handleVideoUpload}
                    id="video-upload"
                    className="hidden"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer block">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-1">Kéo thả hoặc nhấn để chọn video</p>
                    <p className="text-xs text-slate-400 font-medium">MP4, MOV, MKV, AVI · Tối đa 5MB · Tỷ lệ khuyên dùng 16:9</p>
                  </label>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  {/* Video player */}
                  <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
                    <video
                      key={formData.video.name || (typeof formData.video === 'string' ? formData.video : 'stored-video')}
                      className="w-full h-full object-contain"
                      controls
                      src={getVideoSrc(formData.video)}
                      onLoadedMetadata={(e) => {
                        e.currentTarget.dataset.duration = e.currentTarget.duration;
                      }}
                    />
                  </div>
                  {/* File info bar */}
                  <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-200">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate">{formData.video.name || 'video_gioi_thieu.mp4'}</p>
                      <p className="text-xs text-slate-400 font-medium">
                        {formData.video.size ? `${(formData.video.size / (1024 * 1024)).toFixed(2)} MB` : '15 MB'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <label
                        htmlFor="video-upload-replace"
                        className="cursor-pointer text-xs font-bold text-orange-600 hover:text-orange-700 px-3.5 py-2 border border-orange-200 rounded-lg hover:bg-orange-50/50 transition-colors"
                      >
                        Thay thế
                        <input
                          type="file"
                          accept="video/mp4,video/quicktime,video/x-msvideo,video/avi,.mkv"
                          onChange={handleVideoUpload}
                          id="video-upload-replace"
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleFieldChange('video', null)}
                        className="text-xs font-bold text-red-600 hover:text-red-700 px-3.5 py-2 border border-red-200 rounded-lg hover:bg-red-50/50 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {errors.video && (
                <p className="text-xs font-bold text-red-600 mt-2 flex items-center gap-1">⚠️ {errors.video}</p>
              )}
            </div>
          </section>

          {/* SECTION 3: THÔNG TIN BÁN HÀNG */}
          <section ref={sectionRefs.sales} className="vendor-panel p-8 bg-white space-y-6">
            <div className="relative pl-4 py-0.5 bg-gradient-to-r from-slate-50 to-transparent rounded-r-lg">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#12372d] to-[#ea580c] rounded-full" />
              <h2 className="text-base font-bold text-slate-800 leading-none mb-1.5">Thông tin bán hàng</h2>
              <p className="text-xs text-slate-400 font-medium">Thiết lập cấu hình giá bán và phân loại hàng hóa</p>
            </div>

            <ProductVariantsField
              hasVariant={formData.hasVariant}
              variants={formData.variants}
              skus={formData.skus}
              singlePrice={formData.singlePrice}
              singleStock={formData.singleStock}
              singleDiscount={formData.singleDiscount}
              singleSku={formData.singleSku}
              errors={errors}
              onChange={(updatedFields) => {
                setFormData((prev) => ({
                  ...prev,
                  ...updatedFields,
                }));
                setIsDirty(true);
                // Clear errors related to sales fields
                setErrors((prev) => {
                  const copy = { ...prev };
                  Object.keys(updatedFields).forEach((key) => {
                    delete copy[key];
                    if (key === 'singlePrice' || key === 'singleStock') {
                      delete copy.price;
                      delete copy.stock;
                    }
                  });
                  return copy;
                });
              }}
            />

            {/* Dangerous Goods */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Hàng hóa có pin hoặc chất cháy nổ
              </label>
              <select
                value={formData.dangerousGoods}
                onChange={(e) => handleFieldChange('dangerousGoods', e.target.value)}
                className="vendor-input w-full px-3 py-2.5 text-sm bg-white text-slate-700"
              >
                <option value="no">Không (Thiết bị thông thường không pin lớn)</option>
                <option value="battery">Có chứa pin sạc dự phòng/Lithium</option>
                <option value="flammable">Dễ cháy (Có linh kiện tỏa nhiệt mạnh)</option>
                <option value="explosive">Linh kiện có tụ áp suất cao</option>
              </select>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Shop yêu cầu khai báo trung thực các thiết bị có pin Lithium để đảm bảo an toàn vận chuyển bay.
              </p>
            </div>
          </section>

          {/* SECTION 5: VẬN CHUYỂN */}
          <section ref={sectionRefs.shipping} className="hidden">
            <div className="relative pl-4 py-0.5 bg-gradient-to-r from-slate-50 to-transparent rounded-r-lg">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#12372d] to-[#ea580c] rounded-full" />
              <h2 className="text-base font-bold text-slate-800 leading-none mb-1.5">Vận chuyển</h2>
              <p className="text-xs text-slate-400 font-medium">Thiết lập thông tin khối lượng và kích thước để tính phí vận chuyển</p>
            </div>

            {/* Weight */}
            <div className="space-y-2 relative">
              <label className="block text-xs font-bold text-slate-700">
                <span className="text-red-500">*</span> Trọng lượng kiện hàng <HelpCircle className="h-3.5 w-3.5 text-slate-300 inline ml-1 cursor-pointer" />
              </label>

              <div className="relative flex items-center border border-slate-200 rounded-xl bg-white focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 h-11 overflow-visible transition-all">
                {/* Custom unit selector button on the left */}
                <button
                  type="button"
                  onClick={() => setShowWeightUnitMenu(!showWeightUnitMenu)}
                  className="flex items-center gap-1.5 px-4 h-full border-r border-slate-200 hover:bg-slate-50 cursor-pointer select-none text-xs font-bold text-slate-600 transition-colors"
                >
                  <span>{formData.weightUnit === 'g' ? 'Gam (g)' : 'Kilogam (kg)'}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {/* Dropdown popup */}
                {showWeightUnitMenu && (
                  <div className="absolute left-0 top-12 z-30 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5">
                    {[
                      { value: 'g', label: 'Gam (g)' },
                      { value: 'kg', label: 'Kilogam (kg)' },
                    ].map((unit) => (
                      <button
                        key={unit.value}
                        type="button"
                        onClick={() => {
                          handleFieldChange('weightUnit', unit.value);
                          setShowWeightUnitMenu(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
                      >
                        <span>{unit.label}</span>
                        {formData.weightUnit === unit.value ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-orange-600 border-2 border-white ring-1 ring-orange-600" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Weight Input field on the right */}
                <input
                  type="number"
                  placeholder="Nhập trọng lượng kiện hàng"
                  value={formData.weight}
                  onChange={(e) => handleFieldChange('weight', e.target.value)}
                  className="flex-1 h-full px-4 text-sm focus:outline-none placeholder-slate-400 bg-transparent text-slate-800"
                />
              </div>
              {errors.weight && (
                <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1">⚠️ {errors.weight}</p>
              )}
            </div>

            {/* Kích thước kiện hàng */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Kích thước kiện hàng <HelpCircle className="h-3.5 w-3.5 text-slate-300 inline ml-1 cursor-pointer" />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                {/* Height */}
                <div className="relative flex items-center border border-slate-200 rounded-xl bg-white focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 h-11 px-4 transition-all">
                  <input
                    type="number"
                    placeholder="Chiều cao"
                    value={formData.height}
                    onChange={(e) => handleFieldChange('height', e.target.value)}
                    className="w-full h-full text-sm placeholder-slate-400 bg-transparent focus:outline-none pr-28 text-slate-800"
                  />
                  <span className="absolute right-4 text-xs font-semibold text-slate-400 pointer-events-none select-none">
                    Centimet (cm)
                  </span>
                </div>

                {/* Width */}
                <div className="relative flex items-center border border-slate-200 rounded-xl bg-white focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 h-11 px-4 transition-all">
                  <input
                    type="number"
                    placeholder="Chiều rộng"
                    value={formData.width}
                    onChange={(e) => handleFieldChange('width', e.target.value)}
                    className="w-full h-full text-sm placeholder-slate-400 bg-transparent focus:outline-none pr-28 text-slate-800"
                  />
                  <span className="absolute right-4 text-xs font-semibold text-slate-400 pointer-events-none select-none">
                    Centimet (cm)
                  </span>
                </div>

                {/* Length */}
                <div className="relative flex items-center border border-slate-200 rounded-xl bg-white focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 h-11 px-4 transition-all">
                  <input
                    type="number"
                    placeholder="Chiều dài"
                    value={formData.length}
                    onChange={(e) => handleFieldChange('length', e.target.value)}
                    className="w-full h-full text-sm placeholder-slate-400 bg-transparent focus:outline-none pr-28 text-slate-800"
                  />
                  <span className="absolute right-4 text-xs font-semibold text-slate-400 pointer-events-none select-none">
                    Centimet (cm)
                  </span>
                </div>
              </div>
            </div>

            {/* Cách giao hàng */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                <span className="text-red-500">*</span> Cách giao hàng <HelpCircle className="h-3.5 w-3.5 text-slate-300 inline ml-1 cursor-pointer" />
              </label>

              <div className="flex items-center gap-6">
                {[
                  { value: 'default', label: 'Mặc định' },
                  { value: 'custom', label: 'Tùy chỉnh' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    onClick={() => handleFieldChange('shippingType', opt.value)}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    {formData.shippingType === opt.value ? (
                      <span className="w-4 h-4 rounded-full bg-orange-600 border-4 border-white ring-1 ring-orange-600 transition-all" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 bg-white transition-all" />
                    )}
                    <span className="text-xs font-semibold text-slate-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Platform estimation or custom platforms list */}
            {formData.shippingType === 'default' ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 pt-1">
                <span>Phí vận chuyển ước tính --</span>
                <HelpCircle className="h-3.5 w-3.5 text-slate-300 cursor-pointer" />
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-1">
                  <label className="text-xs font-bold text-slate-700">Nền tảng vận chuyển</label>
                  <HelpCircle className="h-3.5 w-3.5 text-slate-300 cursor-pointer" />
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'standard', label: 'Vận chuyển tiêu chuẩn' },
                    { key: 'bulky', label: 'Vận chuyển hàng cồng kềnh' },
                    { key: 'express24h', label: 'Giao nhanh 24h' },
                    { key: 'instant', label: 'Hoả tốc' },
                  ].map((platform) => {
                    const isChecked = formData.customPlatforms?.[platform.key] ?? false;
                    return (
                      <div
                        key={platform.key}
                        onClick={() => {
                          const nextPlatforms = {
                            ...formData.customPlatforms,
                            [platform.key]: !isChecked,
                          };
                          handleFieldChange('customPlatforms', nextPlatforms);
                        }}
                        className={cn(
                          "border rounded-xl bg-white p-4 flex items-center justify-between cursor-pointer select-none transition-all duration-200",
                          isChecked ? "border-orange-500 bg-orange-50/10" : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-4.5 h-4.5 rounded flex items-center justify-center border transition-colors",
                              isChecked ? "bg-[#ea580c] border-[#ea580c] text-white" : "border-slate-300 bg-white"
                            )}
                          >
                            {isChecked && (
                              <svg className="w-3 h-3 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{platform.label}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-400">Phí vận chuyển ước tính --</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* COD Switch */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700">Thanh toán khi giao hàng</span>
              <button
                type="button"
                onClick={() => handleFieldChange('codEnabled', !formData.codEnabled)}
                className={cn(
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20",
                  formData.codEnabled ? "bg-[#ea580c]" : "bg-slate-200"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                    formData.codEnabled ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </section>

          {/* Bottom spacing */}
          <div className="h-20" />
        </div>
      </main>

      {/* Exit Confirmation Modal */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-slate-800">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base font-extrabold text-[#12372d] flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-sm bg-[#ea580c] flex-shrink-0" />
                Xác nhận rời khỏi trang
              </h3>
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 text-sm text-orange-800 leading-relaxed font-medium">
                <AlertCircle className="h-5 w-5 shrink-0 text-[#ea580c] mt-0.5" />
                <div>
                  <p className="font-bold text-orange-900 mb-1">Thay đổi chưa được lưu:</p>
                  Bạn có một số thay đổi chưa lưu. Nếu rời đi bây giờ, các chỉnh sửa này sẽ bị mất hoàn toàn.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                className="vendor-secondary-button flex-1 justify-center font-bold"
                onClick={() => setShowExitConfirmModal(false)}
              >
                Tiếp tục chỉnh sửa
              </button>
              <button
                type="button"
                className="vendor-primary-button flex-1 justify-center bg-[#ea580c] hover:bg-orange-700 text-white shadow-md shadow-orange-600/10 font-bold border-none"
                onClick={() => {
                  setShowExitConfirmModal(false);
                  navigate('/vendor/san-pham');
                }}
              >
                Rời khỏi trang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
