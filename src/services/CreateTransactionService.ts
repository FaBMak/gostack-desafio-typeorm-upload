import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
interface Balance {
  income: number;
  outcome: number;
  total: number;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transaciontsRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transaciontsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Insufficent Balance', 400);
    }

    const categoriesRepository = getRepository(Category);

    let transactionCategory = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!transactionCategory) {
      transactionCategory = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(transactionCategory);
    }

    const transaction = transaciontsRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory.id,
    });

    await transaciontsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
