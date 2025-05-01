import askCli from '../helpers/ask-cli'
import ThrowExit from '../helpers/ThrowExit'
import colors from '../lib/colors'
import { TSchema, TSchemaPrimitive } from '../schema'
import { TypeArray } from '../schema/array'
import { TypeBoolean } from '../schema/boolean'
import { TypeTuple } from '../schema/tuple'
import { BaseConfig, ProgramOptions, RootSystemConfig } from '../types'
import splitTrailingArgs from '../utils/split-trailing-args'
import { NoArgCore } from './core'
import { NoArgError } from './helpers'
import type { NoArgProgram } from './program'

export class NoArgParser<
  TName extends string,
  TSystem extends RootSystemConfig,
  TConfig extends BaseConfig,
  TOptions extends ProgramOptions,
> extends NoArgCore<TName, TSystem, TConfig, TOptions> {
  private browsePrograms([name, ...args]: string[]) {
    const program = this.programs.get(name)
    if (program) {
      program['startCore'](args)
      return true
    }
  }

  private divideArguments(args: string[]) {
    const mainArgs = []
    const trailingArgs = []

    if (this.options.trailingArgs) {
      const [main, trailing] = splitTrailingArgs(
        args,
        this.options.trailingArgs
      )

      mainArgs.push(...main)
      trailingArgs.push(...trailing)
    } else {
      mainArgs.push(...args)
    }

    let isOptionReached = false
    const argList: string[] = []
    const options: ParsedFlagRecord[] = []

    for (const arg of mainArgs) {
      const result = this.getFlagMetadata(arg)

      if (
        !isOptionReached &&
        (result.argType === 'flag' || result.argType === 'alias')
      ) {
        isOptionReached = true
      }

      if (!isOptionReached) {
        argList.push(arg)
        continue
      }

      options.push(result)
    }

    return [argList, options, trailingArgs] as const
  }

  private findFlagInSchema(record: ParsedFlagRecord) {
    const combinedFlags = { ...this.options.globalFlags, ...this.options.flags }

    if (record.argType === 'flag') {
      const schema = combinedFlags[record.key]
      if (schema) return { schemaKey: record.key, schema }
    }

    if (record.argType === 'alias') {
      const found = Object.entries(combinedFlags).find(([, schema]) => {
        return schema.config.aliases?.includes(record.key)
      })

      if (found) return { schemaKey: found[0], schema: found[1] }
    }

    if (this.system.skipUnknownFlag) return
    throw new NoArgError(`Unknown option ${colors.red(record.arg)} received`)
  }

  private getFlagMetadata(rawArg: string): ParsedFlagRecord {
    const isFlag = flagRegex.test(rawArg)
    const isAlias = flagAliasRegex.test(rawArg)
    const argType =
      isFlag ? ('flag' as const)
      : isAlias ? ('alias' as const)
      : 'value'

    let key =
      isFlag ? rawArg.slice(2)
      : isAlias ? rawArg.slice(1)
      : null
    let value = null
    let hasBooleanEndValue

    if (key) {
      const hasValue = optionWithValueRegex.test(key)

      if (hasValue) {
        if (!this.system.allowEqualAssign) {
          throw new NoArgError(
            `Equal assignment is not allowed ${colors.red(rawArg)}`
          )
        }

        const { value: _value = null, key: _key = null } =
          key.match(optionWithValueRegex)?.groups ?? {}

        key = _key
        value = _value
      } else if (
        this.system.booleanNotSyntaxEnding &&
        key.endsWith(this.system.booleanNotSyntaxEnding)
      ) {
        key = key.slice(0, -this.system.booleanNotSyntaxEnding.length)
        hasBooleanEndValue = true
      }
    } else {
      value = rawArg
    }

    return {
      arg: rawArg,
      key,
      value,
      argType,
      hasBooleanEndValue,
    } as ParsedFlagRecord
  }

  private checkRecordFactory(output: Record<string, ParsedFlagWithSchema>) {
    let mustHaveAnyValue = false
    let prevSchemaKeyRecord:
      | (ParsedFlagRecord & {
          schemaKey: string
          schema: TSchema
        })
      | null = null

    const handleDuplicateValue = (
      record: ParsedFlagRecord,
      schemaKey: string
    ) => {
      const outputRecord = output[schemaKey]

      if (
        outputRecord.schema instanceof TypeArray ||
        outputRecord.schema instanceof TypeTuple
      ) {
        if (this.system.allowDuplicateFlagForList) {
          if (!this.system.overwriteDuplicateFlagForList) return
          return (outputRecord.values = [])
        }
      } else {
        if (this.system.allowDuplicateFlagForPrimitive) {
          return (outputRecord.values.length = 0)
        }
      }

      throw new NoArgError(
        `Duplicate option ${colors.cyan(record.arg!)} entered`
      )
    }

    const handleBooleanEndValue = (
      record: ParsedFlagRecord,
      schema: TSchema
    ) => {
      if (schema instanceof TypeBoolean) record.value = 'false'
      else {
        throw new NoArgError(
          `Only boolean types accept \`${
            this.system.booleanNotSyntaxEnding
          }\` assignment for option: ${colors.red(record.arg)}`
        )
      }
    }

    const handleMustHaveValueRecord = () => {
      const outputRecord = output[prevSchemaKeyRecord!.schemaKey]
      if (prevSchemaKeyRecord!.schema instanceof TypeBoolean) {
        mustHaveAnyValue = false
        return outputRecord.values.push('true')
      }

      throw new NoArgError(
        `No value given for option: ${colors.red(prevSchemaKeyRecord!.arg)}`
      )
    }

    return (record: ParsedFlagRecord) => {
      if (record.argType === 'flag' || record.argType === 'alias') {
        if (mustHaveAnyValue) handleMustHaveValueRecord()

        const matched = this.findFlagInSchema(record)
        if (!matched) return (prevSchemaKeyRecord = null)

        const { schemaKey, schema } = matched
        if (schemaKey in output) handleDuplicateValue(record, schemaKey)
        if (record.hasBooleanEndValue) handleBooleanEndValue(record, schema)

        output[schemaKey] ??= {
          argType: record.argType,
          arg: record.arg,
          schema: schema,
          values: [],
        }

        if (record.value !== null) {
          output[schemaKey].values.push(record.value)
        } else {
          mustHaveAnyValue = true
        }

        return (prevSchemaKeyRecord = { ...record, schemaKey, schema })
      }

      if (record.argType === 'value') {
        if (!prevSchemaKeyRecord) {
          if (this.system.skipUnknownFlag) return

          throw new NoArgError(
            `Unexpected value received: ${colors.yellow(record.arg)}`
          )
        }

        mustHaveAnyValue = false
        return output[prevSchemaKeyRecord.schemaKey].values.push(record.value)
      }

      throw new NoArgError(
        colors.red('Something went very very wrong, please report this issue')
      )
    }
  }

  private parseFlagsCore(records: ParsedFlagRecord[]) {
    if (records.length === 0) return {}
    if (records[0].argType === 'value') {
      throw new NoArgError(
        `Received a value: ${colors.yellow(
          records[0].arg
        )}. Expected an option.` +
          '\n But this should never be happened. Please report this issue.'
      )
    }

    const output = {} as Record<string, ParsedFlagWithSchema>
    const next = this.checkRecordFactory(output)
    records.forEach(next)
    return output
  }

  private async parseArguments(args: string[]) {
    args = [...args]
    type ArgsOutputType = (string | number | boolean)[]

    const resultArgs: ArgsOutputType = []
    for (const config of this.options.requiredArgs) {
      const input = args.shift()

      if (!input) {
        if (config.askQuestion === undefined) {
          throw new NoArgError(
            `No value provided for argument: ${colors.blue(config.name)}`
          )
        }

        const result = await askCli(config.type, colors.blue(config.name) + ':')

        resultArgs.push(result as ArgsOutputType[number])
        continue
      }

      const { value, error, valid } = config.type.parse(input)
      if (valid) {
        resultArgs.push(value)
        continue
      }

      throw new NoArgError(`${error} for argument: ${colors.blue(config.name)}`)
    }

    const resultOptArgs = this.options.optionalArgs.map((config) => {
      const input = args.shift()
      if (!input) return

      const { value, error, valid } = config.type.parse<TSchemaPrimitive>(input)
      if (valid) return value

      throw new NoArgError(`${error} for argument: ${colors.blue(config.name)}`)
    })

    const resultListArg: (string | number | boolean)[] = []

    if (this.options.listArg) {
      const arraySchema = new TypeArray({
        schema: this.options.listArg.type,
        minLength: this.options.listArg.minLength,
        maxLength: this.options.listArg.maxLength,
      })

      const { value, error, valid } = arraySchema.parse(args)

      if (valid) {
        resultListArg.push(...value)
        args.length = 0
      } else {
        throw new NoArgError(
          `${error} for list argument: ${colors.blue(
            this.options.listArg.name
          )}`
        )
      }
    }

    if (args.length > 0) {
      throw new NoArgError(
        `Unexpected arguments: ${colors.green(args.join(' '))}`
      )
    }

    return {
      resultArgs,
      resultOptArgs,
      resultListArg,
    }
  }

  private async parseFlags(records: ParsedFlagRecord[]) {
    const flagsRecordWithSchema = this.parseFlagsCore(records)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const output: Record<string, any> = {}

    for (const key in flagsRecordWithSchema) {
      const argValue = flagsRecordWithSchema[key]

      if (argValue.values.length === 0) {
        if (argValue.schema instanceof TypeBoolean) {
          output[key] = true
          continue
        }

        throw new NoArgError(
          `No value given for option: ${colors.red(argValue.arg)}`
        )
      }

      const isList =
        argValue.schema instanceof TypeArray ||
        argValue.schema instanceof TypeTuple

      if (isList && this.system.splitListByComma) {
        argValue.values = argValue.values.flatMap((value) =>
          value
            .split(/,/)
            .map((s) => s.trim())
            .filter(Boolean)
        )
      }

      if (!isList && argValue.values.length > 1) {
        if (!this.system.allowMultipleValuesForPrimitive) {
          throw new NoArgError(
            `Multiple value entered \`${argValue.values
              .map(colors.green)
              .join('` `')}\` for option ${colors.cyan(argValue.arg)}`
          )
        }

        argValue.values = [argValue.values[argValue.values.length - 1]]
      }

      const { value, error, valid } = argValue.schema.parse(
        isList ? argValue.values : argValue.values[0]
      )

      if (!valid) {
        throw new NoArgError(
          `${error} for option: ${colors.cyan(argValue.arg)}`
        )
      }

      output[key] = value
    }

    const combinedFlags = { ...this.options.globalFlags, ...this.options.flags }
    for (const key in combinedFlags) {
      const schema = combinedFlags[key]

      const hasValue = key in output
      const isRequired = schema.config.required

      if (!hasValue) {
        if (schema.config.askQuestion !== undefined) {
          const value = await askCli(schema, colors.cyan(`--${key}`) + ':')
          output[key] = value
          continue
        }

        if ('default' in schema.config) {
          output[key] = schema.config.default
          continue
        }

        if (isRequired) {
          throw new NoArgError(`Option ${colors.cyan('--' + key)} is required`)
        }
      }
    }

    return output
  }

  private async parseCore(args: string[]) {
    const [argsList, optionsRecord, trailingArgs] = this.divideArguments(args)

    if (this.config.help) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const self = this as unknown as NoArgProgram<any, any, any, any>

      optionsRecord.forEach(({ arg }) => {
        if (arg === '--help' || arg === '-h') {
          self.renderHelp()
          throw new ThrowExit(0)
        }

        if (arg === '--help-usage' || arg === '-hu') {
          self.renderUsage()
          throw new ThrowExit(0)
        }
      })
    }

    const { resultArgs, resultOptArgs, resultListArg } =
      await this.parseArguments(argsList)

    const resultFlags = await this.parseFlags(optionsRecord)

    return {
      requiredArgs: resultArgs,
      optionalArgs: resultOptArgs,
      trailingArgs: trailingArgs,
      listArg: resultListArg,
      flags: resultFlags,
    }
  }

  protected parseStart(
    args: string[]
  ): ReturnType<typeof this.parseCore> | void {
    if (this.browsePrograms(args)) return
    return this.parseCore(args)
  }
}

type ParsedFlagRecord = {
  arg: string
} & (
  | {
      key: string
      value: string | null
      argType: 'flag' | 'alias'
      hasBooleanEndValue: true
    }
  | {
      key: null
      value: string
      argType: 'value'
    }
)

type ParsedFlagWithSchema = {
  arg: string
  schema: TSchema
  values: string[]
  argType: Exclude<ParsedFlagRecord['argType'], 'value'>
}

const flagRegex = /^(--)([^-])/
const flagAliasRegex = /^(-)([^-])/
const optionWithValueRegex = /^(?<key>[^=]+)=(?<value>.+)/
