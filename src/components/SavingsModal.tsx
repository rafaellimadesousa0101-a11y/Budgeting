import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  PiggyBank,
  Car,
  Home,
  Plane,
  GraduationCap,
  HeartPulse,
  Laptop,
  ArrowLeft,
  Pencil,
  Archive,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { SavingBox, BoxDeadlineType } from '../types.ts';
import { formatCurrency, parseCurrencyInput, formatMonthYear } from '../utils/formatters.ts';

interface SavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingBalance: number;
  boxes: SavingBox[];
  onCreateBox: (
    box: Omit<SavingBox, 'id' | 'createdAt' | 'currentAmount'>,
    initialDeposit: number
  ) => void;
  onUpdateBox?: (
    boxId: string,
    updatedData: Partial<Omit<SavingBox, 'id' | 'createdAt' | 'currentAmount'>>
  ) => void;
  onFinalizeBox?: (boxId: string) => void;
  onDepositToBox: (boxId: string, amount: number) => void;
  onDeleteBox?: (boxId: string) => void;
}

const MONTH_OPTIONS = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR + i);

const AVAILABLE_ICONS = [
  { id: 'PiggyBank', label: 'Cofrinho' },
  { id: 'HeartPulse', label: 'Saúde' },
  { id: 'Plane', label: 'Viagem' },
  { id: 'Car', label: 'Carro' },
  { id: 'Home', label: 'Casa' },
  { id: 'Laptop', label: 'Tech' },
  { id: 'GraduationCap', label: 'Estudo' },
];

const QUICK_SUGGESTIONS = [
  { label: 'Reserva de Emergência', icon: 'HeartPulse' },
  { label: 'Viagem', icon: 'Plane' },
  { label: 'Carro / Moto', icon: 'Car' },
  { label: 'Casa própria', icon: 'Home' },
  { label: 'Eletrônicos', icon: 'Laptop' },
  { label: 'Estudos', icon: 'GraduationCap' },
];

function BoxIcon({ icon, className = 'w-4 h-4' }: { icon?: string; className?: string }) {
  switch (icon) {
    case 'Car':
      return <Car className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Plane':
      return <Plane className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    default:
      return <PiggyBank className={className} />;
  }
}

function detectIconFromText(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('viag') || lower.includes('férias') || lower.includes('praia') || lower.includes('voo')) return 'Plane';
  if (lower.includes('carro') || lower.includes('moto') || lower.includes('veículo') || lower.includes('cnh')) return 'Car';
  if (lower.includes('casa') || lower.includes('ap') || lower.includes('imóvel') || lower.includes('reforma')) return 'Home';
  if (lower.includes('faculd') || lower.includes('estud') || lower.includes('curso') || lower.includes('livro')) return 'GraduationCap';
  if (lower.includes('saúde') || lower.includes('emerg') || lower.includes('reserva') || lower.includes('médic')) return 'HeartPulse';
  if (lower.includes('noteb') || lower.includes('pc') || lower.includes('celular') || lower.includes('iphone') || lower.includes('comput')) return 'Laptop';
  return 'PiggyBank';
}

export const SavingsModal: React.FC<SavingsModalProps> = ({
  isOpen,
  onClose,
  remainingBalance,
  boxes,
  onCreateBox,
  onUpdateBox,
  onFinalizeBox,
  onDepositToBox,
  onDeleteBox,
}) => {
  const activeBoxes = useMemo(() => boxes.filter((b) => !b.isFinalized), [boxes]);
  const finalizedBoxes = useMemo(() => boxes.filter((b) => b.isFinalized), [boxes]);

  const [view, setView] = useState<'list' | 'new' | 'edit' | 'archived'>(
    activeBoxes.length === 0 && finalizedBoxes.length === 0 ? 'new' : 'list'
  );

  // Individual deposit state: stores the ID of the specific box currently receiving funds
  const [activeDepositBoxId, setActiveDepositBoxId] = useState<string | null>(null);
  const [depositAmountInput, setDepositAmountInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State for delete confirmation in list view: stores the box ID pending confirmation
  const [confirmDeleteBoxId, setConfirmDeleteBoxId] = useState<string | null>(null);

  // State for finalize confirmation in edit view: stores the box ID pending confirmation
  const [confirmFinalizeBoxId, setConfirmFinalizeBoxId] = useState<string | null>(null);

  // Form states for creating a new caixinha
  const currentYearStr = String(new Date().getFullYear());
  const currentMonthStr = String(new Date().getMonth() + 1).padStart(2, '0');
  const [boxName, setBoxName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('PiggyBank');
  const [targetAmountInput, setTargetAmountInput] = useState('');
  const [initialDepositInput, setInitialDepositInput] = useState('');
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadlineMonth, setDeadlineMonth] = useState<string>(currentMonthStr);
  const [deadlineYear, setDeadlineYear] = useState<string>(currentYearStr);

  // Form states for EDITING an existing caixinha
  const [editingBoxId, setEditingBoxId] = useState<string | null>(null);
  const [editBoxName, setEditBoxName] = useState('');
  const [editSelectedIcon, setEditSelectedIcon] = useState<string>('PiggyBank');
  const [editTargetAmountInput, setEditTargetAmountInput] = useState('');
  const [editHasDeadline, setEditHasDeadline] = useState(false);
  const [editDeadlineMonth, setEditDeadlineMonth] = useState<string>(currentMonthStr);
  const [editDeadlineYear, setEditDeadlineYear] = useState<string>(currentYearStr);

  const handleNameChange = (text: string) => {
    setBoxName(text);
    setSelectedIcon(detectIconFromText(text));
  };

  const handleSelectSuggestion = (s: { label: string; icon: string }) => {
    setBoxName(s.label);
    setSelectedIcon(s.icon);
  };

  // Click on box SVG icon to start editing
  const handleStartEditBox = (box: SavingBox) => {
    setEditingBoxId(box.id);
    setEditBoxName(box.name);
    setEditSelectedIcon(box.icon || 'PiggyBank');
    setEditTargetAmountInput(
      box.targetAmount && box.targetAmount > 0
        ? box.targetAmount.toFixed(2).replace('.', ',')
        : ''
    );

    if (box.targetDate) {
      const parts = box.targetDate.split('-');
      if (parts.length >= 2) {
        setEditHasDeadline(true);
        setEditDeadlineYear(parts[0]);
        setEditDeadlineMonth(parts[1]);
      } else {
        setEditHasDeadline(false);
        setEditDeadlineYear(currentYearStr);
        setEditDeadlineMonth(currentMonthStr);
      }
    } else {
      setEditHasDeadline(false);
      setEditDeadlineYear(currentYearStr);
      setEditDeadlineMonth(currentMonthStr);
    }

    setErrorMessage(null);
    setView('edit');
  };

  const handleSaveEditBox = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!editingBoxId) return;

    const trimmedName = editBoxName.trim();
    if (!trimmedName) {
      setErrorMessage('Informe o nome da caixinha.');
      return;
    }

    const targetAmount = parseCurrencyInput(editTargetAmountInput);

    let calculatedTargetDate: string | undefined = undefined;
    if (editHasDeadline) {
      const yearNum = parseInt(editDeadlineYear, 10) || CURRENT_YEAR;
      const currentMonth = new Date().getMonth() + 1;
      const monthNum = parseInt(editDeadlineMonth, 10) || currentMonth;

      if (yearNum < CURRENT_YEAR) {
        setErrorMessage(`O ano selecionado (${yearNum}) não pode ser menor do que o ano atual (${CURRENT_YEAR}).`);
        return;
      }

      if (yearNum === CURRENT_YEAR && monthNum < currentMonth) {
        setErrorMessage('O mês selecionado já passou no ano atual.');
        return;
      }

      const month = String(monthNum).padStart(2, '0');
      calculatedTargetDate = `${yearNum}-${month}`;
    }

    if (onUpdateBox) {
      onUpdateBox(editingBoxId, {
        name: trimmedName,
        category: trimmedName,
        icon: editSelectedIcon,
        targetAmount: targetAmount > 0 ? targetAmount : undefined,
        deadlineType: editHasDeadline ? 'date' : 'none',
        targetDate: calculatedTargetDate,
      });
    }

    setView('list');
    setEditingBoxId(null);
  };

  const handleCreateNewBox = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = boxName.trim();
    if (!trimmedName) {
      setErrorMessage('Informe o nome da caixinha.');
      return;
    }

    const depositAmount = parseCurrencyInput(initialDepositInput) || 0;
    if (depositAmount < 0) {
      setErrorMessage('O valor não pode ser negativo.');
      return;
    }

    if (depositAmount > remainingBalance) {
      setErrorMessage(`O valor (${formatCurrency(depositAmount)}) excede o saldo restante disponível (${formatCurrency(remainingBalance)}).`);
      return;
    }

    const targetAmount = parseCurrencyInput(targetAmountInput);

    let calculatedTargetDate = '';
    if (hasDeadline) {
      const yearNum = parseInt(deadlineYear, 10) || CURRENT_YEAR;
      const currentMonth = new Date().getMonth() + 1;
      const monthNum = parseInt(deadlineMonth, 10) || currentMonth;

      if (yearNum < CURRENT_YEAR) {
        setErrorMessage(`O ano selecionado (${yearNum}) não pode ser menor do que o ano atual (${CURRENT_YEAR}).`);
        return;
      }

      if (yearNum === CURRENT_YEAR && monthNum < currentMonth) {
        setErrorMessage('O mês selecionado já passou no ano atual.');
        return;
      }

      const month = String(monthNum).padStart(2, '0');
      calculatedTargetDate = `${yearNum}-${month}`;
    }

    onCreateBox(
      {
        name: trimmedName,
        category: trimmedName,
        icon: selectedIcon,
        targetAmount: targetAmount > 0 ? targetAmount : undefined,
        deadlineType: hasDeadline ? 'date' : 'none',
        targetDate: calculatedTargetDate || undefined,
      },
      depositAmount
    );

    setBoxName('');
    setSelectedIcon('PiggyBank');
    setTargetAmountInput('');
    setInitialDepositInput('');
    setHasDeadline(false);
    setDeadlineMonth(currentMonthStr);
    setDeadlineYear(currentYearStr);
    setView('list');
  };

  // Submit deposit directly and exclusively to the target individual box
  const handleInlineDeposit = (boxId: string, e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const amount = parseCurrencyInput(depositAmountInput);
    if (!amount || amount <= 0) {
      setErrorMessage('Informe um valor válido maior que zero.');
      return;
    }

    if (amount > remainingBalance) {
      setErrorMessage(
        `Valor (${formatCurrency(amount)}) excede o saldo restante disponível (${formatCurrency(remainingBalance)}).`
      );
      return;
    }

    onDepositToBox(boxId, amount);
    setDepositAmountInput('');
    setActiveDepositBoxId(null);
  };

  const totalSavedAcrossBoxes = useMemo(() => {
    return boxes.reduce((sum, b) => sum + (b.currentAmount || 0), 0);
  }, [boxes]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-savings-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="modal-savings-content"
        className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full shadow-xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col overflow-hidden text-zinc-900 dark:text-zinc-100 transition-colors my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimalist Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            {view !== 'list' && boxes.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setView('list');
                  setEditingBoxId(null);
                  setErrorMessage(null);
                }}
                className="p-1 -ml-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg transition-colors cursor-pointer"
                title="Voltar"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <PiggyBank className="w-4 h-4" />
              </div>
            )}
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {view === 'list' && 'Caixinhas & Metas'}
                {view === 'new' && 'Nova Caixinha'}
                {view === 'edit' && 'Editar Caixinha'}
                {view === 'archived' && 'Caixinhas Finalizadas'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {finalizedBoxes.length > 0 && view === 'list' && (
              <button
                type="button"
                id="btn-view-archived-boxes"
                onClick={() => setView('archived')}
                title={`Ver caixinhas finalizadas (${finalizedBoxes.length})`}
                aria-label="Ver caixinhas finalizadas"
                className="p-1.5 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Archive className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              id="btn-close-savings-modal"
              onClick={onClose}
              aria-label="Fechar"
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Minimalist Balance Bar */}
        <div className="px-5 py-2.5 bg-zinc-50/60 dark:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <span>Disponível:</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
              {formatCurrency(remainingBalance)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <span>Guardado:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              {formatCurrency(totalSavedAcrossBoxes)}
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 max-h-[72vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-xs text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">
              {errorMessage}
            </div>
          )}

          {/* VIEW: LIST CAIXINHAS */}
          {view === 'list' && (
            <div className="space-y-3">
              {activeBoxes.length === 0 ? (
                finalizedBoxes.length > 0 ? (
                  <div className="text-center py-8 px-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Todas as caixinhas foram finalizadas!
                    </h3>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs mx-auto">
                      Você pode criar um novo objetivo ou visualizar as caixinhas arquivadas.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setView('archived')}
                        className="px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Ver finalizadas ({finalizedBoxes.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setView('new')}
                        className="px-3.5 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Nova caixinha</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 px-2">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-2.5 text-zinc-400">
                      <PiggyBank className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Nenhuma caixinha criada
                    </h3>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs mx-auto">
                      Separe parte do seu saldo para objetivos específicos.
                    </p>
                    <button
                      type="button"
                      onClick={() => setView('new')}
                      className="mt-4 px-3.5 py-1.5 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Criar caixinha</span>
                    </button>
                  </div>
                )
              ) : (
                <>
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                        {activeBoxes.length} {activeBoxes.length === 1 ? 'caixinha ativa' : 'caixinhas ativas'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setView('new')}
                      className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Nova</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeBoxes.map((box) => {
                      const hasTarget = typeof box.targetAmount === 'number' && box.targetAmount > 0;
                      const progressPct = hasTarget
                        ? Math.min(100, Math.round((box.currentAmount / (box.targetAmount || 1)) * 100))
                        : null;
                      const isDepositing = activeDepositBoxId === box.id;

                      return (
                        <div
                          key={box.id}
                          className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col gap-3"
                        >
                          {/* Top Area: Icon, Title, Deadline & Balance */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              {/* SVG Icon Container - Estático (não clicável) */}
                              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0 shadow-2xs border border-zinc-200/60 dark:border-zinc-700/60">
                                <BoxIcon icon={box.icon} className="w-4.5 h-4.5" />
                              </div>

                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                  {box.name}
                                </h4>
                                {box.targetDate ? (
                                  <div className="inline-flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                                    <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
                                    <span>
                                      {box.targetDate.length === 7
                                        ? formatMonthYear(box.targetDate)
                                        : new Date(box.targetDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-zinc-400 mt-0.5 block">Livre (sem prazo)</span>
                                )}
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider block">
                                Acumulado
                              </span>
                              <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                                {formatCurrency(box.currentAmount)}
                              </div>
                            </div>
                          </div>

                          {/* Progress Section */}
                          {hasTarget ? (
                            <div className="bg-zinc-50/80 dark:bg-zinc-800/40 rounded-lg p-2.5 border border-zinc-100 dark:border-zinc-800/60 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                                  <span className="font-medium text-zinc-600 dark:text-zinc-300">Meta:</span>
                                  <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                                    {formatCurrency(box.targetAmount || 0)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                  <span>{progressPct}%</span>
                                  <span className="text-zinc-400 font-normal font-sans">concluído</span>
                                </div>
                              </div>

                              <div className="w-full h-1.5 bg-zinc-200/70 dark:bg-zinc-700/60 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="bg-zinc-50/50 dark:bg-zinc-800/20 rounded-lg px-2.5 py-1.5 border border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between text-[11px] text-zinc-400">
                              <span>Meta livre</span>
                              <span>Sem valor estipulado</span>
                            </div>
                          )}

                          {/* Actions / Deposit area */}
                          {isDepositing ? (
                            <form
                              onSubmit={(e) => handleInlineDeposit(box.id, e)}
                              className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2 animate-in fade-in duration-150"
                            >
                              <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                                Quanto deseja guardar em <span className="font-semibold text-emerald-600 dark:text-emerald-400">{box.name}</span>?
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-semibold">
                                    R$
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="decimal"
                                    autoFocus
                                    placeholder="0,00"
                                    value={depositAmountInput}
                                    onChange={(e) => {
                                      setDepositAmountInput(e.target.value.replace(/[^0-9.,]/g, ''));
                                      setErrorMessage(null);
                                    }}
                                    className="w-full pl-8 pr-2.5 py-1.5 text-xs font-semibold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  disabled={remainingBalance <= 0}
                                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Guardar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDepositBoxId(null);
                                    setDepositAmountInput('');
                                    setErrorMessage(null);
                                  }}
                                  className="px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </form>
                          ) : confirmDeleteBoxId === box.id ? (
                            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 w-full flex items-center justify-between bg-rose-50/80 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200/60 dark:border-rose-900/40 animate-in fade-in">
                              <span className="text-[11px] font-medium text-rose-700 dark:text-rose-300">
                                Excluir caixinha?
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteBoxId(null)}
                                  className="px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded transition-colors cursor-pointer"
                                >
                                  Voltar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onDeleteBox) onDeleteBox(box.id);
                                    setConfirmDeleteBoxId(null);
                                  }}
                                  className="px-2 py-0.5 text-[11px] font-medium text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors cursor-pointer"
                                >
                                  Sim, excluir
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditBox(box)}
                                  title="Editar objetivo e meta"
                                  className="text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Pencil className="w-3 h-3" />
                                  <span>Editar</span>
                                </button>

                                {onDeleteBox && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setConfirmDeleteBoxId(box.id);
                                      setActiveDepositBoxId(null);
                                    }}
                                    title="Excluir caixinha"
                                    className="text-[11px] font-medium text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Excluir</span>
                                  </button>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveDepositBoxId(box.id);
                                  setDepositAmountInput('');
                                  setErrorMessage(null);
                                }}
                                className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Guardar valor</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* VIEW: CREATE NEW CAIXINHA */}
          {view === 'new' && (
            <form onSubmit={handleCreateNewBox} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Nome do objetivo
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
                    <BoxIcon icon={selectedIcon} className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Ex: Viagem, Carro, Reserva..."
                    value={boxName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400"
                  />
                </div>

                {/* Suggestions text chips */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className={`px-2 py-0.5 text-[11px] rounded-md transition-colors cursor-pointer ${
                        boxName === s.label
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target amount */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Meta financeira <span className="text-zinc-400 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-semibold">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={targetAmountInput}
                    onChange={(e) => setTargetAmountInput(e.target.value.replace(/[^0-9.,]/g, ''))}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 font-mono"
                  />
                </div>
              </div>

              {/* Deadline Toggle (Compact) */}
              <div className="pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    Definir prazo (opcional)
                  </span>
                  <input
                    type="checkbox"
                    checked={hasDeadline}
                    onChange={(e) => setHasDeadline(e.target.checked)}
                    className="rounded border-zinc-300 text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                </div>

                {hasDeadline && (
                  <div className="mt-2 grid grid-cols-2 gap-2 animate-in fade-in">
                    <div>
                      <select
                        value={deadlineMonth}
                        onChange={(e) => setDeadlineMonth(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-100 outline-none cursor-pointer"
                      >
                        {MONTH_OPTIONS.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <select
                        value={deadlineYear}
                        onChange={(e) => setDeadlineYear(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-100 outline-none cursor-pointer"
                      >
                        {YEAR_OPTIONS.map((year) => (
                          <option key={year} value={String(year)}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Initial Deposit (Compact) */}
              <div className="pt-1">
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Guardar valor agora <span className="text-zinc-400 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-semibold">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={initialDepositInput}
                    onChange={(e) => setInitialDepositInput(e.target.value.replace(/[^0-9.,]/g, ''))}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 font-mono"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center gap-2 pt-3">
                {boxes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    className="flex-1 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Criar caixinha</span>
                </button>
              </div>
            </form>
          )}

          {/* VIEW: EDIT EXISTING CAIXINHA */}
          {view === 'edit' && (
            <form onSubmit={handleSaveEditBox} className="space-y-3.5">
              {/* Name and Icon */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Nome do objetivo
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <BoxIcon icon={editSelectedIcon} className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Ex: Viagem, Carro, Reserva..."
                    value={editBoxName}
                    onChange={(e) => {
                      setEditBoxName(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="flex-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400"
                  />
                </div>

                {/* Choose Icon Pills */}
                <div className="mt-2.5">
                  <span className="block text-[11px] text-zinc-400 mb-1">Alterar ícone:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_ICONS.map((ic) => (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setEditSelectedIcon(ic.id)}
                        className={`px-2 py-1 text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                          editSelectedIcon === ic.id
                            ? 'bg-emerald-600 text-white font-medium shadow-xs'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        <BoxIcon icon={ic.id} className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{ic.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target amount */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Meta financeira <span className="text-zinc-400 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-semibold">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={editTargetAmountInput}
                    onChange={(e) => setEditTargetAmountInput(e.target.value.replace(/[^0-9.,]/g, ''))}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 font-mono"
                  />
                </div>
              </div>

              {/* Deadline Toggle */}
              <div className="pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    Definir prazo (opcional)
                  </span>
                  <input
                    type="checkbox"
                    checked={editHasDeadline}
                    onChange={(e) => setEditHasDeadline(e.target.checked)}
                    className="rounded border-zinc-300 text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                </div>

                {editHasDeadline && (
                  <div className="mt-2 grid grid-cols-2 gap-2 animate-in fade-in">
                    <div>
                      <select
                        value={editDeadlineMonth}
                        onChange={(e) => setEditDeadlineMonth(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-100 outline-none cursor-pointer"
                      >
                        {MONTH_OPTIONS.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <select
                        value={editDeadlineYear}
                        onChange={(e) => setEditDeadlineYear(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-100 outline-none cursor-pointer"
                      >
                        {YEAR_OPTIONS.map((year) => (
                          <option key={year} value={String(year)}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setView('list');
                    setEditingBoxId(null);
                    setErrorMessage(null);
                    setConfirmDeleteBoxId(null);
                  }}
                  className="flex-1 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar alterações</span>
                </button>
              </div>

              {/* Finalizar caixinha in edit view (replaces delete option) */}
              {onFinalizeBox && editingBoxId && (
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  {confirmFinalizeBoxId === editingBoxId ? (
                    <div className="flex items-center justify-between bg-emerald-50/80 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200/60 dark:border-emerald-900/40 animate-in fade-in">
                      <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                        Finalizar esta caixinha?
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmFinalizeBoxId(null)}
                          className="px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Não
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onFinalizeBox(editingBoxId);
                            setConfirmFinalizeBoxId(null);
                            setEditingBoxId(null);
                            setView('list');
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Sim
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmFinalizeBoxId(editingBoxId)}
                      className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Finalizar caixinha</span>
                    </button>
                  )}
                </div>
              )}
            </form>
          )}

          {/* VIEW: ARCHIVED / FINALIZED CAIXINHAS */}
          {view === 'archived' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  {finalizedBoxes.length} {finalizedBoxes.length === 1 ? 'caixinha finalizada' : 'caixinhas finalizadas'}
                </span>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/40">
                  Arquivadas
                </span>
              </div>

              {finalizedBoxes.length === 0 ? (
                <div className="text-center py-8 text-zinc-400 text-xs">
                  Nenhuma caixinha finalizada ainda.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-200/70 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
                  {finalizedBoxes.map((box) => (
                    <div
                      key={box.id}
                      className="p-3.5 bg-zinc-50/30 dark:bg-zinc-800/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <BoxIcon icon={box.icon} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                                {box.name}
                              </h4>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40 px-1.5 py-0.2 rounded-md shrink-0">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>Finalizado</span>
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                              {box.finalizedAt
                                ? `Finalizada em ${new Date(box.finalizedAt).toLocaleDateString('pt-BR')}`
                                : 'Finalizada com sucesso'}
                              {box.targetAmount ? ` · Meta inicial: ${formatCurrency(box.targetAmount)}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(box.currentAmount || 0)}
                          </span>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                            valor arrecadado
                          </p>
                        </div>
                      </div>

                      {/* Visual completed progress bar */}
                      <div className="mt-2.5 pt-2 border-t border-zinc-100/80 dark:border-zinc-800/80">
                        <div className="w-full h-1.5 bg-emerald-100 dark:bg-emerald-950/50 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full w-full" />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                          <span>Status: Concluída</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Finalizado</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
