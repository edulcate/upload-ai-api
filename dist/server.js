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

// src/server.ts
var import_fastify = require("fastify");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/get-all-prompts.ts
async function getAllPrompts(app2) {
  app2.get("/prompts", async () => {
    const prompts = prisma.prompt.findMany();
    return prompts;
  });
}

// src/routes/upload-video.ts
var import_multipart = require("@fastify/multipart");
var import_node_path = __toESM(require("path"));
var import_node_fs = __toESM(require("fs"));
var import_node_crypto = require("crypto");
var import_node_stream = require("stream");
var import_node_util = require("util");
var pump = (0, import_node_util.promisify)(import_node_stream.pipeline);
async function uploadVideo(app2) {
  app2.register(import_multipart.fastifyMultipart, {
    limits: {
      fileSize: 1048576 * 25
    }
  });
  app2.post("/videos", async (request, reply) => {
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

// src/routes/create-transcription.ts
var import_zod = require("zod");

// src/lib/openai.ts
var import_openai = require("openai");
var import_config = require("dotenv/config");
var openai = new import_openai.OpenAI({
  apiKey: process.env.OPENAI_KEY
});

// src/routes/create-transcription.ts
var import_node_fs2 = require("fs");
async function createTranscription(app2) {
  app2.post("/videos/:videoId/transcription", async (request, reply) => {
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
    const audioReadStream = (0, import_node_fs2.createReadStream)(videoPath);
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

// src/routes/create-ai-completion.ts
var import_zod2 = require("zod");
var import_ai = require("ai");
async function createAICompletion(app2) {
  app2.post("/ai/complete", async (request, reply) => {
    const bodySchema = import_zod2.z.object({
      videoId: import_zod2.z.string().uuid(),
      prompt: import_zod2.z.string(),
      temperature: import_zod2.z.number().min(0).max(1).default(0.5)
    });
    const { videoId, prompt, temperature } = bodySchema.parse(request.body);
    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId
      }
    });
    if (!video.transcription) {
      return reply.status(400).send({
        error: "Video transcription was not generated yet."
      });
    }
    const promptMessage = prompt.replace("{transcription}", video.transcription);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      temperature,
      messages: [
        {
          role: "user",
          content: promptMessage
        }
      ],
      stream: true
    });
    const stream = (0, import_ai.OpenAIStream)(response);
    (0, import_ai.streamToResponse)(stream, reply.raw, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      }
    });
  });
}

// src/server.ts
var import_cors = require("@fastify/cors");
var app = (0, import_fastify.fastify)();
app.register(import_cors.fastifyCors, {
  origin: "*"
});
app.register(getAllPrompts);
app.register(uploadVideo);
app.register(createTranscription);
app.register(createAICompletion);
app.listen({
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
  host: "0.0.0.0"
}).then((response) => {
  console.log("HTTP Server Running!");
});
