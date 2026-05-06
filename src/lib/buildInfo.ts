export const APP_VERSION  = __APP_VERSION__
export const BUILD_TIME   = __BUILD_TIME__
export const GIT_SHA      = __GIT_SHA__

export function formatBuildTime(): string {
  return new Date(BUILD_TIME).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}
