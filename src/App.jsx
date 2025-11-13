import { useState, useMemo } from 'react'
import Spline from '@splinetool/react-spline'

// Color theme: black, ash (gray), red, white
const theme = {
  bg: 'bg-neutral-950',
  card: 'bg-neutral-900/70 backdrop-blur',
  text: 'text-neutral-200',
  subtext: 'text-neutral-400',
  accent: 'text-red-500',
  accentBg: 'bg-red-600',
  accentHover: 'hover:bg-red-500',
  border: 'border-neutral-800',
}

const PLATFORMS = ['Wix', 'Squarespace', 'Webflow', 'WordPress', 'Shopify', 'Framer']
const AREAS = [
  'Platform Lock-in & Data Ownership',
  'Performance & Technical Limitations',
  'Design & Customization',
  'Pricing Structure',
  'E-commerce Capabilities',
  'Support & Reliability',
  'Analytics & Insights',
  'Scalability',
]

// Curated research (Wix focus, with comparisons)
const research = {
  summary: {
    keyFindings: [
      'Data portability is limited across most hosted builders; true one-click export is rare. WordPress (self-hosted) remains best for full control.',
      'JavaScript-heavy canvases and app marketplace add-ons commonly degrade Core Web Vitals, especially on mobile.',
      'SEO controls exist but are often shallow by default; advanced schema, URL patterns, and multi-language routing vary widely.',
      'Design systems encourage speed but create template sameness and responsive inconsistencies, particularly in complex grid/stack layouts.',
      'Pricing hides costs in apps, bandwidth/storage thresholds, and payment processing. True total cost of ownership is opaque.',
      'E-commerce depth is strongest in Shopify; others trail in gateways, multi-currency, tax automation, and checkout customization.',
      'Support quality is inconsistent; resolution times for editor bugs or release regressions can be slow during peak launches.',
      'Scalability bottlenecks appear as sites grow: DOM size, client JS, and CMS query limits; enterprise features require custom contracts.',
    ],
  },
  byPlatform: {
    Wix: {
      lockIn: [
        'Exports limited: no full theme+CMS+app one-click export. Static page export is partial and loses dynamic features.',
        'Content ownership nominally yours; backups are manual. No native git-style versioning. Limited raw database export for Wix CMS (Collections).',
        'Migration away requires rebuild; template switching post-build is constrained and can break layout bindings.',
        'Proprietary editor/runtime; no server access. Limited backend via Velo; database access abstracted.',
      ],
      perf: [
        'Core Web Vitals: LCP and TBT commonly impacted by editor runtime and app scripts, especially on mobile.',
        'Heavy templates/animations increase JS cost; image CDN is good but lazy loading must be configured carefully.',
        'CDN coverage is solid; server response times fine, but render-blocking third-party apps degrade performance.',
      ],
      seo: [
        'Custom URLs and basic meta supported; advanced schema via custom code is possible but not first-class.',
        'Internationalization and localized SEO available but less flexible than headless stacks.',
        'Search Console integration works; crawlability issues arise from dynamic content and script-generated DOM.',
      ],
      design: [
        'Drag-and-drop flexible but can create responsive inconsistencies; separate mobile editor increases drift.',
        'Custom code injection supported (head/body), but sandboxed. Template switching post-build is fragile.',
        'Cross-browser fine for simple sites; complex effects can shift unexpectedly.',
      ],
      pricing: [
        'Tiered plans; core features gated. Total cost rises with marketplace apps and storage/bandwidth needs.',
        'Payment fees via gateways; additional app fees for SEO, analytics, bookings, etc.',
        'Annual discounts significant; auto-renew common. Domain/SSL usually included in higher tiers.',
      ],
      ecommerce: [
        'Native store ok for SMB; transaction fees mainly from gateways. Multi-currency limited vs. Shopify.',
        'Inventory and variants supported; checkout customization is constrained.',
        'Abandoned cart, basic shipping/tax automations exist via apps; depth lags Shopify.',
      ],
      support: [
        'Mixed CSAT; response times vary. Knowledge base is broad; community forum active.',
        'Editor bugs can persist across releases; premium support available at higher tiers.',
      ],
      analytics: [
        'Built-in analytics basic; GA4 integration supported. Conversion tracking requires apps and code.',
        'Data export limited; API access via Velo with constraints and rate limits.',
      ],
      scale: [
        'Large sites hit client-side performance limits; CMS collections have practical limits for complex queries.',
        'Multi-site management exists but lacks enterprise governance and version control.',
      ],
    },
    Squarespace: {
      lockIn: [
        'No full export of dynamic features; XML export limited mainly to posts/pages.',
        'Template switching improved in newer versions but still requires rework.',
      ],
      perf: [
        'Better defaults than average; heavy image blocks still affect LCP.',
      ],
      seo: [
        'Solid basics; limited schema flexibility without code injection.',
      ],
      design: [
        'Polished templates; uniqueness limited without custom CSS/JS.',
      ],
      pricing: ['Few tiers; commerce add-ons increase cost.'],
      ecommerce: ['Usable store; limited checkout customization; fewer gateways.'],
      support: ['Good docs; support quality varies.'],
      analytics: ['Built-in analytics nicer than most; export/API limited.'],
      scale: ['Fine for small/medium; complex sites hit limits.'],
    },
    Webflow: {
      lockIn: [
        'Static export available (no CMS/logic). Full migration of CMS requires API + rebuild.',
        'Template switching is manual; style system is powerful but sticky.',
      ],
      perf: [
        'Cleaner output than many; interaction scripts can bloat JS.',
      ],
      seo: [
        'Good control: clean URLs, meta, schema via custom code; multilingual via workarounds or add-ons.',
      ],
      design: [
        'High flexibility; steep learning curve; responsive consistency depends on discipline.',
      ],
      pricing: ['Workspace+site plans; CMS item caps; add-ons raise TCO.'],
      ecommerce: ['Basic to moderate; checkout customization limited; payment options fewer than Shopify.'],
      support: ['Docs/community strong; ticket support variable.'],
      analytics: ['Integrations ok; API for CMS; analytics basic.'],
      scale: ['CMS limits and item caps; performance degrades with complex interactions.'],
    },
    WordPress: {
      lockIn: [
        'Open-source; full data control self-hosted. Migration/export strong.',
        'Template switching depends on theme builder; plugin lock-in common.',
      ],
      perf: [
        'Highly variable: can be fast with careful theme/plugins; otherwise bloaty.',
      ],
      seo: [
        'Excellent via plugins; full schema and URL control.',
      ],
      design: [
        'Gutenberg improving; builders add flexibility but risk bloat.',
      ],
      pricing: ['Hosting + premium plugins drive TCO; transparent but fragmented.'],
      ecommerce: ['WooCommerce powerful but plugin-heavy; checkout customizable.'],
      support: ['Community vast; quality varies with host/plugins.'],
      analytics: ['Unlimited integrations; full data access.'],
      scale: ['Scales with proper hosting; requires ops expertise.'],
    },
    Shopify: {
      lockIn: [
        'Proprietary; easy in, hard out. Data export decent for products/orders; theme/app portability limited.',
      ],
      perf: [
        'Solid CDN; storefront performance generally good; apps can add bloat.',
      ],
      seo: [
        'URL constraints (e.g., /products/); meta control ok; schema good via apps.',
      ],
      design: [
        'Theme-based; sections flexible; deep checkout customization gated at Plus tier.',
      ],
      pricing: ['Transparent tiers; app fees and transaction fees add up.'],
      ecommerce: ['Best-in-class commerce depth, gateways, taxes, shipping, multi-currency.'],
      support: ['24/7 strong; Plus has premium support.'],
      analytics: ['Commerce analytics rich; export/API strong.'],
      scale: ['Excellent scaling; enterprise via Plus.'],
    },
    Framer: {
      lockIn: [
        'Hosted; static export limited; CMS basic. Migration requires rebuild for dynamic content.',
      ],
      perf: [
        'Fast by default for small sites; heavy animations can hurt CWV.',
      ],
      seo: [
        'Improving; schema and advanced SEO require custom code.',
      ],
      design: [
        'Great visual fidelity; responsive sometimes brittle across breakpoints.',
      ],
      pricing: ['Simple tiers; CMS limits; usage caps.'],
      ecommerce: ['Very limited native commerce; relies on embeds/integrations.'],
      support: ['Active community; small team velocity.'],
      analytics: ['Basic built-in; GA4 supported.'],
      scale: ['Best for marketing sites; not for large CMS/ecom.'],
    },
  },
  differentiation: [
    'One-click, lossless export (templates, assets, CMS, redirects, forms, apps) with verified parity checks.',
    'Hybrid visual + code editor with live sync and per-block escape hatches.',
    'Performance-first runtime: partial hydration, islands architecture, zero-JS by default, prefetch + image/CDN automation.',
    'Advanced SEO: rule-based URL mapping, native schema builder, hreflang, XML/JSON sitemaps, edge redirects.',
    'Transparent pricing: flat usage tiers, no surprise app markups, bring-your-own gateway with zero platform fees.',
    'Template switching with auto-layout reflow and content-binding preservation.',
    'Open-core model: self-hostable runtime, hosted conveniences optional.',
    'AI design copilot: brief-to-wireframe, accessibility checks, content rewrite, performance budget guardrails.',
    'Built-in A/B testing, feature flags, and conversion goals with exportable raw data.',
    'Immutable content proofs (optional) via blockchain for provenance-sensitive brands.',
    'Real-time collaboration, presence, comments, and branching with versioned rollbacks.',
    'One-click PWA and edge caching strategies; offline-ready pages.',
    'Headless CMS with GraphQL/REST; portable schemas; multi-environment content ops.',
    'Multi-platform publishing: web + React Native wrappers for mobile where applicable.',
  ],
}

function Pill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border ${theme.border} mr-2 mb-2 transition-colors ${
        active ? 'bg-red-600 text-white' : 'bg-neutral-800/70 text-neutral-300 hover:bg-neutral-700'
      }`}
    >
      {label}
    </button>
  )
}

function SectionCard({ title, children, id }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className={`rounded-xl border ${theme.border} ${theme.card} p-5 md:p-6`}> 
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">{title}</h3>
        <div className={`${theme.text}`}>{children}</div>
      </div>
    </section>
  )
}

function Bullet({ children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 h-2 w-2 rounded-full bg-red-600"></span>
      <span className="text-neutral-300">{children}</span>
    </li>
  )
}

function App() {
  const [platform, setPlatform] = useState('Wix')
  const [area, setArea] = useState(AREAS[0])

  const plat = research.byPlatform[platform]

  const areaBullets = useMemo(() => {
    switch (area) {
      case 'Platform Lock-in & Data Ownership':
        return plat.lockIn
      case 'Performance & Technical Limitations':
        return [...plat.perf, ...plat.seo]
      case 'Design & Customization':
        return plat.design
      case 'Pricing Structure':
        return plat.pricing
      case 'E-commerce Capabilities':
        return plat.ecommerce
      case 'Support & Reliability':
        return plat.support
      case 'Analytics & Insights':
        return plat.analytics
      case 'Scalability':
        return plat.scale
      default:
        return []
    }
  }, [area, plat])

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} relative overflow-hidden`}> 
      {/* Hero with Spline cover */}
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <Spline scene="https://prod.spline.design/cEecEwR6Ehj4iT8T/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        {/* Gradient overlay for readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-neutral-950"></div>
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-600/40 bg-neutral-900/60 px-3 py-1 mb-4">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              <span className="text-xs uppercase tracking-wider text-neutral-300">Competitive Analysis · Website Builders</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Building a Superior Website Platform: Wix-Focused Competitive Research
            </h1>
            <p className="mt-4 md:mt-6 text-neutral-300 max-w-3xl mx-auto">
              Deep dive across lock-in, performance, SEO, design, pricing, commerce, support, analytics, and scalability. Interactive, contrast-rich, and fast—optimized for a black/ash/red/white visual system.
            </p>
            <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#research" className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors">Explore Insights</a>
              <a href="#differentiation" className="px-5 py-2 rounded-lg border border-neutral-700 text-neutral-200 hover:border-red-600 transition-colors">Opportunities</a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main id="research" className="relative z-10 px-4 sm:px-6 lg:px-10 -mt-10 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 md:gap-8">
          {/* Left rail */}
          <aside className={`hidden lg:block sticky top-6 self-start ${theme.card} border ${theme.border} rounded-xl p-4`}> 
            <h2 className="text-sm uppercase tracking-wider text-neutral-400 mb-3">Platforms</h2>
            <div className="flex flex-wrap">
              {PLATFORMS.map((p) => (
                <Pill key={p} label={p} active={platform === p} onClick={() => setPlatform(p)} />
              ))}
            </div>
            <div className="h-px bg-neutral-800 my-4" />
            <h2 className="text-sm uppercase tracking-wider text-neutral-400 mb-3">Areas</h2>
            <div className="flex flex-col gap-2">
              {AREAS.map((a) => (
                <button key={a} onClick={() => setArea(a)} className={`text-left text-sm px-3 py-2 rounded-lg border ${theme.border} ${area === a ? 'bg-neutral-800 text-white border-red-700' : 'bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300'}`}>
                  {a}
                </button>
              ))}
            </div>
          </aside>

          {/* Main column */}
          <div className="space-y-6">
            {/* Platform and area controls for mobile */}
            <div className={`lg:hidden ${theme.card} rounded-xl border ${theme.border} p-4`}> 
              <div className="flex flex-wrap mb-3">
                {PLATFORMS.map((p) => (
                  <Pill key={p} label={p} active={platform === p} onClick={() => setPlatform(p)} />
                ))}
              </div>
              <div className="flex gap-2 overflow-auto no-scrollbar pb-1">
                {AREAS.map((a) => (
                  <button key={a} onClick={() => setArea(a)} className={`flex-shrink-0 text-sm px-3 py-2 rounded-lg border ${theme.border} ${area === a ? 'bg-neutral-800 text-white border-red-700' : 'bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <SectionCard id="overview" title={`${platform} · Key Takeaways`}>
              <ul className="space-y-2">
                {research.summary.keyFindings.slice(0, 4).map((item, idx) => (
                  <Bullet key={idx}>{item}</Bullet>
                ))}
              </ul>
            </SectionCard>

            <SectionCard id="area" title={`${area}`}>
              <ul className="space-y-2">
                {areaBullets?.map((b, i) => (
                  <Bullet key={i}>{b}</Bullet>
                ))}
              </ul>
            </SectionCard>

            <SectionCard id="compare" title="Quick Cross-Platform Notes">
              <div className="grid sm:grid-cols-2 gap-4">
                {PLATFORMS.map((p) => (
                  <div key={p} className={`rounded-lg border ${theme.border} p-4 bg-neutral-900/60`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{p}</h4>
                      <span className="text-xs text-neutral-400">{AREAS.indexOf(area) + 1}/{AREAS.length}</span>
                    </div>
                    <ul className="space-y-1">
                      {(area === 'Platform Lock-in & Data Ownership' ? research.byPlatform[p].lockIn
                        : area === 'Performance & Technical Limitations' ? [...research.byPlatform[p].perf, ...research.byPlatform[p].seo].slice(0,3)
                        : area === 'Design & Customization' ? research.byPlatform[p].design
                        : area === 'Pricing Structure' ? research.byPlatform[p].pricing
                        : area === 'E-commerce Capabilities' ? research.byPlatform[p].ecommerce
                        : area === 'Support & Reliability' ? research.byPlatform[p].support
                        : area === 'Analytics & Insights' ? research.byPlatform[p].analytics
                        : research.byPlatform[p].scale
                      ).slice(0,3).map((item, idx) => (
                        <li key={idx} className="text-sm text-neutral-300 flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-600"/>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="differentiation" title="Opportunities for Differentiation">
              <ul className="grid md:grid-cols-2 gap-3">
                {research.differentiation.map((item, idx) => (
                  <li key={idx} className={`flex items-start gap-3 rounded-lg border ${theme.border} p-3 bg-neutral-900/60`}>
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-red-600" />
                    <span className="text-neutral-200">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-sm text-neutral-400">
                Tip: combine one-click export, hybrid editor, and performance-first runtime as the core wedge. Layer AI ops, A/B testing, and transparent pricing to convert prosumers and agencies.
              </div>
            </SectionCard>

            <SectionCard id="cta" title="Make it Real">
              <div className="flex flex-wrap items-center gap-3">
                <a href="#" className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors">Request a Prototype</a>
                <a href="#" className="px-5 py-2 rounded-lg border border-neutral-700 hover:border-red-600 transition-colors">Download Summary</a>
              </div>
            </SectionCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-neutral-900 bg-neutral-950/80">
        <div className="max-w-6xl mx-auto text-neutral-500 text-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>Built for strategy teams exploring a next-gen builder. Palette: black, ash, red, white.</div>
          <div className="text-neutral-400">Inspired by modern motion design and tactile surfaces.</div>
        </div>
      </footer>
    </div>
  )
}

export default App
