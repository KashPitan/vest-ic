import Hero from "./hero";
import ProteinRevolution from "./protein-revolution";
import StatsSection from "./stats-section";
import RegisterSection from "./register-section";

export default function LeftColumn() {
  return (
    <div className="space-y-12 pb-60 flex flex-col items-center text-center">
      <Hero />
      <RegisterSection />

      <ProteinRevolution />
      <StatsSection />

      {/* Additional content to demonstrate scrolling */}
      <div className="space-y-6 pt-8 border-t border-pure-white/20 w-full">
        <h2 className="text-2xl font-semibold text-pure-white">
          Additional Information
        </h2>
        <div className="prose max-w-none text-pure-white/90">
          <p>
            The field of protein folding has seen remarkable advancements in
            recent years. With the help of AI, we&apos;re now able to predict
            protein structures with unprecedented accuracy, opening up new
            possibilities for drug discovery, materials science, and
            biotechnology.
          </p>
          <p>
            Our team at Vest IC is at the forefront of this revolution,
            combining cutting-edge AI techniques with deep biological expertise
            to solve some of the most challenging problems in protein
            engineering.
          </p>
          <p>
            By understanding how proteins fold and function, we can design new
            proteins with specific properties, potentially leading to
            breakthroughs in medicine, agriculture, and environmental
            remediation.
          </p>
        </div>
      </div>

      <div className="space-y-6 pt-8 border-t border-pure-white/20 w-full">
        <h2 className="text-2xl font-semibold text-pure-white">Our Approach</h2>
        <div className="prose max-w-none text-pure-white/90">
          <p>
            At Vest IC, we take a multidisciplinary approach to protein
            engineering, combining expertise in molecular biology, computational
            chemistry, and machine learning.
          </p>
          <p>
            Our proprietary AI platform enables us to explore the vast space of
            possible protein sequences and structures, identifying candidates
            with desired properties much faster than traditional methods.
          </p>
          <p>
            We validate our computational predictions through rigorous
            experimental testing, ensuring that our designed proteins function
            as intended in real-world applications.
          </p>
        </div>
      </div>

      <div className="space-y-6 pt-8 border-t border-pure-white/20 w-full">
        <h2 className="text-2xl font-semibold text-pure-white">Applications</h2>
        <div className="prose max-w-none text-pure-white/90">
          <p>
            The applications of our technology are vast and diverse, spanning
            multiple industries and addressing some of the world&apos;s most
            pressing challenges.
          </p>
          <p>
            In healthcare, our designed proteins could lead to new therapeutics
            for previously untreatable diseases, as well as improved diagnostics
            and vaccines.
          </p>
          <p>
            For environmental sustainability, we&apos;re developing proteins
            that can break down pollutants, capture carbon dioxide, and produce
            renewable energy more efficiently.
          </p>
          <p>
            In agriculture, our proteins could enhance crop yields, reduce the
            need for chemical pesticides, and improve food security for a
            growing global population.
          </p>
        </div>
      </div>
    </div>
  );
}
