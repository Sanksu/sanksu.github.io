declare module '*.scss'
declare module '*.css'
declare module '@waline/client/style'
declare module '*.module.scss' {
  const classes: Record<string, string>
  export default classes
}
