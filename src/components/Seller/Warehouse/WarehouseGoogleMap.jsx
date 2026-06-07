import { useCallback, useEffect, useRef, useState } from "react";
import { Check, MapPin, RotateCcw } from "lucide-react";
import { loadGoogleMaps } from "../../../lib/googleMapsLoader";
import { cn } from "../../../lib/utils";

const DEFAULT_CENTER = { lat: 16.047079, lng: 108.20623 };

function roundCoordinate(value) {
  return Number(Number(value).toFixed(6));
}

function createWarehousePinOverlay(google, map) {
  class WarehousePinOverlay extends google.maps.OverlayView {
    constructor() {
      super();
      this.position = null;
      this.element = document.createElement("div");
      this.element.style.cssText = [
        "position:absolute",
        "display:none",
        "width:34px",
        "height:42px",
        "transform:translate(-50%, -100%)",
        "pointer-events:none",
        "z-index:10",
      ].join(";");

      const pin = document.createElement("div");
      pin.style.cssText = [
        "position:absolute",
        "left:3px",
        "top:0",
        "width:28px",
        "height:28px",
        "border-radius:999px",
        "background:#f97316",
        "border:3px solid #fff",
        "box-shadow:0 8px 18px rgba(15, 23, 42, 0.28)",
      ].join(";");

      const dot = document.createElement("div");
      dot.style.cssText = [
        "position:absolute",
        "left:50%",
        "top:50%",
        "width:8px",
        "height:8px",
        "border-radius:999px",
        "background:#fff",
        "transform:translate(-50%, -50%)",
      ].join(";");

      const tail = document.createElement("div");
      tail.style.cssText = [
        "position:absolute",
        "left:13px",
        "top:24px",
        "width:8px",
        "height:14px",
        "background:#f97316",
        "clip-path:polygon(50% 100%, 0 0, 100% 0)",
        "filter:drop-shadow(0 7px 8px rgba(15, 23, 42, 0.18))",
      ].join(";");

      pin.appendChild(dot);
      this.element.appendChild(tail);
      this.element.appendChild(pin);
      this.setMap(map);
    }

    onAdd() {
      this.getPanes()?.overlayMouseTarget?.appendChild(this.element);
    }

    draw() {
      if (!this.position) return;

      const projection = this.getProjection();
      if (!projection) return;

      const pixel = projection.fromLatLngToDivPixel(
        new google.maps.LatLng(this.position.lat, this.position.lng),
      );
      if (!pixel) return;

      this.element.style.display = "block";
      this.element.style.left = `${pixel.x}px`;
      this.element.style.top = `${pixel.y}px`;
    }

    onRemove() {
      this.element.remove();
    }

    setPosition(position) {
      this.position = position;
      this.draw();
    }
  }

  return new WarehousePinOverlay();
}

export default function WarehouseGoogleMap({
  coordinates,
  mode = "manual",
  onLocationChange,
  className,
}) {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const pinOverlayRef = useRef(null);
  const mapsApiRef = useRef(null);
  const clickListenerRef = useRef(null);
  const mapErrorCheckTimeoutRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang tải Google Maps...");
  const [pendingPosition, setPendingPosition] = useState(null);

  const isMapMode = mode === "map";
  const isManualMode = mode === "manual";

  const setMarker = useCallback((position, shouldCenter = true) => {
    if (!mapRef.current || !mapsApiRef.current) return;

    if (!pinOverlayRef.current) {
      pinOverlayRef.current = createWarehousePinOverlay(
        mapsApiRef.current.google,
        mapRef.current,
      );
    }

    pinOverlayRef.current.setPosition(position);

    if (shouldCenter) {
      mapRef.current.setCenter(position);
      mapRef.current.setZoom(17);
    }
  }, []);

  const setMapInteraction = useCallback(() => {
    if (!mapRef.current) return;

    mapRef.current.setOptions({
      clickableIcons: isMapMode,
      disableDefaultUI: isManualMode,
      draggable: isMapMode,
      fullscreenControl: isMapMode,
      gestureHandling: isMapMode ? "auto" : "none",
      keyboardShortcuts: isMapMode,
      mapTypeControl: false,
      scrollwheel: isMapMode,
      streetViewControl: false,
      zoomControl: isMapMode,
    });
  }, [isManualMode, isMapMode]);

  useEffect(() => {
    let isMounted = true;
    const handleGoogleMapsError = (event) => {
      if (!isMounted) return;
      setStatus("error");
      setMessage(
        event.detail?.message ||
          "Google Maps chưa khả dụng. Kiểm tra lại API key và billing.",
      );
    };

    window.addEventListener("phatshop-google-maps-error", handleGoogleMapsError);

    loadGoogleMaps()
      .then((mapsApi) => {
        if (!isMounted || !mapElementRef.current) return;

        mapsApiRef.current = mapsApi;
        mapRef.current = new mapsApi.Map(mapElementRef.current, {
          center: coordinates?.isPinned
            ? { lat: coordinates.lat, lng: coordinates.lng }
            : DEFAULT_CENTER,
          zoom: coordinates?.isPinned ? 17 : 5,
          mapTypeControl: false,
          streetViewControl: false,
        });
        setMapInteraction();

        if (coordinates?.isPinned) {
          setMarker({
            lat: coordinates.lat,
            lng: coordinates.lng,
          });
        }

        setStatus("ready");
        setMessage(
          isMapMode
            ? "Di chuyển bản đồ rồi click vào vị trí kho."
            : "Bạn đang nhập địa chỉ thủ công. Bản đồ chỉ hiển thị tham khảo.",
        );

        mapErrorCheckTimeoutRef.current = setTimeout(() => {
          if (!isMounted || !mapElementRef.current) return;

          const mapErrorMessage = mapElementRef.current
            .querySelector(".gm-err-message")
            ?.textContent?.trim();
          if (!mapErrorMessage) return;

          window.__phatShopGoogleMapsDebug = {
            errorMessage: mapErrorMessage,
            friendlyMessage:
              "Google Maps báo API key/project chưa được phép hiển thị map trên trang này.",
            origin: window.location?.origin,
            timestamp: new Date().toISOString(),
          };
          setStatus("error");
          setMessage("Google Maps bị từ chối bởi API key/project.");
        }, 2200);
      })
      .catch((error) => {
        if (!isMounted) return;
        setStatus("error");
        setMessage(error.message || "Google Maps chưa khả dụng.");
      });

    return () => {
      isMounted = false;
      window.removeEventListener(
        "phatshop-google-maps-error",
        handleGoogleMapsError,
      );
      if (clickListenerRef.current) {
        clickListenerRef.current.remove();
      }
      if (mapErrorCheckTimeoutRef.current) {
        clearTimeout(mapErrorCheckTimeoutRef.current);
      }
      if (pinOverlayRef.current) {
        pinOverlayRef.current.setMap(null);
        pinOverlayRef.current = null;
      }
    };
  }, [
    coordinates?.isPinned,
    coordinates?.lat,
    coordinates?.lng,
    isMapMode,
    setMapInteraction,
    setMarker,
  ]);

  useEffect(() => {
    setMapInteraction();
    setPendingPosition(null);

    if (isManualMode) {
      setMessage("Bạn đang nhập địa chỉ thủ công. Bản đồ chỉ hiển thị tham khảo.");
      return;
    }

    setMessage(
      coordinates?.isPinned
        ? "Vị trí trên bản đồ đã được xác nhận."
        : "Di chuyển bản đồ rồi click vào vị trí kho.",
    );
  }, [coordinates?.isPinned, isManualMode, setMapInteraction]);

  useEffect(() => {
    if (!mapRef.current || !isMapMode) return undefined;

    if (clickListenerRef.current) {
      clickListenerRef.current.remove();
    }

    clickListenerRef.current = mapRef.current.addListener("click", (event) => {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      setMarker(position, false);
      setPendingPosition(position);
      setStatus("confirming");
      setMessage("Bạn đồng ý với vị trí này chứ?");
    });

    return () => {
      if (clickListenerRef.current) {
        clickListenerRef.current.remove();
        clickListenerRef.current = null;
      }
    };
  }, [isMapMode, setMarker]);

  useEffect(() => {
    if (!mapRef.current || !coordinates?.isPinned) return;
    setMarker(
      {
        lat: coordinates.lat,
        lng: coordinates.lng,
      },
      false,
    );
  }, [coordinates?.isPinned, coordinates?.lat, coordinates?.lng, setMarker]);

  const handleConfirmPosition = () => {
    if (!pendingPosition) return;

    const nextLocation = {
      lat: roundCoordinate(pendingPosition.lat),
      lng: roundCoordinate(pendingPosition.lng),
      isPinned: true,
    };

    onLocationChange(nextLocation);
    setStatus("ready");
    setMessage("Đã xác nhận vị trí kho trên bản đồ.");
  };

  const handleResetPosition = () => {
    setPendingPosition(null);
    setStatus("ready");
    setMessage("Di chuyển bản đồ rồi click vào vị trí kho.");
    onLocationChange({ isPinned: false });
  };

  const isLoading = status === "loading";
  const hasWarning = status === "error";
  const shouldDimMap = isManualMode || hasWarning;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-stone-200 bg-stone-50",
        className,
      )}
    >
      <div className="relative h-64 w-full bg-stone-100">
        <div
          ref={mapElementRef}
          className={cn(
            "h-full w-full transition duration-200",
            shouldDimMap && "pointer-events-none opacity-35 grayscale",
          )}
        />

        {isManualMode && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/35 p-4 text-center backdrop-blur-[1px]">
            <div className="rounded-lg bg-white/90 px-4 py-3 text-xs font-bold leading-5 text-stone-600 shadow-sm">
              Nhập thủ công đang bật. Bản đồ chỉ dùng để tham khảo.
            </div>
          </div>
        )}

        {hasWarning && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/82 p-4 text-center backdrop-blur-sm">
            <div>
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <MapPin className="h-5 w-5" />
              </span>
              <p className="mt-3 max-w-sm text-xs font-extrabold leading-5 text-amber-700">
                {message}
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/86 p-4 text-center backdrop-blur-sm">
            <div>
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <MapPin className="h-5 w-5" />
              </span>
              <p className="mt-3 max-w-sm text-xs font-extrabold leading-5 text-stone-700">
                {message}
              </p>
            </div>
          </div>
        )}

        {isMapMode && pendingPosition && status === "confirming" && (
          <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-white/95 p-3 shadow-lg ring-1 ring-stone-200 backdrop-blur">
            <p className="text-xs font-extrabold text-stone-800">
              Bạn đồng ý với vị trí này chứ?
            </p>
            <p className="mt-1 text-[11px] font-bold text-stone-500">
              {roundCoordinate(pendingPosition.lat)},{" "}
              {roundCoordinate(pendingPosition.lng)}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleConfirmPosition}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white transition hover:bg-emerald-700"
              >
                <Check className="h-4 w-4" />
                Đồng ý
              </button>
              <button
                type="button"
                onClick={handleResetPosition}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-extrabold text-stone-600 transition hover:bg-stone-50"
              >
                <RotateCcw className="h-4 w-4" />
                Chọn lại
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-stone-200 bg-white px-3 py-2">
        <p
          className={cn(
            "text-[11px] font-bold leading-5",
            hasWarning ? "text-amber-700" : "text-stone-500",
          )}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
