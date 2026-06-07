import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let googleMapsPromise;
let googleMapsOptionsSet = false;
let googleMapsAuthFailurePatched = false;

function getGoogleMapsApiKey() {
  return process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";
}

function getFriendlyGoogleMapsError(message) {
  if (/authentication failed|permission denied/i.test(String(message || ""))) {
    return "Google Maps báo API key bị từ chối. Kiểm tra lại Website restrictions, API restrictions và billing của project.";
  }

  const errorCode = String(message || "").match(
    /Google Maps JavaScript API error:\s*([A-Za-z]+)/,
  )?.[1];

  const errorMessages = {
    ApiNotActivatedMapError:
      "Google Maps báo Maps JavaScript API chưa được bật cho key/project này.",
    BillingNotEnabledMapError:
      "Google Maps báo project của key này chưa bật billing.",
    ClientBillingNotEnabledMapError:
      "Google Maps báo billing chưa active cho project của key này.",
    RefererNotAllowedMapError:
      "Google Maps báo domain/localhost hiện tại chưa nằm trong Website restrictions của API key.",
    ApiTargetBlockedMapError:
      "Google Maps báo API restrictions của key chưa cho phép Maps JavaScript API.",
    InvalidKeyMapError:
      "Google Maps báo API key không hợp lệ.",
    DeletedApiProjectMapError:
      "Google Maps báo project chứa API key đã bị xóa hoặc không khả dụng.",
    ProjectDeniedMapError:
      "Google Maps báo project chứa API key đang bị từ chối truy cập.",
  };

  return errorMessages[errorCode] || String(message || "Google Maps bị lỗi cấu hình.");
}

function setGoogleMapsDebug(message) {
  window.__phatShopGoogleMapsDebug = {
    errorMessage: String(message || ""),
    friendlyMessage: getFriendlyGoogleMapsError(message),
    origin: window.location?.origin,
    timestamp: new Date().toISOString(),
  };
}

function dispatchGoogleMapsError(message) {
  setGoogleMapsDebug(message);
  window.dispatchEvent(
    new CustomEvent("phatshop-google-maps-error", {
      detail: {
        message: getFriendlyGoogleMapsError(message),
        rawMessage: String(message || ""),
      },
    }),
  );
}

function patchGoogleMapsAuthFailure() {
  if (googleMapsAuthFailurePatched) return;
  googleMapsAuthFailurePatched = true;

  const previousAuthFailure = window.gm_authFailure;
  window.gm_authFailure = () => {
    if (typeof previousAuthFailure === "function") {
      previousAuthFailure();
    }

    dispatchGoogleMapsError("Google Maps JavaScript API authentication failed.");
  };
}

function stringifyConsoleArg(arg) {
  if (typeof arg === "string") return arg;
  if (arg?.message) return arg.message;

  try {
    return JSON.stringify(arg) || String(arg);
  } catch {
    return String(arg);
  }
}

function patchGoogleMapsConsoleError() {
  if (window.__phatShopGoogleMapsConsolePatched) return;
  window.__phatShopGoogleMapsConsolePatched = true;

  const originalConsoleError = window.console?.error;
  if (!originalConsoleError) return;

  window.console.error = (...args) => {
    const text = args.map(stringifyConsoleArg).join(" ");

    if (
      text.includes("Google Maps JavaScript API error:") ||
      /permission denied/i.test(text) ||
      /This page didn't load Google Maps correctly/i.test(text)
    ) {
      dispatchGoogleMapsError(text);
    }

    originalConsoleError.apply(window.console, args);
  };
}

async function importGoogleMapsLibraries(apiKey) {
  if (!googleMapsOptionsSet) {
    setOptions({
      key: apiKey,
      v: "weekly",
      language: "vi",
      region: "VN",
    });
    googleMapsOptionsSet = true;
  }

  const mapsLibrary = await importLibrary("maps");

  return {
    google: window.google,
    Map: mapsLibrary.Map || window.google?.maps?.Map,
    OverlayView: mapsLibrary.OverlayView || window.google?.maps?.OverlayView,
  };
}

export function loadGoogleMaps() {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return Promise.reject(
      new Error("Thiếu REACT_APP_GOOGLE_MAPS_API_KEY trong file .env."),
    );
  }

  patchGoogleMapsConsoleError();
  patchGoogleMapsAuthFailure();

  googleMapsPromise = importGoogleMapsLibraries(apiKey).catch((error) => {
    googleMapsPromise = undefined;
    const message = getFriendlyGoogleMapsError(error.message);
    setGoogleMapsDebug(error.message);
    throw new Error(message);
  });

  return googleMapsPromise;
}
