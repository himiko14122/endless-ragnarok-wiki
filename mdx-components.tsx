import React from 'react';
import { slugifyHeading } from '@/lib/content';

type MDXComponents = Record<string, React.ComponentType<Record<string, unknown>>>;

function HeadingWithId({ level, children, ...props }: { level: number; children?: React.ReactNode } & Record<string, unknown>) {
  const text = typeof children === 'string' ? children : React.Children.toArray(children).map((c) => (typeof c === 'string' ? c : '')).join('');
  const id = slugifyHeading(text) || `h-${level}`;
  const Tag = `h${level}` as React.ElementType;
  return React.createElement(Tag, { id, ...props }, children);
}

/* Wrap tables in a scrollable container — allows horizontal scroll on narrow screens */
function TableWrapper({ children, ...props }: Record<string, unknown>) {
  return React.createElement(
    'div',
    { className: 'mdx-table-wrap' },
    React.createElement('table', props, children as React.ReactNode)
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h2: (props: Record<string, unknown>) => React.createElement(HeadingWithId, { level: 2, ...props }),
    h3: (props: Record<string, unknown>) => React.createElement(HeadingWithId, { level: 3, ...props }),
    h4: (props: Record<string, unknown>) => React.createElement(HeadingWithId, { level: 4, ...props }),
    table: (props: Record<string, unknown>) => React.createElement(TableWrapper, props),
  };
}
