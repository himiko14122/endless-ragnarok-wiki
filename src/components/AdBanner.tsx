'use client';

import { useEffect, useRef, useState } from 'react';
import type { AdType, BannerSlot, NativeSlot } from '@/config/ads';
import { AD_SLOTS } from '@/config/ads';

export interface AdBannerProps {
  type?: AdType | '';
}

const HIJACK_GUARD = `
Object.defineProperty(window,'top',{get:function(){return window.self},configurable:true});
Object.defineProperty(window,'parent',{get:function(){return window.self},configurable:true});
Object.defineProperty(window,'frameElement',{get:function(){return null},configurable:true});
`.replace(/\n/g, '');

export default function AdBanner({ type }: AdBannerProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (!mounted || !type || type === 'native-banner' || !containerRef.current) return;
    const slot = AD_SLOTS[type] as BannerSlot;
    if (!slot) return;
    const iframe = document.createElement('iframe');
    iframe.src = slot.src;
    iframe.width = String(slot.width);
    iframe.height = String(slot.height);
    iframe.sandbox.add('allow-scripts');
    iframe.scrolling = 'no';
    iframe.style.border = 'none';
    iframe.style.maxWidth = '100%';
    iframe.title = `Ad: ${slot.type}`;
    containerRef.current.appendChild(iframe);
  }, [mounted, type]);

  useEffect(() => {
    if (!mounted || type !== 'native-banner' || !containerRef.current) return;
    const slot = AD_SLOTS['native-banner'] as NativeSlot;
    const container = containerRef.current;

    const guardScript = document.createElement('script');
    guardScript.textContent = HIJACK_GUARD;
    container.appendChild(guardScript);

    const div = document.createElement('div');
    div.id = slot.containerId;
    container.appendChild(div);

    const adScript = document.createElement('script');
    adScript.src = slot.scriptUrl;
    adScript.async = true;
    container.appendChild(adScript);
  }, [mounted, type]);

  if (!mounted) {
    if (type && type !== 'native-banner') {
      const slot = AD_SLOTS[type] as BannerSlot | undefined;
      if (slot) {
        return <div ref={containerRef} style={{ minHeight: slot.height }} className="flex justify-center" />;
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
