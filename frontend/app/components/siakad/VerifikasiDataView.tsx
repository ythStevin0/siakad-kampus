export function VerifikasiDataView({ user }: { user: any }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          Verifikasi Data PDDIKTI Mahasiswa <span className="text-zinc-500 font-normal text-lg">Manage</span>
        </h1>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <span>&rsaquo;</span>
          <span className="text-zinc-400">Verifikasi Data PDDIKTI Mahasiswa</span>
        </div>
      </div>

      {/* Warning Alert */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 flex gap-4">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500 shrink-0 h-fit">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-black text-amber-200 uppercase tracking-wider">Verifikasi Data Mahasiswa</h4>
          <p className="text-[11px] text-amber-100/70 leading-relaxed">
            Silahkan diperiksa kembali data anda, apabila terdapat ketidaksesuaian data yang ditampilkan silahkan mengajukan perubahan data melalui tombol <span className="font-bold text-amber-400">Ajukan Perubahan Data</span>. Dan apabila semua data yang ditampilkan sudah sesuai, silakan menekan tombol <span className="font-bold text-amber-400">Konfirmasi Kesesuaian Data</span>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        DATA DIRI MAHASISWA
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Data SIAKAD */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-zinc-900/40 border border-white/10 overflow-hidden backdrop-blur-md shadow-xl">
            <div className="bg-blue-600/20 px-4 py-2 border-b border-white/5 text-[10px] font-black text-blue-400 uppercase tracking-widest">Data SIAKAD</div>
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-40 h-52 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl relative group">
                <img src="https://ui-avatars.com/api/?name=Stevino+Adi+Nugroho&background=18181b&color=fff&size=512" alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white leading-tight">Stevino Adi Nugroho</h2>
                <p className="text-zinc-400 font-mono text-sm mt-1">3012410047</p>
                <p className="text-zinc-500 text-xs font-bold uppercase mt-1">Informatika</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-black uppercase border border-red-500/30">Not Verified</span>
              
              <div className="w-full pt-4 space-y-3">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Status Upload Dokumen</p>
                {[
                  { label: "KTP", status: "Not Yet", color: "text-red-400 bg-red-400/10" },
                  { label: "Kartu Keluarga", status: "Not Yet", color: "text-red-400 bg-red-400/10" },
                  { label: "KTM", status: "Not Yet", color: "text-red-400 bg-red-400/10" }
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-bold">{doc.label} :</span>
                    <span className={`px-2 py-0.5 rounded-md font-black text-[9px] uppercase ${doc.color}`}>{doc.status}</span>
                  </div>
                ))}
              </div>

              <div className="w-full pt-6 space-y-2">
                <button className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase transition-all shadow-lg shadow-blue-900/20">Unggah Data Terbaru</button>
                <button className="w-full py-2.5 rounded-xl bg-[#1ea39e] hover:bg-[#198a87] text-white text-[10px] font-black uppercase transition-all shadow-lg shadow-teal-900/20">Ajukan Perubahan Data</button>
                <button className="w-full py-2.5 rounded-xl bg-amber-600/40 border border-amber-600/30 hover:bg-amber-600/60 text-amber-200 text-[10px] font-black uppercase transition-all">Konfirmasi Kesesuaian Data</button>
              </div>
            </div>
          </div>

          {/* Riwayat Table */}
          <div className="rounded-2xl bg-zinc-900/40 border border-white/10 overflow-hidden backdrop-blur-md shadow-xl">
            <div className="bg-zinc-800/40 px-4 py-2 border-b border-white/5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Riwayat Pengajuan Perubahan</div>
            <div className="p-4">
               <table className="w-full text-left text-[10px]">
                 <thead>
                   <tr className="text-zinc-500 font-bold uppercase border-b border-white/5">
                     <th className="py-2">No</th>
                     <th className="py-2">Catatan Perubahan</th>
                     <th className="py-2">Status</th>
                     <th className="py-2">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr><td colSpan={4} className="py-8 text-center text-zinc-600 italic">Belum ada pengajuan perubahan data</td></tr>
                 </tbody>
               </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Data PDDIKTI */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl bg-zinc-900/40 border border-white/10 overflow-hidden backdrop-blur-md shadow-xl h-full">
            <div className="bg-red-900/20 px-4 py-2 border-b border-white/5 text-[10px] font-black text-red-400 uppercase tracking-widest">Data PDDIKTI</div>
            
            <div className="p-8 space-y-10">
              {/* Section: Data Mahasiswa */}
              <div className="space-y-6">
                <h3 className="text-[#1ea39e] font-black text-lg border-b border-white/5 pb-2">Data Mahasiswa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
                  {[
                    { label: "Nama Mahasiswa", value: "ADITYA PUTRA PRATAMA", important: true },
                    { label: "Jenis Tinggal", value: "Kost" },
                    { label: "Jenis Kelamin", value: "Laki-laki", important: true },
                    { label: "Jenis Transportasi", value: "Sepeda Motor" },
                    { label: "Tempat, tanggal lahir", value: "SIDOARJO, 12 Januari 2005", important: true },
                    { label: "Wilayah", value: "Kec. Waru" },
                    { label: "Agama", value: "Islam" },
                    { label: "Kelurahan", value: "Kureksari" },
                    { label: "NIK", value: "3515081201050004", important: true },
                    { label: "Dusun", value: "Krajan" },
                    { label: "NISN", value: "0058921443" },
                    { label: "Jalan, RT/RW", value: "Jl. Melati No. 45, RT 05/RW 01" },
                    { label: "Kewarganegaraan", value: "Indonesia" },
                    { label: "Kodepos", value: "61256" },
                  ].map((field, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">{field.label}</span>
                        {field.important && <span className="px-1.5 py-0.5 rounded bg-amber-500 text-[8px] text-black font-black uppercase">Penting!</span>}
                      </div>
                      <p className="text-zinc-200 font-bold">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Data Orang Tua */}
              <div className="space-y-6">
                <h3 className="text-emerald-500 font-black text-lg border-b border-white/5 pb-2">Data Orang Tua</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Father */}
                  <div className="space-y-5">
                    {[
                      { label: "Nama Ayah", value: "Bambang Hermanto" },
                      { label: "Tanggal Lahir Ayah", value: "15 Agustus 1978" },
                      { label: "NIK Ayah", value: "3515081508780001" },
                      { label: "Pendidikan Ayah", value: "S1" },
                      { label: "Pekerjaan Ayah", value: "Karyawan Swasta" },
                      { label: "Penghasilan Ayah", value: "Rp. 5,000,000 - Rp. 9,999,999" },
                    ].map((field, i) => (
                      <div key={i} className="space-y-1">
                        <span className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest">{field.label}</span>
                        <p className="text-zinc-200 text-xs font-bold leading-tight">{field.value}</p>
                      </div>
                    ))}
                  </div>
                  {/* Mother */}
                  <div className="space-y-5">
                    {[
                      { label: "Nama Ibu", value: "Siti Aminah" },
                      { label: "Tanggal Lahir Ibu", value: "05 Mei 1982" },
                      { label: "NIK Ibu", value: "3515084505820003" },
                      { label: "Pendidikan Ibu", value: "SMA / sederajat" },
                      { label: "Pekerjaan Ibu", value: "Ibu Rumah Tangga" },
                      { label: "Penghasilan Ibu", value: "-" },
                    ].map((field, i) => (
                      <div key={i} className="space-y-1">
                        <span className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest">{field.label}</span>
                        <p className="text-zinc-200 text-xs font-bold leading-tight">{field.value}</p>
                      </div>
                    ))}
                  </div>
                  {/* Wali */}
                  <div className="space-y-5">
                    {[
                      { label: "Nama Wali", value: "-" },
                      { label: "Tanggal Lahir Wali", value: "-" },
                      { label: "NIK Wali", value: "-" },
                      { label: "Pendidikan Wali", value: "-" },
                      { label: "Pekerjaan Wali", value: "-" },
                      { label: "Penghasilan Wali", value: "-" },
                    ].map((field, i) => (
                      <div key={i} className="space-y-1">
                        <span className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest">{field.label}</span>
                        <p className="text-zinc-200 text-xs font-bold leading-tight">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
