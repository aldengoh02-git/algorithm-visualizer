#framework that creates web server
from fastapi import FastAPI
#allows react frontend to talk to python backend 
from fastapi.middleware.cors import CORSMiddleware
#defines exactly what shape of data we expect from frontend
from pydantic import BaseModel
#import anthropic pyhton sdk(how we talk to claude)
import anthropic
#reads environment variables
import os
#reads .env file and loads variables on environment so os.getenv() can access them
from dotenv import load_dotenv

load_dotenv() #call load_dotenv() to read .env file at startup

print("API KEY LOADED:", os.getenv("ANTHROPIC_API_KEY"))

app = FastAPI() #create FastAPI app(main object that handles all routes)

# Create the Anthropic client using our API key from the .env file
# os.getenv("ANTHROPIC_API_KEY") reads the value we set in .env
# This client is what we use to send messages to Claude
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Set up CORS - we're telling the server to accept requests from our 
# React dev server running on localhost:5173
# allow_methods=["*"] means accept GET, POST, PUT, DELETE etc
# allow_headers=["*"] means accept any headers the browser sends
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://algorithm-visualizer-lake-seven.vercel.app"
        ],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Define the shape of data we expect from the frontend when it calls /api/tutor
# This is like a contract - if the frontend sends the wrong shape, FastAPI 
# automatically returns a helpful error message
class TutorRequest(BaseModel):
    # Which algorithm is being visualized e.g. "Bubble Sort"
    algorithm: str
    # Which step the user is currently on e.g. 3
    step: int
    # Total number of steps in this algorithm run e.g. 20
    total_steps: int
    # The current array state e.g. [3, 1, 4, 1, 5, 9]
    state: list
    # Optional - if the user typed a question, it comes through here
    # The | None = None means this field is not required
    user_question: str | None = None

# This is a GET route - when someone visits http://localhost:8000/ 
# it returns this JSON response, just to confirm the server is running
@app.get("/")
def root():
    return {"status": "Algorithm Visualizer API is running"}

# This is our main POST route - the React frontend calls this endpoint
# every time it wants Claude to explain a step or answer a question
# async means this function can handle multiple requests at the same time
@app.post("/api/tutor")
async def tutor(req: TutorRequest):
    # Build the prompt we're going to send to Claude
    # We inject the algorithm name, step numbers, and array state
    # so Claude has full context about what the user is looking at
    prompt = (
        # Tell Claude what role to play
        f"You are a computer science tutor helping a student understand algorithms visually. "
        # Tell Claude exactly where the user is in the visualization
        f"The student is watching step {req.step} of {req.total_steps} of {req.algorithm}. "
        # Give Claude the actual data the user is looking at
        f"The current array state is: {req.state}. "
        # If the user asked a question, answer it - otherwise give a default explanation
        f"{'Answer this question: ' + req.user_question if req.user_question else 'Explain what just happened in this step in 2-3 simple sentences.'}"
    )

    # Send the prompt to Claude using the Anthropic SDK
    # model is which version of Claude to use
    # max_tokens limits how long the response can be (300 = short explanation)
    # messages is the conversation - just one user message here
    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )

    # Claude's response comes back as a list of content blocks
    # content[0].text gets the text from the first (and only) block
    # We wrap it in a dict so it returns as clean JSON to the frontend
    return {"explanation": message.content[0].text}