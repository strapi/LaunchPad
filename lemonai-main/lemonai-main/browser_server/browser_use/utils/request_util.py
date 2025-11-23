from pydantic import BaseModel, Field, ValidationError
from fastapi import Request, HTTPException
from typing import Optional,Required

"""
Standard TaskRequest
"""
class TaskRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    llm_config: dict = Field(..., description="include model_name, api_key, api_url")
    conversation_id: Optional[str] = Field(None, description="conversation_id")

async def parse_task_json(data: dict):
    """
    Asynchronously parse JSON data from a FastAPI request and convert it into TaskRequest format.
    Supports input JSON data in either TaskRequest or TaskRequest_v2 format.

    Args:
        data (dict): JSON data from the request

    Returns:
        TaskRequest: A parsed and converted TaskRequest instance

    Raises:
        HTTPException: If the JSON data is invalid or model validation fails
    """
    try:
        # Attempt to parse as TaskRequest
        return TaskRequest(**data)
    except ValidationError as e:
        print("[INFO] [agent] TaskRequest validation failed:", e)
        raise HTTPException(status_code=400, detail=f"TaskRequest validation failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(e)}")