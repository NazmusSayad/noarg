# CLI Argument Structure (POSIX + GNU)

## Core Concepts

- Subcommands
- Arguments
- List arguments
- Flags

This CLI supports:

- Subcommands (nested)
- Normal arguments
- Short flags (POSIX style)
- Long flags (GNU style)
- No-value, single-value, and multi-value flags

Placeholders:

- Program: `command`
- Subcommands: `sub1`, `sub2`, `sub3`
- Short flags: `-f1`, `-f2`
- Long flags: `--flag1`, `--flag2`
- Arguments: `arg1`, `arg2`
  Values: `v1`, `v2`, `vList1`, `vList2` `arg1`, `arg2`, `v1`, `v2`, `vList1`, `vList2`

Core structural rule:

```text
command sub1 [sub2 [...]] [flags and args in any order...]
```

- `command` is always first.
- First subcommand (`sub1`) must come immediately after `command`.
- No flags before `sub1`.
- After `sub1` (and further subcommands), flags and args can be mixed.

---

## 1. No-Value Flags

No-value flags are just toggles (boolean).

### POSIX (short flags)

```text
command sub1 -f1
command sub1 -f1 -f2
command sub1 arg1 -f1
command sub1 -f1 arg1

command sub1 sub2 -f1
command sub1 sub2 -f1 -f2
command sub1 sub2 arg1 -f1
```

### GNU (long flags)

```text
command sub1 --flag1
command sub1 --flag1 --flag2
command sub1 arg1 --flag1
command sub1 --flag1 arg1

command sub1 sub2 --flag1
command sub1 sub2 --flag1 --flag2
command sub1 sub2 arg1 --flag1
```

---

## 2. Single-Value Flags

A single-value flag takes exactly one value (`v1`, `v2`, etc.).

### POSIX (short flags)

Separate value:

```text
command sub1 -f1 v1
command sub1 -f1 v1 arg1
command sub1 arg1 -f1 v1
command sub1 sub2 -f1 v1
command sub1 sub2 -f1 v1 arg1
```

Attached value:

```text
command sub1 -f1v1
command sub1 -f1v1 arg1
command sub1 sub2 -f1v1
command sub1 sub2 -f1v1 arg1
```

Multiple single-value flags:

```text
command sub1 -f1 v1 -f2 v2
command sub1 -f1 v1 -f2 v2 arg1
command sub1 sub2 -f1 v1 -f2 v2 arg1 arg2
```

### GNU (long flags)

Space-separated value:

```text
command sub1 --flag1 v1
command sub1 --flag1 v1 arg1
command sub1 arg1 --flag1 v1
command sub1 sub2 --flag1 v1
command sub1 sub2 --flag1 v1 arg1
```

`=`-attached value:

```text
command sub1 --flag1=v1
command sub1 --flag1=v1 arg1
command sub1 sub2 --flag1=v1
command sub1 sub2 --flag1=v1 arg1
```

Multiple single-value flags:

```text
command sub1 --flag1 v1 --flag2 v2
command sub1 --flag1=v1 --flag2=v2
command sub1 sub2 --flag1 v1 --flag2 v2 arg1
command sub1 sub2 --flag1=v1 --flag2=v2 arg1 arg2
```

POSIX vs GNU side-by-side:

```text
command sub1 -f1 v1
command sub1 --flag1 v1

command sub1 -f1v1
command sub1 --flag1=v1

command sub1 -f1 v1 -f2 v2
command sub1 --flag1=v1 --flag2=v2
```

---

## 3. Multi-Value Flags

A multi-value flag can accept multiple values (`v1`, `v2`, or lists like `vList1`).

### 3.1 Repeated flag (recommended)

POSIX:

```text
command sub1 -f1 v1 -f1 v2
command sub1 -f1 v1 -f1 v2 arg1
command sub1 sub2 -f1 v1 -f1 v2 arg1 arg2

command sub1 -f2 vList1 -f2 vList2
command sub1 sub2 -f2 vList1 -f2 vList2 arg1
```

GNU:

```text
command sub1 --flag1 v1 --flag1 v2
command sub1 --flag1 v1 --flag1 v2 arg1
command sub1 sub2 --flag1 v1 --flag1 v2 arg1 arg2

command sub1 --flag2 vList1 --flag2 vList2
command sub1 sub2 --flag2 vList1 --flag2 vList2 arg1
```

### 3.2 Comma-separated list (app-level semantics)

POSIX:

```text
command sub1 -f1 v1,v2
command sub1 sub2 -f1 v1,v2 arg1

command sub1 -f2 vList1
command sub1 -f2 vList1 arg1
```

GNU:

```text
command sub1 --flag1=v1,v2
command sub1 sub2 --flag1=v1,v2 arg1

command sub1 --flag2=vList1
command sub1 --flag2=vList1 arg1
```

---

## 4. Mixing Flags and Arguments

After `sub1` (and nested subcommands), flags and args can be interleaved.

Short flags:

```text
command sub1 -f1 v1 arg1 arg2
command sub1 arg1 -f1 v1 arg2
command sub1 arg1 arg2 -f1 v1

command sub1 sub2 -f1 v1 arg1
command sub1 sub2 arg1 -f1 v1 arg2
command sub1 sub2 arg1 arg2 -f1 v1
```

Long flags:

```text
command sub1 --flag1 v1 arg1 arg2
command sub1 arg1 --flag1=v1 arg2
command sub1 arg1 arg2 --flag1=v1

command sub1 sub2 --flag1=v1 arg1
command sub1 sub2 arg1 --flag1 v1 arg2
command sub1 sub2 arg1 arg2 --flag1=v1
```

Mixed short + long:

```text
command sub1 -f1 v1 --flag2 v2 arg1
command sub1 --flag1=v1 -f2 v2 arg1 arg2
command sub1 sub2 -f1 v1 --flag2=v2 arg1 arg2
```

---

## 5. Multiple Flags Together (Boolean + Value)

POSIX:

```text
command sub1 -f1 -f2 v2
command sub1 -f1 -f2 v2 arg1
command sub1 sub2 -f1 -f2 v2 arg1 arg2

command sub1 -f1 -f2 vList1
command sub1 sub2 -f1 -f2 vList1 arg1
```

GNU:

```text
command sub1 --flag1 --flag2 v2
command sub1 --flag1 --flag2=v2
command sub1 sub2 --flag1 --flag2=v2 arg1

command sub1 --flag1 --flag2 vList1
command sub1 sub2 --flag1 --flag2=vList1 arg1
```

---

## 6. Deeply Nested Subcommands

```text
command sub1 sub2 sub3 -f1 v1
command sub1 sub2 sub3 -f1 v1 arg1
command sub1 sub2 sub3 -f1 v1 -f2 v2 arg1 arg2

command sub1 sub2 sub3 --flag1 v1
command sub1 sub2 sub3 --flag1=v1 arg1
command sub1 sub2 sub3 --flag1=v1 --flag2=v2 arg1 arg2
```

More variants:

```text
command sub1 sub2 sub3 -f1 v1 -f1 v2 arg1
command sub1 sub2 sub3 --flag1 v1 --flag1 v2 arg1

command sub1 sub2 sub3 -f2 vList1 arg1 arg2
command sub1 sub2 sub3 --flag2=vList1 arg1 arg2
```

---

## 7. Quick POSIX vs GNU Mapping

Boolean flags:

```text
POSIX: command sub1 -f1 -f2 arg1
GNU:   command sub1 --flag1 --flag2 arg1
```

Single-value flags:

```text
POSIX: command sub1 -f1 v1 -f2 v2 arg1
GNU:   command sub1 --flag1=v1 --flag2=v2 arg1
```

Multi-value (repeat):

```text
POSIX: command sub1 -f1 v1 -f1 v2 arg1
GNU:   command sub1 --flag1 v1 --flag1 v2 arg1
```

Multi-value (lists):

```text
POSIX: command sub1 -f1 vList1
GNU:   command sub1 --flag1=vList1
```

---

## 8. More Examples (GNU long flags)

Single subcommand:

```
command sub1 --flag1
command sub1 --flag1=v1
command sub1 arg1 --flag1=v1
command sub1 --flag1 v1 arg1
command sub1 --flag1=v1 --flag2=v2
command sub1 arg1 --flag1=v1 --flag2=v2
```

Nested subcommands:

```
command sub1 sub2 --flag1
command sub1 sub2 --flag1=v1
command sub1 sub2 arg1 --flag1=v1
command sub1 sub2 --flag1=v1 --flag2=v2
command sub1 sub2 arg1 --flag1=v1 --flag2=v2 arg2
```

Multi-value (repeat):

```
command sub1 --flag1 v1 --flag1 v2
command sub1 arg1 --flag1 v1 --flag1 v2 arg2
command sub1 sub2 --flag1 v1 --flag1 v2
command sub1 sub2 arg1 --flag1 v1 --flag1 v2
```

Multi-value (lists):

```
command sub1 --flag1=vList1
command sub1 --flag1=v1,v2
command sub1 sub2 --flag1=vList1
command sub1 sub2 --flag1=v1,v2 arg1
```

Mixed short + long flags:

```
command sub1 -f1 v1 --flag2=v2
command sub1 sub2 --flag1=v1 -f2 v2 arg1
command sub1 arg1 -f1 v1 --flag2=v2 arg2
```

Boolean + value together:

```
command sub1 --flag1 --flag2=v2
command sub1 sub2 --flag1 --flag2=v2 arg1
command sub1 arg1 --flag1 --flag2=v2 arg2
```

## 9. End of Option Parsing (`--`)

`--` stops flag parsing. Everything after it is treated as a normal argument, even if it looks like a flag.

POSIX:

```
command sub1 -f1 -- arg1 arg2
command sub1 sub2 -f1 -- -fakeArg arg1
command sub1 -- --flagLikeValue
```

GNU:

```
command sub1 --flag1 -- arg1 arg2
command sub1 sub2 --flag1=v1 -- -fakeArg arg1
command sub1 -- --flagLikeValue
```

With multi-value flags:

```
command sub1 --flag1 v1 -- v2
command sub1 --flag1 v1 --flag1 v2 -- arg1
```

`--` applies the same in POSIX and GNU — the difference is only short vs long flags.

## 10. Final Shape

All examples follow this core pattern:

```text
command sub1 [sub2 [sub3 ...]] [flags and args in any order...]
```

- POSIX style = short flags: `-f1`, `-f2`
- GNU style = long flags: `--flag1`, `--flag2`
- Values are shown as `v1`, `v2`, `vList1`, `vList2`.

All examples follow this core pattern:

```text
command sub1 [sub2 [sub3 ...]] [flags and args in any order...]
```

- POSIX style = short flags: `-f1`, `-f2`
- GNU style = long flags: `--flag1`, `--flag2`
- Values are shown as `v1`, `v2`, `vList1`, `vList2`.

All examples follow this core pattern:

```text
command sub1 [sub2 [sub3 ...]] [flags and args in any order...]
```

- POSIX style = short flags: `-f1`, `-f2`
- GNU style = long flags: `--flag1`, `--flag2`
- Values are shown as `v1`, `v2`, `vList1`, `vList2`.
