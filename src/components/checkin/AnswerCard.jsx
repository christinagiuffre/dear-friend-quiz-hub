export default function AnswerCard({ option, selected, onSelect, name, disabled }) {
  return (
    <button
      type="button"
      role="radio"
      name={name}
      onClick={() => onSelect(option)}
      disabled={disabled}
      aria-checked={selected ? 'true' : 'false'}
      className={`option ${selected ? 'option-selected' : 'option-default'}`}
    >
      <span
        className={`option-radio ${selected ? 'option-radio-selected' : 'option-radio-default'}`}
        aria-hidden="true"
      />
      <span>{option.label}</span>
    </button>
  )
}
