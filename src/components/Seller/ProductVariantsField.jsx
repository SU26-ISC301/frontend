import { useState, useEffect } from 'react';
import { Trash2, Plus, HelpCircle, Maximize2, Minimize2, ChevronDown, GripVertical, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import { marketResearchApi } from '../../api/marketResearchAPI';

const SUGGESTED_VARIANTS = ['Màu sắc', 'Kích thước', 'Dung lượng', 'RAM', 'Bộ nhớ trong', 'Loại bảo hành'];

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function buildPriceInsight(marketResearch) {
  const sources = (marketResearch?.sources || []).filter(
    (source) => source.status === 'OK' && Number(source.min) > 0 && Number(source.max) > 0
  );
  if (!sources.length) return null;

  const productPrices = sources.flatMap((source) =>
    (source.products || [])
      .map((product) => Number(product.price))
      .filter((price) => Number.isFinite(price) && price > 0)
  );
  const sourceMins = sources.map((source) => Number(source.min)).filter((price) => price > 0);
  const sourceMaxs = sources.map((source) => Number(source.max)).filter((price) => price > 0);
  const min = Math.min(...sourceMins);
  const max = Math.max(...sourceMaxs);
  const average = productPrices.length
    ? productPrices.reduce((sum, price) => sum + price, 0) / productPrices.length
    : Number(marketResearch?.selectedCategory?.marketAverage || (min + max) / 2);
  const suggestedRaw = Math.min(max, Math.max(min, average * 0.98));
  const suggested = Math.max(1000, Math.round(suggestedRaw / 1000) * 1000);

  return {
    min,
    max,
    average,
    suggested,
    sourceCount: sources.length,
    sampleCount: productPrices.length || sources.reduce((sum, source) => sum + Number(source.productCount || 0), 0),
    sourceNames: sources.map((source) => source.source).slice(0, 5),
  };
}

export function ProductVariantsField({
  hasVariant = false,
  variants = [],
  skus = [],
  singlePrice = '',
  singleStock = '',
  singleDiscount = '',
  singleSku = '',
  errors = {},
  productName = '',
  categoryName = '',
  isPremiumPlan = false,
  onChange, // parent callback to change state
}) {
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(null); // variant index for dropdown
  const [priceInsight, setPriceInsight] = useState(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [insightError, setInsightError] = useState('');

  // Initial setup for variants if enabled but empty
  useEffect(() => {
    if (hasVariant && variants.length === 0) {
      onChange({
        variants: [
          {
            id: 'var_' + Date.now(),
            name: '',
            options: [{ id: 'opt_' + Date.now(), value: '', error: '' }],
          },
        ],
        skus: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVariant]);

  // Generate Cartesian Product of Variant Options
  useEffect(() => {
    if (!hasVariant) return;

    // Filter valid groups and options
    const activeGroups = variants.filter(v => v.name.trim() !== '');
    const groupsWithOptions = activeGroups.map(group => ({
      groupName: group.name,
      validOptions: group.options.filter(opt => opt.value.trim() !== ''),
    })).filter(g => g.validOptions.length > 0);

    if (groupsWithOptions.length === 0) {
      if (skus.length > 0) {
        onChange({ skus: [] });
      }
      return;
    }

    // Helper to calculate cartesian product
    const cartesian = (args) => {
      const r = [];
      const max = args.length - 1;
      const helper = (arr, i) => {
        for (let j = 0, l = args[i].length; j < l; j++) {
          const a = arr.concat([args[i][j]]);
          if (i === max) {
            r.push(a);
          } else {
            helper(a, i + 1);
          }
        }
      };
      helper([], 0);
      return r;
    };

    const optionMatrix = groupsWithOptions.map(g => g.validOptions);
    const combinations = cartesian(optionMatrix);

    // Create new SKUs list while preserving existing input values if combinations match
    const newSkus = combinations.map(comb => {
      const combinationName = comb.map(o => o.value).join(', ');
      const combKey = comb.map(o => o.id).join('|');

      // Find if we already had this SKU
      const existingSku = skus.find(s => s.key === combKey || s.combinationName === combinationName);

      return {
        id: existingSku?.id || 'sku_' + Math.random().toString(36).substr(2, 9),
        key: combKey,
        combinationName,
        combinationValues: comb.map(o => o.value),
        stock: existingSku?.stock ?? '0',
        price: existingSku?.price ?? '',
        weight: existingSku?.weight || '500',
        discount: existingSku?.discount ?? '',
        sku: existingSku?.sku ?? '',
      };
    });

    // Check if skus actually changed to prevent infinite loops
    const hasChanged = JSON.stringify(newSkus.map(s => ({ k: s.key, n: s.combinationName, p: s.price, st: s.stock, d: s.discount, sk: s.sku, w: s.weight }))) !==
                      JSON.stringify(skus.map(s => ({ k: s.key, n: s.combinationName, p: s.price, st: s.stock, d: s.discount, sk: s.sku, w: s.weight })));

    if (hasChanged) {
      onChange({ skus: newSkus });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants, hasVariant]);

  useEffect(() => {
    const query = productName.trim();
    if (!isPremiumPlan || query.length < 3) {
      setPriceInsight(null);
      setInsightError('');
      setIsLoadingInsight(false);
      return undefined;
    }

    let cancelled = false;
    setIsLoadingInsight(true);
    setInsightError('');

    const timer = setTimeout(() => {
      marketResearchApi.getPublicProductMarketResearch({
        query,
        categoryName,
      })
        .then((data) => {
          if (cancelled) return;
          const insight = buildPriceInsight(data);
          setPriceInsight(insight);
          setInsightError(insight ? '' : 'Chưa đủ dữ liệu thị trường để gợi ý giá cho sản phẩm này.');
        })
        .catch(() => {
          if (cancelled) return;
          setPriceInsight(null);
          setInsightError('Chưa thể lấy dữ liệu thị trường. Bạn vẫn có thể tự nhập giá bán.');
        })
        .finally(() => {
          if (!cancelled) setIsLoadingInsight(false);
        });
    }, 650);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [productName, categoryName, isPremiumPlan]);

  // Fullscreen and Apply highlights
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Bulk Edit States
  const [isExpanded, setIsExpanded] = useState(false);
  const [bulkStock, setBulkStock] = useState('');
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkDiscount, setBulkDiscount] = useState('');
  const [bulkSku, setBulkSku] = useState('');


  // Prevent double scrolling when modal is active
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const handleApplyBulk = () => {
    // Trigger visual flash feedback
    setIsApplying(true);
    setTimeout(() => setIsApplying(false), 800);

    if (!hasVariant) {
      // Single product mode batch update
      const updates = {};
      if (bulkStock !== '') updates.singleStock = bulkStock;
      if (bulkPrice !== '') updates.singlePrice = bulkPrice;
      if (bulkDiscount !== '') updates.singleDiscount = bulkDiscount;
      if (bulkSku !== '') updates.singleSku = bulkSku;

      onChange(updates);
      return;
    }

    // Variant mode batch update
    const updatedSkus = skus.map(s => ({
      ...s,
      stock: bulkStock !== '' ? bulkStock : s.stock,
      price: bulkPrice !== '' ? bulkPrice : s.price,
      discount: bulkDiscount !== '' ? bulkDiscount : s.discount,
      sku: bulkSku !== '' ? bulkSku : s.sku,
    }));
    onChange({ skus: updatedSkus });
  };

  // Toggle variant mode
  const handleToggleVariant = (checked) => {
    onChange({ hasVariant: checked });
  };

  const handleApplySuggestedPrice = () => {
    if (!priceInsight?.suggested) return;
    const suggested = String(priceInsight.suggested);
    if (hasVariant) {
      onChange({
        skus: skus.map((sku) => ({
          ...sku,
          price: suggested,
        })),
      });
      return;
    }
    onChange({ singlePrice: suggested });
  };

  const renderPriceInsightPanel = () => {
    if (!isPremiumPlan) return null;

    return (
      <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-orange-50 p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-black text-slate-900">
              <Sparkles className="h-4 w-4 text-violet-600" />
              Gợi ý giá bán tối ưu
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Dành riêng cho gói Premium, lấy giá thật từ CellPhoneS, FPT Shop, Điện Máy Xanh, Di Động Việt và TopZone.
            </p>
          </div>
          {isLoadingInsight && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-violet-700 shadow-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Đang phân tích thị trường
            </span>
          )}
        </div>

        {!productName.trim() && (
          <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold text-slate-500">
            Nhập tên sản phẩm ở phần Thông tin cơ bản, hệ thống sẽ tự phân tích khi bạn tới bước giá bán.
          </p>
        )}

        {insightError && !isLoadingInsight && (
          <p className="mt-3 rounded-xl bg-white/80 px-3 py-2 text-xs font-bold text-slate-500">
            {insightError}
          </p>
        )}

        {priceInsight && !isLoadingInsight && (
          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giá thấp nhất</p>
                <p className="mt-1 text-sm font-black text-slate-800">{formatCurrency(priceInsight.min)}</p>
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giá trung bình</p>
                <p className="mt-1 text-sm font-black text-slate-800">{formatCurrency(priceInsight.average)}</p>
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giá cao nhất</p>
                <p className="mt-1 text-sm font-black text-slate-800">{formatCurrency(priceInsight.max)}</p>
              </div>
              <div className="rounded-xl bg-violet-600 p-3 text-white shadow-sm shadow-violet-300">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Nên niêm yết</p>
                <p className="mt-1 text-sm font-black">{formatCurrency(priceInsight.suggested)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleApplySuggestedPrice}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-4 py-3 text-xs font-black text-white shadow-sm transition-colors hover:bg-[#c2410c]"
            >
              <TrendingUp className="h-4 w-4" />
              Áp dụng giá gợi ý
            </button>
          </div>
        )}

        {priceInsight && !isLoadingInsight && (
          <p className="mt-3 text-[11px] font-semibold text-slate-500">
            Dựa trên {priceInsight.sampleCount} mức giá từ {priceInsight.sourceCount} nguồn: {priceInsight.sourceNames.join(', ')}. Đây chỉ là gợi ý, bạn vẫn có thể nhập giá khác.
          </p>
        )}
      </div>
    );
  };

  // Add a variant group
  const handleAddVariantGroup = () => {
    if (variants.length >= 3) return;
    const newGroup = {
      id: 'var_' + Date.now(),
      name: '',
      options: [{ id: 'opt_' + Date.now(), value: '', error: '' }],
    };
    onChange({ variants: [...variants, newGroup] });
  };

  // Remove a variant group
  const handleRemoveVariantGroup = (groupId) => {
    const updated = variants.filter(v => v.id !== groupId);
    onChange({ variants: updated });
  };

  // Update variant group name
  const handleUpdateGroupName = (groupId, name) => {
    const updated = variants.map(v => {
      if (v.id === groupId) {
        return { ...v, name };
      }
      return v;
    });
    onChange({ variants: updated });
  };

  // Add an option to a variant group
  const handleAddOption = (groupId) => {
    const updated = variants.map(v => {
      if (v.id === groupId) {
        return {
          ...v,
          options: [...v.options, { id: 'opt_' + Date.now(), value: '', error: '' }],
        };
      }
      return v;
    });
    onChange({ variants: updated });
  };

  // Remove an option from a variant group
  const handleRemoveOption = (groupId, optionId) => {
    const updated = variants.map(v => {
      if (v.id === groupId) {
        // Keep at least one option slot
        const filtered = v.options.filter(o => o.id !== optionId);
        return {
          ...v,
          options: filtered.length > 0 ? filtered : [{ id: 'opt_' + Date.now(), value: '', error: '' }],
        };
      }
      return v;
    });
    onChange({ variants: updated });
  };

  // Update option value
  const handleUpdateOptionValue = (groupId, optionId, value) => {
    const updated = variants.map(v => {
      if (v.id === groupId) {
        return {
          ...v,
          options: v.options.map(o => {
            if (o.id === optionId) {
              return { ...o, value, error: value.trim() === '' ? 'Nhập một tùy chọn' : '' };
            }
            return o;
          }),
        };
      }
      return v;
    });
    onChange({ variants: updated });
  };

  // Update individual SKU properties
  const handleUpdateSkuProp = (skuId, prop, value) => {
    const updated = skus.map(s => {
      if (s.id === skuId) {
        return { ...s, [prop]: value };
      }
      return s;
    });
    onChange({ skus: updated });
  };

  const renderSkuTable = () => {
    return (
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 font-bold text-slate-500 w-[25%]">
                  Tên biến thể
                </th>
                <th className="py-3 px-4 font-bold text-slate-500 w-[20%]">
                  <span className="text-red-500">*</span> Hàng có sẵn <HelpCircle className="h-3.5 w-3.5 text-slate-300 inline ml-1 cursor-pointer" />
                </th>
                <th className="py-3 px-4 font-bold text-slate-500 w-[25%]">
                  <span className="text-red-500">*</span> Giá bán lẻ <HelpCircle className="h-3.5 w-3.5 text-slate-300 inline ml-1 cursor-pointer" />
                </th>
                <th className="py-3 px-4 font-bold text-slate-500 w-[15%]">
                  Giảm giá <HelpCircle className="h-3.5 w-3.5 text-slate-300 inline ml-1 cursor-pointer" />
                </th>
                <th className="py-3 px-4 font-bold text-slate-500 w-[15%]">
                  SKU người bán
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {skus.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold bg-slate-50/30">
                    Không có SKU nào
                  </td>
                </tr>
              ) : (
                skus.map((sku, index) => (
                  <tr
                    key={sku.id}
                    className={cn(
                      "hover:bg-slate-50/50 transition-colors duration-200",
                      isApplying && "bg-orange-50/50"
                    )}
                  >
                    {/* Combination Name */}
                    <td className="py-3 px-4 font-bold text-slate-700 break-words max-w-[160px]">
                      {sku.combinationName}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <div>
                        <input
                          type="number"
                          placeholder="0"
                          value={sku.stock}
                          onChange={(e) => handleUpdateSkuProp(sku.id, 'stock', e.target.value)}
                          className={cn(
                            "vendor-input w-full px-2.5 py-1.5 text-xs bg-white transition-all duration-300",
                            isApplying && "bg-orange-50/50 border-orange-300",
                            errors[`sku_stock_${index}`] && "border-red-500 focus:border-red-500 focus:ring-red-100"
                          )}
                        />
                        {errors[`sku_stock_${index}`] && (
                          <p className="text-[9px] font-bold text-red-500 mt-1 flex items-center gap-0.5">⚠️ {errors[`sku_stock_${index}`]}</p>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 relative">
                      <input
                        type="number"
                        placeholder="Nhập giá"
                        value={sku.price}
                        onChange={(e) => handleUpdateSkuProp(sku.id, 'price', e.target.value)}
                        className={cn(
                          "vendor-input w-full px-2.5 py-1.5 pr-6 text-xs bg-white transition-all duration-300",
                          isApplying && "bg-orange-50/50 border-orange-300",
                          errors[`sku_price_${index}`] && "border-red-500 focus:border-red-500 focus:ring-red-100"
                        )}
                      />
                      <span className="absolute right-7 top-4.5 text-[10px] font-bold text-slate-400">đ</span>
                      {errors[`sku_price_${index}`] && (
                        <p className="text-[9px] font-bold text-red-500 mt-1 flex items-center gap-0.5">⚠️ {errors[`sku_price_${index}`]}</p>
                      )}
                    </td>



                    {/* Discount */}
                    <td className="py-3 px-4 relative">
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={sku.discount}
                        onChange={(e) => handleUpdateSkuProp(sku.id, 'discount', e.target.value)}
                        className={cn(
                          "vendor-input w-full px-2.5 py-1.5 pr-6 text-xs bg-white transition-all duration-300",
                          isApplying && "bg-orange-50/50 border-orange-300"
                        )}
                      />
                      <span className="absolute right-7 top-4.5 text-[10px] font-bold text-slate-400">%</span>
                    </td>

                    {/* Seller SKU */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Nhập mã SKU"
                        value={sku.sku}
                        onChange={(e) => handleUpdateSkuProp(sku.id, 'sku', e.target.value)}
                        className={cn(
                          "vendor-input w-full px-2.5 py-1.5 text-xs bg-white transition-all duration-300",
                          isApplying && "bg-orange-50/50 border-orange-300"
                        )}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSingleProductTable = () => {
    return (
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 font-bold text-slate-500 w-[25%]">
                  <span className="text-red-500">*</span> Hàng có sẵn
                </th>
                <th className="py-3 px-4 font-bold text-slate-500 w-[25%]">
                  <span className="text-red-500">*</span> Giá bán lẻ
                </th>
                <th className="py-3 px-4 font-bold text-slate-500 w-[25%]">
                  Giảm giá
                </th>
                <th className="py-3 px-4 font-bold text-slate-500 w-[25%]">
                  SKU người bán
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-slate-50/50 transition-colors duration-200">
                <td className="py-4 px-4">
                  <input
                    type="number"
                    placeholder="0"
                    value={singleStock}
                    onChange={(e) => onChange({ singleStock: e.target.value })}
                    className={cn(
                      "vendor-input w-full px-3 py-2 text-sm bg-white",
                      errors.stock && "border-red-500 focus:border-red-500"
                    )}
                  />
                  {errors.stock && (
                    <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-0.5">⚠️ {errors.stock}</p>
                  )}
                </td>
                <td className="py-4 px-4 relative">
                  <input
                    type="number"
                    placeholder="Nhập giá"
                    value={singlePrice}
                    onChange={(e) => onChange({ singlePrice: e.target.value })}
                    className={cn(
                      "vendor-input w-full px-3 py-2 pr-8 text-sm bg-white",
                      errors.price && "border-red-500 focus:border-red-500"
                    )}
                  />
                  <span className="absolute right-7 top-5.5 text-xs font-bold text-slate-400">đ</span>
                  {errors.price && (
                    <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-0.5">⚠️ {errors.price}</p>
                  )}
                </td>
                <td className="py-4 px-4 relative">
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={singleDiscount}
                    onChange={(e) => onChange({ singleDiscount: e.target.value })}
                    className="vendor-input w-full px-3 py-2 pr-8 text-sm bg-white"
                  />
                  <span className="absolute right-7 top-5.5 text-xs font-bold text-slate-400">%</span>
                </td>
                <td className="py-4 px-4">
                  <input
                    type="text"
                    placeholder="Nhập mã SKU"
                    value={singleSku}
                    onChange={(e) => onChange({ singleSku: e.target.value })}
                    className="vendor-input w-full px-3 py-2 text-sm bg-white"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBatchUpdateBar = (forceExpanded = false) => {
    if (isExpanded || forceExpanded) {
      return (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 w-full">
          <div className="w-32">
            <input
              type="number"
              placeholder="Số lượng"
              value={bulkStock}
              onChange={(e) => setBulkStock(e.target.value)}
              className="vendor-input w-full px-3 py-2 text-xs font-semibold bg-white"
            />
          </div>
          <div className="relative w-40">
            <input
              type="number"
              placeholder="Giá bán lẻ"
              value={bulkPrice}
              onChange={(e) => setBulkPrice(e.target.value)}
              className="vendor-input w-full px-3 py-2 pr-8 text-xs font-semibold bg-white"
            />
            <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">đ</span>
          </div>
          <div className="relative w-28">
            <input
              type="number"
              placeholder="Giảm giá"
              value={bulkDiscount}
              onChange={(e) => setBulkDiscount(e.target.value)}
              className="vendor-input w-full px-3 py-2 pr-8 text-xs font-semibold bg-white"
            />
            <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">%</span>
          </div>
          <div className="w-36">
            <input
              type="text"
              placeholder="SKU người bán"
              value={bulkSku}
              onChange={(e) => setBulkSku(e.target.value)}
              className="vendor-input w-full px-3 py-2 text-xs font-semibold bg-white"
            />
          </div>

          <button
            type="button"
            onClick={handleApplyBulk}
            className="px-5 py-2 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-lg transition-colors border border-transparent cursor-pointer shadow-sm active:scale-95"
          >
            Áp dụng
          </button>

          <button
            type="button"
            onClick={() => {
              if (forceExpanded) {
                setIsFullscreen(false);
              } else {
                setIsExpanded(false);
              }
            }}
            className="ml-auto p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
      );
    }

    // COMPACT BAR
    return (
      <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 w-full">
        {!hasVariant && (
          <div className="relative">
            <button
              type="button"
              className="flex items-center justify-between w-28 px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-orange-500 transition-all"
            >
              <span>Tất cả</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        )}
        <div className="w-36">
          <input
            type="number"
            placeholder="Số lượng"
            value={bulkStock}
            onChange={(e) => setBulkStock(e.target.value)}
            className="vendor-input w-full px-3 py-2 text-xs font-semibold bg-white"
          />
        </div>
        <div className="relative w-44">
          <input
            type="number"
            placeholder="Giá bán lẻ"
            value={bulkPrice}
            onChange={(e) => setBulkPrice(e.target.value)}
            className="vendor-input w-full px-3 py-2 pr-8 text-xs font-semibold bg-white"
          />
          <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-400">đ</span>
        </div>
        <button
          type="button"
          onClick={handleApplyBulk}
          className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          Áp dụng
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="ml-auto p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Switch header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-200/80">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-700 block">Thêm biến thể</span>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Thêm tối đa 3 biến thể sản phẩm cho kích thước, màu sắc, chất liệu, v.v. khác nhau.
          </p>
        </div>
        <div>
          <button
            type="button"
            role="switch"
            aria-checked={hasVariant}
            onClick={() => handleToggleVariant(!hasVariant)}
            className={cn(
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20",
              hasVariant ? "bg-[#ea580c]" : "bg-slate-200"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                hasVariant ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>

      {renderPriceInsightPanel()}

      {/* SINGLE PRODUCT MODE */}
      {!hasVariant ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Giá và hàng có sẵn</h3>
          </div>

          {/* Batch update bar for Single Product */}
          {renderBatchUpdateBar()}

          {/* Single row Table/Form inputs */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Headers */}
            <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 py-3 px-4">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                <span className="text-red-500">*</span> Hàng có sẵn
                <HelpCircle className="h-3.5 w-3.5 text-slate-300 cursor-pointer" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                <span className="text-red-500">*</span> Giá bán lẻ
                <HelpCircle className="h-3.5 w-3.5 text-slate-300 cursor-pointer" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                Giảm giá
                <HelpCircle className="h-3.5 w-3.5 text-slate-300 cursor-pointer" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                SKU người bán
                <HelpCircle className="h-3.5 w-3.5 text-slate-300 cursor-pointer" />
              </div>
            </div>

            {/* Inputs block */}
            <div className="grid grid-cols-4 divide-x divide-slate-100 bg-white p-4">
              <div className="pr-3">
                <input
                  type="number"
                  placeholder="0"
                  value={singleStock}
                  onChange={(e) => onChange({ singleStock: e.target.value })}
                  className={cn(
                    "vendor-input w-full px-3 py-2 text-sm",
                    errors.stock && "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.stock && (
                  <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-0.5">⚠️ {errors.stock}</p>
                )}
              </div>

              <div className="px-3 relative">
                <input
                  type="number"
                  placeholder="Nhập giá"
                  value={singlePrice}
                  onChange={(e) => onChange({ singlePrice: e.target.value })}
                  className={cn(
                    "vendor-input w-full px-3 py-2 pr-8 text-sm",
                    errors.price && "border-red-500 focus:border-red-500"
                  )}
                />
                <span className="absolute right-6 top-2.5 text-xs font-bold text-slate-400">đ</span>
                {errors.price && (
                  <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-0.5">⚠️ {errors.price}</p>
                )}
              </div>

              <div className="px-3 relative">
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={singleDiscount}
                  onChange={(e) => onChange({ singleDiscount: e.target.value })}
                  className="vendor-input w-full px-3 py-2 pr-8 text-sm"
                />
                <span className="absolute right-6 top-2.5 text-xs font-bold text-slate-400">%</span>
              </div>

              <div className="pl-3">
                <input
                  type="text"
                  placeholder="Nhập mã SKU"
                  value={singleSku}
                  onChange={(e) => onChange({ singleSku: e.target.value })}
                  className="vendor-input w-full px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VARIANT CONFIGURATION MODE */
        <div className="space-y-6">
          {/* Variant Groups List */}
          <div className="space-y-4">
            {variants.map((group, gIdx) => (
              <div
                key={group.id}
                className="bg-slate-50/40 border border-slate-200 rounded-2xl p-6 relative space-y-4 hover:bg-slate-50/60 transition-all duration-200"
              >
                {/* Variant card header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-slate-400 cursor-grab">
                    <GripVertical className="h-4 w-4" />
                    <span className="text-xs font-bold text-slate-700">Biến thể {gIdx + 1}</span>
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariantGroup(group.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa biến thể này"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Tên biến thể */}
                <div className="space-y-1.5 relative">
                  <label className="block text-xs font-bold text-slate-700">
                    <span className="text-red-500">*</span> Tên biến thể
                    <HelpCircle className="h-3.5 w-3.5 text-slate-300 inline ml-1 cursor-pointer" />
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Chọn hoặc nhập biến thể"
                      value={group.name}
                      onChange={(e) => handleUpdateGroupName(group.id, e.target.value)}
                      onFocus={() => setShowBrandSuggestions(gIdx)}
                      onBlur={() => setTimeout(() => setShowBrandSuggestions(null), 200)}
                      className={cn(
                        "vendor-input w-full px-3 py-2 text-sm bg-white pr-10",
                        errors[`variant_group_${gIdx}`] && "border-red-500 focus:border-red-500"
                      )}
                    />
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />

                    {/* Suggestions Dropdown */}
                    {showBrandSuggestions === gIdx && (
                      <div className="absolute z-10 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto py-1">
                        <div className="py-1">
                          {SUGGESTED_VARIANTS.filter(v => !variants.some(ex => ex.name === v && ex.id !== group.id)).map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onMouseDown={() => handleUpdateGroupName(group.id, opt)}
                              className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors[`variant_group_${gIdx}`] && (
                    <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-0.5">⚠️ {errors[`variant_group_${gIdx}`]}</p>
                  )}
                </div>

                {/* Tùy chọn (Option values list) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    <span className="text-red-500">*</span> Tùy chọn
                  </label>

                  <div className="space-y-2.5">
                    {group.options.map((opt, oIdx) => (
                      <div key={opt.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="text-slate-300 cursor-grab">
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Nhập một tùy chọn"
                              maxLength={50}
                              value={opt.value}
                              onChange={(e) => handleUpdateOptionValue(group.id, opt.id, e.target.value)}
                              className={cn(
                                "vendor-input w-full px-3 py-2 pr-16 text-sm bg-white",
                                (opt.error || errors[`variant_opt_${gIdx}_${oIdx}`]) && "border-red-500 focus:border-red-500"
                              )}
                            />
                            <span className="absolute right-3 top-2 text-xs font-semibold text-slate-400">
                              {opt.value.length}/50
                            </span>
                          </div>
                          {group.options.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(group.id, opt.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa lựa chọn này"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        {(opt.error || errors[`variant_opt_${gIdx}_${oIdx}`]) && (
                          <div className="pl-6 text-[11px] font-bold text-red-500 flex items-center gap-0.5">
                            ⚠️ {opt.error || errors[`variant_opt_${gIdx}_${oIdx}`]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add option button */}
                  <div className="pl-6">
                    <button
                      type="button"
                      onClick={() => handleAddOption(group.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Thêm lựa chọn
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add variant group button */}
          {variants.length < 3 && (
            <button
              type="button"
              onClick={handleAddVariantGroup}
              className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-750 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Thêm biến thể
            </button>
          )}

          {/* SKU TABLE SECTION */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Danh sách biến thể</h3>
            </div>

            {/* Batch update bar for SKUs */}
            {renderBatchUpdateBar()}

            {/* Cartesian SKU Table */}
            {renderSkuTable()}

            {errors.skus && (
              <p className="text-sm font-bold text-red-500 mt-2 text-left flex items-center gap-0.5">⚠️ {errors.skus}</p>
            )}
          </div>
        </div>
      )}

      {isFullscreen && (
        <div 
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center overflow-hidden animate-in fade-in duration-200 p-4 md:p-6"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-[90vw] max-w-5xl h-[75vh] bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 flex flex-col gap-6 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-800">
                {hasVariant ? "Danh sách biến thể" : "Giá và hàng có sẵn"}
              </h2>
            </div>

            {/* Batch update bar for SKUs */}
            {renderBatchUpdateBar(true)}

            {/* Cartesian SKU Table or Single Product Table */}
            <div className="flex-1 overflow-auto">
              {hasVariant ? renderSkuTable() : renderSingleProductTable()}
            </div>

            {errors.skus && (
              <p className="text-sm font-bold text-red-500 text-left flex items-center gap-0.5">⚠️ {errors.skus}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
