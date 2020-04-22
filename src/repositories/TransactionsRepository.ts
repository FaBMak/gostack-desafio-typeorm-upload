/* eslint-disable no-param-reassign */
import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import CreateCategoryService from '../services/CreateCategoryService';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (acummulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            acummulator.income += Number(transaction.value);
            break;
          case 'outcome':
            acummulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }

        return acummulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }

  public async getCategory(category: string): Promise<Category> {
    const createCategory = new CreateCategoryService();

    const categoryExists = await createCategory.execute({
      title: category,
    });

    return categoryExists;
  }
}

export default TransactionsRepository;
