# Database verification evidence — 2026-10-09

Goal: prove the production PostgreSQL path (not only local SQLite) with the real Payload schema, migrations, seed and the
public catalogue query shapes. Machine has no PostgreSQL server/Docker, so a real PostgreSQL 17 binary was run via the
`embedded-postgres@17.10.0-beta.17` npm package (scratch folder, not a project dependency) on `localhost:54329`.

| Step | SQLite (`file:./data/*.db`) | PostgreSQL 17 (UTF8 database) |
|---|---|---|
| Schema | dev push (Payload) | `payload migrate:create initial` → `src/migrations/postgres/20261009_183146_initial.ts`; `payload migrate` applied in ~0.85 s |
| `pnpm seed` (taxonomy, metrics, homepage, FAQs, settings, approvals) | ✓ | ✓ |
| `seed:fixtures` (3 staff accounts, 4 `[TEST]` products incl. one unapproved draft) | ✓ (`data/e2e.db`) | ✓ |
| Public query, fixtures hidden (`DEMO_FIXTURES` unset) | `public=∅`, staff total 4 | — |
| Public query with `DEMO_FIXTURES=true` | `supplement-beta, feed-alpha, medicine-gamma` | identical |
| `category.key = feed` | `feed-alpha` | identical |
| `segments.key = layers` (hasMany) | `supplement-beta, medicine-gamma` | identical |
| `segments.key = breeders` | `supplement-beta` | identical |
| Arabic search «بيطري» (normalised tokens on `searchText`) | `medicine-gamma` | identical |
| Latin search «SUPPLEMENT» (case-insensitive) | `supplement-beta` | identical |
| Unapproved draft visible to public | 0 | 0 |
| Staff-only fields in public results (`sourceEvidence`, `internalNotes`, `approvalEvidence`) | absent | — |

## Findings fixed during verification
1. **Public queries failed on restricted fields** — Payload rejects `where` filters on fields the requester cannot read.
   `isFixture` and `searchText` were staff-read-only, so public catalogue/search queries errored. Both fields are
   non-sensitive and are now readable (still hidden in the admin UI). Commit: "make isFixture/searchText queryable".
2. **Encoding** — a database created with the Windows default `WIN1252` encoding cannot store Arabic
   (`character … has no equivalent in encoding "WIN1252"`). Production databases MUST be created with `ENCODING 'UTF8'`
   (documented in docs/deployment.md). Managed PostgreSQL services default to UTF8.
