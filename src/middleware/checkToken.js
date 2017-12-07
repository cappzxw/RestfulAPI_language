const jwt = require('jsonwebtoken');
//检查token是否过期
module.exports = async ( ctx, next ) => {
    //拿到token
    if(ctx.request.header['authorization']){
        let token = ctx.request.header['authorization'].split(' ')[1];
        //解码token
        let decoded = jwt.decode(token, 'Sjtu10013');
        
        if(token && decoded.exp <= new Date()/1000){
            ctx.status = 401;
            ctx.body = {
                message: 'token过期'
            };
        }else{
            //如果权限没问题，那么交个下一个控制器处理
            return next();
        }
    }else{
        ctx.status = 401;
        ctx.body = {
            message: '没有token'
        }
    }
};