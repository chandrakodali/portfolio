import { Terminal, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-primary/10 text-primary">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">CK</span>
          </div>

          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Chandra Koushik Kodali. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="https://github.com/chandrakodali" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/chandrakoushikkodali" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="mailto:chandrakoushik.kodali@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-5 h-5" />
              <span className="sr-only">Email</span>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
