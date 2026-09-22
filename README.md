# ogstamp

Official Node/TypeScript client for [OG Stamp](https://ogstamp.com) — pay-as-you-go Open Graph image API.

```bash
npm install ogstamp
# until npm publish: npm install github:BenceBakos/ogstamp
```

## Quick start

```ts
import { OgStamp } from "ogstamp";

const og = new OgStamp({ apiKey: process.env.OGSTAMP_API_KEY }); // optional for free tier

// PNG buffer from title
const png = await og.render({ title: "Ship social cards from an API" });

// Or stamp a live page (auto theme from site colors)
const auto = await og.auto("https://example.com/blog/post");

// Debug what crawlers see
const peek = await og.peek("https://example.com/blog/post");
console.log(peek.title, peek.image);

// Credit packs
const packs = await og.packs();
```

## Free tier

No key required for light use. Free renders are watermarked and metered per site. Buy credit packs on [ogstamp.com/pricing](https://ogstamp.com/pricing/) when you need volume.

## Links

- Docs: https://ogstamp.com/docs/
- OpenAPI: https://ogstamp.com/openapi.json
- Debugger: https://ogstamp.com/og-debugger/
- GitHub: https://github.com/BenceBakos/ogstamp

## License

MIT

## Integrations

- n8n community node: https://github.com/BenceBakos/n8n-nodes-ogstamp
- WordPress plugin: in review on wordpress.org (`og-stamp`)
- MCP: https://ogstamp.com/mcp
