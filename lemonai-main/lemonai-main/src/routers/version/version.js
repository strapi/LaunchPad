const router = require('koa-router')();
const axios = require('axios');
const { version } = require('../../../package.json'); 

// Configure the GitHub API URL
const GITHUB_OWNER = 'hexdocom';
const GITHUB_REPO = 'lemonai';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

// Add proxy and GitHub token
const PROXY = process.env.HTTP_PROXY || process.env.HTTPS_PROXY || null;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || null;

// Compare version numbers
function compareVersions(localVersion, remoteVersion) {
  const parseVersion = (v) => v.split('.').map(Number);
  const local = parseVersion(localVersion);
  const remote = parseVersion(remoteVersion.replace(/^v/, '')); // Remove 'v' prefix in tag

  for (let i = 0; i < Math.max(local.length, remote.length); i++) {
    const l = local[i] || 0;
    const r = remote[i] || 0;
    if (l < r) return -1; // Remote version is newer
    if (l > r) return 1; // Local version is newer
  }
  return 0; // Versions are the same
}

// Fetch version information
async function checkForUpdates() {
  try {
    const config = {
      headers: {
        'User-Agent': 'Node.js Version Checker',
        'Accept': 'application/vnd.github.v3+json',
      },
      timeout: 5000, // 5 seconds timeout
    };

    if (GITHUB_TOKEN) {
      config.headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    if (PROXY) {
      config.proxy = {
        protocol: 'http',
        host: PROXY.replace('http://', '').split(':')[0],
        port: parseInt(PROXY.split(':')[1]),
      };
    }

    const response = await axios.get(GITHUB_API_URL, config);
    const release = response.data;
    const latestVersion = release.tag_name.replace(/^v/, ''); // Remove 'v' prefix in tag
    const comparison = compareVersions(version, latestVersion);

    return {
      localVersion: version,
      latestVersion: latestVersion,
      isLatest: comparison !== -1,
      updateUrl: comparison !== -1 ? null:release.html_url,
      message: comparison !== -1 ?  'Current version is up to date':`New version found! Latest version: ${latestVersion}`,
      body:  comparison !== -1?null:release.body,
    };
  } catch (error) {
    return {
      localVersion: version,
      latestVersion: null,
      isLatest: false,
      updateUrl: null,
      message: `Failed to check for updates: ${error.message}${error.code === 'ECONNREFUSED' ? ' (Possibly a network or proxy issue, please check configuration)' : ''}`,
      body: ""
    };
  }
}

/**
 * Get version information
 */
router.get('/', async (ctx) => {
  const versionInfo = await checkForUpdates();
  ctx.response.success(versionInfo);
});

module.exports = exports = router.routes();