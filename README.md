# ogstamp

Official Node/TypeScript client for [OG Stamp](https://ogstamp.com). One call returns a hosted Open Graph image. Credits never expire. PayPal, not a subscription.

```bash
npm install github:BenceBakos/ogstamp
```

Buy a key at https://ogstamp.com/pricing/ — Starter is $9 for 2,000 images.

## Production

```ts
import { OgStamp } from "ogstamp";

const og = new OgStamp({ apiKey: process.env.OGSTAMP_API_KEY });

// Stable URL for og:image. One credit. The key never appears in the HTML.
const card = await og.store({ title: "Ship social cards from an API", theme: "forest" });
// card.url  → https://ogstamp.com/i/….png
// card.html → <meta property="og:image" content="https://ogstamp.com/i/….png" />

// Same card, built from a page's own title, description, and favicon.
const fromPage = await og.storeFromUrl({ url: "https://example.com/blog/post" });
```

## Try before you buy

`render()` and `auto()` work without a key. Those PNGs are watermarked and capped at 10 per site per day. Use `store()` or `storeFromUrl()` for anything you put in `og:image`.

Check a page first: https://ogstamp.com/og-debugger/

## Links

- Pricing: https://ogstamp.com/pricing/
- Docs: https://ogstamp.com/docs/
- OpenAPI: https://ogstamp.com/openapi.json
- MCP: https://ogstamp.com/mcp — image tools need the same `api_key` and return a hosted URL
- n8n community node: https://github.com/BenceBakos/n8n-nodes-ogstamp

## License

MIT
