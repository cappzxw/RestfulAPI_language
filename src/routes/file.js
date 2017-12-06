import multer from 'koa-multer';
import _path from 'path';
import Doc from 'swag';
import parse from 'url-parse'
import sqlopr from 'modules/sqlopr';
import fs from 'fs';

const { request, summary, query, tags, path, formData, middlewares, responses, body } = Doc;

import config from 'config';

function getFileUrl(filename) {
  return `${config.baseUrl}/file/${filename}`;
}
const tag = tags(['File']);
const config_sort = ['教育', '军事', '体育', '娱乐', '财经', '科技'];
const date = new Date();
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    const a = parse(req.url,true).query.lang;
    cb(null, _path.resolve(`file/${a}/`))
  },
//filename: (req, file, cb) => cb(null, `${date.toJSON()}-${file.originalname}`)
  filename: (req, file, cb) => cb(null, `${file.originalname}`)
});
const upload = multer({ storage });
export default class SampleRouter {
  @request('post', '/fileupload')
  @summary('upload files and add path into sql')
  @tag
  @formData({
    file: { type: 'file', required: 'true', description: '上传文件，获取url' },
    //trfile: { type: 'file', required: 'true', description: '上传文件，获取url' },
  })
  //@middlewares([upload.fields([{ name: 'file'}, { name: 'trfile'}])])
  @middlewares([upload.single('file')])
  @query({
    // page: { type: 'number', default: 1, required: false, description: 'page number' },
    // limit: { type: 'number', default: 10, required: false, description: 'return item number limit' },
    lang: { type: 'string', default: 1, required: true, description: 'lang' },
    sort: { type: 'string', default: 1, required: true, description: 'sort' },
    key: { type: 'string', default: 1, required: true, description: 'key' },
  })
  @responses({ 200: { description: 'file upload success' }, 500: { description: 'something wrong about server' } })
  static async upload(ctx) {
    const file = ctx.req.file;
    const sort = ctx.query.sort;
    const key = ctx.query.key;
    //const filepath = file.path;
    file.url = getFileUrl(file.filename);
    //console.log(file); 
    const result = await sqlopr.addFilePath(key, file.path, sort);
    ctx.body = { result };
  }

  @request('get','/file/sorts')
  @summary('get  sorts of files')
  @tag
  static async getsort(ctx) {
    ctx.body = { config_sort };
  }

  @request('get','/file/filelist')
  @summary('get all filelist of one kind of sort')
  @tag
  @query({ lang: { type: 'string', required: true },
          sort: { type: 'string', required: true }
  })
  static async getfilelist(ctx) {
    const sort = ctx.query.sort;
    const result = await sqlopr.searchKeyname(sort);
    ctx.body = result;
  }

  @request('get','/file/filecontents')
  @summary('get filecontents of one file in the list')
  @tag
  @query({ lang: { type: 'string', required: true },
          key: { type: 'string', required: true }
  })
  static async getfilecontents(ctx) {
    const key = ctx.query.key;
    const path = await sqlopr.searchFilePath(key);
    let result = {};
    result.chfile = fs.readFileSync(path[0].filepath, "utf8");
    result.trfile = fs.readFileSync(path[1].filepath, "utf8");
    ctx.body = result;
  }
}
