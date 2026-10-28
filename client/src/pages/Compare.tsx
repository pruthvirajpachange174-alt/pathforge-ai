/** Renders the Compare application page. */
import { GlassCard } from '@/components/common/GlassCard';
import { motion } from 'framer-motion';

const rows = [
  { topic: 'Practical Learning', india: 'Often theory-heavy in early years; project labs improving via NEP 2020.', global: 'Strong emphasis on labs, capstones, and hands-on projects from year 1 (e.g., MIT, Stanford, TU Munich).', suggestion: 'Introduce mandatory practical labs from Sem 1 & real-world capstones by Sem 4.' },
  { topic: 'Research Culture', india: 'Concentrated at IITs/IISc; expanding via PMRF & undergrad research grants.', global: 'Undergrad research is common at US/Singapore/German universities.', suggestion: 'Fund and normalize undergrad research at all tier-2/3 colleges.' },
  { topic: 'Robotics Exposure', india: 'Growing via Robocon, e-Yantra, community clubs.', global: 'Robotics-in-curriculum from school in Japan, S. Korea, US.', suggestion: 'Add mandatory robotics + IoT modules from 2nd year in all ECE/CSE branches.' },
  { topic: 'Open Source', india: 'Rapidly growing thanks to GSoC, MLH, LFX; still under-utilized.', global: 'Deeply embedded in US/EU CS curricula.', suggestion: 'Give course credit for merged PRs in reputable OSS projects.' },
  { topic: 'Startup Ecosystem', india: 'Third largest globally — Bangalore, Hyderabad, Pune leading.', global: 'Silicon Valley, Tel Aviv, Berlin, Singapore have decades-old maturity.', suggestion: 'College-embedded incubators + 1-credit "founder track" electives.' },
  { topic: 'AI Adoption in Curriculum', india: 'AICTE model curriculum added AI/ML electives; adoption uneven.', global: 'AI/ML foundational courses standard at top universities.', suggestion: 'Make AI foundations a core CS/IT subject in 2nd year across all universities.' },
];

export default function Compare() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">India vs Global <span className="gradient-text">Tech Education</span></h1>
        <p className="text-neutral-400 mt-1 max-w-3xl">A balanced, evidence-based comparison — with concrete improvements. Every education system has strengths and gaps.</p>
      </div>
      <div className="space-y-4">
        {rows.map((r, i) => (
          <motion.div key={r.topic} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard>
              <h3 className="font-display font-semibold text-lg mb-3 gradient-text">{r.topic}</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div><p className="text-xs uppercase text-brand-400 mb-1">🇮🇳 India</p><p className="text-neutral-300">{r.india}</p></div>
                <div><p className="text-xs uppercase text-cyanx-400 mb-1">🌍 Global</p><p className="text-neutral-300">{r.global}</p></div>
                <div><p className="text-xs uppercase text-emerald-400 mb-1">💡 Improvement</p><p className="text-neutral-300">{r.suggestion}</p></div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}