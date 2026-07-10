---
name: tradiva-onboarding
description: Onboarding instructions and guidelines for any AI agent working on the TraDiva project.
---

# TraDiva Onboarding Instructions

Welcome to the **TraDiva** project. Before you write any code or make changes, you MUST read these four files:

1. **[AGENTS.md](file:///c:/projects/TraDiva/AGENTS.md)**: Rules, principles, definition of done, and code quality standards.
2. **[DESIGN.md](file:///c:/projects/TraDiva/DESIGN.md)**: UI/UX styles, typography, spacing, colors, and layout guidelines based on Miro's design language.
3. **[context.md](file:///c:/projects/TraDiva/context.md)**: Decision logs, architectural definitions, and development history.
4. **[TRACKER.MD](file:///c:/projects/TraDiva/TRACKER.MD)**: The granular milestone tracker showing what has been done and what needs to be worked on next.

## Core Rules for Agents
* **Granular Commit Strategy**: Implement features in tiny steps as outlined in `TRACKER.MD`. Make a Git commit after completing each sub-milestone task. Do not lump tasks together.
* **Ponytail Philosophy**: Adhere to YAGNI. Write clean, direct code. Use the standard library or built-in Next.js/React APIs before installing new packages. Add `// ponytail: [ceiling and upgrade path]` comments when making deliberate simplifications.
* **Keep Logs Updated**: Update `TRACKER.MD` and `context.md` as you make progress or pivot on architecture.
* **No Unverified Assumptions**: If requirements are unclear, ask the user.
