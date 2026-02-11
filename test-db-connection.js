require('dotenv/config');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log('🔌 Intentando conectar a:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[0]);

client.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión:', err.message);
    console.error('📋 Detalles:', err);
    process.exit(1);
  }
  console.log('✅ Conexión exitosa!');

  client.query('SELECT version()', (err, res) => {
    if (err) {
      console.error('❌ Error en query:', err);
    } else {
      console.log('📊 Versión PostgreSQL:', res.rows[0].version);
    }
    client.end();
  });
});
