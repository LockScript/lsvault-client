# LSVault-Client

LSVault-Client is a secure password manager built with React and TypeScript. It uses local storage to store your passwords, which are encrypted using a vault key.

## lsvault-server
LSVault-Server is the backend server for LSVault-Client. It provides the necessary APIs for user authentication, password storage, and encryption.

You can find the repository for LSVault-Server [here](https://github.com/cvs0/lsvault-server).

## Features

LSVault-Client offers the following features:

- Secure password storage: All passwords are stored securely in your browser's local storage.
- Encryption: Passwords are encrypted using a vault key, ensuring maximum security.
- Password generator: Generate strong and unique passwords with options to include special characters, numbers, and avoid similar characters.
- Password management: Easily add, edit, and delete password entries.

## Installation
To install and run LSVault-Client, follow these steps:

1. Clone the repository:
    ```
    git clone https://github.com/cvs0/lsvault-client.git
    ```

2. Navigate to the project directory:
    ```
    cd lsvault-client
    ```

3. Install the dependencies:
    ```
    npm install
    ```

4. Start the development server:
    ```
    npm start
    ```

5. Open your browser and go to `http://localhost:3000` to access LSVault-Client.

Note: Make sure you have Node.js and npm installed on your machine before proceeding with the installation.

## Components

The main component is [`Vault`](src/components/Vault.tsx), which handles the password entries and the password generator.

Additionally, we have the following components:

- [`LoginForm`](src/components/LoginForm.tsx): Handles the login functionality.
- [`RegistrationForm`](src/components/RegistrationForm.tsx): Handles the registration functionality.

## Encryption

The encryption and decryption of the vault are handled by the `encryptVault` and `decryptVault` functions.

## Contributing

Contributions are welcome. If you would like to contribute to LSVault-Client, please follow these steps:

1. Fork the repository by clicking the "Fork" button on the GitHub page.
2. Clone your forked repository to your local machine:
    ```
    git clone https://github.com/LockScript/lsvault-client.git
    ```
3. Navigate to the project directory:
    ```
    cd lsvault-client
    ```
4. Install the dependencies:
    ```
    npm install
    ```
5. Create a new branch for your changes:
    ```
    git checkout -b your-branch-name
    ```
6. Make your desired changes to the codebase.
7. Commit your changes:
    ```
    git commit -m "Your commit message"
    ```
8. Push your changes to your forked repository:
    ```
    git push origin your-branch-name
    ```
9. Open a pull request on the original repository to propose your changes.

Please note that all contributions are subject to review and approval by the project maintainers. Thank you for your contribution!

## License

LSVault-Client is licensed under the MIT License.