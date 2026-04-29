import { useState } from "react";
import { useOutletContext } from "react-router";

interface OutletContext {
  user: { email: string; role: string; name: string } | null;
  roleLabel: string;
}

interface Bill {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: "Belum Bayar" | "Lunas" | "Menunggu Verifikasi";
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  method: string;
}

const mockBills: Bill[] = [
  { id: "1", type: "UKT Semester Genap 2023/2024", amount: 7500000, dueDate: "2024-05-30", status: "Belum Bayar" },
  { id: "2", type: "Biaya Investasi Pendidikan (BIP) - Cicilan 4", amount: 2000000, dueDate: "2024-06-15", status: "Belum Bayar" },
  { id: "3", type: "Asuransi Mahasiswa", amount: 150000, dueDate: "2024-05-15", status: "Lunas" },
];

const mockTransactions: Transaction[] = [
  { id: "TRX-001", type: "UKT Semester Ganjil 2023", amount: 7500000, date: "2023-08-12", method: "Virtual Account BNI" },
  { id: "TRX-002", type: "BIP Cicilan 3", amount: 2000000, date: "2023-11-20", method: "Virtual Account Mandiri" },
];

export default function UISIPayUI() {
  const { user } = useOutletContext<OutletContext>();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalUnpaid = mockBills
    .filter((b) => b.status === "Belum Bayar")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-zinc-100 mb-1">
            UISI <span className="text-amber-400 font-normal">Pay</span>
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Layanan Pembayaran Akademik</p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Tagihan Aktif</p>
            <p className="text-lg font-bold text-zinc-100 leading-none">{formatCurrency(totalUnpaid)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bills */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/>
            </svg>
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Daftar Tagihan</h2>
          </div>

          <div className="space-y-3">
            {mockBills.map((bill) => (
              <div 
                key={bill.id}
                className={`cursor-pointer relative overflow-hidden group rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/10 ${
                  selectedBill?.id === bill.id ? "ring-2 ring-amber-500/50 border-amber-500/30" : ""
                }`}
                onClick={() => bill.status === "Belum Bayar" && setSelectedBill(bill)}
              >
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      bill.status === "Lunas" ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"
                    }`}>
                      {bill.status === "Lunas" ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-100">{bill.type}</p>
                      <p className="text-xs text-zinc-500">Jatuh tempo: {new Date(bill.dueDate).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-zinc-100">{formatCurrency(bill.amount)}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mt-1 inline-block ${
                      bill.status === "Lunas" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {bill.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detail */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Ringkasan Bayar</h2>
          </div>

          <div className="rounded-2xl bg-zinc-900 border border-white/10 p-6 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
            
            {selectedBill ? (
              <>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Metode Tersedia</p>
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    {["BNI Virtual Account", "Mandiri Virtual Account", "Gopay / QRIS"].map((method) => (
                      <button 
                        key={method}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 hover:bg-white/10 transition-colors"
                      >
                        {method}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 18 6-6-6-6"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-zinc-500">Tagihan</span>
                    <span className="text-xs text-zinc-300">{formatCurrency(selectedBill.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">Biaya Admin</span>
                    <span className="text-xs text-emerald-400 font-bold uppercase">Gratis</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-2 border-t border-white/5">
                    <span className="text-sm font-bold text-zinc-400 uppercase">Total</span>
                    <span className="text-lg font-bold text-amber-500">{formatCurrency(selectedBill.amount)}</span>
                  </div>
                </div>

                <button className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98]">
                  Bayar Sekarang
                </button>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-700">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
                  </svg>
                </div>
                <p className="text-sm text-zinc-600">Pilih salah satu tagihan <br />untuk melihat metode pembayaran</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase px-1">Riwayat Pembayaran</h2>
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Transaksi</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Metode</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tanggal</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-zinc-200">{trx.type}</td>
                  <td className="px-6 py-4 text-xs text-zinc-500">{trx.method}</td>
                  <td className="px-6 py-4 text-xs text-zinc-500">{trx.date}</td>
                  <td className="px-6 py-4 text-xs font-bold text-zinc-100 text-right">{formatCurrency(trx.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
