import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowDown, FiArrowRight, FiCheck, FiDownload, FiDroplet, FiLink, FiList, FiSliders, FiZap } from 'react-icons/fi'
import { ImageSequence } from '@chunsky/react-sequ'
import '@chunsky/react-sequ/styles.css'
import { ParallaxLayer, ParallaxScene } from 'react-skyllax'

const features = [
  { icon: FiZap, title: 'Rancang dengan mudah', description: 'Susun pertanyaan lewat editor drag-and-drop yang intuitif.' },
  { icon: FiLink, title: 'Bagikan dalam sekejap', description: 'Kirim satu tautan agar siapa pun bisa mengisi formulirmu.' },
  { icon: FiCheck, title: 'Jawaban tersusun rapi', description: 'Pantau respons dan kelola hasilnya dari satu dashboard.' }
]

const advantages = [
  { icon: FiList, title: '20 jenis pertanyaan dan elemen', description: 'Dari teks dan pilihan ganda hingga rating, skala, dan unggah file.' },
  { icon: FiDroplet, title: 'Tampilan sesuai gayamu', description: 'Atur warna, latar, logo, foto, dan dekorasi formulir.' },
  { icon: FiSliders, title: 'Kontrol respons lebih leluasa', description: 'Atur batas respons, pengumpulan email, login, dan urutan pertanyaan.' },
  { icon: FiDownload, title: 'Jawaban siap diolah', description: 'Cari respons yang dibutuhkan lalu ekspor hasilnya ke Excel.' }
]

export function LandingPage() {
  const previewSectionRef = useRef(null)
  const [previewProgress, setPreviewProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const section = previewSectionRef.current
      if (!section) return
      const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight)
      setPreviewProgress(Math.max(0, Math.min(1, -section.getBoundingClientRect().top / scrollDistance)))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    updateProgress()
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <main className="overflow-x-clip bg-neo-bg text-neo-black">
      <ParallaxScene height="max(100vh, 940px)" className="bg-neo-bg">
        <ParallaxLayer speed={0.12} zIndex={0} className="pointer-events-none">
          <div className="absolute left-[8%] top-28 h-20 w-20 rounded-full border-2 border-neo-black bg-neo-yellow/70" />
          <div className="absolute right-[12%] top-36 h-14 w-14 rotate-12 border-2 border-neo-black bg-neo-pink/60" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.24} zIndex={1} className="pointer-events-none">
          <div className="absolute bottom-24 left-[18%] h-12 w-12 rotate-45 border-2 border-neo-black bg-neo-blue/60" />
          <div className="absolute bottom-32 right-[20%] h-8 w-8 rounded-full border-2 border-neo-black bg-neo-green" />
        </ParallaxLayer>

        <div className="relative z-10 mx-auto flex h-full min-h-[620px] max-w-7xl flex-col px-5 sm:px-8">
          <header className="flex h-20 items-center justify-between">
            <Link to="/" className="inline-flex -rotate-1 items-center border-2 border-neo-black bg-neo-yellow px-3 py-1 text-xl font-black shadow-neo-sm">
              NEOFORM
            </Link>
            <nav aria-label="Navigasi utama" className="flex items-center gap-3">
              <Link to="/login" className="px-3 py-2 font-bold underline decoration-2 underline-offset-4">Masuk</Link>
              <Link to="/register" className="btn-primary px-4 py-2 text-sm">Mulai gratis</Link>
            </nav>
          </header>

          <section className="grid flex-1 items-center gap-10 py-10 md:grid-cols-2 md:gap-8 md:py-0">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-3xl">
              <h1 className="max-w-xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
                Bikin formulir yang <span className="bg-neo-yellow px-2 text-[0.82em]">siap dibagikan.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg font-bold leading-relaxed text-gray-700">
                Buat formulir, bagikan tautannya, lalu kumpulkan semua jawaban di satu tempat. Semuanya tanpa ribet.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                  Buat formulir gratis <FiArrowRight />
                </Link>
                <Link to="/login" className="font-bold underline decoration-2 underline-offset-4">Saya sudah punya akun</Link>
              </div>
              <p className="mt-5 text-sm font-bold text-gray-600">Gratis untuk mulai. Siap dibagikan dalam hitungan menit.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.94, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="relative mx-auto w-full max-w-[280px] md:max-w-lg">
              <div className="absolute -right-3 -top-3 h-full w-full -rotate-3 border-2 border-neo-black bg-neo-yellow" />
              <div className="relative border-2 border-neo-black bg-white p-3 shadow-neo-lg sm:p-5">
                <div className="mb-4 flex items-center justify-between border-b-2 border-neo-black pb-3">
                  <span className="text-xs font-black uppercase tracking-wide">Ringkasan respons</span>
                  <span className="inline-flex items-center gap-1 border-2 border-neo-black bg-neo-green px-2 py-0.5 text-[10px] font-black"><FiCheck aria-hidden="true" /> AKTIF</span>
                </div>
                <div className="border-2 border-neo-black bg-neo-bg p-3 sm:p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-600">Survei pelanggan</p>
                  <h2 className="mt-1 text-lg font-black leading-tight sm:text-2xl">Apa pendapatmu tentang layanan kami?</h2>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="border-2 border-neo-black bg-white p-2 sm:p-3">
                      <p className="text-[10px] font-bold text-gray-600 sm:text-xs">Jawaban masuk</p>
                      <p className="mt-1 text-2xl font-black sm:text-3xl">128</p>
                    </div>
                    <div className="border-2 border-neo-black bg-neo-yellow p-2 sm:p-3">
                      <p className="text-[10px] font-bold text-gray-600 sm:text-xs">Kepuasan pelanggan</p>
                      <p className="mt-1 text-2xl font-black sm:text-3xl">94%</p>
                    </div>
                  </div>
                  <div className="mt-2 border-2 border-neo-black bg-white p-3">
                    <div className="flex items-center justify-between gap-2 text-xs font-black sm:text-sm">
                      <span>Respons minggu ini</span><span>+24%</span>
                    </div>
                    <div className="mt-2 flex h-12 items-end gap-1.5" aria-label="Grafik respons meningkat">
                      {[35, 52, 42, 68, 57, 82, 100].map((height, index) => (
                        <div key={index} className={`flex-1 border-2 border-neo-black ${index === 6 ? 'bg-neo-pink' : 'bg-neo-blue/40'}`} style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} className="absolute -left-5 top-16 border-2 border-neo-black bg-neo-pink px-3 py-2 text-sm font-black shadow-neo-sm">
                Jawaban baru
              </motion.div>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }} className="absolute -bottom-4 -right-3 flex items-center gap-2 border-2 border-neo-black bg-neo-green px-3 py-2 text-sm font-black shadow-neo-sm">
                <FiZap aria-hidden="true" /> Terus bertambah
              </motion.div>
            </motion.div>
          </section>

          <a href="#live-preview" className="mx-auto mb-5 inline-flex items-center gap-2 text-sm font-bold" aria-label="Lihat fitur Neoform">
            Lihat cara kerjanya <FiArrowDown />
          </a>
        </div>
      </ParallaxScene>

      <section ref={previewSectionRef} id="live-preview" className="relative h-[300vh] border-y-2 border-neo-black bg-neo-bg" aria-label="Live preview">
        <div className="sticky top-0 flex h-screen items-center justify-center px-5 py-6 sm:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="relative mx-auto w-full max-w-[110vh]">
            <div className="absolute -right-3 -top-3 h-full w-full rotate-3 border-2 border-neo-black bg-neo-pink" />
            <div className="relative border-2 border-neo-black bg-white p-3 shadow-neo-lg sm:p-5">
              <div className="mb-3 flex items-center justify-between border-b-2 border-neo-black pb-3">
                <span className="text-sm font-black uppercase tracking-wide">Live preview</span>
                <span className="border-2 border-neo-black bg-neo-green px-2 py-0.5 text-xs font-black">FORM #01</span>
              </div>
              <div className="aspect-[7/5] overflow-hidden bg-neo-bg">
                <ImageSequence src="/landing-sequence" prefix="frame-" extension="svg" start={1} end={4} padding={3} progress={previewProgress} fit="contain" alt="Pratinjau formulir yang berubah saat halaman digulir" />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm font-bold">
                <span>Mulai dari ide, selesai dengan jawaban.</span>
                <FiArrowRight aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="fitur" className="relative z-10 border-y-2 border-neo-black bg-white px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-2 font-black uppercase tracking-wider text-neo-blue">Dari awal sampai selesai</p>
            <h2 className="text-3xl font-black sm:text-4xl">Semua yang kamu butuhkan untuk mengumpulkan jawaban.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className={`border-2 border-neo-black p-6 shadow-neo ${['bg-neo-yellow', 'bg-neo-blue/20', 'bg-neo-green/30'][index]}`}>
                <Icon size={24} aria-hidden="true" />
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-2 font-bold leading-relaxed text-gray-700">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-16 border-t-2 border-neo-black pt-12">
            <div className="mb-8 max-w-2xl">
              <p className="mb-2 font-black uppercase tracking-wider text-neo-blue">Lebih dari sekadar formulir</p>
              <h2 className="text-3xl font-black sm:text-4xl">Fleksibel dari pertanyaan sampai hasil.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {advantages.map(({ icon: Icon, title, description }) => (
                <article key={title} className="border-2 border-neo-black bg-neo-bg p-5 shadow-neo-sm">
                  <Icon size={22} aria-hidden="true" />
                  <h3 className="mt-4 font-black">{title}</h3>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-gray-700">{description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-14 flex flex-col items-start justify-between gap-5 border-2 border-neo-black bg-neo-bg p-6 shadow-neo md:flex-row md:items-center md:p-8">
            <div>
              <h2 className="text-2xl font-black">Siap membuat formulir pertamamu?</h2>
              <p className="mt-1 font-bold text-gray-700">Mulai gratis dan bagikan saat sudah siap.</p>
            </div>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2">
              Mulai sekarang <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm font-bold sm:px-8">
        <span>NEOFORM · Dibuat oleh Chunsky X ANTISUKI</span>
        <Link to="/login" className="underline underline-offset-4">Masuk ke akun</Link>
      </footer>
    </main>
  )
}
