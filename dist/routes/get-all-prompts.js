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

// src/routes/get-all-prompts.ts
var get_all_prompts_exports = {};
__export(get_all_prompts_exports, {
  getAllPrompts: () => getAllPrompts
});
module.exports = __toCommonJS(get_all_prompts_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/get-all-prompts.ts
async function getAllPrompts(app) {
  app.get("/prompts", async () => {
    const prompts = prisma.prompt.findMany();
    return prompts;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAllPrompts
});
