### **Google_Girl_Hackathon_Backend** 🚀  
This is the backend service for the **Google Hackathon Project**, providing APIs for authentication, data handling, and integration with the frontend.  

## **🛠 Tech Stack**  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT  
- **Other Dependencies:** dotenv, bcrypt, mongoose  

## **📂 Project Structure**  
```
/controllers   --> Handles business logic  
/models        --> Defines database schemas  
/routes        --> API endpoints  
/services      --> Utility functions  
node_modules   --> Installed dependencies  
.env           --> Environment variables  
.gitignore     --> Files to be ignored  
package.json   --> Project metadata & dependencies  
server.js      --> Entry point  
```

## **🚀 Installation & Setup**  
### **1️⃣ Clone the repository**  
```sh
git clone https://github.com/Rupali-1394/google_backend.git
cd google_backend
```

### **2️⃣ Install dependencies**  
```sh
npm install
```

### **3️⃣ Set up environment variables**  
Create a `.env` file in the root directory and add:  
```plaintext
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### **4️⃣ Start the server**  
```sh
npm start  

## **📌 API Endpoints**  
| Method | Endpoint       | Description          |
|--------|--------------|----------------------|
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | User login with JWT |
| GET    | /api/data          | Fetch data |

## **📞 Contact**  
For queries, feel free to reach out at **mrupali1394@gmail.com** or raise an issue in the repo.  
