/**
 * Environment definitions for compiling AssemblyScript to JavaScript using tsc.
 *
 * Note that semantic differences require additional explicit conversions for full compatibility.
 * For example, when casting an i32 to an u8, doing `<u8>(someI32 & 0xff)` will yield the same
 * result when compiling to WebAssembly or JS while `<u8>someI32` alone does nothing in JS.
 *
 * Note that i64's are not portable (JS numbers are IEEE754 doubles with a maximum safe integer
 * value of 2^53-1) and instead require a compatibility layer to work in JS as well, as for example
 * {@link glue/js/i64} respectively {@link glue/wasm/i64}.
 *
 */

// Types

declare type bool = boolean;
declare type i8 = number;
declare type i16 = number;
declare type i32 = number;
declare type isize = number;
declare type u8 = number;
declare type u16 = number;
declare type u32 = number;
declare type usize = number;
declare type f32 = number;
declare type f64 = number;

/** Special type evaluating the indexed access index type. */
declare type indexof<T extends unknown[]> = keyof T;
/** Special type evaluating the indexed access value type. */
declare type valueof<T extends unknown[]> = T[0];
