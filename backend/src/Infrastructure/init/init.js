import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import Node from '../model/Node.js';
import Way from '../model/Way.js';

dotenv.config();

const __dirname = path.resolve();

await mongoose.connect(process.env.Mongo_Uri);

const nodeCount = await Node.countDocuments();
const wayCount = await Way.countDocuments();

if (nodeCount > 0 || wayCount > 0) {
  console.log('🟡 The database is not empty. Exiting...');
  process.exit(0);
}

const dataPath = path.join(__dirname, '..', 'media', 'data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

const nodeOps = [];
const wayOps = [];

for (const item of data) {
  if (item.type === 'node') {
    nodeOps.push({
      updateOne: {
        filter: { _id: item.id },
        update: {
          $setOnInsert: {
            lat: item.lat,
            lon: item.lon,
            tags: item.tags || {}
          }
        },
        upsert: true
      }
    });
  } else if (item.type === 'way') {
    wayOps.push({
      updateOne: {
        filter: { _id: item.id },
        update: {
          $setOnInsert: {
            nodes: item.nodes,
            tags: item.tags || {}
          }
        },
        upsert: true
      }
    });
  }
}

if (nodeOps.length > 0) {
  const nodeResult = await Node.bulkWrite(nodeOps);
  console.log(`🟢 Nodes inserted: ${nodeResult.upsertedCount}`);
  console.log(`⚪️ Nodes omitted: ${nodeOps.length - nodeResult.upsertedCount}`);
}

if (wayOps.length > 0) {
  const wayResult = await Way.bulkWrite(wayOps);
  console.log(`🟢 Ways inserted: ${wayResult.upsertedCount}`);
  console.log(`⚪️ Ways omitted: ${wayOps.length - wayResult.upsertedCount}`);
}

console.log('✅ Import completed successfully.');
process.exit(0);
