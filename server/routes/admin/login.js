module.exports = (app, plugin, model) => {
    const express = require('express');
    const router = express.Router();
    
    let {User} = model
    let {requestResult} = plugin

    const crypto = require('crypto');
    const jwt = require('jsonwebtoken');

    // 修改密码
    router.post('/password', (req, res) => {
        const [password, passwords] = ['p1', 'p2'].map(i => {
            return crypto.createHash('sha256').update(req.body[i]).digest('hex')
        })
        /**
         * 验证原密码 更新密码
         */
        User.findOne({password}, (err, docs) => {
            if (docs) {
                User.findOneAndUpdate({
                    password
                }, {
                    $set: { 
                        password: passwords
                    }
                }, (err, doc) => {
                    res.send(requestResult(1, '密码修改成功！'))
                })
            } else {
                res.send(requestResult(2, '原密码输入错误！'))
            }
        })
    })

    // 登录
    router.post('/login', async (req, res) => {
        const pwd = crypto.createHash('sha256').update(req.body.password).digest('hex');
        const info = {
            username: req.body.username,
            password: pwd
        }
        /**
         * 查找数据库是否有此用户
         */
        User.find(info, (err, docs) => {
            if(docs.length != 0){
                // 生成token
                const token = jwt.sign(info, 'Libai', {
                    expiresIn: 60 * 60 * 24  // 24小时过期
                })
                res.send(requestResult(1, {
                    message: '登录成功',
                    token: token
                }))
            }else{
                res.send(requestResult(2, {
                    message: '用户名或密码错误！',
                }))
            }
        })
    })

    // 创建账号
    router.post('/user', async (req, res) => {
        const len = await User.find().countDocuments()
        const pwd = crypto.createHash('sha256').update(req.body.password).digest('hex');
        const info = {
            username: req.body.username,
            password: pwd
        }
        if(len){
            res.json({
                status: 2,
                message: '请勿重复注册, 如遗忘密码, 自行操作数据库处理!',
            })
        }else{
            // 创建账号
            await User.create(info, (err, docs) => {
                if(docs.length != 0){
                    res.json({
                        status: 1,
                        message: '账号创建成功'
                    })
                }else{
                    res.json({
                        status: 2,
                        message: '创建失败,请检查数据库or服务器是否正常'
                    })
                }
            })
        }
    })
    app.use('/admin/api', router)
}