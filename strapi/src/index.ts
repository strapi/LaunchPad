// import type { Core } from '@strapi/strapi';

import { PassThrough } from "stream";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register() {
    strapi.server.router.get("/events-subscription", async (ctx) => {
      ctx.request.socket.setTimeout(0);
      ctx.req.socket.setNoDelay(true);
      ctx.req.socket.setKeepAlive(true);

      ctx.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const stream = new PassThrough();

      strapi.eventHub.subscribe(async (name, event) => {
        const payload = JSON.stringify({
          name,
          model: event.model,
          uid: event.uid,
        });

        stream.write(`data: ${payload}\n\n`);
      });

      ctx.status = 200;
      ctx.body = stream;
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
