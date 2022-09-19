/**
 *
 * @param {集合} db
 * @param {页码} page
 * @param {数量} size
 * @param {查询参数} screen
 */

const dateFormat = require('./dateFormat')

async function GetPage(db, page = 1, size = 10, screen) {
    const result = await Promise.all([
        db.countDocuments(screen),
        db
        .find(screen)
        .sort({ time: -1 })
        .limit(Number(size))
        .skip(Number(size) * (page - 1))
    ])
    result[1].forEach(item => (item._doc['time'] = item.time ? dateFormat(item.time) : ''))
    return {
        total: result[0],
        data: result[1],
        page: Number(page)
    }
}

module.exports = GetPage
