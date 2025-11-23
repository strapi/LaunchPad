

def create_response(code: int, message: str, data: dict) -> dict:
    return {"code": code, "message": message, "data": data}