const axios = require('axios');

const LOG_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhcnlhbnNocml2YXN0YXZhNzg4QGdtYWlsLmNvbSIsImV4cCI6MTc1MjQ3NjYzNywiaWF0IjoxNzUyNDc1NzM3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNzNmYjU0NjEtNjRkMy00OTQ2LWJkMzgtNzkxYjdmOGFiNmY3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXJ5YW4gbmFyYXlhbiIsInN1YiI6Ijg5ODZmNjU5LTNmZWQtNDY4ZC1iNWMyLWQwZWI4MTc3ZDJiNyJ9LCJlbWFpbCI6ImFyeWFuc2hyaXZhc3RhdmE3ODhAZ21haWwuY29tIiwibmFtZSI6ImFyeWFuIG5hcmF5YW4iLCJyb2xsTm8iOiIxMjMwNDUxOCIsImFjY2Vzc0NvZGUiOiJDWnlwUUsiLCJjbGllbnRJRCI6Ijg5ODZmNjU5LTNmZWQtNDY4ZC1iNWMyLWQwZWI4MTc3ZDJiNyIsImNsaWVudFNlY3JldCI6Im1qQWVKQWZUZWFLWXRkcHQifQ.s25BFU4-MH2uJHw64BeA0iYl0EI4IFPlnbNczwtmBD4"; 

async function Log(stack, level, pkg, message) {
  try {
    const payload = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message,
    };

    await axios.post(LOG_ENDPOINT, payload, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("Logging API failed:", err.message);
  }
}

module.exports = Log;
