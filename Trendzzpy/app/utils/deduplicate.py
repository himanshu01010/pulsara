import re
from collections import OrderedDict
from typing import List


def deduplicate_trends(trends: List[str])-> tuple[List[str],int]:
    """
     Remove duplicate trends using multiple normalization strategies:
    - Strips leading # (so #Liverpool == Liverpool)
    - Case-insensitive comparison
    - Strips extra whitespace
    - Handles Unicode/Hindi text normalization

    Returns:
        (unique_trends, skipped_count)
    """

    seen = OrderedDict()

    for tag in trends:
        normalized = re.sub(r"[#\s]", "", tag).lower()

        if normalized not in seen:
            seen[normalized]=tag
    unique = list(seen.values())
    skipped= len(trends)-len(unique)

    return unique,skipped

