"""Type stubs for google.generativeai"""

from typing import Any, Dict, List, Optional, Union

class GenerativeModel:
    def __init__(
        self, 
        model_name: str,
        generation_config: Optional[Dict[str, Any]] = None,
        safety_settings: Optional[Dict[str, Any]] = None,
        tools: Optional[List[Any]] = None
    ) -> None: ...
    
    async def generate_content_async(self, prompt: Union[str, List[str], Dict[str, Any]]) -> Any: ...
    def generate_content(self, prompt: Union[str, List[str], Dict[str, Any]]) -> Any: ...

def configure(api_key: str) -> None: ... 