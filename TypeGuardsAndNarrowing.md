### Type Guards and Narrowing
- TypeScript’s type system aims to make it as easy as possible to write typical JavaScript code without bending over backwards to get type safety.
- TypeScript sees a special conditional check and understands that as a special form of code called a **type guard**
- TypeScript follows possible paths of execution that our programs can take to analyze the most specific possible type of a value at a given position. 
- It looks at these special checks **(called type guards)** and assignments, and the process of refining types to more specific types than declared is called **narrowing**. In many editors we can observe these types as they change, and we’ll even do so in our examples.

#### `typeof` type guards
- JavaScript supports a `typeof` operator which can give very basic information about the type of values we have at runtime. TypeScript expects this to return a certain set of strings:
    - "string"
    - "number"
    - "bigint"
    - "boolean"
    - "symbol"
    - "undefined"
    - "object"
    - "function"
TypeScript can understand it to narrow types in different branches.
- In TypeScript, checking against the value returned by **typeof is a type guard**. Because TypeScript encodes how typeof operates on different values, it knows about some of its quirks in JavaScript. 

See Example 1 in [typeGuardsAndNarrowing.ts](./src/typeGuardsAndNarrowing.ts#L1)

##### Control Flow Analysis
- The analysis of code based on reachability is called **control flow analysis**, and TypeScript uses this flow analysis to narrow types as it encounters type guards and assignments.

#### Truthiness narrowing
- In JavaScript, `typeof null` is actually `"object"`. This is one of those unfortunate accidents of history.
- This might be a good segue into what we’ll call “truthiness” checking.
- In JavaScript, we can use any expression in conditionals, &&s, ||s, if statements, Boolean negations (!), and more.
- As an example, if statements don’t expect their condition to always have the type boolean.
- In JavaScript, constructs like if first **“coerce”** their conditions to booleans to make sense of them, and then choose their branches depending on whether the result is `true` or `false`. Values like
    - 0
    - NaN
    - "" (the empty string)
    - 0n (the bigint version of zero)
    - `null`
    - `undefined`
all coerce to `false`, and other values get coerced to `true`
- It’s fairly popular to leverage this behavior, especially for guarding against values like `null` or `undefined`

See Example 2 in [typeGuardsAndNarrowing.ts](./src/typeGuardsAndNarrowing.ts#L34)

#### Equality narrowing
- TypeScript also uses switch statements and equality checks like ===, !==, ==, and != to narrow types.
- Checking against specific literal values (as opposed to variables) works also.
- JavaScript’s looser equality checks with `==` and `!=` also get narrowed correctly. 
- Checking whether `something == null` actually not only checks whether it is specifically the value `null` - it also checks whether it’s potentially `undefined`.
- The same applies to `something == undefined`: it checks whether a value is either `null` or `undefined`

See Example 3 in [typeGuardsAndNarrowing.ts](./src/typeGuardsAndNarrowing.ts#L100)

#### The `in` operator narrowing
- JavaScript has an operator for determining if an object or its prototype chain has a property with a name: the in operator. 
- TypeScript takes this into account as a way to narrow down potential types.

See Example 4 in [typeGuardsAndNarrowing.ts](./src/typeGuardsAndNarrowing.ts#L162)

#### `instanceof` narrowing
- JavaScript has an operator for checking whether or not a value is an “instance” of another value. 
- More specifically, in JavaScript `x instanceof Foo` checks whether the prototype chain of x contains `Foo.prototype`
- instanceof is also a type guard, and TypeScript narrows in branches guarded by `instanceof`.

See Example 5 in [typeGuardsAndNarrowing.ts](./src/typeGuardsAndNarrowing.ts#L195)

#### Using type predicates
- We’ve worked with existing JavaScript constructs to handle narrowing so far, however sometimes you want more direct control over how types change throughout your code.
- To define a user-defined type guard, we simply need to define a function whose return type is a **type predicate**
- A predicate takes the form parameterName is Type, where parameterName must be the name of a parameter from the current function signature.

See Example 6 in [typeGuardsAndNarrowing.ts](./src/typeGuardsAndNarrowing.ts#L206)

##### Writing high-quality guards
- Type guards can be thought of as part of the “glue” that connects compile-time type-checking with the execution of your program at runtime. 
- It’s of great importance that these are designed well, as TypeScript will take you at your word when you make a claim about what the return value indicates.
- Common mistakes like forgetting about the possibilities of **strings and numbers being falsy** can create false confidence in the correctness of your code. **“Untruths” in your type guards will propagate quickly through your codebase and cause problems that are quite difficult to solve**.

See Example 7 in [typeGuardsAndNarrowing.ts](./src/typeGuardsAndNarrowing.ts#L250)

#### Reference
- [TS Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TS Training - Type guards and narrowing](https://www.typescript-training.com/course/fundamentals-v4/12-type-guards/)
- [freeCodeCamp.org - Learn TypeScript – Full Tutorial](https://www.youtube.com/watch?v=30LWjhZzg50&t=14836s)