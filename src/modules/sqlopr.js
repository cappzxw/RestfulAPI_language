import Sequelize from 'sequelize';

// const sequelize = new Sequelize('minority_language', 'root', null, {
//     host: '127.0.0.1',
//     dialect: 'mysql'
// });

const sequelize = new Sequelize('minority_language', 'capp', 'Sjtu10013', {
    host: '139.224.15.56',
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
    //search all datas of table arg: name, sep, num
    searchAllItems: async function searchAllItems(branch){
            const table = 'tibet_' + branch;  
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
    createItem: async function createItem(branch, arg, con){
            const table = 'tibet_' + branch;  
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

    deleteItem: async function deleteItem(branch, arg) {
        const table = 'tibet_' + branch;  
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

    updateItem: async function updateItem(branch, arg, con) {
        const table = 'tibet_' + branch;  
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

    addFilePath: async function addFilePath(foldername,chpath, trpath, tag){
            const table = 'tibet_filepath';  
            const Table = sequelize.define(table, {
                arg: Sequelize.STRING,
                content: Sequelize.STRING, 
            });
            const result = await Table.create({
                foldername: foldername,
                chpath: chpath,
                trpath: trpath,
                tag: tag
            });
    },

    searchFilePath: async function searchFilePath(foldername){
            const table = 'tibet_filepath';  
            const Table = sequelize.define(table, {
                arg: Sequelize.STRING,
                content: Sequelize.STRING, 
            });
            const result = await Table.findOne({
                attributes:[
                    'chpath', 'trpath'
                ],
                where:{
                    foldername: foldername
                }
            });
            return result;
    },

    searchFolder: async function searchFolder(tag){
            const table = 'tibet_filepath';  
            const Table = sequelize.define(table, {
                arg: Sequelize.STRING,
                content: Sequelize.STRING, 
            });
            const result = await Table.findAll({
                attributes:[
                    'foldername',
                ],
                where:{
                    tag: tag
                }
            });
            return result;
    },

}