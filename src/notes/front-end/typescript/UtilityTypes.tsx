import { CodeBlock } from '../../../components/CodeBlock'

export default function UtilityTypes() {
    return (
        <div className="note-body space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                TypeScript Utility Types
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                TypeScript provides built-in <strong>utility types</strong> that transform existing types. They're essential for writing clean, reusable TypeScript code and are frequently asked in interviews.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Partial&lt;T&gt; - Make All Properties Optional
            </h3>
            <CodeBlock
                language="typescript"
                code={`interface User {
  id: number;
  name: string;
  email: string;
}

// All properties become optional
type PartialUser = Partial<User>;
// Result: { id?: number; name?: string; email?: string; }

// Use case: Update functions
function updateUser(id: number, updates: Partial<User>) {
  // Can update any subset of properties
}

updateUser(1, { name: 'Alice' }); // ✅
updateUser(2, { email: 'bob@example.com' }); // ✅`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Required&lt;T&gt; - Make All Properties Required
            </h3>
            <CodeBlock
                language="typescript"
                code={`interface Config {
  theme?: string;
  lang?: string;
}

type RequiredConfig = Required<Config>;
// Result: { theme: string; lang: string; }

// Use case: Ensure all config is provided
function initApp(config: RequiredConfig) {
  console.log(config.theme); // No need to check for undefined
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pick&lt;T, K&gt; - Select Specific Properties
            </h3>
            <CodeBlock
                language="typescript"
                code={`interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Pick only id and name
type UserPreview = Pick<User, 'id' | 'name'>;
// Result: { id: number; name: string; }

// Use case: Return safe user data (no password)
function getUserPreview(user: User): UserPreview {
  return { id: user.id, name: user.name };
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Omit&lt;T, K&gt; - Exclude Specific Properties
            </h3>
            <CodeBlock
                language="typescript"
                code={`interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Omit sensitive fields
type PublicUser = Omit<User, 'password'>;
// Result: { id: number; name: string; email: string; }

// Use case: API responses
function getUserPublic(user: User): PublicUser {
  const { password, ...publicData } = user;
  return publicData;
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Record&lt;K, T&gt; - Create Object Type with Keys
            </h3>
            <CodeBlock
                language="typescript"
                code={`// Define an object with specific keys and value type
type Role = 'admin' | 'user' | 'guest';

type Permissions = Record<Role, string[]>;
// Result: { admin: string[]; user: string[]; guest: string[]; }

const permissions: Permissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read']
};

// Common use case: mapping IDs to objects
type UserMap = Record<number, User>;

const users: UserMap = {
  1: { id: 1, name: 'Alice', email: 'alice@example.com', password: 'xxx' },
  2: { id: 2, name: 'Bob', email: 'bob@example.com', password: 'yyy' }
};`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Readonly&lt;T&gt; - Make All Properties Read-Only
            </h3>
            <CodeBlock
                language="typescript"
                code={`interface Config {
  apiUrl: string;
  timeout: number;
}

type ImmutableConfig = Readonly<Config>;

const config: ImmutableConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// config.timeout = 3000; // ❌ Error: Cannot assign to 'timeout'`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                ReturnType&lt;T&gt; - Extract Function Return Type
            </h3>
            <CodeBlock
                language="typescript"
                code={`function getUser() {
  return {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com'
  };
}

type User = ReturnType<typeof getUser>;
// Result: { id: number; name: string; email: string; }

// No need to define the type separately!`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Parameters&lt;T&gt; - Extract Function Parameters
            </h3>
            <CodeBlock
                language="typescript"
                code={`function createUser(name: string, age: number, email: string) {
  return { name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>;
// Result: [string, number, string]

// Use case: Store params for later
const params: CreateUserParams = ['Alice', 25, 'alice@example.com'];
createUser(...params);`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Exclude&lt;T, U&gt; & Extract&lt;T, U&gt;
            </h3>
            <CodeBlock
                language="typescript"
                code={`type Status = 'pending' | 'success' | 'error' | 'cancelled';

// Exclude: Remove types from union
type ActiveStatus = Exclude<Status, 'cancelled'>;
// Result: 'pending' | 'success' | 'error'

// Extract: Keep only matching types
type FinalStatus = Extract<Status, 'success' | 'error'>;
// Result: 'success' | 'error'`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Real-World Example: API Response Handler
            </h3>
            <CodeBlock
                language="typescript"
                code={`interface ApiUser {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

// Public-facing user (no sensitive data)
type PublicUser = Omit<ApiUser, 'password'>;

// User creation payload (no id, timestamps)
type CreateUserPayload = Omit<ApiUser, 'id' | 'createdAt' | 'updatedAt'>;

// Update payload (all optional except id)
type UpdateUserPayload = Partial<Omit<ApiUser, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: number;
};

// Response wrapper
type ApiResponse<T> = Readonly<{
  data: T;
  status: 'success' | 'error';
  message?: string;
}>;

// Usage:
function getUsers(): ApiResponse<PublicUser[]> {
  return {
    data: [{ id: 1, username: 'alice', email: 'alice@example.com', createdAt: '2024-01-01', updatedAt: '2024-01-01' }],
    status: 'success'
  };
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Answer (Memorize This)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "Utility types transform existing types. Partial makes all properties optional—I use it for update functions. Pick selects specific properties, Omit excludes them—great for removing sensitive data. Record creates objects with specific keys. ReturnType extracts a function's return type. I use utility types to keep code DRY and maintainable instead of manually typing similar shapes."
            </p>
        </div>
    )
}
