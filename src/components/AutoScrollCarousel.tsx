'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useEffect, useRef, useCallback, memo } from 'react'

type CarouselItem = {
  slug: string
  title: string
  description?: string
  image?: string
  path: string
  isNew?: boolean
}

type AutoScrollCarouselProps = {
  items: CarouselItem[]
  readMoreText: string
  title?: string
  speed?: number
  autoScroll?: boolean
  priorityCount?: number
}

const DRAG_THRESHOLD = 5

const CarouselCard = memo(function CarouselCard({
  item,
  idx,
  priorityCount,
  readMoreText,
}: {
  item: CarouselItem
  idx: number
  priorityCount: number
  readMoreText: string
}) {
  return (
    <Link
      href={item.path as any}
      className="flex-shrink-0 w-[220px] sm:w-[240px] lg:w-[260px] rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden group hover:border-[var(--color-accent)]/30 transition-all duration-200"
    >
      {item.image && (
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading={idx < priorityCount ? 'eager' : 'lazy'}
            decoding="async"
            priority={idx < priorityCount}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent" />
          {item.isNew && (
            <span className="absolute top-0 right-0 inline-flex items-center gap-1 px-3 py-1 text-xs font-black tracking-wide bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white rounded-bl-xl shadow-[0_4px_14px_rgba(220,38,38,0.5)] before:absolute before:inset-0 before:bg-white/10 before:rounded-bl-xl">
              <svg className="w-3 h-3 animate-spin" style={{animationDuration:'3s'}} viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/></svg>
              NEW
            </span>
          )}
        </div>
      )}
      <div className="p-4 relative">
        {!item.image && item.isNew && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-3 py-1 text-xs font-black tracking-wide bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white rounded-bl-xl shadow-[0_4px_14px_rgba(220,38,38,0.5)] before:absolute before:inset-0 before:bg-white/10 before:rounded-bl-xl">
              <svg className="w-3 h-3 animate-spin" style={{animationDuration:'3s'}} viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/></svg>
            NEW
          </span>
        )}
        <h3 className="font-bold text-sm mb-1 group-hover:text-[var(--color-accent)] transition-colors font-[var(--font-heading)]">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs text-[var(--color-text-muted)] line-clamp-3">{item.description}</p>
        )}
        <span className="text-xs font-semibold text-[var(--color-accent)] group-hover:underline mt-2 inline-block">
          {readMoreText} →
        </span>
      </div>
    </Link>
  )
})

export default function AutoScrollCarousel({ items, readMoreText, title, speed = 80, autoScroll = true, priorityCount = 0 }: AutoScrollCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const paused = useRef(false)
  const offScreen = useRef(false)
  const rafId = useRef(0)
  const offsetRef = useRef(0)
  const pointerDown = useRef(false)
  const isDragging = useRef(false)
  const wasDragged = useRef(false)
  const startX = useRef(0)
  const dragOffset = useRef(0)

  const animate = useCallback(() => {
    const el = trackRef.current
    if (!el) return

    const totalWidth = el.scrollWidth / 2
    const pxPerMs = totalWidth / (speed * 1000)
    let lastTime: number | null = null

    function step(now: number) {
      if (!paused.current && !offScreen.current && lastTime !== null && el && !isDragging.current) {
        const delta = now - lastTime
        offsetRef.current += pxPerMs * delta
        if (offsetRef.current >= totalWidth) offsetRef.current -= totalWidth
        el.style.transform = `translateX(-${offsetRef.current}px)`
      }
      lastTime = now
      rafId.current = requestAnimationFrame(step)
    }

    rafId.current = requestAnimationFrame(step)
  }, [speed])

  useEffect(() => {
    if (!autoScroll) return
    animate()
    return () => cancelAnimationFrame(rafId.current)
  }, [animate, autoScroll])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !autoScroll) return
    const observer = new IntersectionObserver(
      ([entry]) => { offScreen.current = !entry.isIntersecting },
      { rootMargin: '100px' }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [autoScroll])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onPointerDown = (e: PointerEvent) => {
      pointerDown.current = true
      isDragging.current = false
      wasDragged.current = false
      startX.current = e.clientX
      dragOffset.current = 0
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDown.current) return
      const delta = e.clientX - startX.current
      if (!isDragging.current && Math.abs(delta) > DRAG_THRESHOLD) {
        isDragging.current = true
        wasDragged.current = true
        container.style.cursor = 'grabbing'
        container.setPointerCapture(e.pointerId)
      }
      if (isDragging.current) {
        dragOffset.current = delta
        const el = trackRef.current
        if (el) {
          el.style.transform = `translateX(-${offsetRef.current - delta}px)`
        }
      }
    }

    const onPointerUp = () => {
      if (!pointerDown.current) return
      pointerDown.current = false
      container.style.cursor = 'grab'
      if (isDragging.current) {
        isDragging.current = false
        const el = trackRef.current
        if (el) {
          const totalWidth = el.scrollWidth / 2
          offsetRef.current -= dragOffset.current
          if (offsetRef.current < 0) offsetRef.current += totalWidth
          if (offsetRef.current >= totalWidth) offsetRef.current -= totalWidth
          el.style.transform = `translateX(-${offsetRef.current}px)`
        }
      }
    }

    const onClickCapture = (e: MouseEvent) => {
      if (wasDragged.current) {
        e.preventDefault()
        e.stopPropagation()
        wasDragged.current = false
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return
      e.preventDefault()
      const el = trackRef.current
      if (!el) return
      const totalWidth = el.scrollWidth / 2
      offsetRef.current += e.deltaX
      if (offsetRef.current < 0) offsetRef.current += totalWidth
      if (offsetRef.current >= totalWidth) offsetRef.current -= totalWidth
      el.style.transform = `translateX(-${offsetRef.current}px)`
    }

    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerup', onPointerUp)
    container.addEventListener('pointercancel', onPointerUp)
    container.addEventListener('click', onClickCapture, true)
    container.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('pointercancel', onPointerUp)
      container.removeEventListener('click', onClickCapture, true)
      container.removeEventListener('wheel', onWheel)
    }
  }, [])

  if (items.length === 0) return null

  const allItems = [...items, ...items]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {title && (
        <h2 className="text-2xl font-bold font-[var(--font-heading)] mb-6">{title}</h2>
      )}
      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-grab select-none"
        onMouseEnter={() => { paused.current = true }}
        onMouseLeave={() => { paused.current = false; pointerDown.current = false; isDragging.current = false }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />

        <div
          ref={trackRef}
          className="flex gap-3 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {allItems.map((item, idx) => (
            <CarouselCard
              key={`${item.slug}-${idx}`}
              item={item}
              idx={idx}
              priorityCount={priorityCount}
              readMoreText={readMoreText}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
