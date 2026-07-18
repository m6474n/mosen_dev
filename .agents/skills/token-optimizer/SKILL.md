---
name: token-optimizer
description: >
  Activates aggressive token-saving strategies for any coding or analysis task
  in the mosen.dev workspace. Trigger this skill when: reading large files,
  searching the codebase, planning multi-file edits, debugging, or any task
  where context window efficiency matters. Prevents wasteful full-file reads,
  redundant tool calls, and unnecessary re-summarization.
---

# Token Optimizer — Efficiency Playbook

## Core Principle
**Spend tokens on thinking and output, not on redundant reading.**
Every tool call has a cost. Use these strategies to maximize signal per token.

---

## Strategy 1: Read Selectively, Never in Full

### Large File Protocol
Before reading any file over 5KB, identify the minimum line range needed:

1. **grep first** → find the symbol/line you need
2. **view targeted range** → `StartLine` + `EndLine` (max 200 lines at a time)
3. **only expand** if the initial range is insufficient

```
BAD:  view_file(AdminDashboardView.tsx)           # 68KB full read
GOOD: grep_search("handleDelete") → view lines 340-380
```

### File Size Quick Reference (mosen.dev)
| File | Size | Max Read Strategy |
|---|---|---|
| `src/data.ts` | 37 KB | grep the array name, read 50 lines around it |
| `AdminDashboardView.tsx` | 68 KB | grep function names; read 150-line chunks |
| `InteractiveScreenshotMockup.tsx` | 42 KB | read only the component/prop section needed |
| `InteractiveWorldMap.tsx` | 31 KB | read only config/options section |
| `HomeView.tsx` | 23 KB | read section by section |

---

## Strategy 2: Batch Independent Tool Calls

Always run independent operations in the same `<tool_calls>` block:

```
GOOD: [list_dir src/app] + [view_file types.ts] simultaneously
BAD:  list_dir → wait → view_file → wait (double the round trips)
```

---

## Strategy 3: grep Before You Open

Use `grep_search` with precise filters before opening any file:

```
# Find where a component is used
grep_search(query="InteractiveWorldMap", Includes=["*.tsx"], MatchPerLine=true)

# Find a specific type definition
grep_search(query="interface CaseStudy", Includes=["*.ts"], MatchPerLine=true)

# Find a Firestore call pattern
grep_search(query="collection('case_studies')", Includes=["*.tsx","*.ts"])
```

Never search inside: `node_modules/`, `.next/`, `.git/`

---

## Strategy 4: Surgical Edits Only

| Scenario | Tool to Use |
|---|---|
| Single contiguous block change | `replace_file_content` |
| 2+ non-adjacent changes, same file | `multi_replace_file_content` |
| Creating a new file | `write_to_file` |
| Entire file rewrite needed | `write_to_file` with `Overwrite: true` |

**Never** read a full file just to do a 3-line edit you already have context for.

---

## Strategy 5: Avoid Re-reading After Edits

After making an edit, trust the edit was applied correctly.
Only re-read if you need to verify a specific value was written correctly.
Do NOT re-read the full file to "confirm" — use targeted line range.

---

## Strategy 6: No Redundant Output

- Do NOT restate what a file contains after reading it
- Do NOT summarize tool results before acting on them
- Do NOT re-explain the design system if AGENTS.md already defines it
- Proceed directly from information to action

---

## Strategy 7: Plan Multi-File Edits Upfront

Before touching multiple files:
1. List ALL files that need changes
2. Read all of them (targeted) in one batch
3. Execute all edits sequentially
4. Verify once at the end

This avoids the read → edit → read → edit loop.

---

## Mosen-Specific Shortcuts

### Finding a component's props
```
grep_search("interface.*Props", src/components/TargetComponent.tsx, MatchPerLine=true)
```

### Finding all Firestore writes
```
grep_search("setDoc\|addDoc\|updateDoc", Includes=["*.tsx","*.ts"])
```

### Finding which page uses a route
```
grep_search("pathname", src/app/layout.tsx, StartLine=1, EndLine=80)
```

### Checking if a type exists before creating it
```
grep_search("interface NewType", src/types.ts)
```
