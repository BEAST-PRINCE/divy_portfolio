import json
import os
import time
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional


_CACHE: Dict[str, Any] = {"ts": 0.0, "data": None}
_CACHE_TTL_SECONDS = 6 * 60 * 60  # 6 hours
_PINNED_REPOS = [
    "Cryptocurrency_price_prediction",
    "Python_Music_Player",
    "Fire_Chat",
    "Project_Portfolio",
    "Python_Text_Editor",
    "Ballot_system",
]


def _fetch_github_json(url: str) -> Any:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "django-portfolio",
            "Accept": "application/vnd.github+json",
        },
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        body = resp.read().decode("utf-8")
        return json.loads(body)


def get_featured_projects(username: str, count: int = 6) -> List[Dict[str, Any]]:
    """
    Fetch top GitHub repositories for a user (sorted by stars).

    Returns a list of dicts safe to render directly in the UI.
    """

    now = time.time()
    if _CACHE["data"] is not None and (now - float(_CACHE["ts"])) < _CACHE_TTL_SECONDS:
        cached = _CACHE["data"]
        # Cache is keyed by user in-memory; if username changes, refresh.
        if cached.get("username") == username:
            return cached.get("projects", [])[:count]

    url = (
        f"https://api.github.com/users/{username}/repos"
        f"?per_page=100&sort=stars&direction=desc"
    )

    try:
        repos = _fetch_github_json(url)
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError):
        return []

    if not isinstance(repos, list):
        return []

    repo_map: Dict[str, Any] = {}
    for repo in repos:
        if not isinstance(repo, dict):
            continue
        repo_name = repo.get("name")
        if repo_name:
            repo_map[repo_name] = repo

    prioritized_repos: List[Dict[str, Any]] = []

    # First, add pinned projects in profile order.
    for pinned_name in _PINNED_REPOS:
        repo = repo_map.get(pinned_name)
        if not repo:
            continue
        if repo.get("fork") or repo.get("archived"):
            continue
        prioritized_repos.append(repo)

    # Then fill remaining with other repos by stars.
    for repo in repos:
        # Skip forks to keep the portfolio clean.
        if repo.get("fork"):
            continue
        if repo.get("archived"):
            continue
        if repo.get("name") in _PINNED_REPOS:
            continue
        prioritized_repos.append(repo)

    filtered: List[Dict[str, Any]] = []
    for repo in prioritized_repos:
        filtered.append(
            {
                "title": repo.get("name") or "",
                "description": repo.get("description") or "",
                "tech_stack": [repo.get("language")] if repo.get("language") else [],
                "github_url": repo.get("html_url") or "",
            }
        )

    # Safety: slice top "count" even if sorting changes.
    filtered = filtered[: max(0, int(count))]

    _CACHE["ts"] = now
    _CACHE["data"] = {"username": username, "projects": filtered}
    return filtered


def get_default_featured_projects(count: int = 6) -> List[Dict[str, Any]]:
    username = os.getenv("GITHUB_USERNAME", "BEAST-PRINCE")
    return get_featured_projects(username=username, count=count)

