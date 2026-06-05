import React, { useState } from "react";
import { X, Map } from "lucide-react";

const AddWarehouseModal = ({ isOpen, onClose, onSave, isFirstWarehouse }) => {
  // Dựa trên MTTDL Document
  const [formData, setFormData] = useState({
    warehouseName: "",
    contactName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    addressDetail: "",
    // Nếu là kho đầu tiên, mặc định luôn là cả kho lấy và kho trả
    isPickup: isFirstWarehouse ? true : false,
    isReturn: isFirstWarehouse ? true : false,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate cơ bản (Thực tế cần dùng form validation library như Yup/React Hook Form)
    if (
      !formData.warehouseName ||
      !formData.contactName ||
      !formData.phone ||
      !formData.addressDetail
    ) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {isFirstWarehouse ? "Tạo kho hàng mặc định" : "Thêm kho hàng mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {isFirstWarehouse && (
            <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200">
              Vì đây là kho hàng đầu tiên của bạn, kho này sẽ được tự động thiết
              lập làm <strong>Kho lấy hàng</strong> và{" "}
              <strong>Kho trả hàng mặc định</strong>.
            </div>
          )}

          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Thông tin liên hệ
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên kho hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="warehouseName"
                value={formData.warehouseName}
                onChange={handleChange}
                placeholder="VD: Kho Tổng Hà Nội, Kho Q7..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={50}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Người liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Họ và tên"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09xx xxx xxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Địa chỉ hành chính
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tỉnh/Thành
                </label>
                <select
                  name="province"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn Tỉnh/Thành</option>
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quận/Huyện
                </label>
                <select
                  name="district"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn Quận/Huyện</option>
                  <option value="Quận 1">Quận 1</option>
                  <option value="Quận 7">Quận 7</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phường/Xã
                </label>
                <select
                  name="ward"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn Phường/Xã</option>
                  <option value="Phường Tân Quy">Phường Tân Quy</option>
                  <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ chi tiết (Số nhà, đường){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressDetail"
                value={formData.addressDetail}
                onChange={handleChange}
                placeholder="VD: 123 Đường ABC..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Map Widget (Mock UI) */}
            <div className="w-full h-32 bg-gray-100 rounded border border-gray-300 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 transition">
              <Map className="w-6 h-6 mb-1" />
              <span className="text-sm">
                Ghim vị trí trên bản đồ (Bắt buộc)
              </span>
            </div>
          </div>

          {/* Cài đặt thuộc tính kho */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Cài đặt mặc định
            </h3>

            <label
              className={`flex items-center space-x-3 p-3 border rounded-md ${isFirstWarehouse ? "bg-gray-50 opacity-80 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
            >
              <input
                type="checkbox"
                name="isPickup"
                checked={formData.isPickup}
                onChange={handleChange}
                disabled={isFirstWarehouse}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-800">
                  Đặt làm Kho Lấy Hàng mặc định
                </p>
                <p className="text-sm text-gray-500">
                  Shipper sẽ đến địa chỉ này để lấy hàng khi có đơn mới.
                </p>
              </div>
            </label>

            <label
              className={`flex items-center space-x-3 p-3 border rounded-md ${isFirstWarehouse ? "bg-gray-50 opacity-80 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
            >
              <input
                type="checkbox"
                name="isReturn"
                checked={formData.isReturn}
                onChange={handleChange}
                disabled={isFirstWarehouse}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-800">
                  Đặt làm Kho Trả Hàng mặc định
                </p>
                <p className="text-sm text-gray-500">
                  Hàng hoàn/trả về sẽ được gửi về địa chỉ này.
                </p>
              </div>
            </label>
          </div>
        </form>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Lưu kho hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWarehouseModal;
