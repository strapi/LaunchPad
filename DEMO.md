# DEMO: Meridian Mutual Group

The demo script. Status of every scene after `yarn seed` with a licence applied: **built and live**. Without a licence, scenes 1 (Releases), 3 (Review workflows) and 5 (Audit logs, Content history) are **talking points or recordings**; the seed prints which features it skipped.

Users and passwords are in `README.md`. Reset between demos with `yarn seed`.

Where things are in the admin:
- Review workflow: Settings > Review workflows > "Regulated content" (Product and Regulated document, required stage Approved). The stage and assignee are in the right-hand panel of an entry. The reason for a rejection goes in the **Review note** field of the product (only compliance can edit it).
- Releases: left menu > Releases. Three are waiting: "Motor Flex launch", "Winter promo start", "Winter promo end".
- Audit logs: Settings > Audit logs (compliance reviewer and super admin can read them).
- Content history: on an entry, the clock icon in the right-hand panel.
- Live Preview: on an entry, the Preview button opens the website in draft mode inside the admin. Desktop and mobile toggle at the top.

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
1. Open "Motor Flex 2027", already in draft. Scroll it: hero, coverage table, documents, FAQ. Each is a component in a dynamic zone. Drag one block above another to show the page-builder feel. Say the components were built once by developers and are reused across pages.
2. Show the locale switcher top right: English in draft, FR, DE, IT empty.
3. Open Releases. Open "Motor Flex launch". Add the product page with action Publish. Show the scheduled date and the timezone picker.
4. Back on the entry, show the "to be released in" indicator. Open the public site in another tab: the product is not there yet.

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
1. Show that the locale selector offers only Italian, and pages for other markets are not editable.
2. Open "Motor Flex 2027", create the Italian locale from the English one, translate the title and change the local rate field.
3. Try to edit the shared template block (for example the hero layout): read-only for this role.
4. Save as draft.

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
1. In the review workflow panel, move the entry from "Draft" to "Compliance review" and assign it to the compliance team.
2. Log in as compliance reviewer. Open "Assigned to me" on the dashboard. Open the entry.
3. Point at the rate wording. Move the stage back to "Changes requested" and write the reason in the "Review note" field: "Rate must show the APR wording per IVASS rules".
4. Back as country editor, try to publish: blocked, because the required stage for publishing is "Approved".

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
1. Fix the rate wording. Move the stage to "Compliance review" again.
2. As compliance, move it to "Approved".
3. Open Preview: the exact page as it will render, with a desktop and mobile toggle, showing the draft content. Edit the title from the side panel and watch the preview update.
4. Switch the preview between draft and published to show the difference.

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
1. Open Audit logs. Filter by content type Product and by the last 7 days. Show who changed the rate, when, from which role.
2. Open the entry. Open Content history. Show the list of versions with author and date. Open the version from before the change and compare.
3. Restore that version with one click.
4. Show the restored entry back in draft, ready for the workflow again.

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
1. Roles: show the four demo roles. Open Country editor: create, read, update, delete and publish per content type, and the field-level checkboxes.
2. SSO settings: the provider configured, the default role for auto-registered users, and the local login kept for super admins only (if the identity provider is down, you are not locked out).
3. API tokens: a read-only token scoped to Products and News, for the mobile app.
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

1. Recap the six handoffs, one sentence each.
2. Say: "The demo project is public on GitHub. Your engineers can clone it, add the trial licence we will send, and run every scene themselves in an afternoon."
3. Agree the next step before leaving the call.

