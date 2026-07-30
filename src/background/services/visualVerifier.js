export function compareScreenshots(originalScreenshot, generatedScreenshot) {
  const result = {
    score: 0,
    discrepancies: [],
    spacingIssues: [],
    colorIssues: [],
    missingSections: [],
    passed: false,
  };

  if (!originalScreenshot || !generatedScreenshot) {
    result.discrepancies.push("One or both screenshots missing");
    result.score = 0;
    return result;
  }

  const originalSize = originalScreenshot.split(",")[1]?.length || 0;
  const generatedSize = generatedScreenshot.split(",")[1]?.length || 0;
  const sizeRatio = originalSize > 0 ? Math.min(generatedSize, originalSize) / Math.max(generatedSize, originalSize) : 0;

  result.score = Math.round(sizeRatio * 100);
  result.passed = result.score >= 95;

  if (result.score < 95) {
    result.discrepancies.push(`Size similarity: ${result.score}% (below 95% threshold)`);
  }

  return result;
}

export function generateDiffReport(originalPayload, generatedProject) {
  const issues = [];

  if (!generatedProject.files || generatedProject.files.length === 0) {
    issues.push({ severity: "high", message: "No files generated" });
  }

  if (originalPayload.dom?.tagCount && generatedProject.files) {
    const fileCount = generatedProject.files.length;
    if (fileCount < 3) {
      issues.push({ severity: "medium", message: "Low number of generated files suggests incomplete extraction" });
    }
  }

  return {
    issues,
    totalIssues: issues.length,
    highSeverity: issues.filter((i) => i.severity === "high").length,
    mediumSeverity: issues.filter((i) => i.severity === "medium").length,
  };
}

export function calculateSimilarity(originalPayload, generatedProject) {
  let score = 70;
  let bonus = 0;

  if (generatedProject.similarityScore) {
    score = generatedProject.similarityScore;
  }

  if (generatedProject.files && generatedProject.files.length > 5) bonus += 10;
  if (generatedProject.assets && generatedProject.assets.length > 0) bonus += 5;

  return Math.min(100, score + bonus);
}
