import { PostHog } from "posthog-node";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let posthogClient: PostHog | null = null;

if (key) {
  posthogClient = new PostHog(key, {
    host,
    flushAt: 1, // Flush immediately in serverless functions
    flushInterval: 0,
  });
}

/**
 * Capture analytics events from Next.js Server Components, API routes, or Server Actions.
 */
export function trackServerEvent(userId: string, event: string, properties?: Record<string, unknown>) {
  if (posthogClient) {
    posthogClient.capture({
      distinctId: userId,
      event: event,
      properties: {
        ...properties,
        $lib: "posthog-node",
      },
    });
  } else {
    console.log(`[POSTHOG MOCK EVENT] DistinctId: [${userId}] | Event: [${event}] | Properties:`, properties);
  }
}

/**
 * Flush and shutdown the PostHog client to ensure all queued events are sent.
 */
export async function shutdownPostHog() {
  if (posthogClient) {
    await posthogClient.shutdown();
  }
}
