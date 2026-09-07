// Minimal static file server for the exported site in ./out
// Usage: npm run preview  (after `npm run build`)

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const root = "out";
const port = Number(process.env.PORT || 4321);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

createServer(async (req, res) => {
  try {
    const path = decodeURIComponent((req.url || "/").split("?")[0]);
    let fp = join(root, path);
    let s = await stat(fp).catch(() => null);
    if (s?.isDirectory()) {
      fp = join(fp, "index.html");
      s = await stat(fp).catch(() => null);
    }
    if (!s) {
      fp = join(root, path + ".html");
      s = await stat(fp).catch(() => null);
    }
    if (!s) {
      const body = await readFile(join(root, "404.html")).catch(() => "Not found");
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      res.end(body);
      return;
    }
    res.writeHead(200, { "content-type": types[extname(fp)] || "application/octet-stream" });
    res.end(await readFile(fp));
  } catch (err) {
    res.writeHead(500);
    res.end(String(err));
  }
}).listen(port, () => {
  console.log(`Preview of ./out running at http://localhost:${port}`);
});
