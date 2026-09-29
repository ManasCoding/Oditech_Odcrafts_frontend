import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import {
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowDownToLine,
  Building,
  Edit3,
  ShieldCheck,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';
import { api } from '@/services/api';

export default function SellerEarningsPage() {
  const [wallet, setWallet] = useState<any>({
    availableBalance: 0,
    pendingBalance: 0,
    totalEarned: 0,
    totalPaidOut: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [bankDetails, setBankDetails] = useState<any>({
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIFSC: '',
    panNumber: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankFormData, setBankFormData] = useState({
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIFSC: '',
    panNumber: '',
  });
  const [isSavingBank, setIsSavingBank] = useState(false);

  const loadEarnings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/seller/earnings');
      const data = res.data?.data;
      if (data?.wallet) setWallet(data.wallet);
      if (data?.transactions) setTransactions(data.transactions);
      if (data?.bankDetails) {
        setBankDetails(data.bankDetails);
        setBankFormData(data.bankDetails);
      }
    } catch (err) {
      console.error('Failed to load earnings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);
    if (!amountNum || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amountNum > wallet.availableBalance) {
      toast.error(`Amount exceeds available balance of ₹${wallet.availableBalance.toLocaleString('en-IN')}`);
      return;
    }

    if (!bankDetails.bankAccountNumber || !bankDetails.bankIFSC) {
      toast.error('Please add your bank account details before requesting payout');
      setIsWithdrawModalOpen(false);
      setIsBankModalOpen(true);
      return;
    }

    try {
      setIsWithdrawing(true);
      const res = await api.post('/seller/withdraw', { amount: amountNum });
      toast.success(res.data?.message || 'Payout request submitted!');
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
      loadEarnings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingBank(true);
      await api.patch('/seller/bank-details', bankFormData);
      toast.success('Bank payout details saved!');
      setBankDetails(bankFormData);
      setIsBankModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update bank details');
    } finally {
      setIsSavingBank(false);
    }
  };

  const setPercentAmount = (percent: number) => {
    const val = Math.floor((wallet.availableBalance * percent) / 100);
    setWithdrawAmount(val.toString());
  };

  return (
    <>
      <Helmet>
        <title>Artisan Wallet & Earnings — ODCRAFTS</title>
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
              Artisan Wallet & Earnings
            </h1>
            <p className="text-xs text-warm-gray mt-1">
              Direct and transparent remuneration for your authentic Odia handcrafted creations.
            </p>
          </div>

          <button
            onClick={() => {
              if (wallet.availableBalance <= 0) {
                toast.info('You have ₹0 available for withdrawal right now.');
                return;
              }
              setIsWithdrawModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-accent-dark transition-all"
          >
            <ArrowDownToLine className="h-4 w-4" />
            <span>Request Payout</span>
          </button>
        </div>

        {/* Financial Stat Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white border border-warm-gray/15" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Available Balance */}
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Available for Payout
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-200/60 text-emerald-900">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-serif text-2xl font-bold text-emerald-950">
                  ₹{wallet.availableBalance?.toLocaleString('en-IN') || 0}
                </h3>
                <p className="text-[10px] text-emerald-700 mt-1 font-medium">
                  Ready for instant withdrawal to bank
                </p>
              </div>
            </div>

            {/* Pending Balance */}
            <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Pending Clearance
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-200/60 text-amber-900">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-serif text-2xl font-bold text-amber-950">
                  ₹{wallet.pendingBalance?.toLocaleString('en-IN') || 0}
                </h3>
                <p className="text-[10px] text-amber-700 mt-1 font-medium">
                  Orders in transit / doorstep collection
                </p>
              </div>
            </div>

            {/* Total Lifetime Earnings */}
            <div className="rounded-2xl bg-white border border-warm-gray/15 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-warm-gray uppercase tracking-wider">
                  Lifetime Earnings
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-serif text-2xl font-bold text-charcoal">
                  ₹{wallet.totalEarned?.toLocaleString('en-IN') || 0}
                </h3>
                <p className="text-[10px] text-warm-gray mt-1">
                  Net craft sales generated on ODCRAFTS
                </p>
              </div>
            </div>

            {/* Total Paid Out */}
            <div className="rounded-2xl bg-white border border-warm-gray/15 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-warm-gray uppercase tracking-wider">
                  Total Paid Out
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-charcoal/10 text-charcoal">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-serif text-2xl font-bold text-charcoal">
                  ₹{wallet.totalPaidOut?.toLocaleString('en-IN') || 0}
                </h3>
                <p className="text-[10px] text-warm-gray mt-1">
                  Transferred safely to your bank account
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bank Details & Fair Policy Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Linked Bank Account Card */}
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-warm-gray/15 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-warm-gray/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-charcoal">Linked Bank Payout Account</h3>
                  <p className="text-[10px] text-warm-gray">Direct NEFT / IMPS bank transfers for your sales</p>
                </div>
              </div>
              <button
                onClick={() => setIsBankModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-warm-gray/30 px-3 py-1.5 text-xs font-bold text-charcoal hover:bg-ivory transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{bankDetails.bankAccountNumber ? 'Update Account' : 'Link Account'}</span>
              </button>
            </div>

            {bankDetails.bankAccountNumber ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-ivory/60 border border-warm-gray/10">
                  <span className="text-[10px] text-warm-gray uppercase tracking-wider block font-semibold">
                    Bank Name
                  </span>
                  <span className="font-bold text-charcoal mt-1 block">
                    {bankDetails.bankName || 'State Bank of India'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-ivory/60 border border-warm-gray/10">
                  <span className="text-[10px] text-warm-gray uppercase tracking-wider block font-semibold">
                    Account Beneficiary
                  </span>
                  <span className="font-bold text-charcoal mt-1 block">
                    {bankDetails.bankAccountName || 'Artisan Partner'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-ivory/60 border border-warm-gray/10">
                  <span className="text-[10px] text-warm-gray uppercase tracking-wider block font-semibold">
                    Account Number
                  </span>
                  <span className="font-mono font-bold text-charcoal mt-1 block">
                    •••• •••• {bankDetails.bankAccountNumber.slice(-4)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-ivory/60 border border-warm-gray/10">
                  <span className="text-[10px] text-warm-gray uppercase tracking-wider block font-semibold">
                    IFSC Code
                  </span>
                  <span className="font-mono font-bold text-primary mt-1 block">
                    {bankDetails.bankIFSC || 'SBIN0001234'}
                  </span>
                </div>
                {bankDetails.panNumber && (
                  <div className="p-3.5 rounded-xl bg-ivory/60 border border-warm-gray/10">
                    <span className="text-[10px] text-warm-gray uppercase tracking-wider block font-semibold">
                      PAN Card Number
                    </span>
                    <span className="font-mono font-bold text-charcoal mt-1 block">
                      {bankDetails.panNumber}
                    </span>
                  </div>
                )}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
                  <span className="text-[11px] font-bold text-emerald-800">
                    Verified Payout Method
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-amber-50/80 border border-amber-200/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-700 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">No bank account linked yet</p>
                    <p className="text-[11px] text-amber-800">
                      Link your savings/current account to receive payouts when your crafts are delivered.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBankModalOpen(true)}
                  className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-xs font-bold whitespace-nowrap shadow-xs"
                >
                  Link Bank Account
                </button>
              </div>
            )}
          </div>

          {/* Transparent ODCRAFTS Fair Remuneration Card */}
          <div className="rounded-2xl bg-white p-6 border border-warm-gray/15 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-warm-gray/10 mb-4">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h3 className="font-serif text-sm font-bold text-charcoal">ODCRAFTS Fair Trade Model</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-charcoal/80">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>90% Direct Artisan Share:</strong> You receive 90% of the sale price directly for your craftwork.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span><strong>10% Platform Maintenance:</strong> Covers packaging subsidies, doorstep pick-up logistics, and digital curation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span><strong>Zero Hidden Charges:</strong> No listing fees, catalog fees, or payment processing deductions.</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-warm-gray/10">
              <span className="text-[10px] text-warm-gray">
                Settlements for Cash on Delivery (COD) orders clear automatically upon confirmed doorstep delivery.
              </span>
            </div>
          </div>
        </div>

        {/* Transaction / Order Earnings History */}
        <div className="rounded-2xl bg-white border border-warm-gray/15 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-warm-gray/10 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-charcoal">Craft Sales & Payout Activity</h3>
              <p className="text-[10px] text-warm-gray">Recent order earnings credited to your wallet</p>
            </div>
            <span className="text-xs font-semibold text-warm-gray">
              {transactions.length} transactions
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard className="h-10 w-10 text-warm-gray mx-auto mb-2" />
              <p className="text-xs font-semibold text-charcoal">No sales transactions recorded yet</p>
              <p className="text-[11px] text-warm-gray mt-1">
                When customers purchase your handcrafted items, net earnings will automatically credit here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-warm-gray/15 bg-ivory/50 text-warm-gray uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Gross Sale</th>
                    <th className="py-3 px-4">Platform Fee (10%)</th>
                    <th className="py-3 px-4">Your Net Earning</th>
                    <th className="py-3 px-4 text-right">Settlement Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-gray/10 text-charcoal">
                  {transactions.map((tx, idx) => {
                    const isDelivered = tx.status === 'DELIVERED';
                    const isCancelled = tx.status === 'CANCELLED';

                    return (
                      <tr key={idx} className="hover:bg-ivory/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-primary">
                          #{tx.orderNumber || tx.orderId?.slice(-6)?.toUpperCase()}
                        </td>
                        <td className="py-3.5 px-4 text-warm-gray">
                          {tx.date ? new Date(tx.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }) : '—'}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-charcoal">
                          ₹{tx.grossAmount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-warm-gray">
                          - ₹{tx.platformCommission?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-accent">
                          + ₹{tx.netEarnings?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isDelivered && (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Available in Wallet
                            </span>
                          )}
                          {isCancelled && (
                            <span className="rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                              Cancelled
                            </span>
                          )}
                          {!isDelivered && !isCancelled && (
                            <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              In Transit (Pending)
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-warm-gray/20">
            <div className="flex items-center justify-between pb-3 border-b border-warm-gray/15 mb-4">
              <h3 className="font-serif text-lg font-bold text-charcoal">Request Bank Payout</h3>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="rounded-lg p-1 text-warm-gray hover:text-charcoal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 p-3">
                <span className="text-[10px] text-emerald-800 font-semibold block">Available for Transfer</span>
                <span className="font-serif text-xl font-bold text-emerald-950">
                  ₹{wallet.availableBalance.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block text-charcoal font-semibold mb-1.5">
                  Enter Payout Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  max={wallet.availableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full rounded-xl border border-warm-gray/30 p-2.5 text-sm font-semibold focus:border-accent focus:outline-hidden"
                  required
                />

                {/* Percentage shortcuts */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setPercentAmount(25)}
                    className="rounded-lg border border-warm-gray/20 px-2 py-1 text-[10px] font-bold text-charcoal hover:bg-ivory"
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    onClick={() => setPercentAmount(50)}
                    className="rounded-lg border border-warm-gray/20 px-2 py-1 text-[10px] font-bold text-charcoal hover:bg-ivory"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => setPercentAmount(100)}
                    className="rounded-lg border border-accent/40 bg-accent/10 px-2 py-1 text-[10px] font-bold text-accent"
                  >
                    All (100%)
                  </button>
                </div>
              </div>

              {/* Destination Bank Account */}
              <div className="rounded-xl bg-ivory/80 border border-warm-gray/15 p-3 space-y-1">
                <span className="text-[10px] text-warm-gray font-semibold block">Transfer Destination</span>
                <p className="font-bold text-charcoal">
                  {bankDetails.bankName || 'Linked Bank Account'}
                </p>
                <p className="text-[11px] font-mono text-charcoal/80">
                  Account: •••• •••• {bankDetails.bankAccountNumber ? bankDetails.bankAccountNumber.slice(-4) : 'None'}
                </p>
                <p className="text-[10px] text-warm-gray">
                  IFSC: {bankDetails.bankIFSC || 'Not set'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-warm-gray/15">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="rounded-xl border border-warm-gray/30 px-3.5 py-2 text-xs font-bold text-charcoal hover:bg-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isWithdrawing || !withdrawAmount || Number(withdrawAmount) <= 0}
                  className="rounded-xl bg-accent hover:bg-accent-dark text-white px-4 py-2 text-xs font-bold shadow-xs inline-flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isWithdrawing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Bank Details Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-warm-gray/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-warm-gray/15 mb-4">
              <h3 className="font-serif text-lg font-bold text-charcoal">Update Bank Payout Account</h3>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="rounded-lg p-1 text-warm-gray hover:text-charcoal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBankDetails} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-charcoal font-semibold mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankFormData.bankName}
                  onChange={(e) => setBankFormData({ ...bankFormData, bankName: e.target.value })}
                  placeholder="e.g. State Bank of India, UCO Bank, Bank of India"
                  className="w-full rounded-xl border border-warm-gray/30 p-2.5 text-xs focus:border-primary focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-charcoal font-semibold mb-1">
                  Account Beneficiary Name (as in bank passbook)
                </label>
                <input
                  type="text"
                  value={bankFormData.bankAccountName}
                  onChange={(e) => setBankFormData({ ...bankFormData, bankAccountName: e.target.value })}
                  placeholder="e.g. Sanjukta Chitrakar"
                  className="w-full rounded-xl border border-warm-gray/30 p-2.5 text-xs focus:border-primary focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal font-semibold mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={bankFormData.bankAccountNumber}
                    onChange={(e) => setBankFormData({ ...bankFormData, bankAccountNumber: e.target.value })}
                    placeholder="e.g. 102938475612"
                    className="w-full rounded-xl border border-warm-gray/30 p-2.5 text-xs font-mono focus:border-primary focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-charcoal font-semibold mb-1">
                    Bank IFSC Code
                  </label>
                  <input
                    type="text"
                    value={bankFormData.bankIFSC}
                    onChange={(e) => setBankFormData({ ...bankFormData, bankIFSC: e.target.value.toUpperCase() })}
                    placeholder="e.g. SBIN0001234"
                    className="w-full rounded-xl border border-warm-gray/30 p-2.5 text-xs font-mono uppercase focus:border-primary focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-charcoal font-semibold mb-1">
                  PAN Number (Optional)
                </label>
                <input
                  type="text"
                  value={bankFormData.panNumber}
                  onChange={(e) => setBankFormData({ ...bankFormData, panNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. ABCDE1234F"
                  className="w-full rounded-xl border border-warm-gray/30 p-2.5 text-xs font-mono uppercase focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-warm-gray/15">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="rounded-xl border border-warm-gray/30 px-4 py-2 text-xs font-bold text-charcoal hover:bg-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingBank}
                  className="rounded-xl bg-primary hover:bg-primary-light text-white px-4 py-2 text-xs font-bold shadow-xs inline-flex items-center gap-1.5 transition-all"
                >
                  {isSavingBank && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Bank Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
