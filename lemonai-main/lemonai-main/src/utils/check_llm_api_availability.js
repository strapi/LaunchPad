async function checkLlmApiAvailability(baseUrl, apiKey='', model) {
  if (!baseUrl) {
    return { status: false, message: 'Base URL is required.' };
  }
  const api_url = baseUrl + '/chat/completions'
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // API key is usually passed as Bearer
      },
      body: JSON.stringify({
        // This is a simple example request body for the OpenAI Chat Completion API
        // **Important: Adjust according to your actual LLM API documentation**
        model: model, // Replace with the model name you are testing
        messages: [{
          role: "user",
          content: "hello" // A simple request content for testing
        }],
        max_tokens: 5, // Send a very small request to minimize resource usage and response time
        enable_thinking:false
      }),
      signal: controller.signal
    });

    if (response.ok) { // HTTP status code in the 200-299 range
      const data = await response.json();
      // Further check the response data, e.g., whether expected fields or error info exist
      // Different LLM API responses may vary, adjust as needed
      if (data && data.choices && data.choices.length > 0) {
        return { status: true, message: 'LLM API call succeeded.' };
      } else {
        return { status: false, message: 'LLM API call succeeded, but response data is not as expected.' };
      }
    } else {
      const errorText = await response.text();
      return { status: false, message: `LLM API call failed, HTTP status: ${response.status}, error: ${errorText}` };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { status: false, message: `LLM API call timed out: ${error.message}` };
    } else {
      return { status: false, message: `Network or other error occurred during LLM API call: ${error.message}` };
    }
  }
}

module.exports = exports = checkLlmApiAvailability;