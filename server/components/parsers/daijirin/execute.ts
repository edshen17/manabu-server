import { createClient, SchemaFieldTypes } from 'redis';

// read .env vars!!
(async () => {
  // const daijirinParser = await makeDaijirinParser;
  // const t = await makeJsonDbService;
  // daijirinParser.parse();
  const client = createClient({
    // url: 'redis://default:T6zMi3oZGlxEZtOeZ5Sht8pI4MT6VnAs@redis-17774.c261.us-east-1-4.ec2.cloud.redislabs.com:17774',
  }) as any;
  await client.connect();
  try {
    await client.ft.create(
      'idx:users',
      {
        '$.name': {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: 'UNF',
        },
        '$.age': {
          type: SchemaFieldTypes.NUMERIC,
          AS: 'age',
        },
        '$.coins': {
          type: SchemaFieldTypes.NUMERIC,
          AS: 'coins',
        },
      },
      {
        ON: 'JSON',
        PREFIX: 'noderedis:users',
      }
    );
    // this._jsonDbService = await makeJsonDbService;
  } catch (err) {
    console.log(err);
  }
})();
