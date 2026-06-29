import { ELECTRONICS_CATEGORIES } from '../components/Seller/CategorySelectorField';
import { getAttributeSchema } from './attributeSchemas';

export const TECH_BRANDS = [
  'Apple', 'Samsung', 'Sony', 'LG', 'Xiaomi', 'OPPO', 'Vivo', 'realme',
  'Huawei', 'Honor', 'OnePlus', 'Google', 'Motorola', 'Nokia', 'ASUS',
  'Acer', 'Dell', 'HP', 'Lenovo', 'MSI', 'Razer', 'GIGABYTE', 'ROG (ASUS)',
  'Logitech', 'JBL', 'Bose', 'Sennheiser', 'Audio-Technica', 'AKG', 'Jabra',
  'Anker', 'Baseus', 'Ugreen', 'Belkin', 'SanDisk', 'Western Digital',
  'Seagate', 'Kingston', 'Crucial', 'Corsair', 'Cooler Master', 'Noctua',
  'NZXT', 'Thermaltake', 'be quiet!', 'Seasonic', 'Dyson', 'Philips',
  'Panasonic', 'Toshiba', 'D-Link', 'TP-Link', 'Netgear', 'Ubiquiti',
  'Intel', 'AMD', 'NVIDIA', 'Không có thương hiệu',
];

export const STATIC_CATEGORY_ID_MAP = {
  12: 'op-lung-bao-da',
  13: 'sac-cap-dt',
  14: 'kinh-cuong-luc',
  15: 'pin-du-phong',
  16: 'tai-nghe-co-day',
  17: 'de-sac-khong-day',
  18: 'may-anh-compact',
  19: 'may-anh-mirrorless',
  20: 'may-anh-dslr',
  21: 'camera-hanh-dong',
  22: 'drone',
  23: 'phu-kien-camera',
  24: 'loa-bluetooth',
  25: 'loa-de-ban',
  26: 'tai-nghe-bluetooth',
  27: 'soundbar',
  28: 'micro-thu-am',
  29: 'console-tro-choi',
  30: 'console-cam-tay',
  31: 'tro-choi-dien-tu',
  32: 'phu-kien-console',
  33: 'dong-ho-thong-minh',
  34: 'vong-suc-khoe',
  35: 'smarthome',
  36: 'den-thong-minh',
  37: 'dien-thoai-thong-minh',
  38: 'may-tinh-bang',
  39: 'dien-thoai-pho-thong',
  40: 'may-tinh-de-ban',
  41: 'laptop',
  42: 'may-tinh-bang-pc',
  43: 'ban-phim',
  44: 'chuot-pc',
  45: 'man-hinh',
  46: 'tai-nghe-gaming',
  47: 'webcam',
  48: 'loa-may-tinh',
  49: 'o-cung-hdd',
  50: 'o-cung-ssd'
};

export const STATIC_CATEGORY_SLUG_MAP = Object.entries(STATIC_CATEGORY_ID_MAP).reduce((acc, [id, slug]) => {
  acc[slug] = parseInt(id, 10);
  return acc;
}, {});

const normalizeCategoryText = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const flattenCategoryTree = (nodes = []) => {
  const result = [];
  const walk = (list) => {
    (Array.isArray(list) ? list : []).forEach((node) => {
      if (!node) return;
      result.push(node);
      if (Array.isArray(node.children) && node.children.length > 0) {
        walk(node.children);
      }
    });
  };
  walk(nodes);
  return result;
};

export const getCategoryLeaves = (nodes = []) => {
  const result = [];
  const walk = (list) => {
    (Array.isArray(list) ? list : []).forEach((node) => {
      if (Array.isArray(node.children) && node.children.length > 0) {
        walk(node.children);
      } else if (node) {
        result.push(node);
      }
    });
  };
  walk(nodes);
  return result;
};

export function resolveBackendCategoryId(categorySlug, backendCategories = []) {
  const backendNodes = flattenCategoryTree(backendCategories);
  const backendLeaves = getCategoryLeaves(backendCategories);
  const candidates = backendNodes.length ? backendNodes : backendCategories;

  if (!categorySlug) {
    return backendLeaves[0]?.id ? Number(backendLeaves[0].id) : null;
  }

  const categoryKey = String(categorySlug).trim();
  const numericId = Number(categoryKey);

  if (Number.isFinite(numericId)) {
    const exists = candidates.some((category) => Number(category.id) === numericId);
    if (exists) return numericId;
  }

  const localLeaves = getCategoryLeaves(ELECTRONICS_CATEGORIES);
  const localLeaf = localLeaves.find((leaf) => String(leaf.id) === categoryKey);
  const localName = localLeaf?.name;
  const staticSlug = STATIC_CATEGORY_ID_MAP[numericId];

  const matchers = [
    (category) => String(category.slug || '').trim().toLowerCase() === categoryKey.toLowerCase(),
    (category) => String(category.id || '').trim().toLowerCase() === categoryKey.toLowerCase(),
    (category) => staticSlug && String(category.slug || '').trim().toLowerCase() === staticSlug.toLowerCase(),
    (category) => localName && normalizeCategoryText(category.name) === normalizeCategoryText(localName),
    (category) => normalizeCategoryText(category.name) === normalizeCategoryText(categoryKey),
  ];

  for (const matcher of matchers) {
    const found = candidates.find(matcher);
    if (found?.id) return Number(found.id);
  }

  return backendLeaves[0]?.id ? Number(backendLeaves[0].id) : null;
}

const STORAGE_KEY = 'sellerProducts';

const LEGACY_MOCK_PRODUCT_IDS = new Set([
  'PRD-9012',
  'PRD-8871',
  'PRD-8730',
  'PRD-8611',
  'PRD-8594',
  'PRD-8470',
  'PRD-8352',
  'PRD-8214',
  'PRD-8188',
  'PRD-8061',
]);

const removeLegacyMockProducts = (products) => (
  Array.isArray(products)
    ? products.filter((product) => !LEGACY_MOCK_PRODUCT_IDS.has(String(product.id)))
    : []
);

export const productStorage = {
  getStoredProducts: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    try {
      const parsed = JSON.parse(data);
      const cleaned = removeLegacyMockProducts(parsed);
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch (e) {
      console.error('Lỗi phân tích cú pháp sản phẩm từ localStorage, xóa dữ liệu hỏng.', e);
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  },

  saveStoredProducts: (products) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  },

  getProductBySku: (sku) => {
    const products = productStorage.getStoredProducts();
    return products.find(p => p.sku === sku);
  },

  getProductById: (id) => {
    const products = productStorage.getStoredProducts();
    return products.find(p => p.id === id);
  },

  addProduct: (product) => {
    const products = productStorage.getStoredProducts();
    const newProduct = {
      id: product.id || `LOCAL-${Math.floor(1000 + Math.random() * 9000)}`,
      sold: product.sold || 0,
      quality: product.quality || 90,
      note: product.note || 'Mới tạo',
      ...product
    };
    products.unshift(newProduct);
    productStorage.saveStoredProducts(products);
    return newProduct;
  },

  updateProduct: (skuOrId, updatedData) => {
    const products = productStorage.getStoredProducts();
    const index = products.findIndex(p => p.sku === skuOrId || p.id === skuOrId);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...updatedData
      };
      productStorage.saveStoredProducts(products);
      return products[index];
    }
    return null;
  },

  deleteProduct: (skuOrId) => {
    const products = productStorage.getStoredProducts();
    const filtered = products.filter(p => p.sku !== skuOrId && p.id !== skuOrId);
    productStorage.saveStoredProducts(filtered);
    return filtered;
  },

  validateProduct: (product) => {
    if (!product) return { valid: false, error: 'Không tìm thấy dữ liệu sản phẩm.' };

    if (!product.images || product.images.length === 0) {
      return { valid: false, error: 'Hình ảnh sản phẩm không được để trống.' };
    }
    if (!product.name || !product.name.trim()) {
      return { valid: false, error: 'Tên sản phẩm không được để trống.' };
    }
    if (!product.category) {
      return { valid: false, error: 'Hạng mục danh mục không được để trống.' };
    }

    // Description validation
    const cleanText = (product.description || '').replace(/<[^>]*>/g, ' ').trim();
    if (!cleanText) {
      return { valid: false, error: 'Mô tả sản phẩm không được để trống.' };
    }
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    if (wordCount < 30) {
      return { valid: false, error: `Mô tả sản phẩm phải có ít nhất 30 từ (hiện tại có ${wordCount} từ).` };
    }

    // Attributes validation
    const isLaptop = product.category === 'laptop';
    const isDesktop = product.category === 'may-tinh-de-ban';
    const attrs = product.attributes || {};

    if (!attrs.warrantyType) {
      return { valid: false, error: 'Vui lòng chọn Loại bảo hành.' };
    }
    if (!attrs.originCountry) {
      return { valid: false, error: 'Vui lòng chọn Quốc gia xuất xứ.' };
    }
    if (isLaptop || isDesktop) {
      if (!attrs.responsibleName || !attrs.responsibleName.trim()) {
        return { valid: false, error: 'Vui lòng nhập Tên tổ chức chịu trách nhiệm.' };
      }
    }
    if (isLaptop) {
      if (!attrs.responsibleAddress || !attrs.responsibleAddress.trim()) {
        return { valid: false, error: 'Vui lòng nhập Địa chỉ tổ chức chịu trách nhiệm.' };
      }
    }

    // Sales info validation
    if (!product.hasVariant) {
      if (product.price === undefined || product.price === null || isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0) {
        return { valid: false, error: 'Giá bán lẻ phải là số dương lớn hơn 0.' };
      }
      if (product.stock === undefined || product.stock === null || isNaN(parseInt(product.stock, 10)) || parseInt(product.stock, 10) < 0) {
        return { valid: false, error: 'Tồn kho sản phẩm không được âm.' };
      }
    } else {
      if (!product.variants || product.variants.length === 0) {
        return { valid: false, error: 'Vui lòng thiết lập nhóm biến thể phân loại hàng.' };
      }
      if (!product.skus || product.skus.length === 0) {
        return { valid: false, error: 'Chưa cấu hình các SKU cho biến thể.' };
      }
      // Check each SKU
      for (let i = 0; i < product.skus.length; i++) {
        const sku = product.skus[i];
        if (!sku.price || isNaN(parseFloat(sku.price)) || parseFloat(sku.price) <= 0) {
          return { valid: false, error: `Biến thể "${sku.combinationName || i + 1}" chưa có giá bán hoặc giá không hợp lệ.` };
        }
        if (sku.stock === undefined || sku.stock === null || isNaN(parseInt(sku.stock, 10)) || parseInt(sku.stock, 10) < 0) {
          return { valid: false, error: `Biến thể "${sku.combinationName || i + 1}" chưa nhập số lượng tồn kho.` };
        }
        if (!sku.weight || isNaN(parseFloat(sku.weight)) || parseFloat(sku.weight) <= 0) {
          sku.weight = '500';
        }
      }
    }

    // Shipping weight validation
    if (!product.weight || isNaN(parseFloat(product.weight)) || parseFloat(product.weight) <= 0) {
      product.weight = '500';
    }

    return { valid: true };
  }
};

export function buildBackendPayloadFromLocal(product, status, categoriesList = []) {
  const categoryId = resolveBackendCategoryId(product.category, categoriesList);
  if (!categoryId) {
    throw new Error('Không xác định được danh mục hợp lệ từ máy chủ. Vui lòng tải lại trang và chọn lại danh mục.');
  }

  const mediaList = [];
  const uploadedImages = (product.images || []).map(img => img.preview || img);
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
  const uploadedVideo = typeof product.video === 'string' ? product.video : (product.video?.preview || product.video?.url || null);
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
  const attributesPayload = Object.entries(product.attributes || {}).map(([key, val], idx) => ({
    name: attributeLabelMap[key] || key,
    sortOrder: idx,
    values: [
      {
        value: String(val),
        sortOrder: 0
      }
    ]
  }));

  if (product.hasVariant && Array.isArray(product.variants)) {
    product.variants.forEach((v, idx) => {
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


  const variantsPayload = product.hasVariant ? (product.skus || []).map((s, idx) => ({
    sku: s.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
    sellerSku: s.sku || s.sellerSku || '',
    price: parseFloat(s.price) || 0,
    stock: parseInt(s.stock, 10) || 0,
    discountPercent: parseInt(s.discount) || 0,
    imageUrl: s.imageUrl || (uploadedImages[0] || ''),
    attributeValueIds: []
  })) : [
    {
      sku: product.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
      sellerSku: product.sku || '',
      price: parseFloat(product.price) || 0,
      stock: parseInt(product.stock, 10) || 0,
      discountPercent: parseInt(product.discount) || 0,
      imageUrl: uploadedImages[0] || '',
      attributeValueIds: []
    }
  ];

  const weightG = (() => {
    if (!product.weight) return 0;
    const parsed = parseFloat(product.weight);
    if (isNaN(parsed)) return 0;
    return product.weightUnit === 'kg' ? parsed * 1000 : parsed;
  })();

  const brandId = 1;

  return {
    categoryId,
    brandId,
    name: product.name,
    description: product.description,
    status: (status || 'pending').toUpperCase(),
    condition: 'new',
    originCountry: product.attributes?.originCountry || 'Việt Nam',
    warrantyType: product.attributes?.warrantyType || 'Không bảo hành',
    parcelWeightG: Math.round(weightG),
    parcelWidth: product.width ? parseInt(product.width, 10) : 0,
    parcelLength: product.length ? parseInt(product.length, 10) : 0,
    parcelHeight: product.height ? parseInt(product.height, 10) : 0,
    deliveryMethod: 'default',
    mediaList,
    attributes: attributesPayload,
    variants: variantsPayload
  };
}

export function mapBackendProductToLocal(beProd, categoriesList = []) {
  const mediaList = beProd.mediaList || beProd.media_list || [];
  const images = mediaList
    .filter(m => (m.mediaType || m.media_type) === 'image')
    .sort((a, b) => ((a.sortOrder || a.sort_order) || 0) - ((b.sortOrder || b.sort_order) || 0))
    .map(m => {
      const url = m.mediaUrl || m.media_url || '';
      return { preview: url, name: url.split('/').pop() };
    });

  const videoMedia = mediaList.find(m => (m.mediaType || m.media_type) === 'video');
  const video = videoMedia ? { name: 'video.mp4', preview: videoMedia.mediaUrl || videoMedia.media_url } : null;

  const categoryId = beProd.categoryId || beProd.category_id;
  let categorySlug = '';
  const leaves = getCategoryLeaves(ELECTRONICS_CATEGORIES);
  const beCategory = categoriesList.find(c => parseInt(c.id, 10) === categoryId);
  if (beCategory) {
    const leafMatch = leaves.find(l => l.name.trim().toLowerCase() === beCategory.name.trim().toLowerCase());
    if (leafMatch) {
      categorySlug = leafMatch.id;
    } else {
      categorySlug = beCategory.id ? beCategory.id.toString() : '';
    }
  }

  if (!categorySlug && beProd.categoryName) {
    const leafMatch = leaves.find(l => l.name.trim().toLowerCase() === beProd.categoryName.trim().toLowerCase());
    if (leafMatch) {
      categorySlug = leafMatch.id;
    }
  }

  if (!categorySlug && categoryId) {
    categorySlug = STATIC_CATEGORY_ID_MAP[categoryId] || categoryId.toString();
  }

  const brandId = beProd.brandId || beProd.brand_id;
  let brandName = '';
  if (brandId && !isNaN(brandId)) {
    const idx = parseInt(brandId, 10) - 1;
    brandName = TECH_BRANDS[idx] || 'Apple';
  }

  const originCountry = beProd.originCountry || beProd.origin_country || '';
  const warrantyType = beProd.warrantyType || beProd.warranty_type || '';

  const attributes = {};
  const attributeKeyMap = {
    'Loại bảo hành': 'warrantyType',
    'Quốc gia xuất xứ': 'originCountry',
    'Tổ chức chịu trách nhiệm': 'responsibleName',
    'Địa chỉ tổ chức chịu trách nhiệm': 'responsibleAddress'
  };
  (beProd.attributes || []).forEach(attr => {
    const key = attributeKeyMap[attr.name] || attr.name;
    const val = attr.values?.[0]?.value || '';
    if (key) {
      attributes[key] = val;
    }
  });
  if (originCountry && !attributes.originCountry) {
    attributes.originCountry = originCountry;
  }
  if (warrantyType && !attributes.warrantyType) {
    attributes.warrantyType = warrantyType;
  }

  const statusMap = {
    'draft': 'Nháp',
    'pending': 'Chờ duyệt',
    'approved': 'Đang bán',
    'active': 'Đang bán',
    'rejected': 'Bị từ chối',
    'warning': 'Cảnh báo',
    'inactive': 'Tạm ẩn',
  };
  const rawStatus = String(beProd.status || '').toLowerCase();
  const uiStatus = statusMap[rawStatus] || beProd.status || '';

  const beVariants = beProd.variants || beProd.product_variants || beProd.productVariants || [];
  const hasVariant = beVariants.length > 1;
  let price = 0;
  let stock = 0;
  let discount = 0;
  let sku = '';
  let skus = [];
  let variants = [];

  if (hasVariant) {
    const schema = getAttributeSchema(categorySlug) || getAttributeSchema('fallback');
    const staticFieldLabels = new Set([
      'Loại bảo hành',
      'Quốc gia xuất xứ',
      'Tổ chức chịu trách nhiệm',
      'Địa chỉ tổ chức chịu trách nhiệm'
    ]);

    if (schema) {
      const allFields = [
        ...(schema.requiredFields || []),
        ...(schema.mainFields || []),
        ...(schema.optionalFields || [])
      ];
      allFields.forEach(f => {
        if (f.label) staticFieldLabels.add(f.label);
      });
    }

    const variantGroupsFromAttrs = (beProd.attributes || []).filter(attr => !staticFieldLabels.has(attr.name));

    variants = variantGroupsFromAttrs.map((attr, gIdx) => {
      const groupId = `var_${gIdx + 1}_${Date.now()}`;
      return {
        id: groupId,
        name: attr.name,
        options: (attr.values || []).map((val, oIdx) => ({
          id: `opt_${gIdx + 1}_${oIdx + 1}_${Date.now()}`,
          value: val.value,
          dbValueId: val.id
        }))
      };
    });

    const prices = beVariants.map(v => v.price).filter(p => typeof p === 'number');
    price = prices.length > 0 ? Math.min(...prices) : 0;
    stock = beVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
    const discounts = beVariants.map(v => v.discountPercent !== undefined ? v.discountPercent : v.discount_percent).filter(d => typeof d === 'number');
    discount = discounts.length > 0 ? Math.max(...discounts) : 0;

    skus = beVariants.map((v, vIdx) => {
      const matchedOptions = [];
      const combinationValues = [];
      const vAttrValueIds = v.attributeValueIds || v.attribute_value_ids || [];

      if (Array.isArray(vAttrValueIds) && vAttrValueIds.length > 0) {
        vAttrValueIds.forEach(id => {
          variants.forEach(g => {
            const opt = g.options.find(o => o.dbValueId === id);
            if (opt) {
              matchedOptions.push(opt);
              combinationValues.push(opt.value);
            }
          });
        });
      }

      const vSku = v.sku || '';
      const vSellerSku = v.sellerSku || v.seller_sku || '';
      if (combinationValues.length < variants.length) {
        const combName = vSku || vSellerSku || '';
        const parts = combName.replace(/^SKU-/, '').split(/[-_,]+/);

        variants.forEach(g => {
          const alreadyMatched = matchedOptions.some(o => g.options.includes(o));
          if (!alreadyMatched) {
            const opt = g.options.find(o => {
              const valLower = o.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              return parts.some(p => {
                const pLower = p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return valLower === pLower || o.value.toLowerCase() === p.toLowerCase();
              });
            });
            if (opt) {
              matchedOptions.push(opt);
              combinationValues.push(opt.value);
            }
          }
        });
      }

      if (combinationValues.length === 0 && variants.length > 0) {
        variants.forEach(g => {
          const opt = g.options[vIdx % g.options.length] || g.options[0];
          if (opt) {
            matchedOptions.push(opt);
            combinationValues.push(opt.value);
          }
        });
      }

      const combKey = matchedOptions.map(o => o.id).join('|');
      const combinationName = combinationValues.join(', ');
      const weightG = beProd.parcelWeightG || beProd.parcel_weight_g;

      return {
        id: v.id ? `sku_${v.id}` : `sku_${Math.random().toString(36).substr(2, 9)}`,
        key: combKey,
        combinationName,
        combinationValues,
        price: String(v.price),
        stock: String(v.stock),
        discount: String(v.discountPercent !== undefined ? v.discountPercent : (v.discount_percent || 0)),
        weight: String(weightG ? weightG / 1000 : 0.5),
        sku: vSku,
        sellerSku: vSellerSku,
        imageUrl: v.imageUrl || v.image_url || ''
      };
    });
    sku = beVariants.find(v => v.sku)?.sku || beVariants[0]?.sku || '';
  } else {
    const singleV = beVariants?.[0] || {};
    price = singleV.price || 0;
    stock = singleV.stock || 0;
    discount = singleV.discountPercent !== undefined ? singleV.discountPercent : (singleV.discount_percent || 0);
    sku = singleV.sku || '';
  }

  const parcelWeightG = beProd.parcelWeightG || beProd.parcel_weight_g;
  const parcelLength = beProd.parcelLength || beProd.parcel_length;
  const parcelWidth = beProd.parcelWidth || beProd.parcel_width;
  const parcelHeight = beProd.parcelHeight || beProd.parcel_height;

  return {
    id: beProd.id,
    name: beProd.name || '',
    brand: brandName || (beProd.brand ? String(beProd.brand) : ''),
    category: categorySlug,
    description: beProd.description || '',
    price,
    stock,
    discount,
    sku,
    hasVariant,
    dangerousGoods: 'no',
    weight: parcelWeightG ? String(parcelWeightG) : '',
    weightUnit: 'g',
    length: parcelLength ? String(parcelLength) : '',
    width: parcelWidth ? String(parcelWidth) : '',
    height: parcelHeight ? String(parcelHeight) : '',
    shippingType: 'default',
    customPlatforms: {
      standard: true,
      bulky: true,
      express24h: true,
      instant: true,
    },
    codEnabled: true,
    images,
    attributes,
    video,
    variants,
    skus,
    status: uiStatus,
    rejectReason: beProd.rejectReason || beProd.reject_reason || '',
    note: beProd.note || (uiStatus === 'Chờ duyệt' ? 'Đang chờ Admin duyệt' : uiStatus === 'Bị từ chối' ? 'Bị từ chối bởi Admin' : 'Đang hoạt động')
  };
}

export function mergeProductData(local, remote) {
  if (!local) return remote;
  if (!remote) return local;

  const isNumeric = (str) => /^\d+$/.test(String(str));

  // Determine category
  let category = local.category;
  if (remote.category && !isNumeric(remote.category)) {
    category = remote.category;
  } else if (local.category && !isNumeric(local.category)) {
    category = local.category;
  } else if (remote.category) {
    category = remote.category;
  }

  // Determine brand
  let brand = local.brand || remote.brand || '';
  if (local.brand && local.brand !== 'Không có thương hiệu') {
    brand = local.brand;
  } else if (remote.brand) {
    brand = remote.brand;
  }

  // Merge attributes
  const attributes = { ...(local.attributes || {}) };
  if (remote.attributes && Object.keys(remote.attributes).length > 0) {
    Object.entries(remote.attributes).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        attributes[key] = val;
      }
    });
  }

  // Merge images
  let images = local.images || [];
  if (Array.isArray(remote.images) && remote.images.length > 0) {
    images = remote.images;
  } else if (local.images && local.images.length > 0) {
    images = local.images;
  }

  // Merge video
  let video = local.video || remote.video;

  // Merge variants
  let variants = local.variants || [];
  if (Array.isArray(remote.variants) && remote.variants.length > 0) {
    variants = remote.variants;
  }

  // Merge skus
  let skus = local.skus || [];
  if (Array.isArray(remote.skus) && remote.skus.length > 0) {
    skus = remote.skus.map(rSku => {
      const lSku = (local.skus || []).find(
        ls => ls.combinationName === rSku.combinationName || 
              (ls.sku && ls.sku === rSku.sku) || 
              (ls.sellerSku && ls.sellerSku === rSku.sellerSku)
      );
      if (lSku) {
        return {
          ...lSku,
          ...rSku,
          price: rSku.price && parseFloat(rSku.price) > 0 ? rSku.price : (lSku.price || ''),
          stock: rSku.stock && parseInt(rSku.stock, 10) >= 0 ? rSku.stock : (lSku.stock || '0'),
          discount: rSku.discount && parseFloat(rSku.discount) > 0 ? rSku.discount : (lSku.discount || ''),
          weight: rSku.weight && parseFloat(rSku.weight) > 0 ? rSku.weight : (lSku.weight || ''),
          imageUrl: rSku.imageUrl || lSku.imageUrl || '',
          key: rSku.key,
          id: rSku.id
        };
      }
      return rSku;
    });
  }

  // Merge description
  let description = local.description || '';
  if (remote.description && remote.description.trim()) {
    description = remote.description;
  }

  // Merge physical details
  let weight = local.weight || '';
  if (remote.weight && parseFloat(remote.weight) > 0) {
    weight = remote.weight;
  }
  let weightUnit = local.weightUnit || remote.weightUnit || 'g';

  let length = local.length || '';
  if (remote.length && parseFloat(remote.length) > 0) {
    length = remote.length;
  }

  let width = local.width || '';
  if (remote.width && parseFloat(remote.width) > 0) {
    width = remote.width;
  }

  let height = local.height || '';
  if (remote.height && parseFloat(remote.height) > 0) {
    height = remote.height;
  }

  // Single variant fields
  let price = local.price;
  if (remote.price && parseFloat(remote.price) > 0) {
    price = remote.price;
  }
  let stock = local.stock;
  if (remote.stock !== undefined && remote.stock !== null) {
    stock = remote.stock;
  }
  let discount = local.discount;
  if (remote.discount && parseFloat(remote.discount) > 0) {
    discount = remote.discount;
  }
  let sku = local.sku || remote.sku || '';

  let singlePrice = local.singlePrice || '';
  if (price && parseFloat(price) > 0) {
    singlePrice = String(price);
  }
  let singleStock = local.singleStock || '0';
  if (stock !== undefined && stock !== null) {
    singleStock = String(stock);
  }
  let singleDiscount = local.singleDiscount || '';
  if (discount && parseFloat(discount) > 0) {
    singleDiscount = String(discount);
  }
  let singleSku = local.singleSku || sku || '';

  return {
    ...local,
    ...remote,
    brand,
    category,
    attributes,
    images,
    video,
    variants,
    skus,
    description,
    weight,
    weightUnit,
    length,
    width,
    height,
    price,
    stock,
    discount,
    sku,
    singlePrice,
    singleStock,
    singleDiscount,
    singleSku,
    dangerousGoods: remote.dangerousGoods === 'no' && local.dangerousGoods ? local.dangerousGoods : remote.dangerousGoods,
    shippingType: remote.shippingType === 'default' && local.shippingType ? local.shippingType : remote.shippingType,
    customPlatforms: remote.customPlatforms || local.customPlatforms,
    codEnabled: remote.codEnabled !== undefined ? remote.codEnabled : local.codEnabled,
    rejectReason: remote.rejectReason !== undefined ? remote.rejectReason : local.rejectReason,
  };
}
