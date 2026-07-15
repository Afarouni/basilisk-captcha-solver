#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

const OBF = /^_0x[0-9a-f]+$/i;
const PLACEHOLDER = /^[ML]\d+$/;
const GEN = { comments: true, retainLines: false, jsescOption: { minimal: true } };

const RESERVED = new Set(("break case catch class const continue debugger default delete do else export extends " +
  "finally for function if import in instanceof new return super switch this throw try typeof var void while with " +
  "yield let static enum await async implements package protected interface private public arguments eval undefined " +
  "null true false NaN Infinity document window navigator screen crypto Promise Math JSON Object Array String Number " +
  "Boolean Date RegExp Error Uint8Array Uint32Array DataView Function Symbol performance console setTimeout " +
  "clearTimeout setInterval clearInterval requestAnimationFrame cancelAnimationFrame fetch atob btoa TextEncoder " +
  "TextDecoder URL Blob Image XMLHttpRequest location history").split(/\s+/));

function parse(code) {
  return parser.parse(code, { sourceType: "script", errorRecovery: true });
}

function wrapperFn(ast) {
  const body = ast.program.body;
  if (body.length !== 1 || body[0].type !== "ExpressionStatement") return null;
  let e = body[0].expression;
  if (e.type === "UnaryExpression") e = e.argument;
  if (e.type === "SequenceExpression") e = e.expressions[e.expressions.length - 1];
  if (e.type !== "CallExpression") return null;
  const c = e.callee;
  if (c.type === "FunctionExpression" || c.type === "ArrowFunctionExpression") {
    if (c.body && c.body.type === "BlockStatement") return c;
  }
  return null;
}

function wrapperBody(ast) {
  const fn = wrapperFn(ast);
  return fn ? fn.body.body : ast.program.body;
}

function uniquify(code) {
  const ast = parse(code);
  const wrap = wrapperFn(ast);
  const jobs = [];
  traverse(ast, {
    Scopable(p) {
      const isModule = p.scope.block.type === "Program" || (wrap && p.scope.block === wrap);
      for (const name of Object.keys(p.scope.bindings)) {
        if (OBF.test(name)) jobs.push([p.scope, name, isModule]);
      }
    },
  });
  let m = 0, l = 0;
  const modules = [], locals = [];
  for (const [scope, name, isModule] of jobs) {
    if (!scope.bindings[name]) continue;
    const tag = isModule ? "M" + String(++m).padStart(4, "0") : "L" + String(++l).padStart(4, "0");
    scope.rename(name, tag);
    (isModule ? modules : locals).push(tag);
  }
  return { code: generate(ast, GEN).code, modules, locals };
}

function canUse(scope, name, oldName) {
  if (RESERVED.has(name)) return false;
  if (name !== oldName && scope.hasOwnBinding(name)) return false;
  const outer = scope.parent && scope.parent.getBinding(name);
  if (outer) {
    const capturesRef = outer.referencePaths.concat(outer.constantViolations || []).some(rp => {
      for (let s = rp.scope; s; s = s.parent) if (s === scope) return true;
      return false;
    });
    if (capturesRef) return false;
  }
  return true;
}

function applyNames(code, map) {
  const ast = parse(code);
  const jobs = [];
  traverse(ast, {
    Scopable(p) {
      for (const n of Object.keys(p.scope.bindings)) if (PLACEHOLDER.test(n)) jobs.push([p.scope, n]);
    },
  });
  let applied = 0;
  const missing = [];
  for (const [scope, old] of jobs) {
    if (!scope.bindings[old]) continue;
    const want = map[old];
    if (!want) { missing.push(old); continue; }
    let desired = String(want).replace(/[^A-Za-z0-9_$]/g, "");
    if (!desired || /^[0-9]/.test(desired)) desired = "_" + desired;
    if (desired === old) { applied++; continue; }
    let final = desired, k = 2;
    while (!canUse(scope, final, old)) final = desired + "_" + k++;
    scope.rename(old, final);
    applied++;
  }
  return { code: generate(ast, GEN).code, applied, missing };
}

function mechanicalNames(code) {
  const ast = parse(code);
  const map = {};
  const isPlaceholder = n => /^L\d+$/.test(n);
  traverse(ast, {
    VariableDeclarator(p) {
      const id = p.node.id, init = p.node.init;
      if (!id || id.type !== "Identifier" || !init) return;
      if (init.type === "ThisExpression" && isPlaceholder(id.name)) { map[id.name] = "self"; return; }
      if (init.type === "CallExpression" && init.callee &&
          ["FunctionExpression", "ArrowFunctionExpression"].includes(init.callee.type) &&
          init.callee.body && init.callee.body.type === "BlockStatement" && !PLACEHOLDER.test(id.name)) {
        const ret = init.callee.body.body.find(s => s.type === "ReturnStatement");
        if (ret && ret.argument && ret.argument.type === "Identifier" && isPlaceholder(ret.argument.name)) {
          map[ret.argument.name] = id.name;
        }
      }
    },
    CatchClause(p) {
      const par = p.node.param;
      if (par && par.type === "Identifier" && isPlaceholder(par.name)) map[par.name] = "error";
    },
    ForStatement(p) {
      const init = p.node.init;
      if (!init || init.type !== "VariableDeclaration" || !init.declarations[0]) return;
      const d = init.declarations[0];
      if (d.id.type !== "Identifier" || !isPlaceholder(d.id.name)) return;
      if (!d.init || d.init.type !== "NumericLiteral") return;
      let depth = 0;
      for (let q = p.parentPath; q; q = q.parentPath) {
        if (q.isFunction()) break;
        if (q.isForStatement()) depth++;
      }
      map[d.id.name] = ["i", "j", "k", "m", "n"][Math.min(depth, 4)];
    },
  });
  return map;
}

function moduleSummaries(code) {
  const ast = parse(code);
  const info = new Map();
  const owner = new Map();
  traverse(ast, {
    Scopable(p) {
      for (const n of Object.keys(p.scope.bindings)) {
        if (/^M\d+$/.test(n) && !owner.has(n)) owner.set(n, p.scope.bindings[n]);
      }
    },
  });
  for (const [tok, binding] of owner) {
    const node = binding.path.node;
    const start = node.start != null ? node.start : 0;
    const end = node.end != null ? node.end : 0;
    let snippet = code.slice(start, end);
    if (snippet.length > 2200) snippet = snippet.slice(0, 2200) + "\n/* ...truncated... */";
    info.set(tok, { token: tok, kind: node.type, snippet, members: new Set(), uses: binding.references });
  }
  traverse(ast, {
    MemberExpression(p) {
      const o = p.node.object;
      if (o.type === "Identifier" && info.has(o.name) && !p.node.computed && p.node.property.type === "Identifier") {
        info.get(o.name).members.add(p.node.property.name);
      }
    },
  });
  return [...info.values()].map(v => ({
    token: v.token, kind: v.kind, uses: v.uses,
    members: [...v.members].slice(0, 40),
    snippet: v.snippet,
  }));
}

function label(node) {
  if (node.type === "FunctionDeclaration" && node.id) return node.id.name;
  if (node.type === "ExpressionStatement" && node.expression.type === "AssignmentExpression") {
    const lft = node.expression.left;
    if (lft.type === "MemberExpression" && lft.property && lft.property.name) {
      const obj = lft.object.type === "MemberExpression" ? (lft.object.object.name || "?") : (lft.object.name || "?");
      return `${obj}.${lft.property.name}`;
    }
  }
  if (node.type === "VariableDeclaration" && node.declarations[0] && node.declarations[0].id.name) {
    return node.declarations[0].id.name;
  }
  return node.type;
}

function isClassIIFE(st) {
  return st.type === "VariableDeclaration" && st.declarations[0] && st.declarations[0].init &&
    st.declarations[0].init.type === "CallExpression" &&
    st.declarations[0].init.callee &&
    ["FunctionExpression", "ArrowFunctionExpression"].includes(st.declarations[0].init.callee.type);
}

function extractUnits(code, maxLines) {
  const ast = parse(code);
  const units = [];
  const add = (node, outer) => {
    const src = code.slice(node.start, node.end);
    const toks = [...new Set(src.match(/\bL\d{4}\b/g) || [])];
    if (!toks.length) return;
    units.push({ id: units.length, label: (outer ? outer + " :: " : "") + label(node), locals: toks, code: src });
  };
  for (const st of wrapperBody(ast)) {
    if (isClassIIFE(st)) {
      const outer = label(st);
      const inner = st.declarations[0].init.callee.body.body;
      for (const s of inner) if (s.type !== "ReturnStatement") add(s, outer);
    } else {
      add(st, null);
    }
  }
  const seen = new Set(units.flatMap(u => u.locals));
  const orphan = [...new Set(code.match(/\bL\d{4}\b/g) || [])].filter(t => !seen.has(t));
  const batches = [];
  let cur = [], curLines = 0;
  for (const u of units) {
    const n = u.code.split("\n").length;
    if (cur.length && curLines + n > maxLines) { batches.push(cur); cur = []; curLines = 0; }
    cur.push(u); curLines += n;
  }
  if (cur.length) batches.push(cur);
  return { units, batches, orphan };
}

function blank(code) {
  const ast = parse(code);
  traverse(ast, { Identifier(p) { p.node.name = "_"; } });
  return generate(ast, { comments: false, compact: true }).code;
}

async function pool(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const k = i++;
      if (k >= items.length) return;
      out[k] = await fn(items[k], k);
    }
  }));
  return out;
}

const NAME_SCHEMA = {
  type: "object",
  properties: {
    names: {
      type: "array",
      items: {
        type: "object",
        properties: { token: { type: "string" }, name: { type: "string" } },
        required: ["token", "name"],
        additionalProperties: false,
      },
    },
  },
  required: ["names"],
  additionalProperties: false,
};

const PRESETS = {
  anthropic: { kind: "anthropic", model: "claude-sonnet-5", keyEnv: "ANTHROPIC_API_KEY" },
  ollama:    { kind: "openai", baseUrl: "http://localhost:11434/v1", model: "qwen2.5-coder:14b", keyEnv: null },
  lmstudio:  { kind: "openai", baseUrl: "http://localhost:1234/v1", model: "local-model", keyEnv: null },
  gemini:    { kind: "openai", baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
               model: "gemini-3-flash", keyEnv: "GEMINI_API_KEY" },
  groq:      { kind: "openai", baseUrl: "https://api.groq.com/openai/v1",
               model: "llama-3.3-70b-versatile", keyEnv: "GROQ_API_KEY" },
  openrouter:{ kind: "openai", baseUrl: "https://openrouter.ai/api/v1",
               model: "qwen/qwen3-coder:free", keyEnv: "OPENROUTER_API_KEY" },
};

const JSON_RULE = `\n\nReturn ONLY a JSON object of this exact shape, with no markdown fence and no prose:
{"names":[{"token":"L0001","name":"self"},{"token":"L0002","name":"response"}]}
Include one entry for EVERY token listed. Do not invent tokens that were not listed.`;

function extractJson(text) {
  let t = String(text || "").trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) t = fence[1].trim();
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  return JSON.parse(t);
}

function toMap(parsed) {
  const map = {};
  if (parsed && Array.isArray(parsed.names)) {
    for (const e of parsed.names) if (e && e.token && e.name) map[e.token] = String(e.name);
  } else if (parsed && typeof parsed === "object") {
    for (const [k, v] of Object.entries(parsed)) if (PLACEHOLDER.test(k) && typeof v === "string") map[k] = v;
  }
  return map;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function makeAnthropic(o) {
  const Anthropic = require("@anthropic-ai/sdk");
  const client = new Anthropic({ maxRetries: 5, timeout: 600000 });
  return async function ask(system, prompt) {
    const r = await client.messages.create({
      model: o.model,
      max_tokens: 16000,
      system,
      output_config: { effort: o.effort, format: { type: "json_schema", schema: NAME_SCHEMA } },
      messages: [{ role: "user", content: prompt }],
    });
    const text = (r.content.find(b => b.type === "text") || { text: "" }).text;
    return { map: toMap(JSON.parse(text)), usage: r.usage };
  };
}

function makeOpenAICompat(o) {
  const key = o.keyEnv ? process.env[o.keyEnv] : null;
  if (o.keyEnv && !key) throw new Error(`${o.keyEnv} is not set (provider: ${o.provider})`);
  const url = o.baseUrl.replace(/\/+$/, "") + "/chat/completions";
  return async function ask(system, prompt) {
    let lastErr;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const headers = { "content-type": "application/json" };
        if (key) headers.authorization = `Bearer ${key}`;
        const r = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: o.model,
            messages: [{ role: "system", content: system + JSON_RULE }, { role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0,
            top_p: 1,
            seed: 7,
            max_tokens: 8000,
          }),
        });
        if (r.status === 429 || r.status >= 500) {
          const wait = Number(r.headers.get("retry-after") || 0) * 1000 || 2000 * Math.pow(2, attempt);
          lastErr = new Error(`HTTP ${r.status}`);
          await sleep(wait);
          continue;
        }
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${(await r.text()).slice(0, 300)}`);
        const j = await r.json();
        const text = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : "";
        const map = toMap(extractJson(text));
        if (!Object.keys(map).length) throw new Error("model returned no usable names");
        const u = j.usage || {};
        return { map, usage: { input_tokens: u.prompt_tokens || 0, output_tokens: u.completion_tokens || 0 } };
      } catch (e) {
        lastErr = e;
        await sleep(1500 * (attempt + 1));
      }
    }
    throw lastErr;
  };
}

function makeClient(o) {
  return o.kind === "anthropic" ? makeAnthropic(o) : makeOpenAICompat(o);
}

const SYS_MODULE = `You are naming the top-level (module-scope) identifiers of a de-obfuscated JavaScript file.
The file is a browser widget originally written in TypeScript, compiled to ES5, then obfuscated; string decoding,
control flow and dead code have already been restored. Property names and method names are already meaningful and
correct. The only things left to name are placeholders of the form M#### (module-scope variables, classes and
functions).

For each M#### token you are given: how it is declared, how many times it is referenced, the property names accessed
on it, and its source (possibly truncated). Choose the name a human author would have written.

Rules:
- Classes and constructors: PascalCase (e.g. Constants, StyleUtils, ElementsCreator, BasiliskCaptcha).
- Functions: camelCase describing what they do (e.g. sha256Bytes, rotr32, roundHalfAwayFromZero, isValidTrailPoint).
- Constant tables/arrays: SCREAMING_SNAKE_CASE or a descriptive camelCase (e.g. SHA256_K).
- TypeScript helper functions keep their conventional names (__assign, __awaiter, __generator, __extends, __spreadArray).
- Infer from the property names: a thing with .serverUrl/.protocolVersion/.widgetVersion is Constants.
- Never give two different M#### tokens the same name.
- Only produce entries for M#### tokens listed. Do not rename anything else.
Return one entry per token, for every token given.`;

const SYS_LOCAL = `You are naming placeholder local variables in a de-obfuscated JavaScript file (a browser widget,
originally TypeScript compiled to ES5 then obfuscated, since de-obfuscated). String decoding, control flow and dead
code are already fixed, and ALL method names, property names and module-level names are already meaningful and
correct. The ONLY things left to name are placeholders of the form L#### (local variables and function parameters).

For every L#### token listed in a unit's locals, choose a clear, concise camelCase name that a human author would have
written, inferred from how the identifier is used in that unit's code.

Guidelines:
- \`var X = this\` -> \`self\`; \`catch (X)\` -> \`error\`; a numeric for-loop counter -> \`i\`, \`j\`, \`k\`.
- Name by role/value: a document.createElement result -> \`el\` or something specific (button, canvas, span); a
  fetch(...) result -> \`response\`; parsed JSON -> \`data\`; a request payload -> \`body\`; a DOM event -> \`event\`;
  an array item in map/forEach -> a singular noun; bytes/Uint8Array -> \`bytes\`; a promise -> \`...Promise\`.
- Prefer specific descriptive names when usage makes meaning clear (siteKey, iv, cipher, nonce, ratio, angle, digest,
  ctx, rect, snapshot, seed, difficulty, trail).
- If a unit is labelled \`X :: ...\` and a local is the inner constructor of class X, name it X.
- The result must read like clean, hand-written source.
- NEVER assign the same name to two different L#### tokens in the SAME unit.
- Only produce entries for L#### tokens. Do not touch any other identifier.
Return one entry per token, for every token listed in the batch.`;

function modulePrompt(summaries) {
  const parts = summaries.map(s =>
    `### ${s.token}\ndeclared as: ${s.kind}\nreferences: ${s.uses}\nproperties accessed on it: ${s.members.join(", ") || "(none)"}\nsource:\n\`\`\`js\n${s.snippet}\n\`\`\``);
  return `Name every module-scope token below. Tokens: ${summaries.map(s => s.token).join(", ")}\n\n${parts.join("\n\n")}`;
}

function localPrompt(batch) {
  const parts = batch.map(u =>
    `### unit ${u.id} — ${u.label}\nlocals to name: ${u.locals.join(", ")}\n\`\`\`js\n${u.code}\n\`\`\``);
  const all = batch.flatMap(u => u.locals);
  return `Name every L#### token below (${all.length} total): ${all.join(", ")}\n\n${parts.join("\n\n")}`;
}

function args(argv) {
  const o = { input: null, out: null, ai: true, provider: "anthropic", model: null, baseUrl: null,
              effort: "medium", concurrency: 6, maxLines: 220, fetch: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-o" || a === "--out") o.out = argv[++i];
    else if (a === "--no-ai") o.ai = false;
    else if (a === "--provider") o.provider = argv[++i];
    else if (a === "--base-url") o.baseUrl = argv[++i];
    else if (a === "--model") o.model = argv[++i];
    else if (a === "--effort") o.effort = argv[++i];
    else if (a === "--concurrency") o.concurrency = parseInt(argv[++i], 10);
    else if (a === "--max-lines") o.maxLines = parseInt(argv[++i], 10);
    else if (a === "--fetch") o.fetch = true;
    else if (!a.startsWith("-")) o.input = a;
  }
  const p = PRESETS[o.provider];
  if (!p) throw new Error(`unknown provider "${o.provider}" (have: ${Object.keys(PRESETS).join(", ")})`);
  o.kind = p.kind;
  o.keyEnv = p.keyEnv;
  o.model = o.model || p.model;
  o.baseUrl = o.baseUrl || p.baseUrl;
  return o;
}

async function fetchLive() {
  const r = await fetch("https://basiliskcaptcha.com/challenge/get-url", {
    method: "POST", body: "", headers: { "content-type": "text/plain;charset=UTF-8" },
  });
  const j = await r.json();
  const js = await (await fetch(j.file_url)).text();
  return { code: js, url: j.file_url };
}

async function main() {
  const o = args(process.argv);
  if (!o.input && !o.fetch) {
    console.error(
      "usage: node deobf.js <obfuscated.js> [-o out.js]\n" +
      "       --fetch                 grab the current live widget instead of a file\n" +
      "       --no-ai                 mechanical only, leave M####/L#### placeholders\n" +
      "       --provider <name>       " + Object.keys(PRESETS).join(" | ") + "\n" +
      "       --model <id>            override the provider's default model\n" +
      "       --base-url <url>        override the provider's endpoint\n" +
      "       --concurrency <n>       parallel naming batches (default 6)\n" +
      "       --max-lines <n>         lines per naming batch (default 220)\n" +
      "\n" +
      "  local, free:  node deobf.js in.js --provider ollama --model qwen2.5-coder:7b\n" +
      "  free api:     node deobf.js in.js --provider gemini   (needs GEMINI_API_KEY)\n" +
      "  best quality: node deobf.js in.js --provider anthropic (needs ANTHROPIC_API_KEY)");
    process.exit(1);
  }

  let source, origin;
  if (o.fetch) {
    const f = await fetchLive();
    source = f.code; origin = f.url;
  } else {
    source = fs.readFileSync(o.input, "utf8");
    origin = o.input;
  }
  const marker = (source.split("\n", 1)[0].match(/\/\*!.*?\*\//) || ["(no marker)"])[0];
  const build = (source.match(/pool-20\d\d-\d\d-\d\d-[0-9a-f]+/) || ["(unknown build)"])[0];
  console.log(`input   : ${origin}`);
  console.log(`marker  : ${marker}`);
  console.log(`build   : ${build}`);
  console.log(`bytes   : ${source.length}`);

  const { webcrack } = await import("webcrack");
  const cracked = (await webcrack(source)).code;
  console.log(`webcrack: ${cracked.split("\n").length} lines`);

  const u = uniquify(cracked);
  console.log(`tokens  : ${u.modules.length} module-scope, ${u.locals.length} locals`);

  let named = u.code;
  const map = {};

  if (o.ai) {
    const ask = makeClient(o);
    let inTok = 0, outTok = 0;

    const summaries = moduleSummaries(named);
    console.log(`phase A : naming ${summaries.length} module-scope tokens (${o.provider}/${o.model})`);
    const a = await ask(SYS_MODULE, modulePrompt(summaries));
    Object.assign(map, a.map);
    inTok += a.usage.input_tokens; outTok += a.usage.output_tokens;
    const gotA = Object.keys(a.map).length;
    console.log(`        : ${gotA}/${summaries.length} named -> ${summaries.slice(0, 8).map(s => a.map[s.token] || "?").join(", ")}...`);
    named = applyNames(named, map).code;

    const mech = mechanicalNames(named);
    const mechN = Object.keys(mech).length;
    const kinds = {};
    for (const v of Object.values(mech)) kinds[v] = (kinds[v] || 0) + 1;
    const topKinds = Object.entries(kinds).sort((x, y) => y[1] - x[1]).slice(0, 6)
      .map(([k, v]) => `${k}x${v}`).join(" ");
    console.log(`mech    : ${mechN} locals named deterministically (no AI) -> ${topKinds}`);
    Object.assign(map, mech);
    named = applyNames(named, mech).code;

    const ex = extractUnits(named, o.maxLines);
    const remaining = new Set(ex.units.flatMap(u => u.locals));
    console.log(`phase B : ${remaining.size} ambiguous locals in ${ex.units.length} units -> ${ex.batches.length} batches`);
    const results = await pool(ex.batches, o.concurrency, async (batch, k) => {
      const want = batch.flatMap(b => b.locals);
      const got = {};
      let usage = { input_tokens: 0, output_tokens: 0 };
      for (let attempt = 0; attempt < 3; attempt++) {
        const missing = want.filter(t => !got[t]);
        if (!missing.length) break;
        const sub = attempt === 0 ? batch
          : batch.map(u => ({ ...u, locals: u.locals.filter(t => missing.includes(t)) })).filter(u => u.locals.length);
        if (!sub.length) break;
        try {
          const r = await ask(SYS_LOCAL, localPrompt(sub));
          for (const [t, n] of Object.entries(r.map)) if (want.includes(t) && !got[t]) got[t] = n;
          usage.input_tokens += r.usage.input_tokens;
          usage.output_tokens += r.usage.output_tokens;
        } catch (e) {
          console.log(`        : batch ${String(k).padStart(2, "0")} attempt ${attempt + 1} failed - ${e.message}`);
        }
      }
      const miss = want.filter(t => !got[t]).length;
      console.log(`        : batch ${String(k).padStart(2, "0")} ${Object.keys(got).length}/${want.length} named${miss ? ` (${miss} still missing)` : ""}`);
      return { map: got, usage };
    });
    for (const r of results) { Object.assign(map, r.map); inTok += r.usage.input_tokens; outTok += r.usage.output_tokens; }
    console.log(`tokens  : ${inTok} in, ${outTok} out`);
  }

  const applied = applyNames(named, map);
  named = applied.code;

  const left = (named.match(/\b[ML]\d{4}\b/g) || []).length;
  const obfLeft = (named.match(/_0x[0-9a-f]+/gi) || []).length;
  const banner = "/*! basilisk-captcha widget - de-obfuscated & renamed */\n";
  const final = banner + named + "\n";

  const ok = blank(cracked) === blank(named);
  console.log(`verify  : ${ok ? "STRUCTURAL MATCH (pure rename, logic identical)" : "MISMATCH - RENAME ALTERED STRUCTURE"}`);
  console.log(`residue : ${obfLeft} obfuscated names, ${left} unnamed placeholders`);

  const out = o.out || (o.input ? o.input.replace(/\.js$/, "") + ".deobfuscated.js" : "deobfuscated.js");
  fs.writeFileSync(out, final);
  console.log(`wrote   : ${out} (${final.split("\n").length} lines)`);
  if (!ok) process.exit(2);
}

main().catch(e => { console.error(e); process.exit(1); });
