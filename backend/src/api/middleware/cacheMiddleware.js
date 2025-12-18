import crypto from "crypto";
import cacheClient from "../../Infrastructure/config/CacheClient.js";

function sortObjectDeep(input) {
  if (Array.isArray(input)) {
    return input.map(sortObjectDeep);
  } else if (input && typeof input === "object") {
    const sorted = {};
    for (const key of Object.keys(input).sort()) {
      sorted[key] = sortObjectDeep(input[key]);
    }
    return sorted;
  }
  return input;
}

function stableStringify(obj) {
  try {
    return JSON.stringify(sortObjectDeep(obj));
  } catch {
    return JSON.stringify(obj); 
  }
}

function buildCacheKey({ namespace, method, originalUrl, body }) {
  const base = `${method.toUpperCase()}:${originalUrl}`;
  const bodyStr = stableStringify(body || {});
  const hash = crypto.createHash("sha256").update(bodyStr).digest("hex");
  return `${namespace}:${base}:${hash}`;
}

export function cacheMiddleware(options = {}) {
  const ttlSeconds = Number(
    options.ttlSeconds ?? process.env.CACHE_TTL_SECONDS ?? 60
  );
  const namespace = (options.namespace ??
    process.env.CACHE_NAMESPACE ??
    "route:calc:v1").replace(/:+$/, "");
  const refreshOnHit = options.refreshOnHit ?? true;

  return async function cacheMiddlewareHandler(req, res, next) {
    const cacheKey = buildCacheKey({
      namespace,
      method: req.method,
      originalUrl: req.originalUrl || req.url,
      body: req.body,
    });

    try {
      const cached = await cacheClient.get(cacheKey);
      if (cached !== null) {
        console.log(`[Cache] HIT: ${cacheKey}`);
        if (refreshOnHit) {
          try {
            await cacheClient.set(cacheKey, cached, ttlSeconds);
          } catch {}
        }
        res.set('X-Cache', 'HIT');
        return res.status(200).json(cached); 
      }
      console.log(`[Cache] MISS: ${cacheKey}`);
    } catch (err) {
      console.warn("[Cache] get failed, bypassing cache:", err?.message || err);
    }

    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    res.locals.__cacheStored = false;

    res.json = async (body) => {
      try {
        if (
          res.statusCode >= 200 &&
          res.statusCode < 300 &&
          body !== undefined
        ) {
          await cacheClient.set(cacheKey, body, ttlSeconds);
          res.locals.__cacheStored = true;
        }
      } catch (err) {
        console.warn("[Cache] set (json) failed:", err?.message || err);
      }
      res.set('X-Cache', 'MISS');
      return originalJson(body);
    };

    res.send = async (body) => {
      try {
        if (
          !res.locals.__cacheStored &&
          res.statusCode >= 200 &&
          res.statusCode < 300 &&
          body !== undefined
        ) {
          let payload = body;
          if (Buffer.isBuffer(body)) {
            payload = body.toString("utf8");
          }
          if (typeof payload === 'string') {
            try { payload = JSON.parse(payload); } catch {}
          }
          await cacheClient.set(cacheKey, payload, ttlSeconds);
        }
      } catch (err) {
        console.warn("[Cache] set (send) failed:", err?.message || err);
      }
      res.set('X-Cache', 'MISS');
      return originalSend(body);
    };

    return next();
  };
}