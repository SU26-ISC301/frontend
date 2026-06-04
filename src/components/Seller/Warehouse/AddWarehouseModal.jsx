import React, { useState } from "react";

const AddWarehouseModal = ({ isOpen, onClose, onSave, currentTab }) => {
  const [formData, setFormData] = useState({
    warehouse_type: currentTab,
    warehouse_name: "",
    contact_name: "",
    phone_number: "",
    address_detail: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate cơ bản
    if (!formData.warehouse_name || !formData.phone_number) {
      alert("Vui lòng điền các trường bắt buộc!");
      return;
    }
    // Gửi data lên component cha
    onSave({
      ...formData,
      id: Date.now(),
      is_default: false,
      status: "ACTIVE",
      address: `${formData.address_detail}, Phường X, Quận Y, TP. Hồ Chí Minh`,
    });
    setFormData({
      warehouse_type: currentTab,
      warehouse_name: "",
      contact_name: "",
      phone_number: "",
      address_detail: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Thêm kho hàng mới</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 font-bold text-xl"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Loại kho *
              </label>
              <select
                name="warehouse_type"
                value={formData.warehouse_type}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              >
                <option value="PICKUP">Kho lấy hàng</option>
                <option value="RETURN">Kho trả hàng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên kho hàng *
              </label>
              <input
                type="text"
                name="warehouse_name"
                maxLength={50}
                value={formData.warehouse_name}
                onChange={handleChange}
                placeholder="Ví dụ: Kho Tổng HN"
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
              <span className="text-xs text-gray-400">
                {formData.warehouse_name.length}/50
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Người liên hệ *
              </label>
              <input
                type="text"
                name="contact_name"
                maxLength={100}
                value={formData.contact_name}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số điện thoại *
              </label>
              <div className="flex mt-1">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  +84
                </span>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="9xxxxxxxxx"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Địa chỉ chi tiết *
            </label>
            <input
              type="text"
              name="address_detail"
              value={formData.address_detail}
              onChange={handleChange}
              placeholder="Số nhà, tên đường..."
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Map Mockup */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghim vị trí trên bản đồ
            </label>
            <div className="w-full h-48 bg-gray-200 rounded-md border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-500">
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>[Khu vực tích hợp API Bản đồ]</span>
              <span className="text-xs">Tọa độ: (Chưa chọn)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end space-x-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Lưu kho hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWarehouseModal;
