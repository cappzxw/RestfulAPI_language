import Sequelize from 'sequelize';
import request from 'request';
const sequelize = new Sequelize('minority_language', 'root', null, {
    host: '127.0.0.1',
    dialect: 'mysql'
});

const Word = sequelize.define('tibet', {
    english: Sequelize.STRING,
    chinese: Sequelize.STRING(2040),
    zang: Sequelize.STRING(2040)
});
const Urdu_u2e = sequelize.define('urdu_u2e', {
    urdu: {type: Sequelize.STRING, allowNull: false},
    english: {type: Sequelize.STRING(2040), allowNull: false},
});
const Urdu_e2c = sequelize.define('urdu_e2c', {
    english: Sequelize.STRING,
    chinese: Sequelize.STRING(2040),
});
const Uighur_u2c = sequelize.define('uighur_u2c', {
    uighur: {type: Sequelize.STRING(2040), allowNull: false},
    chinese: {type: Sequelize.STRING(2040), allowNull: false},
});
const Uighur_c2e = sequelize.define('uighur_c2e', {
    chinese: {type: Sequelize.STRING(2040), allowNull: false},
    english: {type: Sequelize.STRING(2040), allowNull: false},
});
// function getData(chinese){
//     return new Promise(function(resolve, reject){
//         let formData = {
//             lang : 'zh-cn_en',
//             src : chinese,
//         };
//         request.post({url:'https://nmt.xmu.edu.cn/nmt', form: formData}, function optionalCallback(err, httpResponse, body){
//                 if (err) {
//                     reject(err);
//                 }
//                 else{
//                     resolve(body);
//                 }
//             })
//     })
    
// }
module.exports = {
    //search words: english of initial: such as 'a'
    searchWord: async function searchWord(initial){
        const result = await Word.findAll({
            // limit: 5,
            attributes:[
                'english'
            ],
            where:{
                english: {
                    $like: initial+'%'
                }
            },
        });
        return result;
    },
    //seach chinese and zang translation of eng:english
    searchTrans: async function searchTrans(eng){
            const result = await Word.findOne({
                attributes:[
                    'english','chinese', 'zang'
                ],
                where:{
                    english: eng
                }
            });
            if(result == null){
                return '该条不存在';
            }
            else{
                return result;
            }
    },
    //update zang translation of eng: english
    updateTrans: async function updateTrans(eng, zang){
            const result = await Word.update({
                zang: zang
            },
            {
                where:{
                    english: eng
                }
            }
            );
            return result;
    },
    //dic for urdu
    searchUrdu: async function searchUrdu(page){
        const num = await Urdu_u2e.count();
        let data = {};
        let offset = (page-1) * 1000;
        let limit = 1000;
        if (page*1000 > num){
            limit = num - offset;
        }
        const result = await Urdu_u2e.findAll({
            offset: offset,
            limit: limit,
            attributes:[
                'id', 'urdu'
            ],
        });
        data.result = result;
        data.num = num;
        return data;
    },
    searchU2e: async function searchU2e(urdu){
        const result = await Urdu_u2e.findOne({
            attributes:[
                'urdu','english'
            ],
            where:{
                urdu: urdu
            }
        });
        if(result == null){
            return '该条不存在';
        }
        else{
            return result.english; 
        }
    },

    searchE2c: async function searchE2c(english){
        const result = await Urdu_e2c.findOne({
            attributes:[
                'english','chinese'
            ],
            where:{
                english: english
            }
        });
        if(result == null){
            return '该条不存在';
        }
        else{
            return result; 
        }
    },

    //dic for uighur
    searchUighur: async function searchUighur(page){
        const num = await Uighur_u2c.count();
        let data = {};
        let offset = (page-1) * 1000;
        let limit = 1000;
        if (page*1000 > num){
            limit = num - offset;
        }
        const result = await Uighur_u2c.findAll({
            offset: offset,
            limit: limit,
            attributes:[
                'id', 'uighur'
            ],
        });
        data.result = result;
        data.num = num;
        return data;
    },
    searchU2c: async function searchU2c(uighur){
        const result = await Uighur_u2c.findOne({
            attributes:[
                'uighur','chinese'
            ],
            where:{
                uighur: uighur
            }
        });
        // let result = {};
        // result.chinese = [];
        // let arr = item.chinese.split('|');
        // for (let i = 0; i < arr.length; i++){
        //     result.chinese.push(arr[i]);
        //     result.english = await getData(arr[i]);
        // }
        return result.chinese;
    },
    searchC2e: async function searchC2e(chinese){
        const result = await Uighur_c2e.findOne({
            attributes:[
                'chinese', 'english'
            ],
            where:{
                chinese: chinese
            }
        });

        return result.english;
    },

    //search all datas of table arg: name, sep, num, stop
    searchAllItems: async function searchAllItems(branch, lang){
            const table = lang + '_' + branch;  
            const Table = sequelize.define(table, {
                arg: Sequelize.STRING,
                content: Sequelize.STRING, 
            });
            const contents = await Table.findAll({
                // limit: 5,
                attributes:[
                    'arg', 'content'
                ],
            });
            return contents;
    },
    //create itm
    createItem: async function createItem(branch, arg, con, lang){
            const table = lang + '_' + branch;  
            const Table = sequelize.define(table, {
                arg: Sequelize.STRING,
                content: Sequelize.STRING, 
            });
            const flag = await Table.findOne({
                attributes:[
                    'arg', 'content'
                ],
                where:{
                    arg: arg
                }
            });
            if(flag == null){
                const result = await Table.create({
                    arg: arg,
                    content: con
                });
                if(result){
                    return '创建成功';
                }
            }
            else{
                return '该条已存在';
            }
    },

    deleteItem: async function deleteItem(branch, arg, lang) {
        const table = lang + '_' + branch;  
        const Table = sequelize.define(table, {
            arg: Sequelize.STRING,
            content: Sequelize.STRING, 
        });
        const result = await Table.destroy({
            where:{
                arg: arg,
            }
        });
        if(result){
            return '删除成功';
        }
        else{
            return '该条不存在';
        }
    },

    updateItem: async function updateItem(branch, arg, con, lang) {
        const table = lang + '_' + branch;  
        const Table = sequelize.define(table, {
            arg: Sequelize.STRING,
            content: Sequelize.STRING, 
        });
        const item = await Table.findOne({
            attributes:[
                'id'
            ],
            where:{
                $or: [
                    { arg: arg },
                    { content: con },
                ]
            }
        });
        //console.log(item.dataValues);
        if(item){
            const id = item.dataValues.id;
            const result = await Table.update({
                arg: arg,
                content: con
            },
            {
                where:{
                    id: id
                }
            }
            );
            if(result){
                return '更新成功';
            }
            else{
                return '更新失败';
            }
        }
        else{
            return '该条不存在';
        }
    },

    addFilePath: async function addFilePath(key, filepath, tag, lang){
            var Table = sequelize.define(lang, {
                key: {type: Sequelize.STRING, allowNull: false},
                filepath: {type: Sequelize.STRING(2040), allowNull: false},
                tag: {type: Sequelize.STRING, allowNull: false},
            });
            const result = await Table.create({
                key: key,
                filepath: filepath,
                tag: tag
            });
            if(result){
                return 'success';
            }
    },
    
    // file sys 
    searchFilePath: async function searchFilePath(key, lang){
            var Table = sequelize.define(lang, {
                key: {type: Sequelize.STRING, allowNull: false},
                filepath: {type: Sequelize.STRING(2040), allowNull: false},
                tag: {type: Sequelize.STRING, allowNull: false},
            });
            const result = await Table.findAll({
                attributes:[
                    'filepath'
                ],
                where:{
                    key: key
                }
            });
            return result;
    },
    //search the filelist
    searchKeyname: async function searchKeyname(tag, lang){
            var Table = sequelize.define(lang, {
                key: {type: Sequelize.STRING, allowNull: false},
                filepath: {type: Sequelize.STRING(2040), allowNull: false},
                tag: {type: Sequelize.STRING, allowNull: false},
            });
            const result = await Table.findAll({
                attributes:[
                    [sequelize.literal('distinct `key`'),'key']
                ],
                where:{
                    tag: tag
                },
            });
            return result;
    },

}