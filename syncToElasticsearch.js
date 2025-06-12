import { db } from "./database/pgsql.js";
import esClient from "./services/elasticsearch.service.js";

async function indexTours() {
  const tours = await db.any(`SELECT * FROM "Tour"`);

  for (const tour of tours) {
    await esClient.index({
      index: 'tours',
      id: tour.id,
      body: tour,
    });
  }

  await esClient.indices.refresh({ index: 'tours' });
}

indexTours().catch(console.error);
