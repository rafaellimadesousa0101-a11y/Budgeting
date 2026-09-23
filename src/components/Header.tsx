import React, { useState } from 'react';
import {
  Download,
  Trash2,
  AlertTriangle,
  Calendar,
  PieChart as PieChartIcon,
  Sun,
  Moon,
  Calculator as CalculatorIcon,
  PiggyBank,
} from 'lucide-react';
import { Transaction, SavingBox } from '../types.ts';
import { getCategoryById } from '../data/categories.ts';
import { formatMonthYear } from '../utils/formatters.ts';
import { MonthCalendarModal } from './MonthCalendarModal.tsx';
import { FinancialChartsModal } from './FinancialChartsModal.tsx';
import { FloatingCalculator } from './FloatingCalculator.tsx';
import { SavingsModal } from './SavingsModal.tsx';
import { BudgetingLogo } from './BudgetingLogo.tsx';

interface HeaderProps {
  transactions: Transaction[];
  monthTransactionsCount: number;
  initialBalance: number;
  selectedMonth: string;
  onClearMonth: () => void;
  effectiveInitialBalance: number;
  totalIncome: number;
  paidExpense: number;
  plannedExpense: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  boxes: SavingBox[];
  onCreateBox: (box: Omit<SavingBox, 'id' | 'createdAt' | 'currentAmount'>, initialDeposit: number) => void;
  onUpdateBox?: (boxId: string, updatedData: Partial<Omit<SavingBox, 'id' | 'createdAt' | 'currentAmount'>>) => void;
  onFinalizeBox?: (boxId: string) => void;
  onDepositToBox: (boxId: string, amount: number) => void;
  onDeleteBox: (boxId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  transactions,
  monthTransactionsCount,
  initialBalance,
  selectedMonth,
  onClearMonth,
  effectiveInitialBalance,
  totalIncome,
  paidExpense,
  plannedExpense,
  theme,
  onToggleTheme,
  boxes,
  onCreateBox,
  onUpdateBox,
  onFinalizeBox,
  onDepositToBox,
  onDeleteBox,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSavings, setShowSavings] = useState(false);

  // Saldo Restante da interface principal
  const remainingBalance = effectiveInitialBalance + totalIncome - (paidExpense + plannedExpense);

  const exportToCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Data', 'Tipo', 'Situação', 'Categoria', 'Descrição', 'Valor (R$)'];
    const rows = transactions.map((t) => [
      t.date,
      t.type === 'income' ? 'Entradas' : 'Despesa',
      t.status === 'pending' ? 'Previsto (A pagar)' : 'Efetivado / Pago',
      `"${getCategoryById(t.category).label}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount.toFixed(2).replace('.', ','),
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `controle_financeiro_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasData = transactions.length > 0 || initialBalance !== 0;
  const isAllMonths = selectedMonth === 'all';
  const monthLabel = isAllMonths ? 'todos os períodos' : formatMonthYear(selectedMonth);

  return (
    <>
      <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="mb-2 sm:mb-0">
          <div className="flex items-center">
            <h1 className="sr-only">Budgeting</h1>
            <BudgetingLogo />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {transactions.length > 0 && (
            <button
              id="btn-export-csv"
              type="button"
              onClick={exportToCSV}
              title="Exportar dados para planilha CSV"
              className="text-xs font-medium px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          )}

          {/* Financial Charts Button (Gráficos: Pizza e Barras) */}
          <button
            id="btn-open-charts"
            type="button"
            onClick={() => setShowCharts(true)}
            title="Gráficos financeiros (Pizza e Barras)"
            aria-label="Abrir gráficos financeiros"
            className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
          >
            <PieChartIcon className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
          </button>

          {/* Calendar Button */}
          <button
            id="btn-open-calendar"
            type="button"
            onClick={() => setShowCalendar(true)}
            title="Calendário do mês"
            aria-label="Abrir calendário do mês"
            className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>

          {/* Theme Toggle Button (Claro / Escuro - Próximo à lixeira) */}
          <button
            id="btn-toggle-theme"
            type="button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-zinc-600" />
            )}
          </button>

          {/* Floating Calculator Button (Próximo à lixeira e abaixo do título) */}
          <button
            id="btn-open-calculator"
            type="button"
            onClick={() => setShowCalculator((prev) => !prev)}
            title={showCalculator ? 'Ocultar calculadora flutuante' : 'Abrir calculadora flutuante (PiP)'}
            aria-label="Abrir calculadora flutuante"
            className={`p-1.5 border rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-2xs ${
              showCalculator
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <CalculatorIcon className="w-3.5 h-3.5" />
          </button>

          {/* Botão Guardar Dinheiro / Caixinhas (Próximo à lixeira e logo abaixo do título) */}
          <button
            id="btn-open-savings"
            type="button"
            onClick={() => setShowSavings(true)}
            title="Guardar Dinheiro (Caixinhas & Metas)"
            aria-label="Abrir tela de guardar dinheiro em caixinhas"
            className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
          >
            <PiggyBank className="w-3.5 h-3.5" />
          </button>

          {hasData && (
            <button
              id="btn-clear-all"
              type="button"
              onClick={() => setShowConfirm(true)}
              title="Apagar histórico deste mês"
              aria-label="Apagar histórico financeiro"
              className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/40 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Floating Picture-in-Picture Calculator (Sem bloqueio de fundo e 100% interativo) */}
      <FloatingCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />

      {/* Interface de Guardar Dinheiro & Caixinhas (Nubank style) */}
      <SavingsModal
        isOpen={showSavings}
        onClose={() => setShowSavings(false)}
        remainingBalance={remainingBalance}
        boxes={boxes}
        onCreateBox={onCreateBox}
        onUpdateBox={onUpdateBox}
        onFinalizeBox={onFinalizeBox}
        onDepositToBox={onDepositToBox}
        onDeleteBox={onDeleteBox}
      />

      {/* Month Calendar Modal */}
      <MonthCalendarModal
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        selectedMonth={selectedMonth}
        transactions={transactions}
      />

      {/* Financial Charts Modal (Pizza & Barras) */}
      <FinancialChartsModal
        isOpen={showCharts}
        onClose={() => setShowCharts(false)}
        selectedMonth={selectedMonth}
        initialBalance={effectiveInitialBalance}
        totalIncome={totalIncome}
        paidExpense={paidExpense}
        plannedExpense={plannedExpense}
      />

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          id="modal-confirm-clear"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl max-w-xs w-full p-5 shadow-xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-4 text-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Apagar Histórico
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Você está prestes a apagar todo o seu histórico financeiro deste mês.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full pt-1">
              <button
                id="btn-confirm-clear-back"
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/80 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                id="btn-confirm-clear-yes"
                type="button"
                onClick={() => {
                  onClearMonth();
                  setShowConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
