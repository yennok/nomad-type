document.getElementById("generateBtn").addEventListener("click", async () => {
  const file = document.getElementById("htmlFile").files[0];
  if (!file) return;
  const text = await file.text();

  const name = document.getElementById("fontName").value.trim() || "NewFont";
  const tagline = document.getElementById("tagline").value.trim();
  const intro = document.getElementById("intro").value;
  const credits = JSON.parse(document.getElementById("credits").value || "{}");
  const headerHtml = document.getElementById("headerHtml").value;
  const marqueeHtml = document.getElementById("marqueeHtml").value;
  const glyphMap = JSON.parse(document.getElementById("glyphMap").value || "{}");

  let html = text;

  // title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${name}${tagline ? " - " + tagline : ""}</title>`);

  // intro section
  html = html.replace(/<section class="font-intro">[\s\S]*?<div class="multilingual-marquee">/, m =>
    m.replace(/<p>[\s\S]*?<\/p>/, `<p>${intro}</p>`)
      .replace(/Typeface:[\s\S]*?<\//, `Typeface: ${name}<`)
      .replace(/Designed by:[\s\S]*?<\//, `Designed by: ${credits.DESIGNED_BY}<`)
      .replace(/Team:[\s\S]*?<\//, `Team: ${credits.TEAM}<`)
      .replace(/Additional Engineering:[\s\S]*?<\//, `Additional Engineering: ${credits.ENGINEERING}<`)
      .replace(/Year:[\s\S]*?<\//, `Year: ${credits.YEAR}<`)
      .replace(/Languages:[\s\S]*?<\//, `Languages: ${credits.LANGUAGES}<`)
      .replace(/Formats:[\s\S]*?<\//, `Formats: ${credits.FORMATS}<`)
  );

  // marquee
  html = html.replace(/<div class="marquee-content">[\s\S]*?<\/div>/, `<div class="marquee-content">${marqueeHtml}</div>`);

  // header
  html = html.replace(/loadHeader\(`[\s\S]*?`\);/, `loadHeader(\`${headerHtml}\`);`);

  // footer
  html = html.replace(/loadFooter\(['"][^'"]+['"]\)/, `loadFooter('${name}')`);

  // glyphMap safe insertion
  const encodedGlyph = JSON.stringify(glyphMap, null, 2).replace(/<\/script>/gi, "<\\/script>");
  html = html.replace(
    /<script type="application\/json" id="glyphMap">[\s\S]*?<\/script>/i,
    `<script type="application/json" id="glyphMap">${encodedGlyph}</script>`
  );

  // overlay headings + rename
  html = html.replace(/<h2>Download\s+Safra[\s\S]*?<\/h2>/, `<h2>Download ${name}</h2>`);
  html = html.replace(/<h2>Buy\s+Safra[\s\S]*?<\/h2>/, `<h2>Buy ${name}</h2>`);
  html = html.replace(/\bSafra\b/g, name);

  // download
  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name.toLowerCase().replace(/\s+/g, "-") + ".html";
  a.click();
  URL.revokeObjectURL(a.href);

  const output = document.getElementById("output");
  output.hidden = false;
  output.textContent = `Generated ${a.download}`;
});
