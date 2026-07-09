'use client';

import { useEffect, useRef, useState } from 'react';
import type { AdType, BannerSlot, NativeSlot } from '@/config/ads';
import { AD_SLOTS } from '@/config/ads';

export interface AdBannerProps {
  type?: AdType | '';
}

export default function AdBanner({ type }: AdBannerProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (!mounted || !type || !containerRef.current) return;
    const slot = AD_SLOTS[type];
    if (!slot) return;

    const iframe = document.createElement('iframe');
    if (slot.type === 'native-banner') {
      const nativeSlot = slot as NativeSlot;
      iframe.srcdoc = `<!DOCTYPE html><html><head><script>Object.defineProperty(window,'top',{get:function(){return window.self}});Object.defineProperty(window,'parent',{get:function(){return window.self}});Object.defineProperty(window,'frameElement',{get:function(){return null}});(function(){var oP=history.pushState,oR=history.replaceState;history.pushState=function(){return oP.apply(this,arguments)};history.replaceState=function(){return oR.apply(this,arguments)}})();</script></head><body style="margin:0"><div id="${nativeSlot.containerId}"></div><script src="${nativeSlot.scriptUrl}" async></script></body></html>`;
      iframe.style.width = '100%';
      iframe.style.minHeight = '120px';
    } else {
      const bannerSlot = slot as BannerSlot;
      iframe.src = bannerSlot.src;
      iframe.width = String(bannerSlot.width);
      iframe.height = String(bannerSlot.height);
    }
    iframe.sandbox.add('allow-scripts');
    iframe.scrolling = 'no';
    iframe.style.border = 'none';
    iframe.style.maxWidth = '100%';
    iframe.title = `Ad: ${slot.type}`;
    containerRef.current.appendChild(iframe);
  }, [mounted, type]);

  if (!mounted) {
    if (type) {
      const slot = AD_SLOTS[type];
      if (slot && slot.type !== 'native-banner') {
        const bannerSlot = slot as BannerSlot;
        return <div ref={containerRef} style={{ minHeight: bannerSlot.height }} className="flex justify-center" />;
      }
    }
    return null;
  }

  if (!type) return null;

  const slot = AD_SLOTS[type];
  if (!slot) return null;

  return (
    <div ref={containerRef} className="flex justify-center" />
  );
}
