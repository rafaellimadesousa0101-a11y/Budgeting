/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, SavingBox } from './types.ts';
import { getCurrentMonthString, formatMonthYear, formatCurrency, getTodayString } from './utils/formatters.ts';
import { Header } from './components/Header.tsx';
import { BalanceSummary } from './components/BalanceSummary.tsx';
import { TransactionForm } from './components/TransactionForm.tsx';
import { TransactionList } from './components/TransactionList.tsx';

const TX_STORAGE_KEY = 'min_finance_transactions_v2';
const INITIAL_BALANCE_KEY = 'min_finance_initial_balance_v2';
const BOXES_STORAGE_KEY = 'min_finance_saving_boxes_v1';

export default function App() {
  // Saldo Inicial definido pelo usuário (inicia em 0)
  const [initialBalance, setInitialBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(INITIAL_BALANCE_KEY);
      if (saved !== null) {
        const val = parseFloat(saved);
        if (!isNaN(val)) return val;
      }
    } catch (e) {
      console.error('Error loading initial balance', e);
    }
    return 0;
  });

  // Lista de transações (inicia 100% zerada)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      localStorage.removeItem('min_finance_transactions_v1');
      const saved = localStorage.getItem(TX_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading transactions from localStorage', e);
    }
    return [];
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return getCurrentMonthString();
  });

  // Caixinhas para guardar dinheiro
  const [savingBoxes, setSavingBoxes] = useState<SavingBox[]>(() => {
    try {
      const saved = localStorage.getItem(BOXES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saving boxes from localStorage', e);
    }
    return [];
  });

  // Dark/Light theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('min_finance_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  });

  // Synchronize 'dark' class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('min_finance_theme', theme);
    } catch (e) {
      console.error('Error saving theme', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [toast, setToast] = useState<string | null>(null);

  // Sync transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions to localStorage', e);
    }
  }, [transactions]);

  // Sync initial balance to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(INITIAL_BALANCE_KEY, initialBalance.toString());
    } catch (e) {
      console.error('Error saving initial balance to localStorage', e);
    }
  }, [initialBalance]);

  // Sync saving boxes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOXES_STORAGE_KEY, JSON.stringify(savingBoxes));
    } catch (e) {
      console.error('Error saving saving boxes to localStorage', e);
    }
  }, [savingBoxes]);

  // Show temporary toast message
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Derive unique list of months present in transactions
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    set.add(getCurrentMonthString());
    if (selectedMonth && selectedMonth !== 'all') {
      set.add(selectedMonth);
    }
    transactions.forEach((t) => {
      if (t.date && t.date.length >= 7) {
        set.add(t.date.slice(0, 7));
      }
    });
    return Array.from(set).sort().reverse();
  }, [transactions, selectedMonth]);

  // Transactions filtered for current selected month
  const monthTransactions = useMemo(() => {
    const list =
      selectedMonth === 'all'
        ? [...transactions]
        : transactions.filter((t) => t.date && t.date.startsWith(selectedMonth));

    return list.sort((a, b) => {
      const dateDiff = b.date.localeCompare(a.date);
      if (dateDiff !== 0) return dateDiff;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [transactions, selectedMonth]);

  // Carried-over balance from prior months when a specific month is selected
  const effectiveInitialBalance = useMemo(() => {
    if (selectedMonth === 'all') return initialBalance;
    const startOfMonth = `${selectedMonth}-01`;
    const priorNet = transactions
      .filter((t) => t.date && t.date < startOfMonth)
      .reduce((sum, t) => {
        if (t.type === 'income') return sum + t.amount;
        return sum - t.amount;
      }, 0);
    return initialBalance + priorNet;
  }, [transactions, selectedMonth, initialBalance]);

  // Summary figures
  const totalIncome = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const paidExpense = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === 'expense' && t.status !== 'pending')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const plannedExpense = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === 'expense' && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const tx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: Date.now(),
    };

    setTransactions((prev) => [tx, ...prev]);

    // If added transaction is in a different month, switch to it
    const txMonth = tx.date.slice(0, 7);
    if (selectedMonth !== 'all' && selectedMonth !== txMonth) {
      setSelectedMonth(txMonth);
    }

    if (tx.status === 'pending') {
      showToast('Gasto previsto registrado e descontado do saldo!');
    } else {
      showToast('Movimentação adicionada com sucesso!');
    }
  };

  const handleMarkAsPaid = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'paid' as const } : t))
    );
    showToast('Conta marcada como paga!');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Movimentação removida.');
  };

  const handleUpdateInitialBalance = (val: number) => {
    const priorNet = effectiveInitialBalance - initialBalance;
    setInitialBalance(val - priorNet);
    showToast('Renda atualizada!');
  };

  const handleClearMonth = () => {
    if (selectedMonth === 'all') {
      setTransactions([]);
      setInitialBalance(0);
      setSavingBoxes([]);
      localStorage.removeItem(TX_STORAGE_KEY);
      localStorage.removeItem(INITIAL_BALANCE_KEY);
      localStorage.removeItem(BOXES_STORAGE_KEY);
      showToast('Histórico e dados zerados!');
    } else {
      setTransactions((prev) =>
        prev.filter((t) => !t.date || !t.date.startsWith(selectedMonth))
      );
      const startOfMonth = `${selectedMonth}-01`;
      const priorNet = transactions
        .filter((t) => t.date && t.date < startOfMonth)
        .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
      setInitialBalance(0 - priorNet);
      showToast('Histórico deste mês e renda zerados!');
    }
  };

  // Caixinhas (Guardar Dinheiro) handlers
  const handleCreateBox = (
    boxData: Omit<SavingBox, 'id' | 'createdAt' | 'currentAmount'>,
    initialDeposit: number
  ) => {
    const newBoxId = `box-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newBox: SavingBox = {
      ...boxData,
      id: newBoxId,
      currentAmount: initialDeposit > 0 ? initialDeposit : 0,
      createdAt: Date.now(),
    };

    setSavingBoxes((prev) => [newBox, ...prev]);

    if (initialDeposit > 0) {
      const todayIso = getTodayString();
      const tx: Transaction = {
        id: `tx-box-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        description: `Guardado: ${boxData.name}`,
        amount: initialDeposit,
        type: 'expense',
        category: 'investimentos',
        date: todayIso,
        status: 'paid',
        tag: 'Guardado',
        isSavedBox: true,
        boxId: newBoxId,
        createdAt: Date.now(),
      };
      setTransactions((prev) => [tx, ...prev]);

      const txMonth = tx.date.slice(0, 7);
      if (selectedMonth !== 'all' && selectedMonth !== txMonth) {
        setSelectedMonth(txMonth);
      }
      showToast(`Caixinha "${boxData.name}" criada e ${formatCurrency(initialDeposit)} guardado!`);
    } else {
      showToast(`Caixinha "${boxData.name}" criada com sucesso!`);
    }
  };

  const handleDepositToBox = (boxId: string, amount: number) => {
    const targetBox = savingBoxes.find((b) => b.id === boxId);
    if (!targetBox) return;

    setSavingBoxes((prev) =>
      prev.map((b) => (b.id === boxId ? { ...b, currentAmount: (b.currentAmount || 0) + amount } : b))
    );

    const todayIso = getTodayString();
    const tx: Transaction = {
      id: `tx-box-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      description: `Guardado: ${targetBox.name}`,
      amount: amount,
      type: 'expense',
      category: 'investimentos',
      date: todayIso,
      status: 'paid',
      tag: 'Guardado',
      isSavedBox: true,
      boxId: boxId,
      createdAt: Date.now(),
    };
    setTransactions((prev) => [tx, ...prev]);

    const txMonth = tx.date.slice(0, 7);
    if (selectedMonth !== 'all' && selectedMonth !== txMonth) {
      setSelectedMonth(txMonth);
    }
    showToast(`${formatCurrency(amount)} guardado com sucesso na caixinha "${targetBox.name}"!`);
  };

  const handleUpdateBox = (
    boxId: string,
    updatedData: Partial<Omit<SavingBox, 'id' | 'createdAt' | 'currentAmount'>>
  ) => {
    setSavingBoxes((prev) =>
      prev.map((b) => (b.id === boxId ? { ...b, ...updatedData } : b))
    );
    if (updatedData.name) {
      const newName = updatedData.name;
      setTransactions((prev) =>
        prev.map((t) =>
          t.boxId === boxId ? { ...t, description: `Guardado: ${newName}` } : t
        )
      );
    }
    showToast('Caixinha atualizada com sucesso!');
  };

  const handleFinalizeBox = (boxId: string) => {
    const targetBox = savingBoxes.find((b) => b.id === boxId);
    if (!targetBox || targetBox.isFinalized) return;

    setSavingBoxes((prev) =>
      prev.map((b) =>
        b.id === boxId
          ? {
              ...b,
              isFinalized: true,
              finalizedAt: Date.now(),
            }
          : b
      )
    );

    showToast(`Caixinha "${targetBox.name}" finalizada e arquivada com sucesso!`);
  };

  const handleDeleteBox = (boxId: string) => {
    const targetBox = savingBoxes.find((b) => b.id === boxId);
    if (!targetBox || targetBox.isFinalized) return;

    const boxName = targetBox.name;
    const boxAmount = targetBox.currentAmount || 0;

    // 1. Remove a caixinha do estado de caixinhas salvas
    setSavingBoxes((prev) => prev.filter((b) => b.id !== boxId));

    // 2. Remove automaticamente do histórico de movimentações todas as transações vinculadas a esta caixinha
    let removedTotal = 0;
    setTransactions((prev) => {
      const remaining: Transaction[] = [];
      for (const tx of prev) {
        const isBoxIdMatch = tx.boxId === boxId;
        const isNameMatch =
          Boolean(tx.isSavedBox) &&
          (tx.description.toLowerCase() === `guardado: ${boxName.toLowerCase()}` ||
            tx.description.toLowerCase().includes(boxName.toLowerCase()));

        if (isBoxIdMatch || isNameMatch) {
          removedTotal += tx.amount;
        } else {
          remaining.push(tx);
        }
      }
      return remaining;
    });

    // 3. Caso o total de transações encontradas seja menor que o saldo acumulado na caixinha
    // (por exemplo, se o usuário limpou histórico do mês ou aportou antes),
    // devolve a diferença diretamente à renda para garantir que o saldo restante receba 100% do dinheiro de volta
    if (boxAmount > removedTotal) {
      const diff = boxAmount - removedTotal;
      setInitialBalance((prev) => prev + diff);
    }

    showToast(
      boxAmount > 0
        ? `Caixinha "${boxName}" excluída! ${formatCurrency(boxAmount)} retornou ao saldo restante.`
        : `Caixinha "${boxName}" excluída!`
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-16 pt-6 sm:pt-10 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Header
          transactions={transactions}
          monthTransactionsCount={monthTransactions.length}
          initialBalance={initialBalance}
          selectedMonth={selectedMonth}
          onClearMonth={handleClearMonth}
          effectiveInitialBalance={effectiveInitialBalance}
          totalIncome={totalIncome}
          paidExpense={paidExpense}
          plannedExpense={plannedExpense}
          theme={theme}
          onToggleTheme={toggleTheme}
          boxes={savingBoxes}
          onCreateBox={handleCreateBox}
          onUpdateBox={handleUpdateBox}
          onFinalizeBox={handleFinalizeBox}
          onDepositToBox={handleDepositToBox}
          onDeleteBox={handleDeleteBox}
        />

        {/* Balance & Period Card - Gastos previstos já são descontados do Saldo Atual */}
        <BalanceSummary
          initialBalance={effectiveInitialBalance}
          onUpdateInitialBalance={handleUpdateInitialBalance}
          totalIncome={totalIncome}
          paidExpense={paidExpense}
          plannedExpense={plannedExpense}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          availableMonths={availableMonths}
        />

        {/* Quick Add Form (Supports normal transactions and Gastos Previstos) */}
        <TransactionForm onAddTransaction={handleAddTransaction} />

        {/* Transaction History & Filters */}
        <TransactionList
          transactions={monthTransactions}
          savingBoxes={savingBoxes}
          onDeleteTransaction={handleDeleteTransaction}
          onMarkAsPaid={handleMarkAsPaid}
        />


        {/* Feedback Toast */}
        {toast && (
          <div
            id="toast-notification"
            role="status"
            className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-white text-xs font-medium py-2.5 px-4 rounded-xl shadow-lg border border-zinc-800 animate-fade-in flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{toast}</span>
          </div>
        )}
      </div>
    </div>
  );
}
