import exception from 'class/exception';

import { request, summary, body, tags, middlewares, path, description } from 'swag';

import { query } from '../swag/index';
import checkToken from 'middleware/checkToken';
import config from 'config';
const tag = tags(['Language']);

// const logTime = () => async (ctx, next) => {
//   console.log(`start: ${new Date()}`);
//   await next();
//   console.log(`end: ${new Date()}`);
// };
const msg_todo = '暂未开放';
const lang_config = {
    english: ['tibet', 'urdu'],
    chinese: ['藏语', '乌尔都语'],
};
export default class LanguageRouter {

  @request('get', '/dic/languages')
  @summary('language list')
  @middlewares(checkToken)
  @tag
  static async getAllLanguages(ctx) {
    //ctx.body = {lang_config};
    ctx.body = config.baseLanguage;
  }

  @request('get', '/dic/branches/{lang}')
  @summary('language list')
  @middlewares(checkToken)
  @path({ lang: { type: 'string', required: true }})
  @tag
  static async getAllBranch(ctx) {
    const lang = ctx.validatedParams.lang;
    ctx.body = config.baseBranch[lang];
  }

}

