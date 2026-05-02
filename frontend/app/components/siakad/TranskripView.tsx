import { Printer } from "lucide-react";

export function TranskripView({ user }: { user: any }) {
  // Dummy Data for Transcript
  const transcriptData = [
    { semester: "Semester 1", courses: [
      { code: "UNI101", name: "Pendidikan Agama", sks: 2, grade: "A", weight: 4.0 },
      { code: "UNI102", name: "Pancasila", sks: 2, grade: "A-", weight: 3.75 },
      { code: "INF101", name: "Dasar Pemrograman", sks: 4, grade: "A", weight: 4.0 },
      { code: "INF102", name: "Matematika Diskrit", sks: 3, grade: "B+", weight: 3.5 },
      { code: "INF103", name: "Pengantar Teknologi Informasi", sks: 2, grade: "A", weight: 4.0 },
    ]},
    { semester: "Semester 2", courses: [
      { code: "UNI201", name: "Bahasa Inggris", sks: 2, grade: "A", weight: 4.0 },
      { code: "INF201", name: "Struktur Data", sks: 4, grade: "B", weight: 3.0 },
      { code: "INF202", name: "Basis Data", sks: 3, grade: "A-", weight: 3.75 },
      { code: "INF203", name: "Arsitektur Komputer", sks: 3, grade: "B+", weight: 3.5 },
      { code: "MAT201", name: "Kalkulus II", sks: 3, grade: "C+", weight: 2.5 },
    ]},
    { semester: "Semester 3", courses: [
      { code: "INF301", name: "Pemrograman Berorientasi Objek", sks: 4, grade: "A", weight: 4.0 },
      { code: "INF302", name: "Sistem Operasi", sks: 3, grade: "A", weight: 4.0 },
      { code: "INF303", name: "Jaringan Komputer", sks: 3, grade: "B", weight: 3.0 },
      { code: "INF304", name: "Analisis Algoritma", sks: 3, grade: "A-", weight: 3.75 },
    ]}
  ];

  const totalSks = 44;
  const totalPoint = 158.5;
  const ipk = (totalPoint / totalSks).toFixed(2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            Transkrip Nilai <span className="text-zinc-500 font-normal text-lg">Akademik</span>
          </h1>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            <span>&rsaquo;</span>
            <span className="text-zinc-400">Laporan Nilai</span>
            <span>&rsaquo;</span>
            <span className="text-zinc-400">Transkrip / IPK</span>
          </div>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#1ea39e] hover:bg-[#188f88] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#1ea39e]/20"
        >
          <Printer size={16} />
          CETAK TRANSKRIP
        </button>
      </div>

      {/* Transcript Document Card */}
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none print:m-0 print:p-0">
        
        {/* Document Header (Visible in print) */}
        <div className="p-8 border-b border-white/5 print:border-black/10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1ea39e] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#1ea39e]/20 print:shadow-none">
                U
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tighter text-zinc-100 print:text-black uppercase">Universitas Internasional</h2>
                <p className="text-zinc-500 text-xs font-bold print:text-gray-600">Semen Indonesia (UISI)</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-black text-[#1ea39e] uppercase tracking-widest mb-1">Transkrip Nilai Sementara</h3>
              <p className="text-zinc-500 text-[10px] font-bold print:text-gray-600 uppercase tracking-tighter">Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Nama Mahasiswa", value: user?.name || "ADITYA PUTRA PRATAMA" },
              { label: "NIM", value: "3012410047" },
              { label: "Program Studi", value: "Informatika" },
              { label: "Fakultas", value: "Teknologi Informasi" },
            ].map((info, i) => (
              <div key={i} className="space-y-1">
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest print:text-gray-500">{info.label}</span>
                <p className="text-sm font-bold text-zinc-200 print:text-black">{info.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transcript Table */}
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 print:bg-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5 print:text-black print:border-gray-300">No</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5 print:text-black print:border-gray-300">Kode MK</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5 print:text-black print:border-gray-300">Mata Kuliah</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5 print:text-black print:border-gray-300">SKS</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5 print:text-black print:border-gray-300">Nilai</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5 print:text-black print:border-gray-300">Bobot</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5 print:text-black print:border-gray-300">Kredit</th>
              </tr>
            </thead>
            <tbody>
              {transcriptData.map((sem, sIdx) => (
                <React.Fragment key={sIdx}>
                  <tr className="bg-zinc-800/20 print:bg-gray-50">
                    <td colSpan={7} className="px-6 py-2 text-[10px] font-black text-[#1ea39e] uppercase tracking-[0.2em] border-y border-white/5 print:text-black print:border-gray-200">
                      {sem.semester}
                    </td>
                  </tr>
                  {sem.courses.map((course, cIdx) => (
                    <tr key={cIdx} className="group hover:bg-white/0.02 transition-colors print:hover:bg-transparent border-b border-white/5 print:border-gray-100">
                      <td className="px-6 py-3 text-xs text-zinc-500 font-medium print:text-black">
                        {sIdx * 5 + cIdx + 1}
                      </td>
                      <td className="px-6 py-3 text-xs text-zinc-400 font-bold print:text-black">
                        {course.code}
                      </td>
                      <td className="px-6 py-3 text-xs text-zinc-200 font-bold uppercase print:text-black">
                        {course.name}
                      </td>
                      <td className="px-6 py-3 text-xs text-center text-zinc-300 font-bold print:text-black">
                        {course.sks}
                      </td>
                      <td className="px-6 py-3 text-xs text-center font-black print:text-black">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          course.grade.startsWith('A') ? 'text-emerald-500' : 
                          course.grade.startsWith('B') ? 'text-blue-400' : 'text-amber-500'
                        } print:text-black`}>
                          {course.grade}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-xs text-center text-zinc-400 font-medium print:text-black">
                        {course.weight.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-xs text-center text-zinc-200 font-black print:text-black">
                        {(course.sks * course.weight).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="p-8 bg-zinc-900/40 border-t border-white/10 print:bg-white print:border-black/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
              {[
                { label: "Total SKS Diambil", value: totalSks },
                { label: "Total SKS Diakui", value: totalSks },
                { label: "Total Poin Kredit", value: totalPoint.toFixed(2) },
                { label: "IPK Kumulatif", value: ipk, highlight: true },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest print:text-gray-500">{stat.label}</span>
                  <p className={`text-xl font-black ${stat.highlight ? 'text-[#1ea39e]' : 'text-zinc-100'} print:text-black`}>{stat.value}</p>
                </div>
              ))}
            </div>
            
            {/* Signature Placeholder (Print only) */}
            <div className="hidden print:block text-center min-w-[200px]">
              <p className="text-[10px] font-bold text-gray-600 mb-16 uppercase">Kepala BAAK,</p>
              <p className="text-sm font-black text-black uppercase underline decoration-2">DIREKTUR AKADEMIK</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase">NIDN: 0720108301</p>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; background: white !important; }
          .print-content, .print-content * { visibility: visible; }
          .no-print { display: none !important; }
          .print-content { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            margin: 0;
            padding: 0;
          }
        }
      `}} />
    </div>
  );
}

import React from "react";
