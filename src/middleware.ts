import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!_next|api|ads|images|favicon\\.ico|favicon\\.svg|favicon-96x96|apple-touch-icon|robots\\.txt|sitemap).*)'],
};
