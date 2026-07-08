
const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\\\Users\\\\ASUS\\\\.gemini\\\\antigravity-ide\\\\brain\\\\eaf70957-7e01-497e-8de0-5e7943b85ec7\\\\.system_generated\\\\logs\\\\transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lastWrite = null;

  for await (const line of rl) {
    if (line.includes('write_to_file') && line.includes('SantriTab.tsx')) {
      const data = JSON.parse(line);
      if (data.tool_calls) {
        for (const tc of data.tool_calls) {
          if (tc.name === 'write_to_file' && tc.args.TargetFile.includes('SantriTab.tsx')) {
            lastWrite = tc.args.CodeContent;
          }
        }
      }
    }
  }

  if (lastWrite) {
    fs.writeFileSync('src/pages/santri/SantriTab.tsx', lastWrite);
    console.log('Restored successfully');
  } else {
    console.log('Not found');
  }
}

processLineByLine();

