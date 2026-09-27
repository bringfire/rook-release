---
title: Post-Install Agent Setup
description: A deeper end-to-end test for Claude or ChatGPT — it creates one test object in Rhino, checks it, removes it, and reports.
sidebar:
  order: 4
---

The [connection check](/rook-release/start/setup-verify/) only reads from Rhino.
This test goes one step further: it creates a small test sphere, confirms it
exists, then deletes it, which proves Rook can change your model as well as read
it. It works the same in Claude and in the ChatGPT desktop app.

Run it in an empty or saved model. Your app will ask before the create and delete
steps; choose **Allow once** for those (see
[Choosing approvals](/rook-release/start/setup-verify/#choosing-approvals)).

:::tip[Paste this to your assistant]
```text
You're helping me finish setting up Rook (the Rhino + Grasshopper plugin). Run these checks in order, then clean up and report. Use only the Rook tools; never use any screen-control, computer-use or Windows-control tool. Don't mark a step PASS without showing me the tool output.
1. Connection: call rhino_ping and expect "pong". If it fails, Rhino may not be running, or Rook may not have loaded in it (I can type ShowRookChat in Rhino to check). If the call hangs, Rhino is showing a dialog: tell me to switch to Rhino and close it.
2. Rhino sessions: call rhino_sessions and confirm exactly one Rhino window is available.
3. Before touching anything: call rhino_document and tell me the units and object count. Warn me if the model already has work in it, and wait for my go-ahead if it does.
4. Round trip: create a red sphere at the origin with radius 5 (document units), then list the objects to confirm it exists. Note the new object's ID.
5. Grasshopper: call gh_status. If Grasshopper isn't open, ask me to open it and try again instead of marking this FAILED. Once it's available, report its version and take a canvas snapshot with gh_snapshot.
6. Skills: list the Rook skills you have. I expect nine: capture-convention, chirp, chirp-cascade, clean-layers, design-grasshopper, execute-grasshopper, plan-grasshopper, project-setup, twisted-column. If they're missing, don't try to install anything; tell me which step on the Rook install page adds them for my app.
7. Clean up: delete only the sphere you created, by its ID, and confirm the object count is back to the number from step 3.
8. Report: a short PASS/FAIL for each step, and for any FAIL, the most likely cause and the fix in plain words, without asking me to use a terminal.
```
:::

If anything fails, the
[troubleshooting prompt](/rook-release/start/setup-verify/#3-if-something-fails)
reads Rook's logs and tells you what to fix.

→ Next: [Your First Conversation](/rook-release/start/first-conversation/)
