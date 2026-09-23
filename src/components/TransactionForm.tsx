import React, { useState } from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight, Check, Clock } from 'lucide-react';
import { CategoryId, Transaction, TransactionType } from '../types.ts';
import { CATEGORIES } from '../data/categories.ts';
import { CategoryIcon } from './CategoryIcon.tsx';
import { getTodayString, parseCurrencyInput } from '../utils/formatters.ts';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [isPending, setIsPending] = useState(false); // Gasto previsto
  const [description, setDescription] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<CategoryId>('alimentacao');
  const [date, setDate] = useState(getTodayString());
  const [error, setError] = useState<string | null>(null);

  // Available categories based on selected type
  const availableCategories = CATEGORIES.filter(
    (c) => c.type === 'both' || c.type === type
  );

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory('salario');
      setIsPending(false);
    } else {
      setCategory('alimentacao');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanAmount = parseCurrencyInput(amountStr);
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      setError('Por favor, informe um valor válido maior que zero.');
      return;
    }

    if (!description.trim()) {
      setError('Por favor, adicione uma breve descrição.');
      return;
    }

    onAddTransaction({
      description: description.trim(),
      amount: cleanAmount,
      type,
      category,
      date: date || getTodayString(),
      status: type === 'expense' && isPending ? 'pending' : 'paid',
    });

    // Reset form
    setDescription('');
    setAmountStr('');
    setDate(getTodayString());
    setIsPending(false);
    setError(null);
    setIsOpen(false);
  };

  return (
    <div
      id="transaction-form-container"
      className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 mb-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors"
    >
      {!isOpen ? (
        <button
          id="btn-open-new-transaction"
          type="button"
          onClick={() => {
            setIsPending(false);
            setDate(getTodayString());
            setIsOpen(true);
          }}
          className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nova Movimentação</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} id="form-new-transaction" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Registrar movimentação
            </h3>
            <button
              id="btn-cancel-transaction"
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsPending(false);
                setError(null);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          {/* Type Toggle: Despesa vs Entradas */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100/80 dark:bg-zinc-800 rounded-xl">
            <button
              id="btn-type-expense"
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-white dark:bg-zinc-900 text-rose-700 dark:text-rose-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Despesa</span>
            </button>

            <button
              id="btn-type-income"
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Entradas</span>
            </button>
          </div>

          {/* If Expense: Option for Gasto Previsto */}
          {type === 'expense' && (
            <div
              id="planned-expense-toggle-card"
              role="button"
              tabIndex={0}
              onClick={() => setIsPending(!isPending)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setIsPending(!isPending);
                }
              }}
              className={`rounded-xl p-3 transition-all cursor-pointer border flex items-center justify-between gap-3 select-none ${
                isPending
                  ? 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-300 dark:border-amber-900/60 shadow-xs'
                  : 'bg-zinc-50/70 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                    isPending
                      ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-white dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-xs font-semibold ${
                        isPending ? 'text-amber-950 dark:text-amber-200' : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      Gasto Previsto (A pagar)
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isPending
                          ? 'bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200'
                          : 'bg-zinc-200/70 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      Desconta do saldo
                    </span>
                  </div>
                </div>
              </div>

              {/* Modern Switch Toggle */}
              <div
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                  isPending ? 'bg-amber-600' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    isPending ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                />
              </div>

              <input
                type="checkbox"
                id="input-is-pending"
                checked={isPending}
                onChange={(e) => setIsPending(e.target.checked)}
                className="sr-only"
                aria-label="Gasto Previsto (A pagar)"
              />
            </div>
          )}

          {/* Amount and Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label htmlFor="input-amount" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                Valor (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 text-sm font-medium">
                  R$
                </span>
                <input
                  id="input-amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value.replace(/[^0-9.,]/g, ''))}
                  className="w-full pl-9 pr-3 py-2 text-sm font-semibold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-400/10 focus:border-zinc-400 dark:focus:border-zinc-600"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="input-description" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                Descrição
              </label>
              <input
                id="input-description"
                type="text"
                placeholder={
                  isPending
                    ? 'Ex: Fatura Cartão, Aluguel, Internet...'
                    : type === 'expense'
                    ? 'Ex: Supermercado, Farmácia...'
                    : 'Ex: Salário, Freelance...'
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-400/10 focus:border-zinc-400 dark:focus:border-zinc-600"
                required
              />
            </div>
          </div>

          {/* Date and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label htmlFor="input-date" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                {isPending ? 'Data de Vencimento / Previsão' : 'Data'}
              </label>
              <input
                id="input-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-400/10 focus:border-zinc-400 dark:focus:border-zinc-600"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                Categoria
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {availableCategories.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      id={`btn-cat-${cat.id}`}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs'
                          : 'bg-zinc-100/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100'
                      }`}
                    >
                      <CategoryIcon icon={cat.icon} className="w-3 h-3" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {error && (
            <p id="form-error-message" className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 rounded-lg border border-rose-100 dark:border-rose-900/50">
              {error}
            </p>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              id="btn-submit-transaction"
              type="submit"
              className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isPending ? 'Salvar Gasto Previsto' : 'Salvar Transação'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
