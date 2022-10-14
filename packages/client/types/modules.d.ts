declare module "*.svg" {
  const svg: React.ComponentType<React.SVGProps<SVGElement>>;
  export default svg;
}

declare module "*.module.scss" {
  const styles: Record<string, string>;
  export default styles;
}
