# OG Stamp

https://ogstamp.com — pay-as-you-go Open Graph image API for coding agents.

Remote MCP server that renders **1200×630** social cards. Credits never expire. PayPal checkout, no subscription.

## Connect (Cursor / Claude / any MCP client)

```json
{
  "mcpServers": {
    "ogstamp": {
      "url": "https://ogstamp.com/mcp"
    }
  }
}
```

Or open https://ogstamp.com/for-ai-agents/

## Tools

| Tool | What it does |
|------|----------------|
| `render_og_image` | Returns a public PNG URL for `title` / `subtitle` / `theme` |
| `og_pricing` | Returns forever-credit pack prices |

Themes: `midnight`, `paper`, `forest`, `coral`, `slate`.

## Example

```bash
curl -s -X POST https://ogstamp.com/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"render_og_image","arguments":{"title":"Ship it","theme":"coral"}}}'
```

Free tier: 30 renders / IP / day. Production: buy credits at https://ogstamp.com/pricing/ and `POST https://ogstamp.com/api/og` with `Authorization: Bearer ogs_…`.

## Machine-readable

- Brief: https://ogstamp.com/llms.txt
- Full: https://ogstamp.com/llms-full.txt
- OpenAPI: https://ogstamp.com/openapi.json
- MCP card: https://ogstamp.com/.well-known/mcp.json

## Why this exists

Bannerbear / Placid / Templated sell monthly template studios. OG Stamp sells **one-time forever credits** for title-based OG cards — the job most agents and indie apps actually need.

## License

MIT
