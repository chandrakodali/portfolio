import { motion, useInView } from 'motion/react';
import { useRef, useState, useCallback } from 'react';
import { Send, Mail, MapPin, Phone, Github, Linkedin, CheckCircle, Loader2, MessageSquare, ArrowUpRight, AlertCircle } from 'lucide-react';

// Environment variable for Formspree - set VITE_FORMSPREE_ID in your .env file
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ID
  ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`
  : null;

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'chandrakoushik.kodali@gmail.com';

const contactInfo = [
  { icon: Mail, label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, color: 'cyan' },
  { icon: MapPin, label: 'Location', value: 'Illinois, USA', href: '#', color: 'violet' },
  { icon: Phone, label: 'Phone', value: '618-453-6722', href: 'tel:+16184536722', color: 'emerald' },
];

const socialLinks = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/chandrakodali' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/chandrakoushikkodali' },
];

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
};

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }

  // Email validation
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Subject validation
  if (!data.subject.trim()) {
    errors.subject = 'Subject is required';
  } else if (data.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters';
  } else if (data.subject.length > 200) {
    errors.subject = 'Subject must be less than 200 characters';
  }

  // Message validation
  if (!data.message.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (data.message.length > 5000) {
    errors.message = 'Message must be less than 5000 characters';
  }

  return errors;
};

// Input field component with error handling
function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  maxLength,
  rows
}: {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  error?: string;
  maxLength?: number;
  rows?: number;
}) {
  const inputId = `contact-${name}`;
  const errorId = `${inputId}-error`;
  const isTextarea = rows !== undefined;

  const inputClasses = `w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border text-white placeholder-gray-600 focus:outline-none transition-colors ${error
      ? 'border-red-500/50 focus:border-red-500'
      : 'border-white/[0.08] focus:border-cyan-500/50'
    }`;

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-400 mb-2">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={inputId}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={inputClasses}
        />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-400 flex items-center gap-1" role="alert">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Honeypot field for spam prevention
  const [honeypot, setHoneypot] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setSubmitError(null);
  }, [errors]);

  const handleBlur = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    // Validate single field on blur
    const fieldErrors = validateForm(formData);
    if (fieldErrors[fieldName as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [fieldName]: fieldErrors[fieldName as keyof FormErrors] }));
    }
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam check - if honeypot is filled, silently reject
    if (honeypot) {
      setIsSuccess(true);
      return;
    }

    // Validate all fields
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Try Formspree if configured, otherwise use mailto
    if (FORMSPREE_ENDPOINT) {
      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim(),
            message: formData.message.trim(),
            _replyto: formData.email.trim(),
          }),
        });

        if (response.ok) {
          setIsSuccess(true);
          setFormData({ name: '', email: '', subject: '', message: '' });
          setTouched({});
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Form submission failed');
        }
      } catch (err) {
        // Try mailto as fallback
        openMailto();
      }
    } else {
      // No Formspree configured, use mailto directly
      openMailto();
    }

    setIsSubmitting(false);
  };

  const openMailto = () => {
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(formData.subject.trim())}&body=${encodeURIComponent(`From: ${formData.name.trim()} (${formData.email.trim()})\n\n${formData.message.trim()}`)}`;
    window.location.href = mailto;
    setIsSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTouched({});
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 mb-6"
          >
            <MessageSquare className="w-7 h-7 text-emerald-400" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Let's Connect
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have a project in mind? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Info cards */}
            {contactInfo.map((item, i) => {
              const colors = colorMap[item.color];
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] transition-colors group"
                  aria-label={`${item.label}: ${item.value}`}
                >
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${colors.text}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                    <p className="text-white font-medium truncate group-hover:text-cyan-400 transition-colors">{item.value}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" aria-hidden="true" />
                </motion.a>
              );
            })}

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <p className="text-sm text-gray-500 mb-4">Follow me</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/[0.15] transition-all"
                    aria-label={`Visit my ${social.label} profile`}
                  >
                    <social.icon className="w-5 h-5" aria-hidden="true" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  aria-hidden="true"
                />
                <span className="text-emerald-400 font-medium">Available for opportunities</span>
              </div>
              <p className="text-gray-500 text-sm">Usually respond within 24 hours</p>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                  role="status"
                  aria-live="polite"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-emerald-400" aria-hidden="true" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400 mb-6">Thanks for reaching out. I'll get back to you soon!</p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Honeypot field - hidden from users, visible to bots */}
                  <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2" role="alert">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {submitError}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormInput
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      error={touched.name ? errors.name : undefined}
                      maxLength={100}
                    />
                    <FormInput
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      error={touched.email ? errors.email : undefined}
                    />
                  </div>
                  <FormInput
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    error={touched.subject ? errors.subject : undefined}
                    maxLength={200}
                  />
                  <FormInput
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    error={touched.message ? errors.message : undefined}
                    maxLength={5000}
                    rows={4}
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" aria-hidden="true" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

