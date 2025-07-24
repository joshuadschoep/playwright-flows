# Playwright Flows

---

## Purpose

This library is meant to extend and wrap the [Playwright](https://github.com/microsoft/playwright) project, providing an easy API for multi-step forms, and longer flows in general.

The project lives on the idea of a recursive functional piece called a Flow, which can contain more flows and/or internal execution methods.

---

## Installation

This project is available on [npm](https://www.npmjs.com/) and is installable with all standard NodeJS package managers.

### NPM

```bash
npm install --save playwright-flows
```

### Yarn

```bash
yarn add playwright-flows
```

### PNPM

```bash
pnpm install playwright-flows
```

---

## Usage

### Dead simple

```typescript
import { expect, test } from "@playwright/test";

const loginSteps = (page, config, options) => {
  page.getByRole("input", { name: "Username" }).fill(config.username);
  page.getByRole("input", { name: "Password" }).fill(config.password ?? process.env.TEST_PASSWORD);

  if (options.login) {
    page.getByRole("button", { name: "Login" }).click();
  }
};

const login = createFlow({
  handler: loginSteps,
  defaultFields: {
    username: "test_user",
  },
  defaultOptions: {
    login: true,
  },
});

test(
  ...createTest({
    name: "Logins in as default user",
    flow: login,
    after: (page) => {
      await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
    },
  }),
);
```

### Integrate with existing Playwright tests

Flows is nothing more than a handy method wrapper with a clean API. Feel free to use it however _you_ want.

```typescript
import { expect, test } from "@playwright/test";

const loginSteps: FlowSteps<LoginFormFields> = (page, config, options) => {
  page.getByRole("input", { name: "Username" }).fill(config.username);
  page.getByRole("input", { name: "Password" }).fill(config.password);

  if (options.login) {
    page.getByRole("button", { name: "Login" }).click();
  }
};

const login = createFlow({
  handler: loginSteps,
});

test("should handle legacy login at specific url", async ({ page }) => {
  await page.goto("mywebsite.com/login?legacy=true");

  await login.execute(
    page,
    {
      username: "legacy_user",
      password: "legacy_password",
    },
    {
      login: true,
    },
  );

  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
});
```

### Typing Support

```typescript
import { expect, test } from "@playwright/test";

interface LoginFormFields {
  username: string;
  password: string;
}

interface LoginFormOptions extends FlowOptions {
  login: boolean;
}

const defaultFields: LoginFormFields = {
  username: "test_user",
  password: process.env.TEST_PASSWORD,
};

const defaultOptions: LoginFormOptions = {
  login: true,
  debugAfter: true,
};

const loginSteps: FlowHandler<LoginFormFields, LoginFormOptions> = (page, config, options) => {
  page.getByRole("input", { name: "Username" }).fill(config.username);
  page.getByRole("input", { name: "Password" }).fill(config.password);
  if (options.login) {
    page.getByRole("button", { name: "Login" }).click();
  }
};

const login = createFlow({
  handler: loginSteps,
  defaultFields,
  defaultOptions
});

test(
  ...createTest({
    name: "Logins in as default user",
    flow: login,
    after: (page, config, options) => {
      await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
    },
  }),
);

test(
  ...createTest({
    name: "Blocks invalid user login",
    flow: login,
    fields: {
        username: "invalid_user",
        password: "nonexistent_password",
    },
    options: {
      login: true,
    }
    after: (page, config, options) => {
      await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
    },
  }),
);
```

### Grouped usage

Now for the actual fun, reusable flows and parent/children relationships

```typescript
import { test } from "playwright/test";

const login = createFlow({
  id: "login",
  handler: (page) => {
    //...
  },
});
const openSettings = createFlow({
  handler: (page) => {
    //...
  },
});

test(
  ...createTest({
    name: "Logs in then navigates but as a parent flow",
    flow: createFlow({
      handler: [login, openSettings],
    }),
  }),
);

test(
  ...createTest({
    name: "Settings page is personalized",
    flow: createFlow({
      handler: [login, openSettings],
      fields: {
        login: {
          username: "other_user",
        },
      },
    }),
  }),
);
```
