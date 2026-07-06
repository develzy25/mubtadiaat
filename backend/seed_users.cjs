const fs = require('fs');
const { execSync } = require('child_process');

async function seedUsers() {
  const users = [
    { username: 'admin', email: 'admin@mubtadiaat.local', password: 'mubtadiaat123', name: 'Administrator', role: 1 },
    { username: 'mundzir', email: 'mundzir@mubtadiaat.local', password: 'mubtadiaat123', name: 'Mundzir', role: 2 },
    { username: 'mufatish', email: 'mufatish@mubtadiaat.local', password: 'mubtadiaat123', name: 'Mufatish', role: 3 },
    { username: 'mustahiq', email: 'mustahiq@mubtadiaat.local', password: 'mubtadiaat123', name: 'Mustahiq', role: 4 },
  ];

  for (const user of users) {
    try {
      console.log(`Registering ${user.username}...`);
      const response = await fetch('https://mubtadiat-db.eppds.workers.dev/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5174'
        },
        body: JSON.stringify({
          email: user.email,
          username: user.username,
          password: user.password,
          name: user.name,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`Success: ${user.email}`);
        
        // Update role in DB
        console.log(`Updating role for ${user.email} to ${user.role}...`);
        execSync(`npx wrangler d1 execute mubtadiat-db-v2 --remote --command="UPDATE users SET role = ${user.role} WHERE email = '${user.email}';"`);
        
      } else {
        console.error(`Failed: ${user.email} - ${JSON.stringify(data)}`);
      }
    } catch (e) {
      console.error(`Error for ${user.email}:`, e.message);
    }
  }
}

seedUsers();
