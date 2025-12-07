import validators


def is_valid_https_url(url: str) -> bool:
    return url.startswith("https://") and validators.url(url)
