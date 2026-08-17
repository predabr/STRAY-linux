export type StaticPixConfig = {
  key: string;
  merchantName: string;
  merchantCity: string;
  transactionId?: string;
  amount?: number;
};

const PIX_GUI = "BR.GOV.BCB.PIX";

const tlv = (id: string, value: string) => {
  if (!/^\d{2}$/.test(id)) throw new Error("Identificador BR Code inválido.");
  const length = new TextEncoder().encode(value).length;
  if (length === 0 || length > 99) throw new Error("Campo BR Code vazio ou acima do limite.");
  return `${id}${String(length).padStart(2, "0")}${value}`;
};

const normalizeMerchantText = (value: string, maxLength: number, field: string) => {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 .\-/]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
  if (!normalized || normalized.length > maxLength) throw new Error(`${field} Pix inválido.`);
  return normalized;
};

export function crc16Ccitt(payload: string) {
  let crc = 0xffff;
  for (const char of payload) {
    crc ^= char.charCodeAt(0) << 8;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function buildStaticPixBrCode(config: StaticPixConfig) {
  const key = config.key.trim();
  if (!key || new TextEncoder().encode(key).length > 77) throw new Error("Chave Pix inválida.");
  const merchantName = normalizeMerchantText(config.merchantName, 25, "Nome do recebedor");
  const merchantCity = normalizeMerchantText(config.merchantCity, 15, "Cidade do recebedor");
  const transactionId = (config.transactionId?.trim() || "***").toUpperCase();
  if (!/^[A-Z0-9*]{1,25}$/.test(transactionId)) throw new Error("Identificador de transação Pix inválido.");
  const amount = config.amount;
  if (amount !== undefined && (!Number.isFinite(amount) || amount <= 0 || amount > 99999999999.99)) throw new Error("Valor Pix inválido.");

  const merchantAccount = tlv("00", PIX_GUI) + tlv("01", key);
  const additionalData = tlv("05", transactionId);
  const payload = [
    tlv("00", "01"),
    tlv("01", "11"),
    tlv("26", merchantAccount),
    tlv("52", "0000"),
    tlv("53", "986"),
    amount === undefined ? "" : tlv("54", amount.toFixed(2)),
    tlv("58", "BR"),
    tlv("59", merchantName),
    tlv("60", merchantCity),
    tlv("62", additionalData),
    "6304",
  ].join("");
  return `${payload}${crc16Ccitt(payload)}`;
}

export function validatePixBrCode(payload: string) {
  if (!/^[0-9A-Za-z.@\-*/:+ ]+$/.test(payload) || payload.length < 20) return false;
  const crcIndex = payload.lastIndexOf("6304");
  if (crcIndex < 0 || crcIndex + 8 !== payload.length) return false;
  const expectedCrc = payload.slice(-4);
  if (crc16Ccitt(payload.slice(0, crcIndex + 4)) !== expectedCrc) return false;
  let cursor = 0;
  const tags = new Set<string>();
  while (cursor < crcIndex) {
    const id = payload.slice(cursor, cursor + 2);
    const length = Number(payload.slice(cursor + 2, cursor + 4));
    if (!/^\d{2}$/.test(id) || !Number.isInteger(length) || length < 1 || cursor + 4 + length > crcIndex) return false;
    tags.add(id);
    cursor += 4 + length;
  }
  return cursor === crcIndex && tags.has("00") && tags.has("26") && tags.has("52") && tags.has("53") && tags.has("58") && tags.has("59") && tags.has("60") && tags.has("62");
}
