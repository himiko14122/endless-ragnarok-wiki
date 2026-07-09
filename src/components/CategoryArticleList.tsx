import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import type { LoadedContent } from '@/lib/content';

type CategoryArticleListProps = {
  items: LoadedContent[];
  title: string;
  readMoreLabel: string;
  emptyLabel?: string;
};

export default function CategoryArticleList({ items, title, readMoreLabel, emptyLabel }: CategoryArticleListProps) {
  if (items.length === 0) {
    if (!emptyLabel) return null;
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 font-[var(--font-heading)]">{title}</h2>
        <p className="text-[var(--color-text-muted)] text-sm">{emptyLabel}</p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 font-[var(--font-heading)]">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const itemTitle = item.metadata.title || item.slug;
          return (
            <Link
              key={item.slug}
              href={item.path}
              className="rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden group hover:border-[var(--color-accent)] transition-all duration-200"
            >
              {item.metadata.image && (
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image src={item.metadata.image} alt={item.metadata.title || ''} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-bold mb-2 group-hover:text-[var(--color-accent)] transition-colors font-[var(--font-heading)]">
                  {itemTitle}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-3 line-clamp-3 leading-relaxed">
                  {item.metadata.description}
                </p>
                <span className="text-sm font-semibold text-[var(--color-accent)] group-hover:underline">
                  {readMoreLabel} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
