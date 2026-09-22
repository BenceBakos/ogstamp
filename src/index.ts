export type OgStampOptions = {
  /** Base API origin. Default https://ogstamp.com */
  baseUrl?: string;
  /** API key from https://ogstamp.com/pricing/ (ogs_…) */
  apiKey?: string;
};

export type RenderInput = {
  title: string;
  subtitle?: string;
  badge?: string;
  theme?: "midnight" | "paper" | "forest" | "coral" | "slate" | string;
  layout?: "classic" | "center" | "split" | "minimal" | "quote" | "terminal" | string;
  font?: string;
  size?: "og" | "linkedin" | "square" | "story" | "wide" | string;
  logo_url?: string;
  bg?: string;
  fg?: string;
  accent?: string;
  site?: string;
};

export type AutoInput = {
  url: string;
  theme?: string;
  layout?: string;
  font?: string;
  size?: string;
  title?: string;
  subtitle?: string;
};

export type Credits = {
  key_prefix: string;
  credits: number;
  email?: string | null;
  created_at?: string;
  last_used_at?: string | null;
};

export type Pack = {
  id: string;
  name: string;
  credits: number;
  price: string;
  label: string;
};

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/$/, "")}${path}`;
}

export type HostedImage = {
  ok: true;
  url: string;
  id: string;
  credits: number;
  content_type: string;
  html: string;
};

/**
 * Minimal OG Stamp HTTP client.
 * Prefer Authorization headers — query-string api_key is rejected by the API.
 */
export class OgStamp {
  readonly baseUrl: string;
  readonly apiKey?: string;

  constructor(opts: OgStampOptions = {}) {
    this.baseUrl = opts.baseUrl || "https://ogstamp.com";
    this.apiKey = opts.apiKey;
  }

  private authHeaders(): Record<string, string> {
    if (!this.apiKey) return {};
    return { Authorization: `Bearer ${this.apiKey}` };
  }

  /** Render a card; returns PNG bytes. Paid key recommended for production. */
  async render(input: RenderInput): Promise<Uint8Array> {
    const res = await fetch(joinUrl(this.baseUrl, "/api/og"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "image/png",
        ...this.authHeaders(),
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OG Stamp render failed (${res.status}): ${text.slice(0, 240)}`);
    }
    return new Uint8Array(await res.arrayBuffer());
  }

  /**
   * Render and host the PNG on ogstamp.com. Returns a stable public URL for og:image
   * (opaque /i/{id}.png — no API key in HTML). Requires apiKey.
   */
  async store(input: RenderInput): Promise<HostedImage> {
    if (!this.apiKey) throw new Error("apiKey required for store()");
    const res = await fetch(joinUrl(this.baseUrl, "/api/og?store=1&format=json"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...this.authHeaders(),
      },
      body: JSON.stringify({ ...input, store: true }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OG Stamp store failed (${res.status}): ${text.slice(0, 240)}`);
    }
    return (await res.json()) as HostedImage;
  }

  /** Build a card from a public page URL (title/description/favicon). */
  async renderFromUrl(input: AutoInput): Promise<Uint8Array> {
    const u = new URL(joinUrl(this.baseUrl, "/api/auto"));
    for (const [k, v] of Object.entries(input)) {
      if (v != null && v !== "") u.searchParams.set(k, String(v));
    }
    const res = await fetch(u, {
      headers: { Accept: "image/png", ...this.authHeaders() },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OG Stamp auto failed (${res.status}): ${text.slice(0, 240)}`);
    }
    return new Uint8Array(await res.arrayBuffer());
  }

  /** Host a card built from a public page URL. Requires apiKey. */
  async storeFromUrl(input: AutoInput): Promise<HostedImage> {
    if (!this.apiKey) throw new Error("apiKey required for storeFromUrl()");
    const u = new URL(joinUrl(this.baseUrl, "/api/auto"));
    for (const [k, v] of Object.entries(input)) {
      if (v != null && v !== "") u.searchParams.set(k, String(v));
    }
    u.searchParams.set("store", "1");
    u.searchParams.set("format", "json");
    const res = await fetch(u, {
      headers: { Accept: "application/json", ...this.authHeaders() },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OG Stamp storeFromUrl failed (${res.status}): ${text.slice(0, 240)}`);
    }
    return (await res.json()) as HostedImage;
  }

  /** Alias for renderFromUrl — accepts AutoInput or a URL string. */
  auto(input: AutoInput | string): Promise<Uint8Array> {
    return this.renderFromUrl(typeof input === "string" ? { url: input } : input);
  }

  async credits(): Promise<Credits> {
    if (!this.apiKey) throw new Error("apiKey required for credits()");
    const res = await fetch(joinUrl(this.baseUrl, "/api/credits"), {
      headers: this.authHeaders(),
    });
    if (!res.ok) throw new Error(`credits failed (${res.status})`);
    return (await res.json()) as Credits;
  }

  async packs(): Promise<Record<string, Pack>> {
    const res = await fetch(joinUrl(this.baseUrl, "/api/packs"));
    if (!res.ok) throw new Error(`packs failed (${res.status})`);
    const data = (await res.json()) as { packs: Record<string, Pack> };
    return data.packs;
  }

  /** Free debugger: read Open Graph meta for a URL (no render). */
  async peek(url: string): Promise<Record<string, unknown>> {
    const u = new URL(joinUrl(this.baseUrl, "/api/peek"));
    u.searchParams.set("url", url);
    const res = await fetch(u);
    if (!res.ok) throw new Error(`peek failed (${res.status})`);
    return (await res.json()) as Record<string, unknown>;
  }
}

export default OgStamp;
