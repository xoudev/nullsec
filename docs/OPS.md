# Operations — traffic, quota and abuse

## Incident: 2026-07-30 — quota exhaustion, site offline

| | |
|---|---|
| Edge requests that day | ~3,044,230 |
| Real visitors that day | 63 (115 pageviews) |
| Ratio | ~26,000 requests per pageview |
| Consequence | Hosting quota exhausted, deployment disabled (HTTP 402 `DEPLOYMENT_DISABLED`) |
| Detected | 2026-08-03, roughly four days of downtime |

Human traffic was completely normal that day (the month ran at 60–170 visitors/day).
Analytics only counts pageviews where the page JavaScript executes, so ~3M requests
against 115 pageviews means the traffic was **automated and did not run JS** — bots,
not visitors.

The root cause of the *outage* was not the flood itself but that nothing capped it:
a static site serves a flood cheaply, yet every request still counts against the
plan's edge-request quota. Caching does not help — a cache hit is still a request.
Only blocking at the edge does.

## Defence in depth

### 1. In this repository (done)

- **`app/robots.ts`** — search engines and social link-preview bots stay explicitly
  allowed; AI-training, bulk-scraping and commercial SEO crawlers are denied; the
  unknown long tail gets `crawl-delay`. Most reputable crawlers honour this.
- **`app/feed.xml/route.ts`** — feed item links are locale-prefixed (they used to
  point at redirecting URLs, costing every reader two requests per item) and the
  response carries an explicit CDN TTL.
- **`next.config.ts`** — long-lived immutable cache headers on fonts and audio.

**Limitation, stated plainly:** none of the above stops a deliberate flood. A
malicious client ignores `robots.txt`. The repository can reduce *polite* crawler
load; it cannot rate-limit anything.

### 2. In the hosting dashboard (must be done there — not configurable from code)

These are the controls that actually cap abuse. Vercel → the `nullsec` project:

1. **Firewall → Attack Challenge Mode.** Serves a browser challenge before content.
   Automated clients that do not execute JS fail it, which is exactly the profile of
   the 2026-07-30 traffic. Turn it on when under attack; it is the single most
   effective switch available.
2. **Firewall → Bot filtering / managed rules.** Blocks known bad user agents at the
   edge. Some managed rulesets require a paid plan.
3. **Usage alerts / spend management.** Configure notifications on edge-request
   volume. The real failure on 2026-07-30 was silence: the outage was discovered
   four days late. An alert turns a multi-day outage into a same-day fix.

### 3. If it happens again

1. Check **Firewall** logs first: top IPs, user agents and paths identify whether it
   is a crawler storm or a targeted flood.
2. Enable **Attack Challenge Mode** immediately — it is reversible and takes effect
   at the edge.
3. Check the **Usage** page to see which quota is affected (edge requests vs data
   transfer).
4. Only then look at code. A single-day spike with no correlation to a deployment is
   almost never an application bug.

## Restoring service after a quota block

A disabled deployment returns HTTP 402 with `x-vercel-error: DEPLOYMENT_DISABLED`.
The build itself is unaffected — serving is disabled at the account level, so
redeploying does not fix it. It clears at the start of the next billing cycle, or
immediately on upgrading the plan.

**Do not promote the site (LinkedIn, etc.) while it returns 402.**
Verify with a request that does not depend on a local network path:

```
curl -sS -o /dev/null -w '%{http_code}\n' https://nullsec.fr/en
```

## Related: canonical host

Canonical URLs, the sitemap, hreflang and `security.txt` all derive from
`profile.siteUrl` (`https://nullsec.fr`). The DNS/redirect configuration must agree
with that value: if the apex redirects to `www`, either point the redirect the other
way or set `NEXT_PUBLIC_SITE_URL` to the `www` host. A mismatch means every canonical
URL advertises a host that immediately redirects.
