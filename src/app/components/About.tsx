import { motion } from 'motion/react';
import { MapPin, Briefcase, Award, GraduationCap, Code2, Cloud, ArrowUpRight } from 'lucide-react';
import { Section } from './Section';

function AboutCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className={`relative overflow-hidden rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm hover:border-primary/50 transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function About() {
  return (
    <Section id="about" className="py-20 md:py-24 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-[var(--container-padding)]">
        <div className="text-center mb-16">
          <h2 className="text-[length:var(--font-3xl)] font-bold tracking-tight mb-4">About Me</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-[length:var(--font-lg)]">
            Building the infrastructure that powers tomorrow's applications.
            Focused on reliability, scalability, and developer experience.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Main Info Card */}
          <AboutCard className="md:col-span-2 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Chandra Koushik Kodali</h3>
                  <p className="text-primary font-medium">Platform Engineer</p>
                </div>
                <div className="flex items-center text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  Illinois, USA
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                I architect cloud-native infrastructure and build self-service developer platforms that enable teams to ship faster.
                With experience at major enterprises including J.P. Morgan, Humana, and Deloitte.
              </p>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline group"
            >
              Get in touch <ArrowUpRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </AboutCard>

          {/* Stats */}
          <AboutCard className="flex flex-col justify-center items-center text-center">
            <Briefcase className="w-8 h-8 text-primary mb-3" />
            <div className="text-4xl font-bold mb-1">5+</div>
            <p className="text-sm text-muted-foreground">Years Experience</p>
          </AboutCard>

          <AboutCard className="flex flex-col justify-center items-center text-center">
            <Award className="w-8 h-8 text-primary mb-3" />
            <div className="text-4xl font-bold mb-1">3</div>
            <p className="text-sm text-muted-foreground">Key Certifications</p>
          </AboutCard>

          {/* Skills Summary */}
          <AboutCard className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Cloud className="w-5 h-5 text-primary mr-2" />
              <h4 className="font-semibold">Cloud & Modern Infrastructure</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Docker'].map((tech) => (
                <span key={tech} className="inline-flex items-center rounded-md border border-border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </AboutCard>

          {/* CI/CD */}
          <AboutCard className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Code2 className="w-5 h-5 text-primary mr-2" />
              <h4 className="font-semibold">CI/CD & Automation</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Jenkins', 'GitHub Actions', 'ArgoCD', 'GitLab CI', 'Ansible'].map((tech) => (
                <span key={tech} className="inline-flex items-center rounded-md border border-border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </AboutCard>

          {/* Education */}
          <AboutCard className="md:col-span-2 lg:col-span-2">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Master of Science in Computer Science</h4>
                <p className="text-muted-foreground">Southern Illinois University</p>
              </div>
            </div>
          </AboutCard>

          {/* Companies */}
          <AboutCard className="md:col-span-2 lg:col-span-2 flex flex-col justify-center">
            <p className="text-sm text-muted-foreground mb-3 font-medium">Trusted by Industry Leaders</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
              {['J.P. Morgan', 'Humana', 'Deloitte', 'Country Financial'].map((company) => (
                <span key={company} className="text-foreground font-medium">
                  {company}
                </span>
              ))}
            </div>
          </AboutCard>

        </motion.div>
      </div>
    </Section>
  );
}
