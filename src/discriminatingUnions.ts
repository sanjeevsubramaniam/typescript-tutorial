//Exzmple 1:
function flipCoin(): "heads" | "tails" {
    if (Math.random() > 0.5) return "heads" // the "heads" branch
    return "tails" // the "tails" branch
  }

  const success = ["success", { name: "Sanjeev", email: "ss@example.com"} ] as const;
  const fail = ["error", new Error("Something went wrong!") ] as const;


function maybeGetUserInfo() {
    if (flipCoin() === "heads") {
      return success
    } else {
      return fail
    }
  }

function callMaybeGetUserInfo(){
    const [first, second] = maybeGetUserInfo();

    if (first === "error") { // the first element acts as a tag and helps to identify the second element based on the branch       
        // In this branch of code, second is an Error

         console.log(second.message); // "Something went wrong"
         console.log(second instanceof Error); // true
        } else {
            // In this branch of code, second is the user info

            console.log(second.email) // "ss@example.com"
            console.log(second.name) // "Sanjeev"
        }
}

//Example 2:
type NetworkLoadingState = {
    state: "loading";
};
type NetworkFailedState = {
    state: "failed";
    code: number;
};
type NetworkSuccessState = {
    state: "success";
    response: {
      title: string;
      duration: number;
      summary: string;
    };
  };

// NetworkState represents only one of the above types
// but not sure which it is yet.
type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;

// Given the state field is common in every type inside NetworkState - it is safe for your code to access without an existence check.
declare function download(): NetworkState;

const response = download();
console.log(response.state);
console.log(response.response); //Errpr Property 'response' does not exist on type 'NetworkState'. Property 'response' does not exist on type 'NetworkLoadingState'.
console.log(response.code); //Errpr Property 'code' does not exist on type 'NetworkState'. Property 'code' does not exist on type 'NetworkLoadingState'.ts(2339)

//We can use state field as tag to allow the ts to infer the type automatically
function logger(downloadState: NetworkState){
    switch (downloadState.state) {
        case "loading":
          downloadState
          return "Downloading...";
        case "failed":
          // The type must be NetworkFailedState here,
          // so accessing the `code` field is safe
          return `Error ${downloadState.code} downloading`;
        case "success":
          // Simillarly the type must be NetworkSuccessState here,
          // so accessing the `response` field is safe
          return `Downloaded ${downloadState.response.title} - ${downloadState.response.summary}`;
      }
}