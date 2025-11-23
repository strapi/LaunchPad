# base import 
from browser_use import BrowserSession,BrowserProfile
from browser_use.browser.browser import Browser, BrowserConfig
from config.load_config import config



class BrowserFactory():
    def __init__(self):
        self.user_agent = config['browser']['user-agent']
        self.browser_profile_alive = self._get_browser_profile()

    def create_shared_session(self,headless=True,*args):
        return BrowserSession(
            headless=headless,
            browser_profile=self.browser_profile_alive,
            user_data_dir= None ,# config['browser']['user_data_dir'],
            *args
        )
    
    def _get_browser_profile(self):
        return BrowserProfile(
                    headless=False,
                    wait_for_network_idle_page_load_time=3.0,
                    viewport={"width": 1280, "height": 1100},
                    user_agent=self.user_agent,
                    highlight_elements=False, # off highlight
                    viewport_expansion=500,
                    keep_alive=False,
                    chromium_sandbox = False, # must be false if using docker as root 
                )


browser_factory = BrowserFactory()

