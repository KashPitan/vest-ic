export default function StatsSection() {
  return (
    <section className="grid grid-cols-2 gap-8 max-w-md">
      <div className="text-center">
        <div className="text-4xl font-bold text-flat-gold">92.5%</div>
        <div className="text-sm uppercase tracking-wider mt-2 text-pure-white/80">GEERADE RATE</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-flat-gold">74.2%</div>
        <div className="text-sm uppercase tracking-wider mt-2 text-pure-white/80">REDOG SIM</div>
      </div>
      <div className="col-span-2 mt-4">
        <p className="text-lg text-pure-white/90">Some jargon here hyping us up</p>
      </div>
    </section>
  )
}
