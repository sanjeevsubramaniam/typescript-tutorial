import { Product } from "./refrence/Product";
import { ProductFetchFailure } from "./refrence/ProductFetchFailure";

type Evens =  2  | 4 | 6 | 8;
type OneThroughFive = 1 | 2 | 3 | 4 | 5; 

//Example Union
function printEvenOrOneThroughFive(num:  OneThroughFive | Evens){ //(parameter) num: 2 | 4 | 6 | 8 | 1 | 3 | 5
    console.log(num);
}

printEvenOrOneThroughFive(1); //1
printEvenOrOneThroughFive(4); //4
printEvenOrOneThroughFive(8); //8
printEvenOrOneThroughFive(7); //Error Argument of type '7' is not assignable to parameter of type '1 | 2 | 3 | 4 | 5 | 6 | 8'.ts(2345)
printEvenOrOneThroughFive(10); //Error Argument of type '10' is not assignable to parameter of type '1 | 2 | 3 | 4 | 5 | 6 | 8'.ts(2345)

//Example Intersection
function printEvenAndOneThroughFive(num:  OneThroughFive & Evens){ //(parameter) num: 2 | 4
    console.log(num);
}

printEvenAndOneThroughFive(2); //2
printEvenAndOneThroughFive(4); //4
printEvenAndOneThroughFive(8); //Error Argument of type '8' is not assignable to parameter of type '2 | 4'.ts(2345)
printEvenAndOneThroughFive(1); //Error Argument of type '1' is not assignable to parameter of type '2 | 4'.ts(2345)
printEvenAndOneThroughFive(3); //Error Argument of type '3' is not assignable to parameter of type '2 | 4'.ts(2345)


/*
* Practical usecase for Union type
*
* While fetching from an API it is common that 
* we may end up with scccess scenario returning the entity 
* or different error scenarios where we return error 
* so the return type will be either the entity or a failure
* 
* In this below example the function will either return a Product on success 
* or ProductFetchFailure on failure
* sp the return type is Promise<Product | ProductFetchFailure>
*/

const BASE_URL = 'https://equalexperts.github.io';
const PATH = '/backend-take-home-test-data/{product}.json';

const PAGE_NOT_FOUND = 404;
const HTTP_OK = 200;

 
const fetchProductByName = async (name: string): Promise<Product | ProductFetchFailure> => {
    const response = await fetch(BASE_URL + PATH.replace("{product}", name));
     
    switch (response.status) {
        case HTTP_OK:
         const productJSON = await response.json();
         return  new Product(name, productJSON.price, productJSON.title);
        
        case PAGE_NOT_FOUND:
            return {message: `Product ${name} not found`, code: 404}
      
        default:
            return {message: 'Internal failure', code: response.status}
    };
}

//Practical usecase Intersection
//A new type can be created by combining existing type

type cardNumber = {
    cardnumber : string;
}

type cardDate = {
    expiryDate: string;
}

type cardDetails = cardNumber & cardDate & {
    cvv: number
}


declare function printCard(card: cardDetails): void;

printCard({cardnumber: "333 444 555"}); // Errpr Argument of type '{ cardnumber: string; }' is not assignable to parameter of type 'cardDetails'. Property 'expiryDate' is missing in type '{ cardnumber: string; }' but required in type 'cardDate'.ts(2345)
printCard({expiryDate: "04/05/2025"}); // Errpr Argument of type '{ expiryDate: string; }' is not assignable to parameter of type 'cardDetails'. Property 'cardnumber' is missing in type '{ expiryDate: string; }' but required in type 'cardNumber'.ts(2345)

printCard({
    cardnumber: "333 444 555",
    expiryDate: "04/05/2025",
    cvv: 3456
});



//Unions with Common Fields
interface Bird {
    fly(): void;
    layEggs(): void;
  }
   
  interface Fish {
    swim(): void;
    layEggs(): void;
  }
   
  declare function getSmallPet(): Fish | Bird;
   
  let pet = getSmallPet();
  pet.layEggs();
   
  // Only available in one of the two possible types
  pet.swim(); // Error Property 'swim' does not exist on type 'Fish | Bird'. Property 'swim' does not exist on type 'Bird'.ts(2339)