import exception from 'class/exception';

import { request, summary, body, tags, middlewares, path, description } from 'swag';

import sqlopr from 'modules/sqlopr';
import { query } from '../swag/index';
import checkToken from 'middleware/checkToken';

const tag = tags(['Item']);
const itemSchema = {
  arg: { type: 'string', required: true },
  content: { type: 'string' },
};

const logTime = () => async (ctx, next) => {
  console.log(`start: ${new Date()}`);
  await next();
  console.log(`end: ${new Date()}`);
};
const msg_todo = '暂未开放';

export default class ItemRouter {

  @request('get', '/add/{lang}/{branch}/show')
  @summary('table branch list')
  @middlewares(checkToken)
  @tag
  @path({ lang: { type: 'string', required: true },
          branch: { type: 'string', required: true }
  })
  static async getAllItems(ctx) {
    const { lang, branch } = ctx.validatedParams;
    const result = await sqlopr.searchAllItems(branch, lang);
    ctx.body = { result };
  }
  
  @request('post', '/add/{lang}/{branch}/create')
  @summary('table branch item create')
  @tag
  @body(itemSchema)
  @path({ lang: { type: 'string', required: true },
          branch: { type: 'string', required: true }
  })
  // @query({
  //   arg: { type: 'string', default: 1, required: true, description: 'arg' },
  //   content: { type: 'string', default: 1, required: true, description: 'content' }
  // })
  static async item_create(ctx) {
    const { lang, branch } = ctx.validatedParams;
    // const arg = ctx.query.arg;
    // const content = ctx.query.content;
    const { arg, content } = ctx.validatedBody;
    const result = await sqlopr.createItem(branch, arg, content, lang);
    ctx.body = { result };
  }

  @request('post', '/add/{lang}/{branch}/delete')
  @summary('table branch item delete')
  @tag
  @path({ lang: { type: 'string', required: true },
          branch: { type: 'string', required: true }
  })
  // @query({
  //   arg: { type: 'string', default: 1, required: true, description: 'arg' },
  // })
  @body(itemSchema)
  static async item_delete(ctx) {
    const { lang, branch } = ctx.validatedParams;
    // const arg = ctx.query.arg;
    const { arg } = ctx.validatedBody;
    const result = await sqlopr.deleteItem(branch, arg, lang);
    ctx.body = { result };
  }

  @request('post', '/add/{lang}/{branch}/update')
  @summary('table branch item update')
  @tag
  @path({ lang: { type: 'string', required: true },
          branch: { type: 'string', required: true }
  })
  // @query({
  //   arg: { type: 'string', default: 1, required: true, description: 'arg' },
  //   content: { type: 'string', default: 1, required: true, description: 'content' }
  // })
  @body(itemSchema)
  static async item_update(ctx) {
    const { lang, branch } = ctx.validatedParams;
    // const arg = ctx.query.arg;
    // const con = ctx.query.content;
    const { arg, content } = ctx.validatedBody;
    const result = await sqlopr.updateItem(branch, arg, content, lang);
    ctx.body = { result };
  }
}

