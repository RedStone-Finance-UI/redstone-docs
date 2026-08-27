import React, { useEffect, useState } from "react";

const TVS_ENDPOINT = "https://client-tvs.a.redstone.finance/tvs-sum";
const FALLBACK_TEXT = "billions of dollars";

function formatTvs(amount) {
  return `$${(amount / 1_000_000_000).toFixed(2)}B+`;
}

// Renders the live total value secured by RedStone, falling back to static
// text if the client-tvs API is unreachable or still loading (avoids a
// hydration mismatch since the server-rendered markup matches this fallback).
export default function TotalValueSecured() {
  const [label, setLabel] = useState(FALLBACK_TEXT);

  useEffect(() => {
    let cancelled = false;

    fetch(TVS_ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error(`Unexpected status ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const amount = Number(text);
        if (!cancelled && Number.isFinite(amount) && amount > 0) {
          setLabel(formatTvs(amount));
        }
      })
      .catch(() => {
        // Keep the static fallback text.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <>{label}</>;
}
