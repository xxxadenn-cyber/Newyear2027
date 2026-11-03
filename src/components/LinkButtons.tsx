import { ExternalLink, Send } from 'lucide-react';

interface TelegramLinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold';
  className?: string;
}

export function TelegramLinkButton({
  href,
  children,
  variant = 'primary',
  className = '',
}: TelegramLinkButtonProps) {
  const base =
    'flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-semibold transition-all duration-200 active:scale-95';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#2a9d8f] to-[#26867b] text-white shadow-lg shadow-[#2a9d8f]/20 hover:from-[#2ba99a] hover:to-[#28907f]',
    secondary:
      'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20',
    gold:
      'bg-gradient-to-r from-[#d4af37] to-[#f5e6a8] text-[#0a0a1a] shadow-lg shadow-[#d4af37]/20 hover:from-[#e0bc42] hover:to-[#ffefb8]',
  };

  const isTelegram = href.startsWith('https://t.me');

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variants[variant]} ${className}`}
    >
      {isTelegram ? <Send size={18} /> : <ExternalLink size={18} />}
      {children}
    </a>
  );
}

interface ExternalLinkButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ExternalLinkButton({ href, children, className = '' }: ExternalLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 text-sm font-medium text-[#a0c4ff] hover:text-white transition-colors ${className}`}
    >
      <ExternalLink size={14} />
      {children}
    </a>
  );
}
