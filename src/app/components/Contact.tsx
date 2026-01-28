import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, MapPin, CheckCircle, Loader2, MessageSquare, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { Section } from './Section';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ID
  ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`
  : null;

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'chandrakoushik.kodali@gmail.com';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      if (FORMSPREE_ENDPOINT) {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to send message');
        setIsSuccess(true);
      } else {
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
          data.subject as string
        )}&body=${encodeURIComponent(data.message as string)}`;
        setIsSuccess(true);
      }
    } catch (err) {
      setError('Something went wrong. Please try again or email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact" className="py-20 md:py-32">
      <div className="container max-w-6xl mx-auto px-[var(--container-padding)]">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Get in Touch</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[length:var(--font-3xl)] font-bold tracking-tight mb-4"
          >
            Let's Work Together
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-[length:var(--font-lg)]"
          >
            I'm always open to discussing new opportunities in platform engineering,
            cloud architecture, or DevOps.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="space-y-6">
              {/* Email Card */}
              <motion.a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group flex items-center gap-4 p-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl hover:border-primary/30 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">{CONTACT_EMAIL}</div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.a>

              {/* Location Card */}
              <motion.div
                className="flex items-center gap-4 p-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl"
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">Illinois, USA</div>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-4">Or connect with me on</p>
              <div className="flex gap-3">
                {[
                  { href: 'https://github.com/chandrakodali', icon: Github, label: 'GitHub' },
                  { href: 'https://www.linkedin.com/in/chandrakoushikkodali', icon: Linkedin, label: 'LinkedIn' },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-card/50 text-sm font-medium hover:border-primary/30 hover:bg-primary/5 transition-colors"
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <social.icon className="w-4 h-4" />
                    {social.label}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 md:p-8">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    <CheckCircle className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. I'll get back to you shortly.
                  </p>
                  <motion.button
                    onClick={() => setIsSuccess(false)}
                    className="text-primary font-medium hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send another message
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Project inquiry"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
