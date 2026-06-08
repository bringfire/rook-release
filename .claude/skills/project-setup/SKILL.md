---
name: project-setup
description: |
  Bootstrap a user's project directory for Rook by creating or merging a
  CLAUDE.md with Rook agent instructions, then initializing Claude Code
  project config. Use when user mentions: "project setup", "setup project",
  "init project", "bootstrap project", "add Rook to my project",
  "setup CLAUDE.md", "configure project for Rook", or when working in a
  directory that has no Rook context in its CLAUDE.md.
---

# Project Setup

Bootstrap the current project directory so Claude Code has Rook context
when working here. Two actions:

1. **CLAUDE.md** — Create or merge Rook agent instructions
2. **/init** — Initialize Claude Code project configuration

## Prerequisites

- Rook must be installed (MCP server registered in `~/.claude.json`)
- The current working directory should be the user's project folder,
  NOT the Rook install directory (`%LOCALAPPDATA%\Rook`)

## Workflow

### Step 0: Detect State

Check the current directory:

1. What is the current working directory? If it's the Rook install root
   (`%LOCALAPPDATA%\Rook` or the Rook source repo), warn the user:
   "You're already in the Rook directory — this skill is for setting up
   your own project folders. cd to your project first."

2. Does `./CLAUDE.md` exist?
   - **No** → Step 1A (create from template)
   - **Yes** → check if it already contains Rook instructions (search
     for the marker `<!-- rook-begin -->`)
     - **Marker found** → tell user "Rook instructions already present
       in CLAUDE.md" and skip to Step 2
     - **No marker** → Step 1B (merge into existing)

### Step 1A: Create CLAUDE.md (no existing file)

Read the Rook agent instruction template. The canonical source is the
installed copy at `%LOCALAPPDATA%\Rook\CLAUDE.md`. If that doesn't
exist, use the template from the Rook repo at `installer/CLAUDE.md`.

Write a new `./CLAUDE.md` with this structure:

```markdown
<!-- rook-begin -->
{contents of the Rook CLAUDE.md template}
<!-- rook-end -->
```

Tell the user: "Created CLAUDE.md with Rook agent instructions. You can
add your own project-specific notes above or below the Rook section."

### Step 1B: Merge into existing CLAUDE.md

The user already has a CLAUDE.md with their own content. Append the Rook
section at the end:

```markdown

{existing CLAUDE.md content unchanged}

<!-- rook-begin -->
{contents of the Rook CLAUDE.md template}
<!-- rook-end -->
```

**Rules:**
- NEVER modify the user's existing content
- Always append at the end, never prepend
- Use the `<!-- rook-begin -->` / `<!-- rook-end -->` markers so future
  updates can find and replace just the Rook section

Tell the user: "Appended Rook agent instructions to your existing
CLAUDE.md. Your project-specific content is untouched."

### Step 2: Initialize Claude Code config

Check if `.claude/` directory exists in the project:

- **If `.claude/` does not exist:** Tell the user to run `/init` in
  Claude Code to create the project configuration. This sets up the
  `.claude/` directory with settings, allowed tools, etc.

- **If `.claude/` already exists:** Skip this step — project config
  is already initialized.

### Step 3: Confirm

Print a summary:

```
Project setup complete for {directory name}:
  [OK] CLAUDE.md — Rook agent instructions {created / merged}
  [OK] .claude/ — Project config {exists / run /init to create}

Next steps:
  1. Open a Rhino file from this project
  2. In Claude Code, type: rhino_ping
  3. You're connected — Rook knows your project context
```

## Updating Rook Instructions

If the user runs `/project-setup` again in a directory that already has
the Rook markers, replace the content between `<!-- rook-begin -->` and
`<!-- rook-end -->` with the latest template. This lets users update
their Rook instructions after a Rook upgrade without losing their own
CLAUDE.md content.

## Key Principles

- **Never clobber user content.** The markers isolate the Rook section.
  Everything outside the markers belongs to the user.
- **Idempotent.** Running the skill twice should produce the same result
  as running it once (update in place via markers).
- **No Rhino dependency.** This skill runs without Rhino — it's pure
  file operations. Don't call `rhino_ping` or any MCP tools.
