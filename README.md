# LaunchPad - Official Strapi Demo

![LaunchPad](./LaunchPad.jpg)

Welcome aboard **LaunchPad**, the official Strapi demo application, where we launch your content into the stratosphere at the speed of _"we-can't-even-measure-it!"_.
This repository contains the following:

- A Strapi project with content-types and data already onboard
- A Next.js client that's primed and ready to fetch the content from Strapi faster than you can say "blast off!"

## 🌌 Get started

Strap yourself in! You can get started with this project on your local machine by following the instructions below, or you can [request a private instance on our website](https://strapi.io/demo)

### Prerequisites

- **Node.js** v18 or higher
- **Yarn** as your package manager (this project uses Yarn internally for its scripts)

> **Don't have Yarn installed?** You can enable it via Node.js Corepack:
>
> ```sh
> corepack enable
> ```
>
> Or install it globally via npm:
>
> ```sh
> npm install -g yarn
> ```

## 1. Clone and Install

To infinity and beyond! Clone the repo and install root dependencies:

```sh
git clone https://github.com/strapi/launchpad.git
cd launchpad
yarn install
```

## 2. Setup

Run the setup script to install dependencies in both projects (Strapi and Next.js) and copy the environment files:

```sh
yarn setup
```

## 3. Seed the Data

Populate your Strapi instance with demo content:

```sh
yarn seed
```

## 4. Start the Development Servers

LaunchPad ships four frontends against one Strapi backend. Each command
starts Strapi first, waits for it to be ready, then starts that frontend:

```sh
yarn dev             # Strapi + Next.js   (default)
yarn dev:astro       # Strapi + Astro
yarn dev:nuxt        # Strapi + Nuxt
yarn dev:tanstack    # Strapi + TanStack Start
```

| Frontend       | URL                         |
| -------------- | --------------------------- |
| Next.js        | http://localhost:3000       |
| Nuxt           | http://localhost:3001       |
| TanStack Start | http://localhost:3002       |
| Astro          | http://localhost:4321       |
| Strapi admin   | http://localhost:1337/admin |

Visit http://localhost:1337/admin to create your first Strapi user, then
open whichever frontend you started. You're now a spacefaring content master!

### Preview mode

The Strapi admin's Preview button opens one frontend at a time, because
Strapi's preview handler returns a single URL. Choose which:

```sh
yarn use nuxt        # Preview button now opens Nuxt
yarn use             # show the current target
```

`yarn dev:<framework>` sets this for you. Strapi reads the value at
startup, so switching while it is running requires a restart — `yarn use`
warns you when that is the case.

### Checking your environment

```sh
yarn check:env
```

Verifies that `PREVIEW_SECRET` matches between `strapi/.env` and every
frontend. A mismatch is the usual cause of preview coming back 401.

## Features Overview ✨

### User

<br />

- **An intuitive, minimal editor** The editor allows you to pull in dynamic blocks of content. It’s 100% open-source, and it’s fully extensible.<br />
- **Media Library** Upload images, video or any files and crop and optimize their sizes, without quality loss.<br />
- **Flexible content management** Build any type of category, section, format or flow to adapt to your needs. <br />
- **Sort and Filter** Built-in sorting and filtering: you can manage thousands of entries without effort.<br />
- **User-friendly interface** The most user-friendly open-source interface on the market.<br />
- **SEO optimized** Easily manage your SEO metadata with a repeatable field and use our Media Library to add captions, notes, and custom filenames to optimize the SEO of media assets.<br /><br />

### Global

<br />

- [Customizable API](https://strapi.io/features/customizable-api): Automatically build out the schema, models, controllers for your API from the editor. Get REST or GraphQL API out of the box without writing a single line of code.<br />
- [Media Library](https://strapi.io/features/media-library): The media library allows you to store your images, videos and files in your Strapi admin panel with many ways to visualize and manage them.<br />
- [Role-Based Access Control (RBAC)](https://strapi.io/features/custom-roles-and-permissions): Role-Based Access Control is a feature available in the Administration Panel settings that let your team members have access rights only to the information they need.<br />
- [Internationalization (i18n)](https://strapi.io/features/internationalization): Internationalization (i18n) lets you create many content versions, also called locales, in different languages and for different countries.<br />
- [Audit Logs](https://strapi.io/blog/reasons-and-best-practices-for-using-audit-logs-in-your-application): The Audit Logs section provides a searchable and filterable display of all activities performed by users of the Strapi application<br />
- [Data transfer](https://strapi.io/blog/importing-exporting-and-transferring-data-with-the-strapi-cli): Streams your data from one Strapi instance to another Strapi instance.<br />
- [Review Worfklows](https://docs.strapi.io/user-docs/settings/review-workflows): Create and manage any desired review stages for your content, enabling your team to collaborate in the content creation flow from draft to publication. <br />

## Resources

[Docs](https://docs.strapi.io) • [Discord](https://discord.strapi.io) • [YouTube](https://www.youtube.com/c/Strapi/featured) • [Strapi Design System](https://design-system.strapi.io/) • [Marketplace](https://market.strapi.io/) • [Cloud Free Trial](https://cloud.strapi.io)

## Customization

- The Strapi application contains a custom population middlewares in every api route.

- The Strapi application contains a postinstall script that will regenerate an uuid for the project in order to get some anonymous usage information concerning this demo. You can disable it by removing the uuid inside the `./strapi/packages.json` file.

- The Strapi application contains a patch for the @strapi/admin package. It is only necessary for the hosted demos since we automatically create the Super Admin users for them when they request this demo on our website.
