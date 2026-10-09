# CMS editor guide — Alshorouk (Payload, `/admin`)

Audience: the client's content editors, approvers and sales team. Language of the admin: Arabic or English (account settings → language).

## 1. Roles

| Role | Can do | Cannot do |
|---|---|---|
| **Admin** (مدير النظام) | Everything: users and roles, site settings, verified contact channels, metrics, approvals, deleting records | — |
| **Editor** (محرر محتوى) | Create/edit products, articles, FAQs, media, homepage copy | Approve/publish **unless** an admin ticks "Authorised to approve & publish" on their account; change settings or users; read inquiries |
| **Sales** (فريق المبيعات) | Read inquiries, change their status, add notes; read product records for context | Publish anything, edit content, see settings |

The very first account created at `/admin` becomes the admin. Accounts lock for 15 minutes after 5 failed logins. Sessions expire after 8 hours.

## 2. The golden rule: approved + published

Products, articles and FAQs appear on the public site **only** when:
1. **Approval status = Approved** (only admins or authorised editors can set this), and
2. **Published** is ticked.

Moving a record back to "Review required", "Internal placeholder" or "Hidden" automatically unpublishes it. Use the **Approval evidence** field (sidebar, never public) to record who approved what and on which document.

Never enter: invented products, sample phone numbers, testimonials or partner logos without written permission, certifications, delivery-time promises, prices or stock levels, dosages, vaccination schedules or treatment advice.

## 3. Adding a real product (المنتجات)

1. **Core data:** Arabic name (required), English name (only if approved), category (one of the four lines), production segments (broilers/layers/breeders), verified SKU, form, manufacturer (+ tick "Manufacturer verified" before it is shown publicly), approved pack size, the **official description from the approved label only**, warnings exactly as supplied, availability wording (On inquiry · Supplied on request · Availability confirmed — use "confirmed" only when it is true).
2. **Media & label:** product photos (with Arabic + English alt text) and the technical label PDF; tick "Label legally approved for download" only after legal sign-off.
3. **Safety & SEO:** leave the safety text empty to use the standard sentence «تُستخدم المنتجات البيطرية وفقًا للإرشادات المعتمدة وتحت إشراف الطبيب البيطري.»; optional meta title/description.
4. **Internal:** data source evidence and notes (never public).
5. **Slug:** lowercase Latin, digits and hyphens (e.g. `vaccine-name-1000-doses`). It becomes `/ar/products/<slug>` and `/en/products/<slug>`.
6. **Approve & publish** (authorised users) → the catalogue, filters, search, segment pages and sitemap update automatically within moments.

**Preview:** while logged in as admin/editor, open `/ar/products/<slug>` to preview an unpublished product — it shows a DRAFT banner and is never indexed.

## 4. Homepage copy (الصفحة الرئيسية)

`Content → Homepage`: eyebrow, headline lines (one line per row — keep 2–3 short lines), subhead, CTA labels, statement lines, closing headline/subhead, and toggles to hide sections. Empty fields fall back to the approved default copy. Edit Arabic and English separately with the locale switcher at the top. High-visibility headlines need client approval (see `content/approval-register.md`).

## 5. Approved metrics (الأرقام المعتمدة)

Only users with approval authority can edit. Exactly three rows (farms, birds, products); the qualifier («حوالي» / "Approx.") is mandatory; values use Western digits. Record the source in "Accuracy & source note". Never present these figures as exact.

## 6. FAQs, articles and media

- **FAQs:** business/process questions only; choose placement (Home / Products / Contact) and order.
- **Articles (المعرفة):** title, excerpt, category, cover image, rich-text body, sources. Veterinary topics require a qualified professional's review — tick "Reviewed by a qualified professional" only when true. Author name shows only when "Author attribution approved" is ticked. Articles without an English title do not appear on the English site.
- **Media:** every upload needs accurate alt text (poultry only) and a usage-rights status; files marked "Internal file" are never public. Set the focal point so crops keep the birds visible.

## 7. Inquiries (الطلبات والاستفسارات) — sales workflow

Each submission arrives with a reference (e.g. `SHR-7K3Q9P`), type (farm/product/partner/general), contact details, production type, product or category context, source page, language and consent time.

Status lifecycle (enforced): **New → Contacted → Qualified → Closed / Rejected** (New and Contacted can also go directly to Closed/Rejected). Every change is logged in the status history with the user and time. Use "Sales notes" for follow-up details.

Personal data: do not export or share inquiries outside the authorised sales team; delete records when no longer needed according to the retention period the company sets (privacy policy).

E-mail notifications are sent only after SMTP and a recipient address are configured by the administrator; they contain no personal data, only a link to the record.

## 8. Site settings (إعدادات الموقع) — admin only

- **Contact channels:** phone, WhatsApp, e-mail, address, map link, social profiles. Nothing is shown on the site until **"Officially verified"** is ticked for that channel.
- **Identity & copy:** legal entity name (once verified), footer notice.
- **Features:** site status (Staging = no search indexing; switch to Production only at launch), show/hide the knowledge hub, and "English copy approved for indexing" (keeps `/en` pages out of search engines until approved).

## 9. Approval register

`Administration → Approval register` mirrors `content/approval-register.md`. When the client approves an item, update its state, attach the evidence document and record who approved it and when.
