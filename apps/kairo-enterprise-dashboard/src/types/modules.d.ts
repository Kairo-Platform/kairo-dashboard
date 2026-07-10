declare module "underscore.string/slugify" {
  const slugify: (s: string) => string;
  export default slugify;
}

declare module "underscore.string/humanize" {
  const humanize: (s: string) => string;
  export default humanize;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "react-datepicker/dist/react-datepicker.min.css";
