export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const baseStyles = "font-medium rounded-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600/10 active:scale-98 select-none border";

  const variants = {
    primary:
      "bg-blue-700 border-blue-700 hover:bg-blue-800 text-white shadow-sm cursor-pointer",
    secondary:
      "bg-white dark:bg-[#131b2e] border-zinc-200 dark:border-slate-800 text-zinc-700 dark:text-slate-300 hover:bg-zinc-50 dark:hover:bg-[#1a2542] hover:text-zinc-900 dark:hover:text-white cursor-pointer shadow-xs",
    outline:
      "border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer",
    ghost:
      "border-transparent text-zinc-500 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-slate-800/40 hover:text-zinc-900 dark:hover:text-white cursor-pointer",
    danger:
      "bg-red-600 border-red-600 text-white hover:bg-red-700 shadow-sm cursor-pointer",
    success:
      "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 shadow-sm cursor-pointer",
    badge:
      "px-2.5 py-1 border-blue-900/40 bg-blue-950/40 text-blue-400 text-xs font-semibold inline-block rounded-md",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
