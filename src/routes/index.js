import Router from 'koa-router';

import FileuploadRouter from 'routes/fileupload';
import UserRouter from 'routes/user';
import WordRouter from 'routes/word';
import ItemRouter from 'routes/item';
import LanguageRouter from 'routes/language';

import { wrapper } from 'swag';

const router = new Router();

wrapper(router);

router.swagger({ swaggerHtmlEndpoint: '/swagger-html', swaggerJsonEndpoint: '/swagger-json', title: 'Server', description: 'API DOC', version: '1.0.0' });

router.map(FileuploadRouter);
router.map(UserRouter);
router.map(LanguageRouter);
router.map(WordRouter);
router.map(ItemRouter);


export default router;
