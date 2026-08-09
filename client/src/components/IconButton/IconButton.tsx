type IconButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
};

export default function IconButton({
  children,
  onClick,
  ariaLabel,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="
    flex h-9 w-9 items-center justify-center
    rounded-lg
    text-text
    transition-colors
    hover:bg-surface-2
    hover:text-primary
  "
    >
      {children}
    </button>
  );
}