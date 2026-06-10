const fs = require('fs');
const path = 'src/Pages/Auth/Css/UserMgm.css';
let content = fs.readFileSync(path, 'utf8');

// Swap the colors: activate-action should be RED, danger-action should be GREEN
const oldBlock = ".suspend-btn.activate-action {\r\n  background: #16a34a;\r\n  color: #ffffff;\r\n}\r\n\r\n.suspend-btn.activate-action:hover {\r\n  background: #15803d;\r\n}\r\n\r\n.suspend-btn.danger-action {\r\n  background: #dc2626;\r\n  color: #ffffff;\r\n}\r\n\r\n.suspend-btn.danger-action:hover {\r\n  background: #b91c1c;\r\n}";

const newBlock = ".suspend-btn.activate-action {\r\n  background: #dc2626;\r\n  color: #ffffff;\r\n}\r\n\r\n.suspend-btn.activate-action:hover {\r\n  background: #b91c1c;\r\n}\r\n\r\n.suspend-btn.danger-action {\r\n  background: #16a34a;\r\n  color: #ffffff;\r\n}\r\n\r\n.suspend-btn.danger-action:hover {\r\n  background: #15803d;\r\n}";

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync(path, content);
  console.log('SUCCESS: Colors swapped! Active=green, Suspended=red');
} else {
  console.log('FAILED: Could not find old block');
}
