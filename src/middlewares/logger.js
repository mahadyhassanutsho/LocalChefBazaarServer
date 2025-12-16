import logger from "../utils/logger.js";

const requestLogger = logger.child({ module: "request handler" });

export const logRequest = async (req, _res, next) => {
  requestLogger.info(`from ${req.host} ${req.method} at ${req.path}`);
  next();
};
