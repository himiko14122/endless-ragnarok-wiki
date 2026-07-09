const INDEXNOW_KEY = '4a8dd9b1bef346e8268e1e510d12ca61';
const HOST = 'endlessragnarokwiki.wiki';
const SEARCH_ENGINES = [
  'https://www.bing.com/indexnow',
  'https://api.indexnow.org/indexnow',
  'https://yandex.com/indexnow',
];

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const urls = body.urls;

    if (!Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ error: 'Provide a non-empty "urls" array' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (urls.length > 10000) {
      return new Response(JSON.stringify({ error: 'Maximum 10,000 URLs per request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    };

    const results = await Promise.allSettled(
      SEARCH_ENGINES.map((engine) =>
        fetch(engine, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      )
    );

    const summary = results.map((r, i) => ({
      engine: SEARCH_ENGINES[i],
      status: r.status === 'fulfilled' ? r.value.status : 'failed',
    }));

    return new Response(JSON.stringify({ ok: true, results: summary }), { headers: { 'Content-Type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestGet(context) {
  const baseUrl = `https://${HOST}`;
  const locales = ['en', 'de', 'uk', 'ja'];
  const categories = ['guides', 'tier-list', 'conflux', 'master-traits', 'characters', 'weapon-transcendence', 'summons', 'sigils', 'bosses', 'co-op', 'story-walkthrough', 'endgame', 'builds'];
  const allUrls = [];

  for (const locale of locales) {
    allUrls.push(`${baseUrl}/${locale === 'en' ? '' : locale}`);
    for (const cat of categories) {
      allUrls.push(`${baseUrl}/${locale === 'en' ? '' : locale + '/'}${cat}`);
    }
  }

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
    urlList: allUrls,
  };

  const results = await Promise.allSettled(
    SEARCH_ENGINES.map((engine) =>
      fetch(engine, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    )
  );

  const summary = results.map((r, i) => ({
    engine: SEARCH_ENGINES[i],
    status: r.status === 'fulfilled' ? r.value.status : 'failed',
  }));

  return new Response(JSON.stringify({ ok: true, submitted: allUrls.length, results: summary }), { headers: { 'Content-Type': 'application/json' } });
}
