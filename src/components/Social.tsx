import { Reveal } from './Reveal'

export const Social: React.FC = () => {
  return (
    
    <Reveal delay={0.9} className="h-full">
    <div>
      <p className="text-xs uppercase tracking-widest opacity-40 mb-4">Social</p>
      <div className="flex gap-4 font-medium">
        <a
          href="https://www.linkedin.com/in/thongnt0208"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-60 transition-opacity"
        >
          LI
        </a>
        <a
          href="https://github.com/thongnt0208"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-60 transition-opacity"
        >
          GH
        </a>
        <a
          href="https://www.facebook.com/thongwisen"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-60 transition-opacity"
        >
          FB
        </a>
        <a
          href="https://www.tiktok.com/@thongwisen"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-60 transition-opacity"
        >
          TK
        </a>
      </div>
    </div>
  </Reveal>
  )
};