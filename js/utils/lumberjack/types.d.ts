/** @format */

/**
 * TypeScript definitions for Lumberjack logging utility
 */

export type LogMode = 'brief' | 'verbose' | 'silent';
export type LogStyleName = 'standard' | 'headsup' | 'error' | 'success';

export interface LumberjackConfig {
  enabled?: boolean;
  prefix?: string;
  styles?: Record<string, LumberjackStyle>;
  scope?: string | null;
}

export interface ScopedLoggerOptions {
  prefix?: string;
  color?: string;
}

export declare class LumberjackStyle {
  constructor(color: string, prefix?: string);
  readonly color: string;
  readonly prefix: string;
}

export declare class LumberjackStyles {
  static readonly SEPARATOR: string;
  static readonly STANDARD: LumberjackStyle;
  static readonly HEADSUP: LumberjackStyle;
  static readonly ERROR: LumberjackStyle;
  static readonly SUCCESS: LumberjackStyle;
  static getStyle(styleName: string): LumberjackStyle;
}

export interface ScopedLogger {
  trace(message: string, obj?: any, mode?: LogMode, style?: LogStyleName | LumberjackStyle): void;
  indent(): void;
  outdent(): void;
  resetIndent(): void;
  group(fn: () => void | Promise<void>): Promise<void>;
  showScriptOutline(
    operationName: string,
    outline: any[],
    mode?: LogMode,
    style?: LogStyleName | LumberjackStyle
  ): void;
  enabled: boolean;
  readonly scope: string;
  readonly config: LumberjackConfig;
}

export declare class Lumberjack {
  static getInstance(enabled?: boolean): Lumberjack;
  static configure(options?: LumberjackConfig): Lumberjack;
  static createScoped(scope: string, options?: ScopedLoggerOptions): ScopedLogger;
  static trace(
    message: string,
    obj?: any,
    mode?: LogMode,
    style?: LogStyleName | LumberjackStyle
  ): void;
  static enabled: boolean;

  trace(message: string, obj?: any, mode?: LogMode, style?: LogStyleName | LumberjackStyle): void;
  indent(): void;
  outdent(): void;
  resetIndent(): void;
  group(fn: () => void | Promise<void>): Promise<void>;
  showScriptOutline(
    operationName: string,
    outline: any[],
    mode?: LogMode,
    style?: LogStyleName | LumberjackStyle
  ): void;
  enabled: boolean;
}

export interface LumberjackInstance {
  trace(message: string, obj?: any, mode?: LogMode, style?: LogStyleName | LumberjackStyle): void;
  indent(): void;
  outdent(): void;
  resetIndent(): void;
  group(fn: () => void | Promise<void>): Promise<void>;
  showScriptOutline(
    operationName: string,
    outline: any[],
    mode?: LogMode,
    style?: LogStyleName | LumberjackStyle
  ): void;
  configure(options?: LumberjackConfig): LumberjackInstance;
  createScoped(scope: string, options?: ScopedLoggerOptions): ScopedLogger;
  enabled: boolean;
}

declare const lumberjack: LumberjackInstance;
export default lumberjack;

export { Lumberjack, LumberjackStyle, LumberjackStyles };
