import jwt from "jsonwebtoken";

const TEST_USER = {
  email: "student@careerforge.dev",
  password: "careerforge123",
  name: "CareerForge Student"
};

export function login(req, res) {
  const { email, password } = req.body;

  if (email !== TEST_USER.email || password !== TEST_USER.password) {
    console.log("[WARN] POST /api/login 401 Unauthorized");
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign(
    { email: TEST_USER.email, name: TEST_USER.name },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  console.log("[INFO] POST /api/login 200 OK");
  console.log(`[INFO] Token generated for user: ${TEST_USER.email}`);

  return res.json({
    token,
    user: {
      email: TEST_USER.email,
      name: TEST_USER.name
    }
  });
}
