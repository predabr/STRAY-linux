import {
  boolean,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const userRoles = ["user", "moderator", "admin"] as const;
export const publicationStatuses = ["draft", "published", "archived"] as const;
export const dataProvenances = ["verified", "community", "estimated", "unknown"] as const;
export const confidenceLevels = ["high", "medium", "low", "unknown"] as const;
export const compatibilityLevels = ["excellent", "good", "playable", "limited", "broken", "unknown"] as const;
export const hardwareKinds = ["cpu", "gpu", "ram"] as const;
export const benchmarkStatuses = ["submitted", "in_review", "verified", "rejected"] as const;
export const benchmarkSources = ["community_submission", "imported_source", "admin_entry", "calculated_estimate"] as const;
export const guideDifficulties = ["beginner", "intermediate", "advanced"] as const;
export const reportStatuses = ["open", "in_review", "resolved", "rejected"] as const;
export const reportTypes = ["incorrect_information", "invalid_benchmark", "duplicate", "broken_link", "inappropriate_content", "spam", "other"] as const;
export const fixCategories = ["steam", "proton", "wine", "vulkan", "amd", "nvidia", "intel", "anti_cheat", "audio", "controller", "fps", "stuttering", "crashes", "black_screen", "launch_errors", "other"] as const;
export const fixStepKinds = ["inspect", "change", "verify", "recover"] as const;
export const fixStepRisks = ["read_only", "reversible", "system_change"] as const;
export const linuxFixProposalStatuses = ["submitted", "in_review", "accepted", "rejected", "withdrawn"] as const;

const createdAt = timestamp("createdAt").defaultNow().notNull();
const updatedAt = timestamp("updatedAt").defaultNow().onUpdateNow().notNull();

export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", userRoles).default("user").notNull(),
    isBanned: boolean("isBanned").default(false).notNull(),
    bannedAt: timestamp("bannedAt"),
    createdAt,
    updatedAt,
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  (table) => [index("users_role_idx").on(table.role), index("users_banned_idx").on(table.isBanned)],
);

export const contentSources = mysqlTable(
  "content_sources",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    baseUrl: varchar("baseUrl", { length: 2048 }),
    licenseNote: text("licenseNote"),
    isOfficial: boolean("isOfficial").default(false).notNull(),
    scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
    lastCheckedAt: timestamp("lastCheckedAt"),
    lastSuccessfulRefreshAt: timestamp("lastSuccessfulRefreshAt"),
    catalogCursorAppId: int("catalogCursorAppId"),
    lastCatalogRefreshAt: timestamp("lastCatalogRefreshAt"),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("content_sources_name_unique").on(table.name), index("content_sources_cron_uid_idx").on(table.scheduleCronTaskUid), index("content_sources_catalog_refresh_idx").on(table.lastCatalogRefreshAt)],
);

export const importBatches = mysqlTable(
  "import_batches",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: int("sourceId").references(() => contentSources.id, { onDelete: "set null" }),
    kind: varchar("kind", { length: 64 }).notNull(),
    inputHash: varchar("inputHash", { length: 128 }),
    importedCount: int("importedCount").default(0).notNull(),
    importedAt: timestamp("importedAt").defaultNow().notNull(),
    notes: text("notes"),
  },
  (table) => [index("import_batches_source_kind_idx").on(table.sourceId, table.kind)],
);

export const sourceRefreshStatuses = ["started", "succeeded", "failed", "skipped"] as const;

export const sourceRefreshRuns = mysqlTable(
  "source_refresh_runs",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: int("sourceId").notNull().references(() => contentSources.id, { onDelete: "cascade" }),
    kind: varchar("kind", { length: 64 }).notNull(),
    status: mysqlEnum("status", sourceRefreshStatuses).notNull(),
    requestedAt: timestamp("requestedAt").defaultNow().notNull(),
    finishedAt: timestamp("finishedAt"),
    recordsSeen: int("recordsSeen").default(0).notNull(),
    recordsChanged: int("recordsChanged").default(0).notNull(),
    inputHash: varchar("inputHash", { length: 128 }),
    sourceEndpoint: varchar("sourceEndpoint", { length: 2048 }),
    message: text("message"),
  },
  (table) => [index("source_refresh_runs_source_requested_idx").on(table.sourceId, table.requestedAt), index("source_refresh_runs_status_idx").on(table.status, table.requestedAt)],
);

export const games = mysqlTable(
  "games",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 220 }).notNull(),
    title: varchar("title", { length: 400 }).notNull(),
    steamAppId: int("steamAppId"),
    shortDescription: varchar("shortDescription", { length: 600 }),
    description: text("description"),
    developer: varchar("developer", { length: 255 }),
    publisher: varchar("publisher", { length: 255 }),
    releaseDate: varchar("releaseDate", { length: 64 }),
    sourcePositiveReviews: int("sourcePositiveReviews"),
    coverImageUrl: varchar("coverImageUrl", { length: 2048 }),
    websiteUrl: varchar("websiteUrl", { length: 2048 }),
    status: mysqlEnum("status", publicationStatuses).default("draft").notNull(),
    sourceId: int("sourceId").references(() => contentSources.id, { onDelete: "set null" }),
    importBatchId: int("importBatchId").references(() => importBatches.id, { onDelete: "set null" }),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    sourceUpdatedAt: timestamp("sourceUpdatedAt"),
    sourceCheckedAt: timestamp("sourceCheckedAt"),
    isFeatured: boolean("isFeatured").default(false).notNull(),
    deletedAt: timestamp("deletedAt"),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("games_slug_unique").on(table.slug),
    uniqueIndex("games_steam_app_unique").on(table.steamAppId),
    index("games_status_idx").on(table.status),
    index("games_title_idx").on(table.title),
    index("games_catalog_popularity_idx").on(table.status, table.sourcePositiveReviews),
  ],
);

export const gameMediaKinds = ["cover", "header", "screenshot", "logo"] as const;

export const gameMedia = mysqlTable(
  "game_media",
  {
    id: int("id").autoincrement().primaryKey(),
    gameId: int("gameId").notNull().references(() => games.id, { onDelete: "cascade" }),
    kind: mysqlEnum("kind", gameMediaKinds).notNull(),
    imageUrl: varchar("imageUrl", { length: 2048 }).notNull(),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    sourceId: int("sourceId").references(() => contentSources.id, { onDelete: "set null" }),
    width: int("width"),
    height: int("height"),
    position: int("position").default(0).notNull(),
    sourceCheckedAt: timestamp("sourceCheckedAt"),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("game_media_game_kind_position_unique").on(table.gameId, table.kind, table.position), index("game_media_game_kind_idx").on(table.gameId, table.kind)],
);

export const tags = mysqlTable(
  "tags",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull(),
    name: varchar("name", { length: 140 }).notNull(),
    kind: varchar("kind", { length: 80 }).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("tags_slug_unique").on(table.slug), index("tags_kind_idx").on(table.kind)],
);

export const gameTags = mysqlTable(
  "game_tags",
  {
    id: int("id").autoincrement().primaryKey(),
    gameId: int("gameId").notNull().references(() => games.id, { onDelete: "cascade" }),
    tagId: int("tagId").notNull().references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("game_tags_game_tag_unique").on(table.gameId, table.tagId), index("game_tags_tag_idx").on(table.tagId)],
);

export const gamePlatforms = mysqlTable(
  "game_platforms",
  {
    id: int("id").autoincrement().primaryKey(),
    gameId: int("gameId").notNull().references(() => games.id, { onDelete: "cascade" }),
    platform: varchar("platform", { length: 48 }).notNull(),
    isAvailable: boolean("isAvailable").default(true).notNull(),
    isWorking: boolean("isWorking").default(true).notNull(),
    antiCheat: varchar("antiCheat", { length: 160 }),
    sourceId: int("sourceId").references(() => contentSources.id, { onDelete: "set null" }),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("game_platforms_game_platform_unique").on(table.gameId, table.platform), index("game_platforms_platform_idx").on(table.platform)],
);

export const distributions = mysqlTable(
  "distributions",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    family: varchar("family", { length: 120 }),
    packageManager: varchar("packageManager", { length: 120 }),
    defaultDesktop: varchar("defaultDesktop", { length: 160 }),
    logoUrl: varchar("logoUrl", { length: 2048 }),
    officialUrl: varchar("officialUrl", { length: 2048 }),
    gamingScore: int("gamingScore"),
    scoreProvenance: mysqlEnum("scoreProvenance", dataProvenances).default("unknown").notNull(),
    status: mysqlEnum("status", publicationStatuses).default("draft").notNull(),
    sourceId: int("sourceId").references(() => contentSources.id, { onDelete: "set null" }),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    deletedAt: timestamp("deletedAt"),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("distributions_slug_unique").on(table.slug), index("distributions_status_idx").on(table.status)],
);

export const distributionVersions = mysqlTable(
  "distribution_versions",
  {
    id: int("id").autoincrement().primaryKey(),
    distributionId: int("distributionId").notNull().references(() => distributions.id, { onDelete: "cascade" }),
    version: varchar("version", { length: 100 }).notNull(),
    codename: varchar("codename", { length: 160 }),
    defaultKernel: varchar("defaultKernel", { length: 160 }),
    isSupported: boolean("isSupported").default(true).notNull(),
    releaseDate: varchar("releaseDate", { length: 64 }),
    endOfLife: varchar("endOfLife", { length: 64 }),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("distribution_versions_unique").on(table.distributionId, table.version), index("distribution_versions_supported_idx").on(table.distributionId, table.isSupported)],
);

export const hardwareItems = mysqlTable(
  "hardware_items",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 220 }).notNull(),
    kind: mysqlEnum("kind", hardwareKinds).notNull(),
    manufacturer: varchar("manufacturer", { length: 160 }).notNull(),
    model: varchar("model", { length: 255 }).notNull(),
    architecture: varchar("architecture", { length: 160 }),
    vramMb: int("vramMb"),
    cores: int("cores"),
    threads: int("threads"),
    baseClockMhz: int("baseClockMhz"),
    boostClockMhz: int("boostClockMhz"),
    tdpWatts: int("tdpWatts"),
    ramCapacityGb: int("ramCapacityGb"),
    ramFrequencyMhz: int("ramFrequencyMhz"),
    ramType: varchar("ramType", { length: 80 }),
    driverFamily: varchar("driverFamily", { length: 160 }),
    vulkanVersion: varchar("vulkanVersion", { length: 80 }),
    openGlVersion: varchar("openGlVersion", { length: 80 }),
    sourceId: int("sourceId").references(() => contentSources.id, { onDelete: "set null" }),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    deletedAt: timestamp("deletedAt"),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("hardware_items_slug_unique").on(table.slug), index("hardware_items_kind_manufacturer_idx").on(table.kind, table.manufacturer)],
);

export const userHardwareProfiles = mysqlTable(
  "user_hardware_profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 140 }).notNull(),
    cpuId: int("cpuId").references(() => hardwareItems.id, { onDelete: "set null" }),
    gpuId: int("gpuId").references(() => hardwareItems.id, { onDelete: "set null" }),
    ramId: int("ramId").references(() => hardwareItems.id, { onDelete: "set null" }),
    distributionId: int("distributionId").references(() => distributions.id, { onDelete: "set null" }),
    distributionVersionId: int("distributionVersionId").references(() => distributionVersions.id, { onDelete: "set null" }),
    kernelVersion: varchar("kernelVersion", { length: 160 }),
    driverVersion: varchar("driverVersion", { length: 160 }),
    protonVersion: varchar("protonVersion", { length: 160 }),
    wineVersion: varchar("wineVersion", { length: 160 }),
    runtimeVersion: varchar("runtimeVersion", { length: 160 }),
    storageDescription: varchar("storageDescription", { length: 255 }),
    monitorDescription: varchar("monitorDescription", { length: 255 }),
    detectedCpu: varchar("detectedCpu", { length: 255 }),
    detectedGpu: varchar("detectedGpu", { length: 255 }),
    detectedRamGb: int("detectedRamGb"),
    detectedDistribution: varchar("detectedDistribution", { length: 255 }),
    scannerVersion: varchar("scannerVersion", { length: 80 }),
    scannedAt: timestamp("scannedAt"),
    scanDetails: json("scanDetails"),
    isActive: boolean("isActive").default(false).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("user_hardware_profiles_user_name_unique").on(table.userId, table.name), index("user_hardware_profiles_active_idx").on(table.userId, table.isActive)],
);

export const compatibilityRecords = mysqlTable(
  "compatibility_records",
  {
    id: int("id").autoincrement().primaryKey(),
    fingerprint: varchar("fingerprint", { length: 160 }).notNull(),
    gameId: int("gameId").notNull().references(() => games.id, { onDelete: "cascade" }),
    distributionId: int("distributionId").references(() => distributions.id, { onDelete: "set null" }),
    distributionVersionId: int("distributionVersionId").references(() => distributionVersions.id, { onDelete: "set null" }),
    cpuId: int("cpuId").references(() => hardwareItems.id, { onDelete: "set null" }),
    gpuId: int("gpuId").references(() => hardwareItems.id, { onDelete: "set null" }),
    kernelConstraint: varchar("kernelConstraint", { length: 255 }),
    driverConstraint: varchar("driverConstraint", { length: 255 }),
    protonVersion: varchar("protonVersion", { length: 160 }),
    wineVersion: varchar("wineVersion", { length: 160 }),
    runtimeVersion: varchar("runtimeVersion", { length: 160 }),
    gameVersion: varchar("gameVersion", { length: 160 }),
    level: mysqlEnum("level", compatibilityLevels).default("unknown").notNull(),
    provenance: mysqlEnum("provenance", dataProvenances).default("unknown").notNull(),
    confidence: mysqlEnum("confidence", confidenceLevels).default("unknown").notNull(),
    summary: text("summary"),
    sourceId: int("sourceId").references(() => contentSources.id, { onDelete: "set null" }),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    reviewedById: int("reviewedById").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewedAt"),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("compatibility_records_fingerprint_unique").on(table.fingerprint), index("compatibility_records_lookup_idx").on(table.gameId, table.distributionId, table.gpuId)],
);

export const compatibilityReports = mysqlTable(
  "compatibility_reports",
  {
    id: int("id").autoincrement().primaryKey(),
    compatibilityId: int("compatibilityId").notNull().references(() => compatibilityRecords.id, { onDelete: "cascade" }),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 300 }).notNull(),
    body: text("body").notNull(),
    isConfirmed: boolean("isConfirmed").default(false).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [index("compatibility_reports_record_idx").on(table.compatibilityId, table.createdAt)],
);

export const benchmarks = mysqlTable(
  "benchmarks",
  {
    id: int("id").autoincrement().primaryKey(),
    gameId: int("gameId").notNull().references(() => games.id, { onDelete: "cascade" }),
    userId: int("userId").references(() => users.id, { onDelete: "set null" }),
    hardwareProfileId: int("hardwareProfileId").references(() => userHardwareProfiles.id, { onDelete: "set null" }),
    cpuId: int("cpuId").references(() => hardwareItems.id, { onDelete: "set null" }),
    gpuId: int("gpuId").references(() => hardwareItems.id, { onDelete: "set null" }),
    ramId: int("ramId").references(() => hardwareItems.id, { onDelete: "set null" }),
    distributionId: int("distributionId").references(() => distributions.id, { onDelete: "set null" }),
    distributionVersionId: int("distributionVersionId").references(() => distributionVersions.id, { onDelete: "set null" }),
    gameVersion: varchar("gameVersion", { length: 160 }),
    kernelVersion: varchar("kernelVersion", { length: 160 }),
    driverVersion: varchar("driverVersion", { length: 160 }),
    mesaVersion: varchar("mesaVersion", { length: 160 }),
    nvidiaVersion: varchar("nvidiaVersion", { length: 160 }),
    protonVersion: varchar("protonVersion", { length: 160 }),
    wineVersion: varchar("wineVersion", { length: 160 }),
    runtimeVersion: varchar("runtimeVersion", { length: 160 }),
    sourceType: mysqlEnum("sourceType", benchmarkSources).notNull(),
    provenance: mysqlEnum("provenance", dataProvenances).default("community").notNull(),
    verificationStatus: mysqlEnum("verificationStatus", benchmarkStatuses).default("submitted").notNull(),
    sourceLabel: varchar("sourceLabel", { length: 255 }),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    evidenceNote: text("evidenceNote"),
    evidenceImageKey: varchar("evidenceImageKey", { length: 512 }),
    evidenceImageUrl: varchar("evidenceImageUrl", { length: 2048 }),
    reviewedById: int("reviewedById").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewedAt"),
    reviewNote: text("reviewNote"),
    measuredAt: timestamp("measuredAt"),
    createdAt,
    updatedAt,
  },
  (table) => [index("benchmarks_game_status_idx").on(table.gameId, table.verificationStatus, table.provenance), index("benchmarks_hardware_idx").on(table.gpuId, table.cpuId, table.distributionId), index("benchmarks_user_idx").on(table.userId, table.createdAt)],
);

export const benchmarkResults = mysqlTable(
  "benchmark_results",
  {
    id: int("id").autoincrement().primaryKey(),
    benchmarkId: int("benchmarkId").notNull().references(() => benchmarks.id, { onDelete: "cascade" }),
    resolutionWidth: int("resolutionWidth").notNull(),
    resolutionHeight: int("resolutionHeight").notNull(),
    preset: varchar("preset", { length: 160 }).notNull(),
    averageFps: decimal("averageFps", { precision: 8, scale: 2 }),
    onePercentLowFps: decimal("onePercentLowFps", { precision: 8, scale: 2 }),
    zeroPointOnePercentLowFps: decimal("zeroPointOnePercentLowFps", { precision: 8, scale: 2 }),
    temperatureC: decimal("temperatureC", { precision: 6, scale: 2 }),
    powerWatts: decimal("powerWatts", { precision: 8, scale: 2 }),
    calculationMethod: varchar("calculationMethod", { length: 255 }),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("benchmark_results_unique_combo").on(table.benchmarkId, table.resolutionWidth, table.resolutionHeight, table.preset), index("benchmark_results_resolution_idx").on(table.resolutionWidth, table.resolutionHeight)],
);

export const wikiArticles = mysqlTable(
  "wiki_articles",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 220 }).notNull(),
    title: varchar("title", { length: 400 }).notNull(),
    excerpt: varchar("excerpt", { length: 600 }),
    body: text("body").notNull(),
    distributionId: int("distributionId").references(() => distributions.id, { onDelete: "set null" }),
    distributionVersionId: int("distributionVersionId").references(() => distributionVersions.id, { onDelete: "set null" }),
    category: varchar("category", { length: 120 }).notNull(),
    versionLabel: varchar("versionLabel", { length: 120 }),
    status: mysqlEnum("status", publicationStatuses).default("draft").notNull(),
    provenance: mysqlEnum("provenance", dataProvenances).default("unknown").notNull(),
    sourceId: int("sourceId").references(() => contentSources.id, { onDelete: "set null" }),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    authorId: int("authorId").references(() => users.id, { onDelete: "set null" }),
    reviewedById: int("reviewedById").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewedAt"),
    deletedAt: timestamp("deletedAt"),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("wiki_articles_slug_unique").on(table.slug), index("wiki_articles_distribution_category_idx").on(table.distributionId, table.category), index("wiki_articles_status_idx").on(table.status)],
);

export const setupGuides = mysqlTable(
  "setup_guides",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 220 }).notNull(),
    title: varchar("title", { length: 400 }).notNull(),
    description: text("description"),
    difficulty: mysqlEnum("difficulty", guideDifficulties).notNull(),
    guideVersion: varchar("guideVersion", { length: 120 }),
    distributionId: int("distributionId").references(() => distributions.id, { onDelete: "set null" }),
    distributionVersionId: int("distributionVersionId").references(() => distributionVersions.id, { onDelete: "set null" }),
    gameId: int("gameId").references(() => games.id, { onDelete: "set null" }),
    status: mysqlEnum("status", publicationStatuses).default("draft").notNull(),
    provenance: mysqlEnum("provenance", dataProvenances).default("unknown").notNull(),
    sourceId: int("sourceId").references(() => contentSources.id, { onDelete: "set null" }),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    authorId: int("authorId").references(() => users.id, { onDelete: "set null" }),
    reviewedById: int("reviewedById").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewedAt"),
    deletedAt: timestamp("deletedAt"),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("setup_guides_slug_unique").on(table.slug), index("setup_guides_distribution_status_idx").on(table.distributionId, table.status), index("setup_guides_game_idx").on(table.gameId)],
);

export const setupGuideSteps = mysqlTable(
  "setup_guide_steps",
  {
    id: int("id").autoincrement().primaryKey(),
    guideId: int("guideId").notNull().references(() => setupGuides.id, { onDelete: "cascade" }),
    stepOrder: int("stepOrder").notNull(),
    title: varchar("title", { length: 400 }).notNull(),
    explanation: text("explanation"),
    command: text("command"),
    warning: text("warning"),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("setup_guide_steps_order_unique").on(table.guideId, table.stepOrder)],
);

export const linuxFixes = mysqlTable(
  "linux_fixes",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 220 }).notNull(),
    title: varchar("title", { length: 400 }).notNull(),
    category: mysqlEnum("category", fixCategories).notNull(),
    symptoms: text("symptoms").notNull(),
    possibleCauses: text("possibleCauses").notNull(),
    gameId: int("gameId").references(() => games.id, { onDelete: "set null" }),
    distributionId: int("distributionId").references(() => distributions.id, { onDelete: "set null" }),
    hardwareId: int("hardwareId").references(() => hardwareItems.id, { onDelete: "set null" }),
    affectedVersion: varchar("affectedVersion", { length: 160 }),
    confidence: mysqlEnum("confidence", confidenceLevels).default("unknown").notNull(),
    provenance: mysqlEnum("provenance", dataProvenances).default("unknown").notNull(),
    sourceId: int("sourceId").references(() => contentSources.id, { onDelete: "set null" }),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    status: mysqlEnum("status", publicationStatuses).default("draft").notNull(),
    authorId: int("authorId").references(() => users.id, { onDelete: "set null" }),
    reviewedById: int("reviewedById").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewedAt"),
    deletedAt: timestamp("deletedAt"),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("linux_fixes_slug_unique").on(table.slug), index("linux_fixes_category_status_idx").on(table.category, table.status), index("linux_fixes_game_idx").on(table.gameId)],
);

export const linuxFixSolutions = mysqlTable(
  "linux_fix_solutions",
  {
    id: int("id").autoincrement().primaryKey(),
    fixId: int("fixId").notNull().references(() => linuxFixes.id, { onDelete: "cascade" }),
    stepOrder: int("stepOrder").notNull(),
    title: varchar("title", { length: 400 }).notNull(),
    explanation: text("explanation"),
    command: text("command"),
    warning: text("warning"),
    kind: mysqlEnum("kind", fixStepKinds).default("inspect").notNull(),
    risk: mysqlEnum("risk", fixStepRisks).default("read_only").notNull(),
    verification: text("verification"),
    rollback: text("rollback"),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("linux_fix_solutions_order_unique").on(table.fixId, table.stepOrder)],
);

export const linuxFixVotes = mysqlTable(
  "linux_fix_votes",
  {
    id: int("id").autoincrement().primaryKey(),
    fixId: int("fixId").notNull().references(() => linuxFixes.id, { onDelete: "cascade" }),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    value: int("value").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("linux_fix_votes_user_fix_unique").on(table.userId, table.fixId), index("linux_fix_votes_fix_idx").on(table.fixId, table.value)],
);

export const linuxFixComments = mysqlTable(
  "linux_fix_comments",
  {
    id: int("id").autoincrement().primaryKey(),
    fixId: int("fixId").notNull().references(() => linuxFixes.id, { onDelete: "cascade" }),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    isSolution: boolean("isSolution").default(false).notNull(),
    deletedAt: timestamp("deletedAt"),
    createdAt,
    updatedAt,
  },
  (table) => [index("linux_fix_comments_fix_created_idx").on(table.fixId, table.createdAt), index("linux_fix_comments_user_idx").on(table.userId, table.createdAt)],
);

export const linuxFixConfirmations = mysqlTable(
  "linux_fix_confirmations",
  {
    id: int("id").autoincrement().primaryKey(),
    fixId: int("fixId").notNull().references(() => linuxFixes.id, { onDelete: "cascade" }),
    solutionId: int("solutionId").references(() => linuxFixSolutions.id, { onDelete: "set null" }),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt,
  },
  (table) => [uniqueIndex("linux_fix_confirmations_user_fix_unique").on(table.userId, table.fixId), index("linux_fix_confirmations_fix_idx").on(table.fixId, table.createdAt)],
);

export const linuxFixProposals = mysqlTable(
  "linux_fix_proposals",
  {
    id: int("id").autoincrement().primaryKey(),
    fixId: int("fixId").notNull().references(() => linuxFixes.id, { onDelete: "cascade" }),
    authorId: int("authorId").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 300 }).notNull(),
    observation: text("observation").notNull(),
    reproduction: text("reproduction").notNull(),
    suggestedSteps: text("suggestedSteps").notNull(),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    contextSnapshot: json("contextSnapshot"),
    contextSharedAt: timestamp("contextSharedAt"),
    status: mysqlEnum("status", linuxFixProposalStatuses).default("submitted").notNull(),
    reviewerId: int("reviewerId").references(() => users.id, { onDelete: "set null" }),
    reviewNote: text("reviewNote"),
    reviewedAt: timestamp("reviewedAt"),
    createdAt,
    updatedAt,
  },
  (table) => [index("linux_fix_proposals_fix_status_idx").on(table.fixId, table.status, table.createdAt), index("linux_fix_proposals_author_idx").on(table.authorId, table.createdAt), index("linux_fix_proposals_status_idx").on(table.status, table.createdAt)],
);

export const setupGuideStepProgress = mysqlTable(
  "setup_guide_step_progress",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    guideStepId: int("guideStepId").notNull().references(() => setupGuideSteps.id, { onDelete: "cascade" }),
    completedAt: timestamp("completedAt").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("setup_guide_step_progress_user_step_unique").on(table.userId, table.guideStepId), index("setup_guide_step_progress_user_idx").on(table.userId, table.completedAt)],
);

export const favorites = mysqlTable(
  "favorites",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    gameId: int("gameId").notNull().references(() => games.id, { onDelete: "cascade" }),
    createdAt,
  },
  (table) => [uniqueIndex("favorites_user_game_unique").on(table.userId, table.gameId), index("favorites_user_idx").on(table.userId, table.createdAt)],
);

export const savedGuides = mysqlTable(
  "saved_guides",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    guideId: int("guideId").notNull().references(() => setupGuides.id, { onDelete: "cascade" }),
    createdAt,
  },
  (table) => [uniqueIndex("saved_guides_user_guide_unique").on(table.userId, table.guideId), index("saved_guides_user_idx").on(table.userId, table.createdAt)],
);

export const linuxFixHistory = mysqlTable(
  "linux_fix_history",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    fixId: int("fixId").notNull().references(() => linuxFixes.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewedAt").defaultNow().notNull(),
  },
  (table) => [index("linux_fix_history_user_idx").on(table.userId, table.viewedAt)],
);

export const reports = mysqlTable(
  "reports",
  {
    id: int("id").autoincrement().primaryKey(),
    reporterId: int("reporterId").notNull().references(() => users.id, { onDelete: "cascade" }),
    subjectType: varchar("subjectType", { length: 80 }).notNull(),
    subjectId: int("subjectId").notNull(),
    type: mysqlEnum("type", reportTypes).notNull(),
    description: text("description").notNull(),
    status: mysqlEnum("status", reportStatuses).default("open").notNull(),
    reviewerId: int("reviewerId").references(() => users.id, { onDelete: "set null" }),
    resolution: text("resolution"),
    resolvedAt: timestamp("resolvedAt"),
    createdAt,
    updatedAt,
  },
  (table) => [index("reports_status_idx").on(table.status, table.createdAt), index("reports_subject_idx").on(table.subjectType, table.subjectId)],
);

export const gameRatings = mysqlTable(
  "game_ratings",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    gameId: int("gameId").notNull().references(() => games.id, { onDelete: "cascade" }),
    score: int("score").notNull(),
    comment: text("comment"),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("game_ratings_user_game_unique").on(table.userId, table.gameId), index("game_ratings_game_idx").on(table.gameId, table.score)],
);

export const auditActions = mysqlTable(
  "audit_actions",
  {
    id: int("id").autoincrement().primaryKey(),
    actorId: int("actorId").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entityType", { length: 100 }).notNull(),
    entityId: int("entityId").notNull(),
    metadata: json("metadata"),
    createdAt,
  },
  (table) => [index("audit_actions_entity_idx").on(table.entityType, table.entityId, table.createdAt), index("audit_actions_actor_idx").on(table.actorId, table.createdAt)],
);

export const chatSessions = mysqlTable(
  "chat_sessions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }),
    provider: varchar("provider", { length: 80 }).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [index("chat_sessions_user_idx").on(table.userId, table.updatedAt)],
);

export const chatMessages = mysqlTable(
  "chat_messages",
  {
    id: int("id").autoincrement().primaryKey(),
    sessionId: int("sessionId").notNull().references(() => chatSessions.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 32 }).notNull(),
    content: text("content").notNull(),
    citations: json("citations"),
    createdAt,
  },
  (table) => [index("chat_messages_session_idx").on(table.sessionId, table.createdAt)],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
