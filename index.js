"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/server.ts
var import_body_parser = require("body-parser");
var import_express2 = __toESM(require("express"));
var import_morgan = __toESM(require("morgan"));
var import_cors = __toESM(require("cors"));
var import_path = __toESM(require("path"));
var OpenApiValidator = __toESM(require("express-openapi-validator"));

// src/v1/services/property-service.ts
var propertyService = {
  list: () => __async(void 0, null, function* () {
    return [];
  }),
  create: (property) => __async(void 0, null, function* () {
    return property;
  })
};

// src/v1/routes/properties.ts
var import_express = require("express");
var propertiesRouter = (0, import_express.Router)();
propertiesRouter.get("/properties", (_req, res) => __async(void 0, null, function* () {
  res.status(200).json(yield propertyService.list());
}));
propertiesRouter.post("/properties", (req, res) => __async(void 0, null, function* () {
  res.status(200).json(yield propertyService.create(req.body));
}));

// src/server.ts
var createServer = () => {
  const app = (0, import_express2.default)();
  const apiSpecPath = import_path.default.resolve(__dirname, "./public/openapi.yaml");
  app.disable("x-powered-by").use((0, import_morgan.default)("dev")).use((0, import_body_parser.urlencoded)({ extended: true })).use((0, import_body_parser.json)()).use((0, import_cors.default)()).use(import_express2.default.static(apiSpecPath)).use(
    OpenApiValidator.middleware({
      apiSpec: apiSpecPath,
      validateRequests: true,
      validateResponses: true
    })
  ).use("/v1", propertiesRouter);
  return app;
};

// src/index.ts
var port = process.env.PORT || 5001;
var server = createServer();
server.listen(Number(port), "0.0.0.0");
