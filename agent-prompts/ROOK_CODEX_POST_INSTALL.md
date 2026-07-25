You're helping me finish setting up Rook (the Rhino + Grasshopper plugin) right
after installing it. Run these checks in order, then clean up and report. Don't
mark a step PASS without showing me the tool output.

1. MCP connection — confirm the Rook tools are available (rhino_ping, gh_status). If
   your client can't list MCP servers, just try calling rhino_ping. If no rook tools
   exist at all, the config isn't registered (the installer writes it; I may just
   need to restart you). A small tool count is not a failure on its own — some
   profiles advertise a compact set.
2. Rhino — make sure Rhino 8 is running, then call rhino_ping; expect "pong", then
   call rhino_sessions and confirm exactly one instance is bound. If ping fails:
   Rhino isn't running; the RookNative plugin didn't load (I can run ShowRookChat in
   Rhino to check); or the discovery file is stale — restarting Rhino rewrites it.
   If it HANGS rather than failing, Rhino is showing a modal dialog — tell me to
   switch to the Rhino window and dismiss it. Don't use keyboard automation.
3. Geometry round-trip — call rhino_document first and tell me the units and object
   count, and warn me if the document already has work in it. Then create a red
   sphere at the origin, radius 5 in document units, and list the document objects
   to confirm it exists.
4. Grasshopper — call gh_status. If it comes back available: false saying the
   Grasshopper assembly isn't loaded, that only means Grasshopper isn't open — ask
   me to open it and retry rather than marking this FAILED. Once it reports
   available, tell me the version and canvas state and take a canvas snapshot.
5. Skills — confirm the curated Rook skills are installed (under ~/.codex/skills)
   and that AGENTS.md guidance is present. You should have the 11 user skills:
   design-grasshopper, plan-grasshopper, execute-grasshopper, chirp, chirp-cascade,
   design-road, masterplan-roads, capture-convention, clean-layers, project-setup,
   twisted-column. If any are missing, tell me to re-run the Rook installer with
   Codex support.
6. Clean up — delete the test sphere you created (and any test layer), then confirm
   the object count matches what you reported in step 3, so my document is left
   exactly as it was.
7. Report — a short PASS/FAIL for each step; for any FAIL, the most likely cause and
   fix.
