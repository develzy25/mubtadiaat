const { execSync } = require('child_process');

try {
  console.log("Fetching tables...");
  const output = execSync('npx wrangler d1 execute mubtadiat-db --remote --json --command="SELECT name FROM sqlite_master WHERE type=\'table\';"', { encoding: 'utf-8' });
  const data = JSON.parse(output);
  let tables = data[0].results.map(r => r.name).filter(n => n !== 'sqlite_sequence' && n !== '_cf_KV');
  
  console.log(`Dropping ${tables.length} tables...`);
  let attempts = 0;
  
  while (tables.length > 0 && attempts < 10) {
    attempts++;
    console.log(`Attempt ${attempts}...`);
    const nextTables = [];
    for (const t of tables) {
      try {
        execSync(`npx wrangler d1 execute mubtadiat-db --remote --command="PRAGMA foreign_keys=OFF; DROP TABLE IF EXISTS \`${t}\`;"`, { stdio: 'ignore' });
        console.log(`Dropped ${t}`);
      } catch (e) {
        // Failed, keep it for next round
        nextTables.push(t);
      }
    }
    tables = nextTables;
  }
  
  if (tables.length === 0) {
    console.log("All tables dropped successfully.");
  } else {
    console.log("Could not drop some tables: ", tables);
  }
} catch (e) {
  console.error("Error:", e.message);
}
