import { motion } from 'motion/react';
import { Terminal, Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';

const socialLinks = [
  { href: 'https://github.com/chandrakodali', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/chandrakoushikkodali', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:chandrakoushik.kodali@gmail.com', icon: Mail, label: 'Email' },
];

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-border/50 bg-background/50 backdrop-blur-xl">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container max-w-7xl mx-auto px-[var(--container-padding)] py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <motion.a
              href="#hero"
              className="inline-flex items-center gap-2 group mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">CK</span>
            </motion.a>
            <p className="text-muted-foreground max-w-md mb-6">
              Platform Engineer & Cloud Architect specializing in building scalable
              infrastructure and enabling developer velocity.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.label !== 'Email' ? '_blank' : undefined}
                  rel={social.label !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="p-2.5 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                  <span className="sr-only">{social.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a
                  href="mailto:chandrakoushik.kodali@gmail.com"
                  className="hover:text-foreground transition-colors"
                >
                  chandrakoushik.kodali@gmail.com
                </a>
              </li>
              <li>Illinois, USA</li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Available for work
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-12 mt-12 border-t border-border/50"
        >
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {currentYear} Chandra Koushik Kodali. Made with
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </p>

          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            whileHover={{ y: -2 }}
          >
            Back to top
            <motion.div
              className="p-1.5 rounded-lg border border-border/50 group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowUp className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
}
