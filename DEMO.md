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

Every scene uses the same layout: **Start**, **Actions** (numbered), **The moment**, **Business outcome**, **Talk track** (outcome first, then the features that make it possible, one spoken block per action), **Objection it answers**, **Features and tier**, **Pause question**. Pause after every scene: the two reference demos that worked best both stopped after each block and asked "any workflow you were thinking about while I was clicking?".

**Opening line (before scene 0):**
"Strapi does not ship a frontend. What you will see on the right is a Next.js site we built to look like yours; everything on it, text, images, structure, comes from the Strapi admin on the left. The frontend can be anything: a website, a mobile app, a partner portal, a screen in a branch."

---

### Scene 0: Orientation
*3 minutes. Logged in as HQ editor.*

**Start:** Strapi admin home page.

**Actions**
1. Point at the dashboard widgets: entries, drafts, assigned to me, upcoming releases, review stage, recent audit activity. They are drag and drop. This is where a content lead starts the day.
2. Open the Content Manager. The types are grouped in folders: "Products & regulated documents", "Website", "Newsroom", and "Site settings" for the single types. Collapse and expand one. Say the folders are configuration in the repo, not something each editor sets up.
3. On the Products list, add two columns (locale, status) with the column picker. The list is customisable per team.
4. Point at the three statuses: Draft, Published, Modified. Modified means: it is published, and there is a newer draft that is not live yet.

**The moment:** one place, every piece of content, with its state visible at a glance.

**Business outcome:** visibility. Leadership knows what is live, what is pending and what is at risk, without a status meeting.

**Talk track**
- *(the outcome first)* "Here is what a group like yours gets from this platform, and then I will show you what makes it possible. Three things: you always know what is live, what is pending and what is at risk, without a status meeting; a legal or brand change is made once and lands everywhere; and your teams can prepare next quarter's content while this quarter's is being served, with no risk of leaking it."
- *(what makes it possible, on the home page)* "The first one comes from this dashboard. Drafts, assignments, upcoming releases, items in review, recent changes, all live. The content lead starts here, not in a spreadsheet."
- *(opening the Content Manager)* "The second comes from how content is organised. The types sit in folders that match how your teams think: products and regulated documents, the website, the newsroom, and the site settings. Collection types are the things you have many of; single types exist once, like the legal footer. Change the footer here, it changes in every market. One regulatory update, done once."
- *(pointing at the statuses)* "The third comes from Draft & Publish. Three states: Draft is not live, Published is live, Modified means live plus a newer version in preparation. You can work on the new rates while the old ones are served. That is the end of 'do not touch the page until launch day'."
- *(adding the columns)* "And a small thing that saves real time every day: each team configures its own list view. Compliance sees review stage and assignee, country teams see locale and last editor. Less hunting, fewer mistakes, no developer involved."
- *(closing)* "Everything here is also available through an API. So one approved correction updates the website, the app and the agent portal at once. One source of truth, every channel."

**Objection it answers:** "Our content is spread across five tools."

**Features and tier:** admin dashboard, Content Manager, list view configuration, draft & publish. All Community.

**Pause question:** "Which of your content lives outside the website today?"

---

### Scene 1: Headquarters prepares a launch
*Logged in as HQ editor.*

**Start:** Products list, filtered on locale English.

**Actions**
1. Open "Motor Flex 2027", already in draft. Scroll it: hero, coverage table, documents, FAQ, CTA band. Each is a component in the "Blocks" dynamic zone. Drag the coverage table above the hero and back, to show the page-builder feel. Say the components were built once by developers and are reused across pages. Open "Auto Essenziale" on the site in a tab beforehand so you can point at the same blocks rendered.
2. Show the locale switcher top right: English in draft, FR, DE, IT empty.
3. On the entry, in the right-hand panel, "Add to release": pick "Motor Flex launch", action Publish, locale English. Then open Releases > "Motor Flex launch": the press release, the teaser banner and now the product page, with the scheduled date and the timezone (Europe/Paris).
4. Back on the entry, show the release indicator in the panel. Open http://localhost:3000/en/products in another tab: nine products, no Motor Flex.

**The moment:** one release, every locale and market inside it, one date, invisible until then.

**Business outcome:** time to market. A multi-country launch goes from weeks of coordination to one scheduled action, so campaigns and products reach customers on the date the business promised.

**Talk track**
- *(the outcome first)* "The outcome in this scene: a multi-country product launch becomes one prepared, approved, scheduled action, so you can promise a launch date to the business and keep it. Today that is usually three teams, an email thread and someone pressing publish at 6am in each market. Here is what makes the difference."
- *(components and dynamic zones)* "First, pages are built from blocks. Developers built the hero, the coverage table, the documents section once; the content team assembles pages from them." *(drag a block)* "So a layout change is a drag, not a ticket, and the brand stays consistent because only approved blocks exist. That is faster marketing and fewer requests to IT."
- *(i18n)* "Second, one page, four languages, one place. HQ writes the master, countries adapt it. Nobody hunts for the latest French version in an inbox."
- *(Releases)* "Third, and this is the one that changes the launch itself: a release. Everything that must go live together goes in, across content types and languages, with a date and a time zone." *(add the page)* "Launch day, 9am Paris time, all of it goes live at once. Something that must come down at the same moment, last year's banner, is an unpublish action in the same release. One decision, every market, exact timing."
- *(the entry and the public site)* "The entry shows which release it belongs to, so everyone knows it is scheduled. And on the public site, nothing is visible. No early leak of a rate, no 6am shift in Milan."
- *(release webhooks)* "Fourth, when the release fires, Strapi tells your site to refresh its cache. The launch is live for customers at the moment you said, not whenever someone remembers to clear a cache."
- *(close)* "So: blocks, languages in one place, scheduled releases and the webhook are what turn weeks of coordination into one action. How many people are involved in a launch today, and how many only because the tool cannot do this?"

**Objection it answers:** "We already have a CMS." Reply: "Does it publish a multi-country launch as one scheduled action?"

**Features and tier:** content-type builder, components and dynamic zones, draft & publish, i18n: Community. Releases with scheduling and release webhooks: Growth or Enterprise. Without a licence, stop after step 2 and show the recording of steps 3 and 4.

**Pause question:** "How does a launch date get coordinated across your markets today?"

---

### Scene 2: The Italian country team adapts it
*Log out, log in as Italian country editor.*

**Start:** Content Manager, same structure as before.

**Actions**
1. Content Manager > Products: the locale selector offers only Italiano and the list is the Italian versions. "Motor Flex 2027" appears with no Italian content yet.
2. Open it, switch the locale to Italiano and choose "Fill in from another locale" > English: structure and blocks come across. Translate the name to "Auto Flex 2027", the tagline, and set the local rate to 6.4.
3. Scroll to "Legal disclaimer" and to the blocks: greyed out, read-only for this role. Name, tagline, rate and rate wording are open.
4. Save. Point at the missing Publish button: this role prepares, it does not release.

**The moment:** the same page, but this user can only touch Italy, and only the fields Italy is allowed to touch.

**Business outcome:** local speed at lower cost. Country teams run their own changes, central IT stops being a bottleneck, and the group template is protected, so fewer tickets and fewer incidents.

**Talk track**
- *(the outcome first)* "The outcome here: local teams run their own changes at their own pace, and they cannot break what they are not supposed to touch. Usually you get one or the other: speed with risk, or control with a queue at central IT. Here is what gives you both."
- *(custom roles and locale permissions)* "First, roles. I am now logged in as someone on the Italian team. Same Strapi, same content, but the locale selector offers only Italian and the German page is not editable. That is not a guideline, it is the role. Central IT stops being the bottleneck for local changes because it does not have to be the safety net."
- *(i18n, creating the locale)* "Second, the Italian version is created from the English one, structure included. Translate what matters, set the Italian rate. A morning's work for the local team, not a ticket in a queue."
- *(field-level permissions)* "Third, the control side. The hero layout belongs to HQ, and for me it is read-only. Permissions go down to the single field: legal wording locked, local rate open. A mistake in Italy cannot touch the group template or the French site."
- *(publish permission)* "Fourth, I save but I cannot publish. This role prepares, it does not release. Publishing stays with the people accountable for it."
- *(close)* "Roles, locales and field-level permissions are what let you remove the queue without adding risk. Fewer tickets, faster local campaigns, no 'who changed the group header' incident. Which fields would you want locked for your local teams?"

**Objection it answers:** "Our local teams keep breaking things, so everything goes through central IT."

**Features and tier:** i18n, custom admin roles, field-level and locale-level permissions. All Community.

**Pause question:** "Which fields would you want locked for local teams?"

---

### Scene 3: Compliance rejects it
*Starts as Italian country editor, switches to compliance reviewer.*

**Start:** the Italian draft from scene 2.

**Actions**
1. Still as the Italian editor, in the right-hand panel: Review stage from "Draft" to "Compliance review", assignee Compliance Reviewer. Save.
2. Switch to the compliance window. Home: the "Assigned to me" widget lists the entry. Open it.
3. Point at the rate wording ("TAEG" missing). Write the reason in "Review note": "Il tasso deve riportare la dicitura TAEG secondo le regole IVASS", move the stage to "Changes requested", assignee Italy Editor. Save.
4. Before leaving the compliance window, click Publish on this entry anyway: Strapi refuses, because the workflow requires the "Approved" stage before publishing. (Compliance is the only role with publish rights on products, so the refusal is shown from this window; the country editor has no Publish button at all.)
5. Shortcut if time is short: skip 1 to 3 and open "Casa Sicura" in Italian instead; the seed left it in "Changes requested", assigned to Italy Editor, with a review note already written. Do step 4 on it.

**The moment:** the publish button is blocked by the workflow, not by a person remembering to check email.

**Business outcome:** lower compliance risk. Regulated content cannot go live without the defined approval, and every step is recorded, so fewer incidents, fewer fines, and faster audits.

**Talk track**
- *(the outcome first)* "For regulated content the outcome that matters is this: nothing goes live without the approval you define, every step is recorded, and the approval loop takes hours instead of a week. Today that loop usually lives in email and a spreadsheet, and under deadline pressure it gets skipped. Here is what enforces it."
- *(review workflows: stages and assignment)* "First, a review workflow on the content type. The Italian page is ready, so I move it from Draft to Compliance review and assign it to the compliance team. That is the entire handoff. No email, no 'did you see my message', no spreadsheet to update."
- *(the dashboard widget)* "Second, as compliance my dashboard shows what is assigned to me. No digging, no asking what is waiting."
- *(stage change with a comment)* "Third, the APR wording is wrong for Italy, so I write the reason in the Review note field and send it back to Changes requested, reassigned to the Italian editor. The reason travels with the entry. The editor sees exactly what to fix, so the second round takes minutes."
- *(required stage for publishing)* "Fourth, the rule that makes it real: if the editor tries to publish anyway, Strapi refuses, because this content type requires the Approved stage before publishing. Not a convention, a rule the system enforces."
- *(close)* "Workflow stages, assignment, and the required stage for publishing are what turn your approval policy into something the tool enforces and records. Fewer incidents, and an answer ready when someone asks who approved this. How long does one approval loop take you today?"

**Objection it answers:** "Our approval process is in email and Excel, and it works."

**Features and tier:** Review workflows with stages, assignees, stage permissions and required stage for publishing. Enterprise (verify). Without a licence, this scene is a recording.

**Pause question:** "Who has to approve a product page in your organisation before it goes live?"

---

### Scene 4: Fix, approve, preview
*Starts as Italian country editor, switches to compliance reviewer.*

**Start:** the rejected draft.

**Actions**
1. Italian window: fix the rate wording ("TAEG 6,4% ..."), stage back to "Compliance review", assignee Compliance Reviewer. Save.
2. Compliance window: stage "Approved". Save. Now Publish is allowed; do not click it yet.
3. Click Preview: the real product page, draft content, inside the admin, with the price card on the right showing the new rate. Desktop and mobile toggle at the top. Change the tagline in the form, save, and the preview refreshes.
4. Switch the preview between draft and published: for Motor Flex the published side is empty (never published), for Casa Sicura it shows the live page against the draft. Then publish.

**The moment:** the "is this what will actually be published?" check takes seconds and needs no developer or staging deploy.

**Business outcome:** fewer live errors and faster sign-off. The accountable person approves the real page in seconds instead of a staging deploy and a round of screenshots.

**Talk track**
- *(the outcome first)* "The outcome: nobody publishes something they have not seen, and the person accountable signs off on the real page in seconds instead of a staging deploy and a round of screenshots. That is the fear with headless, editors publishing blind. Here is what removes it."
- *(fix and approve)* "Back as the Italian editor, I fix the wording and resubmit. As compliance, I approve. The page may go live, but first let us look at it."
- *(Live Preview)* "Preview. The real site, the real template, rendering the draft, inside the CMS. Desktop and mobile. No staging deploy, no developer, no screenshot sent around. The 'what will it look like' question is answered here."
- *(editing from the side panel, if available)* "I change the title and the preview updates. Corrections happen in the same place they are seen."
- *(draft versus published toggle)* "And I flip between the draft and what is live today, so legal compares exactly what changes before signing off."
- *(close)* "Live Preview and Draft & Publish are what make the last check before go-live a few seconds instead of a deploy. Fewer surprises on the live site, faster sign-off. Who signs off visually today, and how do they see the page?"

**Objection it answers:** "Headless means our editors cannot see what they are doing."

**Features and tier:** Live Preview and draft & publish: Community. Editing from the preview side panel: check whether this part is gated before promising it.

**Pause question:** "Who signs off visually today, and how do they see the page?"

---

### Scene 5: Three weeks later, something is wrong
*Logged in as compliance reviewer.*

**Start:** story: a wrong rate has been noticed on the live Italian page.

**Actions**
1. Settings > Audit logs. Filter user "Italy Editor", action "Update entry": the edits on "Auto Essenziale" with date and time, and the "Publish entry" lines by Compliance Reviewer right after. Open one line: the payload shows the field that changed.
2. Content Manager > Products (Italian) > "Auto Essenziale" > clock icon: six versions. The latest says 6.9, two versions earlier says 4.9, each with author and date.
3. Open the 4.9 version and click Restore.
4. The entry is back as a draft with 4.9, status Modified, ready for the workflow again. The live site still shows 6.9 until it is approved and published.

**The moment:** an audit question answered in one screen, and a rollback with no developer.

**Business outcome:** lower cost of mistakes. An audit question is answered in one screen and a wrong change is reversed in a minute by the business team, not a developer.

**Talk track**
- *(the outcome first)* "Three weeks later a wrong rate is spotted on the live Italian page. The outcome you want: who did it and when, answered in one screen, and the old version back in two clicks, by the compliance team, without a ticket. Today that is usually an hour of asking around and a developer to restore. Here is what makes it a minute."
- *(Audit logs)* "First, the audit log. Filter by Product and the last seven days: who changed the rate, at what time, from which role. This is the record an auditor or a regulator asks for, already written. No reconstruction from memory and chat history."
- *(Content history)* "Second, content history on the entry. Every saved version with author and date. I open the version before the change and compare. The correct rate is right there."
- *(restore)* "Third, restore. One click. It comes back as a draft, so it goes through the same approval before going live. Fast, and still compliant."
- *(the everyday case)* "The same two features handle ordinary cases: the holiday version of a page in December, the normal one back in January. Two clicks, no developer."
- *(close)* "Audit logs and content history are what turn a day of digging into one filter, and a bad change into a one-minute fix by the business team. Lower risk and lower cost every time something goes wrong. How do you answer 'who changed this' today?"

**Objection it answers:** "We need an audit trail for compliance and today we reconstruct it by hand."

**Features and tier:** Content history: Growth or Enterprise. Audit logs: Enterprise. Without a licence, a recording.

**Pause question:** "How do you answer 'who changed this' today?"

---

### Scene 6: The platform team's view
*Logged in as platform admin.*

**Start:** Settings.

**Actions**
1. Settings > Roles: Super Admin, HQ editor, Country editor FR, DE, IT, Compliance reviewer. Open "Country editor IT": create, read, update per content type, no publish, and inside Product the unchecked boxes on Legal disclaimer, Blocks and Review note.
2. Settings > Single Sign-On: the default role for auto-registered users and the "local authentication for super admins only" switch. No provider is configured in the demo; say which ones are supported rather than clicking through. (SSO is a talking point unless the licence includes it; the seed prints a WARNING if not.)
3. Settings > API Tokens: create one live, read-only, custom scope Product find and findOne, name it "Mobile app". Thirty seconds, and it shows the point better than a pre-made one.
4. Content-type builder: open the Product schema. It is a JSON file in the repo, reviewed in pull requests like any code, and read-only in production.
5. One sentence on hosting: self-hosted on their cloud with as many lower environments as they want, or Strapi Cloud.

**The moment:** least privilege is the default, identity comes from their provider, and the content model is code.

**Business outcome:** lower integration and security cost. One backend feeds every channel, identity and permissions pass the security review without custom work, and the content model follows the existing change process.

**Talk track**
- *(the outcome first)* "For the platform team the outcomes are three: least privilege without a custom project, identity from your own provider, and a content model governed like the rest of your code. Plus one backend feeding every channel, so adding a channel is not an integration project. Here is what delivers each one."
- *(RBAC)* "Least privilege comes from roles. Here is the Italian country editor: create, read, update, delete and publish separate per content type, and inside Product down to the single field. That is how the legal wording was locked and the rate left open. Out of the box, not after a six-month permissions project."
- *(SSO)* "Identity comes from SSO with your provider: Okta, Entra ID, Google, SAML, LDAP and a few hundred others. New users arrive with a default role you choose, so nobody lands with more rights than they should. Local login stays for super admins only, so a provider outage does not lock you out. Joiners, movers and leavers are handled where you already handle them."
- *(API tokens)* "Every channel gets its own API token with its own scope: this one is read-only, Products and News, for the mobile app. Adding a partner portal is a token, not a project."
- *(content-type builder and schema as code)* "The content model is a JSON file in your repository. Developers change it in code, review it in a pull request, test it in a lower environment; in production the builder is read-only. The content model follows your existing change process."
- *(hosting)* "And you run it where your security team wants it: your own cloud with as many lower environments as you need, or Strapi Cloud if you would rather not operate it."
- *(close)* "Roles, SSO, scoped tokens, schema as code and your choice of hosting are what make the security review short and the integration list shorter. What would your security review ask about this that I have not shown?"

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

