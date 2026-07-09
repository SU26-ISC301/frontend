import React, { useState } from "react";
import AddWarehouseModal from "./AddWarehouseModal";

const initialWarehouses = [];

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState(() => {
    try {
      const saved = localStorage.getItem("sellerWarehouses");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((w) => ({
          id: w.id || Date.now(),
          warehouse_type: w.warehouse_type || w.type || "PICKUP",
          warehouse_name: w.warehouse_name || w.name || "",
          contact_name: w.contact_name || w.contact || "",
          phone_number: w.phone_number || w.phone || "",
          address: w.address || "",
          is_default: !!(w.is_default !== undefined
            ? w.is_default
            : w.isDefault),
          status:
            w.status === "ACTIVE" || w.status === "Đang hoạt động"
              ? "ACTIVE"
              : "INACTIVE",
        }));
      }
      return initialWarehouses;
    } catch {
      return initialWarehouses;
    }
  });
  const [activeTab, setActiveTab] = useState("PICKUP"); // 'PICKUP' hoặc 'RETURN'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMultiWarehouseApproved] = useState(false);

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
    let updatedList;
    if (newWarehouse.is_default) {
      // Set all other warehouses of the same type to non-default
      const mapped = warehouses.map((w) =>
        w.warehouse_type === newWarehouse.warehouse_type
          ? { ...w, is_default: false }
          : w,
      );
      updatedList = [newWarehouse, ...mapped];
    } else {
      const isFirst =
        warehouses.filter((w) => w.warehouse_type === newWarehouse.warehouse_type)
          .length === 0;
      const updatedWarehouse = {
        ...newWarehouse,
        is_default: isFirst || newWarehouse.is_default,
      };
      updatedList = [updatedWarehouse, ...warehouses];
    }
    setWarehouses(updatedList);
    localStorage.setItem("sellerWarehouses", JSON.stringify(updatedList));
    setIsModalOpen(false);
  };

  return (
    <div className="vendor-app min-h-screen px-4 py-8 sm:px-6">
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-orange-100 bg-white/90 p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">Kho vận</p>
          <h1 className="mt-1 text-2xl font-extrabold text-stone-950">Quản lý kho vận</h1>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            Quản lý địa chỉ lấy hàng và trả hàng của Shop.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="vendor-primary-button"
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
      <div className="mb-6 flex gap-2 rounded-xl border border-orange-100 bg-white/80 p-1 shadow-sm">
        <button
          onClick={() => setActiveTab("PICKUP")}
          className={`rounded-lg px-4 py-2 text-sm font-extrabold transition ${activeTab === "PICKUP" ? "bg-orange-500 text-white shadow-sm" : "text-stone-500 hover:bg-orange-50 hover:text-orange-600"}`}
        >
          Tất cả kho lấy hàng (
          {warehouses.filter((w) => w.warehouse_type === "PICKUP").length})
        </button>
        <button
          onClick={() => setActiveTab("RETURN")}
          className={`rounded-lg px-4 py-2 text-sm font-extrabold transition ${activeTab === "RETURN" ? "bg-orange-500 text-white shadow-sm" : "text-stone-500 hover:bg-orange-50 hover:text-orange-600"}`}
        >
          Kho trả hàng (
          {warehouses.filter((w) => w.warehouse_type === "RETURN").length})
        </button>
      </div>

      {/* Warehouse List */}
      <div className="vendor-panel overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="vendor-table-head">
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
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="empty-state-panel mx-auto max-w-md">
                    <p className="font-extrabold text-stone-900">Chưa có kho {activeTab === "PICKUP" ? "lấy hàng" : "trả hàng"}</p>
                    <p className="mt-1 text-sm font-semibold text-stone-500">Thêm kho thật của shop để cấu hình vận hành giao nhận.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentWarehouses.map((wh) => (
                <tr key={wh.id} className="vendor-table-row">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {wh.warehouse_name}
                    </div>
                    {wh.shipping_regions && wh.shipping_regions.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1 font-semibold">
                        Khu vực phục vụ: {wh.shipping_regions.join(", ")}
                      </div>
                    )}
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
                    <button className="mr-4 font-extrabold text-orange-600 hover:text-orange-700">
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
        existingWarehouses={warehouses}
      />
    </div>
    </div>
  );
};

export default WarehouseManagement;
