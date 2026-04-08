import os
import re
from pathlib import Path


IMAGES = (
    "ritik799/ai-task-processing-platform-frontend",
    "ritik799/ai-task-processing-platform-backend",
    "ritik799/ai-task-processing-platform-worker",
)


def _update_tags_in_kustomization(path: Path, new_tag: str) -> bool:
    original = path.read_text(encoding="utf-8")

    text = original
    for image in IMAGES:
        # Update the `newTag:` that belongs to the matching `newName: <image>` block.
        pattern = rf"(?ms)(^\s*-\s*name:\s*{re.escape(image)}\s*$.*?^\s*newName:\s*{re.escape(image)}\s*$.*?^\s*newTag:\s*)(\S+)\s*$"
        text, count = re.subn(pattern, rf"\g<1>{new_tag}", text)
        if count == 0:
            raise RuntimeError(f"{path}: could not find image block for {image}")

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    repo_root = Path(os.environ.get("INFRA_REPO_ROOT", ".")).resolve()
    tag = os.environ.get("IMAGE_TAG")
    if not tag:
        raise SystemExit("IMAGE_TAG env var is required")

    prod = repo_root / "infrastructure" / "kubernetes" / "overlays" / "prod" / "kustomization.yaml"
    staging = repo_root / "infrastructure" / "kubernetes" / "overlays" / "staging" / "kustomization.yaml"

    changed = False
    if prod.exists():
        changed = _update_tags_in_kustomization(prod, tag) or changed
    if staging.exists():
        changed = _update_tags_in_kustomization(staging, tag) or changed

    if not changed:
        print("No changes needed.")


if __name__ == "__main__":
    main()

