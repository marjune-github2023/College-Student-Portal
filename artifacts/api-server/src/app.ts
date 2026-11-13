import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { loadUser } from "./middlewares/auth";

const app: Express = express();

// The preview proxy terminates TLS; trust its forwarding headers so req.ip and
// req.secure reflect the real client.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// The browser talks to the API same-origin through the frontend dev server, so
// cross-origin access is denied unless a deployment explicitly allows an origin.
const allowedOrigins = (process.env.APP_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * CSRF defence for cookie-authenticated mutations.
 *
 * A cross-site form post carries the session cookie (SameSite=Lax allows
 * top-level GET navigation but not cross-site POST). It cannot, however, add a
 * custom request header without a CORS preflight, and `cors` above refuses
 * unknown origins. So requiring this header is the CSRF gate; nothing about it
 * is trusted for authorization.
 */
function csrfGuard(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  if (req.get("x-requested-with") !== "XMLHttpRequest") {
    res.status(403).json({ error: "csrf_failed", message: "Request rejected." });
    return;
  }

  next();
}

app.use(csrfGuard);
app.use(loadUser);

app.use("/api", router);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err: error }, "Unhandled request error");
  if (res.headersSent) return;
  res.status(500).json({ error: "server_error", message: "Something went wrong. Please try again." });
});

export default app;
