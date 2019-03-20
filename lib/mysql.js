const mysql = require('mysql')
const log = require('../log')

let database = require('../config').mysql;

var pool = mysql.createPool({
    host        : database.HOST,
    user        : database.USERNAME,
    password    : database.PASSWORD,
    database    : database.DATABASE
})

let query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            }
            connection.query(sql, values, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
                // 结束会话
                connection.release()
            })
        })
    })
}

// 查询全表
let findAll = async(tablename, pagesize, currentpage) => {

    let offset = (currentpage - 1) * pagesize;
    
    let _sql = `
    SELECT SQL_CALC_FOUND_ROWS * FROM ${tablename} ORDER BY location, sublocation LIMIT ${offset}, ${pagesize};
    `
    let _sql2 = `
    SELECT FOUND_ROWS() as count;
    `

    let ret = {};
    await query(_sql).then(v => {
        ret.result = v;
    })
    await query(_sql2).then(v => {
        ret.total = v[0].count;
    })
    
    return ret;
}


// 条件查询
let findFilter = async (tablename, id, chinese, translation, pagesize, currentpage) => {

    let offset = (currentpage - 1) * pagesize;
    let ret = {};

    let _sql = `
    SELECT SQL_CALC_FOUND_ROWS * FROM ${tablename} WHERE IFNULL(id, '') LIKE '%${id}%' and IFNULL(text, '') LIKE '%${chinese}%' and IFNULL(translation, '') LIKE '%${translation}%' ORDER BY location, sublocation LIMIT ${offset}, ${pagesize};
    `

    let _sql2 = `
    SELECT FOUND_ROWS() as count;
    `
    
    await query(_sql).then(v => {
        ret.result = v;
    })
    
    await query(_sql2).then(v => {
        ret.total = v[0].count;
    })
    
    return ret;
}

// 修改
let updateTrans = async (tablename, translation, id) => {
    let _sql = `
    UPDATE ${tablename} SET translation='${translation}' WHERE id='${id}';
    `
    return query(_sql);
}

module.exports = {
    findAll,
    findFilter,
    updateTrans,
}