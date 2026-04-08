def process_task(operation: str, input_text: str) -> str:
    """
    Example operations:
    - uppercase
    - reverse
    - lowercase
    You can extend this with actual AI operations later.
    """
    if operation == "uppercase":
        return input_text.upper()
    elif operation == "lowercase":
        return input_text.lower()
    elif operation == "reverse":
        return input_text[::-1]
    elif operation == "wordcount":
        return str(len([w for w in input_text.split() if w]))
    else:
        return f"Unknown operation: {operation}"
