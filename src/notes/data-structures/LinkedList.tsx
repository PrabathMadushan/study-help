import { CodeBlock } from '../../components/CodeBlock'

export default function LinkedList() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        What is a Linked List?
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A linked list is a linear structure where each <strong>node</strong> holds a value and a pointer to the next node (and optionally the previous, in a doubly linked list). There is no random access by index — you traverse from the head (or tail) to reach a node.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Structure
      </h3>
      <CodeBlock
        code={`// Singly linked node
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// Doubly linked node (optional)
class DoublyNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}`}
      />

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Time Complexity (Interview Must-Know)
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Access by index:</strong> O(n) — must traverse from head.</li>
        <li><strong>Search by value:</strong> O(n) — linear traversal.</li>
        <li><strong>Insert/delete at head:</strong> O(1) — just update pointers.</li>
        <li><strong>Insert/delete at tail (with tail pointer):</strong> O(1).</li>
        <li><strong>Insert/delete after a known node:</strong> O(1) — no shifting.</li>
        <li><strong>Insert/delete at arbitrary position:</strong> O(n) to find the node, then O(1) to update.</li>
      </ul>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The big win over arrays: <strong>insertion and deletion at head (or at a known node) are O(1)</strong>, with no need to shift elements. The cost is no O(1) random access.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        When Linked Lists Come Up in Interviews
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Merge Two Sorted Lists:</strong> Two pointers, compare and link.</li>
        <li><strong>Reverse a Linked List:</strong> Iterative with prev/curr/next or recursive.</li>
        <li><strong>Detect cycle:</strong> Floyd&apos;s cycle detection (slow/fast pointers).</li>
        <li><strong>LRU Cache:</strong> Map + doubly linked list for O(1) get/put and eviction.</li>
        <li><strong>Design a data structure</strong> where you add at head and remove from tail (queue) — doubly linked list with head and tail pointers gives O(1) for both.</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Reverse a Linked List (Classic)
      </h3>
      <CodeBlock
        code={`function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`}
      />

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Linked List vs Array
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Array:</strong> O(1) access by index, O(n) insert/delete in the middle (shifting). <strong>Linked list:</strong> O(n) access by index, O(1) insert/delete at head or at a known node. Use a linked list when you do many insertions/deletions at the beginning or when you don&apos;t need index-based access (e.g. implementing a queue with a tail pointer, or when the problem explicitly gives you a linked list).
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;A linked list is a linear structure of nodes, each with a value and a pointer to the next — and optionally previous in a doubly linked list. There&apos;s no random access; traversal is O(n). The advantage is O(1) insertion and deletion at the head or at a known node, without shifting. I use it when the problem involves frequent head/tail updates or when merging, reversing, or detecting cycles — and in designs like LRU cache with a doubly linked list for O(1) eviction.&quot;
      </p>
    </div>
  )
}
