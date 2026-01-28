import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Heart, Terminal, ArrowUp, BookOpen } from 'lucide-react';

const socialLinks = [
  { icon: Github, href: 'https://github.com/chandrakodali', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/chandrakoushikkodali', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:chandrakoushik.kodali@gmail.com', label: 'Email' },
];

const quickLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const resourceLinks = [
  { name: 'Articles', href: '#blog', icon: BookOpen },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <motion.a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollToTop(); }}
              className="flex items-center gap-3 mb-4 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-violet-500/25 transition-shadow">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">CK</h3>
                <p className="text-xs text-gray-500">Platform Engineer</p>
              </div>
            </motion.a>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Building scalable cloud infrastructure and developer platforms that empower teams to ship faster.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/[0.12] transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <link.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status & Back to top */}
          <div>
            <h4 className="text-white font-semibold mb-4">Status</h4>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6">
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-emerald-400 text-sm font-medium">Open to work</span>
              </div>
              <p className="text-gray-500 text-xs">Available for new opportunities</p>
            </div>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-white hover:border-white/[0.12] transition-all text-sm"
            >
              <ArrowUp className="w-4 h-4" />
              Back to top
            </motion.button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm text-center sm:text-left">
            © {currentYear} Chandra Koushik Kodali. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-1.5">
            Crafted with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </motion.span>
            using React & Motion
          </p>
        </div>
      </div>
    </footer>
  );
}

