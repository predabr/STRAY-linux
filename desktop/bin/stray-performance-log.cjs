"use strict";

const path = require("node:path");

function toNumber(value) { const parsed = Number.parseFloat(String(value ?? "").trim().replace(",", ".")); return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : null; }
function headerKey(value) { return String(value).toLowerCase().replace(/[^a-z0-9]/g, ""); }
function findColumn(headers, candidates) { return headers.findIndex((header) => candidates.includes(headerKey(header))); }
function thin(samples, maximum = 900) { if (samples.length <= maximum) return samples; const step = Math.ceil(samples.length / maximum); return samples.filter((_, index) => index % step === 0); }

function parseCsv(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const separator = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(separator).map((item) => item.trim());
  const fpsIndex = findColumn(headers, ["fps", "fpsavg", "averagefps"]);
  const frameTimeIndex = findColumn(headers, ["frametime", "frametimems", "frametimeavg"]);
  const timestampIndex = findColumn(headers, ["time", "timestamp", "seconds", "elapsed"]);
  if (fpsIndex < 0 && frameTimeIndex < 0) return [];
  return thin(lines.slice(1).flatMap((line, rowIndex) => {
    const cells = line.split(separator);
    const fps = fpsIndex >= 0 ? toNumber(cells[fpsIndex]) : null;
    const frameTimeMs = frameTimeIndex >= 0 ? toNumber(cells[frameTimeIndex]) : null;
    if (fps === null && frameTimeMs === null) return [];
    return [{ index: rowIndex + 1, elapsed: timestampIndex >= 0 ? toNumber(cells[timestampIndex]) : null, fps, frameTimeMs }];
  }));
}

function parseText(text) {
  const samples = [];
  for (const [rowIndex, line] of text.split(/\r?\n/).entries()) {
    const fpsMatch = line.match(/(?:^|\s)(\d+(?:[.,]\d+)?)\s*fps\b/i);
    const frameTimeMatch = line.match(/(?:frametime|frame\s*time)\s*[:=]?\s*(\d+(?:[.,]\d+)?)/i);
    const fps = fpsMatch ? toNumber(fpsMatch[1]) : null;
    const frameTimeMs = frameTimeMatch ? toNumber(frameTimeMatch[1]) : null;
    if (fps === null && frameTimeMs === null) continue;
    samples.push({ index: rowIndex + 1, elapsed: null, fps, frameTimeMs });
  }
  return thin(samples);
}

function parsePerformanceLog(filePath, text) {
  const samples = parseCsv(text);
  const parsed = samples.length ? samples : parseText(text);
  const fpsValues = parsed.map((sample) => sample.fps).filter((value) => value !== null);
  const frameTimeValues = parsed.map((sample) => sample.frameTimeMs).filter((value) => value !== null);
  return { source: "user-selected-mangohud-log", fileName: path.basename(filePath), samples: parsed, hasFps: fpsValues.length > 0, hasFrameTime: frameTimeValues.length > 0, summary: { parsedRows: parsed.length, fpsRange: fpsValues.length ? { min: Math.min(...fpsValues), max: Math.max(...fpsValues) } : null, frameTimeRange: frameTimeValues.length ? { min: Math.min(...frameTimeValues), max: Math.max(...frameTimeValues) } : null } };
}

module.exports = { parsePerformanceLog };
