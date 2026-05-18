interface Props {
  open: boolean
  onClose?: () => void
}

export function BanDialog({ open }: Props) {
  if (!open) return null

  return (
    <dialog open>
      <article>
        <header>
          <label style={{ color: 'rgb(210, 156, 56)' }}>Warning</label>
        </header>
        <div>
          According to the relevant laws and regulations where you are, we are unable to provide services for you.
        </div>
        <footer>
          <button className="outline" disabled>
            Thank you for your visit
          </button>
        </footer>
      </article>
    </dialog>
  )
}