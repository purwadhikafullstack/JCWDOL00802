const TransactionModel = require("../model/transaction");
const { Op } = require("sequelize");
const cron = require('node-cron');
const { cancelTransaction }  = require('./transaction.js');
const sequelize = require("sequelize");

const checkAndUpdateTransactions = async () => {
  try {
    // Get current date and time
    const now = new Date();

    // Find transactions with transaction_status of 1 and created more than 2 days ago
    const transactions = await TransactionModel.findAll({
      where: {
        transaction_status: 1,
        date: {
          [Op.lte]: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
      },
    });

    // If transactions are found, cancel them
    if (transactions.length > 0) {
      for (const transaction of transactions) {
        // Call the cancelTransaction function
        await cancelTransaction(
          { query: { id: transaction.id_transaction } },
          {
            status: () => ({ send: () => {} }), 
          }
        );
      }
    }

  } catch (error) {
    console.error("Error in checkAndUpdateTransactions:", error);
  }
}

const job = cron.schedule('0 */12 * * *', checkAndUpdateTransactions, {
  scheduled: true,
  timezone: 'Asia/Jakarta'
});
job.start();


