# DEMO: Meridian Mutual Group

The demo script. Status of every scene after `yarn seed` with a licence applied: **built and live**. Without a licence, scenes 1 (Releases), 3 (Review workflows) and 5 (Audit logs, Content history) are **talking points or recordings**; the seed prints which features it skipped.

Users and passwords are in `README.md`. Reset between demos with `yarn seed`.

## Before the demo: ten-minute check

Do this once after every `yarn seed`, in this order. If any line fails, stop and fix before the call.

1. `yarn dev` is running. http://localhost:3000 redirects to your language and shows the home page with the quick-quote card, the numbers strip, six product cards, the "How a claim works" steps and three news items. The top banner reads "Talk to a person. 420 agents in three countries" (that is the default banner from Global; the winter one is scheduled, not live).
2. http://localhost:3000/it/products/motor-essential shows "Auto Essenziale" with **6.9%** in the price card, one Italian document (MMG-IT-MOT-2026-V4) and three FAQs. Switch to /fr: the document changes to the French one. That is the market filter working.
3. Admin as `compliance@meridian-demo.test`: Content Manager > Products, locale Italian, "Casa Sicura" shows status Modified, stage **Changes requested**, assignee Italy Editor, and a Review note. If the stage column is missing, the licence did not enable Review workflows: check `[seed] WARNING` lines in the seed output.
4. Same user: Settings > Audit logs shows logins and product updates by France, Germany, Italy Editor and Compliance Reviewer in the last few minutes (the seed replays two weeks of activity at seed time, so the timestamps are "now").
5. As `hq.editor@meridian-demo.test`: Releases shows "Motor Flex launch" (2 entries, scheduled in 19 days), "Winter promo start" (4 entries) and "Winter promo end" (4 entries).
6. As `it.editor@meridian-demo.test`: open any product. Name, tagline, local rate, rate wording and image are editable; "Legal disclaimer", the page blocks and "Review note" are greyed out; the locale switcher offers only Italiano and there is no Publish button.
7. As `hq.editor`: open "Motor Flex 2027" in English. Status Draft, stage Draft, no release indicator, no Italian version. The product is absent from http://localhost:3000/en/products.
8. On any product, the Preview button opens the website inside the admin with the draft content. If it says "Invalid token", `PREVIEW_SECRET` differs between `strapi/.env` and `next/.env`.
9. As `compliance`: Products > "Auto Essenziale" (Italian) > clock icon: at least six versions, with 4.9 in an older one and 6.9 in the latest.
10. Two browsers, or one normal window and one private window: one logged in as `it.editor`, one as `compliance`. Scenes 3 and 4 are a hand-off between teams; switching windows is the demo, logging out and in is dead air.

## Where things are

In the admin:
- Review workflow: Settings > Review workflows > "Regulated content" (Product and Regulated document, required stage Approved). The stage and assignee are in the right-hand panel of an entry. The reason for a rejection goes in the **Review note** field of the product (only compliance can edit it).
- Releases: left menu > Releases. Three are waiting: "Motor Flex launch", "Winter promo start", "Winter promo end".
- Audit logs: Settings > Audit logs (compliance reviewer and super admin can read them).
- Content history: on an entry, the clock icon in the right-hand panel.
- Live Preview: on an entry, the Preview button opens the website in draft mode inside the admin. Desktop and mobile toggle at the top, and a draft/published switch.
- Locked fields for country teams: Legal disclaimer, the page blocks and Review note on Product; Regulatory reference on Regulated document. Everything else on the product is theirs.

On the website (what the prospect sees on the right):
- Home: hero and quick-quote card (categories come from the products in Strapi), numbers strip (Stats block on the Home page), product grid, "we are a mutual" section (Rich text block with image), "How a claim works" (Steps block), FAQ (relations on the Home page), latest news, closing CTA band.
- Product page: the price card on the right is the regulated part. Rate and rate wording are the country team's fields; the legal disclaimer underneath is the locked one. Documents are filtered by market: the Italian site shows the Italian PDF only.
- Top banner: comes from Promo banners. The one you see is the default linked from Global; "Winter cover check" is a draft scheduled by two releases.
- Nav links to /quote, /account and /careers land on a placeholder card that says the funnel is a separate application. Say so before a prospect clicks it.

## 3a. The pitch: outcomes first, then what makes them possible

The order of every conversation is outcome, then feature. The AE states what the customer gets, then shows the feature that delivers it. Never the reverse.

| Outcome the customer gets | What makes it possible | Tier |
|---|---|---|
| Know what is live, pending and at risk without a status meeting | Admin dashboard, list views per team, Draft & Publish statuses | Community |
| One change, every market, every channel | Single types, i18n, REST and GraphQL API | Community |
| A launch date you can promise and keep | Releases with scheduling, release webhooks, components and dynamic zones | Releases: Growth or Enterprise |
| Local teams move on their own and cannot break the group | Custom roles, locale and field-level permissions, publish as a separate permission | Community |
| Nothing regulated goes live without the defined approval, and it is recorded | Review workflows, assignment, required stage for publishing | Enterprise (verify) |
| Nobody publishes blind; sign-off on the real page in seconds | Live Preview, draft versus published toggle | Community (side-panel editing: verify) |
| "Who changed this" answered in one screen; rollback in a minute | Audit logs, Content history | Audit logs: Enterprise. Content history: Growth or Enterprise |
| Short security review, no custom identity or permissions project | SSO, RBAC, scoped API tokens, schema as code, self-hosting | SSO: Enterprise or Growth plus add-on. Rest: Community |

## 3b. The scenes in detail

Every scene uses the same layout: **Start** (what is on screen), an **Open** line said before clicking (the business outcome first), then numbered steps where each step pairs **Do** (what to click, with exact names) and **Say** (the spoken script for that click, naming the feature that makes the outcome possible), a **Close** line, then **Objection it answers**, **Features and tier** and the **Pause question**. Read the Say lines aloud as written the first few times; shorten them once they are yours. Pause after every scene: the two reference demos that worked best both stopped after each block and asked "any workflow you were thinking about while I was clicking?".

**Opening line (before scene 0):**
"Strapi does not ship a frontend. What you will see on the right is a Next.js site we built to look like yours; everything on it, text, images, structure, comes from the Strapi admin on the left. The frontend can be anything: a website, a mobile app, a partner portal, a screen in a branch."

---

### Scene 0: Orientation
*3 minutes. Logged in as HQ editor.*

**Start:** Strapi admin home page. The website open in a second tab on http://localhost:3000/en.

**Open, before clicking anything.** Say: "Here is what a group like yours gets from this platform, and then I will show you what makes it possible. Three things: you always know what is live, what is pending and what is at risk, without a status meeting; a legal or brand change is made once and lands everywhere; and your teams can prepare next quarter's content while this quarter's is being served, with no risk of leaking it."

**1. Do:** point at the dashboard widgets: entries, drafts, assigned to me, upcoming releases, review stage, recent audit activity. Drag one to show they move.
Say: "The first one comes from this dashboard. Drafts, assignments, upcoming releases, items in review, recent changes, all live. The content lead starts here, not in a spreadsheet."

**2. Do:** open the Content Manager. Collapse and expand the folders: "Products & regulated documents", "Website", "Newsroom", "Site settings".
Say: "The second comes from how content is organised. The types sit in folders that match how your teams think: products and regulated documents, the website, the newsroom, and the site settings. Collection types are the things you have many of; single types exist once, like the legal footer. Change the footer here, it changes in every market. One regulatory update, done once. These folders are configuration in the repository, not something each editor sets up."

**3. Do:** open the Products list. Point at the three statuses in the list: Draft, Published, Modified.
Say: "The third comes from Draft & Publish. Three states: Draft is not live, Published is live, Modified means live plus a newer version in preparation. You can work on the new rates while the old ones are served. That is the end of 'do not touch the page until launch day'."

**4. Do:** with the column picker, add the Locale and Status columns.
Say: "And a small thing that saves real time every day: each team configures its own list view. Compliance sees review stage and assignee, country teams see locale and last editor. Less hunting, fewer mistakes, no developer involved."

**5. Do:** switch to the website tab, scroll the home page once.
Say: "Everything you see on the site, text, images, structure, comes from this admin through an API. So one approved correction updates the website, the app and the agent portal at once. One source of truth, every channel."

**Objection it answers:** "Our content is spread across five tools."

**Features and tier:** admin dashboard, Content Manager, list view configuration, draft & publish. All Community.

**Pause question:** "Which of your content lives outside the website today?"

---

### Scene 1: Headquarters prepares a launch
*Logged in as HQ editor.*

**Start:** Products list, locale English. Website tab on http://localhost:3000/en/products/motor-essential.

**Open.** Say: "The outcome in this scene: a multi-country product launch becomes one prepared, approved, scheduled action, so you can promise a launch date to the business and keep it. Today that is usually three teams, an email thread and someone pressing publish at 6am in each market. Here is what makes the difference."

**1. Do:** open "Motor Flex 2027", in draft. Scroll the "Blocks" zone: hero, coverage table, documents, FAQ, CTA band. Drag the coverage table above the hero, then back. Flip to the website tab and point at the same blocks rendered on Motor Essential.
Say: "First, pages are built from blocks. Developers built the hero, the coverage table, the documents section once; the content team assembles pages from them. So a layout change is a drag, not a ticket, and the brand stays consistent because only approved blocks exist. That is faster marketing and fewer requests to IT."

**2. Do:** open the locale switcher top right: English in draft, FR, DE, IT empty.
Say: "Second, one page, four languages, one place. HQ writes the master, countries adapt it. Nobody hunts for the latest French version in an inbox."

**3. Do:** in the right-hand panel, "Add to release": "Motor Flex launch", action Publish, locale English. Then open Releases > "Motor Flex launch": press release, teaser banner and the product, with the date and the Europe/Paris timezone.
Say: "Third, and this is the one that changes the launch itself: a release. Everything that must go live together goes in, across content types and languages, with a date and a time zone. Launch day, 9am Paris time, all of it goes live at once. Something that must come down at the same moment, last year's banner, is an unpublish action in the same release. One decision, every market, exact timing."

**4. Do:** back on the entry, point at the release indicator in the panel. Website tab: http://localhost:3000/en/products shows nine products, no Motor Flex.
Say: "The entry shows which release it belongs to, so everyone knows it is scheduled. And on the public site, nothing is visible. No early leak of a rate, no 6am shift in Milan."

**5. Do:** nothing to click. Say: "Fourth, when the release fires, Strapi tells your site to refresh its cache. The launch is live for customers at the moment you said, not whenever someone remembers to clear a cache."

**Close.** Say: "So: blocks, languages in one place, scheduled releases and the webhook are what turn weeks of coordination into one action. How many people are involved in a launch today, and how many only because the tool cannot do this?"

**Objection it answers:** "We already have a CMS." Reply: "Does it publish a multi-country launch as one scheduled action?"

**Features and tier:** content-type builder, components and dynamic zones, draft & publish, i18n: Community. Releases with scheduling and release webhooks: Growth or Enterprise. Without a licence, stop after step 2 and show the recording of steps 3 and 4.

**Pause question:** "How does a launch date get coordinated across your markets today?"

---

### Scene 2: The Italian country team adapts it
*Switch to the window logged in as Italian country editor.*

**Start:** Content Manager > Products.

**Open.** Say: "The outcome here: local teams run their own changes at their own pace, and they cannot break what they are not supposed to touch. Usually you get one or the other: speed with risk, or control with a queue at central IT. Here is what gives you both."

**1. Do:** point at the locale selector: only Italiano. The list shows Italian versions; "Motor Flex 2027" has no Italian content yet.
Say: "First, roles. I am now logged in as someone on the Italian team. Same Strapi, same content, but the locale selector offers only Italian and the German page is not even listed. That is not a guideline, it is the role. Central IT stops being the bottleneck for local changes because it does not have to be the safety net."

**2. Do:** open "Motor Flex 2027", locale Italiano, "Fill in from another locale" > English. Rename it "Auto Flex 2027", translate the tagline, set the local rate to 6.4.
Say: "Second, the Italian version is created from the English one, structure included. Translate what matters, set the Italian rate. A morning's work for the local team, not a ticket in a queue."

**3. Do:** scroll to "Legal disclaimer" and to the blocks: greyed out. Hover one to show it is read-only.
Say: "Third, the control side. The legal wording and the page structure belong to HQ and compliance, and for me they are read-only. Permissions go down to the single field: legal wording locked, local rate open. A mistake in Italy cannot touch the group template or the French site."

**4. Do:** Save. Point at the top right: no Publish button.
Say: "Fourth, I save but I cannot publish. This role prepares, it does not release. Publishing stays with the people accountable for it."

**Close.** Say: "Roles, locales and field-level permissions are what let you remove the queue without adding risk. Fewer tickets, faster local campaigns, no 'who changed the group header' incident."

**Objection it answers:** "Our local teams keep breaking things, so everything goes through central IT."

**Features and tier:** i18n, custom admin roles, field-level and locale-level permissions. All Community.

**Pause question:** "Which fields would you want locked for your local teams?"

---

### Scene 3: Compliance rejects it
*Two windows: Italian country editor and compliance reviewer.*

**Start:** the Italian draft from scene 2, still open in the Italian window.

**Open.** Say: "For regulated content the outcome that matters is this: nothing goes live without the approval you define, every step is recorded, and the approval loop takes hours instead of a week. Today that loop usually lives in email and a spreadsheet, and under deadline pressure it gets skipped. Here is what enforces it."

**1. Do:** Italian window, right-hand panel: Review stage from "Draft" to "Compliance review", assignee Compliance Reviewer. Save.
Say: "First, a review workflow on the content type. The Italian page is ready, so I move it from Draft to Compliance review and assign it to the compliance team. That is the entire handoff. No email, no 'did you see my message', no spreadsheet to update."

**2. Do:** compliance window, admin home: the "Assigned to me" widget lists the entry. Open it.
Say: "Second, as compliance my dashboard shows what is assigned to me. No digging, no asking what is waiting."

**3. Do:** point at the rate wording (no TAEG). In "Review note" write: "Il tasso deve riportare la dicitura TAEG secondo le regole IVASS". Stage to "Changes requested", assignee Italy Editor. Save.
Say: "Third, the APR wording is wrong for Italy, so I write the reason in the Review note and send it back to Changes requested, reassigned to the Italian editor. The reason travels with the entry. The editor sees exactly what to fix, so the second round takes minutes."

**4. Do:** still as compliance, click Publish on this entry: refused, the workflow requires "Approved".
Say: "Fourth, the rule that makes it real: even I, with publish rights, cannot publish from here. This content type requires the Approved stage before publishing. Not a convention, a rule the system enforces. And the Italian editor does not have a publish button at all."

**Close.** Say: "Workflow stages, assignment, and the required stage for publishing are what turn your approval policy into something the tool enforces and records. Fewer incidents, and an answer ready when someone asks who approved this."

**Shortcut if time is short:** skip steps 1 to 3 and open "Casa Sicura" in Italian in the compliance window; the seed left it in "Changes requested", assigned to Italy Editor, with a review note already written. Do step 4 on it.

**Objection it answers:** "Our approval process is in email and Excel, and it works."

**Features and tier:** Review workflows with stages, assignees, stage permissions and required stage for publishing. Enterprise (verify). Without a licence, this scene is a recording.

**Pause question:** "How long does one approval loop take you today?"

---

### Scene 4: Fix, approve, preview
*Same two windows.*

**Start:** the rejected draft.

**Open.** Say: "The outcome: nobody publishes something they have not seen, and the person accountable signs off on the real page in seconds instead of a staging deploy and a round of screenshots. That is the fear with headless, editors publishing blind. Here is what removes it."

**1. Do:** Italian window: fix the rate wording to "TAEG 6,4% per pagamento mensile", stage "Compliance review", assignee Compliance Reviewer. Save. Compliance window: stage "Approved". Save. Do not publish yet.
Say: "Back as the Italian editor, I fix the wording and resubmit. As compliance, I approve. The page may go live now, but first let us look at it."

**2. Do:** compliance window, click Preview. The product page renders inside the admin with the draft content; the price card on the right shows the new rate and wording. Click the mobile toggle, then back to desktop.
Say: "Preview. The real site, the real template, rendering the draft, inside the CMS. Desktop and mobile. No staging deploy, no developer, no screenshot sent around. The 'what will it look like' question is answered here."

**3. Do:** change the tagline in the form next to the preview, save; the preview refreshes.
Say: "I change the tagline and the preview updates. Corrections happen in the same place they are seen."

**4. Do:** flip the preview switch between draft and published. For Motor Flex the published side is empty; for Casa Sicura it shows the live page against the draft. Then Publish.
Say: "And I flip between the draft and what is live today, so legal compares exactly what changes before signing off. Approved, previewed, published."

**Close.** Say: "Live Preview and Draft & Publish are what make the last check before go-live a few seconds instead of a deploy. Fewer surprises on the live site, faster sign-off."

**Objection it answers:** "Headless means our editors cannot see what they are doing."

**Features and tier:** Live Preview and draft & publish: Community. Editing from the preview side panel: check whether this part is gated before promising it.

**Pause question:** "Who signs off visually today, and how do they see the page?"

---

### Scene 5: Three weeks later, something is wrong
*Compliance window.*

**Start:** website tab on http://localhost:3000/it/products/motor-essential, price card showing 6.9%.

**Open.** Say: "Three weeks later a wrong rate is spotted on the live Italian page: 6.9 instead of 4.9. The outcome you want: who did it and when, answered in one screen, and the old version back in two clicks, by the compliance team, without a ticket. Today that is usually an hour of asking around and a developer to restore. Here is what makes it a minute."

**1. Do:** Settings > Audit logs. Filter user "Italy Editor", action "Update entry". Open one line: the payload shows the rate field. Point at the "Publish entry" lines by Compliance Reviewer right after.
Say: "First, the audit log. Filter by the user and the action: who changed the rate, at what time, from which role, and who published it. This is the record an auditor or a regulator asks for, already written. No reconstruction from memory and chat history."

**2. Do:** Content Manager > Products (Italian) > "Auto Essenziale" > clock icon. Six versions. Open the one with 4.9.
Say: "Second, content history on the entry. Every saved version with author and date. I open the version before the change. The correct rate is right there."

**3. Do:** click Restore.
Say: "Third, restore. One click."

**4. Do:** the entry is back in draft with 4.9, status Modified. Refresh the website tab: still 6.9.
Say: "It comes back as a draft, so it goes through the same approval before going live. The live page still shows the old value until compliance approves. Fast, and still compliant. The same two features handle ordinary cases: the holiday version of a page in December, the normal one back in January. Two clicks, no developer."

**Close.** Say: "Audit logs and content history are what turn a day of digging into one filter, and a bad change into a one-minute fix by the business team. Lower risk and lower cost every time something goes wrong."

**Objection it answers:** "We need an audit trail for compliance and today we reconstruct it by hand."

**Features and tier:** Content history: Growth or Enterprise. Audit logs: Enterprise. Without a licence, a recording.

**Pause question:** "How do you answer 'who changed this' today?"

---

### Scene 6: The platform team's view
*Logged in as platform admin.*

**Start:** Settings.

**Open.** Say: "For the platform team the outcomes are three: least privilege without a custom project, identity from your own provider, and a content model governed like the rest of your code. Plus one backend feeding every channel, so adding a channel is not an integration project. Here is what delivers each one."

**1. Do:** Settings > Roles. Open "Country editor IT": create, read, update per content type, no publish; inside Product, the unchecked boxes on Legal disclaimer, Blocks and Review note.
Say: "Least privilege comes from roles. Here is the Italian country editor: create, read, update and publish separate per content type, and inside Product down to the single field. That is how the legal wording was locked and the rate left open. Out of the box, not after a six-month permissions project."

**2. Do:** Settings > Single Sign-On: default role for auto-registered users, "local authentication for super admins only". Do not click further; no provider is configured in the demo.
Say: "Identity comes from SSO with your provider: Okta, Entra ID, Google, SAML, LDAP and a few hundred others. New users arrive with a default role you choose, so nobody lands with more rights than they should. Local login stays for super admins only, so a provider outage does not lock you out. Joiners, movers and leavers are handled where you already handle them."

**3. Do:** Settings > API Tokens > create one live: name "Mobile app", read-only, custom scope Product find and findOne. Save, copy the token, close.
Say: "Every channel gets its own API token with its own scope: this one is read-only, Products only, for the mobile app. Thirty seconds. Adding a partner portal is a token, not a project."

**4. Do:** Content-Type Builder > Product. Then show `strapi/src/api/product/content-types/product/schema.json` in the editor or on GitHub.
Say: "The content model is a JSON file in your repository. Developers change it in code, review it in a pull request, test it in a lower environment; in production the builder is read-only. The content model follows your existing change process."

**5. Do:** nothing to click. Say: "And you run it where your security team wants it: your own cloud with as many lower environments as you need, or Strapi Cloud if you would rather not operate it."

**Close.** Say: "Roles, SSO, scoped tokens, schema as code and your choice of hosting are what make the security review short and the integration list shorter."

**Objection it answers:** "A headless CMS adds a security surface and an integration project."

**Features and tier:** RBAC and API tokens: Community. SSO: Enterprise, or Growth plus the SSO add-on. Self-hosting: Community.

**Pause question:** "What would your security review ask about this that I have not shown?"

---

### Closing
*2 minutes.*

Reset after the call: `yarn seed` puts everything back, including Motor Flex out of the release and Casa Sicura back in "Changes requested".

1. Recap the six handoffs, one sentence each.
2. Say: "The demo project is public on GitHub. Your engineers can clone it, add the trial licence we will send, and run every scene themselves in an afternoon."
3. Agree the next step before leaving the call.

