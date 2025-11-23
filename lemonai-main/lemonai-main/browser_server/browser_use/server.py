import datetime
import os
from fastapi import FastAPI, Request,HTTPException
from service.browser_agent import browser_agent_manager
from config.load_config import config
from utils.response_util import create_response
from utils.request_util import parse_task_json

def init():
    #  must be set OPENAI_API_KEY ENV
    os.environ["OPENAI_API_KEY"] = ""
    # SKIP_LLM_API_KEY_VERIFICATION = true  ;this will skip the api key verification
    # os.environ["SKIP_LLM_API_KEY_VERIFICATION"] = 'true' 
    # print(os.environ)
    return
    
app = FastAPI()

@app.post("/api/browser/task")
async def browser_task(request: Request):
    start_time = datetime.datetime.now()
    try:
        data = await request.json()
        print("[INFO]    [agent] Recevied request data:\n", data)
        task = await parse_task_json(data)
        llm_config = task.llm_config
        # try:
        history = await browser_agent_manager.run_task_only(
            task.prompt,
            model=llm_config["model_name"],
            api_key=llm_config["api_key"],
            base_url=llm_config["api_url"],
            conversation_id=task.conversation_id,
        )
        end_time = datetime.datetime.now()
        response = create_response(
            200,
            "Task Finished",
            {
                "time": datetime.datetime.now().isoformat(),
                "time_cost": (end_time - start_time).total_seconds(),
                "history": history
            },
        )
        return response
    except ConnectionError as e:
        return HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print("[ERROR]     Exception:",e)
        return HTTPException(status_code=400, detail=str(e))
        

    

if __name__ == "__main__":
    import uvicorn
    init()
    uvicorn.run(app, host=config['server']['host'], port=config['server']['port'])