const s: NetworkFromCachedState = {
    state: "from_cache",
    id: "sss",
    response: {
        title: "string",
        duration: 3,
        summary: "string"
    }
}

//For example, if we add NetworkFromCachedState to NetworkState, we need to update logger as well:
type NetworkFromCachedState = {
    state: "from_cache";
    id: string;
    response: NetworkSuccessState["response"];
};

type _NetworkState = // adding an underscore to have multiple types in different files | this helps to segregate examples in different files
    | NetworkLoadingState
    | NetworkFailedState
    | NetworkSuccessState
    | NetworkFromCachedState;

function _logger(downloadState: _NetworkState) {
    switch (downloadState.state) {
        case "loading":
            return "Downloading...";
        case "failed":
            return `Error ${downloadState.code} downloading`;
        case "success":
            return `Downloaded ${downloadState.response.title} - ${downloadState.response.summary}`;
    }
}

console.log(_logger(s)); // undefimed


// Option 1 with return type and strictNullChecks turned on

function _logger2(downloadState: _NetworkState): string { //Error Function lacks ending return statement and return type does not include 'undefined'.ts(2366)
    switch (downloadState.state) {
        case "loading":
            return "Downloading...";
        case "failed":
            return `Error ${downloadState.code} downloading`;
        case "success":
            return `Downloaded ${downloadState.response.title} - ${downloadState.response.summary}`;
        default:
            return ""; // The error can be fixed just by adding a default return
    }
}
/*
 * Option 1: 
 * When we do not add return type explicitly _logger2 returns string | undefined
 * This prevents the compiler to report the missing case as undefined can accomodate for the missing case
 * So explicitly calling the return type as string will make the compiler cry for undefined type mismatch
 * But when we add a default case and return some default value then this can be fixed and compiler will never
 * check for exhaustiveness
 */


//Option 2: using the never type the compiler uses to check for exhaustiveness
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}
function _logger3(downloadState: _NetworkState): string { //Error Function lacks ending return statement and return type does not include 'undefined'.ts(2366)
    switch (downloadState.state) {
        case "loading":
            return "Downloading...";
        case "failed":
            return `Error ${downloadState.code} downloading`;
        case "success":
            return `Downloaded ${downloadState.response.title} - ${downloadState.response.summary}`;
        case "from_cache":
            return "something"
        default:
            return assertNever(downloadState); // Error Argument of type 'NetworkFromCachedState' is not assignable to parameter of type 'never'.ts(2345)

    }
}

/*
 * Option 2: 
 * When we add an never assertion NetworkFromCachedState case reaches the default and creates a type mismatch
 * so compiler will cry for it and help us ensure exhaustiveness
 * when we include a case for NetworkFromCachedState or remove it from the _NetworkState type then the switch
 * statement will become exhaustive and compiler will not complain
 * ptherwise it will always complain when any new type is added to the _NetworkState type
 */