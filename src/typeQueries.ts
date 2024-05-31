// Example 1: keyof

type Point = { x: number; y: number };
type P = keyof Point; // P => "x" | "y"

const val: P = "x";
const val2: P = "z"; //Type '"z"' is not assignable to type 'keyof Point'.ts(2322)

//If the type has a string or number index signature, keyof will return those types instead

type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;

const b : A = "t"; // Error Type 'string' is not assignable to type 'number'.ts(2322)
const bb: A = 500;


type Mapish = { [k : string]: boolean };
type M = keyof Mapish;

let n: M = true;
let nn: M = "s";
let nnn: M = 5;

/*
 * Note that in this example, M is string | number — this is because JavaScript object keys are always 
 * coerced to a string, so obj[0] is always the same as obj["0"].
 * 
 * keyof types become especially useful when combined with mapped types, which we’ll learn more about later.
 */

// Example 2: typeof
console.log(typeof "Hello world"); // "string"
console.log(typeof [1]); // "object"
console.log(typeof null); // "object"

let ss = "hello";
let r: typeof ss; // let r: string

/* TypeScript intentionally limits the sorts of expressions you can use typeof on.
 * Specifically, it’s only legal to use typeof on identifiers (i.e. variable names) or their properties.
*/

//Example 3: Indexed Access Types
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"]; //type Age = number

type I11 = Person["age" | "name"]; // type I1 = string | number
 
type I2 = Person[keyof Person]; // type I2 = string | number | boolean
 
type AliveOrName = "alive" | "name"; 
type I3 = Person[AliveOrName]; //type I3 = string | boolean

type I1 = Person["alve"]; // Error Property 'alve' does not exist on type 'Person'.

