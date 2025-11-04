"use client";

import { useCallback, useState } from "react";

export function usePagePrint() {
  const [isLoading, setIsLoading] = useState(false);

  const printPage = useCallback((pageUrl: string) => {
    setIsLoading(true);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `${pageUrl}?print=true`; // ✅ append print flag

    document.body.appendChild(iframe);

    iframe.onload = () => {
      // Wait for the internal page to handle printing itself
      iframe.contentWindow?.addEventListener("afterprint", () => {
        iframe.remove();
        setIsLoading(false);
      });
    };
  }, []);

  return { isLoading, printPage };
}
