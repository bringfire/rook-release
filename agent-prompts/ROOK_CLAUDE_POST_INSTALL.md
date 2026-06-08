You're helping me finish setting up Rook (the Rhino + Grasshopper plugin) right
after installing it. Run these checks in order, then clean up and report.

1. MCP connection — list your MCP servers or inspect your available MCP tools (if
   your client can't list servers, just try rhino_ping). Confirm "rook" is present
   with a large tool set (nearly 400). If missing, tell me (the installer registers
   it; I may need to restart you).
2. Rhino — make sure Rhino 8 is running, then call rhino_ping; expect "pong". If it
   fails, remind me to start Rhino and that the RookNative plugin must be loaded
   (I can run ShowRookChat in Rhino to check).
3. Geometry round-trip — create a red sphere at the origin, radius 5; then list the
   document objects to confirm it exists.
4. Grasshopper (only if GH is open) — take a canvas snapshot to confirm GH control;
   skip if GH isn't open.
5. Skills — confirm the Rook skills are available (e.g. /design-grasshopper, /chirp,
   /design-road). If they're missing and you can run slash commands, install the
   plugin (otherwise ask me to run these):
       /plugin marketplace add bringfire/rook-release
       /plugin install rook@rook
   then confirm the 11 skills appear.
6. Clean up — delete the test sphere you created (and any test layer) so my document
   is left exactly as it was.
7. Report — a short PASS/FAIL for each step; for any FAIL, the most likely cause and
   fix.
