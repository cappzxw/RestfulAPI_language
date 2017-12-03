import exception from 'class/exception';

import { request, summary, body, tags, middlewares, path, description } from 'swag';
import { query } from '../swag/index';

const tag = tags(['User']);
const userSchema = {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
};

const logTime = () => async (ctx, next) => {
  console.log(`start: ${new Date()}`);
  await next();
  console.log(`end: ${new Date()}`);
};


export default class UserRouter {
  // @request('POST', '/user/register')
  // @summary('register user')
  // @description('example of api')
  // @tag
  // @middlewares([logTime()])
  // @body(userSchema)
  // static async register(ctx) {
  //   const { name } = ctx.validatedBody;
  //   const user = { name };
  //   ctx.body = { user };
  // }

  @request('post', '/user/login')
  @summary('user login, password is 123456')
  @tag
  @body(userSchema)
  static async login(ctx) {
    // const name = ctx.query.name;
    // const password = ctx.query.password;
    const { name, password } = ctx.validatedBody;
    if (name !== 'admin') throw new exception.ForbiddenError('用户名不存在');
    if (password !== 'admin') throw new exception.ForbiddenError('密码错误');
    const msg = 'success';
    ctx.body = { msg };
  }

}

