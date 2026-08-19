import { Question, MCQQuestion, InterviewResult } from '../types';

export const MOCK_QUESTIONS: Question[] = [
  // --- JAVA ---
  {
    id: 'java-b-1',
    tech: 'Java',
    difficulty: 'Beginner',
    topic: 'Core OOP',
    text: 'What are the main principles of Object-Oriented Programming in Java? Briefly explain Encapsulation.',
    hint: 'Think about the 4 pillars: Inheritance, Polymorphism, Abstraction, Encapsulation.',
    sampleAnswer: 'The four main principles of OOP in Java are Abstraction, Encapsulation, Inheritance, and Polymorphism. Encapsulation is the mechanism of wrapping data (variables) and code acting on data (methods) together as a single unit (class), restricting direct access through private fields and public getters/setters.'
  },
  {
    id: 'java-b-2',
    tech: 'Java',
    difficulty: 'Beginner',
    topic: 'Memory & Variables',
    text: 'What is the difference between Primitive types and Reference types in Java? How are they stored in memory?',
    sampleAnswer: 'Primitive types (like int, boolean, char) store raw values directly in Stack memory. Reference types (like Objects, String, Arrays) store references or addresses in Stack memory that point to the actual objects allocated in Heap memory.'
  },
  {
    id: 'java-i-1',
    tech: 'Java',
    difficulty: 'Intermediate',
    topic: 'Collections & Equals',
    text: 'Explain the contract between equals() and hashCode() methods in Java. What happens if you override equals() without overriding hashCode()?',
    sampleAnswer: 'If two objects are equal according to equals(), they MUST have the same hashCode() value. If you override equals() without hashCode(), hash-based collections like HashMap or HashSet will fail to locate objects because equal objects might map to different bucket locations.'
  },
  {
    id: 'java-i-2',
    tech: 'Java',
    difficulty: 'Intermediate',
    topic: 'Exception Handling',
    text: 'What is the difference between Checked and Unchecked exceptions in Java? Give an example of each.',
    sampleAnswer: 'Checked exceptions (e.g., IOException, SQLException) are checked at compile-time and must be either caught or declared in throws. Unchecked exceptions (subclasses of RuntimeException like NullPointerException, IndexOutOfBoundsException) occur at runtime and do not require mandatory handling.'
  },
  {
    id: 'java-a-1',
    tech: 'Java',
    difficulty: 'Advanced',
    topic: 'Multithreading & Memory Model',
    text: 'Explain the volatile keyword in Java. How does it differ from synchronized block regarding visibility and atomicity?',
    sampleAnswer: 'The volatile keyword guarantees memory visibility by forcing reads and writes directly from/to main memory rather than thread CPU caches, preventing instruction reordering. However, volatile does NOT guarantee atomicity for compound operations (e.g., count++), whereas synchronized provides both visibility AND mutual exclusion (atomicity).'
  },

  // --- PYTHON ---
  {
    id: 'py-b-1',
    tech: 'Python',
    difficulty: 'Beginner',
    topic: 'Data Structures',
    text: 'What is the difference between a List and a Tuple in Python? When would you use a Tuple instead of a List?',
    sampleAnswer: 'Lists are mutable (can be modified after creation) using square brackets [], while Tuples are immutable using parentheses (). Tuples are used for heterogeneous data, fixed collections, record keys, or performance efficiency since immutability prevents unintended modifications.'
  },
  {
    id: 'py-b-2',
    tech: 'Python',
    difficulty: 'Beginner',
    topic: 'Memory & Scope',
    text: 'What does mutable vs immutable mean in Python? Name 3 mutable types and 3 immutable types.',
    sampleAnswer: 'Mutable means the object state can be changed after creation without changing its memory address. Mutable: list, dict, set. Immutable: int, float, str, tuple, bool.'
  },
  {
    id: 'py-i-1',
    tech: 'Python',
    difficulty: 'Intermediate',
    topic: 'Advanced Python',
    text: 'What are Generators in Python, and how do they differ from regular functions? How does yield work?',
    sampleAnswer: 'Generators are functions that return an iterator using the yield keyword instead of return. Instead of computing all values at once and storing them in memory, yield pauses execution and returns values on-demand, saving memory for large datasets.'
  },
  {
    id: 'py-i-2',
    tech: 'Python',
    difficulty: 'Intermediate',
    topic: 'Decorators',
    text: 'How do Decorators work in Python? Write a high-level explanation or snippet of a decorator that measures execution time.',
    codeSnippet: 'def my_decorator(func):\n    def wrapper(*args, **kwargs):\n        # Do something before\n        res = func(*args, **kwargs)\n        # Do something after\n        return res\n    return wrapper',
    sampleAnswer: 'Decorators are functions that take another function as an argument, wrap its behavior, and return the modified function without permanently altering the original code. They leverage first-class functions and closures in Python.'
  },
  {
    id: 'py-a-1',
    tech: 'Python',
    difficulty: 'Advanced',
    topic: 'Concurrency & Internal Architecture',
    text: 'Explain GIL (Global Interpreter Lock) in CPython. How does GIL impact multi-threaded CPU-bound vs I/O-bound Python programs?',
    sampleAnswer: 'The GIL is a mutex that prevents multiple native threads from executing Python bytecodes at the same time in CPython. For CPU-bound tasks, multi-threading yields no performance gain due to GIL contention (multiprocessing is needed). For I/O-bound tasks (web requests, disk ops), threads release the GIL during waiting, allowing concurrent execution.'
  },

  // --- C ---
  {
    id: 'c-b-1',
    tech: 'C',
    difficulty: 'Beginner',
    topic: 'Pointers Basics',
    text: 'What is a Pointer in C language? Explain the difference between *ptr and &val.',
    sampleAnswer: 'A pointer is a variable that stores the memory address of another variable. &val evaluates to the memory address of val, while *ptr dereferences the pointer to access or modify the value stored at that address.'
  },
  {
    id: 'c-i-1',
    tech: 'C',
    difficulty: 'Intermediate',
    topic: 'Dynamic Memory Allocation',
    text: 'Explain malloc(), calloc(), realloc(), and free() in C. What is a Memory Leak and dangling pointer?',
    sampleAnswer: 'malloc(size) allocates uninitialized heap memory. calloc(num, size) allocates memory initialized to zero. realloc(ptr, new_size) resizes existing heap allocations. free(ptr) releases memory. A memory leak occurs when dynamically allocated memory is unreleased. A dangling pointer points to memory that has already been freed.'
  },

  // --- C++ ---
  {
    id: 'cpp-b-1',
    tech: 'C++',
    difficulty: 'Beginner',
    topic: 'References & Memory',
    text: 'What is the key difference between a Reference and a Pointer in C++?',
    sampleAnswer: 'A reference is an alias for an existing variable that cannot be null and cannot be reassigned to point to another object after initialization. A pointer stores a memory address, can be NULL or nullptr, and can be reassigned.'
  },
  {
    id: 'cpp-i-1',
    tech: 'C++',
    difficulty: 'Intermediate',
    topic: 'RAII & Virtual Functions',
    text: 'What is RAII (Resource Acquisition Is Initialization) in C++? Why should base class destructors be virtual?',
    sampleAnswer: 'RAII binds the lifecycle of a resource (heap memory, file handle, socket) to object lifetime, freeing resources automatically in the destructor when exiting scope. Base class destructors must be virtual so that deleting a derived object via a base pointer properly invokes the derived destructor.'
  },

  // --- JAVASCRIPT ---
  {
    id: 'js-b-1',
    tech: 'JavaScript',
    difficulty: 'Beginner',
    topic: 'Scope & Variables',
    text: 'Explain the difference between var, let, and const in JavaScript. Focus on scope, hoisting, and re-assignment.',
    sampleAnswer: 'var is function-scoped, hoisted and initialized with undefined, allowing re-declaration. let and const are block-scoped, hoisted into Temporal Dead Zone (TDZ). let allows re-assignment, whereas const prevents variable re-assignment.'
  },
  {
    id: 'js-i-1',
    tech: 'JavaScript',
    difficulty: 'Intermediate',
    topic: 'Event Loop & Async',
    text: 'Explain how the JavaScript Event Loop works. What is the difference between Microtasks (Promises) and Macrotasks (setTimeout)?',
    sampleAnswer: 'JavaScript is single-threaded. Synchronous code executes on the Call Stack. Asynchronous callbacks are handled via the Web APIs and queued into Microtask Queue (Promises, process.nextTick) or Macrotask/Callback Queue (setTimeout, setInterval). The Event Loop prioritizes emptying ALL microtasks before processing the next macrotask.'
  },
  {
    id: 'js-a-1',
    tech: 'JavaScript',
    difficulty: 'Advanced',
    topic: 'Closures & Prototypes',
    text: 'What is a Closure in JavaScript? Provide a real-world use case such as data privacy or memoization.',
    codeSnippet: 'function createCounter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    getCount: () => count\n  };\n}',
    sampleAnswer: 'A closure is a function bundled together with references to its surrounding lexical environment, allowing an inner function to access outer scope variables even after the outer function has finished executing. Use cases include module pattern data privacy, currying, and memoization.'
  },

  // --- HTML/CSS ---
  {
    id: 'html-b-1',
    tech: 'HTML/CSS',
    difficulty: 'Beginner',
    topic: 'Box Model & Semantics',
    text: 'Explain the CSS Box Model components. What is box-sizing: border-box and why is it recommended?',
    sampleAnswer: 'The CSS Box Model consists of Content, Padding, Border, and Margin. By default (content-box), width specifies content only, so padding and border add to element total size. box-sizing: border-box includes padding and border within the declared width/height, making layout sizing predictable.'
  },
  {
    id: 'html-i-1',
    tech: 'HTML/CSS',
    difficulty: 'Intermediate',
    topic: 'Flexbox vs Grid',
    text: 'Compare CSS Flexbox and CSS Grid. When would you choose Flexbox over Grid?',
    sampleAnswer: 'Flexbox is a 1-dimensional layout system designed for laying out items in a single row OR column (components, navigation bars). CSS Grid is a 2-dimensional layout system designed for complex page layouts with both rows AND columns simultaneously.'
  },

  // --- REACT JS ---
  {
    id: 'react-b-1',
    tech: 'React JS',
    difficulty: 'Beginner',
    topic: 'React Fundamentals',
    text: 'What is the Virtual DOM in React and how does reconciliation work?',
    sampleAnswer: 'The Virtual DOM is a lightweight in-memory representation of the real DOM. When state or props change, React builds a new Virtual DOM tree, performs a diffing algorithm (Reconciliation) against the previous tree, and batches only necessary updates efficiently to the real DOM.'
  },
  {
    id: 'react-i-1',
    tech: 'React JS',
    difficulty: 'Intermediate',
    topic: 'Hooks & State',
    text: 'Explain useEffect rules and dependencies array in React. What happens when you pass an empty array vs no array vs primitive values?',
    sampleAnswer: 'No dependency array runs the effect after EVERY render. An empty array [] runs the effect ONCE after initial mount. An array with variables [stateA, propB] runs the effect whenever any dependency changes. Avoid stale closures by including referenced state/props or memoizing handlers.'
  },
  {
    id: 'react-a-1',
    tech: 'React JS',
    difficulty: 'Advanced',
    topic: 'Performance Optimization',
    text: 'How do React.memo, useMemo, and useCallback prevent unnecessary re-renders in React applications?',
    sampleAnswer: 'React.memo skips re-rendering a component if props have not changed. useMemo memoizes the computed result of an expensive calculation. useCallback memoizes callback function instances so child components receiving function props do not re-render unnecessarily on parent updates.'
  }
];

export const MOCK_MCQ_QUESTIONS: MCQQuestion[] = [
  // Java MCQs
  {
    id: 'mcq-java-1',
    tech: 'Java',
    difficulty: 'Beginner',
    topic: 'Core Syntax',
    question: 'Which keyword is used to prevent a method from being overridden in Java?',
    options: ['static', 'final', 'abstract', 'protected'],
    correctIndex: 1,
    explanation: 'The `final` keyword applied to a method prevents subclasses from overriding it.'
  },
  {
    id: 'mcq-java-2',
    tech: 'Java',
    difficulty: 'Intermediate',
    topic: 'Collections',
    question: 'Which Collection interface allows duplicate elements and maintains insertion order?',
    options: ['Set', 'List', 'Map', 'Queue'],
    correctIndex: 1,
    explanation: 'List interface (e.g. ArrayList, LinkedList) allows duplicates and maintains ordered insertion sequence.'
  },

  // Python MCQs
  {
    id: 'mcq-py-1',
    tech: 'Python',
    difficulty: 'Beginner',
    topic: 'Built-in Functions',
    question: 'What is the output of bool([]) in Python?',
    options: ['True', 'False', 'TypeError', 'None'],
    correctIndex: 1,
    explanation: 'An empty list `[]` evaluates to falsy in boolean context, so `bool([])` returns `False`.'
  },
  {
    id: 'mcq-py-2',
    tech: 'Python',
    difficulty: 'Intermediate',
    topic: 'List Comprehensions',
    question: 'What will `[x**2 for x in range(4) if x % 2 == 0]` evaluate to?',
    options: ['[0, 1, 4, 9]', '[0, 4]', '[1, 9]', '[0, 2, 4]'],
    correctIndex: 1,
    explanation: 'range(4) produces 0, 1, 2, 3. Even numbers are 0 and 2. Squaring them yields [0, 4].'
  },

  // JavaScript MCQs
  {
    id: 'mcq-js-1',
    tech: 'JavaScript',
    difficulty: 'Beginner',
    topic: 'Types & Operators',
    question: 'What is typeof null in JavaScript?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correctIndex: 2,
    explanation: 'In JavaScript, `typeof null` returns `"object"` due to a legacy bug in the original language design.'
  },
  {
    id: 'mcq-js-2',
    tech: 'JavaScript',
    difficulty: 'Intermediate',
    topic: 'Promises & Async',
    question: 'Which method returns a promise that resolves when ALL input promises resolve, or rejects if ANY promise rejects?',
    options: ['Promise.race()', 'Promise.all()', 'Promise.any()', 'Promise.allSettled()'],
    correctIndex: 1,
    explanation: '`Promise.all()` waits for all promises to resolve, or immediately rejects if any promise fails.'
  },

  // React MCQs
  {
    id: 'mcq-react-1',
    tech: 'React JS',
    difficulty: 'Beginner',
    topic: 'JSX & State',
    question: 'Which Hook is used to manage local state inside a functional React component?',
    options: ['useContext', 'useEffect', 'useState', 'useReducer'],
    correctIndex: 2,
    explanation: '`useState` is the primary React Hook for creating state variable state pairs in functional components.'
  },
  {
    id: 'mcq-react-2',
    tech: 'React JS',
    difficulty: 'Intermediate',
    topic: 'Component Lifecycle',
    question: 'What does returning a function inside useEffect cleanup callback accomplish?',
    options: ['Triggers re-render', 'Runs cleanup on unmount or before effect re-runs', 'Prevents initial render', 'Catches component errors'],
    correctIndex: 1,
    explanation: 'The returned cleanup function runs when the component unmounts or prior to re-executing the effect.'
  },

  // HTML/CSS MCQs
  {
    id: 'mcq-html-1',
    tech: 'HTML/CSS',
    difficulty: 'Beginner',
    topic: 'CSS Selectors',
    question: 'Which CSS selector targets an element with id="header"?',
    options: ['.header', '#header', '*header', 'header'],
    correctIndex: 1,
    explanation: 'The hash symbol `#` targets element IDs in CSS.'
  }
];

export const INITIAL_SAMPLE_HISTORY: InterviewResult[] = [
  {
    id: 'sample-inv-1',
    timestamp: '2026-08-10T14:30:00.000Z',
    config: {
      technology: 'React JS',
      difficulty: 'Intermediate',
      questionCount: 5,
      interviewType: 'Technical'
    },
    messages: [],
    totalQuestions: 5,
    attemptedQuestions: 5,
    averageScore: 8.4,
    percentage: 84,
    strongTopics: ['Virtual DOM', 'Reconciliation', 'State Management'],
    weakTopics: ['Custom Hooks Dependencies', 'Memory Leak Cleanup'],
    overallFeedback: 'Strong foundational grasp of React rendering mechanics and JSX pattern. Work on optimizing useEffect dependency arrays and hook cleanup routines.',
    keyTakeaways: [
      'Master useEffect cleanup function for subscriptions',
      'Use React.memo with care to avoid prematurely optimizing shallow prop checks'
    ]
  },
  {
    id: 'sample-inv-2',
    timestamp: '2026-08-08T10:15:00.000Z',
    config: {
      technology: 'Java',
      difficulty: 'Beginner',
      questionCount: 5,
      interviewType: 'Technical'
    },
    messages: [],
    totalQuestions: 5,
    attemptedQuestions: 5,
    averageScore: 9.0,
    percentage: 90,
    strongTopics: ['OOP Principles', 'Encapsulation', 'Primitive vs Reference'],
    weakTopics: ['HashMap Collision Handling'],
    overallFeedback: 'Excellent performance! Clear explanations of object-oriented concepts and memory stack/heap mechanics.',
    keyTakeaways: [
      'Review Hash contract equals() vs hashCode() in depth',
      'Practice explaining checked vs unchecked exceptions'
    ]
  }
];
