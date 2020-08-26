const pool = require('../../db')
const { ReasonPhrases } = require('http-status-codes')
const { GetOrderHistoryDTO } = require('../dto/get-order-history-dto')

const checkoutOrderResolver = async (parent, args, context) => {
  const { res } = await context
  const userId = res.locals.userId

  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()
    const findUnpaidOrderQuery = 'SELECT * FROM `order` WHERE user_id = ? and is_paid = 0'

    const [orders] = await conn.query(findUnpaidOrderQuery, [userId])
    if (!orders.length) throw new Error(ReasonPhrases.BAD_REQUEST)

    const checkoutOrderQuery = 'UPDATE `order` SET is_paid = 1 WHERE user_id = ?'

    const [rows] = await conn.query(checkoutOrderQuery, [userId])
    const { affectedRows } = rows

    await conn.commit()
    return { success: affectedRows === 1 }
  } catch (error) {
    conn.rollback()
    throw new Error(ReasonPhrases.INTERNAL_SERVER_ERROR)
  } finally {
    conn.release()
  }
}

const orderHistoryListResolver = async (parent, args, context) => {
  const { res } = await context
  const userId = res.locals.userId

  const conn = await pool.getConnection()

  try {
    const query = 'SELECT * FROM `order` WHERE user_id = ? and is_paid = 1 ORDER BY ordered_at DESC'
    const [rows] = await conn.query(query, [userId])
    const result = rows.map((row) => new GetOrderHistoryDTO(row))

    return result
  } catch {
    throw new Error(ReasonPhrases.INTERNAL_SERVER_ERROR)
  } finally {
    conn.release()
  }
}

module.exports = {
  checkoutOrderResolver,
  orderHistoryListResolver,
}
