import argparse
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

# --- Argument Parsing ---
# Sets up how we can provide input to the script from the command line.
argparser = argparse.ArgumentParser(description="Chat with an OpenAI compatible model.")
argparser.add_argument("--model", type=str, default="", help="The model to use.")
argparser.add_argument("--api_key", type=str, default="", help="Your API key.")
argparser.add_argument("--base_url", type=str, default="", help="The base URL for the API.")

if __name__ == "__main__":
    args = argparser.parse_args()
    print("--- Running with the following arguments ---")
    print(args)
    print("------------------------------------------")

    try:
        # --- Language Model Initialization ---
        # Here we create an instance of the ChatOpenAI class.
        llm = ChatOpenAI(
            model=args.model,
            api_key=args.api_key,
            base_url=args.base_url,
            # streaming=False,  # We are making a single, non-streaming request.
            # stream_usage=False,
            extra_body={"enable_thinking": False},
            # This is the corrected line.
            # The DashScope API requires 'enable_thinking' to be false for non-streaming calls.
            # We pass this model-specific argument using model_kwargs.
            # model_kwargs={"enable_thinking": False}
            # enable_thinking=False

        )

        # --- Invoking the Model ---
        # We send a message to the model and wait for the complete response.
        print("\nSending prompt to the model...")
        response = llm.invoke([HumanMessage(content="what is the capital of France?")])
        
        # --- Printing the Response ---
        print("\n--- Model Response ---")
        print(response.content)
        print("----------------------")

    except Exception as e:
        print(f"\nAn error occurred: {e}")