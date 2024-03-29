import { getClient, initDiscord } from "./lib/discord";
import { ClientResponse } from "./lib/http";
import { refreshPalworldStatus } from "./lib/status";
import { handleInfo } from "./routes/info/route";
import { handleMutationCycle } from "./routes/mutation-cycle/route";
import { handleUpdates } from "./routes/updates/route";

await initDiscord();
const client = getClient();
console.log(`Ready! Logged in as ${client.user.tag}`);

Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/mutation-cycle")) {
      return handleMutationCycle(req, url);
    }
    if (url.pathname.startsWith("/api/updates")) {
      return handleUpdates(req, url);
    }
    if (url.pathname.startsWith("/api/info")) {
      return handleInfo(req, url);
    }
    return new ClientResponse("404!", { status: 404 });
  },
});

while (true) {
  try {
    await refreshPalworldStatus();
  } catch (e) {
    //
  }
  await new Promise((resolve) => setTimeout(resolve, 60000));
}
