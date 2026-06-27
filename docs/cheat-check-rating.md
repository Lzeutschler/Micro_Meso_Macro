# Cheat-Check LLM Rating

This project uses the Cheat-Check method to score games on Micro, Meso, and Macro.

The core question is:

> Which cheat would most completely break this game and make it trivial?

The rating script is:

```powershell
npm.cmd run rate:games -- --dry-run --limit=5
```

To call OpenRouter, set an API key first:

```powershell
$env:OPENROUTER_API_KEY="..."
npm.cmd run rate:games -- --limit=20
```

Useful options:

- `--dry-run`: show selected games, schema, and output path without using the API.
- `--print-prompt`: print the full system prompt and one game prompt.
- `--ids=counter-strike-2,rocket-league`: assess specific games.
- `--limit=all`: assess every unassessed game.
- `--include-existing`: reassess games already present in `llm-game-assessments.json`.
- `--model=google/gemini-3.1-flash-lite`: choose another OpenRouter model.
- `--out=src/lib/llm-game-assessments.json`: choose another output file.

Default model:

```text
google/gemini-3.1-flash-lite
```

The script writes assessments to:

```text
src/lib/llm-game-assessments.json
```

The app automatically applies those assessments over the demo scores in `games.ts` and `imported-games.json`.
Each assessment keeps the model, method version, confidence, rationale, dimension evidence, anchor matches, and review flags.

The prompt is calibrated from the video examples:

- Pure Micro: osu!, Geometry Dash, Aim Lab / aim trainers, Tetris.
- Pure Meso: Rock Paper Scissors, Among Us, Liar's Bar, stock market.
- Pure Macro: Factorio, Poly Bridge, Connect 4, Tic-Tac-Toe.
- Micro + Macro: Rubik's Cube, speedrunning, Jump King, Getting Over It, Elden Ring, 8-Ball Pool.
- Micro + Meso: fighting games, Mario Kart, Tetris 99, Fall Guys, Gang Beasts.
- Meso + Macro: Hearthstone, Teamfight Tactics, Pokemon VGC, Battleship, human-level Chess, Balatro, Phasmophobia.
- Tri-Core: League of Legends, Dota 2, CS2, Valorant, Overwatch, Marvel Rivals, Rocket League, Apex Legends, Rainbow Six Siege, World of Warcraft.

LLM output should still be treated as an assessment pass, not final truth. Human-reviewed entries can be marked later with `reviewStatus: "human-reviewed"`.
