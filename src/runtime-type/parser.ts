import { AllTypeConfigs } from './config.type'

type ParsedResponse<T> =
  | { value: T; error: null; ok: true }
  | { value: null; error: string; ok: false }

export function runtimeTypeCheck<TConfig extends AllTypeConfigs>(
  config: TConfig
) {
  if (config.typeV2 === String) {
    console.log(config)
  }

  return {}
}
