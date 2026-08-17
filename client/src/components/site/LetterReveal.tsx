export function LetterReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  return <span aria-label={text}>{Array.from(text).map((character, index) => <span key={`${character}-${index}`} aria-hidden="true" className="editorial-letter" style={{ animationDelay: `${delay + index * 24}ms` }}>{character === " " ? "\u00a0" : character}</span>)}</span>;
}
