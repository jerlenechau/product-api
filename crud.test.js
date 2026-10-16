const test = require("node:test");
const assert = require("node:assert/strict");

const BASE_URL = "http://localhost:3000/api/products";
const pid = 910001;

test("Product API - CRUD", async () => {
  // 1. CREATE
  const createResponse = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pid,
      pname: "CI Test Product",
      price: 150000,
      quantity: 10
    })
  });

  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  assert.equal(created.data.pid, pid);

  // 2. READ
  const readResponse = await fetch(`${BASE_URL}/${pid}`);
  assert.equal(readResponse.status, 200);

  const readData = await readResponse.json();
  assert.equal(readData.data.pname, "CI Test Product");

  // 3. UPDATE
  const updateResponse = await fetch(`${BASE_URL}/${pid}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pname: "CI Updated Product",
      price: 200000,
      quantity: 15
    })
  });

  assert.equal(updateResponse.status, 200);

  const updated = await updateResponse.json();
  assert.equal(updated.data.pname, "CI Updated Product");
  assert.equal(updated.data.price, 200000);
  assert.equal(updated.data.quantity, 15);

  // 4. DELETE
  const deleteResponse = await fetch(`${BASE_URL}/${pid}`, {
    method: "DELETE"
  });

  assert.equal(deleteResponse.status, 200);

  // 5. VERIFY DELETE
  const verifyResponse = await fetch(`${BASE_URL}/${pid}`);
  assert.equal(verifyResponse.status, 404);
});