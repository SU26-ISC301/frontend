import { useEffect, useRef, useState } from "react";

const MAP_CENTER = { lat: 10.762622, lng: 106.660172 };

function getKeyHint(apiKey) {
  if (!apiKey) return "missing";
  return `...${apiKey.slice(-4)}`;
}

export default function GoogleMapDebug() {
  const mapRef = useRef(null);
  const [status, setStatus] = useState("Đang tải Google Maps...");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";
    const origin = window.location.origin;

    setDetails({
      key: getKeyHint(apiKey),
      origin,
      referrer: window.location.href,
    });

    if (!apiKey) {
      setStatus("Thiếu REACT_APP_GOOGLE_MAPS_API_KEY trong .env.");
      return undefined;
    }

    const callbackName = "__phatShopMinimalGoogleMapReady";
    const previousAuthFailure = window.gm_authFailure;

    window.gm_authFailure = () => {
      if (typeof previousAuthFailure === "function") {
        previousAuthFailure();
      }
      setStatus(
        "Google Cloud từ chối API key. Kiểm tra billing, Website restrictions và Maps JavaScript API.",
      );
    };

    window[callbackName] = () => {
      if (!mapRef.current || !window.google?.maps?.Map) {
        setStatus("Google Maps script đã tải nhưng không tìm thấy Map class.");
        return;
      }

      const map = new window.google.maps.Map(mapRef.current, {
        center: MAP_CENTER,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      map.addListener("tilesloaded", () => {
        setStatus("Google Map đã tải thành công trong project.");
      });

      setStatus("Google Maps script đã tải, đang chờ tile map...");
    };

    const existingScript = document.querySelector(
      'script[data-phatshop-minimal-google-map="true"]',
    );

    if (existingScript) {
      window[callbackName]();
      return undefined;
    }

    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: apiKey,
      callback: callbackName,
      language: "vi",
      region: "VN",
      v: "weekly",
    });

    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.dataset.phatshopMinimalGoogleMap = "true";
    script.onerror = () => {
      setStatus("Không tải được script Google Maps từ maps.googleapis.com.");
    };
    document.head.appendChild(script);

    return () => {
      window.gm_authFailure = previousAuthFailure;
      delete window[callbackName];
    };
  }, []);

  return (
    <main className="min-h-screen bg-stone-50 p-6 text-stone-900">
      <section className="mx-auto max-w-5xl space-y-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
            Google Maps debug
          </p>
          <h1 className="mt-1 text-2xl font-extrabold">
            Test Google Map tối giản
          </h1>
          <p className="mt-2 text-sm font-medium text-stone-600">
            Route này chỉ inject Google Maps script và tạo một map cơ bản, không
            dùng component kho hàng.
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-extrabold text-stone-800">{status}</p>
          {details && (
            <div className="mt-3 grid gap-2 text-xs font-bold text-stone-500 sm:grid-cols-3">
              <span>Key: {details.key}</span>
              <span>Origin: {details.origin}</span>
              <span className="truncate">URL: {details.referrer}</span>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <div ref={mapRef} className="h-[520px] w-full bg-stone-100" />
        </div>
      </section>
    </main>
  );
}
