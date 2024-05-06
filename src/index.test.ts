import { printName } from "./index";

test("should print the name", () => {
  expect(printName("foobar")).toEqual("hello foobar");
});
