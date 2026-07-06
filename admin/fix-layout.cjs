const fs = require('fs');

const files = [
  'd:/DEVELZY/mubtadiaat/admin/src/pages/master/AdminTingkatPage.tsx',
  'd:/DEVELZY/mubtadiaat/admin/src/pages/master/AdminKitabPage.tsx',
  'd:/DEVELZY/mubtadiaat/admin/src/pages/master/AdminKelasRombelPage.tsx',
  'd:/DEVELZY/mubtadiaat/admin/src/pages/master/AdminJenjangPage.tsx',
  'd:/DEVELZY/mubtadiaat/admin/src/pages/AdminUsersPage.tsx',
  'd:/DEVELZY/mubtadiaat/admin/src/pages/AdminLogsPage.tsx',
  'd:/DEVELZY/mubtadiaat/admin/src/pages/AdminBlokKamarPage.tsx',
  'd:/DEVELZY/mubtadiaat/admin/src/pages/santri/AlumniTab.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Pattern 1: space-x-2
    content = content.replace(/<Td className="text-right space-x-2">\s*([\s\S]*?)\s*<\/Td>/g, '<Td>\n                        <div className="flex items-center justify-end gap-2">\n                          $1\n                        </div>\n                      </Td>');
    
    // Pattern 2: text-right (without space-x-2)
    content = content.replace(/<Td className="text-right">\s*([\s\S]*?)\s*<\/Td>/g, '<Td>\n                        <div className="flex items-center justify-end gap-2">\n                          $1\n                        </div>\n                      </Td>');
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}
