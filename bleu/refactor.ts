import * as fs from 'fs';
import * as path from 'path';

const replacements: Record<string, string> = {
  'bg-red-600': 'bg-[#007cba]',
  'text-red-600': 'text-[#007cba]',
  'border-red-600': 'border-[#007cba]',
  'hover:bg-red-700': 'hover:bg-[#005a87]',
  'hover:text-red-600': 'hover:text-[#007cba]',
  'text-red-100': 'text-[#ecfeff]',
  'bg-red-900': 'bg-[#005a87]',
  'text-red-200': 'text-[#ecfeff]',
  'text-red-500': 'text-[#007cba]',
  'bg-[#E53935]': 'bg-[#007cba]',
  'text-[#FFC107]': 'text-[#0891b2]',
  'bg-[#FFC107]': 'bg-[#0891b2]',
  'fill-[#FFC107]': 'fill-[#0891b2]',
  'hover:bg-yellow-400': 'hover:bg-[#006ba1]',
  'bg-[#111111]': 'bg-[#0f172a]',
  'text-gray-900': 'text-[#0f172a]',
  'bg-gray-900': 'bg-[#0f172a]',
  'text-gray-600': 'text-[#6b7280]',
  'text-gray-500': 'text-[#6b7280]',
  'text-gray-400': 'text-[#94a3b8]',
  'bg-[#059669]': 'bg-[#005a87]',
  'text-[#059669]': 'text-[#005a87]',
  'fill-[#059669]': 'fill-[#005a87]',
  'border-[#059669]': 'border-[#005a87]',
  'hover:bg-emerald-700': 'hover:bg-[#007cba]',
  'text-emerald-100': 'text-[#ecfeff]',
  'bg-[#0A1914]': 'bg-[#0f172a]',
  'text-[#1A222B]': 'text-[#0f172a]',
  'rounded-sm': 'rounded-[6px]',
  'rounded-md': 'rounded-[8px]',
  'rounded-xl': 'rounded-[12px]',
  'shadow-sm': 'shadow-custom-4',
  'shadow-md': 'shadow-custom-2',
  'shadow-lg': 'shadow-custom-1',
  'shadow-2xl': 'shadow-custom-3',
  'font-display': 'font-sans',
  'font-script': 'font-sans',
  'bg-[#115e59]': 'bg-[#005a87]',
  'text-[#facc15]': 'text-[#0891b2]',
  'bg-[#facc15]': 'bg-[#0891b2]',
  'hover:bg-[#eab308]': 'hover:bg-[#006ba1]'
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
