//Example 1: Type Guard and Narrowing
function padLeft(padding: number | string, input: string): string {
    return " ".repeat(padding) + input; 
    // Error Argument of type 'string | number' is not assignable to parameter of type 'number'. Type 'string' is not assignable to type 'number'.ts(2345)
}
/*
* In the abpve padLeft function padding can be either number or string
* since String.repeat function expects a number parameter it cannot handle when the padding is string
* so it errors out
*/

function _padLeft(padding: number | string, input: string): string {
    
    if(typeof padding == "number"){ // type guard
        return " ".repeat(padding) + input; // (parameter) padding: number - type narrowed tp number (narrowing)
    }
    return padding + input; // (parameter) padding: string - type narrowed tp number (narrowing)
}

/*
* While it might not look like much, there’s actually a lot going on under the covers here. 
* Much like how TypeScript analyzes runtime values using static types, 
* it overlays type analysis on JavaScript’s runtime control flow constructs 
* like if/else, conditional ternaries, loops, truthiness checks, etc., which can all affect those types.
* 
* TS understands the type guard and narrow's the type to number in the if block
* and since the if block returns it understands that the line #16 is reachable 
* only if padding is a string and narrows it to a string.
*/


// Head back to ../TypeGuardsAndNarrowing.md - Truthiness narrowing section

//Example 2: Unfortunate accident of history

function printAll(strs: string | string[] | null) {
    if (typeof strs === "object") {
      //(parameter) strs: string[] | null
      for (const s of strs) { // Error 'strs' is possibly 'null'.ts(18047)
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    } else {
      // do nothing
    }
  }

  /* 
   * In the printAll function, we try to check if strs is an object to see if it’s an array type
   * In Javascript arrays are types of object and also typeof null is also object
   * So even though we have type guard it is still not sure at line #36 that strs is array.
   * So we need something more than a typeof type guard.
   */

  //Truthiness Narrowing
  function _printAll(strs: string | string[] | null) {
    if (strs && typeof strs === "object") {
      for (const s of strs) { //(parameter) strs: string[]
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
  /*
   * In the above example along with the typeof type guard we also have truthiness check on strs
   * so it elliminates the possiblity of strs being null and narrows it down to an string[]
   * and we are able to iterate over it without any issue.
   */

  //Keep in mind though that truthiness checking on primitives can often be error prone.
  
  function __printAll(strs: string | string[] | null) {
    // !!!!!!!!!!!!!!!!
    //  DON'T DO THIS!
    //   KEEP READING
    // !!!!!!!!!!!!!!!!
    if (strs) {
      if (typeof strs === "object") {
        for (const s of strs) {
          console.log(s);
        }
      } else if (typeof strs === "string") {
        console.log(strs);
      }
    }
  }

  __printAll("") // logs nothing
  
  /*
   * We wrapped the entire body of the function in a truthy check, but this has a subtle downside: 
   * we may no longer be handling the empty string case correctly. Since "" coerce to flase 
   * it fails the main condition and exits the function without logging anything.
   */

// Head back to ../TypeGuardsAndNarrowing.md - Equality narrowing

// Example 3: Equality narrowing
function example(x: string | number, y: string | boolean) {
    if (x === y) {
      // We can now call any 'string' method on 'x' or 'y'.
      x.toUpperCase(); // (parameter) x: string            
      y.toLowerCase(); // (parameter) y: string
    } else {
      console.log(x);   // (parameter) x: string | number
      console.log(y);   // (parameter) y: string | boolean       
    }
  }

  /* When we checked that x and y are both equal in the above example, 
   * TypeScript knew their types also had to be equal. 
   * Since string is the only common type that both x and y could take on, 
   * TypeScript knows that x and y must be strings in the first branch.
   * 
   * Note: In the else branch x and y still can be string, x !== y still doesnt gurantee
   * x and y are not string.
   */

  //Literal Value checking

  /*
   * In our section about truthiness narrowing, we wrote a printAll function which was error-prone 
   * because it accidentally didn’t handle empty strings properly. 
   * Instead we could have done a specific check to block out nulls, 
   * and TypeScript still correctly removes null from the type of strs.
   */

  function ___printAll(strs: string | string[] | null) {
    if (strs !== null) { // "" !== null => false
      if (typeof strs === "object") {
        for (const s of strs) { //(parameter) strs: string[]
          console.log(s);
        }
      } else if (typeof strs === "string") { //(parameter) strs: string
        console.log(strs);
      }
    }
  }

  __printAll("") // ""


  //Looser Equality check
  interface Container {
    value: number | null | undefined;
  }
   
  function multiplyValue(container: Container, factor: number) {
    // Remove both 'null' and 'undefined' from the type.
    if (container.value != null) { //(property) Container.value: number | null | undefined
      console.log(container.value); // (property) Container.value: number
   
      // Now we can safely multiply 'container.value'.
      container.value *= factor;
    }
  }
  
// Head back to ../TypeGuardsAndNarrowing.md - The in Operator Narrowing
  
//Example 4: The in Operator Narrowing

type Fish = { swim: () => void };
type Bird = { fly: () => void };
 
function move(animal: Fish | Bird) {
  if ("swim" in animal) { //(parameter) animal: Fish | Bird
    return animal.swim(); //(parameter) animal: Fish
  }
  return animal.fly(); //(parameter) animal: Bird
}

/*
   * with the code: "swim" in animal. 
   * The “true” branch narrows animal’s type to Fish
   * and the “false” branch narrows to type Bird, since Fish as swim
   * and Bird dosen't
   */

//Optional properties will exist in both sides for narrowing.

type Human = { swim?: () => void; fly?: () => void };
 
function _move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    animal; //(parameter) animal: Fish | Human
  } else {
    animal; //(parameter) animal: Bird | Human
  }
}

// Head back to ../TypeGuardsAndNarrowing.md - instanceof Narrowing
  
//Example 5: instanceof Narrowing
function logValue(x: Date | string) {
    if (x instanceof Date) { //(parameter) x: string | Date
      console.log(x.toUTCString()); // (parameter) x: Date
    } else {
      console.log(x.toUpperCase());// (parameter) x: string
    }
  }

// Head back to ../TypeGuardsAndNarrowing.md - Using type predicates
  
//Example 6: Using type predicates
  
function isFish(pet: Fish | Bird) {
    return (pet as Fish).swim !== undefined;
}

function movePet(pet: Fish | Bird){
    if(isFish(pet)){
        pet; //(parameter) pet: Fish | Bird
        console.log("is pet a fish? and can it swim?");
    }else{
        pet; //(parameter) pet: Fish | Bird
        console.log("is pet a bird and can it fly?");
    }
}

/*
 * Even though we added a isFish() check type script was still not able to narrow
 * the type in both the branch this because the function just returns a boolean value
 * and TS is not sure of it being a type guard. To make the condition as type guard
 * we should make the isFish() function a type predicate by returning a type predicate
 */

function _isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

function _movePet(pet: Fish | Bird){
    if(_isFish(pet)){
        pet.swim(); //(parameter) pet: Fish
        console.log("pet is fish and it swim");
    }else{
        pet.fly(); //(parameter) pet: Bird
        console.log("pet is a bird and it fly");
    }
}

/*
 * Notice that TypeScript not only knows that pet is a Fish in the if branch; 
 * it also knows that in the else branch, you don’t have a Fish, so you must have a Bird.
 */

// Head back to ../TypeGuardsAndNarrowing.md - Writing high-quality guards

//Example 7: Bad example of a type guard
function isNull(val: any): val is null {
    return !val
  }
   
  function _test(){
    const empty = ""
    const zero = 0
    if (isNull(zero)) {
        console.log(zero) // const zero: never
    }
    if (isNull(empty)) {
        console.log(empty) // const empty: never 
    }
  }

  /*
   * Notice how TS assumes variables in log statements to be never
   * This is because the predicate promises that on true the value is null
   * And from the assignment TS understands the values are not null and therefore
   * the lgg statements are never reachable.
   * 
   * But unfortunately the predicate is a bad predicate it ignores falsy values and promises them
   * as null.
   */