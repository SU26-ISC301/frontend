// ============================================================
// attributeSchemas.js
// Cấu hình thuộc tính sản phẩm theo từng hạng mục — TikTok Shop Style
// ============================================================

// ── Dùng chung ──────────────────────────────────────────────
export const WARRANTY_TYPES = [
  'Bảo hành nhà sản xuất',
  'Bảo hành nhà phân phối',
  'Bảo hành cửa hàng',
  'Không bảo hành',
];

export const COUNTRIES = [
  'Việt Nam',
  'Trung Quốc',
  'Mỹ',
  'Nhật Bản',
  'Hàn Quốc',
  'Đài Loan',
  'Đức',
  'Thụy Điển',
  'Anh',
];

const PHONE_BRANDS = [
  'Apple (iPhone)',
  'Samsung',
  'Xiaomi',
  'Oppo',
  'Vivo',
  'Realme',
  'Huawei',
  'Nokia',
  'Motorola',
  'OnePlus',
  'Khác',
];

// ── Các field dùng chung ────────────────────────────────────
const warrantyField = {
  id: 'warrantyType',
  label: 'Loại bảo hành',
  type: 'select',
  options: WARRANTY_TYPES,
  placeholder: 'Chọn loại bảo hành',
};

const originCountryField = {
  id: 'originCountry',
  label: 'Quốc gia xuất xứ',
  type: 'select',
  options: COUNTRIES,
  placeholder: 'Chọn quốc gia xuất xứ',
};

// ============================================================
// SCHEMAS — mỗi hạng mục lá đều có:
//   requiredFields  → Bắt buộc
//   mainFields      → Chính (khuyến khích điền)
//   optionalFields  → Không bắt buộc (ẩn mặc định)
// ============================================================
export const SCHEMAS = {

  // ─────────────────────────────────────────────────────────
  // 1. ỐP LƯNG & BAO DA
  // ─────────────────────────────────────────────────────────
  'op-lung-bao-da': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'compatibleBrand',
        label: 'Thương hiệu tương thích',
        type: 'select',
        options: PHONE_BRANDS,
        placeholder: 'Chọn thương hiệu',
      },
      {
        id: 'compatibleModel',
        label: 'Dòng máy tương thích',
        type: 'text',
        placeholder: 'VD: iPhone 15 Pro Max, Galaxy S24 Ultra',
      },
      {
        id: 'material',
        label: 'Chất liệu',
        type: 'select',
        options: [
          'Silicone dẻo',
          'Nhựa dẻo (TPU)',
          'Nhựa cứng (PC)',
          'Da thật',
          'Da tổng hợp (PU)',
          'Kim loại (Nhôm)',
          'Sợi Carbon',
          'Acrylic',
        ],
        placeholder: 'Chọn chất liệu',
      },
      {
        id: 'caseType',
        label: 'Loại ốp',
        type: 'select',
        options: [
          'Ốp lưng thông thường',
          'Bao da lật',
          'Ốp chống sốc',
          'Ốp trong suốt',
          'Ốp kèm ví / ngăn đựng thẻ',
          'Ốp có giá đỡ (kick-stand)',
          'Ốp hỗ trợ MagSafe',
          'Ốp chống nước',
        ],
        placeholder: 'Chọn loại ốp',
      },
    ],
    optionalFields: [
      {
        id: 'caseStyle',
        label: 'Phong cách',
        type: 'select',
        options: ['Thời trang', 'Đơn giản (tối giản)', 'Hoạt hình / Cute', 'Graffiti', 'Sang trọng', 'Thể thao'],
        placeholder: 'Chọn phong cách',
      },
      {
        id: 'releaseYear',
        label: 'Năm sản xuất',
        type: 'text',
        placeholder: 'VD: 2024',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 2. SẠC & CÁP ĐIỆN THOẠI
  // ─────────────────────────────────────────────────────────
  'sac-cap-dt': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'connectorType',
        label: 'Loại đầu kết nối',
        type: 'select',
        options: ['USB-C', 'Lightning (iPhone)', 'Micro-USB', 'USB-A', 'Magsafe'],
        placeholder: 'Chọn loại đầu kết nối',
      },
      {
        id: 'powerOutput',
        label: 'Công suất sạc',
        type: 'select',
        options: ['5W (5V/1A)', '10W', '18W', '20W', '25W', '30W', '45W', '65W', '100W+', 'Khác'],
        placeholder: 'Chọn công suất sạc',
      },
      {
        id: 'chargingTech',
        label: 'Công nghệ sạc',
        type: 'select',
        options: ['Sạc nhanh (Fast Charge)', 'Sạc thường', 'PD (Power Delivery)', 'Quick Charge (Qualcomm)', 'VOOC / SuperVOOC', 'GaN (Gallium Nitride)'],
        placeholder: 'Chọn công nghệ sạc',
      },
      {
        id: 'cableLength',
        label: 'Chiều dài cáp',
        type: 'select',
        options: ['0.5m', '1m', '1.5m', '2m', '3m'],
        placeholder: 'Chọn chiều dài',
      },
    ],
    optionalFields: [
      {
        id: 'numPorts',
        label: 'Số cổng sạc',
        type: 'select',
        options: ['1 cổng', '2 cổng', '3 cổng', '4 cổng+'],
        placeholder: 'Chọn số cổng',
      },
      {
        id: 'compatibleBrand',
        label: 'Tương thích với',
        type: 'text',
        placeholder: 'VD: iPhone, Samsung, Laptop...',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 3. KÍNH CƯỜNG LỰC
  // ─────────────────────────────────────────────────────────
  'kinh-cuong-luc': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'compatibleBrand',
        label: 'Thương hiệu tương thích',
        type: 'select',
        options: PHONE_BRANDS,
        placeholder: 'Chọn thương hiệu',
      },
      {
        id: 'compatibleModel',
        label: 'Dòng máy tương thích',
        type: 'text',
        placeholder: 'VD: iPhone 15 / iPhone 15 Pro / Samsung S24',
      },
      {
        id: 'glassType',
        label: 'Loại kính',
        type: 'select',
        options: [
          'Kính cường lực thường',
          'Kính chống nhìn trộm (Privacy)',
          'Kính chống ánh sáng xanh',
          'Kính trong suốt độ cứng 9H',
          'Kính nhám chống vân tay',
          'Kính dán full màn hình',
          'Kính dán camera sau',
        ],
        placeholder: 'Chọn loại kính',
      },
      {
        id: 'hardness',
        label: 'Độ cứng',
        type: 'select',
        options: ['9H', '10H', '11H'],
        placeholder: 'Chọn độ cứng',
      },
    ],
    optionalFields: [
      {
        id: 'packQuantity',
        label: 'Số miếng trong gói',
        type: 'select',
        options: ['1 miếng', '2 miếng', '3 miếng'],
        placeholder: 'Chọn số lượng',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 4. PIN DỰ PHÒNG
  // ─────────────────────────────────────────────────────────
  'pin-du-phong': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'capacity',
        label: 'Dung lượng pin (mAh)',
        type: 'select',
        options: ['5.000 mAh', '10.000 mAh', '20.000 mAh', '25.000 mAh', '30.000 mAh', '40.000 mAh+'],
        placeholder: 'Chọn dung lượng',
      },
      {
        id: 'outputPower',
        label: 'Công suất đầu ra',
        type: 'select',
        options: ['5W', '10W', '18W', '20W', '22.5W', '65W', '100W+'],
        placeholder: 'Chọn công suất đầu ra',
      },
      {
        id: 'outputPorts',
        label: 'Cổng kết nối',
        type: 'select',
        options: ['USB-A + USB-C', 'USB-C + Lightning', '2x USB-C', 'USB-A + USB-C + Lightning'],
        placeholder: 'Chọn loại cổng',
      },
      {
        id: 'chargingTech',
        label: 'Công nghệ sạc',
        type: 'select',
        options: ['Sạc thường', 'Sạc nhanh (Fast Charge)', 'PD (Power Delivery)', 'Sạc không dây tích hợp'],
        placeholder: 'Chọn công nghệ sạc',
      },
    ],
    optionalFields: [
      {
        id: 'weight',
        label: 'Trọng lượng',
        type: 'text',
        placeholder: 'VD: 240g',
      },
      {
        id: 'displayScreen',
        label: 'Màn hình hiển thị',
        type: 'select',
        options: ['Có màn hình LED', 'Có màn hình LCD', 'Không có màn hình', 'Đèn báo LED'],
        placeholder: 'Chọn loại hiển thị',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 5. TAI NGHE CÓ DÂY
  // ─────────────────────────────────────────────────────────
  'tai-nghe-co-day': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'connectorType',
        label: 'Loại giắc cắm',
        type: 'select',
        options: ['3.5mm (AUX)', 'USB-C', 'Lightning (iPhone)', 'USB-A'],
        placeholder: 'Chọn loại giắc cắm',
      },
      {
        id: 'headphoneType',
        label: 'Kiểu tai nghe',
        type: 'select',
        options: ['In-ear (nhét tai)', 'On-ear (áp tai)', 'Over-ear (bịt tai)', 'Earbud'],
        placeholder: 'Chọn kiểu tai nghe',
      },
      {
        id: 'hasMic',
        label: 'Micro tích hợp',
        type: 'select',
        options: ['Có micro', 'Không có micro'],
        placeholder: 'Chọn',
      },
      {
        id: 'frequencyResponse',
        label: 'Dải tần số',
        type: 'text',
        placeholder: 'VD: 20Hz - 20kHz',
      },
    ],
    optionalFields: [
      {
        id: 'impedance',
        label: 'Trở kháng',
        type: 'text',
        placeholder: 'VD: 32Ω',
      },
      {
        id: 'cableLength',
        label: 'Chiều dài cáp',
        type: 'text',
        placeholder: 'VD: 1.2m',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 6. ĐẾ SẠC KHÔNG DÂY
  // ─────────────────────────────────────────────────────────
  'de-sac-khong-day': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'chargingPower',
        label: 'Công suất sạc',
        type: 'select',
        options: ['5W', '7.5W (iPhone)', '10W', '15W (MagSafe)', '20W'],
        placeholder: 'Chọn công suất',
      },
      {
        id: 'chargingStandard',
        label: 'Chuẩn sạc',
        type: 'select',
        options: ['Qi', 'MagSafe', 'Qi2', 'Qi + MagSafe'],
        placeholder: 'Chọn chuẩn sạc',
      },
      {
        id: 'compatibleDevices',
        label: 'Tương thích với',
        type: 'select',
        options: ['iPhone 12+ (MagSafe)', 'Android (Qi)', 'Tất cả thiết bị hỗ trợ Qi', 'Airpods, Apple Watch'],
        placeholder: 'Chọn thiết bị tương thích',
      },
    ],
    optionalFields: [
      {
        id: 'numChargeSlots',
        label: 'Số vị trí sạc',
        type: 'select',
        options: ['1 vị trí', '2 vị trí', '3 vị trí (điện thoại + tai nghe + đồng hồ)'],
        placeholder: 'Chọn số vị trí',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 7. LOA BLUETOOTH
  // ─────────────────────────────────────────────────────────
  'loa-bluetooth': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'bluetoothVersion',
        label: 'Phiên bản Bluetooth',
        type: 'select',
        options: ['Bluetooth 4.0', 'Bluetooth 4.2', 'Bluetooth 5.0', 'Bluetooth 5.1', 'Bluetooth 5.2', 'Bluetooth 5.3'],
        placeholder: 'Chọn phiên bản Bluetooth',
      },
      {
        id: 'power',
        label: 'Công suất loa',
        type: 'select',
        options: ['Dưới 5W', '5W - 10W', '11W - 20W', '21W - 40W', '41W - 80W', 'Trên 80W'],
        placeholder: 'Chọn công suất',
      },
      {
        id: 'batteryLife',
        label: 'Thời lượng pin',
        type: 'select',
        options: ['Dưới 6 giờ', '6 - 10 giờ', '11 - 20 giờ', '21 - 30 giờ', 'Trên 30 giờ', 'Không có pin (cắm điện)'],
        placeholder: 'Chọn thời lượng pin',
      },
      {
        id: 'waterproof',
        label: 'Khả năng chống nước',
        type: 'select',
        options: ['Không chống nước', 'Chống nước IPX4', 'Chống nước IPX5', 'Chống nước IPX6', 'Chống nước IPX7 (nhúng nước)'],
        placeholder: 'Chọn cấp độ chống nước',
      },
    ],
    optionalFields: [
      {
        id: 'extraFeatures',
        label: 'Tính năng thêm',
        type: 'select',
        options: ['Hỗ trợ TWS (kết nối 2 loa)', 'Hỗ trợ thẻ nhớ (TF Card)', 'Hỗ trợ AUX 3.5mm', 'Hỗ trợ FM Radio', 'Đèn LED / RGB', 'Micro tích hợp (loa ngoài)'],
        placeholder: 'Chọn tính năng',
      },
      {
        id: 'connectRange',
        label: 'Phạm vi kết nối',
        type: 'text',
        placeholder: 'VD: 10m',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 8. LOA ĐỂ BÀN / SOUNDBAR / LOA MÁY TÍNH
  // ─────────────────────────────────────────────────────────
  'loa-de-ban': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'power',
        label: 'Công suất loa',
        type: 'select',
        options: ['Dưới 5W', '5W - 20W', '21W - 50W', '51W - 100W', 'Trên 100W'],
        placeholder: 'Chọn công suất',
      },
      {
        id: 'channelConfig',
        label: 'Cấu hình kênh âm',
        type: 'select',
        options: ['2.0 (stereo)', '2.1 (stereo + subwoofer)', '5.1', '7.1', 'Mono'],
        placeholder: 'Chọn cấu hình',
      },
      {
        id: 'connectionType',
        label: 'Kiểu kết nối',
        type: 'select',
        options: ['Bluetooth', 'USB', 'AUX 3.5mm', 'Bluetooth + AUX', 'Bluetooth + USB + AUX', 'WiFi (Wireless)'],
        placeholder: 'Chọn kiểu kết nối',
      },
    ],
    optionalFields: [
      {
        id: 'frequencyResponse',
        label: 'Dải tần số',
        type: 'text',
        placeholder: 'VD: 50Hz - 20kHz',
      },
    ],
  },
  'soundbar': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'power',
        label: 'Công suất',
        type: 'select',
        options: ['Dưới 100W', '100W - 200W', '201W - 400W', 'Trên 400W'],
        placeholder: 'Chọn công suất',
      },
      {
        id: 'channelConfig',
        label: 'Cấu hình kênh âm',
        type: 'select',
        options: ['2.0ch', '2.1ch', '3.1ch', '5.1ch', '7.1ch', '5.1.2ch (Dolby Atmos)', '7.1.4ch'],
        placeholder: 'Chọn cấu hình',
      },
      {
        id: 'connectionType',
        label: 'Kiểu kết nối',
        type: 'select',
        options: ['HDMI ARC / eARC', 'Bluetooth', 'Optical', 'HDMI + Bluetooth + Optical'],
        placeholder: 'Chọn kiểu kết nối',
      },
      {
        id: 'audioFormat',
        label: 'Định dạng âm thanh hỗ trợ',
        type: 'select',
        options: ['Dolby Atmos', 'DTS:X', 'Dolby Digital Plus', 'Dolby TrueHD', 'PCM'],
        placeholder: 'Chọn định dạng',
      },
    ],
    optionalFields: [
      {
        id: 'hasSubwoofer',
        label: 'Subwoofer đi kèm',
        type: 'select',
        options: ['Có subwoofer không dây', 'Có subwoofer có dây', 'Không có subwoofer'],
        placeholder: 'Chọn',
      },
    ],
  },
  'loa-may-tinh': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'power',
        label: 'Công suất loa',
        type: 'select',
        options: ['Dưới 5W', '5W - 10W', '11W - 30W', '31W - 60W', 'Trên 60W'],
        placeholder: 'Chọn công suất',
      },
      {
        id: 'connectionType',
        label: 'Kiểu kết nối',
        type: 'select',
        options: ['USB', 'AUX 3.5mm', 'Bluetooth', 'USB + AUX', 'Bluetooth + AUX'],
        placeholder: 'Chọn kiểu kết nối',
      },
      {
        id: 'channelConfig',
        label: 'Cấu hình kênh âm',
        type: 'select',
        options: ['2.0 (stereo)', '2.1 (stereo + subwoofer)'],
        placeholder: 'Chọn cấu hình',
      },
    ],
    optionalFields: [
      {
        id: 'hasRGB',
        label: 'Đèn RGB',
        type: 'select',
        options: ['Có đèn RGB', 'Không có đèn RGB'],
        placeholder: 'Chọn',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 9. TAI NGHE BLUETOOTH
  // ─────────────────────────────────────────────────────────
  'tai-nghe-bluetooth': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'headphoneForm',
        label: 'Kiểu tai nghe',
        type: 'select',
        options: ['True Wireless (TWS) - Không dây hoàn toàn', 'Neckband (dây đeo cổ)', 'Over-ear (bịt tai)', 'On-ear (áp tai)'],
        placeholder: 'Chọn kiểu tai nghe',
      },
      {
        id: 'bluetoothVersion',
        label: 'Phiên bản Bluetooth',
        type: 'select',
        options: ['Bluetooth 4.2', 'Bluetooth 5.0', 'Bluetooth 5.1', 'Bluetooth 5.2', 'Bluetooth 5.3'],
        placeholder: 'Chọn phiên bản Bluetooth',
      },
      {
        id: 'anc',
        label: 'Chống ồn chủ động (ANC)',
        type: 'select',
        options: ['Có ANC', 'Không có ANC', 'ANC + Chế độ xuyên âm'],
        placeholder: 'Chọn',
      },
      {
        id: 'totalBattery',
        label: 'Thời lượng pin (tai nghe + hộp)',
        type: 'text',
        placeholder: 'VD: 8h (tai nghe) + 30h (hộp sạc)',
      },
    ],
    optionalFields: [
      {
        id: 'waterResistance',
        label: 'Chống nước / mồ hôi',
        type: 'select',
        options: ['IPX4', 'IPX5', 'IPX7', 'Không chống nước'],
        placeholder: 'Chọn cấp độ',
      },
      {
        id: 'chargingPort',
        label: 'Cổng sạc hộp',
        type: 'select',
        options: ['USB-C', 'Lightning', 'Micro-USB', 'Sạc không dây Qi'],
        placeholder: 'Chọn cổng sạc',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 10. MICRO & THU ÂM
  // ─────────────────────────────────────────────────────────
  'micro-thu-am': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'micType',
        label: 'Loại micro',
        type: 'select',
        options: ['Micro USB/XLR (phòng thu)', 'Micro Condenser', 'Micro Dynamic', 'Micro Lavalier (cài áo)', 'Micro shotgun', 'Micro không dây'],
        placeholder: 'Chọn loại micro',
      },
      {
        id: 'connectionType',
        label: 'Kiểu kết nối',
        type: 'select',
        options: ['USB-A', 'USB-C', 'XLR', '3.5mm TRS', 'Không dây (Wireless)'],
        placeholder: 'Chọn kiểu kết nối',
      },
      {
        id: 'polarPattern',
        label: 'Chế độ thu âm',
        type: 'select',
        options: ['Cardioid (đơn hướng)', 'Omnidirectional (đa hướng)', 'Bidirectional', 'Stereo'],
        placeholder: 'Chọn chế độ thu âm',
      },
    ],
    optionalFields: [
      {
        id: 'frequencyResponse',
        label: 'Dải tần số',
        type: 'text',
        placeholder: 'VD: 20Hz - 20kHz',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 11. ĐỒNG HỒ THÔNG MINH / VÒNG ĐEO SỨC KHOẺ
  // ─────────────────────────────────────────────────────────
  'dong-ho-thong-minh': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'displaySize',
        label: 'Kích thước màn hình',
        type: 'select',
        options: ['Dưới 1.0 inch', '1.0 - 1.4 inch', '1.5 - 1.9 inch', 'Trên 2.0 inch'],
        placeholder: 'Chọn kích thước',
      },
      {
        id: 'displayTech',
        label: 'Công nghệ màn hình',
        type: 'select',
        options: ['AMOLED', 'LCD', 'Retina LTPO OLED', 'TFT LCD', 'E-Ink'],
        placeholder: 'Chọn công nghệ màn hình',
      },
      {
        id: 'compatibility',
        label: 'Tương thích với',
        type: 'select',
        options: ['Android & iOS', 'Chỉ iOS (iPhone)', 'Chỉ Android'],
        placeholder: 'Chọn nền tảng tương thích',
      },
      {
        id: 'healthFeatures',
        label: 'Tính năng sức khoẻ',
        type: 'select',
        options: ['Đo nhịp tim', 'Đo SpO2 (oxy máu)', 'Đo nhịp tim + SpO2 + nhiệt độ', 'ECG + đo nhịp tim + SpO2', 'Tất cả + đo đường huyết'],
        placeholder: 'Chọn tính năng sức khoẻ',
      },
      {
        id: 'batteryLife',
        label: 'Thời lượng pin',
        type: 'select',
        options: ['Dưới 2 ngày', '3 - 5 ngày', '6 - 10 ngày', '11 - 20 ngày', 'Trên 20 ngày'],
        placeholder: 'Chọn thời lượng pin',
      },
    ],
    optionalFields: [
      {
        id: 'waterResistance',
        label: 'Chống nước',
        type: 'select',
        options: ['IP67', 'IP68', '5ATM', 'Không chống nước'],
        placeholder: 'Chọn cấp độ chống nước',
      },
      {
        id: 'gps',
        label: 'GPS tích hợp',
        type: 'select',
        options: ['Có GPS tích hợp', 'Không có GPS (GPS phone)', 'GPS + GLONASS'],
        placeholder: 'Chọn',
      },
    ],
  },
  'vong-suc-khoe': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'compatibility',
        label: 'Tương thích với',
        type: 'select',
        options: ['Android & iOS', 'Chỉ iOS (iPhone)', 'Chỉ Android'],
        placeholder: 'Chọn nền tảng',
      },
      {
        id: 'healthFeatures',
        label: 'Cảm biến sức khoẻ',
        type: 'select',
        options: ['Đo nhịp tim', 'Đo nhịp tim + SpO2', 'Đo nhịp tim + SpO2 + nhiệt độ', 'Theo dõi giấc ngủ', 'Đầy đủ cảm biến + ECG'],
        placeholder: 'Chọn tính năng sức khoẻ',
      },
      {
        id: 'batteryLife',
        label: 'Thời lượng pin',
        type: 'select',
        options: ['Dưới 5 ngày', '5 - 10 ngày', '10 - 20 ngày', 'Trên 20 ngày'],
        placeholder: 'Chọn thời lượng pin',
      },
    ],
    optionalFields: [
      {
        id: 'waterResistance',
        label: 'Chống nước',
        type: 'select',
        options: ['IP67', 'IP68', '5ATM'],
        placeholder: 'Chọn cấp độ',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 12. THIẾT BỊ NHÀ THÔNG MINH
  // ─────────────────────────────────────────────────────────
  'smarthome': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'deviceType',
        label: 'Loại thiết bị',
        type: 'select',
        options: ['Ổ cắm thông minh', 'Công tắc thông minh', 'Camera an ninh', 'Chuông cửa thông minh', 'Khóa cửa thông minh', 'Cảm biến chuyển động', 'Nhiệt kế thông minh', 'Robot hút bụi'],
        placeholder: 'Chọn loại thiết bị',
      },
      {
        id: 'connectivity',
        label: 'Kết nối',
        type: 'select',
        options: ['WiFi 2.4GHz', 'WiFi 2.4GHz + 5GHz', 'Zigbee', 'Bluetooth', 'Z-Wave', 'WiFi + Bluetooth'],
        placeholder: 'Chọn loại kết nối',
      },
      {
        id: 'voiceAssistant',
        label: 'Hỗ trợ trợ lý ảo',
        type: 'select',
        options: ['Google Home', 'Amazon Alexa', 'Apple HomeKit', 'Google Home + Alexa', 'Tất cả trợ lý ảo', 'Không hỗ trợ'],
        placeholder: 'Chọn trợ lý ảo',
      },
    ],
    optionalFields: [
      {
        id: 'hub',
        label: 'Yêu cầu Hub',
        type: 'select',
        options: ['Không cần Hub (kết nối trực tiếp)', 'Cần Hub riêng', 'Tương thích Hub Zigbee chung'],
        placeholder: 'Chọn',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 13. ĐÈN THÔNG MINH
  // ─────────────────────────────────────────────────────────
  'den-thong-minh': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'bulbType',
        label: 'Loại bóng đèn',
        type: 'select',
        options: ['Bóng LED thông minh (E27)', 'Bóng LED thông minh (E14)', 'Đèn LED dây (Strip Light)', 'Đèn LED bảng điều khiển', 'Đèn thông minh tích hợp (không thể tháo)'],
        placeholder: 'Chọn loại đèn',
      },
      {
        id: 'power',
        label: 'Công suất (W)',
        type: 'select',
        options: ['5W - 9W', '10W - 14W', '15W - 20W', 'Trên 20W'],
        placeholder: 'Chọn công suất',
      },
      {
        id: 'colorTemp',
        label: 'Nhiệt độ màu',
        type: 'select',
        options: ['Trắng ấm (2700K - 3000K)', 'Trắng trung tính (4000K)', 'Trắng lạnh (6000K - 6500K)', 'Đổi màu RGB', 'Tunable White (trắng ấm đến lạnh)', 'Full Color RGBW'],
        placeholder: 'Chọn nhiệt độ màu',
      },
      {
        id: 'connectivity',
        label: 'Kết nối',
        type: 'select',
        options: ['WiFi 2.4GHz', 'Bluetooth', 'Zigbee', 'WiFi + Bluetooth'],
        placeholder: 'Chọn loại kết nối',
      },
    ],
    optionalFields: [
      {
        id: 'voiceAssistant',
        label: 'Hỗ trợ trợ lý ảo',
        type: 'select',
        options: ['Google Home', 'Amazon Alexa', 'Apple HomeKit', 'Tất cả trợ lý ảo'],
        placeholder: 'Chọn trợ lý ảo',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 14. ĐIỆN THOẠI THÔNG MINH / MÁY TÍNH BẢNG (Tablet)
  // ─────────────────────────────────────────────────────────
  'dien-thoai-thong-minh': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'operatingSystem',
        label: 'Hệ điều hành',
        type: 'select',
        options: ['Android 14', 'Android 13', 'Android 12', 'iOS 17', 'iOS 16', 'HarmonyOS'],
        placeholder: 'Chọn hệ điều hành',
      },
      {
        id: 'screenSize',
        label: 'Kích thước màn hình',
        type: 'text',
        placeholder: 'VD: 6.7 inch',
      },
      {
        id: 'cpu',
        label: 'Chip xử lý (CPU)',
        type: 'text',
        placeholder: 'VD: Snapdragon 8 Gen 3 / Apple A17 Pro',
      },
      {
        id: 'ram',
        label: 'RAM',
        type: 'select',
        options: ['4GB', '6GB', '8GB', '12GB', '16GB', '18GB'],
        placeholder: 'Chọn dung lượng RAM',
      },
      {
        id: 'storage',
        label: 'Bộ nhớ trong',
        type: 'select',
        options: ['64GB', '128GB', '256GB', '512GB', '1TB'],
        placeholder: 'Chọn bộ nhớ trong',
      },
      {
        id: 'mainCamera',
        label: 'Camera chính',
        type: 'text',
        placeholder: 'VD: 108MP / 200MP / 50MP + 12MP + 10MP',
      },
    ],
    optionalFields: [
      {
        id: 'battery',
        label: 'Dung lượng pin',
        type: 'text',
        placeholder: 'VD: 5000 mAh',
      },
      {
        id: 'chargingSpeed',
        label: 'Sạc nhanh',
        type: 'text',
        placeholder: 'VD: 45W, 65W, 120W',
      },
    ],
  },
  'may-tinh-bang': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'operatingSystem',
        label: 'Hệ điều hành',
        type: 'select',
        options: ['Android 14', 'Android 13', 'iPadOS 17', 'iPadOS 16', 'Windows 11', 'HarmonyOS'],
        placeholder: 'Chọn hệ điều hành',
      },
      {
        id: 'screenSize',
        label: 'Kích thước màn hình',
        type: 'select',
        options: ['7 - 8 inch', '9 - 10 inch', '11 inch', '12 - 13 inch', 'Trên 13 inch'],
        placeholder: 'Chọn kích thước màn hình',
      },
      {
        id: 'cpu',
        label: 'Chip xử lý (CPU)',
        type: 'text',
        placeholder: 'VD: Apple M2 / Snapdragon 870 / MediaTek Helio G99',
      },
      {
        id: 'ram',
        label: 'RAM',
        type: 'select',
        options: ['4GB', '6GB', '8GB', '12GB', '16GB'],
        placeholder: 'Chọn dung lượng RAM',
      },
      {
        id: 'storage',
        label: 'Bộ nhớ trong',
        type: 'select',
        options: ['64GB', '128GB', '256GB', '512GB', '1TB'],
        placeholder: 'Chọn bộ nhớ trong',
      },
    ],
    optionalFields: [
      {
        id: 'hasCellular',
        label: 'Hỗ trợ SIM 4G/5G',
        type: 'select',
        options: ['Chỉ WiFi', 'WiFi + 4G LTE', 'WiFi + 5G'],
        placeholder: 'Chọn',
      },
      {
        id: 'stylus',
        label: 'Hỗ trợ bút cảm ứng',
        type: 'select',
        options: ['Có (kèm bút)', 'Hỗ trợ (mua riêng)', 'Không hỗ trợ'],
        placeholder: 'Chọn',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 15. ĐIỆN THOẠI PHỔ THÔNG (Feature Phone)
  // ─────────────────────────────────────────────────────────
  'dien-thoai-pho-thong': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'simSlots',
        label: 'Số SIM',
        type: 'select',
        options: ['1 SIM', '2 SIM', '3 SIM'],
        placeholder: 'Chọn số SIM',
      },
      {
        id: 'battery',
        label: 'Dung lượng pin',
        type: 'text',
        placeholder: 'VD: 1000 mAh, 3000 mAh',
      },
      {
        id: 'network',
        label: 'Chuẩn mạng',
        type: 'select',
        options: ['2G (GSM)', '2G + 3G', '4G LTE'],
        placeholder: 'Chọn chuẩn mạng',
      },
    ],
    optionalFields: [
      {
        id: 'screenSize',
        label: 'Kích thước màn hình',
        type: 'text',
        placeholder: 'VD: 2.8 inch',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 16. LAPTOP
  // ─────────────────────────────────────────────────────────
  'laptop': {
    requiredFields: [
      warrantyField,
      originCountryField,
      {
        id: 'cpu',
        label: 'Bộ vi xử lý (CPU)',
        type: 'text',
        placeholder: 'VD: Intel Core i5-13420H / AMD Ryzen 7 7745HX',
      },
      {
        id: 'ram',
        label: 'RAM',
        type: 'select',
        options: ['4GB DDR4', '8GB DDR4', '8GB DDR5', '16GB DDR4', '16GB DDR5', '32GB DDR5', '64GB DDR5'],
        placeholder: 'Chọn dung lượng RAM',
      },
    ],
    mainFields: [
      {
        id: 'storage',
        label: 'Ổ cứng',
        type: 'select',
        options: ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '512GB SSD + 1TB HDD', '1TB HDD'],
        placeholder: 'Chọn loại ổ cứng',
      },
      {
        id: 'screenSize',
        label: 'Kích thước màn hình',
        type: 'select',
        options: ['13 inch', '14 inch', '15.6 inch', '16 inch', '17.3 inch'],
        placeholder: 'Chọn kích thước màn hình',
      },
      {
        id: 'screenResolution',
        label: 'Độ phân giải màn hình',
        type: 'select',
        options: ['FHD 1920x1080', '2K / WQHD 2560x1440', '2.5K 2560x1600', '4K 3840x2160', 'OLED FHD', 'OLED 4K'],
        placeholder: 'Chọn độ phân giải',
      },
      {
        id: 'gpu',
        label: 'Card đồ họa (GPU)',
        type: 'text',
        placeholder: 'VD: NVIDIA GeForce RTX 4060 / Intel Iris Xe',
      },
      {
        id: 'operatingSystem',
        label: 'Hệ điều hành',
        type: 'select',
        options: ['Windows 11 Home', 'Windows 11 Pro', 'Windows 10 Home', 'No OS / DOS', 'macOS Sequoia', 'macOS Ventura'],
        placeholder: 'Chọn hệ điều hành',
      },
    ],
    optionalFields: [
      {
        id: 'battery',
        label: 'Dung lượng pin',
        type: 'text',
        placeholder: 'VD: 56Wh, 72Wh, 99Wh',
      },
      {
        id: 'weight',
        label: 'Trọng lượng',
        type: 'text',
        placeholder: 'VD: 1.4kg',
      },
      {
        id: 'model',
        label: 'Model máy',
        type: 'text',
        placeholder: 'VD: Lenovo LOQ 15IRH8, ASUS TUF Gaming A15',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 17. MÁY TÍNH ĐỂ BÀN / MÁY TÍNH BẢNG PC
  // ─────────────────────────────────────────────────────────
  'may-tinh-de-ban': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'cpu',
        label: 'Bộ vi xử lý (CPU)',
        type: 'text',
        placeholder: 'VD: Intel Core i5-14400F / AMD Ryzen 5 7600X',
      },
      {
        id: 'ram',
        label: 'RAM',
        type: 'select',
        options: ['8GB DDR4', '16GB DDR4', '16GB DDR5', '32GB DDR5', '64GB DDR5'],
        placeholder: 'Chọn dung lượng RAM',
      },
      {
        id: 'storage',
        label: 'Ổ cứng',
        type: 'select',
        options: ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '1TB HDD', '512GB SSD + 2TB HDD'],
        placeholder: 'Chọn ổ cứng',
      },
      {
        id: 'gpu',
        label: 'Card đồ họa (GPU)',
        type: 'text',
        placeholder: 'VD: NVIDIA RTX 4070 / Intel UHD Graphics / AMD Radeon RX 7600',
      },
      {
        id: 'operatingSystem',
        label: 'Hệ điều hành',
        type: 'select',
        options: ['Windows 11 Home', 'Windows 11 Pro', 'Windows 10 Home', 'No OS / DOS', 'Linux'],
        placeholder: 'Chọn hệ điều hành',
      },
    ],
    optionalFields: [
      {
        id: 'formFactor',
        label: 'Kiểu thiết kế',
        type: 'select',
        options: ['Tower / Full-size', 'Mini-PC', 'All-in-One', 'Mini Tower'],
        placeholder: 'Chọn kiểu thiết kế',
      },
    ],
  },
  'may-tinh-bang-pc': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'cpu',
        label: 'Bộ vi xử lý (CPU)',
        type: 'text',
        placeholder: 'VD: Intel Core Ultra 5 125H / AMD Ryzen 7 8845HS',
      },
      {
        id: 'ram',
        label: 'RAM',
        type: 'select',
        options: ['8GB', '16GB', '32GB', '64GB'],
        placeholder: 'Chọn RAM',
      },
      {
        id: 'storage',
        label: 'Ổ cứng',
        type: 'select',
        options: ['256GB SSD', '512GB SSD', '1TB SSD'],
        placeholder: 'Chọn ổ cứng',
      },
      {
        id: 'operatingSystem',
        label: 'Hệ điều hành',
        type: 'select',
        options: ['Windows 11 Home', 'Windows 11 Pro', 'Android', 'No OS'],
        placeholder: 'Chọn hệ điều hành',
      },
    ],
    optionalFields: [
      {
        id: 'screenSize',
        label: 'Kích thước màn hình',
        type: 'text',
        placeholder: 'VD: 10.9 inch (nếu All-in-One)',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 18. BÀN PHÍM
  // ─────────────────────────────────────────────────────────
  'ban-phim': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'keyboardType',
        label: 'Loại bàn phím',
        type: 'select',
        options: ['Cơ (Mechanical)', 'Membrane (màng)', 'Hybrid', 'Silent Mechanical'],
        placeholder: 'Chọn loại bàn phím',
      },
      {
        id: 'connectionType',
        label: 'Kiểu kết nối',
        type: 'select',
        options: ['Có dây (USB-A)', 'Có dây (USB-C)', 'Không dây (Bluetooth)', 'Không dây (2.4GHz USB)', 'Đa chế độ (Có dây + BT + 2.4G)'],
        placeholder: 'Chọn kiểu kết nối',
      },
      {
        id: 'switchType',
        label: 'Loại switch (phím cơ)',
        type: 'select',
        options: ['Red (Linear - nhẹ)', 'Blue (Clicky - tiếng click)', 'Brown (Tactile - phản hồi)', 'Black (Linear - nặng)', 'Yellow / Silver (Linear tốc độ)', 'Không áp dụng (bàn phím membrane)'],
        placeholder: 'Chọn loại switch',
      },
      {
        id: 'keyLayout',
        label: 'Kích thước / Layout',
        type: 'select',
        options: ['Full-size (100%)', 'Tenkeyless TKL (87 phím)', '75% (84 phím)', '65% (68 phím)', '60% (61 phím)', 'Numpad riêng biệt'],
        placeholder: 'Chọn layout',
      },
    ],
    optionalFields: [
      {
        id: 'hasRGB',
        label: 'Đèn LED / RGB',
        type: 'select',
        options: ['RGB đầy đủ', 'Đèn trắng đơn sắc', 'Không có đèn nền'],
        placeholder: 'Chọn loại đèn',
      },
      {
        id: 'keycapMaterial',
        label: 'Chất liệu keycap',
        type: 'select',
        options: ['PBT (bền, ít bóng)', 'ABS (phổ biến)', 'Double-shot PBT', 'Pudding PBT'],
        placeholder: 'Chọn chất liệu keycap',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 19. CHUỘT MÁY TÍNH
  // ─────────────────────────────────────────────────────────
  'chuot-pc': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'connectionType',
        label: 'Kiểu kết nối',
        type: 'select',
        options: ['Có dây (USB-A)', 'Có dây (USB-C)', 'Không dây Bluetooth', 'Không dây 2.4GHz', 'Đa chế độ (BT + 2.4G)', 'Có dây + Không dây'],
        placeholder: 'Chọn kiểu kết nối',
      },
      {
        id: 'dpi',
        label: 'DPI tối đa',
        type: 'select',
        options: ['800 - 1600 DPI', '800 - 3200 DPI', '100 - 6400 DPI', '100 - 12400 DPI', '100 - 25600 DPI', '100 - 32000 DPI+'],
        placeholder: 'Chọn DPI',
      },
      {
        id: 'handedness',
        label: 'Thiết kế cho tay',
        type: 'select',
        options: ['Thuận tay phải', 'Thuận tay trái', 'Cả hai tay (Ambidextrous)'],
        placeholder: 'Chọn',
      },
      {
        id: 'sensorType',
        label: 'Loại cảm biến',
        type: 'select',
        options: ['Optical (quang học)', 'Laser', 'Pixart PMW-3360', 'Pixart PMW-3395', 'HERO 25K (Logitech)'],
        placeholder: 'Chọn cảm biến',
      },
    ],
    optionalFields: [
      {
        id: 'hasRGB',
        label: 'Đèn RGB',
        type: 'select',
        options: ['Có đèn RGB', 'Không có đèn RGB'],
        placeholder: 'Chọn',
      },
      {
        id: 'numButtons',
        label: 'Số nút bấm',
        type: 'text',
        placeholder: 'VD: 6 nút',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 20. MÀN HÌNH
  // ─────────────────────────────────────────────────────────
  'man-hinh': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'screenSize',
        label: 'Kích thước màn hình',
        type: 'select',
        options: ['21 - 22 inch', '23 - 24 inch', '25 - 27 inch', '28 - 32 inch', '34 inch (Ultrawide)', 'Trên 34 inch'],
        placeholder: 'Chọn kích thước',
      },
      {
        id: 'resolution',
        label: 'Độ phân giải',
        type: 'select',
        options: ['FHD 1920x1080', 'QHD / WQHD 2560x1440', 'UHD 4K 3840x2160', 'UWQHD 3440x1440 (Ultrawide)', '1920x1200 (WUXGA)'],
        placeholder: 'Chọn độ phân giải',
      },
      {
        id: 'panelType',
        label: 'Loại tấm nền (Panel)',
        type: 'select',
        options: ['IPS', 'VA', 'TN', 'OLED', 'Nano IPS', 'Fast IPS', 'OLED QD'],
        placeholder: 'Chọn loại tấm nền',
      },
      {
        id: 'refreshRate',
        label: 'Tần số quét',
        type: 'select',
        options: ['60Hz', '75Hz', '100Hz', '120Hz', '144Hz', '165Hz', '180Hz', '240Hz', '360Hz'],
        placeholder: 'Chọn tần số quét',
      },
      {
        id: 'responseTime',
        label: 'Thời gian phản hồi',
        type: 'select',
        options: ['1ms (GtG)', '4ms (GtG)', '5ms (GtG)', '8ms (GtG)', '1ms (MPRT)'],
        placeholder: 'Chọn thời gian phản hồi',
      },
    ],
    optionalFields: [
      {
        id: 'ports',
        label: 'Cổng kết nối',
        type: 'text',
        placeholder: 'VD: HDMI 2.1, DisplayPort 1.4, USB-C',
      },
      {
        id: 'adaptiveSync',
        label: 'Công nghệ đồng bộ',
        type: 'select',
        options: ['AMD FreeSync Premium', 'NVIDIA G-Sync', 'G-Sync Compatible', 'Không có'],
        placeholder: 'Chọn',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 21. TAI NGHE GAMING
  // ─────────────────────────────────────────────────────────
  'tai-nghe-gaming': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'connectionType',
        label: 'Kiểu kết nối',
        type: 'select',
        options: ['Có dây 3.5mm', 'Có dây USB-A', 'Không dây 2.4GHz', 'Không dây Bluetooth', 'Đa chế độ (2.4G + BT + Có dây)'],
        placeholder: 'Chọn kiểu kết nối',
      },
      {
        id: 'surroundSound',
        label: 'Âm thanh vòm',
        type: 'select',
        options: ['Virtual 7.1 Surround', 'DTS:X Ultra', 'Dolby Atmos', 'Stereo (2.0)', 'Không có âm thanh vòm'],
        placeholder: 'Chọn',
      },
      {
        id: 'microphone',
        label: 'Micro',
        type: 'select',
        options: ['Micro boom tháo rời', 'Micro boom cố định', 'Micro tích hợp (built-in)', 'Không có micro'],
        placeholder: 'Chọn loại micro',
      },
      {
        id: 'compatibility',
        label: 'Tương thích với',
        type: 'select',
        options: ['PC / Mac', 'PC + PS5/PS4', 'PC + Xbox', 'Đa nền tảng (PC, PS, Xbox, Mobile)', 'Nintendo Switch'],
        placeholder: 'Chọn nền tảng',
      },
    ],
    optionalFields: [
      {
        id: 'batteryLife',
        label: 'Thời lượng pin (không dây)',
        type: 'text',
        placeholder: 'VD: 40 giờ',
      },
      {
        id: 'hasRGB',
        label: 'Đèn LED / RGB',
        type: 'select',
        options: ['Có đèn RGB', 'Không có đèn RGB'],
        placeholder: 'Chọn',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 22. WEBCAM
  // ─────────────────────────────────────────────────────────
  'webcam': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'resolution',
        label: 'Độ phân giải video',
        type: 'select',
        options: ['HD 720p / 30fps', 'Full HD 1080p / 30fps', 'Full HD 1080p / 60fps', '2K / 30fps', '4K / 30fps'],
        placeholder: 'Chọn độ phân giải',
      },
      {
        id: 'connectionType',
        label: 'Kiểu kết nối',
        type: 'select',
        options: ['USB-A', 'USB-C', 'USB-C + USB-A (kèm adapter)'],
        placeholder: 'Chọn kiểu kết nối',
      },
      {
        id: 'fov',
        label: 'Góc nhìn (FOV)',
        type: 'select',
        options: ['60° - 70°', '78°', '90°', '110°', '120°+'],
        placeholder: 'Chọn góc nhìn',
      },
      {
        id: 'autoFocus',
        label: 'Lấy nét tự động',
        type: 'select',
        options: ['Có (Auto Focus)', 'Không (Fixed Focus)'],
        placeholder: 'Chọn',
      },
    ],
    optionalFields: [
      {
        id: 'microphone',
        label: 'Micro tích hợp',
        type: 'select',
        options: ['Có micro tích hợp', 'Micro kép (stereo)', 'Micro khử tiếng ồn', 'Không có micro'],
        placeholder: 'Chọn',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 23. Ổ CỨNG HDD / SSD / USB / THẺ NHỚ
  // ─────────────────────────────────────────────────────────
  'o-cung-hdd': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'capacity',
        label: 'Dung lượng',
        type: 'select',
        options: ['500GB', '1TB', '2TB', '4TB', '6TB', '8TB', '10TB+'],
        placeholder: 'Chọn dung lượng',
      },
      {
        id: 'formFactor',
        label: 'Kích thước ổ',
        type: 'select',
        options: ['2.5 inch (laptop)', '3.5 inch (desktop)', 'Di động (Portable)'],
        placeholder: 'Chọn kích thước ổ',
      },
      {
        id: 'rpm',
        label: 'Tốc độ quay (RPM)',
        type: 'select',
        options: ['5400 RPM', '7200 RPM', '10000 RPM+'],
        placeholder: 'Chọn tốc độ quay',
      },
      {
        id: 'connectionInterface',
        label: 'Giao diện kết nối',
        type: 'select',
        options: ['SATA III', 'USB 3.0', 'USB 3.2 Gen1', 'USB-C', 'USB-C + USB-A'],
        placeholder: 'Chọn giao diện',
      },
    ],
    optionalFields: [
      {
        id: 'readSpeed',
        label: 'Tốc độ đọc',
        type: 'text',
        placeholder: 'VD: 150MB/s',
      },
    ],
  },
  'o-cung-ssd': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'capacity',
        label: 'Dung lượng',
        type: 'select',
        options: ['128GB', '250GB', '500GB', '1TB', '2TB', '4TB'],
        placeholder: 'Chọn dung lượng',
      },
      {
        id: 'formFactor',
        label: 'Chuẩn kết nối / Form factor',
        type: 'select',
        options: ['M.2 NVMe PCIe 4.0', 'M.2 NVMe PCIe 3.0', 'M.2 SATA', '2.5" SATA III', 'Di động (Portable SSD USB)'],
        placeholder: 'Chọn chuẩn',
      },
      {
        id: 'readSpeed',
        label: 'Tốc độ đọc',
        type: 'text',
        placeholder: 'VD: 7000MB/s (NVMe), 550MB/s (SATA)',
      },
      {
        id: 'writeSpeed',
        label: 'Tốc độ ghi',
        type: 'text',
        placeholder: 'VD: 6500MB/s (NVMe), 520MB/s (SATA)',
      },
    ],
    optionalFields: [
      {
        id: 'nandType',
        label: 'Loại NAND Flash',
        type: 'select',
        options: ['TLC', 'QLC', 'MLC', '3D NAND TLC', '3D NAND QLC'],
        placeholder: 'Chọn loại NAND',
      },
    ],
  },
  'usb-flash-drive': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'capacity',
        label: 'Dung lượng',
        type: 'select',
        options: ['8GB', '16GB', '32GB', '64GB', '128GB', '256GB', '512GB'],
        placeholder: 'Chọn dung lượng',
      },
      {
        id: 'usbStandard',
        label: 'Chuẩn USB',
        type: 'select',
        options: ['USB 2.0', 'USB 3.0', 'USB 3.1 Gen1', 'USB 3.2 Gen2', 'USB-C'],
        placeholder: 'Chọn chuẩn USB',
      },
      {
        id: 'readSpeed',
        label: 'Tốc độ đọc',
        type: 'text',
        placeholder: 'VD: 100MB/s',
      },
    ],
    optionalFields: [
      {
        id: 'waterproof',
        label: 'Chống nước',
        type: 'select',
        options: ['Có chống nước', 'Không chống nước'],
        placeholder: 'Chọn',
      },
    ],
  },
  'the-nho': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'capacity',
        label: 'Dung lượng',
        type: 'select',
        options: ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'],
        placeholder: 'Chọn dung lượng',
      },
      {
        id: 'cardType',
        label: 'Loại thẻ',
        type: 'select',
        options: ['microSD (microSDXC)', 'SD / SDXC', 'CFexpress Type A', 'CFexpress Type B', 'XQD'],
        placeholder: 'Chọn loại thẻ',
      },
      {
        id: 'speedClass',
        label: 'Tốc độ / Class',
        type: 'select',
        options: ['Class 10 / UHS-I U1', 'UHS-I U3 (V30)', 'UHS-II U3 (V60)', 'V90 (UHS-II)', 'A1 (App Performance)', 'A2 (App Performance)'],
        placeholder: 'Chọn tốc độ',
      },
      {
        id: 'readSpeed',
        label: 'Tốc độ đọc',
        type: 'text',
        placeholder: 'VD: 100MB/s, 200MB/s',
      },
    ],
    optionalFields: [],
  },
  'nas': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'driveSlots',
        label: 'Số khay ổ cứng',
        type: 'select',
        options: ['1 khay', '2 khay', '4 khay', '5 khay', '6 khay', '8 khay+'],
        placeholder: 'Chọn số khay',
      },
      {
        id: 'networkPort',
        label: 'Cổng mạng',
        type: 'select',
        options: ['1x Gigabit Ethernet', '2x Gigabit Ethernet', '1x 2.5GbE', '2x 2.5GbE', '10GbE'],
        placeholder: 'Chọn cổng mạng',
      },
      {
        id: 'cpu',
        label: 'CPU tích hợp',
        type: 'text',
        placeholder: 'VD: Intel Celeron J4125 / ARM Cortex-A55',
      },
      {
        id: 'ram',
        label: 'RAM tích hợp',
        type: 'select',
        options: ['1GB', '2GB', '4GB', '8GB', '16GB+'],
        placeholder: 'Chọn RAM',
      },
    ],
    optionalFields: [
      {
        id: 'usb',
        label: 'Cổng USB',
        type: 'text',
        placeholder: 'VD: 2x USB 3.2 Gen1 + 1x USB-C',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 24. LINH KIỆN MÁY TÍNH
  // ─────────────────────────────────────────────────────────
  'cpu': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'socket',
        label: 'Socket CPU',
        type: 'select',
        options: ['Intel LGA 1700', 'Intel LGA 1200', 'AMD AM5', 'AMD AM4', 'Intel LGA 1851'],
        placeholder: 'Chọn socket',
      },
      {
        id: 'cores',
        label: 'Số nhân / luồng',
        type: 'text',
        placeholder: 'VD: 6 nhân / 12 luồng (i5-13400F)',
      },
      {
        id: 'baseClock',
        label: 'Xung nhịp cơ bản',
        type: 'text',
        placeholder: 'VD: 3.3 GHz',
      },
      {
        id: 'boostClock',
        label: 'Xung nhịp tăng tốc',
        type: 'text',
        placeholder: 'VD: 5.1 GHz',
      },
      {
        id: 'tdp',
        label: 'TDP (công suất nhiệt)',
        type: 'text',
        placeholder: 'VD: 65W, 125W',
      },
    ],
    optionalFields: [
      {
        id: 'hasIGPU',
        label: 'Đồ họa tích hợp',
        type: 'select',
        options: ['Có GPU tích hợp (iGPU)', 'Không có iGPU (cần GPU rời)'],
        placeholder: 'Chọn',
      },
    ],
  },
  'mainboard': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'socket',
        label: 'Socket hỗ trợ',
        type: 'select',
        options: ['Intel LGA 1700', 'Intel LGA 1200', 'AMD AM5', 'AMD AM4', 'Intel LGA 1851'],
        placeholder: 'Chọn socket',
      },
      {
        id: 'chipset',
        label: 'Chipset',
        type: 'text',
        placeholder: 'VD: Intel Z790 / B760 / AMD X670E / B650',
      },
      {
        id: 'formFactor',
        label: 'Form factor',
        type: 'select',
        options: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'],
        placeholder: 'Chọn form factor',
      },
      {
        id: 'ramSlots',
        label: 'Số khe RAM',
        type: 'select',
        options: ['2 khe DDR4', '4 khe DDR4', '2 khe DDR5', '4 khe DDR5'],
        placeholder: 'Chọn số khe RAM',
      },
    ],
    optionalFields: [
      {
        id: 'pciSlots',
        label: 'Khe PCIe',
        type: 'text',
        placeholder: 'VD: 1x PCIe 5.0 x16 + 2x PCIe 4.0 x1',
      },
    ],
  },
  'ram': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'capacity',
        label: 'Dung lượng',
        type: 'select',
        options: ['8GB (1x8)', '16GB (2x8)', '16GB (1x16)', '32GB (2x16)', '32GB (1x32)', '64GB (2x32)', '64GB (4x16)'],
        placeholder: 'Chọn dung lượng',
      },
      {
        id: 'ramType',
        label: 'Loại RAM',
        type: 'select',
        options: ['DDR4', 'DDR5', 'LPDDR5', 'LPDDR4X', 'DDR4 SO-DIMM (laptop)', 'DDR5 SO-DIMM (laptop)'],
        placeholder: 'Chọn loại RAM',
      },
      {
        id: 'speed',
        label: 'Tốc độ (MHz)',
        type: 'select',
        options: ['DDR4-3200', 'DDR4-3600', 'DDR5-4800', 'DDR5-5600', 'DDR5-6000', 'DDR5-6400', 'DDR5-7200+'],
        placeholder: 'Chọn tốc độ',
      },
    ],
    optionalFields: [
      {
        id: 'hasRGB',
        label: 'Đèn LED / RGB',
        type: 'select',
        options: ['Có đèn RGB', 'Không có đèn (tản nhiệt thường)'],
        placeholder: 'Chọn',
      },
      {
        id: 'latency',
        label: 'Độ trễ (CL)',
        type: 'text',
        placeholder: 'VD: CL16, CL32',
      },
    ],
  },
  'card-do-hoa': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'gpuChip',
        label: 'Chip GPU',
        type: 'text',
        placeholder: 'VD: NVIDIA GeForce RTX 4070 Super / AMD Radeon RX 7800 XT',
      },
      {
        id: 'vram',
        label: 'Bộ nhớ GPU (VRAM)',
        type: 'select',
        options: ['4GB GDDR6', '6GB GDDR6', '8GB GDDR6', '10GB GDDR6X', '12GB GDDR6X', '16GB GDDR6', '16GB GDDR6X', '24GB GDDR6X'],
        placeholder: 'Chọn dung lượng VRAM',
      },
      {
        id: 'busWidth',
        label: 'Bus bộ nhớ',
        type: 'select',
        options: ['128-bit', '160-bit', '192-bit', '256-bit', '384-bit'],
        placeholder: 'Chọn bus bộ nhớ',
      },
      {
        id: 'tdp',
        label: 'TDP / Tiêu thụ điện',
        type: 'text',
        placeholder: 'VD: 200W, 285W, 450W',
      },
    ],
    optionalFields: [
      {
        id: 'outputs',
        label: 'Cổng xuất hình',
        type: 'text',
        placeholder: 'VD: 3x DisplayPort 1.4a, 1x HDMI 2.1',
      },
      {
        id: 'powerConnector',
        label: 'Connector nguồn',
        type: 'text',
        placeholder: 'VD: 1x 16-pin, 2x 8-pin',
      },
    ],
  },
  'nguon-may-tinh': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'wattage',
        label: 'Công suất (W)',
        type: 'select',
        options: ['400W', '450W', '550W', '650W', '750W', '850W', '1000W', '1200W+'],
        placeholder: 'Chọn công suất',
      },
      {
        id: 'certification',
        label: 'Chứng chỉ 80 PLUS',
        type: 'select',
        options: ['80 PLUS Standard', '80 PLUS Bronze', '80 PLUS Silver', '80 PLUS Gold', '80 PLUS Platinum', '80 PLUS Titanium'],
        placeholder: 'Chọn chứng chỉ',
      },
      {
        id: 'formFactor',
        label: 'Form factor',
        type: 'select',
        options: ['ATX', 'SFX (mini-ITX)', 'SFX-L', 'TFX'],
        placeholder: 'Chọn form factor',
      },
      {
        id: 'modular',
        label: 'Kiểu module dây',
        type: 'select',
        options: ['Fully Modular (tháo rời hoàn toàn)', 'Semi-Modular', 'Non-Modular (dây cố định)'],
        placeholder: 'Chọn kiểu module',
      },
    ],
    optionalFields: [
      {
        id: 'fanSize',
        label: 'Kích thước quạt',
        type: 'select',
        options: ['80mm', '120mm', '135mm', '140mm'],
        placeholder: 'Chọn kích thước quạt',
      },
    ],
  },
  'tan-nhiet': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'coolerType',
        label: 'Loại tản nhiệt',
        type: 'select',
        options: ['Tản nhiệt khí (Air Cooler)', 'Tản nhiệt nước AIO 120mm', 'Tản nhiệt nước AIO 240mm', 'Tản nhiệt nước AIO 280mm', 'Tản nhiệt nước AIO 360mm', 'Tản nhiệt tùy chỉnh (Custom Loop)'],
        placeholder: 'Chọn loại tản nhiệt',
      },
      {
        id: 'socketSupport',
        label: 'Socket hỗ trợ',
        type: 'text',
        placeholder: 'VD: Intel LGA1700/1200/1151, AMD AM5/AM4',
      },
      {
        id: 'tdp',
        label: 'TDP tối đa hỗ trợ',
        type: 'text',
        placeholder: 'VD: 250W, 320W',
      },
    ],
    optionalFields: [
      {
        id: 'hasRGB',
        label: 'Đèn RGB',
        type: 'select',
        options: ['Có đèn ARGB', 'Có đèn RGB đồng bộ', 'Không có đèn LED'],
        placeholder: 'Chọn',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 25. ROUTER WIFI / ACCESS POINT / MESH WIFI
  // ─────────────────────────────────────────────────────────
  'router-wifi': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'wifiStandard',
        label: 'Chuẩn WiFi',
        type: 'select',
        options: ['WiFi 5 (802.11ac)', 'WiFi 6 (802.11ax)', 'WiFi 6E (6GHz)', 'WiFi 7 (802.11be)'],
        placeholder: 'Chọn chuẩn WiFi',
      },
      {
        id: 'maxSpeed',
        label: 'Tốc độ WiFi tối đa',
        type: 'text',
        placeholder: 'VD: AC1200, AX3000, AX6000',
      },
      {
        id: 'bands',
        label: 'Băng tần',
        type: 'select',
        options: ['Single-band (2.4GHz)', 'Dual-band (2.4 + 5GHz)', 'Tri-band (2.4 + 5 + 5GHz)', 'Tri-band (2.4 + 5 + 6GHz)'],
        placeholder: 'Chọn băng tần',
      },
      {
        id: 'ports',
        label: 'Cổng mạng có dây',
        type: 'select',
        options: ['1x WAN + 2x LAN (100Mbps)', '1x WAN + 4x LAN (1Gbps)', '1x WAN + 4x LAN + 1x 2.5Gbps', '2x 2.5GbE + 4x GbE'],
        placeholder: 'Chọn cổng mạng',
      },
    ],
    optionalFields: [
      {
        id: 'antennas',
        label: 'Ăng-ten',
        type: 'text',
        placeholder: 'VD: 4 ăng-ten ngoài 5dBi',
      },
      {
        id: 'coverage',
        label: 'Phủ sóng',
        type: 'text',
        placeholder: 'VD: ~120m², ~300m²',
      },
    ],
  },
  'access-point': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'wifiStandard',
        label: 'Chuẩn WiFi',
        type: 'select',
        options: ['WiFi 5 (802.11ac)', 'WiFi 6 (802.11ax)', 'WiFi 6E', 'WiFi 7'],
        placeholder: 'Chọn chuẩn WiFi',
      },
      {
        id: 'maxSpeed',
        label: 'Tốc độ tối đa',
        type: 'text',
        placeholder: 'VD: AX3000, AX6000',
      },
      {
        id: 'poe',
        label: 'Hỗ trợ PoE',
        type: 'select',
        options: ['Có hỗ trợ PoE (802.3af/at)', 'Không hỗ trợ PoE (cần adapter nguồn)'],
        placeholder: 'Chọn',
      },
    ],
    optionalFields: [
      {
        id: 'mountType',
        label: 'Kiểu lắp đặt',
        type: 'select',
        options: ['Gắn trần', 'Gắn tường', 'Desktop', 'Gắn cột'],
        placeholder: 'Chọn cách lắp đặt',
      },
    ],
  },
  'mesh-wifi': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'wifiStandard',
        label: 'Chuẩn WiFi',
        type: 'select',
        options: ['WiFi 5 (802.11ac)', 'WiFi 6 (802.11ax)', 'WiFi 6E', 'WiFi 7'],
        placeholder: 'Chọn chuẩn WiFi',
      },
      {
        id: 'numNodes',
        label: 'Số node trong bộ',
        type: 'select',
        options: ['1 node', '2 nodes', '3 nodes', '4+ nodes'],
        placeholder: 'Chọn số node',
      },
      {
        id: 'coverage',
        label: 'Diện tích phủ sóng',
        type: 'text',
        placeholder: 'VD: ~300m² (2 node)',
      },
    ],
    optionalFields: [
      {
        id: 'backhaul',
        label: 'Kết nối giữa các node',
        type: 'select',
        options: ['Wireless Backhaul', 'Wired Ethernet Backhaul', 'Wireless + Có dây'],
        placeholder: 'Chọn',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 26. NETWORK SWITCH / KVM SWITCH
  // ─────────────────────────────────────────────────────────
  'network-switch': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'numPorts',
        label: 'Số cổng',
        type: 'select',
        options: ['4 cổng', '5 cổng', '8 cổng', '16 cổng', '24 cổng', '48 cổng'],
        placeholder: 'Chọn số cổng',
      },
      {
        id: 'portSpeed',
        label: 'Tốc độ cổng',
        type: 'select',
        options: ['Fast Ethernet (100Mbps)', 'Gigabit (1Gbps)', '2.5GbE', '10GbE'],
        placeholder: 'Chọn tốc độ cổng',
      },
      {
        id: 'managed',
        label: 'Loại switch',
        type: 'select',
        options: ['Unmanaged (cắm là chạy)', 'Smart Managed (cơ bản)', 'Fully Managed (đầy đủ tính năng)'],
        placeholder: 'Chọn loại switch',
      },
    ],
    optionalFields: [
      {
        id: 'poe',
        label: 'Hỗ trợ PoE',
        type: 'select',
        options: ['Không PoE', 'PoE (802.3af)', 'PoE+ (802.3at)', 'PoE++ (802.3bt)'],
        placeholder: 'Chọn',
      },
    ],
  },
  'kvm-switch': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'numPorts',
        label: 'Số máy tính điều khiển',
        type: 'select',
        options: ['2 cổng', '4 cổng', '8 cổng', '16 cổng'],
        placeholder: 'Chọn số cổng',
      },
      {
        id: 'connectionType',
        label: 'Kiểu kết nối',
        type: 'select',
        options: ['USB + VGA', 'USB + HDMI', 'USB + DisplayPort', 'USB-C (Thunderbolt)'],
        placeholder: 'Chọn kiểu kết nối',
      },
      {
        id: 'resolution',
        label: 'Độ phân giải hỗ trợ',
        type: 'select',
        options: ['Full HD 1080p', '2K QHD', '4K UHD', '8K'],
        placeholder: 'Chọn độ phân giải',
      },
    ],
    optionalFields: [],
  },

  // ─────────────────────────────────────────────────────────
  // 27. SMART TV / ANDROID TV / QLED / OLED
  // ─────────────────────────────────────────────────────────
  'android-tv': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'screenSize',
        label: 'Kích thước màn hình',
        type: 'select',
        options: ['32 inch', '40 - 43 inch', '50 inch', '55 inch', '65 inch', '75 inch', '85 inch+'],
        placeholder: 'Chọn kích thước',
      },
      {
        id: 'resolution',
        label: 'Độ phân giải',
        type: 'select',
        options: ['HD Ready (720p)', 'Full HD (1080p)', '4K UHD', '8K'],
        placeholder: 'Chọn độ phân giải',
      },
      {
        id: 'displayTech',
        label: 'Công nghệ màn hình',
        type: 'select',
        options: ['LED', 'QLED', 'NanoCell', 'Mini LED', 'OLED'],
        placeholder: 'Chọn công nghệ màn hình',
      },
      {
        id: 'os',
        label: 'Hệ điều hành',
        type: 'select',
        options: ['Android TV', 'Google TV', 'Tizen OS (Samsung)', 'webOS (LG)', 'Vidaa (Hisense)'],
        placeholder: 'Chọn hệ điều hành TV',
      },
      {
        id: 'refreshRate',
        label: 'Tần số quét',
        type: 'select',
        options: ['50Hz', '60Hz', '100Hz', '120Hz', '144Hz'],
        placeholder: 'Chọn tần số quét',
      },
    ],
    optionalFields: [
      {
        id: 'hdrSupport',
        label: 'Hỗ trợ HDR',
        type: 'select',
        options: ['HDR10', 'HDR10+', 'Dolby Vision', 'HLG', 'HDR10 + HLG', 'Dolby Vision + HDR10+'],
        placeholder: 'Chọn',
      },
      {
        id: 'voiceAssistant',
        label: 'Trợ lý ảo',
        type: 'select',
        options: ['Google Assistant', 'Amazon Alexa', 'Bixby (Samsung)', 'ThinQ AI (LG)', 'Tất cả'],
        placeholder: 'Chọn',
      },
    ],
  },
  'qled-tv': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'screenSize',
        label: 'Kích thước màn hình',
        type: 'select',
        options: ['43 inch', '50 inch', '55 inch', '65 inch', '75 inch', '85 inch', '98 inch'],
        placeholder: 'Chọn kích thước',
      },
      {
        id: 'resolution',
        label: 'Độ phân giải',
        type: 'select',
        options: ['4K UHD', '8K'],
        placeholder: 'Chọn độ phân giải',
      },
      {
        id: 'refreshRate',
        label: 'Tần số quét',
        type: 'select',
        options: ['60Hz', '100Hz', '120Hz', '144Hz'],
        placeholder: 'Chọn tần số quét',
      },
      {
        id: 'hdrSupport',
        label: 'Hỗ trợ HDR',
        type: 'select',
        options: ['HDR10', 'HDR10+', 'Dolby Vision IQ', 'Quantum HDR'],
        placeholder: 'Chọn',
      },
    ],
    optionalFields: [
      {
        id: 'os',
        label: 'Hệ điều hành TV',
        type: 'select',
        options: ['Tizen OS (Samsung)', 'webOS (LG)', 'Android TV', 'Google TV'],
        placeholder: 'Chọn HĐH',
      },
    ],
  },
  'oled-tv': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'screenSize',
        label: 'Kích thước màn hình',
        type: 'select',
        options: ['42 inch', '48 inch', '55 inch', '65 inch', '77 inch', '83 inch', '97 inch'],
        placeholder: 'Chọn kích thước',
      },
      {
        id: 'resolution',
        label: 'Độ phân giải',
        type: 'select',
        options: ['4K UHD', '8K'],
        placeholder: 'Chọn độ phân giải',
      },
      {
        id: 'oledType',
        label: 'Loại tấm OLED',
        type: 'select',
        options: ['OLED thường', 'OLED evo', 'QD-OLED', 'MLA OLED', 'WOLED'],
        placeholder: 'Chọn loại OLED',
      },
      {
        id: 'refreshRate',
        label: 'Tần số quét',
        type: 'select',
        options: ['60Hz', '100Hz', '120Hz', '144Hz'],
        placeholder: 'Chọn tần số quét',
      },
    ],
    optionalFields: [
      {
        id: 'hdrSupport',
        label: 'Hỗ trợ HDR',
        type: 'select',
        options: ['Dolby Vision IQ', 'HDR10+', 'HDR10', 'HLG', 'Tất cả'],
        placeholder: 'Chọn',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 28. ĐẦU PHÁT TRỰC TUYẾN (Streaming Devices)
  // ─────────────────────────────────────────────────────────
  'android-tv-box': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'os',
        label: 'Hệ điều hành',
        type: 'select',
        options: ['Android TV', 'Google TV', 'Android (AOSP)', 'HiOS'],
        placeholder: 'Chọn hệ điều hành',
      },
      {
        id: 'resolution',
        label: 'Độ phân giải xuất hình',
        type: 'select',
        options: ['HD 720p', 'Full HD 1080p', '4K UHD', '4K HDR'],
        placeholder: 'Chọn độ phân giải',
      },
      {
        id: 'chip',
        label: 'Chip xử lý',
        type: 'text',
        placeholder: 'VD: Amlogic S905X4 / Rockchip RK3318',
      },
      {
        id: 'ram',
        label: 'RAM',
        type: 'select',
        options: ['2GB', '4GB', '8GB'],
        placeholder: 'Chọn RAM',
      },
      {
        id: 'storage',
        label: 'Bộ nhớ trong',
        type: 'select',
        options: ['8GB', '16GB', '32GB', '64GB'],
        placeholder: 'Chọn bộ nhớ trong',
      },
    ],
    optionalFields: [
      {
        id: 'connectivity',
        label: 'Kết nối',
        type: 'text',
        placeholder: 'VD: WiFi 5, Bluetooth 5.0, Ethernet',
      },
    ],
  },
  'chromecast': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'resolution',
        label: 'Độ phân giải xuất hình',
        type: 'select',
        options: ['Full HD 1080p', '4K UHD', '4K + HDR'],
        placeholder: 'Chọn độ phân giải',
      },
      {
        id: 'wifiVersion',
        label: 'WiFi',
        type: 'select',
        options: ['WiFi 5 (802.11ac)', 'WiFi 6 (802.11ax)'],
        placeholder: 'Chọn phiên bản WiFi',
      },
    ],
    optionalFields: [],
  },
  'fire-stick': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'resolution',
        label: 'Độ phân giải xuất hình',
        type: 'select',
        options: ['Full HD 1080p', '4K UHD', '4K Max HDR'],
        placeholder: 'Chọn độ phân giải',
      },
      {
        id: 'voiceAssistant',
        label: 'Trợ lý ảo',
        type: 'select',
        options: ['Amazon Alexa', 'Amazon Alexa + Bên thứ ba'],
        placeholder: 'Chọn',
      },
    ],
    optionalFields: [],
  },

  // ─────────────────────────────────────────────────────────
  // 29. MÁY CHIẾU
  // ─────────────────────────────────────────────────────────
  'projector-mini': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'brightness',
        label: 'Độ sáng',
        type: 'select',
        options: ['Dưới 500 lumen', '500 - 1000 lumen', '1000 - 2000 lumen', 'Trên 2000 lumen'],
        placeholder: 'Chọn độ sáng',
      },
      {
        id: 'resolution',
        label: 'Độ phân giải',
        type: 'select',
        options: ['480p (854x480)', 'HD 720p', 'Full HD 1080p', '4K UHD'],
        placeholder: 'Chọn độ phân giải',
      },
      {
        id: 'lightSource',
        label: 'Nguồn sáng',
        type: 'select',
        options: ['LED', 'Laser', 'DLP LED', 'LCOS'],
        placeholder: 'Chọn nguồn sáng',
      },
      {
        id: 'hasBattery',
        label: 'Pin tích hợp',
        type: 'select',
        options: ['Có pin tích hợp', 'Không có pin (cắm điện)'],
        placeholder: 'Chọn',
      },
    ],
    optionalFields: [
      {
        id: 'connectivity',
        label: 'Kết nối',
        type: 'text',
        placeholder: 'VD: HDMI, USB, WiFi, Bluetooth, AUX',
      },
      {
        id: 'projectionSize',
        label: 'Kích thước hình chiếu tối đa',
        type: 'text',
        placeholder: 'VD: 100 inch',
      },
    ],
  },
  'projector-chuan': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'brightness',
        label: 'Độ sáng (ANSI lumen)',
        type: 'select',
        options: ['1000 - 2000 lumen', '2000 - 4000 lumen', '4000 - 6000 lumen', 'Trên 6000 lumen'],
        placeholder: 'Chọn độ sáng',
      },
      {
        id: 'resolution',
        label: 'Độ phân giải',
        type: 'select',
        options: ['HD 720p', 'Full HD 1080p', '2K WUXGA', '4K UHD'],
        placeholder: 'Chọn độ phân giải',
      },
      {
        id: 'lightSource',
        label: 'Nguồn sáng',
        type: 'select',
        options: ['Bóng đèn (Lamp)', 'LED', 'Laser', 'Laser-Phosphor'],
        placeholder: 'Chọn nguồn sáng',
      },
      {
        id: 'projectionRatio',
        label: 'Tỉ lệ chiếu',
        type: 'text',
        placeholder: 'VD: 1.47:1 ~ 1.77:1 (Short Throw)',
      },
    ],
    optionalFields: [
      {
        id: 'projectionSize',
        label: 'Kích thước hình chiếu tối đa',
        type: 'text',
        placeholder: 'VD: 300 inch',
      },
      {
        id: 'connectivity',
        label: 'Cổng kết nối',
        type: 'text',
        placeholder: 'VD: 2x HDMI, VGA, USB, LAN',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 30. CAMERA & NHIẾP ẢNH
  // ─────────────────────────────────────────────────────────
  'may-anh-compact': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'sensorResolution',
        label: 'Độ phân giải cảm biến',
        type: 'text',
        placeholder: 'VD: 20.1 MP',
      },
      {
        id: 'sensorType',
        label: 'Loại cảm biến',
        type: 'select',
        options: ['1/2.3"', '1/1.7"', '1" (One Inch)', 'APS-C', 'Full Frame'],
        placeholder: 'Chọn cảm biến',
      },
      {
        id: 'opticalZoom',
        label: 'Zoom quang học',
        type: 'text',
        placeholder: 'VD: 25x, 30x, 83x',
      },
      {
        id: 'videoResolution',
        label: 'Quay video',
        type: 'select',
        options: ['HD 720p', 'Full HD 1080p', '4K UHD', '4K 60fps', '8K'],
        placeholder: 'Chọn độ phân giải video',
      },
    ],
    optionalFields: [
      {
        id: 'hasWifi',
        label: 'WiFi / Bluetooth',
        type: 'select',
        options: ['Có WiFi + Bluetooth', 'Chỉ WiFi', 'Không có'],
        placeholder: 'Chọn',
      },
      {
        id: 'batteryLife',
        label: 'Số ảnh / lần sạc',
        type: 'text',
        placeholder: 'VD: ~300 ảnh',
      },
    ],
  },
  'may-anh-mirrorless': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'sensorResolution',
        label: 'Độ phân giải cảm biến',
        type: 'text',
        placeholder: 'VD: 24.2 MP, 61 MP',
      },
      {
        id: 'sensorSize',
        label: 'Kích thước cảm biến',
        type: 'select',
        options: ['APS-C (Crop)', 'Full Frame (35mm)', 'Micro Four Thirds (M4/3)', 'Medium Format'],
        placeholder: 'Chọn kích thước cảm biến',
      },
      {
        id: 'mountSystem',
        label: 'Ngàm ống kính',
        type: 'select',
        options: ['Sony E-Mount', 'Canon RF', 'Nikon Z', 'Fujifilm X', 'Fujifilm G (GFX)', 'Leica L-Mount', 'Panasonic L'],
        placeholder: 'Chọn ngàm ống kính',
      },
      {
        id: 'videoResolution',
        label: 'Quay video tối đa',
        type: 'select',
        options: ['Full HD 1080p / 60fps', '4K / 30fps', '4K / 60fps', '4K / 120fps', '6K', '8K'],
        placeholder: 'Chọn độ phân giải video',
      },
    ],
    optionalFields: [
      {
        id: 'stabilization',
        label: 'Chống rung',
        type: 'select',
        options: ['IBIS (In-Body Image Stabilization)', 'Chống rung ống kính (OIS)', 'Không có chống rung', 'IBIS + OIS kết hợp'],
        placeholder: 'Chọn loại chống rung',
      },
      {
        id: 'weather',
        label: 'Kháng bụi / nước',
        type: 'select',
        options: ['Có kháng bụi & nước', 'Không có'],
        placeholder: 'Chọn',
      },
    ],
  },
  'may-anh-dslr': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'sensorResolution',
        label: 'Độ phân giải cảm biến',
        type: 'text',
        placeholder: 'VD: 24.1 MP, 30.4 MP',
      },
      {
        id: 'sensorSize',
        label: 'Kích thước cảm biến',
        type: 'select',
        options: ['APS-C (Crop)', 'Full Frame (35mm)', 'APS-H'],
        placeholder: 'Chọn kích thước cảm biến',
      },
      {
        id: 'mountSystem',
        label: 'Ngàm ống kính',
        type: 'select',
        options: ['Canon EF / EF-S', 'Nikon F', 'Pentax K', 'Sony A (Alpha DSLR)'],
        placeholder: 'Chọn ngàm ống kính',
      },
      {
        id: 'videoResolution',
        label: 'Quay video tối đa',
        type: 'select',
        options: ['Full HD 1080p / 30fps', 'Full HD 1080p / 60fps', '4K / 30fps'],
        placeholder: 'Chọn',
      },
    ],
    optionalFields: [
      {
        id: 'continuousShooting',
        label: 'Tốc độ chụp liên tiếp',
        type: 'text',
        placeholder: 'VD: 10 fps',
      },
    ],
  },
  'camera-hanh-dong': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'videoResolution',
        label: 'Độ phân giải video tối đa',
        type: 'select',
        options: ['4K / 30fps', '4K / 60fps', '5.3K / 60fps', '8K', '1080p / 240fps (Slow Motion)'],
        placeholder: 'Chọn độ phân giải video',
      },
      {
        id: 'stabilization',
        label: 'Chống rung',
        type: 'select',
        options: ['HyperSmooth (GoPro)', 'RockSteady (DJI)', 'EIS (Electronic Image Stabilization)', 'Cơ học (Gimbal tích hợp)'],
        placeholder: 'Chọn loại chống rung',
      },
      {
        id: 'waterproof',
        label: 'Chống nước',
        type: 'select',
        options: ['Chống nước không cần vỏ (10m)', 'Cần vỏ chống nước', 'Không chống nước'],
        placeholder: 'Chọn',
      },
      {
        id: 'batteryLife',
        label: 'Thời lượng pin',
        type: 'text',
        placeholder: 'VD: 70 phút quay 4K/60fps',
      },
    ],
    optionalFields: [
      {
        id: 'touchscreen',
        label: 'Màn hình cảm ứng',
        type: 'select',
        options: ['Có màn hình cảm ứng', 'Không có màn hình', 'Màn hình không cảm ứng'],
        placeholder: 'Chọn',
      },
    ],
  },
  'drone': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'cameraResolution',
        label: 'Camera / Độ phân giải video',
        type: 'select',
        options: ['Không có camera', 'HD 720p', 'Full HD 1080p', '4K UHD', '4K / 60fps', '5.1K', '8K'],
        placeholder: 'Chọn camera',
      },
      {
        id: 'flightTime',
        label: 'Thời gian bay',
        type: 'text',
        placeholder: 'VD: 34 phút (DJI Mini 4 Pro)',
      },
      {
        id: 'maxRange',
        label: 'Tầm xa điều khiển',
        type: 'text',
        placeholder: 'VD: 10km, 15km, 20km',
      },
      {
        id: 'maxSpeed',
        label: 'Tốc độ tối đa',
        type: 'text',
        placeholder: 'VD: 54 km/h',
      },
    ],
    optionalFields: [
      {
        id: 'obstacleAvoidance',
        label: 'Tránh vật cản',
        type: 'select',
        options: ['Tránh vật cản 6 hướng', 'Tránh vật cản 3 hướng', 'Không có cảm biến tránh vật cản'],
        placeholder: 'Chọn',
      },
      {
        id: 'weight',
        label: 'Trọng lượng',
        type: 'text',
        placeholder: 'VD: 249g (dưới ngưỡng đăng ký bay)',
      },
    ],
  },
  'phu-kien-camera': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'accessoryType',
        label: 'Loại phụ kiện',
        type: 'select',
        options: ['Chân máy / Tripod', 'Gimbal / Chống rung', 'Túi máy ảnh', 'Pin & Sạc', 'Bộ lọc ống kính (Filter)', 'Cáp & Adapter', 'Đèn Flash / LED', 'Microphone máy ảnh'],
        placeholder: 'Chọn loại phụ kiện',
      },
      {
        id: 'compatibleBrand',
        label: 'Tương thích với',
        type: 'select',
        options: ['Đa năng (Universal)', 'Canon', 'Nikon', 'Sony', 'Fujifilm', 'DJI', 'GoPro'],
        placeholder: 'Chọn hãng tương thích',
      },
    ],
    optionalFields: [
      {
        id: 'material',
        label: 'Chất liệu',
        type: 'text',
        placeholder: 'VD: Nhôm, Carbon, Nhựa ABS...',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 31. CONSOLE / GAME
  // ─────────────────────────────────────────────────────────
  'console-tro-choi': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'platform',
        label: 'Nền tảng',
        type: 'select',
        options: ['PlayStation 5 (PS5)', 'PlayStation 4 (PS4)', 'Xbox Series X', 'Xbox Series S', 'Xbox One'],
        placeholder: 'Chọn nền tảng',
      },
      {
        id: 'storage',
        label: 'Bộ nhớ trong',
        type: 'select',
        options: ['500GB', '825GB (PS5)', '1TB', '2TB'],
        placeholder: 'Chọn bộ nhớ',
      },
      {
        id: 'version',
        label: 'Phiên bản',
        type: 'select',
        options: ['Phiên bản đĩa (Disc)', 'Phiên bản kỹ thuật số (Digital)', 'Phiên bản slim'],
        placeholder: 'Chọn phiên bản',
      },
    ],
    optionalFields: [
      {
        id: 'bundle',
        label: 'Gói đi kèm',
        type: 'select',
        options: ['Máy + tay cầm', 'Máy + tay cầm + game', 'Chỉ máy'],
        placeholder: 'Chọn gói',
      },
    ],
  },
  'console-cam-tay': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'platform',
        label: 'Nền tảng',
        type: 'select',
        options: ['Nintendo Switch', 'Nintendo Switch Lite', 'Nintendo Switch OLED', 'Steam Deck', 'PlayStation Portable (PSP)', 'PS Vita'],
        placeholder: 'Chọn nền tảng',
      },
      {
        id: 'storage',
        label: 'Bộ nhớ trong',
        type: 'select',
        options: ['32GB', '64GB', '256GB', '512GB', '1TB'],
        placeholder: 'Chọn bộ nhớ',
      },
      {
        id: 'batteryLife',
        label: 'Thời lượng pin',
        type: 'text',
        placeholder: 'VD: 4.5 - 9 giờ',
      },
    ],
    optionalFields: [],
  },
  'tro-choi-dien-tu': {
    requiredFields: [
      {
        id: 'platform',
        label: 'Nền tảng chơi',
        type: 'select',
        options: ['PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'PC (Steam)', 'PC + Console'],
        placeholder: 'Chọn nền tảng',
      },
    ],
    mainFields: [
      {
        id: 'genre',
        label: 'Thể loại game',
        type: 'select',
        options: ['Nhập vai (RPG)', 'Hành động (Action)', 'Bắn súng (FPS/TPS)', 'Thể thao', 'Racing', 'Phiêu lưu', 'Kinh dị (Horror)', 'Chiến thuật (Strategy)', 'Mô phỏng'],
        placeholder: 'Chọn thể loại',
      },
      {
        id: 'ageRating',
        label: 'Độ tuổi',
        type: 'select',
        options: ['Mọi lứa tuổi', 'E10+ (từ 10 tuổi)', 'Teen 13+', '17+ (Adults)', '18+ (Mature)'],
        placeholder: 'Chọn độ tuổi',
      },
      {
        id: 'gameFormat',
        label: 'Định dạng',
        type: 'select',
        options: ['Đĩa vật lý (Disc)', 'Mã kỹ thuật số (Digital Code)', 'Voucher / Gift Card'],
        placeholder: 'Chọn định dạng',
      },
    ],
    optionalFields: [
      {
        id: 'language',
        label: 'Ngôn ngữ',
        type: 'text',
        placeholder: 'VD: Tiếng Anh, có phụ đề Tiếng Việt',
      },
    ],
  },
  'phu-kien-console': {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'accessoryType',
        label: 'Loại phụ kiện',
        type: 'select',
        options: ['Tay cầm / Controller', 'Headset gaming', 'Ghế gaming', 'Bàn phím / Chuột gaming', 'Thẻ nhớ / Ổ cứng mở rộng', 'Dock / Đế sạc', 'Skin / Ốp bảo vệ console', 'Cáp HDMI / Display'],
        placeholder: 'Chọn loại phụ kiện',
      },
      {
        id: 'compatiblePlatform',
        label: 'Tương thích với',
        type: 'select',
        options: ['PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'PC', 'Đa nền tảng'],
        placeholder: 'Chọn nền tảng tương thích',
      },
    ],
    optionalFields: [
      {
        id: 'connectionType',
        label: 'Kết nối',
        type: 'select',
        options: ['Bluetooth', 'USB-A', 'USB-C', 'Wireless 2.4GHz', 'Có dây + Không dây'],
        placeholder: 'Chọn kiểu kết nối',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 32. FALLBACK (cho các danh mục chưa có schema riêng)
  // ─────────────────────────────────────────────────────────
  fallback: {
    requiredFields: [warrantyField, originCountryField],
    mainFields: [
      {
        id: 'material',
        label: 'Chất liệu',
        type: 'text',
        placeholder: 'Nhập chất liệu sản phẩm',
      },
    ],
    optionalFields: [
      {
        id: 'model',
        label: 'Model',
        type: 'text',
        placeholder: 'Nhập model sản phẩm',
      },
      {
        id: 'releaseYear',
        label: 'Năm sản xuất',
        type: 'text',
        placeholder: 'VD: 2024',
      },
    ],
  },
};

/**
 * Trả về schema thuộc tính cho một categoryId cụ thể.
 * Mọi ID đều ánh xạ trực tiếp vào khóa của SCHEMAS.
 * Nếu không tìm thấy, dùng fallback.
 */
export function getAttributeSchema(categoryId) {
  if (!categoryId) return null;

  // Ánh xạ alias cho các ID chia sẻ schema chung
  const ALIAS_MAP = {
    'qled-tv': 'qled-tv',
    'oled-tv': 'oled-tv',
    'android-tv': 'android-tv',
    'may-anh-compact': 'may-anh-compact',
    'may-anh-mirrorless': 'may-anh-mirrorless',
    'may-anh-dslr': 'may-anh-dslr',
    'camera-hanh-dong': 'camera-hanh-dong',
  };

  const key = ALIAS_MAP[categoryId] || categoryId;
  return SCHEMAS[key] || SCHEMAS.fallback;
}
