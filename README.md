# About the application

This is the front end repository of pollvault. 

# How to run the code 🧑🏼‍💻

Clone the repository

```bash
git clone https://github.com/pollvaulting/pollvault-frontend-repo.git
```

Now rename the .env.example to .env file and enter the environment variable. Install the dependencies required for the application

```bash 
mv .env.example .env
```

```bash
bun install
```

Next run the application in the local system.

```bash
bun run dev
```

Before commiting into the reposioty makes sure you adher to the standard git commit message practice.

Run the following command to format the codes.

```bash
bun prettier --write .
```

The scripts will however run anyways since automated scripts are present to run it before commit. storngly recommended to remove warnings which you get during the commit, push command.


for stripe
install "npm install stripe @stripe/stripe-js @stripe/react-stripe-js"