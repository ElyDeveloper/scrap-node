const httpFunction = require("../HttpTrigger1");
const context = require("./defaultContext");

test("Http trigger should return known text", async () => {
  //crear un objeto request
  const req = {
    query: { "url": "https://www.youtube.com/watch?v=ezvMHG-iuz0" },
  };
  await httpFunction(context, req);

  expect(context.log.mock.calls.length).toBe(1);
  expect(context.res.body).toEqual({
    message: "success",
  });
});