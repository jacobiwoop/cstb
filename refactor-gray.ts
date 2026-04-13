import * as fs from 'fs';
import * as path from 'path';

const replacements: Record<string, string> = {
  'bg-gray-50': 'bg-[#f8fafc]',
  'bg-gray-100': 'bg-[#f1f5f9]',
  'bg-gray-200': 'bg-[#e2e8f0]',
  'border-gray-50': 'border-[#f8fafc]',
  'border-gray-100': 'border-[#f1f5f9]',
  'border-gray-200': 'border-[#e2e8f0]',
  'border-gray-300': 'border-[#cbd5e1]',
  'border-gray-400': 'border-[#94a3b8]',
  'hover:bg-gray-50': 'hover:bg-[#f8fafc]',
  'hover:bg-gray-100': 'hover:bg-[#f1f5f9]',
  'hover:bg-gray-200': 'hover:bg-[#e2e8f0]',
  'hover:border-gray-300': 'hover:border-[#cbd5e1]',
  'hover:border-gray-400': 'hover:border-[#94a3b8]',
  'text-gray-200': 'text-[#e2e8f0]',
  'text-gray-300': 'text-[#cbd5e1]',
  'hover:text-gray-300': 'hover:text-[#cbd5e1]',
  'from-gray-50': 'from-[#f8fafc]',
  'fill-gray-50': 'fill-[#f8fafc]'
};

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir('./src');
