/**
 * @fileoverview Main entry point for the onlykit package.
 *
 * This module provides the primary exports for the onlykit toolkit.
 * Here exports the CLI functionality as the main interface.
 *
 * @example
 * ```typescript
 * import { figlet } from "onlykit";
 * ```
 *
 * @see {@link ./cli} For CLI-specific functionality
 * @since 0.0.2
 */

/**
 * Re-exports all CLI functionality as the main package interface.
 *
 * The CLI module provides command-line interface utilities and tools
 * for development workflows, project scaffolding, and automation tasks.
 *
 * @example
 * ```typescript
 * import { figlet } from "onlykit";
 *
 * console.log(figlet.textSync("Hello, World!"));
 * ```
 */
export * from "./cli";
