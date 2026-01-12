const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const studentsDir = path.join(root, 'public', 'student');

function safeRead(file) { try { return fs.readFileSync(file, 'utf8'); } catch (e) { return null; } }
function safeWrite(file, content) { try { fs.writeFileSync(file, content, 'utf8'); return true; } catch (e) { return false; } }

function extractHead(html) {
  const m = html.match(/<head[\s\S]*?<\/head>/i);
  return m ? m[0] : '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>VALMAtrack</title></head>';
}

function extractSidebar(html) {
  const bStart = html.indexOf('<body');
  if (bStart === -1) return '';
  const bOpen = html.indexOf('>', bStart) + 1;
  const pagesIdx = html.indexOf('<div id="pages-container"');
  if (pagesIdx === -1) return html.slice(bOpen, html.lastIndexOf('</body>'));
  return html.slice(bOpen, pagesIdx);
}

function extractSection(html, id) {
  const re = new RegExp(`<section\\s+id=\"${id}\"[\\s\\S]*?<\\/section>`,'i');
  const m = html.match(re);
  if (!m) return null;
  // remove the outer section tag
  return m[0].replace(new RegExp(`^<section[\\s\\S]*?>`),'').replace(/<\\/section>$/,'');
}

function restoreFiles(folder) {
  const combined = path.join(folder, 'student.html');
  if (!fs.existsSync(combined)) return { skipped: true };
  const html = safeRead(combined);
  if (!html) return { skipped: true };

  const head = extractHead(html).replace(/href=\"..\/..\/style.css\"/g, 'href="studentStyle.css"');
  const fs = require('fs');
  const path = require('path');

  const root = path.resolve(__dirname, '..');
  const studentsDir = path.join(root, 'public', 'student');

  function safeRead(file) { try { return fs.readFileSync(file, 'utf8'); } catch (e) { return null; } }
  function safeWrite(file, content) { try { fs.writeFileSync(file, content, 'utf8'); return true; } catch (e) { return false; } }

  function extractHead(html) {
    const m = html.match(/<head[\s\S]*?<\/head>/i);
    return m ? m[0] : '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>VALMAtrack</title></head>';
  }

  function extractSidebar(html) {
    const bStart = html.indexOf('<body');
    if (bStart === -1) return '';
    const bOpen = html.indexOf('>', bStart) + 1;
    const pagesIdx = html.indexOf('<div id="pages-container"');
    if (pagesIdx === -1) return html.slice(bOpen, html.lastIndexOf('</body>'));
    return html.slice(bOpen, pagesIdx);
  }

  function extractSection(html, id) {
    const re = new RegExp('<section\\s+id="' + id + '"[\\s\\S]*?<\\/section>','i');
    const m = html.match(re);
    if (!m) return null;
    // remove the outer section tag
    return m[0].replace(new RegExp('^<section[\\s\\S]*?>'),'').replace(/<\\/section>$/,'');
  }

  function restoreFiles(folder) {
    const combined = path.join(folder, 'student.html');
    if (!fs.existsSync(combined)) return { skipped: true };
    const html = safeRead(combined);
    if (!html) return { skipped: true };

    const head = extractHead(html).replace(/href=\"..\/..\/style.css\"/g, 'href="studentStyle.css"');
    const sidebar = extractSidebar(html);

    const sections = ['home','profile','calendar','settings'];
    sections.forEach(sec => {
      const content = extractSection(html, sec);
      if (!content) return;
      const titleMap = { home: 'Home', profile: 'Profile', calendar: 'Calendar', settings: 'Settings' };
      const out = '<!DOCTYPE html>\n<html lang="en">\n' + head.replace('<title>VALMAtrack - Student</title>','<title>VALMAtrack - '+titleMap[sec]+'</title>') + '\n<body>\n' + sidebar + '\n<div class="main-content" id="mainContent">\n' + content + '\n</div>\n<script src="studentScript.js"></script>\n</body>\n</html>';
      const outPath = path.join(folder, 'student' + (sec.charAt(0).toUpperCase()+sec.slice(1)) + '.html');
      safeWrite(outPath, out);
    });

    // recreate studentStyle.css as an import
    const stylePath = path.join(folder, 'studentStyle.css');
    safeWrite(stylePath, '@import url("../../style.css");\n');

    // remove router code from studentScript.js if present
    const scriptPath = path.join(folder, 'studentScript.js');
    if (fs.existsSync(scriptPath)) {
      let js = safeRead(scriptPath);
      if (js && js.includes('/* ROUTER ADDED BY merge_students.js */')) {
        js = js.split('/* ROUTER ADDED BY merge_students.js */')[0];
        safeWrite(scriptPath, js);
      }
    }

    // delete combined file
    try { fs.unlinkSync(combined); } catch (e) { /* ignore */ }

    return { skipped: false };
  }

  function removeHelpers() {
    const helpers = [
      path.join(root, 'scripts', 'merge_students.js'),
      path.join(root, 'scripts', 'patch_student_scripts.js'),
      path.join(root, 'scripts', 'patch_student_scripts_v2.js'),
      path.join(root, 'scripts', 'replace_nav_in_scripts.js'),
      path.join(root, 'FILE_TREE.txt')
    ];
    helpers.forEach(f => { try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch(e){} });
  }

  function main() {
    if (!fs.existsSync(studentsDir)) { console.error('Students dir not found'); return; }
    const entries = fs.readdirSync(studentsDir, { withFileTypes: true });
    let processed = 0, skipped = 0;
    entries.forEach(e => {
      if (!e.isDirectory()) return;
      const folder = path.join(studentsDir, e.name);
      const res = restoreFiles(folder);
      if (res && res.skipped) skipped++; else processed++;
    });
    removeHelpers();
    console.log('Revert done. Processed:', processed, 'Skipped:', skipped);
  }

  main();
