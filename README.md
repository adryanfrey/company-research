# Engineering Assignment

Your task is to enhance a small app that allows users to ask qualifying questions about a given company. 
Your final submission should adhere to the design language of the [Venta AI application](https://app.getventa.ai) and feature a functioning company research tool.
The starting repository contains a basic UI with a mocked-up backend.


## Objectives

Your solution should showcase your ability to:
- Write clean, maintainable, and well-documented code.
- Develop a high-quality and user-friendly interface following our design language.
- Implement efficient logical structures and data handling.

## Tasks

### 1. UI Improvements  
- Improve the look and feel of the provided UI and follow the visual style of the [Venta AI application](https://app.getventa.ai) (a login is not possible)
- Add validation of user input (valid website URL and at least one question entered)
- Use the [Mantine component library](https://mantine.dev)


### 2. Research Tool  
- Implement the **basic** functionality of the provided mock function
- Your function should retrieve the content of the url provided by the user. 
- You may want to use OpenAI's [WebSearch Tool](https://platform.openai.com/docs/guides/tools-web-search?api-mode=responses).
- Your function should then call an OpenAI model (such as GPT-4.1-mini) and retrieve the answer to the user's question
> Please be aware that this can be quite a rabbit hole. It's okay to keep things simple here and it's fine if there are some edge cases remaining that are not handled. Ideally you are aware of them and can tell us about the limitations of your solution


## Technical Guidelines

- Use the provided repository as your starting point. It was intialized with Remix. [Remix docs](https://remix.run/docs)
- You can import additional libraries if needed.
- Use the OpenAI SDK for the interactions with the LLM.
> Note: You will need an OpenAI API Key to consume the OpenAI models. If you don't have one / can't / don't want to set up an account with OpenAI, please reach out to us and we will provide you with an API key. Generally, make sure to use a cheap model in development (eg. GPT-4.1-mini).
- To set up and run the backend use:
```shell
# Create a virtual environment
cd api
python3 -m venv .venv
source .venv/bin/activate

# Make sure pip is up to date
python -m pip install --upgrade pip
# Install dependencies from pyproject.toml
python -m pip install -e .

# Run the FastAPI dev server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- To run the frontend use 
```shell
cd web
npm run dev
```

## Evaluation Criteria

Your solution will be evaluated on the following:

1. **Code Quality**  
   - Clean, modular code structure
   - Correct typing in TypeScript and Python
   - Error handling and minimal documentation

2. **UI/UX Implementation**  
   - Design fidelity
   - Feature richness and usability
   - Relevant and intuitive form validation
   - Smooth, responsive, and intuitive interactions


## Submission Guidelines

1. Create a new repository from this template to your private GitHub account. 
2. Make sure the repository is **private**.  
3. Invite the following user to access your submission:  
   - `budg`
   - `sebammon`

## Expectations
We expect you to spend approximately **2 - 3 hours** on this challenge, focusing on the most relevant aspects of the tasks described above. 
While you’re welcome to invest more time if you choose, it is **not required**. 
You are encouraged to **prioritize** specific areas of the challenge based on your strengths and time availability. 
Typically, you will have until **the end of the next weekend** to submit your solution. 
If you have any questions or need clarification at any point, please don’t hesitate to reach out to us. 
To review your submission, we will schedule a **45-minute follow-up call**. 
During this session, you’ll have the opportunity to walk us through your implementation, and we’ll ask a few technical questions to better understand your approach. 
If you already have a review call scheduled, please submit your solution at least before 16:00 the day before the call.
