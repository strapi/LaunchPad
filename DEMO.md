# DEMO: Meridian Mutual Group

The demo script. Status of every scene after `yarn seed` with a licence applied: **built and live**. Without a licence, scenes 1 (Releases), 3 (Review workflows) and 5 (Audit logs, Content history) are **talking points or recordings**; the seed prints which features it skipped.

Users and passwords are in `README.md`. Reset between demos with `yarn seed`.

## Before the call

`yarn dev` is running and http://localhost:3000 loads. Two browser windows (one normal, one private): one logged in as `it.editor@meridian-demo.test`, one as `compliance@meridian-demo.test`; scenes 3 and 4 are a hand-off between them. The Products list shows the "Review stage" column: if it does not, the licence features are off, check the `[seed] WARNING` lines. If a previous demo left the data in a mess, `yarn seed`.

## Where things are

In the admin:
- Review workflow: Settings > Review workflows > "Regulated content" (Product and Regulated document, required stage Approved). The stage and assignee are in the right-hand panel of an entry. The reason for a rejection goes in the **Review note** field of the product (only compliance can edit it).
- Releases: left menu > Releases. Three are waiting: "Motor Flex launch", "Winter promo start", "Winter promo end".
- Audit logs: Settings > Audit logs (compliance reviewer and super admin can read them).
- Content history: on an entry, the clock icon in the right-hand panel.
- Live Preview: on an entry, the Preview button opens the website in draft mode inside the admin. Desktop and mobile toggle at the top, and a draft/published switch.
- Locked fields for country teams: Legal disclaimer, the page blocks and Review note on Product; Regulatory reference on Regulated document. Everything else on the product is theirs, including the SEO fields and the intro offer.
- Intro offer: on Product, "Has intro offer" is a boolean; "Intro offer text" only appears when it is on (a conditional field). Home Secure has it on in all four languages, Motor Flex 2027 in English.
- FAQs: their own collection ("Website" folder), related to products and pages. "How do I find an agent near me" is on the home page and on three products from one entry.
- Media Library: 11 folders. Products, Regulated documents (FR, DE, IT), Newsroom (News, Press), Brand, People, Offices.

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

Every scene uses the same layout: **Start** (what is on screen), **The moment**, **Business outcome**, then the **Talk track** as numbered points, each with a **Say** line (the spoken script, outcome first, then the feature that makes it possible) and a **Show** line (exactly what to click or point at while saying it, with the real entry and field names), then **Objection it answers**, **Features and tier** and the **Pause question**. Read the Say lines aloud as written the first few times; shorten them once they are yours. Pause after every scene: the two reference demos that worked best both stopped after each block and asked "any workflow you were thinking about while I was clicking?".

**Opening line (before scene 0):**
"Strapi does not ship a frontend. What you will see on the right is a Next.js site we built to look like yours; everything on it, text, images, structure, comes from the Strapi admin on the left. The frontend can be anything: a website, a mobile app, a partner portal, a screen in a branch."

---

### Scene 0: Orientation
*3 minutes. Logged in as HQ editor.*

**Start:** Strapi admin home page. The website open in a second tab on http://localhost:3000/en.

**The moment:** one place, every piece of content, with its state visible at a glance.

**Business outcome:** visibility. Leadership knows what is live, what is pending and what is at risk, without a status meeting.

**Talk track**

1. The outcome first
   - Say: "Before I click anything, let me tell you what I think you would get out of this, and then I will show you where it comes from. Three things. You always know what is live, what is waiting and what is at risk, without calling a status meeting. A legal or brand change is made once and shows up in every market. And your teams can prepare next quarter's content while this quarter's is being served, with no chance of it leaking early. If any of those sounds like a problem you have today, that is the one to watch for."
   - Show: nothing yet. Admin home page on screen, hands off the mouse.
2. The dashboard
   - Say: "The first one is this dashboard. Drafts, what is assigned to me, upcoming releases, what is in review, who changed what recently. All live. This is where your content lead starts the morning, with coffee, instead of a spreadsheet."
   - Show: point at each widget as you name it (entries, drafts, assigned to me, upcoming releases, review stage, recent audit activity). Drag one widget to another position.
3. How content is organised
   - Say: "The second one comes from how the content is organised. You see folders that match how your teams already think: products and the regulated documents that go with them, the website, the newsroom, and the site settings. Collection types are the things you have many of. Single types exist once, like the legal footer. Change the footer here and it changes in every market. One regulatory update, done once, and nobody has to remember the other three sites."
   - Show: open the Content Manager. Collapse and expand the folders "Products & regulated documents", "Website", "Newsroom". Point at "Site settings" with Global, Header, Footer. If asked, the folders are configuration in the repository, not something each editor sets up.
4. Single source of truth, one level down
   - Say: "Same idea one level down. If a question is frequently asked, it is on more than one page. So FAQs are their own thing here, and this one is used on the home page and on three products. Fix the answer once, it is fixed everywhere. That is what I mean by single source of truth, and it is the end of 'which page has the old version'."
   - Show: open FAQs, then "How do I find an agent near me". Point at the relations in the right-hand panel: the home page and three products.
5. Draft & Publish
   - Say: "The third one is Draft & Publish, and it is simpler than it sounds. Three states. Draft is not live. Published is live. Modified means it is live and there is a newer version being worked on. So you can prepare the new rates while the old ones are still being served. That is the end of 'nobody touch the page until launch day'."
   - Show: open Products. Point at the Status column: a Draft, a Published, a Modified entry.
6. Each team, its own view
   - Say: "And one small thing I like showing, because it saves real time every day: each team sets up its own list view. Compliance wants to see the review stage and who it is assigned to. Country teams want locale and last editor. Two clicks, no developer, and everyone sees what matters to them."
   - Show: column picker on the Products list, add Locale and Review stage.
7. Close
   - Say: "Everything you see here is also available through an API. I am going to show you a website today, but the same approved correction updates the app and the agent portal at the same time. We have customers feeding the screens in their branches from this, and one feeding digital displays at bus stops. One source of truth, every channel."
   - Show: switch to the website tab, scroll the home page once, back to the admin.

**Objection it answers:** "Our content is spread across five tools."

**Features and tier:** admin dashboard, Content Manager, list view configuration, draft & publish. All Community.

**Pause question:** "Which of your content lives outside the website today?"

---

### Scene 1: Headquarters prepares a launch
*Logged in as HQ editor.*

**Start:** Products list, locale English. Website tab on http://localhost:3000/en/products/motor-essential.

**The moment:** one release, every locale and market inside it, one date, invisible until then.

**Business outcome:** time to market. A multi-country launch goes from weeks of coordination to one scheduled action, so campaigns and products reach customers on the date the business promised.

**Talk track**

1. The outcome first
   - Say: "Here is the outcome in this scene: a product launch across three countries becomes one prepared, approved, scheduled action. So when the business asks for a date, you can give one and keep it. I have seen how this usually goes: three teams, a long email thread, and someone pressing publish at six in the morning in each market, hoping nothing was missed. Let me show you what changes that."
   - Show: nothing yet. Products list on screen.
2. Blocks
   - Say: "Pages here are built from blocks. Your developers build the hero, the coverage table, the documents section once, and then the content team assembles pages from them. So a layout change is a drag, not a ticket. And the brand stays consistent, not because people are careful, but because only the approved blocks exist. Faster marketing, fewer requests to IT, both at once."
   - Show: open "Motor Flex 2027" (draft). Scroll the "Blocks" zone: hero, coverage table, documents, FAQ, CTA band. Drag the coverage table above the hero, then back. Flip to the website tab and point at the same blocks rendered on Motor Essential.
3. Languages
   - Say: "Then languages. One page, four languages, one place. HQ writes the master, the countries adapt it. Nobody has to hunt through an inbox for the latest French version."
   - Show: the locale switcher top right: English in draft, FR, DE, IT empty.
4. The release
   - Say: "And now the part that actually changes the launch: a release. Everything that has to go live together goes in here, across content types and languages, with a date and a time zone. Launch day, nine in the morning Paris time, all of it goes live at once. And the thing that has to come down at the same moment, last year's banner, is an unpublish action in the same release. One decision, every market, exact timing."
   - Show: right-hand panel, "Add to release": "Motor Flex launch", action Publish, locale English. Then Releases > "Motor Flex launch": the press release, the teaser banner and now the product, with the date and the Europe/Paris timezone.
5. Invisible until then
   - Say: "If I go back to the product, it tells me which release it belongs to, so everyone knows it is scheduled. And if I look at the public site, nothing. No early leak of a rate, no six a.m. shift in Milan."
   - Show: back on the entry, point at the release indicator in the panel. Website tab: http://localhost:3000/en/products, nine products, no Motor Flex.
6. The everyday version
   - Say: "And here is the everyday version of the same thing. This banner at the top of the site is a piece of content on its own. The winter campaign message is already written and approved. One release publishes it on the first of December, another one unpublishes it in January, across all four languages. The marketing team set it up in October and does not think about it again. No reminders, no Monday morning 'is the Christmas banner still up'."
   - Show: Releases > "Winter promo start" (publish "Winter cover check", four locales) and "Winter promo end" (unpublish, same four). Website tab: point at the banner at the top, today the default "find an agent" message.
7. The webhook
   - Say: "One more thing you will not see on screen: when the release fires, Strapi tells your site to refresh its cache. So the launch is live for customers at the moment you promised, not whenever someone remembers to clear a cache."
   - Show: nothing. If asked, Settings > Webhooks has the release events.
8. Close
   - Say: "So that is blocks, languages in one place, scheduled releases and the webhook. Together they turn weeks of coordination into one action. Can I ask, how many people touch a launch today, and how many of them are involved only because the tool cannot do this?"
   - Show: nothing. If someone asks "can I copy a product to make a variant": three dots on any entry > Duplicate, one sentence, move on.

**Objection it answers:** "We already have a CMS." Reply: "Does it publish a multi-country launch as one scheduled action?"

**Features and tier:** content-type builder, components and dynamic zones, draft & publish, i18n: Community. Releases with scheduling and release webhooks: Growth or Enterprise. Without a licence, stop after point 3 and show the recording of points 4 to 6.

**Pause question:** "How does a launch date get coordinated across your markets today?"

---

### Scene 2: The Italian country team adapts it
*Switch to the window logged in as Italian country editor.*

**Start:** Content Manager > Products.

**The moment:** the same page, but this user can only touch Italy, and only the fields Italy is allowed to touch.

**Business outcome:** local speed at lower cost. Country teams run their own changes, central IT stops being a bottleneck, and the group template is protected, so fewer tickets and fewer incidents.

**Talk track**

1. The outcome first
   - Say: "This scene is about your local teams. The outcome: they run their own changes at their own pace, and they cannot break what they are not supposed to touch. In my experience you usually get one or the other. Speed with risk, or control with a queue at central IT. Here is how you get both."
   - Show: nothing yet.
2. Roles and locales
   - Say: "I am now logged in as someone on the Italian team. Same Strapi, same content. But look at the locale selector: Italian only. The German page is not even in my list. That is not a guideline someone wrote in a wiki, it is the role. And it means central IT stops being the bottleneck for local changes, because it does not have to be the safety net any more."
   - Show: the locale selector on the Products list: Italiano only. "Motor Flex 2027" is in the list with no Italian content yet.
3. Creating the Italian version
   - Say: "Now I create the Italian version from the English one, and the structure comes with it. I translate what matters, I set the Italian rate. This is a morning's work for the local team, not a ticket waiting in a queue."
   - Show: open "Motor Flex 2027", locale Italiano, "Fill in from another locale" > English. Rename to "Auto Flex 2027", translate the tagline, set the local rate to 6.4.
4. Field-level permissions
   - Say: "And here is the control side. The legal wording and the page structure belong to HQ and compliance. For me they are greyed out. Permissions go down to the single field: legal wording locked, local rate open. So a mistake in Italy cannot touch the group template, and it cannot touch the French site."
   - Show: scroll to "Legal disclaimer" and to the blocks: greyed out. Point at name, tagline, rate, rate wording and the SEO fields: open.
5. The form shows only what applies
   - Say: "A small thing that matters for whoever you onboard: the form only shows what is relevant. Intro offer off, no text field. Intro offer on, there it is. Your developers decide these rules once, so a new editor sees a short, clean form, not forty fields and a wiki page explaining which ones to ignore. And the SEO fields are right here on the product, where the country team can fill them, not in a plugin only IT knows about."
   - Show: switch "Has intro offer" on: "Intro offer text" appears. Type "Offerta lancio: primo anno al 5,9%". Switch it off, the field disappears. Switch it back on.
6. Prepare, not release
   - Say: "I can save, but notice there is no publish button for me. This role prepares, it does not release. Publishing stays with the people who are accountable for it."
   - Show: Save. Point at the top right: no Publish button.
7. Images and documents
   - Say: "Last thing, images. A real media library with folders: products, the regulated documents by market, newsroom, brand. Drag and drop, bulk move, and it connects to your DAM if you have one. The Italian team puts the Italian PDFs in the Italian folder and nobody has to search a shared drive."
   - Show: Media Library from the left menu. The folder tree: Products, Regulated documents (FR, DE, IT), Newsroom (News, Press), Brand, People, Offices. Drag one image from People into Offices and back.
8. Close
   - Say: "Roles, locales and field-level permissions are what let you remove the queue without adding risk. Fewer tickets, faster local campaigns, and no more 'who changed the group header' on a Monday morning. Which fields would you want locked for your local teams?"
   - Show: nothing.

**Objection it answers:** "Our local teams keep breaking things, so everything goes through central IT." And its twin, usually from marketing: "How do we onboard someone new without overwhelming them?" Answer: the role shows them only what they can touch, the form shows only what applies, and each field can carry a hint written by your team.

**Features and tier:** i18n, custom admin roles, field-level and locale-level permissions, conditional fields, Media Library with folders. All Community.

**Pause question:** "Which fields would you want locked for local teams?"

---

### Scene 3: Compliance rejects it
*Two windows: Italian country editor and compliance reviewer.*

**Start:** the Italian draft from scene 2, still open in the Italian window.

**The moment:** the publish button is blocked by the workflow, not by a person remembering to check email.

**Business outcome:** lower compliance risk. Regulated content cannot go live without the defined approval, and every step is recorded, so fewer incidents, fewer fines, and faster audits.

**Talk track**

1. The outcome first
   - Say: "For regulated content, the outcome that matters is simple to say and hard to get: nothing goes live without the approval you define, every step is recorded, and the approval loop takes hours instead of a week. Most teams I talk to run that loop in email and a spreadsheet. It works, until a deadline, and then it gets skipped. Let me show you what enforces it."
   - Show: nothing yet.
2. The handoff
   - Say: "There is a review workflow on this content type. The Italian page is ready, so I move it from Draft to Compliance review and I assign it to the compliance team. That is the whole handoff. No email, no 'did you see my message', no spreadsheet to update afterwards."
   - Show: Italian window, right-hand panel: Review stage from "Draft" to "Compliance review", assignee Compliance Reviewer. Save.
3. Assigned to me
   - Say: "Now I am compliance. My dashboard shows me what is assigned to me. No digging, no asking around what is waiting on me."
   - Show: switch to the compliance window. Admin home: the "Assigned to me" widget lists the entry. Open it.
4. Send it back with the reason
   - Say: "I open it and I can see the APR wording is wrong for Italy. So I write the reason in the Review note, I send it back to Changes requested, and I reassign it to the Italian editor. The reason travels with the entry. The editor sees exactly what to fix, so the second round takes minutes, not another week."
   - Show: point at the rate wording (no "TAEG"). In "Review note" type "Il tasso deve riportare la dicitura TAEG secondo le regole IVASS". Stage to "Changes requested", assignee Italy Editor. Save.
5. The rule that makes it real
   - Say: "And here is the rule that makes all of this real. Even I, with publish rights, cannot publish from here. This content type requires the Approved stage before anything goes live. Not a convention, a rule the system enforces. And the Italian editor does not have a publish button at all."
   - Show: still in the compliance window, click Publish: Strapi refuses. (Compliance is the only role with publish rights on products, so the refusal is shown from this window.)
6. Close
   - Say: "Workflow stages, assignment, and the required stage for publishing are what turn your approval policy into something the tool enforces and records. Fewer incidents, and an answer ready when someone asks who approved this. How long does one approval loop take you today, honestly?"
   - Show: nothing.

**Shortcut if time is short:** skip points 2 to 4 and open "Casa Sicura" in Italian in the compliance window; the seed left it in "Changes requested", assigned to Italy Editor, with a review note already written. Do point 5 on it.

**Objection it answers:** "Our approval process is in email and Excel, and it works."

**Features and tier:** Review workflows with stages, assignees, stage permissions and required stage for publishing. Enterprise (verify). Without a licence, this scene is a recording.

**Pause question:** "Who has to approve a product page in your organisation before it goes live?"

---

### Scene 4: Fix, approve, preview
*Same two windows.*

**Start:** the rejected draft.

**The moment:** the "is this what will actually be published?" check takes seconds and needs no developer or staging deploy.

**Business outcome:** fewer live errors and faster sign-off. The accountable person approves the real page in seconds instead of a staging deploy and a round of screenshots.

**Talk track**

1. The outcome first
   - Say: "The outcome here: nobody publishes something they have not seen, and the person who is accountable signs off on the real page in seconds, not after a staging deploy and a round of screenshots. This is the fear people have with headless, that editors are publishing blind. Let me show you why they are not."
   - Show: nothing yet.
2. Fix and approve
   - Say: "Back as the Italian editor, I fix the wording and resubmit. As compliance, I approve. The page may go live now. But before it does, let us look at it."
   - Show: Italian window: rate wording to "TAEG 6,4% per pagamento mensile", stage "Compliance review", assignee Compliance Reviewer, Save. Compliance window: stage "Approved", Save. Do not publish yet.
3. Live Preview
   - Say: "This is Preview. The real site, the real template, rendering the draft, inside the CMS. Desktop and mobile. No staging deploy, no developer, no screenshot sent around on Friday afternoon. The 'what will it actually look like' question is answered right here."
   - Show: compliance window, click Preview. The product page renders inside the admin; the price card on the right shows the new rate and the intro offer line. Click the mobile toggle, then back to desktop.
4. Edit where you see it
   - Say: "I change the tagline, and the preview updates. Corrections happen in the same place they are seen."
   - Show: change the tagline in the form next to the preview, save. The preview refreshes.
5. The brand stays in the brand
   - Say: "And a detail your marketing team will like: the button has a variant field, primary, secondary, outline. Developers defined what each one looks like, once, in the brand's colours. Editors pick from a list and see the result here. Nobody types a hex code, nobody breaks the brand, and nobody opens a ticket to change a button."
   - Show: open the hero block, change the CTA "Variant" from primary to outline, save: the button in the preview changes style. Put it back to primary.
6. Draft against live
   - Say: "And I can flip between the draft and what is live today, so legal sees exactly what changes before signing off. Approved, previewed, published."
   - Show: the draft/published switch in the preview. For Motor Flex the published side is empty (never published); for Casa Sicura it shows the live page against the draft. Then click Publish.
7. Close
   - Say: "Live Preview and Draft & Publish make the last check before go-live a few seconds instead of a deploy. Fewer surprises on the live site, faster sign-off. Who does the visual sign-off for you today, and how do they see the page?"
   - Show: nothing.

**Objection it answers:** "Headless means our editors cannot see what they are doing."

**Features and tier:** Live Preview and draft & publish: Community. Editing from the preview side panel: check whether this part is gated before promising it.

**Pause question:** "Who signs off visually today, and how do they see the page?"

---

### Scene 5: Three weeks later, something is wrong
*Compliance window.*

**Start:** website tab on http://localhost:3000/it/products/motor-essential, price card showing 6.9%.

**The moment:** an audit question answered in one screen, and a rollback with no developer.

**Business outcome:** lower cost of mistakes. An audit question is answered in one screen and a wrong change is reversed in a minute by the business team, not a developer.

**Talk track**

1. The outcome first
   - Say: "Let me jump three weeks ahead. Somebody notices a wrong rate on the live Italian page, 6.9 instead of 4.9. What you want in that moment is two things: who did it and when, answered in one screen, and the old version back in two clicks, by the compliance team, without opening a ticket. Today that is usually an hour of asking around and a developer to restore from a backup. Here is how it becomes a minute."
   - Show: the website tab, point at 6.9% in the price card.
2. Who did it
   - Say: "First, the audit log. I filter by user and by action, and there it is: who changed the rate, at what time, from which role, and who published it right after. This is the record an auditor or a regulator asks for, already written. No reconstructing it from memory and chat history."
   - Show: Settings > Audit logs. Filter user "Italy Editor", action "Update entry". Open one line: the payload shows the rate field. Point at the "Publish entry" lines by Compliance Reviewer right after.
3. The version before
   - Say: "Then content history, on the entry itself. Every saved version with author and date. I open the version from before the change, and the correct rate is right there."
   - Show: Content Manager > Products (Italian) > "Auto Essenziale" > clock icon. Six versions. Open the one with 4.9.
4. Restore
   - Say: "And restore. One click."
   - Show: click Restore.
5. Still compliant
   - Say: "It comes back as a draft, so it goes through the same approval before going live. The live page still shows the old value until compliance approves. Fast, and still compliant. And the same two features handle the ordinary cases too: the holiday version of a page in December, the normal one back in January. Two clicks, no developer."
   - Show: the entry back in draft with 4.9, status Modified. Refresh the website tab: still 6.9.
6. Close
   - Say: "Audit logs and content history turn a day of digging into one filter, and a bad change into a one-minute fix by the business team. Lower risk, lower cost, every time something goes wrong. How do you answer 'who changed this' today?"
   - Show: nothing.

**Objection it answers:** "We need an audit trail for compliance and today we reconstruct it by hand."

**Features and tier:** Content history: Growth or Enterprise. Audit logs: Enterprise. Without a licence, a recording.

**Pause question:** "How do you answer 'who changed this' today?"

---

### Scene 6: The platform team's view
*Logged in as platform admin.*

**Start:** Settings.

**The moment:** least privilege is the default, identity comes from their provider, and the content model is code.

**Business outcome:** lower integration and security cost. One backend feeds every channel, identity and permissions pass the security review without custom work, and the content model follows the existing change process.

**Talk track**

1. The outcome first
   - Say: "This last part is for your platform team, and I will keep it practical. Three outcomes: least privilege without a custom project, identity from your own provider, and a content model governed like the rest of your code. Plus one backend feeding every channel, so adding a channel is a token, not an integration project. Here is what delivers each one."
   - Show: nothing yet. Settings on screen.
2. Least privilege
   - Say: "Least privilege comes from roles. This is the Italian country editor we were using earlier: create, read, update and publish are separate per content type, and inside Product you can go down to the single field. That is how the legal wording was locked and the rate left open. Out of the box, not after a six-month permissions project."
   - Show: Settings > Roles. Open "Country editor IT": create, read, update per content type, no publish; inside Product, the unchecked boxes on Legal disclaimer, Blocks and Review note.
3. Identity
   - Say: "Identity comes from SSO with your provider: Okta, Entra ID, Google, SAML, LDAP, and a few hundred others. New users arrive with a default role you choose, so nobody lands with more rights than they should. Local login stays on for super admins only, so if the provider has a bad day you are not locked out. Joiners, movers and leavers are handled where you already handle them."
   - Show: Settings > Single Sign-On: the default role for auto-registered users and the "local authentication for super admins only" switch. No provider is configured in the demo, do not click further. (Talking point unless the licence includes SSO; the seed prints a WARNING if not.)
4. One token per channel
   - Say: "Every channel gets its own API token with its own scope. Let me make one: read-only, products only, for the mobile app. That took thirty seconds. Adding a partner portal is a token, not a project."
   - Show: Settings > API Tokens > create: name "Mobile app", read-only, custom scope Product find and findOne. Save, copy the token, close.
5. The model is code
   - Say: "And the content model is a JSON file in your repository. Developers change it in code, review it in a pull request, test it in a lower environment, and in production the builder is read-only. It follows the change process you already have."
   - Show: Content-Type Builder > Product. Then `strapi/src/api/product/content-types/product/schema.json` in the editor or on GitHub.
6. Hosting
   - Say: "You run it where your security team wants it: your own cloud, with as many lower environments as you need, or Strapi Cloud if you would rather not operate it."
   - Show: nothing.
7. Close
   - Say: "Roles, SSO, scoped tokens, schema as code and your choice of hosting. That is what makes the security review short and the integration list shorter. What would your security review ask about this that I have not shown?"
   - Show: nothing.

**Objection it answers:** "A headless CMS adds a security surface and an integration project."

**Features and tier:** RBAC and API tokens: Community. SSO: Enterprise, or Growth plus the SSO add-on. Self-hosting: Community.

**Pause question:** "What would your security review ask about this that I have not shown?"

---

### Closing
*2 minutes.*

Reset after the call: `yarn seed` puts everything back, including Motor Flex out of the release and Casa Sicura back in "Changes requested".

1. Recap the six handoffs, one sentence each.
2. Say: "The demo project is public on GitHub. Your engineers can clone it, add the trial licence we will send, and run every scene themselves in an afternoon."
3. If the question "and once it is built, who helps my marketing team get going?" comes up (it did in a reference demo): Enterprise includes support, and the Concierge advisory programme covers implementation sessions beyond the first 90 days. Verify the current terms with the Enterprise team before promising dates or scope, and send the support article after the call.
4. Agree the next step before leaving the call.

