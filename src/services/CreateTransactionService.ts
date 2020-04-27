import { getCustomRepository, getRepository } from 'typeorm';

// import Transaction from '../models/Transaction';
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

interface TransactionDTO {
  id: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_id: string;
  created_at: Date;
  updated_at: Date;
  category: Category;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<TransactionDTO> {
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

    return {
      id: transaction.id,
      title: transaction.title,
      type: transaction.type,
      value: transaction.value,
      category_id: transaction.category_id,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
      category: transactionCategory,
    };
  }
}

export default CreateTransactionService;
