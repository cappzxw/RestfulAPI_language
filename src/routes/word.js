import exception from 'class/exception';

import { request, summary, body, tags, middlewares, path, description } from 'swag';

import sqlopr from 'modules/sqlopr';
import { query } from '../swag/index';
import checkToken from 'middleware/checkToken';

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
  @middlewares(checkToken)
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
    else if (lang == 'urdu'){
      const result = await sqlopr.searchUrdu();
      ctx.body = {result};
    }
    else if (lang == 'uighur'){
      const result = await sqlopr.searchUighur();
      ctx.body = {result};
    }
    else{
      ctx.body = {msg_todo};
    }
  }

  @request('get', '/dic/{lang}/word/{key}')
  @summary('get trans by english')
  @middlewares(checkToken)
  @tag
  @path({ lang: { type: 'string', required: true },
          key: { type: 'string', required: true }
  })
  static async getOneWord(ctx) {
    const {lang, key} = ctx.validatedParams;
    if(lang == 'tibet'){
      const result = await sqlopr.searchTrans(key);
      ctx.body = { result };
    }
    else if(lang == 'urdu'){
      let eng = await sqlopr.searchU2e(key);
      let result = {};
      result.urdu = key;
      result.english = [];
      result.chinese = [];
      eng = eng.split('|');
      for (let i = 0; i < eng.length; i++){
        result.english.push(eng[i]);
        let item = await sqlopr.searchE2c(eng[i]);
        result.chinese.push(item.chinese);
      }
      // console.log(result.chinese);
      ctx.body = { result };
    }
    else if (lang == 'uighur'){
      let result = await sqlopr.searchU2c(key);
      
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
      const result = await sqlopr.updateTrans(eng, zang);
      ctx.body = { result };
    }
    else{
      ctx.body = { msg_todo };
    }
  }
}

