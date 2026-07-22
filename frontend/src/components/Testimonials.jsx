import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'HOD, Computer Science',
    avatar: 'PS',
    gradient: 'from-blue-500 to-purple-500',
    rating: 5,
    text: 'SmartQR has completely transformed how we manage attendance. The dynamic QR system is foolproof and saves us hours every week.',
  },
  {
    name: 'Rahul Verma',
    role: 'Student, 3rd Year CSE',
    avatar: 'RV',
    gradient: 'from-green-500 to-teal-500',
    rating: 5,
    text: 'Marking attendance is now just a 5-second scan. No more proxy issues and I can always check my attendance percentage instantly.',
  },
  {
    name: 'Prof. Anita Nair',
    role: 'Faculty, Electronics Dept.',
    avatar: 'AN',
    gradient: 'from-orange-500 to-pink-500',
    rating: 5,
    text: 'The reports feature is excellent. I can export attendance data for any subject in seconds. Highly recommended for all colleges.',
  },
  {
    name: 'Karthik Menon',
    role: 'Student, 2nd Year IT',
    avatar: 'KM',
    gradient: 'from-purple-500 to-indigo-500',
    rating: 5,
    text: 'The QR scanning is super fast and the dashboard shows everything I need. Best attendance system our college has ever used.',
  },
  {
    name: 'Mr. Suresh Kumar',
    role: 'Admin, SRIT College',
    avatar: 'SK',
    gradient: 'from-cyan-500 to-blue-500',
    rating: 5,
    text: 'Managing 500+ students across 8 departments is now effortless. The admin dashboard gives complete visibility and control.',
  },
  {
    name: 'Dr. Meena Pillai',
    role: 'Principal, GEC',
    avatar: 'MP',
    gradient: 'from-rose-500 to-orange-500',
    rating: 5,
    text: 'We saw a 40% improvement in attendance accuracy after switching to SmartQR. The system is reliable, fast, and easy to use.',
  },
];

const TestimonialCard = ({ testimonial, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -4 }}
    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
  >
    <Quote className="w-8 h-8 text-blue-400/40 mb-4" />
    <p className="text-slate-300 text-sm leading-relaxed mb-6">"{testimonial.text}"</p>
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
        {testimonial.avatar}
      </div>
      <div className="flex-1">
        <div className="text-white font-semibold text-sm">{testimonial.name}</div>
        <div className="text-slate-400 text-xs">{testimonial.role}</div>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
    </div>
  </motion.div>
);

const Testimonials = () => (
  <section className="py-24 bg-gradient-to-b from-blue-950 to-slate-900">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
          What People{' '}
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Say
          </span>
        </h2>
        <p className="text-slate-400 text-lg">Loved by students, faculty, and administrators alike.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <TestimonialCard key={t.name} testimonial={t} delay={i * 0.08} />
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
