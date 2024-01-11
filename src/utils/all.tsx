export const cx = (...classNames: (string | boolean)[]) =>
  classNames.filter(Boolean).join(" ");

export const myLoader = ({ src }: { src: string }) => {
  return src;
};
