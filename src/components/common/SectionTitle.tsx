const SectionTitle = ({
  subtitle,
  title,
  paragraph,
  width = "635px",
  center,
}: {
  subtitle?: string;
  title: string;
  paragraph: string;
  width?: string;
  center?: boolean;
}) => {
  return (
    <div className="-mx-4  flex flex-wrap">
      <div
        className={`wow fadeInUp w-full px-4 ${
          center ? "mx-auto text-center" : ""
        }`}
        data-wow-delay=".1s"
        style={{ maxWidth: width }}
      >
        {subtitle && (
          <span className="mb-2 block md:text-lg text-xs font-semibold text-primary">
            {subtitle}
          </span>
        )}
        <h2 className="md:mb-4 text-3xl  font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
          {title}
        </h2>
        <p className="md:text-base text-sm text-body-color ">
          {paragraph}
        </p>
      </div>
    </div>
  );
};

export default SectionTitle;
