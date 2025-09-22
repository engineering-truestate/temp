import { useEffect } from "react";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

export function useTrackUTMParams() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmParams = {
      source: params.get("utm_source"),
      medium: params.get("utm_medium"),
      campaign: params.get("utm_campaign"),
      term: params.get("utm_term"),
      content: params.get("utm_content"),
    };
    console.log(utmParams);

    const hasUTM = Object.values(utmParams).some((v) => v !== null);
    if (hasUTM) {
      logEvent(analytics, "campaign_tracking", utmParams);
      localStorage.setItem("utm_params", JSON.stringify(utmParams));
    }
  }, []);
}
