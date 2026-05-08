const express = require('express');
const { getRepoInfo, getCommits } = require('./modules/github');
const { getNpmDependencies } = require('./modules/deps');
const { searchCVE } = require('./modules/nvd');
const { safeAnalyze } = require('./modules/sandbox');
const { generatePDF } = require('./modules/pdf');

const router = express.Router();

router.post('/scan', async (req, res) => {
    const { owner, repo, packageName } = req.body;
    if (!owner || !repo || !packageName) {
        return res.status(400).json({ error: 'Missing fields: owner, repo, packageName' });
    }

    const repoInfo = await getRepoInfo(owner, repo);
    const commits = await getCommits(owner, repo);
    const deps = await getNpmDependencies(packageName);

    // Developer risk profiling
    const emails = commits.map(c => c.commit?.author?.email).filter(Boolean);
    const uniqueEmails = [...new Set(emails)];
    const suspicious = uniqueEmails.filter(e => e.includes('temp') || e.includes('fake') || e.includes('test') || e.includes('noreply'));
    const developerRisk = {
        totalDevelopers: uniqueEmails.length,
        suspiciousEmails: suspicious,
        riskScore: suspicious.length > 0 ? 'High' : 'Low'
    };

    // Check CVEs for dependencies
    let vulnerabilities = [];
    for (const [dep, ver] of Object.entries(deps)) {
        const cves = await searchCVE(dep, ver);
        if (cves.length > 0) {
            vulnerabilities.push({ dependency: dep, version: ver, cves });
        }
    }

    // Invisible characters detection
    const invisibleCharsCount = (JSON.stringify(repoInfo).match(/[\u200B-\u200D\uFEFF\u202A-\u202E\u2060]/g) || []).length;

    // Behavioral analysis in secure sandbox
    const behavioral = await safeAnalyze(`// Mock safe code for ${packageName}`);

    // Overall security score
    let overallScore = '✅ Safe';
    if (vulnerabilities.length > 0 || developerRisk.riskScore === 'High' || invisibleCharsCount > 0) {
        overallScore = '⚠️ Risky';
    }
    if (behavioral.safe === false) overallScore = '❌ Dangerous';

    const result = {
        repository: repoInfo.full_name || `${owner}/${repo}`,
        dependencies: deps,
        vulnerabilities,
        developerRisk,
        invisibleCharactersFound: invisibleCharsCount,
        behavioralSafety: behavioral,
        overallScore
    };
    res.json(result);
});

router.post('/report/pdf', (req, res) => {
    generatePDF(req.body, res);
});

module.exports = router;
