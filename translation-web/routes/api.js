/**
 *
 * @param {string} global.config config.json配置数据
 * @return {Object} {
 *      sta  : 返回状态(err: -1, suc: 1, 成功但不提示：0)
 *      msg  : 返回信息
 *      data : 返回数据
 * }
 */

const router = require('koa-router')()
const tokenController = require('./utils/token')
const mysqlController = require('../lib/mysql')
const log = require('../log')
const moment = require('moment')
const fs = require('fs')
const path = require('path')
 
// 登入
router.post('/login', async (ctx, next) => {

    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    
    let user = global.config.user;
    let sta, msg, data;

    let flag = false;
    for(let i = 0, len = user.length; i < len; i++) {
        if (user[i].username == username) {
            flag = true;
            if (user[i].password == password) {
                // 生成一个新的token
                let token = tokenController.createToken(username);
                
                sta = 1;
                msg = "登入成功";
                data = {
                    username,
                    token,
                }

            } else {
                sta = -1;
                msg = "密码错误";
            }
        }
    }

    if (!flag) {
        sta = -1;
        msg = "用户不存在";
    }
    
    ctx.response.body = {
        sta,
        msg,
        data
    }
})

// 获取languageList
router.get('/languagelist', async (ctx, next) => {

    let sta, msg, data;

    if (global.config.languagelist) {
        sta = 0;
        data = global.config.languagelist;
    } else {
        sta = -1;
        msg = "languagelist读取失败";
    }
    
    ctx.response.body = {
        sta,
        msg,
        data
    }
})

// 查询
router.post('/search', tokenController.checkToken, async (ctx, next) => {

    let language    = ctx.request.body.language;
    let id          = ctx.request.body.id;
    let chinese     = ctx.request.body.chinese;
    let translation = ctx.request.body.translation;
    let pagesize    = ctx.request.body.pagesize;
    let currentpage = ctx.request.body.currentpage;
    let hasinfo     = ctx.request.body.hasinfo;
    
    let sta, msg, data;
    
    if (!language) {
        ctx.response.body = {
            sta: -1,
            msg: 'language不能为空'
        }
        return;
    }

    // 查询整表
    if (!id && !chinese && !translation) {
        await mysqlController.findAll(language, pagesize, currentpage).then(v => {
            hasinfo ? sta = 1 : sta = 0;
            msg = '查询成功';
            data = v;
            
        }).catch(e => {
            sta = -1;
            msg = e.sqlMessage;
            console.log(e);
        })
    } 
    
    // 条件查询
    if (id || chinese || translation) {
        // 转义字符处理
        translation = JSON.stringify(translation)
        translation = translation.slice(1, translation.length -1)

        chinese = JSON.stringify(chinese)
        chinese = chinese.slice(1, chinese.length - 1)
        
        await mysqlController.findFilter(language, id, chinese, translation, pagesize, currentpage).then(v => {

            hasinfo ? sta = 1 : sta = 0;
            msg = '查询成功';
            data = v;
        }).catch(e => {
            sta = -1;
            msg = e.sqlMessage;
            console.log(e);
        })
    }
    
    ctx.response.body = {
        sta,
        msg,
        data
    }
})

// 修改
router.post('/update', tokenController.checkToken, async (ctx, next) => {
    
    let language        = ctx.request.body.language;
    let id              = ctx.request.body.id;
    let new_translation = ctx.request.body.new_translation;
    let old_translation = ctx.request.body.old_translation;
    
    let sta, msg, data;
    if (!language) {
        ctx.response.body = {
            sta: -1,
            msg: 'language不能为空'
        }
        return;
    }

    // 转义字符处理
    new_translation = JSON.stringify(new_translation)
    new_translation = new_translation.slice(1, new_translation.length - 1)

    await mysqlController.updateTrans(language, new_translation, id).then(v => {
        if (v.affectedRows == 1) {
            sta = 1;
            msg = "修改成功";
        } else {
            sta = -1;
            msg = "修改失败";
        }
    }).catch(e => {
        sta = -1;
        msg = e.sqlMessage;
        console.log(e);
    })

    let logMsg = sta !== -1 ? 'sucess' : 'fail';
    log.logger.info(`
    [translationLog_br]
    user            [translationLog] ${ctx.state.user.username} [translationLog_br]
    oper            [translationLog] update [translationLog_br]
    id              [translationLog] ${id} [translationLog_br]
    tablename       [translationLog] ${language} [translationLog_br]
    old_translation [translationLog] ${old_translation} [translationLog_br]
    new_translation [translationLog] ${new_translation} [translationLog_br]
    result          [translationLog] ${logMsg} [translationLog_br]
    [translationLog_end]`)
    
    ctx.response.body = {
        sta,
        msg,
        data,
    }
})

// 查询logs
router.post('/logs', tokenController.checkToken, async (ctx, next) => {

    let begintime = moment(ctx.request.body.begintime).format('YYYYMMDD')

    let filePathname = path.join(__dirname, `../logs/translation_${begintime}`);

    let sta, msg, data;

    try {
        if (fs.existsSync(filePathname)) {
            sta = 0;
            data = fs.readFileSync(filePathname, 'utf8');
        } else {
            sta = 0;
            data = '';
        }
    } catch (error) {
        console.log(error);
    }

    ctx.response.body = {
        sta,
        msg,
        data
    }
})

module.exports = router