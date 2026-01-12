const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const studentsDir = path.join(root, 'public', 'student');

function safeRead(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch (e) { return null; }
}

function extractBodyParts(html) {
  const bodyStart = html.indexOf('<body');
  if (bodyStart === -1) return null;
  const bodyOpenClose = html.indexOf('>', bodyStart);
  const bodyEnd = html.lastIndexOf('</body>');
  if (bodyEnd === -1) return null;
  const bodyInner = html.slice(bodyOpenClose + 1, bodyEnd);
  return { bodyInner, bodyStart: bodyOpenClose + 1 };
}

function extractSidebarAndMain(html) {
  // Find the start of the main-content div
  const mainStart = html.indexOf('<div class="main-content"');
  if (mainStart === -1) return null;
  // Sidebar is everything from the start of <body> to mainStart
  const bodyTag = html.indexOf('<body');
  const bodyOpen = html.indexOf('>', bodyTag) + 1;
  const sidebar = html.slice(bodyOpen, mainStart);
  // Find the script tag that references studentScript.js (common in these files)
  const scriptIndex = html.indexOf('<script src="studentScript.js"');
  const mainEnd = scriptIndex !== -1 ? scriptIndex : html.lastIndexOf('</body>');
  const mainBlock = html.slice(mainStart, mainEnd);
  return { sidebar, mainBlock };
}

function stripOuterMainDiv(mainBlock) {
  // remove the outer <div class="main-content" ...> and its closing </div>
  const openTagEnd = mainBlock.indexOf('>');
  if (openTagEnd === -1) return mainBlock;
  const inner = mainBlock.slice(openTagEnd + 1);
  // Remove the last closing </div> that closes the main-content
  const lastClose = inner.lastIndexOf('</div>');
  if (lastClose === -1) return inner;
  return inner.slice(0, lastClose);
}

function makeHeadFrom(html) {
  const headStart = html.indexOf('<head');
  const headEnd = html.indexOf('</head>');
  if (headStart === -1 || headEnd === -1) return '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Student</title></head>';
  const head = html.slice(headStart, headEnd + 7);
  // replace any studentStyle.css link with ../../style.css
  return head.replace(/href="studentStyle.css"/g, 'href="../../style.css"')
             .replace(/<title>.*?<\/title>/, '<title>VALMAtrack - Student</title>');
}

function updateSidebarLinks(sidebar) {
  return sidebar
    .replace(/href="studentProfile.html"/g, 'href="#profile"')
    .replace(/href="studentHome.html"/g, 'href="#home"')
    .replace(/href="studentCalendar.html"/g, 'href="#calendar"')
    .replace(/href="studentSettings.html"/g, 'href="#settings"');
}

function appendRouterToScript(scriptPath) {
  let js = safeRead(scriptPath);
  if (js === null) return false;
  if (js.includes('/* ROUTER ADDED BY merge_students.js */')) return true; // already patched

  const router = `\n\n/* ROUTER ADDED BY merge_students.js */\nfunction showSection(id) {\n  document.querySelectorAll('.page').forEach(s => s.style.display = 'none');\n  const el = document.getElementById(id);\n  if (el) el.style.display = 'block';\n}\n\nfunction initRouter() {\n  function route() {\n    const hash = (location.hash || '#home').replace('#','');\n    showSection(hash || 'home');\n  }\n  window.addEventListener('hashchange', route);\n  route();\n}\n\nif (document.readyState === 'loading') {\n  document.addEventListener('DOMContentLoaded', initRouter);\n} else {\n  initRouter();\n}\n`;

  js += router;
  fs.writeFileSync(scriptPath, js, 'utf8');
  return true;
}

function processStudentFolder(folder) {
  const homeF = path.join(folder, 'studentHome.html');
  const profileF = path.join(folder, 'studentProfile.html');
  const calendarF = path.join(folder, 'studentCalendar.html');
  const settingsF = path.join(folder, 'studentSettings.html');
  const scriptF = path.join(folder, 'studentScript.js');
  const styleF = path.join(folder, 'studentStyle.css');

  // require at least home and script to proceed
  if (!fs.existsSync(homeF) || !fs.existsSync(profileF) || !fs.existsSync(calendarF) || !fs.existsSync(settingsF) || !fs.existsSync(scriptF)) {
    console.warn('Skipping', folder, 'missing one of required files');
    return { skipped: true };
  }

  const home = safeRead(homeF);
  const profile = safeRead(profileF);
  const calendar = safeRead(calendarF);
  const settings = safeRead(settingsF);

  if (!home || !profile || !calendar || !settings) { console.warn('Could not read all files in', folder); return { skipped: true }; }

  const head = makeHeadFrom(home);
  const homeParts = extractSidebarAndMain(home);
  const profileParts = extractSidebarAndMain(profile);
  const calendarParts = extractSidebarAndMain(calendar);
  const settingsParts = extractSidebarAndMain(settings);

  if (!homeParts || !profileParts || !calendarParts || !settingsParts) { console.warn('Could not extract parts in', folder); return { skipped: true }; }

  const sidebar = updateSidebarLinks(homeParts.sidebar);
  const homeInner = stripOuterMainDiv(homeParts.mainBlock);
  const profileInner = stripOuterMainDiv(profileParts.mainBlock);
  const calendarInner = stripOuterMainDiv(calendarParts.mainBlock);
  const settingsInner = stripOuterMainDiv(settingsParts.mainBlock);

  const combined = `<!DOCTYPE html>\n<html lang="en">\n${head}\n<body>\n${sidebar}\n<div id="pages-container">\n  <section id="home" class="page">\n${homeInner}\n  </section>\n  <section id="profile" class="page">\n${profileInner}\n  </section>\n  <section id="calendar" class="page">\n${calendarInner}\n  </section>\n  <section id="settings" class="page">\n${settingsInner}\n  </section>\n</div>\n<script src="studentScript.js" defer></script>\n</body>\n</html>`;

  const outFile = path.join(folder, 'student.html');
  fs.writeFileSync(outFile, combined, 'utf8');

  // append router to script
  appendRouterToScript(scriptF);

  // delete originals
  [homeF, profileF, calendarF, settingsF].forEach(f => { try { fs.unlinkSync(f); } catch (e) { /* ignore */ } });

  // remove studentStyle.css? keep it since some may rely on it; but links now use ../../style.css
  // Delete studentStyle.css as the user asked for no backups
  try { fs.unlinkSync(styleF); } catch (e) { /* ignore */ }

  return { skipped: false };
}

function main() {
  const entries = fs.readdirSync(studentsDir, { withFileTypes: true });
  let processed = 0, skipped = 0;
  entries.forEach(e => {
    if (!e.isDirectory()) return;
    const folder = path.join(studentsDir, e.name);
    const res = processStudentFolder(folder);
    if (res && res.skipped) skipped++; else processed++;
  });
  console.log('Done. Processed:', processed, 'Skipped:', skipped);
}

main();
