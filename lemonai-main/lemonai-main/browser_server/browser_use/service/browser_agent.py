from agent.agent import browser_agent
from config.load_config import config
from browser.browser import browser_factory
import uuid
from datetime import datetime
from typing import Dict, Optional
from browser_use.agent.views import AgentHistoryList
from typing import Optional

class BrowserAgentManager:

    def __init__(self):
        self.browser_session = browser_factory.create_shared_session(headless=True)
        pass

    async def run_task_only(self, task: str, model: str, api_key: str, base_url: str,conversation_id:Optional[str] = None) -> str:
        try:
            uid = str(uuid.uuid4())
            agent = browser_agent.get_agent(task=task,model=model,api_key=api_key,base_url=base_url,browser_session = self.browser_session,conversation_id=conversation_id)
            history = await agent.run(max_steps=config['agent']['max_steps'])
            if len(self._format_history(history))!=0:
                result = self._format_history(history)
            else:
                result = [
                    self._get_null_response_result(model=model)
                ]
                
            # the run task only return the last result of history
            print(f"[INFO]    [user]✅ task finished:{task};history summary:\n {self._format_history(history=history)}",end="\n\n")
            total_duration_seconds = history.total_duration_seconds()
            total_input_tokens = history.total_input_tokens()
            is_successful = history.is_successful()
            is_done = history.is_done()
            number_of_steps = history.number_of_steps()
            return {
                "uid": uid,
                "task": task,
                "status": "finished",
                "time": datetime.now().strftime("%Y%m%d%H%M%S"),
                "total_duration_seconds":total_duration_seconds,
                "total_tokens":total_input_tokens,
                "is_successful":is_successful,
                "is_done":is_done,
                "final_browser_result": self._get_final_result(history=history),
                "number_of_steps":number_of_steps,
                "history_all_info": self._get_all_info_history(history),
                "browser_history":   result,
                "browser_history_screenshot": history.screenshots()
            }
        except ConnectionError as e:
            raise e # return directly
        except Exception as e:
            print(f"[ERROR]    [user]❌ task failed:{task};error:{str(e)}",end="\n\n")
            return {
                "uid": uid,
                "task": task,
                "status": "Error",
                "time": datetime.now().strftime("%Y%m%d%H%M%S"),
                "total_duration_seconds": -1,
                "total_tokens": -1,
                "is_successful":False,
                "is_done":False,
                "final_browser_result": None,
                "number_of_steps": -1,
                "history_all_info": None,
                "browser_history":  self._get_null_response_result(model=model,error=str(e)),
                "browser_history_screenshot": []
            }

    @staticmethod
    def _format_history(history : AgentHistoryList ):
        extracted_content = history.extracted_content()
        urls = history.urls()
        errors = history.errors()
        result = []
        model_outputs = history.model_outputs()
        for i in range(len(model_outputs)):
            try:
                url = urls[i]
            except IndexError:
                url = None
            try:
                error = errors[i]
            except IndexError:
                error = None
            try: 
                model_outputs_single = model_outputs[i]
                current_model_outputs = None
                if model_outputs_single.action[-1].done is not None:
                    current_model_outputs = "task finised,the final result:" + model_outputs_single.action[-1].done.text
                else:
                    current_model_outputs = model_outputs_single.current_state.evaluation_previous_goal
            except IndexError:
                current_model_outputs = error
            extracted_content_single = extracted_content[i]
            if len(extracted_content[i]) >= config['agent']['max_extracted_content_length']:
                extracted_content_single = None # to long will be set to None
            result.append({
                "browser_status":current_model_outputs,
                "extracted_content":extracted_content_single,
                "url":url,
                "error": error
            })
        return result
    @staticmethod
    def _get_all_info_history(history:AgentHistoryList):
        action_names = history.action_names()
        model_thoughts = history.model_thoughts()
        model_outputs = history.model_outputs()
        model_actions = history.model_actions()
        action_results = history.action_results()
        model_actions_filtered = history.model_actions_filtered()
        return {
            "action_names":action_names,
            "model_thoughts":model_thoughts,
            "model_outputs":model_outputs,
            "model_actions":model_actions,
            "action_results":action_results,
            "model_actions_filtered":model_actions_filtered
        }
    @staticmethod
    def _get_final_result(history:AgentHistoryList):
        if history.is_done():
            try:
                result = history.last_action()['done']['text']
                return result
            except Exception:
                return 'The task failed ❌,browser tool seems something wrong,do not retry this task'
        else:
            return None
    @staticmethod
    def _get_null_response_result(model,error=""):
        return{
            "browser_status": 'Error',
            "extracted_content":f"The task failed ❌,browser tool seems something wrong,do not retry this task,current agent llm:{model}",
            "url":"",
            "error": error
        }


    
browser_agent_manager = BrowserAgentManager()





    


