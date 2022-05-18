declare module '*.md' {
  const value: any;
  export default value;
}

type CSSModuleClasses = { readonly [key: string]: string }

declare module '*.module.css' {
  const classes: CSSModuleClasses
  export default classes
}
