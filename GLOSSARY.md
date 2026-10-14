# Glossary

Domain terms for Nuspace. When naming concepts in code, issues, or specs, use these terms.

| Term | Definition |
|------|------------|
| **NU** | Nazarbayev University. The institution this app serves. |
| **Nuspace** | The NU student superapp — campus services, announcements, and student essentials in one platform. |
| **Page** | A user- or org-authored page, edited with Puck and rendered from blocks. Stored in the `pages` table, addressed by slug at `pages.nuspace.kz/p/<slug>`, with a visibility tier and a list of admins. A **profile page** is a Page whose identity is the person: one per user, carried on `users` rather than the `pages` table, read at `my.nuspace.kz/u/$handle`. A lowercase `page` — in a DataTable's URL state, a result pager, or the workbench — is not a Page. |
| **Route screen** | A route's top-level UI component, rendered inside the app shell. Lives in `components/routes/<route>/` and is exported as `Page` — inherited convention, not a Page. A draft of one in the workbench's `pages/` is a workbench file, not a route screen. |
| **Visibility** | One axis, three tiers: `private` / `NU only` / `public`. Discoverability is not a separate flag — listing derives from it, so "listed where you cannot open it" is unrepresentable. |
| **Lib module** | A bounded capability in `src/lib/<module>/` — constants, functions, types, tests. The unit of business logic. |
| **Route mirror** | The `components/routes/<route>/` folder holding a route screen and its subcomponents. UI only, no logic. |
| **DataTable** | The reusable table box (`shared/data-table/`), configured by `useDataTable`. Server-side pagination and sorting. |
| **WIF** | Workload Identity Federation. GitHub Actions authenticates to GCP via OIDC, no static keys. |
| **IAP** | Identity-Aware Proxy. GCP's TCP tunneling for private VM access (SSH, RDP) without public exposure. |
| **Presigned upload** | The three-step media flow: client requests a signed URL from the API, uploads directly to GCS, confirms. Bytes never pass through our API. |
| **Shadcn/ui** | Vendor-owned UI primitives in `components/ui/`. Consume, don't extend with project-specific props. |
| **UI workbench** | The dev-only Vite app at `web/ui-workbench/` for viewing design tokens and drafting components and screens. Runs on its own and is never part of the application build. |
| **Token override** | A token value edited in the workbench. Held above the router, so it stays applied across entries, and discarded on reload. |
| **Workbench file** | A `*.wb.tsx` file in the workbench's `components/` or `pages/`, discovered and mounted by its default export. The suffix is the convention. Scratch: work leaves by being written fresh in the app. |
| **Demo file** | A sibling `*.wb.demo.tsx` holding a workbench file's fixtures. Never an entry, and deleted when the component is written for real. |
