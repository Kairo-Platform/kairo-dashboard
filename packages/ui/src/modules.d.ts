declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "underscore.string/humanize" {
  const humanize: (s: string) => string;
  export default humanize;
}

declare module "underscore.string/slugify" {
  const slugify: (s: string) => string;
  export default slugify;
}

declare module "react-datepicker/dist/react-datepicker.min.css";
