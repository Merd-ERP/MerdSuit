function PageHeader({ title, subtitle }) {
  return (
    <header className="mb-6 sm:mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          {subtitle}
        </p>
      )}
    </header>
  );
}

export default PageHeader;
