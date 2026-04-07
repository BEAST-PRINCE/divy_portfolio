import json
import os
import time
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional


_CACHE: Dict[str, Any] = {"ts": 0.0, "data": None}
_CACHE_TTL_SECONDS = 6 * 60 * 60  # 6 hours


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

    filtered: List[Dict[str, Any]] = []
    for repo in repos:
        # Skip forks to keep the portfolio clean.
        if repo.get("fork"):
            continue
        if repo.get("archived"):
            continue

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

