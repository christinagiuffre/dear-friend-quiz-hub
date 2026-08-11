import { site } from '../data/site'

export default function Disclaimer({ className = '' }) {
  return (
    <p className={`text-center text-[11px] text-muted/75 ${className}`} style={{ lineHeight: 1.55 }}>
      {site.disclaimer}
    </p>
  )
}
