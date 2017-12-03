import multer from 'koa-multer';
import _path from 'path';
import Doc from 'swag';
import parse from 'url-parse'

const { request, summary, query, tags, path, formData, middlewares, responses, body } = Doc;

import config from 'config';

function getFileUrl(filename) {
  return `${config.baseUrl}/file/${filename}`;
}
const tag = tags(['Fileupload']);
const date = new Date();
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    const a = parse(req.url,true).query.lang;
    cb(null, _path.resolve(`file/${a}/`))
  },
  filename: (req, file, cb) => cb(null, `${date.toJSON()}-${file.originalname}`)
});
const upload = multer({ storage });
export default class SampleRouter {
  @request('post', '/fileupload')
  @summary('showing upload files example using koa-multer')
  @tag
  @formData({
    file: { type: 'file', required: 'true', description: '上传文件，获取url' },
  })
  @middlewares([upload.single('file')])
  @query({
    // page: { type: 'number', default: 1, required: false, description: 'page number' },
    // limit: { type: 'number', default: 10, required: false, description: 'return item number limit' },
    lang: { type: 'string', default: 1, required: true, description: 'lang' }
  })
  @responses({ 200: { description: 'file upload success' }, 500: { description: 'something wrong about server' } })
  static async upload(ctx) {
    const file = ctx.req.file;
    file.url = getFileUrl(file.filename);
    ctx.body = { result: file };
  }
}
