import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { VIETNAM_ADDRESS_DATA } from "../../../data/vietnamAdministrativeUnits";

const AddWarehouseModal = ({ isOpen, onClose, onSave, currentTab, existingWarehouses = [] }) => {
  const isFirstWarehouse = existingWarehouses.filter(w => w.warehouse_type === currentTab).length === 0;

  const [formData, setFormData] = useState({
    warehouseName: "",
    contactName: "",
    phone: "",
    country: "Việt Nam",
    province: "",
    district: "",
    ward: "",
    addressDetail: "",
    shippingRegions: [],
    isDefault: false,
  });

  const [error, setError] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const isFirst = existingWarehouses.filter(w => w.warehouse_type === currentTab).length === 0;
      setFormData({
        warehouseName: "",
        contactName: "",
        phone: "",
        country: "Việt Nam",
        province: "",
        district: "",
        ward: "",
        addressDetail: "",
        shippingRegions: [],
        isDefault: isFirst,
      });
      setError("");
    }
  }, [isOpen, currentTab, existingWarehouses]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleProvinceChange = (e) => {
    setFormData(prev => ({
      ...prev,
      province: e.target.value,
      district: "",
      ward: "",
    }));
    setError("");
  };

  const handleDistrictChange = (e) => {
    setFormData(prev => ({
      ...prev,
      district: e.target.value,
      ward: "",
    }));
    setError("");
  };

  const handleRegionToggle = (region) => {
    setFormData(prev => {
      const current = prev.shippingRegions;
      if (current.includes(region)) {
        return { ...prev, shippingRegions: current.filter(r => r !== region) };
      } else {
        return { ...prev, shippingRegions: [...current, region] };
      }
    });
    setError("");
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!formData.warehouseName.trim()) {
      setError("Tên kho hàng là bắt buộc!");
      return;
    }
    if (formData.warehouseName.trim().length < 1 || formData.warehouseName.trim().length > 50) {
      setError("Tên kho hàng chỉ giới hạn từ 1 đến 50 ký tự!");
      return;
    }

    // Check duplicate name with old warehouses
    const nameExists = existingWarehouses.some(
      (w) => w.warehouse_name.toLowerCase() === formData.warehouseName.trim().toLowerCase()
    );
    if (nameExists) {
      setError("Tên kho hàng đã tồn tại trong danh sách kho của bạn. Vui lòng nhập tên khác!");
      return;
    }

    if (!formData.contactName.trim()) {
      setError("Người liên hệ là bắt buộc!");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Số điện thoại liên hệ là bắt buộc!");
      return;
    }

    // Phone format check (starts with 0, 10 digits)
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setError("Số điện thoại không hợp lệ (phải gồm 10 chữ số bắt đầu bằng 0)!");
      return;
    }

    if (!formData.province || !formData.district || !formData.ward) {
      setError("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã!");
      return;
    }
    if (!formData.addressDetail.trim()) {
      setError("Địa chỉ chi tiết là bắt buộc!");
      return;
    }

    // Check shipping region validation for subsequent warehouses
    if (!isFirstWarehouse && formData.shippingRegions.length === 0) {
      setError("Chỉ xuất hiện từ kho thứ 2: Bạn bắt buộc phải chọn tối thiểu 1 khu vực vận chuyển phục vụ!");
      return;
    }

    const mappedWarehouse = {
      id: Date.now(),
      warehouse_type: currentTab,
      warehouse_name: formData.warehouseName.trim(),
      contact_name: formData.contactName.trim(),
      phone_number: formData.phone.trim(),
      address: `${formData.addressDetail.trim()}, ${formData.ward}, ${formData.district}, ${formData.province}, Việt Nam`,
      is_default: formData.isDefault,
      status: "ACTIVE",
      shipping_regions: formData.shippingRegions,
      is_pinned: false,
      lat: null,
      lng: null,
      location_mode: "manual",
    };

    onSave(mappedWarehouse);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-gray-800">
            {isFirstWarehouse ? "Tạo kho hàng mặc định" : "Thêm kho hàng mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {error && (
            <div className="p-3.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-150 animate-shake">
              {error}
            </div>
          )}

          {isFirstWarehouse && (
            <div className="p-3.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
              Vì đây là kho hàng đầu tiên của bạn, kho này sẽ được tự động thiết
              lập làm <strong>Kho hàng mặc định</strong>.
            </div>
          )}

          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2 text-sm">
              Thông tin liên hệ
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Tên kho hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="warehouseName"
                value={formData.warehouseName}
                onChange={handleChange}
                placeholder="Ví dụ: Kho Tổng Hà Nội, Kho Q7..."
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                maxLength={50}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Người liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Họ và tên người quản lý"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09xx xxx xxx"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Quốc gia & Địa chỉ */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2 text-sm">
              Địa chỉ lấy / trả hàng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Quốc gia / Khu vực
                </label>
                <input
                  type="text"
                  value={formData.country}
                  readOnly
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Tỉnh / Thành phố <span className="text-red-500">*</span>
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleProvinceChange}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Chọn Tỉnh/Thành</option>
                  {Object.keys(VIETNAM_ADDRESS_DATA).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Quận / Huyện <span className="text-red-500">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  disabled={!formData.province}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {formData.province && Object.keys(VIETNAM_ADDRESS_DATA[formData.province]).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Phường / Xã <span className="text-red-500">*</span>
                </label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  disabled={!formData.district}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="">Chọn Phường/Xã</option>
                  {formData.province && formData.district && VIETNAM_ADDRESS_DATA[formData.province][formData.district].map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Địa chỉ chi tiết (Số nhà, đường) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressDetail"
                value={formData.addressDetail}
                onChange={handleChange}
                placeholder="Ví dụ: 123 Đường ABC..."
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Khu vực vận chuyển (Chỉ xuất hiện từ kho thứ 2) */}
          {!isFirstWarehouse && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2 text-sm">
                Khu vực vận chuyển <span className="text-red-500">*</span>
              </h3>
              <p className="text-xs text-gray-500">
                Cho phép thiết lập kho này sẽ phục vụ giao hàng cho những vùng miền/tỉnh cụ thể nào.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-2">
                {["Miền Bắc", "Miền Trung", "Miền Nam"].map(region => {
                  const isSelected = formData.shippingRegions.includes(region);
                  return (
                    <button
                      key={region}
                      type="button"
                      onClick={() => handleRegionToggle(region)}
                      className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm font-bold scale-102"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3px]" />}
                      {region}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cài đặt mặc định */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2 text-sm">
              Cài đặt mặc định (Set Default)
            </h3>

            <label
              className={`flex items-center space-x-3.5 p-3.5 border border-gray-250 rounded-xl transition-all ${
                isFirstWarehouse
                  ? "bg-gray-50 opacity-80 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                disabled={isFirstWarehouse}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <p className="font-semibold text-gray-800 text-xs">
                  Cài đặt làm Kho mặc định
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-4">
                  Tự động nhận tồn kho của sản phẩm mới được đăng bán khi có đơn.
                </p>
              </div>
            </label>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            Lưu kho hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWarehouseModal;
