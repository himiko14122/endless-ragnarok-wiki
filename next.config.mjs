import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

function rehypeUndisableCheckboxes() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element') {
        if (node.tagName === 'input' && node.properties?.type === 'checkbox') {
          delete node.properties.disabled;
        }
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeUndisableCheckboxes],
  },
});

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(withMDX(nextConfig));
