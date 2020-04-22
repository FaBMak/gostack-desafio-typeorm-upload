import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transaciontsRepository = getCustomRepository(TransactionsRepository);

    const transactionToRemove = await transaciontsRepository.findOne(id);

    if (transactionToRemove) {
      await transaciontsRepository.remove(transactionToRemove);
    } else {
      throw new AppError('Transaction not found', 401);
    }
  }
}

export default DeleteTransactionService;
