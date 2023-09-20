var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/create-transcription.ts
var create_transcription_exports = {};
__export(create_transcription_exports, {
  createTranscription: () => createTranscription
});
module.exports = __toCommonJS(create_transcription_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/lib/openai.ts
var import_openai = require("openai");
var import_config = require("dotenv/config");
var openai = new import_openai.OpenAI({
  apiKey: process.env.OPENAI_KEY
});

// src/routes/create-transcription.ts
var import_node_fs = require("fs");
async function createTranscription(app) {
  app.post("/videos/:videoId/transcription", async (request, reply) => {
    const paramsSchema = import_zod.z.object({
      videoId: import_zod.z.string().uuid()
    });
    const { videoId } = paramsSchema.parse(request.params);
    const bodySchema = import_zod.z.object({
      prompt: import_zod.z.string()
    });
    const { prompt } = bodySchema.parse(request.body);
    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId
      }
    });
    const videoPath = video.path;
    const audioReadStream = (0, import_node_fs.createReadStream)(videoPath);
    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
      language: "pt",
      response_format: "json",
      temperature: 0,
      prompt
    });
    await prisma.video.update({
      where: {
        id: videoId
      },
      data: {
        transcription: response.text
      }
    });
    return reply.status(200).send({
      success: true
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createTranscription
});
