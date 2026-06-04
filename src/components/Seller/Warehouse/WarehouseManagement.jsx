import React, { useState } from "react";
import AddWarehouseModal from "./AddWarehouseModal";

// Mock Data ban đầu
const initialWarehouses = [
  {
    id: 1,
    warehouse_type: "PICKUP",
    warehouse_name: "Kho Lấy Hàng Trung Tâm (HCM)",
    contact_name: "Nguyễn Văn A",
    phone_number: "0901234567",
    address: "123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    is_default: true,
    status: "ACTIVE",
  },
  {
    id: 2,
    warehouse_type: "RETURN",
    warehouse_name: "Kho Trả Hàng (HN)",
    contact_name: "Trần Thị B",
    phone_number: "0987654321",
    address: "456 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
    is_default: true,
    status: "ACTIVE",
  },
];

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [activeTab, setActiveTab] = useState("PICKUP"); // 'PICKUP' hoặc 'RETURN'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMultiWarehouseApproved] = useState(false);
  // Mock status Đa kho

  // Lọc kho theo tab hiện tại
  const currentWarehouses = warehouses.filter(
    (w) => w.warehouse_type === activeTab,
  );

  const handleAddClick = () => {
    // Logic Gate: Kiểm tra hạn mức kho [Theo AC UAT-02]
    if (!isMultiWarehouseApproved && currentWarehouses.length >= 1) {
      alert(
        "Hạn mức của bạn là 1 kho mặc định. Vui lòng đăng ký tính năng Đa kho để tạo thêm!",
      );
      return;
    }
    setIsModalOpen(true);
  };

  const handleSaveWarehouse = (newWarehouse) => {
    setWarehouses([newWarehouse, ...warehouses]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Kho vận</h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý địa chỉ lấy hàng và trả hàng của Shop.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center shadow-sm"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm kho hàng
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 flex space-x-6">
        <button
          onClick={() => setActiveTab("PICKUP")}
          className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === "PICKUP" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Tất cả kho lấy hàng (
          {warehouses.filter((w) => w.warehouse_type === "PICKUP").length})
        </button>
        <button
          onClick={() => setActiveTab("RETURN")}
          className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === "RETURN" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Kho trả hàng (
          {warehouses.filter((w) => w.warehouse_type === "RETURN").length})
        </button>
      </div>

      {/* Warehouse List */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông tin kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ / Liên hệ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentWarehouses.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Chưa có dữ liệu kho hàng. Hãy thêm kho mới.
                </td>
              </tr>
            ) : (
              currentWarehouses.map((wh) => (
                <tr key={wh.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {wh.warehouse_name}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      {wh.is_default && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Mặc định
                        </span>
                      )}
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {wh.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">
                      {wh.contact_name} - (+84) {wh.phone_number}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {wh.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Render Modal */}
      <AddWarehouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWarehouse}
        currentTab={activeTab}
      />
    </div>
  );
};

export default WarehouseManagement;
