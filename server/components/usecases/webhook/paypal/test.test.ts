// import { GCS_KEYFILE } from '../../../../constants';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { makeContentDbService } from '../../../dataAccess/services/content';
import { ContentDbService } from '../../../dataAccess/services/content/contentDbService';
import { makeGraphDbService } from '../../../dataAccess/services/graph';
import { GraphDbService } from '../../../dataAccess/services/graph/graphDbService';
const fs = require('fs');

let contentDbService: ContentDbService;
let graphDbService: GraphDbService;
let dbServiceAccessOptions: DbServiceAccessOptions;

before(async () => {
  contentDbService = await makeContentDbService;
  graphDbService = await makeGraphDbService;
  dbServiceAccessOptions = contentDbService.getBaseDbServiceAccessOptions();
});

describe('test', () => {
  it('should run', async () => {
    // const wikiContent = await contentDbService.findOne({
    //   searchQuery: {
    //     title: '哲学',
    //   },
    //   dbServiceAccessOptions,
    // });
    // fs.writeFile('./tetsugaku.json', JSON.stringify(wikiContent, null, 4), () => {
    //   console.log('File has been created');
    // });
    // const text = await (
    //   await wiki({ apiUrl: 'https://ja.wikipedia.org/w/api.php' }).page('哲学')
    // ).langlinks();
    // const en = text.find((t) => {
    //   return t.lang == 'en';
    // });
    // const enWiki = await (await wiki().page(en!.title)).rawContent();
    // console.log(en);
    // const language = require('@google-cloud/language');
    // const gcsKeyfile = JSON.parse(GCS_KEYFILE);
    // const { project_id, private_key, client_email } = gcsKeyfile;
    // const client = new language.LanguageServiceClient({
    //   projectId: project_id,
    //   credentials: {
    //     client_email,
    //     private_key,
    //   },
    // });
    // const document = {
    //   content: text,
    //   type: 'PLAIN_TEXT',
    // };
    // const [classification] = await client.classifyText({ document });
    // console.log(classification);
    // wiki({ apiUrl: 'https://ja.wikipedia.org/w/api.php' })
    //   .page('哲学')
    //   .then((page) => console.log(page.rawContent()));
  });
});

// const vision = require('@google-cloud/vision')({
//   projectId: 'my-project-ID',
//   credentials: JSON.parse(GCS_KEYFILE),
// });

// describe('test', () => {
//   it('should work', async () => {
//     const vision = require('@google-cloud/vision');
//     const gcsKeyfile = JSON.parse(GCS_KEYFILE);
//     const { project_id, private_key, client_email } = gcsKeyfile;
//     // Creates a client
//     const client = new vision.ImageAnnotatorClient({
//       projectId: project_id,
//       credentials: {
//         client_email,
//         private_key,
//       },
//     });
//     const fileName = `${__dirname}/test.png`;
//     const [result] = await client.textDetection(fileName);
//     const detections = result.textAnnotations;
//     console.log(detections[0]);
//   });
// });
