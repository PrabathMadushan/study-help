import { CodeBlock } from '../../../components/CodeBlock'

export default function AsyncAwait() {
    return (
        <div className="note-body space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Async/Await in JavaScript
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">async/await</code> is syntactic sugar over Promises, making asynchronous code look and behave like synchronous code. It's the modern, preferred way to handle async operations.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Syntax
            </h3>
            <CodeBlock
                code={`// async function always returns a Promise
async function fetchUser() {
  return 'Alice'; // Automatically wrapped in Promise.resolve()
}

fetchUser().then(name => console.log(name)); // "Alice"

// await pauses execution until Promise resolves
async function getUser() {
  const user = await fetchUser(); // Wait for promise
  console.log(user); // "Alice"
  return user;
}

getUser();`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Error Handling with try/catch
            </h3>
            <CodeBlock
                code={`async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error; // Re-throw or handle
  } finally {
    console.log('Cleanup work');
  }
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sequential vs Parallel Execution
            </h3>
            <CodeBlock
                code={`// ❌ Sequential (slow) - waits for each
async function sequential() {
  const user = await fetchUser();     // 1s
  const posts = await fetchPosts();   // 1s
  const comments = await fetchComments(); // 1s
  // Total: ~3 seconds
  return { user, posts, comments };
}

// ✅ Parallel (fast) - all start at once
async function parallel() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  // Total: ~1 second (fastest wins)
  return { user, posts, comments };
}

// ❌ Common mistake:
async function mistake() {
  // These start immediately but we await them sequentially!
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();
  
  const user = await userPromise;  // Fine
  const posts = await postsPromise; // Also fine, but didn't save time
  
  // Better: await Promise.all([userPromise, postsPromise])
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                await in Loops
            </h3>
            <CodeBlock
                code={`const ids = [1, 2, 3, 4, 5];

// ❌ Sequential execution (slow)
for (const id of ids) {
  const data = await fetchData(id); // Waits for each
  console.log(data);
}

// ✅ Parallel execution (fast)
const promises = ids.map(id => fetchData(id));
const results = await Promise.all(promises);
results.forEach(data => console.log(data));

// OR using for-await-of with async iterators:
for await (const data of fetchDataGenerator(ids)) {
  console.log(data);
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top-Level await (ES2022)
            </h3>
            <CodeBlock
                code={`// In modules, you can use await at the top level
// (outside async function)

// data.js
export const data = await fetch('/api/config').then(r => r.json());

// main.js
import { data } from './data.js';
console.log(data); // Already loaded!`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Real-World Example
            </h3>
            <CodeBlock
                code={`class UserService {
  async getUserWithPosts(userId) {
    try {
      // Fetch user and their posts in parallel
      const [user, posts] = await Promise.all([
        this.fetchUser(userId),
        this.fetchUserPosts(userId)
      ]);
      
      // Then fetch comments for first 5 posts (parallel)
      const postsWithComments = await Promise.all(
        posts.slice(0, 5).map(async post => ({
          ...post,
          comments: await this.fetchComments(post.id)
        }))
      );
      
      return {
        ...user,
        posts: postsWithComments
      };
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }
  
  async fetchUser(id) {
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
  }
  
  async fetchUserPosts(userId) {
    const response = await fetch(\`/api/users/\${userId}/posts\`);
    return response.json();
  }
  
  async fetchComments(postId) {
    const response = await fetch(\`/api/posts/\${postId}/comments\`);
    return response.json();
  }
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Common Pitfalls
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>Forgot await?</strong> You get a Promise instead of the value.</li>
                <li><strong>Forgot async?</strong> Can't use await; SyntaxError.</li>
                <li><strong>Unhandled rejections?</strong> Always use try/catch or .catch().</li>
                <li><strong>Sequential when parallel?</strong> Use Promise.all() for independent operations.</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Answer (Memorize This)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "Async/await makes async code look synchronous. An async function returns a Promise. Await pauses execution until a Promise resolves. I use try/catch for error handling. For parallel operations, I use Promise.all() instead of sequential awaits to improve performance. Async/await is cleaner than promise chains and essential for modern JavaScript."
            </p>
        </div>
    )
}
