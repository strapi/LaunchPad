import EventSource from "eventsource";
import { revalidatePath } from "next/cache";

interface Options {
  // Options
  url: string;
}

export const listeners = {
  GET: (options: Options) => (req: Request) => {
    const encoder = new TextEncoder();
    // Create a streaming response
    const customReadable = new ReadableStream({
      start(controller) {
        const evtSource = new EventSource(options.url);

        evtSource.onmessage = function (event) {
          console.log("Received strapi event", event);
          revalidatePath("/", "layout");
          controller.enqueue(encoder.encode(`data: ${event.data}\n\n`));
        };
      },
    });

    // Return the stream response and keep the connection alive
    return new Response(customReadable, {
      // Set the headers for Server-Sent Events (SSE)
      headers: {
        Connection: "keep-alive",
        "Content-Encoding": "none",
        "Cache-Control": "no-cache, no-transform",
        "Content-Type": "text/event-stream; charset=utf-8",
      },
    });
  },
};
