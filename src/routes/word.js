import exception from 'class/exception';

import { request, summary, body, tags, middlewares, path, description } from 'swag';

import sqlopr from 'modules/sqlopr';
import { query } from '../swag/index';

const tag = tags(['Word']);
const wordSchema = {
  eng: { type: 'string', required: true },
  chinese: { type: 'string', required: true },
  zang: { type: 'string', required: true }
};
const logTime = () => async (ctx, next) => {
  console.log(`start: ${new Date()}`);
  await next();
  console.log(`end: ${new Date()}`);
};
const msg_todo = '暂未开放';

export default class WordRouter {

  @request('get', '/dic/{lang}/words')
  @summary('word list')
  @tag
  @path({ lang: { type: 'string', required: true } })
  @query({ initial: { type: 'string', default: 1, required: true, description: 'initial' } })
  static async getAllWords(ctx) {
    const { lang } = ctx.validatedParams;
    if(lang == 'tibet'){
      const initial = ctx.query.initial;
      const result = await sqlopr.searchWord(initial);
      ctx.body = { result };
    }
    else{
      ctx.body = {msg_todo};
    }
  }

  @request('get', '/dic/{lang}/word/{eng}')
  @summary('get trans by english')
  @tag
  @path({ lang: { type: 'string', required: true },
          eng: { type: 'string', required: true }
  })
  static async getOneWord(ctx) {
    const {lang, eng} = ctx.validatedParams;
    if(lang == 'tibet'){
      const result = await sqlopr.searchTrans(eng);
      ctx.body = { result };
    }
    else{
      ctx.body = {msg_todo};
    }
  }

  @request('post', '/dic/{lang}/word/update')
  @summary('table branch item update')
  @tag
  @path({ lang: { type: 'string', required: true },
          // eng: { type: 'string', required: true }
  })
  // @query({
  //   zang: { type: 'string', default: 1, required: true, description: 'content' }
  // })
  @body(wordSchema)
  static async item_update(ctx) {
    const { lang } = ctx.validatedParams;
    //const zang = ctx.query.zang;
    const { eng, chinese, zang} = ctx.validatedBody;
    if(lang == 'tibet'){
      const result = await sqlopr.updateTran(eng, zang);
      ctx.body = { result };
    }
    else{
      ctx.body = { msg_todo };
    }
  }
}

