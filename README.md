RouteMate AI 🚌
A student-focused college transportation management platform

RouteMate AI is a web application prototype designed to bring common college commute tasks into one place. It provides a student overview, bus route discovery, commute planning, a schematic bus map, an assistant-style interface, profile editing, and an administrative overview.
Project status and transparency: This repository currently contains a front-end prototype. Route information, bus movement, estimated times, occupancy, and administrative metrics are demonstration data. The assistant is a simulated interface and is not connected to a live language model. The current version does not claim a working NVIDIA Nemotron, Nebius Token Factory, or other Nebius service integration.

🔗 Project links
- Live demo: https://routemate-ai-eight.vercel.app
- Source code: https://github.com/bussireddykrithika/RouteMate-AI
- Video demonstration: https://www.youtube.com/watch?v=0hDHqFWxxfs
✨ Features
Student experience
- Student overview dashboard.
- Bus route discovery with sample route information.
- Commute planner and leave-home planning interaction.
- Schematic route map with simulated moving bus marker.
- Editable profile interface.
Assistant prototype
- In-app conversational assistant interface.
- Demonstrates where transport-related help could be offered.
- Uses prototype/demo responses; it does not currently call an external AI model.
Admin experience
- Administrative overview screen.
- Sample fleet and route summaries.
- Demonstration metrics only; not connected to a live fleet or dispatch system.
🧰 Technology stack
- React — component-based user interface.
- Vite — development server and production build tooling.
- JavaScript — application behaviour.
- HTML — page structure.
- CSS — styling and layout.
- Git and GitHub — version control and source hosting.
- Vercel — hosted front-end deployment.
🚀 Run locally
Prerequisites
Install:
- Node.js (use a current LTS release).
- npm (included with Node.js).
- Git (optional, if cloning the repository).
1. Clone the repository
git clone https://github.com/bussireddykrithika/RouteMate-AI.git
cd RouteMate-AI
2. Install dependencies
npm install
3. Start the development server
npm run dev
Open the local URL printed in the terminal (Vite commonly uses http://localhost:5173).
4. Create a production build
npm run build
Vite writes the production build to the dist directory.
⚙️ Environment variables
The current front-end prototype does not require environment variables or API keys.

Do not add private API keys to client-side source code. If an AI model or external data service is integrated in a future version, requests that use secret credentials should be handled by a secure server-side component.
🤖 NVIDIA Nemotron and Nebius integration status
Status: Not integrated in the current version.

The current RouteMate AI assistant is a simulated front-end prototype. This repository does not currently make runtime requests to NVIDIA Nemotron, Nebius Token Factory, or another Nebius AI service. No model variant, inference endpoint, GPU instance, or Token Factory workflow is claimed as used.
Planned integration (not yet implemented)
A future version could connect the assistant to an NVIDIA Nemotron model through an authorized inference endpoint. The planned work would include:
1. Selecting an available Nemotron model and confirming its access requirements.
2. Calling the model from a secure server-side endpoint rather than exposing credentials in the browser.
3. Supplying verified route and service information as context.
4. Testing the assistant for accuracy, instruction-following, uncertainty handling, and safe responses.
5. Documenting the actual model identifier, API endpoint, configuration, evaluation results, and Nebius services used.
This section is a plan, not evidence of completed integration. It should be updated only after the integration has been implemented and tested.
🗺️ Simulation and limitations
The current application is intended for demonstration and evaluation of the interface concept.
- The bus map and moving marker are simulated; they do not show a real vehicle location.
- Route information, estimated times, occupancy, fleet counts, and admin metrics are sample values.
- The assistant uses demo behaviour and does not provide live AI-generated answers.
- The current prototype is not connected to a transport operator, GPS devices, a production database, or a dispatch system.
- It should not be used to make real-world travel or operational decisions.
🔒 Privacy and security
The current prototype does not provide a production authentication or transport-data backend. A production implementation should add secure authentication, role-based authorization, server-side validation, protected storage, and appropriate privacy controls before handling real student or vehicle-location data.
📄 License
License status: Confirm the repository's actual LICENSE file before selecting or claiming a licence here.

If the repository's existing licence is an OSI-approved licence, retain that exact licence and reproduce its name here. Do not replace it with a different licence unless you intend to relicense the project and have the rights to do so.

For reference, the Open Source Initiative maintains the list of approved licences:
https://opensource.org/licenses
🙌 Acknowledgements
RouteMate AI was developed as an independent project. AI-assisted tools were used for development guidance and documentation support. The specific technologies and integrations described above reflect the current implementation; planned work is labelled separately.
Built independently by Krithika Bussireddy.