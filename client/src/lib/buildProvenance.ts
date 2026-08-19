declare const __BRCP_BUILD_COMMIT__: string;

export const buildCommit = typeof __BRCP_BUILD_COMMIT__ === "undefined" ? "development" : __BRCP_BUILD_COMMIT__;
export const buildCommitUrl = `https://github.com/apenasgabreu/brasil-compasso-politico/commit/${buildCommit}`;
