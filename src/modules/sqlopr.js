import Sequelize from 'sequelize';

const sequelize = new Sequelize('minority_language', 'root', null, {
    host: '127.0.0.1',
    dialect: 'mysql'
});

const Word = sequelize.define('tibet', {
    english: Sequelize.STRING,
    chinese: Sequelize.STRING(2040),
    zang: Sequelize.STRING(2040)
});


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