declare const __BRCP_BUILD_COMMIT__: string;

const configuredCommit = typeof __BRCP_BUILD_COMMIT__ === "undefined" ? "development" : __BRCP_BUILD_COMMIT__;
export const buildCommit = configuredCommit === "unavailable" || configuredCommit === "development" ? null : configuredCommit;
export const buildCommitUrl = buildCommit
  ? `https://github.com/apenasgabreu/brasil-compasso-politico/commit/${buildCommit}`
  : "https://github.com/apenasgabreu/brasil-compasso-politico/tree/main";
export const buildReferenceLabel = buildCommit ? `commit ${buildCommit.slice(0, 12)}` : "branch principal pública";
