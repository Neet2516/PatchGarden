# Verified Facts — PatchGarden

> **Last Updated:** 2026-10-25

This file records facts that have been empirically verified and do not need re-investigation unless the environment changes.

---

## Environment

| Fact | Value | Verified By | Date |
|------|-------|------------|------|
| OS | Windows 11, PowerShell | `$PSVersionTable` / `$env:OS` | 2026-10-25 |
| Node.js | v24.16.0 | `node --version` → `v24.16.0` | 2026-10-25 |
| npm | 11.13.0 | `npm --version` → `11.13.0` | 2026-10-25 |
| Python | 3.12.11 | `python --version` → `Python 3.12.11` | 2026-10-25 |
| SQLite | 3.50.1 | `sqlite3 --version` | 2026-10-25 |
| Git | 2.49.0.windows.1 | `git --version` | 2026-10-25 |
| Docker | 29.8.2 | `docker --version` | 2026-10-25 |
| Ollama | NOT natively installed | `ollama --version` → CommandNotFoundException | 2026-10-25 |

## Repository

| Fact | Value | Verified By | Date |
|------|-------|------------|------|
| Remote URL | https://github.com/Neet2516/new-repo.git | `git remote -v` | 2026-10-25 |
| Branch | main | `git status` | 2026-10-25 |
| Initial commit | c0cd73e "Initial commit" | `git log --oneline -5` | 2026-10-25 |
| Existing files | LICENSE (MIT, Navneet Sinha 2026) | `ls` | 2026-10-25 |
| Git user | Neet2516 / getneet.25@gmail.com | `git config user.name/email` | 2026-10-25 |

## Unverified (To Be Confirmed)

| Fact to Verify | How to Verify |
|---------------|--------------|
| Ollama Docker image pulls successfully | `docker pull ollama/ollama` |
| Gemma 3 4B model available in Ollama | `docker exec ollama ollama pull gemma3:4b` |
| Temporal Docker image starts correctly | `docker-compose up temporal` |
| Sentry SDK supports Agent Tracing in Node.js | npm install + review changelog |
| Render supports Docker services | Render dashboard |
