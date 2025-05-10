# Propulsion Project

This project contains various components, including legacy code, game assets, and a modern web testing framework using Playwright.

## Project Structure

```
legacyCode/
    Game/
        !!Force!!/
        Manage/
        Operations/
        Service/
    GAMEHEAD/
    Map/
propulsionWeb/
    test/
        tests/
        test-results/
```

### Key Directories

- **`legacyCode/`**: Contains legacy game code and assets.
- **`propulsionWeb/`**: Houses the Playwright-based testing framework for modern web testing.

## Prerequisites

- Node.js (version 12 or later)
- npm (Node package manager)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the `propulsionWeb/test` directory:

   ```bash
   cd propulsionWeb/test
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Running Tests

To execute the Playwright tests, run:

```bash
npx playwright test
```

## License

This project is licensed under the MIT License.
