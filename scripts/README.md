# ⚡ Automation & Startup Scripts

Convenience scripts to manage development servers for the **FitNexus Gym Management System**.

## 🛠️ Available Scripts

| Script | Function |
| :--- | :--- |
| [**`restart-all-servers.bat`**](file:///scripts/restart-all-servers.bat) | Kills old processes and starts both Spring Boot backend (port 8080) and Next.js frontend (port 3000). |
| [**`start-backend.bat`**](file:///scripts/start-backend.bat) | Starts only the Spring Boot backend server on port 8080. |
| [**`start-frontend.bat`**](file:///scripts/start-frontend.bat) | Starts only the Next.js frontend application on port 3000. |

> [!TIP]
> Convenience forwarders are also provided in the project root directory (`restart-all-servers.bat` and `start-backend.bat`) so you can launch them directly from the workspace root.
