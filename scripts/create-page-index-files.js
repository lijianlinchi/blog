// Script to create index.json files for pages in the format expected by Aurora theme
// This script runs after hexo generate

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../public/api/pages');
const pages = ['about', 'links', 'messages', 'projects', 'timeline'];

pages.forEach(pageName => {
  const pageJsonPath = path.join(pagesDir, `${pageName}.json`);
  const pageDirPath = path.join(pagesDir, pageName);
  const indexJsonPath = path.join(pageDirPath, 'index.json');

  // Check if the page JSON file exists
  if (fs.existsSync(pageJsonPath)) {
    // Create directory if it doesn't exist
    if (!fs.existsSync(pageDirPath)) {
      fs.mkdirSync(pageDirPath, { recursive: true });
    }

    // Copy the JSON file to index.json
    const content = fs.readFileSync(pageJsonPath, 'utf8');
    fs.writeFileSync(indexJsonPath, content, 'utf8');
    console.log(`Created ${indexJsonPath}`);
  } else {
    // Create a default JSON file if the page doesn't exist
    if (!fs.existsSync(pageDirPath)) {
      fs.mkdirSync(pageDirPath, { recursive: true });
    }

    const defaultContent = JSON.stringify({
      title: pageName,
      date: new Date().toISOString(),
      updated: new Date().toISOString(),
      comments: true,
      path: `api/pages/${pageName}.json`,
      covers: null,
      excerpt: null,
      content: ''
    }, null, 2);

    fs.writeFileSync(indexJsonPath, defaultContent, 'utf8');
    console.log(`Created default ${indexJsonPath}`);
  }
});

console.log('Page index.json files created successfully!');

