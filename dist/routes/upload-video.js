var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/upload-video.ts
var upload_video_exports = {};
__export(upload_video_exports, {
  uploadVideo: () => uploadVideo
});
module.exports = __toCommonJS(upload_video_exports);
var import_multipart = require("@fastify/multipart");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/upload-video.ts
var import_node_path = __toESM(require("path"));
var import_node_fs = __toESM(require("fs"));
var import_node_crypto = require("crypto");
var import_node_stream = require("stream");
var import_node_util = require("util");
var pump = (0, import_node_util.promisify)(import_node_stream.pipeline);
async function uploadVideo(app) {
  app.register(import_multipart.fastifyMultipart, {
    limits: {
      fileSize: 1048576 * 25
    }
  });
  app.post("/videos", async (request, reply) => {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({
        error: "Missing file input"
      });
    }
    const extension = import_node_path.default.extname(data.filename);
    if (extension !== ".mp3") {
      return reply.status(400).send({
        error: "Invalid input type. The input type MUST BE .mp3"
      });
    }
    const fileBaseName = import_node_path.default.basename(data.filename, extension);
    const fileUploadName = `${fileBaseName}-${(0, import_node_crypto.randomUUID)()}${extension}`;
    const uploadDestination = import_node_path.default.resolve(__dirname, "../../tmp", fileUploadName);
    await pump(data.file, import_node_fs.default.createWriteStream(uploadDestination));
    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination
      }
    });
    return video;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  uploadVideo
});
