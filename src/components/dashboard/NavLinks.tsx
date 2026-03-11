const links = [
  { label: 'Nodely Explorer', url: 'https://g.nodely.io/d/tps/mainnet' },
  { label: 'Allo Explorer', url: 'https://allo.info' },
  { label: 'Lora Explorer', url: 'https://lora.algokit.io/mainnet' },
  { label: 'AlgoNode', url: 'https://algonode.cloud' },
  { label: 'Algorand Foundation', url: 'https://algorand.foundation' },
]

export function NavLinks() {
  return (
    <div className="bg-base-200 rounded-box shadow p-4">
      <h3 className="text-sm font-semibold mb-3 opacity-60">Links</h3>
      <ul className="menu menu-sm p-0">
        {links.map((link) => (
          <li key={link.url}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="link link-hover">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
