# Dream Portal — QA Automation Suite

Automated functional test suite for the **Dream Portal** dream-journaling website, built using **Playwright + TypeScript** and the **Page Object Model (POM)** design pattern.

This project was developed for the **QA Intern Assignment: Automated Testing for "Dream Portal"**.

The automation covers the required core UI functional testing and the optional AI-based validation described in the assignment.

---

## 🎯 Project Objective

The objective of this project is to automate functional testing of the Dream Portal application and verify the expected behavior of its:

- Home page
- Dream diary page
- Dream summary page

The project also includes an optional AI-based validation that uses an OpenAI model to independently classify dream names as **Good** or **Bad** and compare the result with the classification recorded by the application.

---

## 🧪 Assignment Coverage

### Part 1 — Core UI Functional Test Automation

The following pages are covered:

- `index.html` — Dream Portal Home
- `dreams-diary.html` — Dream Log Table
- `dreams-total.html` — Summary Page

### Part 2 — Bonus AI-Based Validation

The optional AI validation:

- Retrieves every dream name from the diary.
- Sends each dream name to an OpenAI model.
- Requests a `Good` or `Bad` classification.
- Compares the AI classification with the application's recorded type.
- Calculates an overall agreement rate.
- Requires at least 70% agreement when the AI service is available.

---

## 📁 Project Structure

    qa-dream-portal-automation/
    │
    ├── pages/
    │   ├── HomePage.ts
    │   ├── DreamsDiaryPage.ts
    │   └── DreamsTotalPage.ts
    │
    ├── tests/
    │   ├── home.spec.ts
    │   ├── dreamsDiary.spec.ts
    │   ├── dreamsTotal.spec.ts
    │   └── ai-validation.spec.ts
    │
    ├── utils/
    │   ├── testData.ts
    │   └── aiClassifier.ts
    │
    ├── screenshots/
    │   └── home-loaded.png
    │
    ├── .github/
    │   └── workflows/
    │
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    ├── playwright.config.ts
    ├── tsconfig.json
    └── README.md

---

## 🏗️ Architecture

The project follows the **Page Object Model (POM)** pattern.

Each major application page has its own Page Object containing its locators, navigation methods, and reusable page-level operations.

This keeps the test specifications focused on business requirements and assertions instead of implementation-specific locators.

### Page Objects

| Page Object | Application Page | Responsibility |
|---|---|---|
| `HomePage.ts` | `index.html` | Home page loading, main content, My Dreams button, new tabs |
| `DreamsDiaryPage.ts` | `dreams-diary.html` | Reading dream entries and identifying recurring dreams |
| `DreamsTotalPage.ts` | `dreams-total.html` | Reading and validating summary statistics |

Expected values are centralized in `utils/testData.ts`.

This provides a single source of truth for expected values such as:

- 10 total dreams
- 6 Good dreams
- 4 Bad dreams
- 2 recurring dreams

---

## ⚙️ Requirements

The project requires:

- Node.js 18+
- npm
- Playwright
- Chromium browser

---

## 🚀 Installation

### 1. Clone the repository

    git clone https://github.com/shivam-9s/qa-dream-portal-automation
    cd qa-dream-portal-automation

### 2. Install dependencies

    npm install

### 3. Install Playwright Chromium

    npx playwright install chromium

---

## 🔧 Environment Configuration

Create a `.env` file in the project root.

    BASE_URL=https://arjitnigam.github.io/myDreams/

The application is hosted under the `/myDreams/` path, so the base URL must include that path.

---

## 🤖 Optional AI Configuration

The AI validation is optional.

If you want to execute the AI bonus test, configure:

    BASE_URL=https://arjitnigam.github.io/myDreams/
    OPENAI_API_KEY=your_openai_api_key
    OPENAI_MODEL=gpt-4o-mini

### Security

Never commit the real `.env` file or an OpenAI API key to GitHub.

The repository should contain `.env.example` instead.

Example:

    BASE_URL=https://arjitnigam.github.io/myDreams/
    OPENAI_API_KEY=
    OPENAI_MODEL=gpt-4o-mini

---

# ▶️ Running the Tests

## Run the complete Chromium test suite

    npx playwright test --project=chromium

## Run with a visible browser

    npx playwright test --project=chromium --headed

## Run Home Page tests

    npx playwright test tests/home.spec.ts --project=chromium

## Run Diary tests

    npx playwright test tests/dreamsDiary.spec.ts --project=chromium

## Run Summary tests

    npx playwright test tests/dreamsTotal.spec.ts --project=chromium

## Run AI bonus validation

    npx playwright test tests/ai-validation.spec.ts --project=chromium

The AI bonus requires a configured and usable OpenAI API account.

---

# 🧪 Test Coverage

## 1. Home Page — `index.html`

The Home Page tests verify:

- Loading animation appears and disappears within the expected time.
- Main content becomes visible after loading.
- The **My Dreams** button becomes visible and enabled.
- Clicking **My Dreams** opens `dreams-diary.html`.
- Clicking **My Dreams** opens `dreams-total.html`.
- Both pages are opened in new tabs/windows.

---

## 2. Dream Diary — `dreams-diary.html`

The diary tests verify:

### Exactly 10 entries

The application contains exactly 10 dream entries.

### Dream type validation

Every dream has a type of either:

- `Good`
- `Bad`

### Required row data

Every row contains:

- Dream Name
- Days Ago
- Dream Type

### Recurring dream validation

The diary data is analyzed to identify repeated dream names.

The automation verifies that:

- `Flying over mountains`
- `Lost in maze`

are identified as recurring dreams.

A dream is considered recurring when its name appears more than once in the diary table.

---

# 3. Summary Page — `dreams-total.html`

The summary page tests verify:

| Statistic | Expected Value |
|---|---:|
| Good Dreams | 6 |
| Bad Dreams | 4 |
| Total Dreams | 10 |
| Recurring Dreams | 2 |

### Recurring Dream Validation

The assignment specifies that:

- `Flying over mountains`
- `Lost in maze`

must be counted as recurring using the logic from the diary page.

The automation therefore:

1. Opens the diary page.
2. Reads all dream entries.
3. Finds repeated dream names.
4. Verifies that `Flying over mountains` is recurring.
5. Verifies that `Lost in maze` is recurring.
6. Calculates the recurring dream count.
7. Opens the summary page.
8. Verifies that the summary's recurring count matches the diary calculation.

The test does not assume that the summary page itself displays the individual recurring dream names.

---

# 🔄 Summary Cross-Check

An additional test independently recalculates the summary statistics from the diary table.

The following values are calculated directly from the diary:

- Good Dreams
- Bad Dreams
- Total Dreams
- Recurring Dreams

These calculated values are then compared against the statistics shown on `dreams-total.html`.

This provides an additional consistency check between the diary data and the summary page.

---

# 🤖 Bonus — AI-Based Dream Classification

The optional AI validation is implemented in:

`tests/ai-validation.spec.ts`

The OpenAI integration is implemented in:

`utils/aiClassifier.ts`

### AI Workflow

    Dream Name
        ↓
    OpenAI Model
        ↓
    Good / Bad Classification
        ↓
    Compare with Application Type
        ↓
    Calculate Agreement Rate

The model is instructed to return only:

- `Good`
- `Bad`

The test then compares the AI classification with the application's recorded classification.

### AI Agreement Threshold

The AI bonus requires an overall agreement rate of at least:

**70%**

Individual classifications are checked using soft assertions so that multiple results can be reported in the test output.

A genuine classification mismatch is not ignored.

### AI Service Availability

The AI test is designed to skip when the external AI service cannot be used.

Examples include:

- `OPENAI_API_KEY` is not configured.
- OpenAI API returns HTTP 429 because API credits are unavailable.
- The external OpenAI service is otherwise unavailable.

This does **not** replace AI results with hard-coded values.

When the OpenAI API is available, the test performs the actual AI classification.

---

# 📊 Latest Test Result

The final Chromium test execution produced:

    Running 11 tests using 4 workers

    10 passed
    1 skipped
    0 failed

### Result Summary

- Core functional tests: **PASS**
- Failed tests: **0**
- AI bonus: **SKIPPED**

The AI bonus was skipped because the external OpenAI API account currently has no available credits.

The core functional automation does not depend on the OpenAI API.

---

# 🧭 Locator Strategy

The application does not provide dedicated `data-testid` attributes for all required elements.

Therefore, the automation uses Playwright locator strategies including:

- `getByRole`
- `getByText`
- CSS selectors where necessary
- Structural table locators

Example:

    page.getByRole('button', {
      name: /my dreams/i,
    })

The Home Page also uses CSS-class fallbacks for the loading overlay.

The goal is to keep selectors readable and maintainable while avoiding unnecessary dependence on styling details.

---

# 📄 Diary Table Assumptions

`DreamsDiaryPage.ts` assumes the diary is represented by a standard HTML table with:

    <tbody>
        <tr>
            <td>Dream Name</td>
            <td>Days Ago</td>
            <td>Dream Type</td>
        </tr>
    </tbody>

The Page Object reads the three cells in that order.

If the application's markup changes in the future, the table locator can be updated in the Page Object without changing the test specifications.

---

# 📄 Summary Page Strategy

`DreamsTotalPage.ts` reads the visible page text and extracts the numeric value associated with each summary label.

The implementation validates:

- Good Dreams
- Bad Dreams
- Total Dreams
- Recurring Dreams

This keeps the summary validation independent from specific styling or presentation elements.

---

# 🧰 Framework and Technology Choices

| Requirement | Implementation |
|---|---|
| Automation Framework | Playwright |
| Programming Language | TypeScript |
| Design Pattern | Page Object Model |
| Assertions | Playwright `expect` |
| Browser | Chromium |
| Test Data | `utils/testData.ts` |
| AI Integration | OpenAI API |
| Reporting | Playwright HTML Report |
| Screenshots | Playwright screenshots |
| Test Artifacts | Screenshots, videos and traces on failures |
| Version Control | Git / GitHub |

---

# 📈 Reporting

Playwright's built-in HTML report is used for test reporting.

After executing the tests, open the report using:

    npx playwright show-report

The report provides:

- Test execution status
- Passed tests
- Failed tests
- Skipped tests
- Execution duration
- Test details
- Screenshots
- Videos
- Trace information when available

---

# 🔍 Debugging Failed Tests

For a failed test, Playwright can provide:

- Screenshot
- Video
- Trace

A trace can be opened with:

    npx playwright show-trace <trace-file>.zip

The HTML report can also be used to inspect test execution details.

# 🔐 Git and Security

The following files/directories should not be committed:

    .env
    node_modules/
    test-results/
    playwright-report/

The `.env.example` file can be committed because it contains no real credentials.

Never commit:

    OPENAI_API_KEY

or any other private credentials.

---

# 📝 Test Design Principles

The automation follows these principles:

### Page Object Model

Locators and page-specific operations are kept inside Page Objects.

### Reusable Test Data

Expected values are maintained in:

`utils/testData.ts`

### Independent Validation

The summary page is cross-checked against the actual diary data instead of relying only on hard-coded summary values.

### Web-First Assertions

Playwright's `expect` assertions are used to take advantage of Playwright's automatic waiting and retry behavior.

### External Service Isolation

The optional AI functionality does not prevent the core UI test suite from running when the external AI service is unavailable.

# ✅ Final Project Status

The required core UI automation is complete.

    Home Page          → PASS
    Dream Diary        → PASS
    Summary Page       → PASS
    Cross-checks       → PASS
    Recurring Logic    → PASS
    AI Bonus           → Optional / Skipped when API unavailable

Final verified Chromium execution:

    10 passed
    1 skipped
    0 failed

---

## 👨‍💻 Project

**Dream Portal QA Automation**

Built with:

- Playwright
- TypeScript
- Node.js
- Page Object Model
- OpenAI API (Optional Bonus)
